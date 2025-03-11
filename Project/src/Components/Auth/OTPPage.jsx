import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/Home/CapitalValleyLogo.png";

const OTPPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { userId } = useParams(); // Access the userId parameter from URL

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP verified successfully!");
        setTimeout(() => {
          navigate(`/reset-password/${userId}`);
        }, 2000);
      } else {
        setMessage(data.message); // Show error message
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
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
            <p className="text-sm">Verify your OTP to proceed.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-r-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Enter OTP</h2>
            <p className="text-gray-500 text-sm">We’ve sent a code to your email.</p>
          </div>

          {message && (
            <div className="bg-blue-100 text-blue-800 text-sm p-2 rounded mb-4 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-sm placeholder-gray-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                required
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 shadow-md text-sm"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;