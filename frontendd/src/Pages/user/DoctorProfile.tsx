import React, { useEffect, useState } from 'react';
import { Camera, Edit, Mail, MapPin, Phone } from 'lucide-react';
import { fetchDoctorProfile, fetchDoctorReview } from '../../utils/auth';
import { LiaTransgenderSolid } from "react-icons/lia";
import ReviewRating from '../../Components/ReviewRating';
import { MdReviews } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import EditReviewRating from '../../Components/EditReviewModal';

interface IDoctor {
    _id:string
    name: string,
    specialization: {
        name: string
    },
    email: string,
    gender: string,
    hospital: string
    imageUrl: string
}

interface IReview {
    rating: number;
    review: string;
    createdAt: string;
    userId:{
        _id:string
    }
}

const UserDoctorProfile = () => {
    const [doctor, setDoctor] = useState<IDoctor | null>()
    const [reviews, setReviews] = useState<IReview[]>([])
    const userId = localStorage.getItem('userId') 
    console.log(userId,'iinlocal')
    const [reviewModal, setReviewModal] = useState(false)
    const [editReviewModal,setEditReviewModal] = useState(false)
    const [selectedReview,setSelectedReview] = useState(null)
    const {doctorId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const DoctorProfile = async() => {
            const response = await fetchDoctorProfile(doctorId as string)
            console.log(response)
            if(response.success){
                setDoctor(response.result)
            }
        }
        DoctorProfile()
    },[doctorId])

    useEffect(()=>{
        const fetchedReview = async()=>{
            try {
                const response = await fetchDoctorReview(doctorId as string)
                console.log(response.result,'usee in response')
                if(response.success){
                    setReviews(response.result)
                }
            } catch (error:any) {
                console.log(error.message)
            }
        }
        fetchedReview()
    },[doctorId])


    return (
        <div className="max-w-5xl mx-auto">
            {doctor && (
  <button
  onClick={() => {
    console.log(doctor._id,'dd')
    navigate(`/user/message/${doctor._id}`);
  }}
>
  Chat
</button>
)}
           

            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-[#157B7B] to-[#0f5f5f]">
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={doctor?.imageUrl}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Profile Details */}
                <div className="pt-20 px-8 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">{doctor?.name}</h2>
                            <p className="text-gray-600">{doctor?.specialization.name}</p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Mail className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{doctor?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Hospital</p>
                                    <p className="font-medium">{doctor?.hospital}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <LiaTransgenderSolid className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Gender</p>
                                    <p className="font-medium">{doctor?.gender}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="px-8 pb-8">
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Patient Reviews</h3>
                            <button
                                onClick={() => setReviewModal(true)}
                                className="p-3 bg-[#157B7B] text-white rounded-full hover:bg-[#106767] transition-colors"
                            >
                                <MdReviews size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
  {reviews.length > 0 ? (
    reviews.map((review, index) => (
      <div key={index} className="bg-gray-50 rounded-lg p-4">
        {/* Top row: stars + date + edit icon */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          {review.userId._id === userId && (
            <Edit
              size={20}
              className="text-[#157B7B] cursor-pointer"
              onClick={()=>{console.log('clci'); setEditReviewModal(true); setSelectedReview(review);}}
              
            />
          )}
        </div>

        <p className="text-gray-700">{review.review}</p>
      </div>
    ))
  ) : (
    <div className="text-center py-8 text-gray-500">
      No reviews yet
    </div>
  )}
</div>
                    </div>
                </div>
            </div>

            {reviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative">
                        <button
                            onClick={() => setReviewModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <ReviewRating onClose={() => setReviewModal(false)} />
                    </div>
                </div>
            )}
            {
                editReviewModal && selectedReview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative">
                        <button
                            onClick={() => setEditReviewModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <EditReviewRating reviews={selectedReview} onClose={()=>setEditReviewModal(false)}/>
                      
                    </div>
                </div>
                )
            }
        </div>
    );
}

export default UserDoctorProfile;