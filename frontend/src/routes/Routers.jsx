
import DoctorDetails from '../pages/Doctors/DoctorDetails'
import Doctors from '../pages/Doctors/Doctors'
import Home from '../pages/Home'
import Contact from '../pages/Contact'
import Services from '../pages/Services'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import { MyAccount } from '../Dashboard/user-account/MyAccount'
import CheckoutSuccess from '../pages/CheckoutSuccess'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../Dashboard/doctor-account/Dashboard'
import ProtectedRoute from './ProtectedRoute'

import VideoCall from "./../components/VideoCall";



const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/Services" element={<Services/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/doctors" element={<Doctors/>} />
      <Route path="/doctors/:id" element={<DoctorDetails/>} />
      <Route path="/user/profile/me" element={<ProtectedRoute allowedRoutes={['patient']}><MyAccount/></ProtectedRoute>}/>
      <Route path="/doctors/profile/me" element={<ProtectedRoute allowedRoutes={['doctor']}><Dashboard/></ProtectedRoute>}/>
      <Route path="/checkout-success" element={<CheckoutSuccess/>} />
      <Route path="/video/:roomId" element={<VideoCall />} />
    </Routes>
  )
}

export default Routers