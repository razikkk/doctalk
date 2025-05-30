import  { useEffect, useState } from 'react'
import {  approveDoctor, blockAndUnblockDoctor, fetchDoctorReview, getDoctorById } from '../../utils/adminAuth'
import { useNavigate, useParams } from 'react-router-dom'
import { FaIdBadge, FaFileMedical } from "react-icons/fa";
import { GrPrevious } from "react-icons/gr";
import { TbStethoscope,TbStethoscopeOff } from "react-icons/tb";
import CustomConfirmAlert from '../../Components/ConfirmAlert';
import { Toaster, toast } from 'sonner';
import profile from '../../assets/testimonial.jpeg'




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

    interface IReview{
      rating:number,
      review:string,
      createdAt:Date,
      userId:{
        name:string
      }
    }
    const {doctorId} = useParams()
    const [doctor,setDoctor] = useState<Doctor | null>(null)
    const [loading,setLoading] = useState(false)
    const [showMedicalProof, setShowMedicalProof] = useState(false);
    const [showIdentityProof, setShowIdentityProof] = useState(false);
    const [showDoctorAlert,setShowDoctorAlert] = useState<boolean>(false)
    const [isDoctorBlocked,setIsDoctorBlocked] = useState<boolean>(false)
    const [reviews,setReviews] = useState<IReview[]>([])
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

    useEffect(()=>{
      const fetchReviews = async()=>{
        try {
          const response = await fetchDoctorReview(doctorId as string)
          if(response.success){
            setReviews(response.result)
          }
        } catch (error:any) {
          console.log(error.message)
        }
      }
      fetchReviews()
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
        if (response && response.success) {
          setTimeout(()=>{
            toast.success(response.message || `Doctor ${status}`);
          },1000)
          navigate('/admin/doctors');
      } else {
          alert(response?.message || "Operation failed");
      }
    }

    const handleBlockAndUnblock = ()=>{
      if(!doctorId || !doctor) return
        setIsDoctorBlocked(doctor?.isBlocked)
        setShowDoctorAlert(true)
      
    }

    const handleDoctorConfirm = async()=>{
     
      if(!doctorId) return 
      try {
        const response = await blockAndUnblockDoctor(doctorId)
        if(response.success){
          setDoctor((prev)=> prev ? {...prev,isBlocked:!prev.isBlocked} : null) //prev represents the current state of doctor before updating.
          //{ ...prev } spreads all properties of prev into a new object.
          // ppo prev null aanegil appo {...prev} will cause eror
        }
      } catch (error:any) {
        console.log(error.message)
      }finally{
        setShowDoctorAlert(false)
      }
     
    }
    const handleModalCancel = ()=>{
      setShowDoctorAlert(false)
    }

  return (
    
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md bg-gray-20 relative">
      <Toaster/>
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
      <div className="relative p-6 rounded-lg mt-6">
  <h2 className="text-xl font-semibold mb-4">Reviews</h2>
  <div className="relative p-6 rounded-lg mt-6">
  {
    reviews.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {reviews.map((rev, index) => (
          <div key={index} className="flex items-start gap-3 self-start">
            {/* Profile Circle */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold overflow-hidden">
              <img src={profile} alt="" className="rounded-full w-full h-full object-cover" />
            </div>

            {/* Comment Bubble */}
            <div className="relative bg-white shadow-md rounded-xl p-4 w-full before:content-[''] before:absolute before:-left-2 before:top-4 before:w-0 before:h-0 before:border-t-8 before:border-b-8 before:border-r-8 before:border-t-transparent before:border-b-transparent before:border-r-white">
            <div className="flex justify-between items-center mb-1">
  <h3 className="text-base font-semibold text-gray-900">{rev?.userId?.name}</h3>
  <p className="text-sm text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
</div>
              {[...Array(5)].map((_, i) => (
    <span key={i} className={i < rev.rating ? "text-yellow-500" : "text-gray-300"}>
      ★
    </span>
  ))}
              <p className="text-sm text-gray-800 break-words leading-relaxed">{rev.review}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No reviews</p>
    )
  }
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
  {
    showDoctorAlert && (
      <CustomConfirmAlert
      isCurrentlyBlocked={isDoctorBlocked}
      onConfirm={handleDoctorConfirm}
      onCancel={handleModalCancel}
      />
    )
  }
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