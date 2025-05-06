import React from "react";
import Doctor from "../../src/assets/draf.jpeg";


type Doctor={
  _id:string,
  name:string,
  imageUrl:string,
  specialization:{
    name:string
  },
  experience:number,
  gender:string
}

type DoctorCardProps = {
  doctor:Doctor
}

const DoctorCard : React.FC<DoctorCardProps>=({ doctor }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 text-center w-full h-auto" key={doctor._id}>
      {/* Doctor Image - Rounded - Reduced size */}
      <img
        src={doctor.imageUrl}
        alt="Doctor"
        className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-[#157B7B]"
      />

      {/* Doctor Name - Smaller text */}
      <h6 className="text-lg font-semibold text-[#157B7B] mt-2">
        {doctor.name}
      </h6>

      {/* Doctor Details - Reduced spacing and text size */}
      <div className="mt-1 text-gray-600 text-sm">
        <p>→ Specialization : {doctor.specialization?.name}</p>
        <p>→ Experience :  {doctor.experience}</p>
        {/* <p>→ Available for Online Consultation</p> */}
        {/* <p>→ Trusted by 5000+ Patients</p> */}
        <p>→ Gender : {doctor.gender}</p>
      </div>
    </div>
  );
};

export default DoctorCard;
