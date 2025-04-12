import Cookies from 'js-cookie'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const DoctorProtectedRoute = () => {
  const isAuthinticated = !!Cookies.get("doctorAccessToken")
  if(!isAuthinticated){
    return <Navigate to={'/doctor/login'} replace={true}/>
  }
  return <Outlet />
}

export default DoctorProtectedRoute