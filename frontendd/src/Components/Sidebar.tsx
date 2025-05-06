import { FaUserMd, FaUser, FaCalendarAlt, FaDollarSign, FaSignOutAlt, FaHeart } from "react-icons/fa";
import logo from '../../src/assets/adminLogo.png'
import { useNavigate } from "react-router-dom";
import { MouseEvent, ReactNode } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { adminlogout } from "../Redux/adminSlice/adminAuthSlice";

type SidebarsTypes = {
  text:string,
  onClick : (e:MouseEvent<HTMLDivElement>)=>void,
  Icon: React.ElementType //react element use cheynath nmll aaa iconsine oru component aakitt render cheyypikan <Icon/> inngae 
  //ppo neritt jsxil component kodkanel ReactNode kodtha mathi
}
const Sidebar = () => {
  
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogout = ()=>{
      dispatch(adminlogout())
    }
  return (
    <div className="w-64 h-screen bg-white text-black p-5 flex flex-col  border-r-.5 border-[#157B7B] shadow-md shadow-[#157B7B] ">
      {/* Logo Section */}
      <div className="flex flex-col items-start pl-4 mb-7">
        <img src={logo} alt="DocTalk" className="h-20 mb-2" />
        <div className="w-55 border-t-2  border-[#157B7B] shadow-md shadow-[#157B7B]"></div>
       
      </div>
      
      {/* Sidebar Items */}
      <nav className="flex flex-col space-y-6 flex-grow">
        <SidebarItem Icon={FaUserMd} text="Dashboard" onClick={()=>navigate('/admin/dashboard')}/>
        <SidebarItem Icon={FaUser} text="Patients" onClick={()=>navigate('/admin/patients')}/>
        <SidebarItem Icon={FaUserMd} text="Doctors" onClick={()=>navigate('/admin/doctors')}/>
        <SidebarItem Icon={FaHeart} text="Specialities" onClick={()=>navigate('/admin/specialities')}/>
        <SidebarItem Icon={FaCalendarAlt} text="Appointments" onClick={()=>navigate('/admin/appointments')}/>
        <SidebarItem Icon={FaDollarSign} text="Payments" onClick={()=>navigate('/admin/payments')}/>
        <SidebarItem Icon={FaSignOutAlt} text="Logout" onClick={handleLogout}/>
      </nav>
    </div>
  );
};

const SidebarItem:React.FC<SidebarsTypes> = ({ Icon, text,onClick }) => (
  <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-3 rounded transition-all" onClick={onClick}>
    <Icon className="text-xl text-black" />
    <span className="text-black font-medium">{text}</span>
  </div>
);

export default Sidebar;
