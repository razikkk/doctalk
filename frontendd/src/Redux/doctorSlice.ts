import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import path from "path";

// const loadFromLocalStorage = () => {
//     try {
//         const savedData = localStorage.getItem("formData");
//         console.log(savedData,'Loading from localstorage')
//         return savedData ? JSON.parse(savedData) : {
//             registrationId: "",
//             registrationYear: "",
//             language: "English",
//             age: "",
//             gender: "male",
//             hospital: "",
//             experience: ""
//         };
//     } catch (error) {
//         console.error("Error loading form data from localStorage:", error);
//         return {
//             registrationId: "",
//             registrationYear: "",
//             language: "English",
//             age: "",
//             gender: "male",
//             hospital: "",
//             experience: ""
//         };
//     }
// };

interface doctorAuth {
    token: string | null,
    doctorId:string | null,
    isAuthenticated:boolean,
    loading: boolean,
    error: string | null,
   

}

// interface doctorForm {
//     registrationId: string
//         registrationYear: string,
//         language: string,
//         age: string,
//         gender: string,
//         hospital: string,
//         experience: string
// }
const initialState:doctorAuth = {
        token:null,
        doctorId:localStorage.getItem("doctorId") ? localStorage.getItem("doctorId") : null,
        isAuthenticated:false,
        loading:false,
        error:null,
        
}



const doctorSlice = createSlice({
    name: "doctorAuth",
    initialState,
    reducers: {
        // updateDoctorForm: (state, action) => {
        //     return {...state, ...action.payload};
        // },
        // setFormData: (state, action) => {
        //     return action.payload;
        // }
        loginStart:(state)=>{
            state.loading = true,
            state.error = null
        },
        loginSuccess:(state,action:PayloadAction<{doctorAccessToken:string,doctorId:string}>)=>{
            state.token = action.payload.doctorAccessToken
            state.doctorId = action.payload.doctorId
            state.isAuthenticated = true,
            state.loading = false,
            state.error = null,
            
            Cookies.set("doctorAccessToken",action.payload.doctorAccessToken,{expires:7,path:'/'})
            if(state.doctorId){
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