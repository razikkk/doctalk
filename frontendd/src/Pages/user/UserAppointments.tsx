import React, { useEffect, useState } from 'react'
import { getAllAppointment } from '../../utils/auth'
import { Calendar, Clock, MoreVertical } from 'lucide-react';
import { FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { IoMdInformationCircleOutline } from "react-icons/io";
import ConsultationInfoModal from '../../Components/ConsultationInfoModal';
import { FaBookMedical } from "react-icons/fa";
import { io } from 'socket.io-client';



interface IDoctor{
    _id:string
    name:string,
    specialization:{
        name:string
    }
}
interface ISlot{
    startTime:string,
    endTime:string,
    days:string
}
interface IAppointment {
    _id:string,
    tokenNumber:number,
    status:string,
    doctorId:IDoctor,
    slotId:ISlot,
    userId:string
}

const socket = io('http://localhost:3000')

const UserAppointments = () => {
    const [appointments,setAppointments] = useState<IAppointment[]>([])
    const [showModal,setShowModal] = useState(false)
    const [incomingCall,setIncomingCall] = useState(null)
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate()
    console.log(userId)
    useEffect(()=>{
        const fetchAppointments = async()=>{
            const response  = await getAllAppointment(userId as string)
            console.log(response.result)
            if(response.success){
                setAppointments(response.result)
            }
        }
        fetchAppointments()
    },[])

    useEffect(() => {
        // Join the room for this specific appointment
        console.log("Joining room for appointments");
        appointments.forEach(appointment => {
          console.log("Joining room:", appointment._id);
          socket.emit('join_room', appointment._id);
        });
      }, [appointments]);



  useEffect(()=>{
    console.log('setting up call-started listener')
      const handleCallStarted = ({appointmentId}:{appointmentId:string})=>{
        console.log('recieved call-started event',appointmentId)
        setIncomingCall(appointmentId)
        }
        socket.on('incoming_call',handleCallStarted)
   
    return ()=>{
        console.log('removing call-started event')
      socket.off('incoming_call',handleCallStarted)
    }
  },[])



// useEffect(()=>{
//     const patientId = appointments.length > 0 ? appointments[0].userId : null;
//     if (patientId) {
//         // Join room with patient ID so they can receive calls
//         socket.emit('join_room', patientId);
        
//         // Listen for incoming calls from doctor
//         const handleIncomingCall = ({ interviewId, callerId }) => {
//             setIncomingCall({ interviewId, callerId });
//         };
        
//         socket.on('incoming_call', handleIncomingCall);
        
//         return () => {
//             socket.off('incoming_call', handleIncomingCall);
//         };
//     }
// }, [appointments]);
  return (
    <div className="max-w-5xl mx-auto ">
    <div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold">My Appointments</h1>
  <div className="flex items-center space-x-5">
    <button
      className="px-4 py-2 bg-[#157B7B] text-white rounded-lg hover:bg-[#0f5f5f] transition-colors"
      onClick={() => navigate('/user/doctors')}
    >
      + New Appointment
    </button>
    <IoMdInformationCircleOutline className="text-2xl text-gray-500 cursor-pointer" onClick={()=>setShowModal(true)}/>
    <ConsultationInfoModal isOpen={showModal} onClose={()=>setShowModal(false)}/>
  </div>
</div>
    
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  {appointments.length > 0 ? (
    appointments.map((appointment) => (
      <div 
        key={appointment._id}
        className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{appointment.doctorId.specialization?.name}</h3>
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
                <FaBookMedical size={16} className="mr-2" />
                <span>{appointment.tokenNumber}</span>
              </div>
              <div className="flex items-center text-gray-600 cursor-pointer hover:text-gray-800" title="View Profile">
                <FaUserDoctor size={16} className="mr-2" />
                <span onClick={() => navigate(`/doctor/${appointment.doctorId._id}`)}>
                  {appointment.doctorId.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              appointment.status === 'completed'
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {appointment.status}
            </span>
            <button className="ml-4 text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="p-6 text-center text-gray-500">No appointments</div>
  )}
</div>

    {incomingCall && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Doctor is calling</h2>
      <p className="mb-6">Do you want to join the call?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            navigate(`/appointment/video-call/${incomingCall}`);
            setIncomingCall(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
        <button
          onClick={() => setIncomingCall(null)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Decline
        </button>
      </div>
    </div>
  </div>
)}

  </div>
  )
}

export default UserAppointments