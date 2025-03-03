import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Components/Auth/Signin.jsx";
import Signup from "./Components/Auth/Signup.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import Profile from "./components/Profile/pages/profile.jsx";
import ProfileSetting from "./components/Profile/pages/profileSetting.jsx";
import Notfound from "./components/Profile/pages/NotFound.jsx";
import ForgotPassword from './Components/Auth/ForgotPassword.jsx';
import OTPPage from './Components/Auth/OTPPage.jsx';
import ResetPasswordPage from './Components/Auth/ResetPasswordPage.jsx';
import PaymentPage from "./Components/Subscription/PaymentPage.jsx"; 
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/" element={<ProtectedRoute element={HomePage} />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/profileSetting" element={<ProtectedRoute element={ProfileSetting} />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp/:userId" element={<OTPPage />} />
        <Route path="/reset-password/:userId" element={<ResetPasswordPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
