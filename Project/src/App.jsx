import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Components/Auth/Signin.jsx';
import Signup from './components/Auth/Signup.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import Header from './components/HomePage/Header.jsx';  // Make sure Header is capitalized
import Profile from './components/Profile/pages/profile.jsx';
import ProfileSetting from './components/Profile/pages/profileSetting.jsx';
import Notfound from './components/Profile/pages/NotFound.jsx';
import ForgotPassword from './Components/Auth/ForgotPassword.jsx';
import OTPPage from './Components/Auth/OTPPage.jsx';
import ResetPasswordPage from './Components/Auth/ResetPasswordPage.jsx'

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
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;
