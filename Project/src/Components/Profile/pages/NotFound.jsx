import React from "react";
import { Link } from "react-router-dom"; // Adjust path if needed


const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-2">
      <div className="w-full max-w-5xl mx-4 flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-500 to-emerald-700 text-white p-8 flex items-center justify-center">
          <div className="text-center">
            {/* Placeholder for Logo */}
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                          src="Project/src/assets/Home/CapitalValleyLogo.png"
                          alt="Capital Valley Logo"
                          className="h-20 w-auto mb-6"
                        />
            </div>
            <h1 className="text-3xl font-bold mb-2">Capital Valley</h1>
            <p className="text-sm">Connecting startups and investors to fuel innovation.</p>
          </div>
        </div>

        {/* ... (rest of the component remains unchanged) */}
      </div>
    </div>
  );
};

export default NotFound;