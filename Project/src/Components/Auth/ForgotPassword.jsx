import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Home/CapitalValleyLogo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("If this email is registered, we have sent an OTP to reset your password.");

        // Get the user ID from the response
        const userId = result.id;

        setTimeout(() => {
          // Redirect to /verify-otp with userId as a URL parameter
          navigate(`/verify-otp/${userId}`);
        }, 2000); // Simulate delay before redirecting
      } else {
        setMessage(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to send request. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-2">
      <div className="w-full max-w-5xl mx-4 flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 text-white p-8 flex items-center justify-center">
          <div className="text-center">
            {/* Placeholder for Logo - Replace with your image */}
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                          src={logo}
                          alt="Capital Valley Logo"
                          className="h-20 w-auto mb-6"
                        />
            </div>
            <h1 className="text-3xl font-bold mb-2">Capital Valley</h1>
            <p className="text-sm">Helping you reset and secure your account.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-r-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Forgot Password</h2>
            <p className="text-gray-500 text-sm">Let’s get you back on track!</p>
          </div>

          {message && (
            <div className="bg-blue-100 text-blue-800 text-sm p-2 rounded mb-4 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-sm placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 shadow-md text-sm"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;