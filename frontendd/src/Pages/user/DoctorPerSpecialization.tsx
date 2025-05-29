import React, { useEffect, useState } from 'react'
import { findDoctorBySpecialization, userLogout } from '../../utils/auth'
import { useParams } from 'react-router-dom'
import DoctorCardDetails from '../../Components/DoctorDetailsCard';
import UserNav from '../../Components/UserNav';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/userSlice/userAuthSlice';
import SpecializationBanner from '../../Components/SpecializationBanner';

interface IDoctor{
    _id:string
    name:string,
    imageUrl: string;
  hospital: string;
  language: string;
  specialization: {
    name: string;
    image:string
  };
  experience: number;

}
const DoctorPerSpecialization = () => {
    const {specializationId} = useParams()
    const dispatch = useDispatch()
    const [doctors,setDoctors] = useState<IDoctor[]>([])

    useEffect(()=>{
        const fetchBySpecialization = async()=>{
            try {
                const response  = await findDoctorBySpecialization(specializationId as string)
                console.log(response,'ressss')
                if(response.success){
                    setDoctors(response.result)
                }
            } catch (error:any) {
                console.log(error.message)
            }
           
        }
        fetchBySpecialization()
    },[specializationId])
    const logingOut = async()=>{
        const response = await userLogout()
        if(response.success){
          dispatch(logout())
        }
      }
  return (
    <div>

   <UserNav logingOut={logingOut}/>
   
  <SpecializationBanner image={doctors[0]?.specialization?.image} name={doctors[0]?.specialization.name}/>

    <div className="flex flex-wrap gap-6 mt-20">
        {
            doctors.map((doc)=>
               <DoctorCardDetails key={doc._id} doctor={doc} />
            )
        }
       
    </div>
    </div>
  )
}

export default DoctorPerSpecialization