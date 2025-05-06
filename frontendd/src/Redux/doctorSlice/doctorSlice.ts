import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


interface doctorAuth {
    token: string | null,
    doctorId:string | null,
    isAuthenticated:boolean,
    loading: boolean,
    error: string | null,
   

}
const initialState:doctorAuth = {
        token:Cookies.get("doctorAccessToken") || null,
        doctorId:localStorage.getItem("doctorId") ? localStorage.getItem("doctorId") : null,
        isAuthenticated:false,
        loading:false,
        error:null,
        
}

const doctorSlice = createSlice({
    name: "doctorAuth",
    initialState,
    reducers: {
        loginStart:(state)=>{
            state.loading = true,
            state.error = null
        },
        loginSuccess:(state,action)=>{
            const {doctorAccessToken,doctorId} = action.payload
            state.token =doctorAccessToken
            state.doctorId = doctorId
            state.isAuthenticated = true,
            state.loading = false,
            state.error = null
            
            
               

            if(doctorId){
                localStorage.setItem("doctorId",action.payload.doctorId)
            }
           

        },
        loginFailure:(state,action:PayloadAction<string>)=>{
            state.token = null,
            state.isAuthenticated = false,
            state.loading = false,
            state.error = action.payload
        },
        logout:(state)=>{
            state.token=null,
            state.doctorId = null
            state.isAuthenticated= false,
            state.loading=false,
            state.error = null
            Cookies.remove("doctorAccessToken")
        }
    }
});

// export const {updateDoctorForm,setFormData} = doctorSlice.actions
export const {loginStart,loginSuccess,loginFailure,logout} = doctorSlice.actions
export default doctorSlice.reducer