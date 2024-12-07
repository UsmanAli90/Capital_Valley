import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const OTPPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { userId } = useParams();  // Access the userId parameter from URL

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
    <div className="bg-image d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h1 className="text-center mb-4">Enter OTP</h1>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleVerifyOtp}>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP"
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary w-100">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
