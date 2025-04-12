import axios from "axios";
import { BaseUrls } from "../Routes/apiRoutes";
import Cookies from "js-cookie";
import store from "../Redux/store";
import { logout } from "../Redux/doctorSlice";

const doctorApi = axios.create({
    baseURL:BaseUrls.doctor,
    headers:{"Content-Type":"application/json"}
})

doctorApi.interceptors.request.use(
    (config)=>{
        const token = Cookies.get("doctorAccessToken")
        console.log(token,'f')
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

        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true

            try {
                const role = localStorage.getItem('role')
                const refreshResponse = await doctorApi.post('http://localhost:3000/api/doctor/refreshToken',{role},{withCredentials:true})
                const newDoctorAccessToken = refreshResponse.data.doctorRefreshToken
                console.log("dddfsa43")
                Cookies.set("doctorAccessToken",newDoctorAccessToken)

                console.log("kaznj")

                error.config['Authorization'] = `Bearer ${newDoctorAccessToken}`
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