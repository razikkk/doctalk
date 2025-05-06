// components/AddSlotModal.jsx
import React, { useEffect, useState } from 'react';
import { addSlots } from '../utils/doctorAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface ISlot {
    days:Date
    startTime:string,
    endTime:string,
    availableSlot:number,
    consultingFees:number
}
type ModalProps = {
    isOpen : boolean,
    onClose : ()=>void
}
const AddSlotModal:React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [newSlot,setNewSlot] = useState<ISlot>({
        days:new Date(),
        startTime:'',
        endTime:'',
        availableSlot:0,
        consultingFees:0
    })
      const [displayData, setDisplayData] = useState({
    formattedDate: "",
    dayOfWeek: ""
  });
    const doctorId = useSelector((state:RootState)=>state.doctorAuth.doctorId)
    const slotWithDoctorId = {
        ...newSlot,
        doctorId
    }
    const [error,setError] = useState({
      date:'',
      startTimeAndEndTime:'',
      availableSlots:'',
      consultaionFees:''
    })
  



  // Update formatted date and day of week whenever days changes
  useEffect(() => {
    if (newSlot?.days instanceof Date && !isNaN(newSlot.days.getTime())) {
      const date = newSlot.days;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear().toString().slice(-2);
      const shortDate = `${day}/${month}/${year}`;
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  
      setDisplayData({
        formattedDate: shortDate,
        dayOfWeek: dayOfWeek
      });
    }
  }, [newSlot?.days]);


  const addSlot = async(e:React.FormEvent)=>{
    console.log('dd')
    e.preventDefault()
    const today = new Date()
    today.setHours(0,0,0,0)
    const selectedDate  = new Date(newSlot.days)
    selectedDate.setHours(0,0,0,0)

    if(selectedDate<today){
      setError(prev=>({
        ...prev,
        date:`Can't add slots before ${new Date().toLocaleDateString()}`
      }))
      return
    }
    if(!newSlot.startTime || !newSlot.endTime){
      setError(prev=>({
        ...prev,
        startTimeAndEndTime:"Start and End time are required"
      }))
      return
    }
    if(newSlot.startTime >= newSlot.endTime ){
      setError(prev=>({
        ...prev,
        startTimeAndEndTime:"Start time cannot be greater than endTime"
      }))
      return
    }
    if(!newSlot.availableSlot){
      setError(prev=>({
        ...prev,
        availableSlots:"Slot cannot be empty"
      }))
      return
    }
    if(newSlot.availableSlot < 1){
      setError(prev=>({
        ...prev,
        availableSlots:"Slot cannot be less than 1"
      }))
      return
    }
    if(!newSlot.consultingFees){
      setError(prev=>({
        ...prev,
        consultaionFees:"Fees cannot be empty"
      }))
      return
    }
    if(newSlot.consultingFees<10){
      setError(prev=>({
        ...prev,
        consultaionFees:"Fees should be 10 or greater than 10rs"
      }))
      return
    }
    try {
        const response = await addSlots(slotWithDoctorId)
        if(response && response.success){
            setNewSlot(response.Slot)
            onClose()
        }

    } catch (error:any) {
        console.log(error.message)
    }
  }

  useEffect(()=>{
    if(isOpen){
      setError({
        date:'',
        startTimeAndEndTime:'',
        consultaionFees:'',
        availableSlots:''
      })
    }
  },[])

  const formatTimeFor12Hour = (timeString:string) => {
    if (!timeString) return "";
    
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    
    // Format as h:mmam/pm without space between time and am/pm
    const formattedHour = date.getHours() % 12 || 12;
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'pm' : 'am';
    
    return `${formattedHour}:${formattedMinutes}${period}`;
  };
  if (!isOpen) return null;


 

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Slot</h2>
        
        <form onSubmit={addSlot}>
          <div className="mb-4">
            <label className="block font-medium">Date</label>
            <input 
  type="date" 
  className="w-full border rounded p-2"
  value={newSlot?.days ? newSlot.days.toISOString().split('T')[0] : ''}
  onChange={(e) => {
    const value = e.target.value;
    if (value) {
      setNewSlot(prev => ({ ...prev, days: new Date(value) }));
    }
  }}
/>
{error.date && <p className='text-red-500 text-sm '>{error.date}</p>}
            {displayData.formattedDate && (
              <p className="text-sm text-gray-600 mt-1">
                {displayData.formattedDate} ({displayData.dayOfWeek})
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block font-medium">Start Time</label>
            <input 
              type="time" 
              className="w-full border rounded p-2"
              value={newSlot?.startTime.includes(":") ? newSlot.startTime : ""}
              onChange={(e) => {
                const timeString = e.target.value;
                const formattedTime = formatTimeFor12Hour(timeString);
                setNewSlot(prev => ({ ...prev, startTime: formattedTime }));
              }}
            />
            
            {newSlot.startTime && (
              <p className="text-sm text-gray-600 mt-1">
                {newSlot.startTime}
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block font-medium">End Time</label>
            <input 
              type="time" 
              className="w-full border rounded p-2"
              value={newSlot?.endTime.includes(":") ? newSlot.endTime : ""}
              onChange={(e) => {
                const timeString = e.target.value;
                const formattedTime = formatTimeFor12Hour(timeString);
                setNewSlot(prev => ({ ...prev, endTime: formattedTime }));
              }}
            />
            {error.startTimeAndEndTime && <p className='text-red-500 text-sm'>{error.startTimeAndEndTime}</p>}
            {newSlot.endTime && (
              <p className="text-sm text-gray-600 mt-1">
                {newSlot.endTime}
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block font-medium">Available Slots</label>
            <input 
              type="number" 
              className="w-full border rounded p-2"
              value={newSlot?.availableSlot}
              onChange={(e) => setNewSlot(prev => ({ 
                ...prev, 
                availableSlot: Number(e.target.value) 
              }))}
            />
            {error.availableSlots && <p className='text-red-500 text-sm'>{error.availableSlots}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block font-medium">ConsultingFees</label>
            <input 
              type="number" 
              className="w-full border rounded p-2"
              value={newSlot?.consultingFees}
              onChange={(e) => setNewSlot(prev => ({ 
                ...prev, 
                consultingFees: Number(e.target.value) 
              }))}
            />
            {error.consultaionFees && <p className='text-red-500 text-sm'>{error.consultaionFees}</p>}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSlotModal;
