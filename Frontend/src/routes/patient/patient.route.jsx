import {Routes,Route} from 'react-router-dom'
import { Doctors } from '../../pages/Doctors'
import MyAppointments from '../../pages/MyAppointment'
import Appointment from '../../pages/Appointment'
import MyProfile from '../../pages/MyProfile'
import FeedbackForm from '../../pages/FeedbackForm'
export function AllPatientRoutes(){
    return <Routes>
    <Route path='/doctors' element={<Doctors/>}></Route>
    <Route path='/doctors/:speciality' element={<Doctors/>}></Route>
    <Route path='/my-appointments' element={<MyAppointments/>}/>
    <Route path='/appointment/:id' element={<Appointment/>}/>
    <Route path='/my-profile' element={<MyProfile/>}/>
    <Route path='/feedback' element={<FeedbackForm/>}/>
  </Routes>
}