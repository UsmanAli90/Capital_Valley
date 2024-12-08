import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom';

const ResetPasswordPage1 = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();

  // Extract userId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const { userId } = useParams();  // Access the userId parameter from URL

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/reset-password1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Password reset successfully!");
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
        <h1 className="text-center mb-4">Reset Password</h1>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              Enter New Password
            </label>
            <input
              type="password"
              className="form-control rounded-pill"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage1;
