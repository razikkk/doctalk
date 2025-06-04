import React, { useState } from 'react'
import doctor from '../../assets/doctor.jpeg'
import { useNavigate } from 'react-router-dom';
import { doctorSignUp, googleLogin } from '../../utils/doctorAuth';
import { Toaster,toast } from 'sonner';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Redux/doctorSlice/doctorSlice';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithCredential } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const DoctorRegister = () => {
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error,setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  

  const handleRegister = async(event: React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
    setLoading(true)
    setErrors({ name: "", email: "", password: "", confirmPassword: "" });

    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let hasError = false;

    if (!name) {
      newErrors.name = "Name is required";
      hasError = true;
    }else if (!/^[A-Za-z0-9]+$/.test(name)) {
        newErrors.name = "Name can only contain alphabets and numbers";
        hasError = true;
      }

    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/^[A-Za-z0-9._%+-]+@(gmail\.com|.*\.com)$/.test(email)) {
        newErrors.email = "Email must be in a valid format (e.g., example@gmail.com or example@domain.com)";
        hasError = true;
      }
      
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (!/.{6,}/.test(password)) {
        newErrors.password = "Password must be at least 6 characters long";
        hasError = true;
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
      hasError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
        const response = await doctorSignUp({name,email,password,role:'doctor'})

        setLoading(false)
        console.log(response,"respoe")
        
        if(response.success && response.result?.doctor?.email){
            const doctorData = {
                email: response.result?.doctor?.email,
                name: response.result?.doctor?.name,
                password: password, 
            };
            console.log(doctorData)
            
            localStorage.setItem("doctor", JSON.stringify(doctorData));

            sessionStorage.setItem("newDoctor","true")
            
            const doctorId = response.result.doctor._id || response.result.doctor.uid || response.result.doctor.id
            if(!doctorId){
              throw new Error("doctor ID is missing in response.");
            }
            const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db,"doctors",firebaseUser.user.uid),{
              name:response.result.doctor.name,
              email:response.result.doctor.email,
              role:"doctor",
              mongoId:response.result.doctor._id,
              createdAt: new Date()
          })

            setLoading(false)
            toast.info("please Enter the Otp",{duration:1000})            
            setTimeout(()=>navigate('/doctor/otp'),2000)

        }if (response.message === "email already exists") {
            toast.error("Email already exists");
          } else {
            toast.error("Registration failed");
          }
        
    } catch (error) {
        console.log(error)
        setLoading(false)
    }

  }

  const handleGoogleLogin = async(credentialResponse:CredentialResponse)=>{
    try {
      if(credentialResponse.credential){
        const doctorData = await googleLogin(credentialResponse.credential,'register')

        const firebaseCredential = GoogleAuthProvider.credential(credentialResponse.credential)
        const firebaseUser = await signInWithCredential(auth,firebaseCredential)

               

        await setDoc(doc(db,"doctors",firebaseUser.user.uid),{
          name:firebaseUser.user.displayName,
          email:firebaseUser.user.email,
          role:"doctor",
          mongoId : doctorData?.doctor?._id,
          createdAt: new Date()
      })
        console.log(doctorData)
        if(doctorData && doctorData.token && doctorData.doctor){
          dispatch(loginSuccess({
            doctorAccessToken: doctorData.token,doctorId:doctorData.doctor._id
          }))
          

          const doctor = {
            email:doctorData.doctor.email,
            name:doctorData.doctor.name,
            password:""
          }
          localStorage.setItem("doctor", JSON.stringify(doctor));
          localStorage.setItem("isGoogleLogin","true")

          console.log(doctorData.isActive,'is')
          if(doctorData.isActive!=='approved'){
            setTimeout(()=>{
              navigate('/doctor/verification/step1')
          },100)
          }else{
            toast.error("already logined")
            setTimeout(()=>{
              navigate('/doctor/dashboard')
            },1000)
          }
          
        }
        
        else{
          setError(doctorData.message)
        }

      }
    } catch (error:any) {
      console.log(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
   <Toaster/>
        <div className="flex items-center space-x-10 bg-white p-10 shadow-lg rounded-xl">
          <div className="w-[300px] h-auto">
            <img className="w-full h-auto rounded-[20px]" src={doctor} alt="service image" />
          </div>

          <div className="w-[450px] h-auto bg-white shadow-lg rounded-lg py-10 px-6">
            <h1 className="text-center text-2xl font-bold text-[#157B7B] mb-5">Sign Up</h1>
            

            <form  className="space-y-4" onSubmit={handleRegister}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                className={`w-full p-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full p-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full p-2 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full p-2 border rounded-lg ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

              <button
  type="submit"
  className={`w-full px-4 py-2 font-bold rounded-lg flex items-center justify-center transition ${
    loading ? "bg-[#126666] text-gray-200" : "bg-[#157B7B] text-white"
  }`}
  disabled={loading}
>
  Sign Up
  {loading && (
    <span className="ml-2 animate-pulse text-lg">.</span>
  )}
  {loading && (
    <span className="animate-pulse text-lg">.</span>
  )}
  {loading && (
    <span className="animate-pulse text-lg">.</span>
  )}
</button>
            </form>

            <div className="form-switch text-center mt-4">
              <p>
                Already have an account? 
                <span onClick={() => navigate("/doctor/login")} className="text-[#157B7B] cursor-pointer font-bold"> Sign In</span>
              </p>
            </div>
            {error&& <span className='error text-red-500'>{error}</span>}

            <GoogleLogin onSuccess={handleGoogleLogin} onError={()=>console.log("error occured")}/>
            <div className="text-right mt-4">
        <p className="text-[#157B7B] text-xs font-medium">Powered by Doctalk</p>
      </div>
          </div>
        </div>
      
    </div>
  );
}

export default DoctorRegister