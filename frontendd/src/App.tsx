
import './App.css'
import LandingPage from './Pages/user/LandingPage'
import {Routes,Route, Navigate} from 'react-router-dom'
import SelectField from './Pages/user/selectField'
import Register from './Pages/user/Register'
import OTPVerification from './Pages/user/OTP'
import Login from './Components/Login'
import ProtectedRoute from './Components/ProtectRoutes'
import GuestRoute from './Components/GuestRoute'
import AdminLogin from './Pages/admin/adminLogin'
import AdminProtectedRoute from './Components/AdminProtectedRoute'
import Patients from './Pages/admin/Patients'
import AdminLayout from './Components/AdminLayout'
import Dashboard from './Pages/admin/Dashboard'
import Specialities from './Pages/admin/Specialities'
import DoctorRegister from './Pages/doctor/DoctorRegister'
import DoctorLogin from './Pages/doctor/DoctorLogin'
import DoctorOtp from './Pages/doctor/DoctorOtp'
import UserDashboard from './Pages/user/Dashboard'
import SectionOne from './Pages/doctor/SectionOne'
import SectionTwo from './Pages/doctor/SectionTwo'
import Doctors from './Pages/admin/Doctors'
import DoctorProfile from './Pages/admin/DoctorProfile'
import DoctorDashboard from './Pages/doctor/DoctorDashboard'
import DoctorProtectedRoute from './Components/DoctorProtectedRoute'
import { Children } from 'react'
import DoctorLayout from './Components/DoctorLayout'
function App() {
  

  return (
    <>
    <Routes>

     <Route path='/' element={<LandingPage/>}/>
     <Route path='/selectField' element={<SelectField/>}/>
     <Route element={<GuestRoute/>}>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/verify-otp' element={<OTPVerification/>}/>
     </Route>
     
      

      <Route element={<ProtectedRoute/>}>
      <Route path='/dashboard' element={<UserDashboard/>}/>
      </Route>

      {/* unknown Routes */}
      <Route path='*' element={<Navigate to={'/'}/>}/>

      {/* adminRoutes */}
      <Route path='/admin/login' element={<AdminLogin/>}/>
      

      {/* adminProtectedRoutes */}
      <Route element={<AdminProtectedRoute/>}>
        <Route path='/admin' element={<AdminLayout/>}>

        <Route path='/admin/dashboard' element={<Dashboard/>}/>
        <Route path='/admin/patients' element={<Patients/>}/>
        <Route path='/admin/specialities' element={<Specialities/>}/>
        <Route path='/admin/doctors' element={<Doctors/>}/>
        <Route path='/admin/doctors/:doctorId' element={<DoctorProfile/>}/>
        </Route>
      </Route>

      {/* doctorRoutes */}
      <Route path='/doctor/register' element={<DoctorRegister/>}/>
      <Route path='/doctor/login' element={<DoctorLogin/>}/>
      <Route path='/doctor/otp' element={<DoctorOtp/>}/>
      <Route path='/doctor/verification/step1' element={<SectionOne/>}/>
      <Route path='/doctor/verification/step2' element={<SectionTwo/>}/>
      
      {/* doctor protectedRotues */}
      <Route element={<DoctorProtectedRoute/>}>
        <Route path='/doctor' element={<DoctorLayout/>}>

      <Route path='/doctor/dashboard' element={<DoctorDashboard/>}/>
        </Route>

      </Route>

    </Routes>
    </>
  )
}

export default App
