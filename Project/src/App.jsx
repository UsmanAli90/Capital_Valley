import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Components/Auth/Signin.jsx";
import Signup from "./components/Auth/Signup.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import Profile from "./components/Profile/pages/profile.jsx";
import ProfileSetting from "./components/Profile/pages/profileSetting.jsx";
import Notfound from "./components/Profile/pages/NotFound.jsx";
import ForgotPassword from './Components/Auth/ForgotPassword.jsx';
import OTPPage from './Components/Auth/OTPPage.jsx';
import ResetPasswordPage from './Components/Auth/ResetPasswordPage.jsx'
import ProtectedRoute from "./ProtectedRoute.jsx";
import Chat from "../src/Components/Chat/Chat.jsx"
// import { ThemeStore } from "../src/store/ThemeStore.js"
// import Settings from '../src/Components/Pages/Settings.jsx'
import { Toaster } from 'react-hot-toast';




function App() {
  // const { theme } = ThemeStore();
  return (
    <>
      <div>
      <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={HomePage} />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={<ProtectedRoute element={Profile} />}
            />
            <Route
              path="/profileSetting"
              element={<ProtectedRoute element={ProfileSetting} />}
            />
            <Route path="*" element={<Notfound />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp/:userId" element={<OTPPage />} />
            <Route path="/reset-password/:userId" element={< ResetPasswordPage />} />
            <Route
              path="/chat"
              element={<ProtectedRoute element={Chat} />}
            />
            {/* <Route path="/settings" element={<Settings />} /> */}

          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
