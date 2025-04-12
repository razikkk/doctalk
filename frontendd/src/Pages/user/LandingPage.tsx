import React, { useRef,useEffect, useState } from "react";
import landingPage from '../../assets/landingPage.png'
import logo from '../../assets/logodoctalk.png'
import CardLandingPage from "../../Components/CardLandingPage";
import DoctorCard from "../../Components/DoctorCard";
import TestimonialCard from "../../Components/TestimonialCard";
import HowItWorks from "../../Components/HowItWorks";
import footer from '../../assets/footerImg.png'
import { useNavigate } from "react-router-dom";
import {FaUserCircle} from 'react-icons/fa'
import { fetchDoctors } from "../../utils/auth";

type Doctor = {
  _id:string,
  name:string,
  specialization:{
    name:string
  }
  imageUrl:string,
  experience:number
}

const LandingPage = () => {
    const [isLogined,setIsLogined] = useState(false)
    const [isHovered,setIsHovered] = useState(false)
    const [doctors,setDoctors] = useState<Doctor[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        const token = localStorage.getItem("accessToken")

        if(token){
            fetch('http://localhost:3000/api/users/verify-token',{
                method:'POST',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({token})
            })
            .then((res)=>res.json())
            .then((data:any)=>{
                console.log(data,'dfd')
                if(data.valid){
                    navigate('/dashboard')
                }else{
                    localStorage.removeItem("accessToken")
                    setIsLogined(false)
                }
                console.log("state changed",setIsLogined)
            })
            .catch(()=>setIsLogined(false))
        }
    },[])

    
    //sliding carousel
    const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" }); // Adjust scroll amount if needed
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
    const addCardRef = (el: HTMLDivElement | null) => {
      if (el && !cardRefs.current.includes(el)) {
        cardRefs.current.push(el);
      }
    };
  
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
        const response = await fetchDoctors()
        try {
          
          if(response?.data.success){
            setDoctors(response?.data.doctor)
          }
        } catch (error:any) {
          console.log(error.message)
        }

        }
        fetchAllDoctors()
      },[])
    


  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${landingPage})`}}>
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
      
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-5 py-4 flex justify-between items-center text-white z-10">
        {/* Logo Placeholder */}
        <div className="mt-[-10px"><img className="h-16 " src={logo} alt="" /></div>
        
        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer">Doctors</li>
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer">Contact</li>
        </ul>
        

        {/* Signup Button */}
        <div>
    
        <button className="px-4 py-2 bg-white rounded-lg hover:opacity-80 text-[#157B7B]" onClick={()=>navigate('/selectField')}>Sign Up</button>
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

        <div className="flex overflow-hidden scroll-smooth w-full py-10 flex-wrap gap-5" ref={carouselRef}>
          <div className="flex flex-nowrap gap-5 ml-[-10px]">
            
                {
                  doctors.map((doc)=>(
              <div  className="w-[300px] flex-shrink-0">
                    

                    <DoctorCard key={doc._id} doctor={doc} />
              </div>
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
                <div className="mr-10 py-10">

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

      <div className="flex justify-center pt-30">
        <img className=" w-full max-w-[1300] h-100" src={footer} alt="fg" />
      </div>
    </div>
    

  );
};

export default LandingPage;
