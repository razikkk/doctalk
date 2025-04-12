import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../Redux/store' // ith nmll storil set cheythath aan rootstate vechal nmll redux storil ulla ella state oru type kittum 

const GuestRoute = () => {
  const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated)
  console.log(isAuthenticated,'is')

  return isAuthenticated ? <Navigate to={'/dashboard'} replace={true}/> : <Outlet/>
}

export default GuestRoute