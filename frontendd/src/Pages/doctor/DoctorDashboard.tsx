import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DoctorProfileCard from '../../Components/DoctorCardProfile'
import { addSlots, getDoctorProfile } from '../../utils/doctorAuth'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'
import { MdAssignmentAdd } from "react-icons/md";
import AddSlotModal from '../../Components/AddSlotModal'


interface Doctor{
  _id:string,
  name:string,
  imageUrl:string
}
const DoctorDashboard = () => {

    const[doctorProfile,setDoctorProfile] = useState<Doctor>()
    const doctorId = useSelector((state:RootState)=>state.doctorAuth.doctorId)
    const [isModalOpen,setIsModalOpen] = useState(false)
   const navigate = useNavigate()
    

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
        if(error.response.status === 403){
          navigate('/doctor/login')
        }
      }
      
    }
    fetchDoctorProfile()
  },[doctorId])
    console.log(doctorProfile,'doc')

   

  return (
    <div className="p-4">
    {/* Dashboard title */}
    <div className='flex justify-end'>

    <MdAssignmentAdd className='text-2xl' onClick={()=>setIsModalOpen(true)}/>
    </div>
    <h1 className="text-2xl font-bold mb-4">Welcome to DocTalk</h1>


    {/* Right-aligned Doctor Profile Card */}
    <div className="flex justify-end">
      <div className="w-72">
        <DoctorProfileCard
          doctor={doctorProfile  }
        />
      </div>
    </div>
    <AddSlotModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}/>
  </div>
  )
}

export default DoctorDashboard