import React, { useCallback, useEffect, useRef, useState } from 'react'
import {  fetchDoctors, fetchSpecialization, userLogout } from '../../utils/auth'
import SpecializationCard from '../../Components/SpecialisationCard'

import UserNav from '../../Components/UserNav'
import HeroBanner from '../../Components/HeroBanner'
import DoctorCard from '../../Components/DoctorDetailsCard'
import Footer from '../../Components/UserFooter'
import { Pagination, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { logout } from '../../Redux/userSlice/userAuthSlice'



const DoctorDetails = () => {
  interface IDoctor {
    name: string 
    imageUrl: string
    specialization: ISpecialization
    language: string
    hospital: string
    experience: number
  }

  interface ISpecialization {
    name: string;
    image: string;
  }

  const [doctors, setDoctors] = useState<IDoctor[]>()
  const [specializations, setSpecializations] = useState<ISpecialization[]>()
  const dispatch = useDispatch()
  

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetchDoctors()
        // console.log(response)
        setDoctors(response.data.doctor)
      } catch (error: any) {
        console.log(error.message)
      }
    }
    fetchDoctor()
  }, [])

  useEffect(()=>{
    const fetchedSpecialization = async()=>{
      try {
        const response = await fetchSpecialization()
        console.log(response,'gg')
        setSpecializations(response.specializationData)
      } catch (error:any) {
        console.log(error.message,'jj')
      }
    }
    fetchedSpecialization()
  },[])

  const logingOut = async()=>{
    const response = await userLogout()
    if(response.success){
      dispatch(logout())
    }
  }

 

  return  (
    <div className="bg-white min-h-screen flex flex-col">

      <UserNav logingOut={logingOut}/>

      <div className="pt-20 px-6 "> 
        <HeroBanner />
        <div className="mt-9">
      <h2 className="text-2xl font-semibold" style={{ color: '#157B7B' }}>
        Choose Your Speciality
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-10">
        {specializations?.map((specialization) => (
          <SpecializationCard 
            key={specialization.name}
            name={specialization.name}
            image={specialization.image}
          />
        ))}
      </div>
      
    </div>
    
    <div className="mt-20">
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4'>

     
  <h2 className="text-2xl font-semibold mb-4" style={{ color: '#157B7B' }}>
    Top Doctors
  </h2>
  <input type="text" 
        placeholder='Search by doctor'
        className='px-4 py-2 border border-gray-300 rounded-md w-full md:w-[250px]'
         />
 </div> 
 <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 bg-white p-6 rounded-xl '>

{/* Rating Filter */}
<select className='px-4 py-2 border border-gray-300 rounded-md bg-white text-black transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#157B7B] hover:border-[#157B7B]'>
  <option value="">Rating</option>
  <option value="5">5 Stars</option>
  <option value="4">4 Stars & Up</option>
  <option value="3">3 Stars & Up</option>
</select>

{/* Language Filter */}
<select className='px-4 py-2 border border-gray-300 rounded-md bg-white text-black transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#157B7B] hover:border-[#157B7B]'>
  <option value="">Language</option>
  <option value="english">English</option>
  <option value="hindi">Hindi</option>
  <option value="tamil">Tamil</option>
</select>

{/* Experience Filter */}
<select className='px-4 py-2 border border-gray-300 rounded-md bg-white text-black transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#157B7B] hover:border-[#157B7B]'>
  <option value="">Experience</option>
  <option value="0-5">0–5 years</option>
  <option value="5-10">5–10 years</option>
  <option value="10+">10+ years</option>
</select>

{/* Gender Filter */}
<select className='px-4 py-2 border border-gray-300 rounded-md bg-white text-black transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#157B7B] hover:border-[#157B7B]'>
  <option value="">Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>

{/* Fees Filter */}
<select className='px-4 py-2 border border-gray-300 rounded-md bg-white text-black transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#157B7B] hover:border-[#157B7B]'>
  <option value="">Fees</option>
  <option value="0-500">₹0 - ₹500</option>
  <option value="500-1000">₹500 - ₹1000</option>
  <option value="1000+">₹1000+</option>
</select>

</div>
  
  <div className="flex flex-wrap gap-6">
    {doctors?.map((doc) => (
      <DoctorCard key={doc.name} doctor={doc} />
    ))}
  </div>
</div>
      </div>
      
<Pagination count={10}  className='flex  justify-center mt-5'/>
    <div className='mt-40'>

      <Footer/>
    </div>
    </div>
  );
}

export default DoctorDetails
