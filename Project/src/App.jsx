import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Components/Auth/Signin.jsx';
import Signup from './Components/Auth/Signup.jsx';
import HomePage from './Components/HomePage/HomePage.jsx';
import Header from './Components/HomePage/Header.jsx';  
import Profile from './components/Profile/pages/profile.jsx';
import ProfileSetting from './components/Profile/pages/profileSetting.jsx';
import Notfound from './components/Profile/pages/NotFound.jsx';
import ForgotPassword from './Components/Auth/ForgotPassword.jsx';
import OTPPage from './Components/Auth/OTPPage.jsx';
import ResetPasswordPage from './Components/Auth/ResetPasswordPage.jsx'
import ForgotPasswordInvestor from './Components/Auth/ForgotPasswordInvestor.jsx';
import ResetPasswordPage1 from './Components/Auth/ResetPasswordInvestor.jsx';
import OTPPage1 from './Components/Auth/OTPInvestor.jsx';

function App() {
  return (
    <Router>    

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profileSetting" element={<ProfileSetting />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp/:userId" element={<OTPPage />} />
        <Route path="/reset-password/:userId" element={< ResetPasswordPage />} />
        <Route path="/verify-otp1/:userId" element={<OTPPage1 />} />
        <Route path="/reset-password1/:userId" element={< ResetPasswordPage1 />} />
        <Route path="/forgot-password-investor" element={<ForgotPasswordInvestor />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;
