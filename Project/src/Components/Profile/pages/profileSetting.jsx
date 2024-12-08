import { Helmet } from "react-helmet";
import Button from "../component/button";
import Text from "../component/text";
import Input from "../component/input";
import Header from "../../HomePage/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilesettingPage() {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch user data from the server's profile endpoint
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
        <title>Profile Settings Update Your Personal Information</title>
        <meta
          name="description"
          content="Keep your profile up-to-date with your latest information. Add or change your email, mobile number, and location settings easily."
        />
      </Helmet>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-green-200">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 sm:p-6">
          <form
            className="flex flex-col items-start gap-4 sm:gap-6 bg-white-a700 p-4 sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="self-stretch">
              <div className="flex flex-col gap-4">
                <div className="flex flex-1 flex-col items-start">
                  <Text
                    size="texts"
                    as="p"
                    className="text-[14px] sm:text-[16px] font-normal text-blue_gray-900"
                  >
                    {userData.name || "Your name"}
                  </Text>
                  <Text
                    as="p"
                    className="text-[12px] sm:text-[14px] font-normal text-gray-600"
                  >
                    {userData.email || "yourname@gmail.com"}
                  </Text>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div className="flex flex-wrap gap-4 self-stretch">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Text
                      size="texts"
                      as="p"
                      className="text-[14px] sm:text-[16px] font-normal text-blue_gray-900"
                    >
                      Name
                    </Text>
                    <Input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className={`text-[14px] sm:text-[16px] font-normal text-blue_gray-700 p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full sm:w-auto ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-px w-full bg-gray-100" />
                <div className="flex flex-wrap gap-4 self-stretch">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Text
                      size="texts"
                      as="p"
                      className="text-[14px] sm:text-[16px] font-normal text-blue_gray-900"
                    >
                      Email
                    </Text>
                    <Input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className={`text-[14px] sm:text-[16px] font-normal text-blue_gray-700 p-1 sm:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full sm:w-auto ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              shape="round"
              className="min-w-[120px] sm:min-w-[144px] rounded-full px-4 sm:px-6 py-2 font-semibold text-white bg-green-700 hover:bg-green-600 active:bg-green-500 transition duration-300"
            >
              Save
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
