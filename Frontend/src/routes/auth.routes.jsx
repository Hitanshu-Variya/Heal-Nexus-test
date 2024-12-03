import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/landingPage.jsx';
import SignUp from '../pages/auth/auth.signup.jsx';
import VerifyEmail from '../pages/auth/auth.verifyEmail.jsx';
import Login from '../pages/auth/auth.login.jsx';
import ForgetPassword from '../pages/auth/auth.forgetPassword.jsx';
import ResetPassword from '../pages/auth/auth.resetPassword.jsx';
import DashBoard from '../pages/dashBoard.jsx';


const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/patient-dashboard" element={<DashBoard />} />
    </Routes>
  )
}

export default AuthRoutes;