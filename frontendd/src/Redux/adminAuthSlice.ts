import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AdminAuth{
    token: string | null
    adminId: string | null
    role: string | null
    isAuthenticated : boolean
    users : any[]
}

const token = Cookies.get("adminAccessToken")
const adminId = localStorage.getItem("adminId")
const role = localStorage.getItem("role")

const initialState:AdminAuth={
    token:null,
    adminId:null,
    role: role || null,
    isAuthenticated:!!token && role == 'admin',
    users:[]
}

const adminAuthSlice = createSlice({
    name:"AdminAuth",
    initialState,
    reducers:{
        adminLogin : (state,action)=>{
            const {token,adminId,role} = action.payload
            state.token = token
            state.adminId = adminId
            state.role = role
            state.isAuthenticated = role == "admin"

            if(token) Cookies.set("adminAccessToken",token)
            if(adminId) localStorage.setItem("adminId",adminId)
            if(role) localStorage.setItem("role",role)

        },
        adminlogout : (state)=>{
            state.token = null,
            state.adminId = null,
            state.role = null
            state.isAuthenticated = false
            Cookies.remove("adminAccessToken")
            localStorage.removeItem("adminId")
            localStorage.removeItem("role")
        },
        
        setUsers:(state,action)=>{
            state.users = action.payload
        },

        updateUserStatus : (state,action)=>{
            const {userId,isBlocked}= action.payload
            state.users = state.users.map((user)=>
                user._id === userId ? {...user,isBlocked} : user
            )
        }

    }
})

export const{adminLogin,adminlogout,setUsers,updateUserStatus} = adminAuthSlice.actions
export default adminAuthSlice.reducer