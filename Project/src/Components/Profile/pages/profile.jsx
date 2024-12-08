import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Button from "../component/button";
import Text from "../component/text";
import Img from "../component/img";
import Header from "../../HomePage/Header";

const Profile = () => {
  const navigate = useNavigate();

  const [notificationsAllowed, setNotificationsAllowed] = useState(false);

  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/signin");
      } else {
        alert("Logout failed. Try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Try again.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        });

        console.log("Response Status:", response.status);

        const data = await response.json();
        console.log("Server Response:", data);

        if (response.ok && data.success) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          alert("Session expired or could not verify session.");
          localStorage.removeItem("user");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error during server-side fetch:", error);
        alert("Could not verify session.");
        navigate("/signin");
      }
    };

    fetchProfile();
  }, [navigate]);
  return (
    <>
      <Helmet>
        <title>User Profile</title>
        <meta
          name="description"
          content="Access your user profile to update settings, manage notifications, and log out. Personalize your experience with our user-friendly options."
        />
      </Helmet>
      <Header />
      <div className="flex justify-center items-center min-h-screen ">
        <div className="w-full max-w-md bg-white shadow-md p-6 transform transition duration-700 hover:scale-105 border-2 border-green-800 rounded-lg">
          <div className="flex w-full flex-col items-center gap-3.5 bg-white-a700 px-3.5 py-5 shadow-xs sm:gap-3.5  ">
            <div className="container-xs flex flex-col items-start gap-4 self-stretch sm:gap-4 ">
              <div className="flex items-center gap-4 self-stretch ">
                <Img
                  src="profileAssets/images/user.png"
                  alt="Profile Image"
                  className="h-[70px] w-[6%] rounded-[34px] object-contain"
                />
                <div className="flex flex-1 flex-col items-start">
                  <Text
                    as="p"
                    className="text-[16px] sm:text-[18px] font-normal text-blue_gray-900"
                  >
                    {user ? user.username : "Your name"}
                  </Text>
                  <Text
                    as="p"
                    className="font-roboto text-[14px] sm:text-[16px] font-normal text-gray-600"
                  >
                    {user ? user.email : "yourname@gmail.com"}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <div className="container-xs flex flex-col items-start gap-3 self-stretch sm:gap-3">
            <div className="flex w-full justify-between bg-gray-50 py-2 px-2 transform transition duration-200 hover:bg-green-200 rounded-lg">
              <div className="flex items-center gap-2.5">
                <Img
                  src="profileAssets/images/profile.png"
                  alt="User Image"
                  className="h-[24px]"
                />
                <Text as="p" className="text-[14px] font-normal text-black-900">
                  My Profile
                </Text>
              </div>
              <Button
                onClick={() => navigate("/ProfileSetting")}
                className="transform transition duration-700 hover:scale-110"
              >
                <Img
                  src="profileAssets/images/next.png"
                  alt="Right Arrow"
                  className="h-[24px]"
                />
              </Button>
            </div>


            <div className="flex w-full justify-between bg-gray-50 py-2 px-2 transform transition duration-200 hover:bg-green-200 rounded-lg">
              <div className="flex items-center gap-2.5">
                <Img
                  src="profileAssets/images/bell.png"
                  alt="Bell Image"
                  className="h-[24px]"
                />
                <Text
                  as="p"
                  className="text-[14px] font-normal text-blue_gray-900"
                >
                  Notification
                </Text>
              </div>
              <Button
                onClick={() => setNotificationsAllowed(!notificationsAllowed)}
                className="transform transition duration-700 hover:scale-110"
              >
                <Text
                  as="p"
                  className={`text-[12px] font-normal ${notificationsAllowed ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {notificationsAllowed ? "Allowed" : "Disallowed"}
                </Text>
              </Button>
            </div>

            <div className="flex w-full justify-center bg-gray-50 py-2 px-2 hover:bg-gray-100">
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 bg-red-500 hover:bg-red-400 active:bg-red-300 text-white py-2 px-4 rounded transition duration-300"
                >
                  <Img
                    src="profileAssets/images/power-off.png"
                    alt="Arrow Right Blue"
                    className="h-[24px]"
                  />
                  <Text as="p" className="text-[14px] font-normal">
                    Log Out
                  </Text>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
  );
};

export default Profile;
