import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import doctor from '../../assets/doctor.jpeg'
import { googleLogin, login } from '../../utils/doctorAuth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Redux/doctorSlice/doctorSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Toaster, toast } from 'sonner';



const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const token = useSelector((state:RootState)=>state.doctorAuth.token)
  useEffect(()=>{
    if(token){
      setTimeout(() => {
        navigate('/doctor/dashboard', { replace: true });
      }, 0);
    }
  },[token,navigate])

  const handleLogin = async(e:React.FormEvent<HTMLFormElement>)=>{ // form aayon form type pne html formine aan trigger cheynath so htmlFormelement
    e.preventDefault()
    try {
        const response = await login({email,password})
        console.log(response)
        if(response.success){
          
            dispatch(loginSuccess({doctorAccessToken:response.doctorAccessToken,doctorId:response.doctor._id}))
            console.log("navigatinnggg")
            setTimeout(()=>{

              navigate('/doctor/dashboard')
            },100)
            
        }else{
            setError(response.message)
        }
    } catch (error:any) {
        console.log(error.message)
    }
  }

  const handleGoogleLogin = async(credentialResponse:CredentialResponse)=>{
    try {
      if(credentialResponse.credential){
        const doctorData = await googleLogin(credentialResponse.credential,'login')
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
          

          setTimeout(()=>{
            navigate('/doctor/dashboard')
          },100)
        }
        
        else{
          if(doctorData.message === "Doctor not found"){
            toast.error("No account found. Please register")
            setTimeout(()=>{ 
              navigate('/doctor/register')
            },2000)
          }else{

            setError(doctorData.message)
          }
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
          <h1 className="text-center text-2xl font-bold text-[#157B7B] mb-5">Sign In</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#157B7B] focus:outline-none"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#157B7B] focus:outline-none"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="w-full px-4 py-2 bg-[#157B7B] text-white font-bold rounded-lg hover:opacity-80">
              Sign In
            </button >
          </form>

          <div className="form-switch text-center mt-4">
            <p>
              Don't have an account? 
              <span onClick={() => navigate("/doctor/register")} className="text-[#157B7B] cursor-pointer font-bold"> Sign Up</span>
            </p>
          </div>
          {/* {error && <span className='error text-red-500'>{error}</span>} */}
          <GoogleLogin onSuccess={handleGoogleLogin} onError={()=>console.log("not okay")} />
          <div className="text-right mt-4">
        <p className="text-[#157B7B] text-xs font-medium">Powered by Doctalk</p>
      </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorLogin