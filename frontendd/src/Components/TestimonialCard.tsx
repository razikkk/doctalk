import React from 'react';
import testimonial from '../../src/assets/testimonial.jpeg'

const TestimonialCard = () => {
  return (
    <div className='w-[400px] h-auto bg-white shadow-lg rounded-lg p-6 overflow-hidden'>

<div className='w-4 h-4 bg-[#157B7B] clip-star'></div>
      {/* Image & Text */}
      <div className='flex flex-col items-center mt-4'>
        {/* Image */}
        <img
          className='w-20 h-20 object-cover rounded-full border-2 border-[#157B7B]' 
          src={testimonial} 
          alt="Doctor"
        />

        {/* Description */}
        <p className='text-xs text-gray-500 text-center mt-3'>
         Very Good Consulting and user freindly Platform. Must Visit! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse ducimus mollitia animi cupiditate, dolores delectus cum quam unde alias, recusandae exercitationem error! Dicta ducimus voluptates fugit. Perferendis, ab! Nisi, delectus.
        </p>
      </div>
      
    </div>
  );
};

export default TestimonialCard;
