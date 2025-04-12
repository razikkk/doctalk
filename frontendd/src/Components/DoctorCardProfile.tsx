import React from 'react';

type DoctorProfileCardProps = {
  name: string;
  imageUrl: string;
//   totalAppointments: number;
//   finished: number;
//   pending: number;
}
type Doctor ={
    doctor:DoctorProfileCardProps | undefined
}

const DoctorProfileCard: React.FC<Doctor> = ({doctor}) => {
    console.log(doctor)
//   const maxAppointments = totalAppointments;
//   const finishedPercentage = (finished / maxAppointments) * 100;
//   const pendingPercentage = (pending / maxAppointments) * 100;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-2">
        {doctor?.imageUrl ? (
             <img
             src={doctor.imageUrl}
             alt="Doctor Profile"
             className="w-20 h-20 rounded-full object-cover"
           />
        ):(
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
       
        <h2 className="text-lg font-semibold">{doctor?.name || "hy"}</h2>
        <a href="#" className="text-sm text-teal-600 underline">
          view profile
        </a>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xl font-medium">150 Appointments</p>

        <div className="mt-4 space-y-3">
          <ProgressBar label="Total Appointments" value={10} max={70} />
          <ProgressBar label="Finished" value={21} max={40} />
          <ProgressBar label="Pending" value={22} max={40} />
        </div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string; value: number; max: number }> = ({ label, value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div className="h-2 bg-indigo-900 rounded-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default DoctorProfileCard;
