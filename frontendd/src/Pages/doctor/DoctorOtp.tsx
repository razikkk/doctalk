import { useEffect, useRef, useState } from "react";
import doctorApi from "../../utils/doctorApi";
import { useNavigate } from "react-router-dom";
import { Toaster,toast } from "sonner";
const DoctorOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const [resendOtp,setResendOtp] = useState(()=>{
    const storedOtp = localStorage.getItem("resendOtp")
    // const storedUser = localStorage.getItem("currentUser")
    const newUser = sessionStorage.getItem("newUser")
    
    if(newUser){
      localStorage.setItem("resentOtp","60")
      sessionStorage.removeItem("newUser")
      return 60
    }
    return storedOtp !== null? Number(storedOtp) : 60

  })
  const [canResend,setCanResend] = useState(resendOtp==0)

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handlePrevious = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Backspace' && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const enteredOtp = otp.join("");

    try {
        const storedDoctor = JSON.parse(localStorage.getItem("doctor") || '{}');
        const storedEmail = storedDoctor.email;
      console.log("stored before otp request", storedEmail);
      if (!storedEmail) {
        alert("No email found");
        navigate('/doctor/register');
      }
      const response = await doctorApi.post('/verifyOtp', {
        email: storedEmail,
        otp: enteredOtp
      });
      if (response.data.success) {
      toast.success("Please fill the following steps",{duration:1000})
      setTimeout(()=>navigate('/doctor/verification/step1'),1000)
        
      } else {
        alert(response.data.message);
      }
    } catch (error:any) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(resendOtp<=0) {
      setCanResend(true)
      return
    }
    localStorage.setItem("resendOtp",resendOtp.toString())
          const timer = setInterval(()=>{
            setResendOtp((prev)=>{
              const newTime = prev -1
              if(newTime<=0){
                clearInterval(timer)
                setCanResend(true)
              }
              return newTime
            })
          },1000)
  
          return ()=>clearInterval(timer)
   },[resendOtp])
  
   const formatTime = ((seconds:any)=>{
      const minutes = Math.floor(seconds/60)
      const secs = seconds%60
      return  `${minutes}:${secs <10 ? "0" : ""}${secs}`
   })
  

  const handleResendOtp = async()=>{
    setCanResend(false)
    setResendOtp(60)
    localStorage.setItem("resendOtp","60")

    try {
      const storedDoctor = JSON.parse(localStorage.getItem("doctor") || "{}")
      const storedEmail = storedDoctor.email
      if(!storedEmail){
        toast.error("no Email found",{duration:1000})
        setTimeout(()=>navigate("/doctor/register"),1000)
        return
      }
      const response = await doctorApi.post('/resendOtp',{email:storedEmail})

      if(response.data.success){
        toast.info("new Otp sented",{duration:1000})
      }else{
        toast.error("failed to send otp",{duration:1000})
      }
    } catch (error) {
      console.log("error resending otp",error)
    }
  } 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Toaster/>
      <div className="flex flex-col items-center space-y-6 bg-white p-10 shadow-lg rounded-xl w-[450px]">
        <h1 className="text-center text-2xl font-bold text-[#157B7B] mb-5">Verify OTP</h1>
        <div className="flex space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {inputRef.current[index] = el}} // {} ithanengil nmll return ezhthand onnum return chyoola so void an ppo ref eror ndavoola but () itaal it return a value so typescript nto like that React expects your ref function to return nothing
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handlePrevious(index, e)}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl"
            />
          ))}
        </div>
        <button className="w-full px-4 py-2 bg-[#157B7B] text-white font-bold rounded-lg hover:opacity-80" onClick={handleSubmit}>
          {loading ? "Verifying" : "Verify OTP"}
        </button>
        {canResend?(
          <button className="text-[#157B7B] cursor-pointer font-bold" onClick={handleResendOtp}>Resend Otp</button>
        ):(
          <p>Resends In :{formatTime(resendOtp)}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorOtp;
