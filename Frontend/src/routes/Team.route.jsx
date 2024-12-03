import {Routes,Route} from "react-router-dom"
import OurTeam from "../pages/OurTeam"
import AboutUs from "../pages/AboutUs"


export function TeamRoutes(){
   return <Routes>
        <Route path="/team" element={<OurTeam/>} /> 
        <Route path="/about-us" element={<AboutUs/>} />
    </Routes>
}