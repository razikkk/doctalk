import { adminEndpoints } from "../Routes/endPointUrl";
import adminAPI from "./adminApi";
import Cookies from "js-cookie";
export const adminSignIn = async (adminData:any)=>{
    try {
        const response = await adminAPI.post(adminEndpoints.SIGNIN,adminData,{withCredentials:true})
        const{accessToken} = response.data

        Cookies.set("adminAccessToken",accessToken)
        // localStorage.setItem("adminId",user._id)
        // localStorage.setItem("role",user.role)

        return response.data

    } catch (error:any) {
        const errorFromBackend = error.response?.data?.message || "ahaa"
        return {success:false,message:errorFromBackend}
    }
}

export const getAllUser = async(search:string,page:number,limit:number)=>{
    try {
        const response = await adminAPI.get(adminEndpoints.PATIENTS,{
            params:{search,page,limit}
        })
        const filterUsers = response.data.users.filter((user:any)=>user.role == 'user')

        return {
            users:filterUsers,
            totalPages:response.data.totalPages,
            currentPage:response.data.currentPage

        }
    } catch (error) {
        console.log("error occured",error)
        return {users:[],totalPages:0,currentPage:1}
    }
}

export const specialities = async()=>{
    try {
        const response = await adminAPI.get(adminEndpoints.SPECIALITIES)
        console.log(response.data,"dfd")
        return response.data
    } catch (error) {
        console.log("error occured",error)
        return []
    }
}

export const addSpecialities = async(specialityData:any)=>{
    try {
        console.log("specialityData before FormData creation:", specialityData);

        const formData = new FormData()
        formData.append("name",specialityData.name)

        if(specialityData.image){
            formData.append("image",specialityData.image)
        }
            console.log("image",specialityData.image)
            for (let pair of Array.from((formData as any).entries())) {
                const [key, value] = pair as [string, any];
                console.log("form data entry:", key + ":" + value);
            }
        const response = await adminAPI.post(adminEndpoints.ADD_SPECIALITIES,formData,{
            headers:{"Content-Type":"multipart/form-data"},
        })
        console.log(response.data,'dfaddddd')
        return response.data
    } catch (error) {
        console.log("error occured",error)
        return null
    }
}

export const updateSpecialities = async(id:any,specialityData:any)=>{
    try {
        const formData = new FormData()
        formData.append("name",specialityData.name)

        if(specialityData.image){
            formData.append("image",specialityData.image)
        }

        const response = await adminAPI.put(adminEndpoints.UPDATE_SPECIALITIES(id),formData,{
            headers:{"Content-Type":"multipart/form-data"}
        })
        console.log(id,specialityData,'adminauth')
        return response.data
    } catch (error) {
        console.log("error occured",error)
        return null
    }
}

export const deleteSpecialities = async(id:any)=>{
    if (!id) {
        console.error("Error: Trying to delete a speciality with an undefined ID");
        return null;
    }
    try {
        const response = await adminAPI.patch(adminEndpoints.DELETE_SPECIALITIES(id))
        return response.data
    } catch (error) {
        console.log("error occured",error)
        return null
    }
}

export const restoreSpecialities = async(id:any)=>{
    try {
        const response = await adminAPI.patch(adminEndpoints.RESTORE_SPECIALITIES(id))
        return response.data
    } catch (error) {
        console.log("error occured",error)
        return null
    }
}

export const fetchSpecialisation = async(id:any)=>{
    try {
        console.log("fetci",id)
        const response = await adminAPI.get(adminEndpoints.FETCH_SPECIALITIES(id))
        console.log('re',response)
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getActiveSpecialites = async()=>{
    try {
        const response = await adminAPI.get(adminEndpoints.ACTIVE_SPECIALITIES)
        // console.log(response.data,"dfd")
        return response.data
    } catch (error) {
        console.log("error occured",error)
        return []
    }
}

export const getAllDoctors = async (search:string,page:number,limit:number)=>{
    try {
        const response = await adminAPI.get(adminEndpoints.DOCTORS,{
            params:{search,page,limit}
        })
        console.log("response doctors",response)
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const getDoctorById = async(doctorId:string)=>{
    try {
        const response = await adminAPI.get(adminEndpoints.DOCTOR_BY_ID(doctorId))
        console.log(response,'dfdfd')
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const approveDoctor = async(doctorId:string,isActive:string)=>{
    try {
        console.log(doctorId,'dr')
        const response = await adminAPI.post(adminEndpoints.APPROVE_DOCTOR(doctorId),{isActive})
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const blockUser = async(userId:string)=>{
    try {
        const response = await adminAPI.put(adminEndpoints.BLOCK_USER(userId),{},{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem('adminAccessToken')}`
            }
        })
        if(!response.data.success){
            throw new Error("failed to block user")
        }

        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const unblockUser = async(userId:string)=>{
    try {
        const response = await adminAPI.put(adminEndpoints.UNBLOCK_USER(userId),{},{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("adminAccessToken")}`
            }
        })
        if(!response.data.success){
            throw new Error("failed to unblock user")
        }
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const blockAndUnblockDoctor = async(doctorId:string)=>{
    try {
        const response = await adminAPI.put(adminEndpoints.BLOCK_UNBLOCK_DOCTOR(doctorId))
        return response.data //returning response dta to update ui
    } catch (error:any) {
        console.log(error.message)
    }
}

export const fetchDoctorAppointment = async()=>{
    try {
        const response = await adminAPI.get(adminEndpoints.FETCH_DOCTOR_APPOINTMENTS)
        console.log(response,'res')
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}

export const filteredSlots = async(slotDate:string,doctorId:string)=>{
const response = await adminAPI.get(adminEndpoints.APPOINTMENT_FILTER_BY_DATE(slotDate,doctorId))
return response.data
}

export const fetchDoctorReview = async(doctorId:string)=>{
    try {
        const response  = await adminAPI.get(adminEndpoints.FETCH_DOCTOR_REVIEW(doctorId))
        return response.data
    } catch (error:any) {
        console.log(error.message)
    }
}