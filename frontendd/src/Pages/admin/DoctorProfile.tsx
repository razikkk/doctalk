import  { useEffect, useState } from 'react'
import {  approveDoctor, blockAndUnblockDoctor, getDoctorById } from '../../utils/adminAuth'
import { useNavigate, useParams } from 'react-router-dom'
import { FaIdBadge, FaFileMedical } from "react-icons/fa";
import { GrPrevious } from "react-icons/gr";
import { TbStethoscope,TbStethoscopeOff } from "react-icons/tb";



const DoctorProfile = () => {
  interface ISpecialization {
    _id:string,
    name:string
  }
    interface Doctor {
        _id:string,
        imageUrl?:string,
        name:string,
        specialization:ISpecialization,
        language:string,
        hospital:string,
        experience:number,
        status:string,
        about:string,
        medicalCertificateUrl:string,
        identityProofUrl:string,
        isActive:string,
        isBlocked:boolean

    }
    const {doctorId} = useParams()
    const [doctor,setDoctor] = useState<Doctor | null>(null)
    const [loading,setLoading] = useState(false)
    const [showMedicalProof, setShowMedicalProof] = useState(false);
    const [showIdentityProof, setShowIdentityProof] = useState(false);
    const navigate = useNavigate()

    useEffect(()=>{
        if(!doctorId) return
        const fetchAllDoctors = async()=>{
            try {
                const response = await getDoctorById(doctorId)
                console.log(response,'dfd')
                if(response && response.success){
                    setDoctor(response.doctor)
                }

            } catch (error) {
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchAllDoctors()

    },[doctorId])

    if(loading) {
        <p>Loading....</p>
    }
    if(!doctor){
        <p>Doctor Not found</p>
    }

    const handleApproval = async(status: "approved" | "rejected")=>{
        if(!doctorId) return
        console.log(doctorId,'docr')
        const response = await approveDoctor(doctorId,status)
        // console.log(response)
        if (response && response.success) {
          alert(response.message || `Doctor ${status}`);
          navigate('/admin/doctors');
      } else {
          alert(response?.message || "Operation failed");
      }
    }

    const handleBlockAndUnblock = async()=>{
     
      if(!doctorId) return 
      const confirmMessage = confirm(
        doctor?.isBlocked ? "Are you sure you want to unblock this doctor?" : "Are you sure you want to block this doctor?"
      )
      if(!confirmMessage) return //ppo cancel nekkanel ee function angott nirthaan
      const newStatus = doctor?.isBlocked ? "unblock" : "block"
      const response = await blockAndUnblockDoctor(doctorId)
      if(response.success){
        setDoctor((prev)=> prev ? {...prev,isBlocked:!prev.isBlocked} : null) //prev represents the current state of doctor before updating.
        //{ ...prev } spreads all properties of prev into a new object.
        // ppo prev null aanegil appo {...prev} will cause eror
        

      }
    }

  return (
    
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md bg-gray-20 relative">
      {/* Doctor Info */}
      <GrPrevious onClick={()=>navigate('/admin/doctors')} className='absolute  right-[40px] text-[#157B7B] font-extrabold text-3xl cursor-pointer'/>

      <div className=" p-6 rounded-lg">
        <div className="flex items-center gap-6">
          <img
            src={doctor?.imageUrl}
            alt="Doctor"
            className="w-28 h-28 rounded-full border-2 border-gray-300"
          />
          <div>
            <h1 className="text-xl font-semibold">Dr {doctor?.name}</h1>
            <p className="text-l font-semibold text-[#157B7B]">{doctor?.specialization?.name}</p>
            <p className="text-sm text-gray-500">Language : {doctor?.language}</p>
            <p className="text-sm text-gray-500">Hospital : {doctor?.hospital}</p>
            <p className="text-sm text-gray-500">Experience : {doctor?.experience} years</p>
            <p className="text-sm font-medium text-gray-500">
  Status: <span className={`${doctor?.isActive === "rejected" ? "text-red-500" : doctor?.isActive === "approved" ? "text-green-500" : "text-yellow-500"}`}>
    {doctor?.isActive}
  </span>
</p>

          </div>
        </div>
      </div>
      <hr className='text-gray-200'/>

      {/* About Section */}
      <div className="p-6 rounded-lg mt-6">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="text-gray-500">{doctor?.about}</p>
      </div>
      <hr className='text-gray-200'/>

      {/* Reviews Section */}
      <div className="p-6 rounded-lg mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="mt-2 p-4 bg-white rounded-lg shadow-md ">
          <p className="font-bold">Razik ⭐⭐⭐⭐⭐</p>
          <p className="text-gray-600">Highly recommended, great doctor</p>
        </div>
      </div>
      <hr className='text-gray-200'/>

      {/* Achievements Section */}
      <div className="p-6 rounded-lg mt-6">
        <h2 className="text-xl font-semibold">Achievements</h2>
        <div className="mt-6 flex gap-4">
        <button onClick={() => setShowMedicalProof(true)} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg">
          <FaFileMedical size={20} /> Medical Proof
        </button>
        <button onClick={() => setShowIdentityProof(true)} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg">
          <FaIdBadge size={20} /> Identity Proof
        </button>
      </div>
      <div className="absolute right-4 flex gap-4">
  {doctor?.isActive === "pending" ? (
    <>
      <TbStethoscope
        className="bg-[#339551] p-2 shadow-lg text-5xl text-white rounded-lg"
        onClick={() => handleApproval("approved")}
      />
      <TbStethoscopeOff
        className="bg-[#F16838] p-2 shadow-lg text-5xl text-white rounded-lg"
        onClick={() => handleApproval("rejected")}
      />
    </>
  ) : (
    <div></div>
  )}
  {doctor?.isActive === "approved" && (
    <button className="bg-[#157B7B] text-white px-4 py-2 rounded hover:bg-[#0f5e5e]" onClick={handleBlockAndUnblock}>
      {doctor.isBlocked ? "Unblock" : "Block"}
    </button>
  )}
</div>
      </div>


      {/* Medical & Identity Proof */}
     

      {/* Proof Modals */}
      {showMedicalProof && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <img src={doctor?.medicalCertificateUrl} alt="Medical Proof" className="max-w-sm rounded-lg" />
            <button onClick={() => setShowMedicalProof(false)} className="mt-2 bg-red-500 px-4 py-2 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {showIdentityProof && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <img src={doctor?.identityProofUrl} alt="Identity Proof" className="max-w-sm rounded-lg" />
            <button onClick={() => setShowIdentityProof(false)} className="mt-2 bg-red-500 px-4 py-2 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
     


    </div>
  );
}

export default DoctorProfile