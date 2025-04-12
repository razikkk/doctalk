import React from 'react'

type Fields = {
  name:string,
  options:string[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void
  value:string
}

export const SelectField :React.FC<Fields>= ({ name, options, onChange,value }) => {
   
        return (
        
            <select
              name={name}
              onChange={onChange}
              value={value}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md bg-white text-gray-700 focus:outline-none focus:ring-0.5 focus:ring-[#157B7B] focus:border-[#157B7B] transition-all duration-300 hover:shadow-lg"
            >
              {options.map((option) => (
                <option key={option} value={option.toLowerCase()}>{option}</option>
              ))}
            </select>
        );
      }

