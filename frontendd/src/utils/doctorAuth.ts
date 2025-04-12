import { doctorEndpoints } from "../Routes/endPointUrl";
import doctorApi from "./doctorApi";
import Cookies from "js-cookie";

export const doctorSignUp = async(doctorData:any)=>{
    try {
        console.log(doctorData,'api')
        const response = await doctorApi.post(doctorEndpoints.SIGNUP,doctorData)
        return response.data
    } catch (error:any) {
        console.log(error)
        const errorFromBackend = error.response?.data?.message || 'Sign Up failed'
        return {success:false,message:errorFromBackend}

    }
}

export const verifyOtp = async(email:string,otp:string)=>{
    try {
        const response = await doctorApi.post(doctorEndpoints.VERIFY_OTP,{email,otp})
        return response.data
    } catch (error) {
        return {success:false,message:"otp verification failed"}
    }
}

export const verificationSectionOne = async(doctorData:any)=>{
    try {
        const response = await doctorApi.post(doctorEndpoints.VERIFICATION_SECITON_ONE,doctorData)
        
        return response.data
    } catch (error:any) {
        const errorFromBackend = error.response?.data?.message || 'Sign Up failed'
        return {success:false,message:errorFromBackend}
    }
}

export const verificationSectionTwo = async (formData: FormData) => {
    try {
        const response = await doctorApi.post(doctorEndpoints.VERIFICATION_SECTION_TWO, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        console.log(response.data,'dfd')
        return response.data;
    } catch (error: any) {
        const errorFromBackend = error.response?.data?.message || "Sign Up failed";
        return { success: false, message: errorFromBackend };
    }
};


export const getDoctorStatus = async(email:string)=>{
    try {
        const response = await doctorApi.get(doctorEndpoints.DOCTOR_STATUS(email))
        return response.data
    } catch (error:any) {
        const errorFromBackend = error.response?.data?.message || "Can't get doctor status"
        return {success:false,message:errorFromBackend}
    }
}

export const login = async(doctorData:any)=>{
    try {
        const response = await doctorApi.post(doctorEndpoints.SIGNIN,doctorData,{withCredentials:true})
    const {doctor,doctorAccessToken} = response.data

    Cookies.set("doctorAccessToken",doctorAccessToken)
    localStorage.setItem('role', doctor.role)
    
    return response.data
    } catch (error:any) {
        const errorFromBackend = error.response?.data?.message
        return {success:false,message:errorFromBackend}
    }
}

export const googleLogin = async(idToken:string,actionType:'login' | 'register')=>{
    try {
        const response = await fetch('http://localhost:3000/api/doctor/doctor-google-login',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials:'include',
            body:JSON.stringify({idToken,actionType})
        })
        if(!response.ok){
            console.log("google login failed",response)
        }
        const data = await response.json()
        return data

    } catch (error:any) {
        const errorFromBackend = error.response?.data?.message
        return {success:false,message:errorFromBackend}
    }
}

export const getDoctorProfile = async(doctorId:string)=>{
    try {
        console.log(doctorEndpoints.GET_DOCTOR_PROFILE(doctorId),'ddd')
        const response = await doctorApi.get(doctorEndpoints.GET_DOCTOR_PROFILE(doctorId))

        console.log(response.data)
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}


