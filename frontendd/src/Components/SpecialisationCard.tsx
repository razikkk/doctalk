import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SpecializationCardProps {
  name: string;
  image: string;
}

const SpecializationCard: React.FC<SpecializationCardProps> = ({ name, image }) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef?.current?.scrollBy({ left: -320, behavior: "smooth" }); // Adjust scroll amount if needed
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };
  

   
  return (
    <div className="flex flex-col  px-6 py-6 rounded-full w-40 h-50 ml-30 mt-5">
      
       <button
          onClick={scrollLeft}
          className="bg-white shadow-lg p-3 rounded-full absolute left-[40px] mt-[50px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#157B7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
     <div className="w-24 h-24 rounded-full  overflow-hidden mb-7 bg-gradient-to-b from-[#2D8A8D] to-white" ref={carouselRef}>
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-base font-semibold text-[#157B7B] text-center">{name}</p>
      <button
          onClick={scrollRight}
          className="bg-white shadow-lg p-3 rounded-full absolute right-[40px] mt-[50px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#157B7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
    </div>
  );
};

export default SpecializationCard;