import React, { useEffect, useState } from 'react'
import { fetchDoctorAppointment, filteredSlots } from '../../utils/adminAuth'
import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

interface ISlot {
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

const AppointmentDetails = () => {
    
    const formatTimeFor12Hour = (timeString: string) => {
        if (!timeString) return "";
        
        if (timeString.includes('am') || timeString.includes('pm')) {
            return timeString;
        }
        
        try {
            const [hours, minutes] = timeString.split(":");
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            
            
            const formattedHour = date.getHours() % 12 || 12;
            const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
            const period = date.getHours() >= 12 ? 'pm' : 'am';
            
            return `${formattedHour}:${formattedMinutes}${period}`;
        } catch (error) {
            console.error("Error formatting time:", timeString);
            return timeString; 
        }
    };

    const [appointments, setAppointments] = useState<ISlot[]>([])
    const navigate = useNavigate()
    const location = useLocation()
    const selectedDoctorId = location.state?.doctorId
    const [selectedDate,setSelectedDate] = useState('')

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetchDoctorAppointment()
                if (response.success) {
                    const filteredAppointments = response.doctorAppointment.filter(
                        (appointment:ISlot) =>appointment.doctorId._id === selectedDoctorId
                    )
                    setAppointments(filteredAppointments)
                }
            } catch (error: any) {
                console.log(error.message)
            }
        }
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

    const firstDoctor = appointments[0]?.doctorId

    const filterSlots = async(date:string)=>{
        try {
            
            const response = await filteredSlots(date,selectedDoctorId)
            setAppointments(response.filteredSlots)
        } catch (error:any) {
            console.log(error.message)
        }
    }

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md relative">
            <button
                onClick={() => navigate('/admin/appointments')}
                className="absolute right-6 top-6 text-[#157B7B] hover:text-[#0d5656] transition-colors"
                aria-label="Go back"
            >
                <ArrowLeft size={28} />
            </button>

            <div className='flex items-center justify-between mt-4'>
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
            </div>

            {firstDoctor && (
                <div className="mt-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <img
                            src={firstDoctor.imageUrl}
                            alt={`Dr. ${firstDoctor.name}`}
                            className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover"
                        />
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-semibold">Dr. {firstDoctor.name}</h1>
                            {firstDoctor.specialization?.name && (
                                <p className="text-lg font-medium text-[#157B7B]">
                                    {firstDoctor.specialization.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <hr className="border-gray-200 my-6" />

            {/* Appointments Section */}
            <div className="rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Appointments</h2>
                
                {Object.keys(groupedByDay).length > 0 ? (
                    Object.keys(groupedByDay).map((day) => (
                        <div key={day} className="mb-8">
                            <h3 className="text-lg font-semibold text-[#157B7B] mb-4 px-1">{day}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {groupedByDay[day].map((appointment, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="space-y-2">
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
                                ))}
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

export default AppointmentDetails