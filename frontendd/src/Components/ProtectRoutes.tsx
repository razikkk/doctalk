import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { RootState } from "../Redux/store"

const protectedRotues = ()=>{
    const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated)

    return isAuthenticated ? <Outlet/> : <Navigate to={'/login'} replace/>
 }

 export default protectedRotues