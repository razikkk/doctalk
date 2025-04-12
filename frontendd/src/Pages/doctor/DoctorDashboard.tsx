import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../Redux/doctorSlice'
import { useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import DoctorProfileCard from '../../Components/DoctorCardProfile'
import profile from '../../assets/doctorProfile.jpeg'
import { getDoctorProfile } from '../../utils/doctorAuth'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'

interface Doctor{
  _id:string,
  name:string,
  imageUrl:string
}
const DoctorDashboard = () => {

    const[doctorProfile,setDoctorProfile] = useState<Doctor>()
    const doctorId = useSelector((state:RootState)=>state.doctorAuth.doctorId)

  useEffect(()=>{
   
    const fetchDoctorProfile = async()=>{
      try {
        
        if(!doctorId) return
      const response = await getDoctorProfile(doctorId) 
      if( response && response.doctor){
        setDoctorProfile(response.doctor)
      }
      console.log(response.doctor,'dd')
      } catch (error:any) {
        console.log(error.message)
      }
      
    }
    fetchDoctorProfile()
  },[doctorId])
    console.log(doctorProfile,'doc')
  return (
    <div className="p-4">
    {/* Dashboard title */}
    <h1 className="text-2xl font-bold mb-4">Welcome to DocTalk</h1>

    {/* Right-aligned Doctor Profile Card */}
    <div className="flex justify-end">
      <div className="w-72">
        <DoctorProfileCard
          doctor={doctorProfile  }
        />
      </div>
    </div>
  </div>
  )
}

export default DoctorDashboard