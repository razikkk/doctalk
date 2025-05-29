import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProfileNavbar from './ProfileNavbar';
import { Menu } from 'lucide-react';
import UserSidebar from './UserProfileSidebar';

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Extract the current active path from the location
  const activeItem = location.pathname.split('/').pop() || 'profile';

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <ProfileNavbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <UserSidebar 
          activeItem={activeItem} 
          navigate={navigate} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;