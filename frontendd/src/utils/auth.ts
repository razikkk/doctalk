import api from '../../src/utils/api'
import Cookies from 'js-cookie'
import { userEndpoints } from '../Routes/endPointUrl'

export const signUp = async(userData:any)=>{
    try {
        const response = await api.post(userEndpoints.SIGNUP,userData)
        console.log(userData)
        return response.data
    } catch (error:any) {
        const errorFromBackend = error.response?.data?.message || "Sign Up Failed"
        return {success:false,message:errorFromBackend}
    }
}
export const verifyOtp = async(email:string,otp:string)=>{
    try {
        const response = await api.post(userEndpoints.VERIFY_OTP,{email,otp})
        return response.data
    } catch (error) {
        return {success:false,message:"Otp Verification Failed"}
    }
}

export const googleSignIn = async(idToken:string)=>{
    try {
        const response = await fetch('http://localhost:3000/api/users/google',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials:'include',
            body:JSON.stringify({idToken})
        })
        if(!response.ok){
            console.log('signUp failed',response)
        }
        const data = await response.json()
        // const {token:accessToken,user} = data
        // // console.log("recieved token",accessToken)
        // // localStorage.setItem("token",accessToken)
        // localStorage.setItem("user",JSON.stringify(user))
        return data
    } catch (error:any) {
        console.log('error',error.message)
    }
   
}

export const signIn = async(userData:any)=>{
    try {
        const response = await api.post(userEndpoints.SIGNIN,userData,{withCredentials:true})
        console.log("responssss",response.data)
        const {accessToken,user,isBlocked} = response.data

        if(isBlocked){
            return {success:false, isBlocked:true, message: "Your account is blocked. Please contact support."}
        }
        

        Cookies.set("accessToken",accessToken)
        // localStorage.setItem("userId",user._id)
        localStorage.setItem("role",user.role)
        return {success:true,accessToken,user,isBlocked:false}
        // return response.data //{success:true,message,user,access,refresh}
    } catch (error:any) {
        const errorFromBackend = error.response?.data?.message
        console.log(errorFromBackend,'bacl')
        return {success:false,message:errorFromBackend}
    }
}

export const fetchDoctors = async()=>{
    try {
        const response = await api.get(userEndpoints.FETCHDOCTORS)
        return response
    } catch (error:any) {
        console.log(error.message)
        throw error
    }
}

export const userLogout = async()=>{
    try {
        const response = await api.post(userEndpoints.LOGOUT)
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const fetchSpecialization = async()=>{
    try {
        const response = await api.get(userEndpoints.FETCH_SPECIALIZATION)
        console.log(response.data,'hh')
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const fetchDoctorAppointment = async()=>{
    try {
        const response = await api.get(userEndpoints.APPOINTMENTS)
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const bookAppointment = async(appointmentData:any)=>{
    try {
        const response = await api.post(userEndpoints.BOOK_APPOINTMENT,appointmentData)
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const createPaypalOrder = async(amount:string)=>{
    try {
        const response = await api.post(userEndpoints.CREATE_PAYPAL_ORDER,{amount})
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const capturePaypalOrder = async(orderID:string)=>{
    try {
        const response = await api.post(userEndpoints.CAPTURE_PAYPAL_ORDER,{orderID})
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}
