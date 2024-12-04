import {Routes,Route} from 'react-router-dom'
import { DoctorDashBoard } from '../pages/doctor/DoctorDashBoard'
import { DoctorAllAppointments } from '../pages/doctor/DoctorAllAppointments'
import DoctorMyProfile from '../pages/doctor/DoctorMyProfile'

export function DoctorRoutes(){
    return <Routes> <Route path='/doctor-dashboard' element={<DoctorDashBoard/>}></Route>
    <Route path='/all-appointments' element={<DoctorAllAppointments/>}></Route>
    <Route path='/myprofile-doctor' element={<DoctorMyProfile/>}/></Routes>

}