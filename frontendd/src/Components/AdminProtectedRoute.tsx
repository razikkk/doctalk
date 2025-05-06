import Cookies from 'js-cookie'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../Redux/store'

const AdminProtectedRoute = () => {
 const isAuthenticated = useSelector((state:RootState)=>state.adminAuth.isAuthenticated)
 console.log(isAuthenticated,'isss')

  if(!isAuthenticated ){
    return <Navigate to={'/admin/login'} replace />
  }
  return <Outlet/>
}

export default AdminProtectedRoute