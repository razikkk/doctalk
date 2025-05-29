import React, { useRef,useEffect, useState, useCallback } from "react";
import landingPage from '../../assets/landingPage.png'
import logo from '../../assets/logodoctalk.png'
import CardLandingPage from "../../Components/CardLandingPage";
import DoctorCard from "../../Components/DoctorCard";
import TestimonialCard from "../../Components/TestimonialCard";
import HowItWorks from "../../Components/HowItWorks";
import footer from '../../assets/footerImg.png'
import { useNavigate } from "react-router-dom";
import {FaUserCircle} from 'react-icons/fa'
import { useDispatch } from "react-redux";
import { login, logout } from "../../Redux/userSlice/userAuthSlice";
import { Toaster } from "sonner";
import { fetchDoctors } from "../../utils/auth";
import {userLogout} from '../../utils/auth'
import Footer from "../../Components/UserFooter";

type Doctors = {
  _id:string,
  name:string,
  specialization:{
    name:string
  },
  imageUrl:string,
  experience:number,
  gender:string
}

const UserDashboard = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tokenChecked = useRef(false)
    const [doctors,setDoctors] = useState<Doctors[]>([])
    const [isOpen,setIsOpen] = useState(false)
    // useEffect(() => {
    //     // Prevent multiple initializations
    //     if(tokenChecked.current) return;
    //     tokenChecked.current = true;
    //     console.log('hy')
    
    //     const verifyToken = async () => {
    //         try {
    //           console.log('hd')
    //             const token = Cookies.get("accessToken");
    //             console.log(token,'token')
    //             if (!token) {
    //                 dispatch(logout());
    //                 navigate('/login');
    //                 return;
    //             }
                
                
    //             try {
    //                 const response = await API.post('/verify-token', { token });
    //                 const data = response.data;
                    
                   
    //                 if (!data.valid || data.isBlocked) {
    //                     dispatch(logout());
                        
                        
    //                     if (data.isBlocked) {
    //                         alert("Your account has been blocked. Please contact support.");
    //                     }
    //                     navigate('/login');
    //                 } else {
    //                     dispatch(login({ token, userId: data.userId, role: data.role }));
    //                 }
    //             } catch (axiosError:any) {
    //                 // Handle different error status codes
    //                 if (axiosError.response) {
    //                     const status = axiosError.response.status;
                        
    //                     if (status === 403) {
    //                         // 403 Forbidden - User is likely blocked
    //                         dispatch(logout());
    //                         toast.error("Your account has been blocked or your session is invalid. Please contact support.");
    //                         setTimeout(()=>{

    //                             navigate('/login');
    //                         },2000)
    //                     } else {
    //                         // Other API errors
    //                         dispatch(logout());
    //                         navigate('/login');
    //                     }
    //                 } else {
    //                     // Network errors
    //                     console.error("Network error during token verification");
    //                     dispatch(logout());
    //                     navigate('/login');
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Token verification failed:", error);
    //             dispatch(logout());
    //             navigate('/login');
    //         }
    //     };
        
    //     // first verification
    //     verifyToken();
        
    //     // Set up interval for periodic verification
    //     const intervalId = setInterval(verifyToken, 60000);
        
    //     return () => clearInterval(intervalId);

    // }, [navigate, dispatch]);


   
   
    const handleLogout = async()=>{
      const response = await userLogout()
      if(response.success){
        dispatch(logout())
        navigate('/login')
      }else{
        console.log(response.error.message)
      }

    }
    //sliding carousel
    const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef?.current?.scrollBy({ left: -320, behavior: "smooth" }); // Adjust scroll amount if needed
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };
  

    //animation
    const cardRefs = useRef<HTMLDivElement[]>([]);
    // Add a new card to the array
    const addCardRef = useCallback((el:HTMLDivElement) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    }, []); 
  
    useEffect(() => {
      // Intersection Observer setup
      const options = {
        root: null, // use the viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // 50% of the element must be visible
      };
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      }, options);
  
      // Observe each card element
      cardRefs.current.forEach(card => observer.observe(card));
  
      return () => {
        observer.disconnect();
      };
    }, []);

    useEffect(()=>{
      const fetchAllDoctors = async()=>{
        try {
          const response = await fetchDoctors()
          console.log(response,'redss')
          if(response?.data.success){
            setDoctors(response.data.doctor)
          }
        } catch (error:any) {
          console.log(error.message)
          console.log(error?.response?.status,'sta')
          if(error?.response?.status === 403){
            
            setTimeout(()=>{
              dispatch(logout())
            },1000)
          }
        }
      }
      fetchAllDoctors()
    },[])

    

  return (
    
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${landingPage})`}}>
     
        <Toaster/>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-5 py-4 flex justify-between items-center text-white z-10">
        {/* Logo Placeholder */}
        <div className="mt-[-10px]"><img className="h-16 " src={logo} alt="" /></div>
        
        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer" onClick={()=>navigate('/user/doctors')}>Doctors</li>
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer">Contact</li>
        </ul>
        

        {/* Signup Button */}
        <div className="relative">
        
        <FaUserCircle size={26} color="white" className="cursor-pointer" onClick={()=>setIsOpen(!isOpen)}/>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
          <ul className="py-2 text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>navigate('/user/profile')}>Profile</li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
        )}
        </div>
      </nav>
      
     

      
      {/* Services Section */}
      <div className="absolute top-[100vh] left-10 w-full">
        <h2 className="text-3xl font-semibold p-10 flex justify-center text-[#157B7B]">SERVICES</h2>
      </div>

      {/* Card Section */}
      <div className="relative top-[120vh] left-10 w-full flex flex-wrap ml-6 gap-5 ">
      <div ref={addCardRef} className="card-animation">
          <CardLandingPage />
        </div>
        <div ref={addCardRef} className="card-animation">
          <CardLandingPage />
        </div>
        <div ref={addCardRef} className="card-animation">
          <CardLandingPage />
        </div>
        <div ref={addCardRef} className="card-animation">
          <CardLandingPage />
        </div>
        <div ref={addCardRef} className="card-animation">
          <CardLandingPage />
        </div>
        <div ref={addCardRef} className="card-animation">
          <CardLandingPage />
        </div>
        
        

      <div className="w-full mt-20 flex justify-center">
  <h2 className="text-3xl font-semibold text-[#157B7B]">Meet Our Doctors</h2>
       </div>
       <div className="relative w-[90%] mx-auto flex items-center justify-center mt-10">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="bg-white shadow-lg p-3 rounded-full absolute left-[-30px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#157B7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex overflow-hidden scroll-smooth w-full py-10" ref={carouselRef}>
          <div className="flex flex-nowrap gap-5 ml-[-10px]">
            {/* {[...Array(4)].map((_, index) => (
              <div key={index} className="w-[300px] flex-shrink-0">
                <DoctorCard />
              </div>
            ))} */}
            {
              doctors.map((doc)=>(
                <DoctorCard key={doc._id} doctor={doc}/> //parent and passing data to card (child)
              ))
            }
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="bg-white shadow-lg p-3 rounded-full absolute right-[10px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#157B7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      </div>

      <div className="w-full mt-260 flex justify-center ml-5 ">
  <h2 className="text-3xl font-semibold text-[#157B7B]">What Our Patients Say</h2>
       </div>
       <div className="relative left-10 w-full flex flex-wrap ml-6 gap-5">
        {
            [...Array(3)].map((_, index)=>(
                <div className="mr-10 py-10" key={index}>

                    <TestimonialCard/>
                </div>
            ))
        }
        
       </div>
       <div className="w-full mt-25 flex justify-center ml-5 ">
  <h2 className="text-3xl font-semibold text-[#157B7B]">How It Works</h2>
       </div>
      <div>
        <HowItWorks/>
      </div>
        <div className="mt-20">

     <Footer/>
        </div>
    </div>
    

  );
};

export default UserDashboard;
