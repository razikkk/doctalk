import React from 'react';
import { Camera, Mail, MapPin, Phone } from 'lucide-react';
const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">My Profile</h1>
    
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-[#157B7B] to-[#0f5f5f]">
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300" 
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-[#157B7B] text-white rounded-full hover:bg-[#0f5f5f] transition-colors">
              <Camera size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-gray-600">Software Developer</p>
          </div>
          <button className="mt-4 md:mt-0 px-4 py-2 bg-[#157B7B] text-white rounded-lg hover:bg-[#0f5f5f] transition-colors">
            Edit Profile
          </button>
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="text-gray-400 mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">john.doe@example.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="text-gray-400 mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Profile