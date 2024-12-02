import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './components/Auth/Signin.jsx'
import Signup from './components/Auth/Signup.jsx'
import HomePage from './components/HomePage/HomePage.jsx'
import header from './components/HomePage/Header.jsx'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<HomePage />} />

        </Routes>
      </Router>


    </>
  )
}

export default App