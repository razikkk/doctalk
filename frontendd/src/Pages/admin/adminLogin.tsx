import React, { useEffect, useState } from "react";
import doctor from "../../assets/adminDoctor.jpeg"; 
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminSignIn } from "../../utils/adminAuth";
import { adminLogin } from "../../Redux/adminSlice/adminAuthSlice";
import Cookies from "js-cookie";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

    //for preventing logged admin back to login page
  useEffect(()=>{
    const adminToken = Cookies.get("adminAccessToken")
    if(adminToken){
      setTimeout(()=>{
        
        navigate('/admin/dashboard')
      },10)
    }
  },[])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await adminSignIn({ email, password });
      
      if (response.success) {
        Cookies.set("adminAccessToken", response.accessToken);
        localStorage.setItem("adminId", response.user._id);
        localStorage.setItem("role",response.user.role)

        dispatch(adminLogin({ token: response.accessToken, adminId: response.user._id, role:response.user.role }));
        navigate("/admin/dashboard",{replace:true});
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center space-x-10 bg-white p-10 shadow-lg rounded-xl">
        <div className="w-[300px] h-auto">
          <img className="w-full h-auto rounded-[20px]" src={doctor} alt="service image" />
        </div>

        <div className="w-[450px] h-auto bg-white shadow-lg rounded-lg py-10 px-6">
          <h1 className="text-center text-2xl font-bold text-[#157B7B] mb-5">Admin Login</h1>
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
              Login
            </button>
            <div className="text-right mt-4">
        <p className="text-[#157B7B] text-xs font-medium">Powered by Doctalk</p>
      </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;