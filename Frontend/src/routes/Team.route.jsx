import {Routes,Route} from "react-router-dom"
import OurTeam from "../pages/OurTeam"
import AboutUs from "../pages/AboutUs"
import UserAboutUs from "../pages/userAboutUs"
import UserOurTeam from "../pages/userOurTeam"
export function TeamRoutes(){
   return <Routes>
        <Route path="/team" element={<OurTeam/>} /> 
        <Route path="/user-team" element={<UserOurTeam/>} /> 
        <Route path="/about-us" element={<AboutUs/>} />
        <Route path="/user-about-us" element={<UserAboutUs/>} />
    </Routes>
}