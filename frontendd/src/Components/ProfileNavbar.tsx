import { Bell, Menu, Search } from 'lucide-react';
import logo from '../assets/adminLogo.png'

interface NavbarProps {
  toggleSidebar: () => void;
}

const ProfileNavbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center z-10 sticky top-0">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left - Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        
        {/* Left - Logo (visible on desktop) */}
        <div className="hidden md:block">
          <div className="h-20 w-20 rounded-lg flex items-center justify-center">
           <img src={logo} alt="" />
          </div>
        </div>
        
        {/* Center - Logo and Navigation */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#157B7B] focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>
        
        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
        </div>
      </div>
    </header>
  );
};

export default ProfileNavbar;