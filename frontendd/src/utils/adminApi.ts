import axios from "axios";
import { BaseUrls } from "../Routes/apiRoutes";
import Cookies from "js-cookie";
import store from "../Redux/store";
import { adminlogout } from "../Redux/adminAuthSlice";

const adminAPI = axios.create({
    baseURL:BaseUrls.admin,
    headers:{"Content-Type":"application/json"}
})


adminAPI.interceptors.request.use(
    (config)=>{
        const token = Cookies.get("adminAccessToken")
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

adminAPI.interceptors.response.use(
    (response)=>response,
    async (error)=>{
         const originalRequest = error.config

         if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true
         
         try {
            const role = localStorage.getItem('role')
            console.log('role')
            const refreshResponse = await adminAPI.post('http://localhost:3000/api/admin/refreshToken',{role},{withCredentials:true})
            console.log('poyalo')
            const newAdminAccessToken = refreshResponse.data.adminAccessToken
            Cookies.set("adminAccessToken",newAdminAccessToken)
            console.log("kazhj")
            error.config.headers['Authorization'] = `Bearer ${newAdminAccessToken}`
            return adminAPI(error.config)
         } catch (error:any) {
            console.log(error.message)
         }
         
         
        }else{
           store.dispatch(adminlogout())

           return Promise.reject(error)
       }

    }
)

export default adminAPI