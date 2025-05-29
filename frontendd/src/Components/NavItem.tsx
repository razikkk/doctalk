import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-blue-50 text-[#157B7B]'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`${active ? 'text-[#157B7B]' : 'text-gray-500'}`}>
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      
      {active && (
        <div className="ml-auto">
          <div className="h-2 w-2 rounded-full bg-[#157B7B]" />
        </div>
      )}
    </button>
  );
};

export default NavItem;