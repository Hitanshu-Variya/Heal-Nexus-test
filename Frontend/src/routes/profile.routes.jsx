import {Routes,Route} from "react-router-dom"
import { ProfileCard } from "../pages/Profile/ProfileCard/ProfileCard"
export function ProfileRoute(){
   return <Routes>
        <Route path="/profile/:role" element={<ProfileCard />} />
    </Routes>
}