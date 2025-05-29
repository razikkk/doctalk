import React, { useEffect, useState } from 'react'
import { ArrowLeft, Edit } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteSlot, fetchDoctorAppointment } from '../../utils/doctorAuth'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'
import { RiDeleteBin5Line } from "react-icons/ri";
import { Toaster, toast } from 'sonner'


interface ISlot {
  _id:string,
    startTime: string,
    endTime: string,
    availableSlot: number,
    days: string,
    consultingFees:number
    doctorId: {
        _id:string,
        name: string,
        imageUrl: string,
        specialization: {
            name: string
        }
    }
}

const AppointmentsDetails = () => {

    
    const formatTimeFor12Hour = (timeString: string) => {
        if (!timeString) return "";
        
        // If the time is already in format like "3:54pm", return it as is
        if (timeString.includes('am') || timeString.includes('pm')) {
            return timeString;
        }
        
        // Otherwise, try to parse it
        try {
            const [hours, minutes] = timeString.split(":");
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            
            // Format as h:mmam/pm without space between time and am/pm
            const formattedHour = date.getHours() % 12 || 12;
            const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
            const period = date.getHours() >= 12 ? 'pm' : 'am';
            
            return `${formattedHour}:${formattedMinutes}${period}`;
        } catch (error) {
            console.error("Error formatting time:", timeString);
            return timeString; // Return original string if parsing fails
        }
    };

    const [appointments, setAppointments] = useState<ISlot[]>([])
    const navigate = useNavigate()
    const doctorId = useSelector((state:RootState)=>state.doctorAuth.doctorId)
    const fetchAppointments = async () => {
      try {
          const response = await fetchDoctorAppointment(doctorId as string)
          console.log(response)
          if (response.success) {
              setAppointments(response.slotData)
          }
      } catch (error: any) {
          console.log(error.message)
      }
  }
    useEffect(() => {
        fetchAppointments()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        return `${dayName}, ${formattedDate}`;
    }

    const groupedByDay = appointments.reduce((acc: Record<string, ISlot[]>, curr) => {
        const formattedDay = formatDate(curr.days);
        if (!acc[formattedDay]) acc[formattedDay] = []
        acc[formattedDay].push(curr)
        return acc
    }, {})

    // const firstDoctor = appointments[0]?.doctorId
    
    const handleDelete = async(slotId:string)=>{
      try {
        const response = await deleteSlot(slotId)
        if(response.success){
          setAppointments(prev=>prev.filter(slot =>slot._id !==slotId))
          toast.success('Slot deleted successfully')
        }
      } catch (error:any) {
        console.log(error.message)
      }
    }


    return (
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md relative">
          <Toaster/>
            {/* Back Button */}
            <button
                onClick={() => navigate('/doctor/profile')}
                className="absolute right-6 top-6 text-[#157B7B] hover:text-[#0d5656] transition-colors"
                aria-label="Go back"
            >
                <ArrowLeft size={28} />
            </button>

            {/* <div className='flex items-center justify-between mt-4'>
                <p  className='text-lg font-medium text-gray-700'>Filter by:
            <input type="date" className='border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#157B7B]'  name="" id="" 
            value={selectedDate}
            onChange={(e)=>{
                const date = e.target.value
                setSelectedDate(date)
                filterSlots(date)
            }}
            />
            </p>
            </div> *

            <hr className="border-gray-200 my-6" />

            {/* Appointments Section */}
            <div className="rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Slots</h2>
                
                {Object.keys(groupedByDay).length > 0 ? (
                    Object.keys(groupedByDay).map((day) => (
                        <div key={day} className="mb-8">
                            <h3 className="text-lg font-semibold text-[#157B7B] mb-4 px-1">{day}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {groupedByDay[day].map((appointment, idx) => {
                                    {[...groupedByDay[day]].sort((a,b)=>new Date(b.startTime).getTime()-new Date(a.startTime).getTime())

                                    
                                    const today = new Date()
                                    today.setHours(0,0,0,0)
                                    const slotDate = new Date(appointment.days)
                                    slotDate.setHours(0,0,0,0)
                                    const isPast = slotDate<today
                                    return (
                                    <div
                                        key={idx}
                                        className={`relative min-h-[200px]   rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                                            isPast ? ' bg-gray-300 grayscale opacity-60 pointer-events-none' : ''
                                        }`}
                                    >
                            {!isPast && (
                <RiDeleteBin5Line 
                    size={20}
                    className="absolute top-3 right-5 text-[#157B7B] text-xl cursor-pointer"
                    onClick={()=>handleDelete(appointment._id)}
                    
                />
            )}
                                        <div className="space-y-2 pt-7">
                                                
                                            <p className="flex justify-between">
                                                <span className="font-medium">Start Time:</span>
                                                <span>{formatTimeFor12Hour(appointment.startTime)}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="font-medium">End Time:</span>
                                                <span>{formatTimeFor12Hour(appointment.endTime)}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="font-medium">Available Slots:</span>
                                                <span className="font-semibold text-[#157B7B]">
                                                    {appointment.availableSlot}
                                                </span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="font-medium">ConsultingFees:</span>
                                                <span className="font-semibold text-[#157B7B]">
                                                    {appointment.consultingFees}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    )}
})}
                            </div>
                        </div>
                        
                    ))
                ) : (
                    <p className="text-gray-500 ">No appointments scheduled</p>
                )}
            </div>



       
        </div>
    )
}

export default AppointmentsDetails