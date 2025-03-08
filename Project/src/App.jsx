import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Components/Auth/Signin.jsx";
import Signup from "./components/Auth/Signup.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import Profile from "./Components/Profile/pages/profile.jsx";
import ProfileSetting from "./components/Profile/pages/profileSetting.jsx";
import Notfound from "./components/Profile/pages/NotFound.jsx";
import ForgotPassword from "./Components/Auth/ForgotPassword.jsx";
import OTPPage from "./Components/Auth/OTPPage.jsx";
import ResetPasswordPage from "./Components/Auth/ResetPasswordPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Root path (requires authentication) */}
          <Route path="/" element={<ProtectedRoute element={HomePage} />} />
          
          {/* Authentication routes (public) */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp/:userId" element={<OTPPage />} />
          <Route path="/reset-password/:userId" element={<ResetPasswordPage />} />

          {/* Profile routes (requires authentication) */}
          <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
          <Route path="/profile/:id" element={<ProtectedRoute element={Profile} />} />
          <Route path="/profileSetting" element={<ProtectedRoute element={ProfileSetting} />} />



          {/* Fallback route for 404 */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;