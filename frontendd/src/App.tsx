
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
import DoctorLayout from './Components/DoctorLayout'
import DoctorProfiles from './Pages/doctor/DoctorProfiles'
import Appointments from './Pages/admin/Appointments'
import AppointmentDetails from './Pages/admin/AppointmentDetails'
import DoctorDetails from './Pages/user/Doctors'
import AppointmentsDetails from './Pages/doctor/AppointmentsDetails'
import AppointmentCard from './Pages/user/AppointementsPage'
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
      <Route path='/user/doctors' element={<DoctorDetails/>}/>
      <Route path='/users/appointments/:doctorId' element={<AppointmentCard/>}/>
      
      </Route>

      {/* unknown Routes */}
      <Route path='*' element={<Navigate to={'/'}/>}/>

      {/* adminRoutes */}
      <Route path='/admin/login' element={<AdminLogin/>}/>
      

      {/* adminProtectedRoutes */}
      <Route element={<AdminProtectedRoute/>}>
        <Route  element={<AdminLayout/>}>
        <Route path='/admin/dashboard' element={<Dashboard/>}/>
        <Route path='/admin/patients' element={<Patients/>}/>
        <Route path='/admin/specialities' element={<Specialities/>}/>
        <Route path='/admin/doctors' element={<Doctors/>}/>
        <Route path='/admin/doctors/:doctorId' element={<DoctorProfile/>}/>
        <Route path='/admin/appointments' element={<Appointments/>}/>
        <Route path='/admin/appointmentDetails' element={<AppointmentDetails/>} />
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
      <Route path='/doctor/profile' element={<DoctorProfiles/>}/>
      <Route path='/doctor/appointments' element={<AppointmentsDetails/>}/>
        </Route>

      </Route>

    </Routes>
    </>
  )
}

export default App
