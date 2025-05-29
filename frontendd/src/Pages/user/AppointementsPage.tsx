import React, { useState, useEffect } from 'react';
import { bookAppointment, fetchDoctorAppointment } from '../../utils/auth';
import { Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentModal from '../../Components/PaymentModal';
import {Toaster, toast} from "sonner"
import { io } from 'socket.io-client';

interface Specialization {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
  email: string;
  gender: string;
  language: string;
  experience: number;
  hospital: string;
  specialization: Specialization;
  imageUrl?: string;
}

interface IAppointment {
  _id: string;
  userId:string
  days: string; 
  startTime: string;
  endTime: string;
  availableSlot: number;
  consultingFees: number;
  doctorId: Doctor;
}

const AppointmentCard = () => {
    const { doctorId } = useParams();
    const userId = localStorage.getItem('userId')
    console.log(typeof doctorId)
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [todayTomorrowSlots, setTodayTomorrowSlots] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal,setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAppointmentData = async () => {
        if(!doctorId){
            setIsLoading(false)
            return
        }
      try {
        setIsLoading(true);
        const response = await fetchDoctorAppointment();
        
        if (response.appointmentData && Array.isArray(response.appointmentData)) {
            const doctorAppointments = response.appointmentData.filter(
                (appointment: IAppointment) => {
                  const appointmentDoctorId = appointment.doctorId._id.trim();
                  const reduxDoctorId = doctorId.trim();
              
                  return appointmentDoctorId === reduxDoctorId;
                }
              );
          const filteredSlots = filterTodayTomorrowSlots(doctorAppointments);
          setTodayTomorrowSlots(filteredSlots);
          
          
          if (filteredSlots.length > 0) {
            setSelectedAppointment(filteredSlots[0]);
          }
        } else {
          console.error("No appointment data available");
        }
      } catch (error: any) {
        console.log(error.message);
        console.log(`Error fetching appointments for doctor ${doctorId}:`, error.message);

      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointmentData();
  }, [doctorId]);
  
  const filterTodayTomorrowSlots = (appointments: IAppointment[]) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.days).toISOString().split('T')[0];
      return appointmentDate === todayStr || appointmentDate === tomorrowStr;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <p className="text-center">Loading appointment details...</p>
      </div>
    );
  }

  if (!selectedAppointment) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <p className="text-center">No appointment available.</p>
      </div>
    );
  }

  const handleBookAppointment = async()=>{
    const appointmentData = {
        userId:userId,
        doctorId:selectedAppointment.doctorId._id,
        slotId:selectedAppointment._id,
        tokenNumber:selectedAppointment.availableSlot,
        amount:selectedAppointment.consultingFees
    }
    try {
        const response = await bookAppointment(appointmentData)
        console.log(response,'res')
        if(response.success){
            toast.success("appointment booked",{duration:2000})
        }else{
            alert(response.message || 'fdadf')
        }
    } catch (error:any) {
        toast.error(error.response.data.message)
    }
  }



  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <Toaster/>
      <h2 className="text-xl font-semibold mb-6 text-[#0C0B3E]">Appointment Details</h2>

      {/* Doctor Info Card */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
        <img
          src={selectedAppointment.doctorId.imageUrl || '/api/placeholder/96/96'}
          alt={selectedAppointment.doctorId.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h3 className="text-lg font-bold" style={{ color: "rgba(12, 11, 62, 0.73)" }}>{selectedAppointment.doctorId.name}</h3>
          <p className="text-sm text-teal-700 font-medium">{selectedAppointment.doctorId.specialization?.name || 'Specialist'}</p>
          <p className="text-sm text-gray-500">Language: {selectedAppointment.doctorId.language}</p>
          <p className="text-sm text-gray-500">Hospital: {selectedAppointment.doctorId.hospital}</p>
          <p className="text-sm text-gray-500">{selectedAppointment.doctorId.experience} years of experience</p>
          <div className="flex items-center gap-1 justify-center mt-2 mr-23">
      {[1].map((star) => (
        <Star 
          key={star} 
          className="h-2 w-2 text-[#157B7B] fill-[#157B7B]" 
        />
      ))}
      <span className="text-xs text-gray-500 ">4.5/5</span>
    </div>  
          </div>
      </div>

      {/* Available Slots & Appointment Details */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-4" style={{ color: "rgba(12, 11, 62, 0.73)" }}>Appointment Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4  rounded-lg shadow-md">
            <p className="font-medium text-[#157B7B]">Date:</p>
            <p>{formatDate(selectedAppointment.days)}</p>
          </div>
          <div className="p-4  rounded-lg shadow-md">
            <p className="font-medium text-[#157B7B]">Time:</p>
            <p>{selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
          </div>
          <div className="p-4  rounded-lg shadow-md">
            <p className="font-medium text-[#157B7B]">Available Slots:</p>
            <p className="text-gray-700 font-semibold">{selectedAppointment.availableSlot}</p>
          </div>
          <div className="p-4  rounded-lg shadow-md">
            <p className="font-medium text-[#157B7B]">Consulting Fee:</p>
            <p className="text-gray-700 font-semibold">Rs {selectedAppointment.consultingFees}</p>
          </div>
        </div>
      </div>

      {/* Dropdown + Pay Button */}
      <div className="flex gap-4 items-center mb-8">
        {/* <select className=" rounded-lg px-4 py-2 text-sm shadow-md">
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select> */}
        <button className="bg-[#157B7B] hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
        onClick={()=>setShowModal(true)}>
          Pay Rs {selectedAppointment.consultingFees}
        </button>
      </div>

      {
        showModal && <PaymentModal amount={selectedAppointment.consultingFees}
        onClose={()=>setShowModal(false)}
        onSuccess={handleBookAppointment}
        />
      }
      
      {/* Today's and Tomorrow's Slots Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-md font-semibold mb-4" style={{ color: "rgba(12, 11, 62, 0.73)" }}>Today & Tomorrow's Available Slots</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {todayTomorrowSlots.map((slot) => (
            <div
              key={slot._id}
              className={`p-3 shadow-md rounded-lg cursor-pointer transition ${
                selectedAppointment?._id === slot._id 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'hover:border-gray-400 hover:shadow-sm'
              }`}
              onClick={() => setSelectedAppointment(slot)}
            >
              <p className="text-xs font-medium">{new Date(slot.days).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}</p>
              <p className="text-sm">{slot.startTime} - {slot.endTime}</p>
              <div className="mt-1">
                <span className="text-xs bg-purple-100 text-red-700 px-2 py-0.5 rounded-full">
                  {slot.availableSlot} slots
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {todayTomorrowSlots.length === 0 && (
          <p className="text-center text-gray-500 py-4">No slots available for today or tomorrow.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;