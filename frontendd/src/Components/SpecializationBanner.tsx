import React from 'react';

interface ISpecialization {
  image: string;
  name: string;
}

const SpecializationBanner: React.FC<ISpecialization> = ({ image, name }) => {
  return (
    <div className="relative bg-gradient-to-b from-[#2D8A8D] via-[#247373] to-[#1A5656] text-white p-8 rounded-lg mt-2 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      
      <div className="text-center md:text-left max-w-lg">
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-md opacity-90">
          Find experienced specialists in <span className="font-semibold">{name}</span> to provide you with expert care and personalized treatment.
        </p>
      </div>

      <div className="w-[250px] h-[250px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
    </div>
  );
};

export default SpecializationBanner;
