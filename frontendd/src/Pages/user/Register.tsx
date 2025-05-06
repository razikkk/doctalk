import React, { useState } from "react";
import doctor from "../../assets/registerDoctor.jpeg"; 
import { useNavigate } from "react-router-dom";
import { googleSignIn, signUp } from "../../utils/auth";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Toaster,toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/userSlice/userAuthSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({ name: "", email: "", password: "", confirmPassword: "" });

    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let hasError = false;

    if (!name) {
      newErrors.name = "Name is required";
      hasError = true;
    } else if (!/^[A-Za-z0-9]+$/.test(name)) {
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
    } else if (!/.{6,}/.test(password)){
      newErrors.password = "Password must be 6 characters"
      hasError = true
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
      const response = await signUp({ name, email, password, role: "user" });
      if (response.success && response.result?.user?.email) {
        localStorage.setItem("email", response.result?.user?.email);

        sessionStorage.setItem("newUser","true") // for resend otp to reset the timer
        setLoading(false);
        toast.info("please Enter otp",{duration:1000})
        setTimeout(() => navigate("/verify-otp"), 2000);
      } else {
        setLoading(false);
        toast.error(response.message,{duration:1000})
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

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
        }
      }
    } catch (error:any) {
      toast.error("your account is not reachable",{duration:1000})
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
            <form onSubmit={handleRegister} className="space-y-4">
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
            <GoogleLogin onSuccess={handleGoogleLogin} onError={()=>console.log("error occured")}/>

            <div className="form-switch text-center mt-4">
              <p>
                Already have an account? 
                <span onClick={() => navigate("/login")} className="text-[#157B7B] cursor-pointer font-bold"> Sign In</span>
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

export default Register;
