import axios from "axios";
import { BaseUrls } from "../Routes/apiRoutes";
import Cookies from "js-cookie";
import store from "../Redux/store";
import { logout } from "../Redux/doctorSlice/doctorSlice";
import { doctorEndpoints } from "../Routes/endPointUrl";

const doctorApi = axios.create({
    baseURL:BaseUrls.doctor,
    headers:{"Content-Type":"application/json"}
})

doctorApi.interceptors.request.use(
    (config)=>{
        const token = Cookies.get("doctorAccessToken")
        console.log(token,'jjf')
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
    
)

doctorApi.interceptors.response.use(
    (response)=>{
        return response
    },

    async(error)=>{
        const originalRequest = error.config
        console.log(error.response.status,'status')
        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true

            try {
                const role = localStorage.getItem('role')
                console.log(role,'rlee')
                const refreshResponse = await doctorApi.post(doctorEndpoints.REFRESH_RESPONSE,{role},{withCredentials:true})
                const newDoctorAccessToken = refreshResponse.data.doctorAccessToken
                console.log(refreshResponse.data,'data')
                // console.log(newDoctorAccessToken,'nwe access')
                // console.log("dddfsa43")
                Cookies.set("doctorAccessToken",newDoctorAccessToken)
                // console.log(Cookies.get("doctorAccessToken"))
                // console.log("kaznj")

                error.config.headers['Authorization'] = `Bearer ${newDoctorAccessToken}`
                return doctorApi(error.config)
            } catch (error) {
                
            }
        }else{
            store.dispatch(logout())
            return Promise.reject(error)
        }
    }
)

export default doctorApi