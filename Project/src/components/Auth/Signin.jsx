import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import logo from "../../assets/Home/CapitalValleyLogo.png"; // Adjust path if needed

function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [usertype, setUsertype] = useState("startup");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      toast.error("Please select a user type (Startup Founder or Investor).");
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
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login Successful!");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        toast.error("Invalid Credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
      console.error("Signin error:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Branding and Tagline */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 relative overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-green-400 rounded-full opacity-20 top-0 left-0 animate-pulse-slow"></div>
          <div className="absolute w-64 h-64 bg-emerald-600 rounded-full opacity-20 bottom-0 right-0 animate-pulse-slow delay-1000"></div>
        </div>
        {/* Content */}
        <div className="flex flex-col justify-center items-center w-full p-12 text-white z-10">
          <img
            src={logo}
            alt="Capital Valley Logo"
            className="h-20 w-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4 text-center animate-fade-in">
            Capital Valley
          </h1>
          <p className="text-xl text-center max-w-md animate-fade-in-delay">
            Connecting startups and investors to fuel innovation and growth.
          </p>
        </div>
      </div>

      {/* Right Side - Signin Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Sign In
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Welcome back! Let’s get started.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* User Type and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-green-600"
                    name="usertype"
                    value="startup"
                    checked={usertype === "startup"}
                    onChange={() => handleUsertypeChange("startup")}
                  />
                  <span className="ml-2 text-gray-700">Startup</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-green-600"
                    name="usertype"
                    value="investor"
                    checked={usertype === "investor"}
                    onChange={() => handleUsertypeChange("investor")}
                  />
                  <span className="ml-2 text-gray-700">Investor</span>
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md transform hover:scale-105"
            >
              Sign In
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-in 0.5s forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 6s infinite ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

export default Signin;