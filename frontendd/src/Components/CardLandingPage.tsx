import React from 'react';
import '../App.css';
import serviceImg from '../../src/assets/serviceImg.jpg';

const CardLandingPage = () => {
  return (
    <div className='w-[400px] h-[230px] bg-white shadow-lg rounded-lg p-4'>

      <div className='flex justify-start items-center'>
        <div className='w-4 h-4 bg-[#157B7B] clip-star'></div>
        
        <h3 className='text-[#157B7B] font-bold ml-30'>
          Virtual Consultation
        </h3>
        
      </div>

      <div className='flex justify-start items-center w-full mt-4'>

        <div className='flex justify-start'>
          <img
            className='w-[500px] h-auto rounded-[20px]' 
            src={serviceImg}
            alt="service image"
          />
        </div>

        <div className='ml-6 flex flex-col justify-start'>
          <p className='text-xs text-gray-400 w-[calc(100%-60px)]'>
            Access professional medical advice anytime,  anywhere through our virtual consultation service.
             Whether you have a simple question or need in-depth guidance, 
             our certified doctors are ready to assist you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardLandingPage;
