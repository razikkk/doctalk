import { devNull } from 'os'
import React from 'react'

interface InfoProp{
    isOpen:boolean
    onClose:()=>void
}

const ConsultationInfoModal:React.FC<InfoProp> = ({isOpen,onClose}) => {
    if(!isOpen) return null
  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 ">
    <div className="bg-white rounded-lg max-w-md p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">How Your Consultation Works</h2>
      <p className="mb-4 text-gray-700">
        Once your doctor starts the video call, you will receive a notification. 
        Please join the call promptly to begin your consultation.
      </p>
      <p className="mb-6 text-gray-700">
        Make sure you have a stable internet connection and your microphone and camera are enabled.
      </p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-[#157B7B] text-white rounded hover:bg-[#0f5f5f] transition-colors"
      >
        Got it!
      </button>
    </div>
  </div>
  )
}

export default ConsultationInfoModal