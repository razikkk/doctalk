import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import logo from '../../src/assets/logodoctalk.png'
import { useNavigate } from 'react-router-dom'


interface Logout {
  logingOut:()=>void
}
const UserNav:React.FC<Logout> = ({logingOut}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
  
    return (
      <nav className=" static top-0 left-0 w-full px-5 py-7 flex justify-between items-cente z-10">
        {/* Logo */}
        <div className="mt-[-10px]">
          <img className="h-16" src={logo} alt="Logo" />
        </div>
        
        {/* Navigation Links */}
        <ul className="flex space-x-6 text-black">
          <li className="cursor-pointer hover:text-teal-600">Home</li>
          <li 
            className="cursor-pointer hover:text-teal-600" 
            onClick={() => navigate('/user/doctors')}
          >
            Doctors
          </li>
          <li className="cursor-pointer hover:text-teal-600">About</li>
          <li className="cursor-pointer hover:text-teal-600">Contact</li>
        </ul>
        
        {/* User Dropdown */}
        <div className="relative">
          <FaUserCircle 
            size={26} 
            color="black" 
            className="cursor-pointer hover:text-teal-600" 
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-20 border border-gray-100">
              <ul className="py-2 text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logingOut}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    );
  };

export default UserNav