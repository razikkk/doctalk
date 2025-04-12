import React from 'react'
import { DoctorSideBar } from './DoctorSideBar'
import { Outlet } from 'react-router-dom'

const DoctorLayout = () => {
  return (
    <div className='flex h-screen'>
    <DoctorSideBar />

    <div className='flex-grow p-6 bg-gray-10'>
        <Outlet/>
    </div>
</div>
  )
}

export default DoctorLayout