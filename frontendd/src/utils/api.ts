import axios from 'axios'
import Cookies from 'js-cookie'
import { BaseUrls } from '../Routes/apiRoutes'
import { userEndpoints } from '../Routes/endPointUrl'


const API = axios.create({
    baseURL:BaseUrls.user,
    headers:{
        "Content-Type":"application/json"
    }
})

API.interceptors.request.use(
    (config)=>{
        const token = Cookies.get("accessToken")
        if(token){
            config.headers['Authorization'] = `Bearer ${token}` //attach token
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

API.interceptors.response.use(
    (response)=>{
        console.log(response)
        return response //if fine return it
    },
    async (error)=>{
        const originalRequest = error.config
        console.log("Error interceptor hit")

        if(error.response?.status == 401 && !originalRequest._retry){
            originalRequest._retry = true
            console.log("triggered")
            try {
                const role = localStorage.getItem('role')
                console.log(role,'role')
                const refreshResponse = await API.post(userEndpoints.REFRESH_RESPONSE,
                    {role},
                    {withCredentials:true}
                )
                console.log("done")
                console.log(refreshResponse.data.accessToken)
                const newAccessToken = refreshResponse.data.accessToken
                console.log(newAccessToken,'dd')
                
                Cookies.set("accessToken",newAccessToken)
                console.log("added")
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
                return API(error.config)
            } catch (error:any) {
                console.log(error.mesage)
            }

            Cookies.remove("accessToken")
            window.location.href='/login'
        }
        return Promise.reject(error)
    }
)

export default API