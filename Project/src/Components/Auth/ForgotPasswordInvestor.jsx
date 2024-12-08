import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

const ForgotPasswordInvestor = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/forgot-password1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setMessage("If this email is registered, we have sent an OTP to reset your password.");
        setTimeout(() => {
          navigate(`/verify-otp1/${result.id}`);
        }, 2000);
      } else {
        setMessage(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to send request. Please check your connection and try again.");
    }
  };

  return (
    <div className="bg-image d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h1 className="text-center mb-4">Forgot Password - Investor</h1>
        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Enter your email address
            </label>
            <input
              type="email"
              className="form-control rounded-pill"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary w-100">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordInvestor;
