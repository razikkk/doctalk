import React from 'react';

type ConfirmProps = {
    isCurrentlyBlocked : boolean,
    onConfirm : ()=>void,
    onCancel : ()=>void
}

const CustomConfirmAlert: React.FC<ConfirmProps> =({ isCurrentlyBlocked, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 backdrop-brightness-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <p className="text-lg font-medium text-gray-700 mb-4">
          Are you sure you want to {isCurrentlyBlocked ? 'unblock' : 'block'} this user?
        </p>
        <div className="flex justify-between">
          <button 
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-200"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button 
            className="px-4 py-2 bg-white border border-teal-600 text-teal-600 rounded-md hover:bg-teal-100 transition duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmAlert;
