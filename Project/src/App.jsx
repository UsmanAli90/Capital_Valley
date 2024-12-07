import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Components/Auth/Signin.jsx";
import Signup from "./components/Auth/Signup.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import Profile from "./components/Profile/pages/profile.jsx";
import ProfileSetting from "./components/Profile/pages/profileSetting.jsx";
import Notfound from "./components/Profile/pages/NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (
    <>
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
