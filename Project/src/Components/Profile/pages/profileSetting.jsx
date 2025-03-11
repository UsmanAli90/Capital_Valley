import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../HomePage/Header"; // Try this path, adjust if necessary

export default function ProfileSettingPage() {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserData({
              name: data.user.username,
              email: data.user.email,
            });
          } else {
            alert("Session expired. Please log in again.");
            navigate("/signin");
          }
        } else {
          alert("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!userData.name) {
      newErrors.name = "Username is required";
    } else if (userData.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters";
    }

    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email address is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Server response on profile update:", responseData);
        alert("Profile updated successfully.");
        setUserData({ name: responseData.username, email: responseData.email });
      } else {
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings - Update Your Personal Information</title>
        <meta
          name="description"
          content="Keep your profile up-to-date with your latest information. Add or change your email, mobile number, and location settings easily."
        />
      </Helmet>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-2">
        <div className="w-full max-w-5xl mx-4 flex flex-col lg:flex-row">
          {/* Left Side - Branding */}
          <div className="w-full lg:w-1/3 bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 flex items-center justify-center">
            <div className="text-center">
              {/* Placeholder for Logo */}
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                {/* Add your logo image here, e.g., <img src="/path/to/logo.png" alt="Logo" /> */}
              </div>
              <h1 className="text-3xl font-bold mb-2">Capital Valley</h1>
              <p className="text-sm">Update your profile settings.</p>
            </div>
          </div>

          {/* Right Side - Profile Settings Form */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-r-lg shadow-lg">
            <div className="border-2 border-green-800 rounded-lg p-6">
              <div className="mb-6">
                <p className="text-gray-600 text-sm">{userData.name || "Your name"}</p>
                <p className="text-gray-500 text-xs">{userData.email || "yourname@gmail.com"}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}