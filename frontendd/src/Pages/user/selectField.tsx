import React from 'react'
import doctor from '../../assets/registerDoctor.jpeg'
import { useNavigate } from 'react-router-dom'


const SelectField = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20 px-10 space-y-10">
    {/* Heading */}
   
  
    {/* Container for Image & Card */}
    <div className="flex items-center justify-center space-x-10">
      {/* Left Side - Image */}
      <div className="w-[300px] h-auto">
        <img 
          className="w-full h-auto rounded-[20px]" 
          src={doctor} 
          alt="service image" 
        />
      </div>
  
      {/* Right Side - Shadowed Card */}
      <div className="w-[450px] h-[300px] bg-white shadow-lg rounded-lg py-10 px-6 flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-400">Select a Field</h2>
        {/* Buttons */}
        <button className="px-6 py-3 bg-[#157B7B] text-white rounded-lg hover:opacity-80 w-full" onClick={()=>navigate('/doctor/register')}>
          Sign Up as Doctor
        </button>
        <button className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:opacity-80 w-full" onClick={()=>navigate('/register')}>
          Sign Up as Patient
        </button>
      </div>
    </div>
  </div>
  

  )
}

export default SelectField