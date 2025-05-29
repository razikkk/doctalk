import React, { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin, MoreVertical, User } from 'lucide-react';
import { FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { getAllAppointments, updateAppointmentStatus } from '../../utils/doctorAuth';
import { IoIosVideocam } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { io } from 'socket.io-client';
import { FaBookMedical } from 'react-icons/fa';
import { FaVideoSlash } from "react-icons/fa6";
import { IoMdNotificationsOff } from "react-icons/io";





interface IAppointment{
   _id:string
    userId:{
      _id:string
        name:string
    },
    doctorId:string
    slotId:{
        startTime:string,
        endTime:string,
        days:string
    }
    status:string,
    tokenNumber:number
}
const socket = io('http://localhost:3000')
const Appointments = () => {
    const [appointments,setAppointments] = useState<IAppointment[]>([])
    const doctorId = localStorage.getItem('doctorId')
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchAppointments = async()=>{
            const response = await getAllAppointments(doctorId as string)
            console.log(response,'red')
            if(response.success){
                setAppointments(response.result)
            }
        }
        fetchAppointments()
    },[])
    
    const handleStartCall = (appointment:any) => {
      const callerId = appointment.doctorId
      const receiverId = appointment.userId._id
      const appointmentId = appointment._id
      
      socket.emit('call_user',{appointmentId,callerId,receiverId})
      navigate(`/appointment/video-call/${appointment._id}`);
    }

    const handleAppointmentStatus = async(appointmentId:string,newStatus:string)=>{
      try {
        
        const response = await updateAppointmentStatus(appointmentId,newStatus)
        if(response.success){
          setAppointments(prev=>
            prev.map(appointment=>
              appointment._id === appointmentId ? {...appointment,status:newStatus} : appointment
            )
          )
        }
      } catch (error:any) {
        console.log(error.message)
      }
    }
  return (
    <div className="max-w-5xl mx-auto ">
    <div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold">Appointments</h1>
  <div className="flex items-center space-x-5">
    {/* <IoMdInformationCircleOutline className="text-2xl text-gray-500 cursor-pointer" onClick={()=>setShowModal(true)}/> */}
    {/* <ConsultationInfoModal isOpen={showModal} onClose={()=>setShowModal(false)}/> */}
  </div>
</div>
    
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  {appointments.map((appointment) => (
    <div
      key={appointment._id}
      className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>{new Date(appointment.slotId.days).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>{appointment.slotId.startTime}</span> -
              <span>{appointment.slotId.endTime}</span>
            </div>
            <div className="flex items-center text-gray-600">
                  <FaBookMedical  size={16} className="mr-2" />
                  <span>{appointment.tokenNumber}</span>
                </div>
            <div
              className="flex items-center text-gray-600 cursor-pointer hover:text-gray-800"
              title="View Profile"
            >
              <FaUserDoctor size={16} className="mr-2" />
              <span>{appointment.userId.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 md:mt-0">
          {/* <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs mr-20 font-medium ${
              appointment.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {appointment.status}
          </span> */}
          <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-6 ${
      appointment.status === 'completed'
        ? 'bg-green-100 text-green-800'
        : appointment.status === 'cancelled'
        ? 'bg-red-100 text-red-800'
        : 'bg-gray-100 text-gray-800'
    }`}
  >
    {appointment.status}
  </span>

  {appointment.status === 'scheduled' && (
    <>
    <select name="" id="" onChange={(e)=>{
      const selected = e.target.value
      if(selected){
        handleAppointmentStatus(appointment._id,selected)
      }
    }}>
      <option value="">Change status</option>
      <option value="completed">  Mark as Completed</option>
      <option value="cancelled">Mark as Cancelled</option>
    </select>
     
    </>
  )}
          {
            appointment.status === 'completed' ? <IoMdNotificationsOff size={25} className='mr-4' />
            : <IoIosNotifications size={25} className='mr-6'/>
          
          }
            {
              appointment.status === 'completed' ? <FaVideoSlash size={25}/>
              : <IoIosVideocam size={25} onClick={()=>handleStartCall(appointment)}/>
            }
          

          <button className="ml-4 text-gray-400 hover:text-gray-600">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

  </div>
  )
}

export default Appointments