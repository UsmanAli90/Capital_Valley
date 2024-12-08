import { Helmet } from "react-helmet";
import Button from "../component/button";
import Text from "../component/text";
import Input from "../component/input";
import Header from "../../HomePage/Header";
import { useState, useEffect } from "react";

export default function ProfilesettingPage() {
  const [userData, setUserData] = useState({ name: "", email: "" });

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
          }
        } else {
          alert("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: updatedData.name,
          email: updatedData.email,
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 transform transition duration-700 hover:scale-105">
          <form
            className="flex flex-col items-start gap-6 bg-white-a700 p-6 sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="self-stretch">
              <div className="flex flex-col gap-4">
                <div className="flex flex-1 flex-col items-start">
                  <Text
                    size="texts"
                    as="p"
                    className="text-[16px] font-normal text-blue_gray-900"
                  >
                    {userData.name || "Your name"}
                  </Text>
                  <Text
                    as="p"
                    className="text-[14px] font-normal text-gray-600"
                  >
                    {userData.email || "yourname@gmail.com"}
                  </Text>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div className="flex flex-wrap gap-4 self-stretch">
                  <Text
                    size="texts"
                    as="p"
                    className="text-[16px] font-normal text-blue_gray-900"
                  >
                    Name
                  </Text>
                  <Input
                    type="text"
                    name="name"
                    defaultValue={userData.name}
                    className="text-[16px] font-normal text-blue_gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>
                <div className="h-px w-full bg-gray-100" />
                <div className="flex flex-wrap items-center gap-4">
                  <Text
                    size="texts"
                    as="p"
                    className="text-[16px] font-normal text-blue_gray-900"
                  >
                    Email
                  </Text>
                  <Input
                    type="email"
                    name="email"
                    defaultValue={userData.email}
                    className="text-[14px] font-normal text-blue_gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              shape="round"
              className="min-w-[144px] rounded-md px-6 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 sm:px-5 transition duration-300"
            >
              Save Change
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
