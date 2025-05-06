import React from 'react';
import doctor from '../assets/doctor.jpeg'

const HeroBanner = () => {
    return (
      <div className="relative bg-gradient-to-b from-[#2D8A8D] via-[#247373] to-[#1A5656] text-white p-8 rounded-lg mt-2 max-w-7xl mx-auto ">

        <div className="max-w-sm">
          <h1 className="text-3xl font-bold mb-2">Expert Doctors, Trusted Care</h1>
          <p className="text-sm opacity-80 mb-4">
            Our skilled doctors provide the comprehensive and specialized care you need for your health and well-being.
          </p>
          {/* You could add a CTA button here */}
          <button className="bg-white text-teal-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition">
            Find a Doctor
          </button>
        </div>

      </div>
    );
  };
  
  export default HeroBanner;