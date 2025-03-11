import { useState } from "react";
import { Link } from "react-router-dom";
import StartupForm from "./StartupForm";
import InvestorForm from "./InvestorForm";
import logo from "../../assets/Home/CapitalValleyLogo.png";
import Img from "../Profile/component/img";

function Signup() {
  const [usertype, setUsertype] = useState("startup");

  const handleUserTypeChange = (type) => {
    setUsertype(type);
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
            <p className="text-sm">
              Connecting startups and investors to fuel innovation and growth.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-r-lg shadow-lg">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
            <p className="text-gray-500 text-sm">Let’s get started!</p>
          </div>
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-gray-200 rounded-full p-1 shadow-md">
              <button
                onClick={() => handleUserTypeChange("startup")}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                  usertype === "startup"
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                Startup
              </button>
              <button
                onClick={() => handleUserTypeChange("investor")}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                  usertype === "investor"
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                Investor
              </button>
            </div>
          </div>
          {usertype === "startup" ? (
            <StartupForm usertype={usertype} />
          ) : (
            <InvestorForm usertype={usertype} />
          )}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-green-600 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
