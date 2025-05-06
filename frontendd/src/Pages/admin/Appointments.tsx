import React, { useEffect, useState } from 'react'
import { fetchDoctorAppointment } from '../../utils/adminAuth'
import AppointmentCard from '../../Components/AppointmentCard'
import { useNavigate } from 'react-router-dom'

interface ISlot {
    startTime:string,
    endTime:string,
    availableSlot:number,
    days:string,
    doctorId:{
        _id:string,
        name:string,
        imageUrl:string,
        specialization:{
        name:string
    }
    }
    
}

const Appointments = () => {
    const [appointments,setAppointments] = useState<ISlot[]>([])
    const navigate = useNavigate()
    useEffect(()=>{
        const fetchAppointments = async()=>{
            try {
                const response = await fetchDoctorAppointment()
                if(response.success){
                    setAppointments(response.doctorAppointment)
                    console.log(response.doctorAppointment,'daa')
                }
            } catch (error:any) {
                console.log(error.message)
            }
        }
        fetchAppointments()
    },[])
    const uniqueDoctorsMap = new Map()
    appointments.forEach((item) => {
      uniqueDoctorsMap.set(item.doctorId._id, item)
    })
    const uniqueDoctors = Array.from(uniqueDoctorsMap.values())
  
  return (
    <div className="flex flex-wrap justify-start gap-4 p-4">
      {uniqueDoctors.map((item, index) => (
        <AppointmentCard
          key={index}
          name={item.doctorId.name}
          imageUrl={item.doctorId.imageUrl}
          specialization={item.doctorId.specialization?.name}
          onClick={() => navigate('/admin/appointmentDetails',{
            state:{doctorId:item.doctorId._id}
          })}
        />
      ))}
    </div>
  )}

export default Appointments