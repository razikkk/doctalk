import React, { useEffect, useState } from 'react'
import { ArrowLeft, Edit } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchDoctorAppointment } from '../../utils/doctorAuth'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'

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
    const [showEditModal,setShowEditModal] = useState(false)
    const [editForm,setEditForm] = useState<ISlot[] | null>(null)

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetchDoctorAppointment(doctorId as string)
                console.log(response)
                if (response.success) {
                    setAppointments(response.slotData)
                    setEditForm(response.slotData)
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

    // const firstDoctor = appointments[0]?.doctorId



    return (
        <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md relative">
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
                <h2 className="text-2xl font-semibold mb-6">Appointments</h2>
                
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
                <Edit
                    size={20}
                    className="absolute top-5 right-5 text-[#157B7B] text-xl cursor-pointer"
                    onClick={()=>{setShowEditModal(true);setEditForm(appointment)}}
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



            {showEditModal && (
  <div className="fixed inset-0 flex backdrop-brightness-30 items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Appointment Details</h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          // handle submit logic here
        }}
      >
        {/* Date */}

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={editForm?.startTime}
            onChange={(e) => setEditForm((prev) => ({ ...prev!, startTime: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
          <p>{editForm?.startTime}</p>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            name="endTime"
            value={editForm?.endTime || ''}
            onChange={(e) => setEditForm((prev) => ({ ...prev!, endTime: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
        </div>

        {/* Token Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Token Count</label>
          <input
            type="number"
            name="availableSlot"
            value={editForm?.availableSlot || 0}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev!,
                availableSlot: parseInt(e.target.value) || 0,
              }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Consultation Fee (₹)</label>
          <input
            type="number"
            name="consultingFees"
            value={editForm?.consultingFees || 0}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev!,
                consultingFees: parseInt(e.target.value) || 0,
              }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-[#157B7B] rounded-md hover:bg-[#0d5656] transition-colors"
          >
            Save Appointment
          </button>
        </div>
      </form>
    </div>
  </div>
)}
        </div>
    )
}

export default AppointmentsDetails