import { useEffect } from 'react';
import { ArrowLeft, Calendar, MessageSquare, User, Wallet, X } from 'lucide-react';
import NavItem from './NavItem';
import { Outlet } from 'react-router-dom';
// import NavItem from './NavItem';

interface SidebarProps {
  activeItem: string;
  navigate: (path: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const UserSidebar = ({ activeItem, navigate, isOpen, setIsOpen }: SidebarProps) => {
  // Close sidebar on mobile when user clicks outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  // Map of navigation items
  const navItems = [
    {
      icon: <User size={22} />,
      label: 'Profile',
      path: '/user/profile',
      id: 'profile',
    },
    {
      icon: <Calendar size={22} />,
      label: 'Appointments',
      path: '/user/appointments',
      id: 'appointments',
    },
    {
      icon: <Wallet size={22} />,
      label: 'Wallet',
      path: '/user/wallet',
      id: 'wallet',
    },
    {
      icon: <MessageSquare size={22} />,
      label: 'Messages',
      path: '/user/message',
      id: 'message',
    },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
        
      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col h-[calc(100vh-4rem)]`}
      >
        
        {/* Mobile close button */}
        <button 
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
        <button
                onClick={() => navigate('/dashboard')}
                className="absolute right-6 top-6 text-[#157B7B] hover:text-[#0d5656] transition-colors"
                aria-label="Go back"
            >
                <ArrowLeft size={28} />
            </button>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.id}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 768) {
                  setIsOpen(false);
                }
              }}
            />
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#157B7B]">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;