import api from '../../src/utils/api'
import Cookies from 'js-cookie'
import { userEndpoints } from '../Routes/endPointUrl'
import { IReviewRating } from '../Components/ReviewRating'

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
        console.log(response,'rsss')
        return response.data
    } catch (error:any) {
        console.log(error.response.data,'sloo')
        throw error
    }
}

export const createPaypalOrder = async(amount:string)=>{
    try {
        const response = await api.post(userEndpoints.CREATE_PAYPAL_ORDER,{amount})
        console.log(response.data)
        return response.data
    } catch (error:any) {
        console.log(error.message)

    }
}

export const capturePaypalOrder = async (orderID: string) => {
    try {
      console.log("Attempting to capture PayPal order:", orderID);
      const response = await api.post(userEndpoints.CAPTURE_PAYPAL_ORDER, { orderID });
      console.log("PayPal capture successful response:", response.data);
      return response.data;
    } catch (error: any) {
      // This is critical - axios errors need special handling
      console.log("PayPal capture error caught:", error);
      
      // Log detailed error information
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
        
        // Return the error data from our backend
        return error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
        return {
          success: false,
          message: "No response received from the payment server"
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
        return {
          success: false,
          message: error.message || "An error occurred during payment processing"
        };
      }
    }
  };

  export const getAllAppointment = async(userId:string)=>{
    try {
        const response = await api.get(userEndpoints.FETCH_APPOINTMENTS(userId))
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
  }

  export const fetchDoctorProfile = async(doctorId:string)=>{
    try {
        const response = await api.get(userEndpoints.FETCH_DOCTOR_PROFILE(doctorId))
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
  }

  export const findDoctorBySpecialization = async(specializationId:string)=>{
    try {
        const response = await api.get(userEndpoints.FETCH_DOCTOR_BY_SPECIALIZATION(specializationId))
        console.log(response,'rd')
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
  }

  export const postReviewAndRating = async(reviewData:IReviewRating)=>{
    try {
        const response = await api.post(userEndpoints.POST_REVIEW_RATING,reviewData)
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
  }

  export const fetchDoctorReview = async(doctorId:string)=>{
    try {
        const response = await api.get(userEndpoints.FETCH_DOCTOR_REVIEW(doctorId))
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
  }