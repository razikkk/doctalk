import React from 'react';

interface AppointmentCardProps {
  name: string;
  imageUrl: string;
  specialization?: string;
  onClick: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ name, imageUrl, specialization, onClick }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-64 m-2 text-center">
      <img src={imageUrl} alt={name} className="w-24 h-24 object-cover rounded-full mx-auto  border-2 border-[#157B7B]" />
      <h3 className="text-lg font-semibold mt-2">{name}</h3>
      {specialization && <p className="text-gray-600 text-sm">{specialization}</p>}
      <button 
        onClick={onClick} 
        className="mt-3 px-4 py-2 bg-[#157B7B] text-white rounded hover:bg-[#106565] transition"
      >
        See Timings
      </button>
    </div>
  );
};

export default AppointmentCard;
