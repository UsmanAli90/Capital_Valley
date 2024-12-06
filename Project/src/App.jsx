import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Components/Auth/Signin.jsx'
import Signup from './Components/Auth/Signup.jsx'
import HomePage from './Components/HomePage/HomePage.jsx';
import Profile from './Components/Profile/pages/profile.jsx'
import ProfileSetting from './Components/Profile/pages/profileSetting.jsx'
import Notfound from './Components/Profile/pages/NotFound.jsx'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profileSetting" element={<ProfileSetting />} />

          <Route path="*" element={<Notfound />} />



        </Routes>
      </Router>


    </>
  )
}

export default App