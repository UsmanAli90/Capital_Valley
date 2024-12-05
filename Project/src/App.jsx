import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './components/Auth/Signin.jsx'
import Signup from './components/Auth/Signup.jsx'
import HomePage from './components/HomePage/HomePage.jsx'
import Profile from './components/Profile/pages/profile.jsx'
import ProfileSetting from './components/Profile/pages/profileSetting.jsx'
import Notfound from './components/Profile/pages/NotFound.jsx'
import SearchProfile from './Components/HomePage/SearchProfile.jsx';

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
          <Route path="/profile/:id" element={<SearchProfile />} />
          <Route path="*" element={<Notfound />} />



        </Routes>
      </Router>


    </>
  )
}

export default App