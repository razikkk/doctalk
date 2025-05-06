import React from 'react';
import { LayoutDashboard, MessageSquare, Wallet, Calendar, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Redux/doctorSlice/doctorSlice';
import logo from '../assets/adminLogo.png'
import { doctorLogout } from '../utils/doctorAuth';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-lg transition-colors ${
      active 
        ? 'bg-teal-50 text-teal-700' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="font-medium text-base">{label}</span>
  </button>
);

export const DoctorSideBar = () => {
  const [activeItem, setActiveItem] = React.useState('Dashboard');

  const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = async()=>{
        // localStorage.removeItem("doctorAccessToken")
        const response = await doctorLogout()
        if(response.success){
            dispatch(logout())
            navigate('/doctor/login')
        }
       
      }

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* Logo */}
      <div className="pl-4 mb-9">
        <img 
          src={logo}
          alt="DocTalk Logo" 
          className="h-20 mb-2"
        />
      </div>
  
      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6 flex flex-col justify-between">
        <div className="space-y-3">
          <NavItem
            icon={<LayoutDashboard size={22} />}
            label="Dashboard"
            active={activeItem === 'Dashboard'}
            onClick={() => {setActiveItem('Dashboard');navigate('/doctor/dashboard')}}
            
            
          />
          <NavItem
            icon={<MessageSquare size={22} />}
            label="Messages"
            active={activeItem === 'Messages'}
            onClick={() => {setActiveItem('Messages');navigate('/doctor/message')}}
          />
          <NavItem
            icon={<Wallet size={22} />}
            label="Wallet"
            active={activeItem === 'Wallet'}
            onClick={() => {setActiveItem('Wallet');navigate('/doctor/wallet')}}
          />
          <NavItem
            icon={<Calendar size={22} />}
            label="Appointments"
            active={activeItem === 'Appointments'}
            onClick={() => {setActiveItem('Appointments');navigate('/doctor/appointments')}}
          />
        </div>
  
        {/* Logout Button */}
        <div className="border-t border-gray-200 pt-6">
          <NavItem
            icon={<LogOut size={22} />}
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};