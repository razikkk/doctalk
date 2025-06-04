import React, { useEffect, useState } from "react";
import doctor from "../../src/assets/registerDoctor.jpeg"; 
import { useNavigate } from "react-router-dom";
import { googleSignIn, signIn } from "../utils/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "../Redux/userSlice/userAuthSlice";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import API from "../utils/api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("")

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogin = async(e:React.FormEvent)=>{
    e.preventDefault()
    try {
        const response = await signIn({email,password})
        console.log("login response",response)

        if(response.success){
          // if(response.isBlocked){
          //   setError("Your account is blocked. Please contact support.")
          //   return
          // }
          //   localStorage.setItem("accessToken", response.accessToken);
          //   localStorage.setItem("userId", response.user._id); 
          await signInWithEmailAndPassword(auth, email, password);
            dispatch(
                login({
                    token:response.accessToken,
                    userId:response.user._id,
                    role:response.user.role
                })
            )
            navigate('/dashboard')
        }else{
            setError(response.message)
            console.log("response error",response.message)
        }
    } catch (error:any) {
        setError("Something went wrong")
        console.log(error.message)
    }
  }
  useEffect(() => {
    const token = Cookies.get("accessToken")
    const userId = localStorage.getItem("userId")
    const role = localStorage.getItem("role")
    
    if (token && userId && role) {
        // Check if token is valid and user is not blocked before auto-login
        const verifyStoredToken = async () => {
            try {
                const verifyResponse = await API.post('/verify-token', { token })
                
                if (verifyResponse.data.valid && !verifyResponse.data.isBlocked) {
                    dispatch(login({token, userId, role}))
                    navigate('/dashboard')
                } else {
                    // Clear invalid or blocked user data
                    Cookies.remove("accessToken")
                    localStorage.removeItem("userId")
                    localStorage.removeItem("role")
                    dispatch(logout())
                    navigate('/login')
                    if (verifyResponse.data.isBlocked) {
                        setError("Your account is blocked. Please contact support.")
                        return
                    }
                }
            } catch (error) {
                // Handle verification error
                Cookies.remove("accessToken")
                localStorage.removeItem("userId")
                localStorage.removeItem("role")
                setError("Session expired. Please log in again.")
            }
        }
        
        verifyStoredToken()
    }
}, [dispatch, navigate])
    
const handleGoogleLogin = async(credentialResponse:CredentialResponse)=>{
  console.log('fddsa')
  try {
    if(credentialResponse.credential){
      const userData = await googleSignIn(credentialResponse.credential)
      console.log(userData,'dt')
      if(userData && userData.token && userData.user){
        dispatch(
          login({
            token: userData.token,
            userId : userData.user._id,
            role: userData.user.role
          })
        )
        // localStorage.setItem("token",userData.token)
        // console.log("Authentication successful, token set:", userData.token);

        setTimeout(()=>{
          console.log("redirecting to dashboardddddd")
          navigate('/dashboard')
        },100)
      console.log("done",userData)
      }else{
        console.log("usr data is null skipped navigation",userData)
        setError(userData.message)
      }
    }
  } catch (error:any) {
    toast.error("your account is not reachable",{duration:1000})
    console.log(error.message,'hh')
  }
}
    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
            </button>
            <GoogleLogin onSuccess={handleGoogleLogin} onError={()=>console.log("error occured")}/>
          </form>

          <div className="form-switch text-center mt-4">
            <p>
              Don't have an account? 
              <span onClick={() => navigate("/register")} className="text-[#157B7B] cursor-pointer font-bold"> Sign Up</span>
            </p>
          </div>
          <div className="text-right mt-4">
        <p className="text-[#157B7B] text-xs font-medium">Powered by Doctalk</p>
      </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
