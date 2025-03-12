import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Components/Auth/Signin.jsx";
import Signup from "./Components/Auth/Signup.jsx";
import HomePage from "./Components/HomePage/HomePage.jsx";
import Profile from "./Components/Profile/pages/profile.jsx";
import ProfileSetting from "./components/Profile/pages/profileSetting.jsx";
import Notfound from "./components/Profile/pages/NotFound.jsx";
import ForgotPassword from './Components/Auth/ForgotPassword.jsx';
import OTPPage from './Components/Auth/OTPPage.jsx';
import ResetPasswordPage from './Components/Auth/ResetPasswordPage.jsx';
import PaymentPage from "./Components/Subscription/PaymentPage.jsx"; 
import VerifyIdea from "./Components/verifyIdea.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Chat from "../src/Components/Chat/Chat.jsx";
import LandingPage from "./Components/LandingPage/LandingPage.jsx"; // New import
import { Toaster } from 'react-hot-toast';
import ContractDisplay from "./Components/Chat/ContractDisplay.jsx";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <Routes>
            {/* Public Landing Page as Root */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes (public) */}
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp/:userId" element={<OTPPage />} />
            <Route path="/reset-password/:userId" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute element={HomePage} />} />
            <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
            <Route path="/profile/:id" element={<ProtectedRoute element={Profile} />} />
            <Route path="/profileSetting" element={<ProtectedRoute element={ProfileSetting} />} />
            <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/verify-idea/:hash" element={<VerifyIdea />} />
            <Route path="/contract" element={<ContractDisplay />} />

            {/* Fallback Route for 404 */}
            <Route path="*" element={<Notfound />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;