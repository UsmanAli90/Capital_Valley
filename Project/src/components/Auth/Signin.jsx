import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ForgotPassword';
import Modal from './Modal'
import toast from "react-hot-toast";

function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [usertype, setUsertype] = useState("startup");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsertypeChange = (type) => {
    setUsertype(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Email is required" : "",
        password: !formData.password ? "Password is required" : "",
      });
      return;
    }

    if (!usertype) {
      alert("Please select a user type (Startup Founder or Investor).");
      return;
    }

    try {
      const endpoint =
        usertype === "startup"
          ? "http://localhost:3000/startupsignin"
          : "http://localhost:3000/investorsignin";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session handling
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user details in local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        // setModal({ show: true, title: 'Success', message: 'Login successful!' });
        toast.success('Login Successful!')
        setTimeout(() => {
          navigate('/'); // Redirect to homepage or another page after login
        }, 2000);
        // navigate("/"); // Redirect to home page
      } else {
        // setModal({ show: true, title: 'Error', message: 'Invalid Credentials.' });
        toast.error("Invalid Credentials.")
      }
    } catch (error) {
      // setModal({ show: true, title: 'Error', message: 'An error occurred during login.' });
      toast.error("An error occurred during login..")
    }
  };

  const closeModal = () => {
    setModal({ show: false, title: '', message: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-4">Welcome to Capital Valley</h1>
        <p className="text-center text-gray-600 mb-8">Please sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="form-control rounded-pill w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control rounded-pill w-full px-3 py-2 border border-gray-300"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="input-group-append">
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="usertype"
                  value="startup"
                  checked={usertype === "startup"}
                  onChange={() => handleUsertypeChange("startup")}
                />
                <span className="ml-2">Startup</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="form-radio"
                  name="usertype"
                  value="investor"
                  checked={usertype === "investor"}
                  onChange={() => handleUsertypeChange("investor")}
                />
                <span className="ml-2">Investor</span>
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <Link to="/signup" className="text-green-600 hover:underline">Signup</Link>
        </p>
      </div>
      <Modal show={modal.show} onClose={closeModal} title={modal.title} message={modal.message} />
    </div>
  );
}

export default Signin;
