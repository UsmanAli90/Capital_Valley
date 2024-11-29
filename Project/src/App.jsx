import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./Profile/pages/profile";
import ProfileSetting from "./Profile/pages/profileSetting";
import NotFound from "./Profile/pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profileSetting" element={<ProfileSetting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
