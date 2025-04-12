import React from 'react'
import Sidebar from './Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'

const AdminLayout = () => {
  
  return (
    <div className='flex h-screen'>
        <Sidebar />

        <div className='flex-grow p-6 bg-gray-10'>
            <Outlet/>
        </div>
    </div>
  )
}

export default AdminLayout