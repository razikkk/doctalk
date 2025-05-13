import React from 'react';
import { Star, MessageSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type doctor ={
  _id: string;
  name:string,
  imageUrl:string,
  hospital:string,
  language:string,
  specialization:{
    name:string
  },
  experience:number
}
interface DoctorCardProps {
  doctor: doctor;
}

const DoctorCardDetails: React.FC<DoctorCardProps> = ({ doctor }) => {
  
    const navigate = useNavigate()

  return (
<div className="relative bg-white rounded-xl shadow-md flex flex-col w-[350px] h-[350px] overflow-hidden hover:shadow-lg transition-transform hover:translate-y-[-4px]">
<button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
      <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
    </button>
  {/* Profile Image Section */}
  <div className="relative w-[100px] h-[100px]  mx-auto mt-6 mb-4">
    <img 
      src={doctor.imageUrl} 
      alt='' 
      className="w-[100px] h-[100px] object-cover rounded-full border-4 border-gray-200 mx-auto"
    />
    
  </div>

  {/* Right Content Section */}
  <div className="flex flex-col justify-between px-6 pb-6">
    <h3 className="text-base font-semibold text-center" style={{ color: "rgba(12, 11, 62, 0.73)" }}>Dr {doctor.name}</h3>
    <span className="text-sm text-teal-700 font-medium block text-center">{doctor.specialization.name}</span>
    <p className="text-sm font-medium mt-2 text-center" style={{ color: "rgba(12, 11, 62, 0.73)" }}>Hospital: <span>{doctor.hospital}</span></p>
    <p className="text-sm font-medium text-center" style={{ color: "rgba(12, 11, 62, 0.73)" }}>Language: <span>{doctor.language}</span></p>
    <p className="text-sm font-medium text-center" style={{ color: "rgba(12, 11, 62, 0.73)" }}>Experience:  <span>{doctor.experience} yrs</span></p>

    <div className="flex justify-between items-center mt-4">
      <button className="px-3 py-1 bg-teal-700 text-white text-sm rounded hover:bg-teal-800 transition w-full" onClick={()=>navigate(`/users/appointments/${doctor._id}`)}>
        Book Now
      </button>
    </div>

    {/* Rating Section */}
    <div className="flex items-center gap-1 justify-center mt-2">
      {[1].map((star) => (
        <Star 
          key={star} 
          className="h-4 w-4 text-[#157B7B] fill-[#157B7B]" 
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">4.5/5</span>
    </div>
  </div>

</div>

  );
};

export default DoctorCardDetails;