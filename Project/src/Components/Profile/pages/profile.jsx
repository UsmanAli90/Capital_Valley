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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user:", storedUser); // Add logging
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const toggleNotifications = () => {
    setNotificationsAllowed(!notificationsAllowed);
  };

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 transform transition duration-700 hover:scale-105">
          <div className="flex w-full flex-col items-center gap-3.5 bg-white-a700 px-3.5 py-5 shadow-xs sm:gap-3.5">
            <div className="container-xs flex flex-col items-start gap-4 self-stretch sm:gap-4">
              <div className="flex items-center gap-4 self-stretch">
                <Img
                  src="profileAssets/images/user.png"
                  alt="Profile Image"
                  className="h-[70px] w-[6%] rounded-[34px] object-contain"
                />
                <div className="flex flex-1 flex-col items-start">
                  <Text
                    as="p"
                    className="text-[12px] font-normal text-blue_gray-900"
                  >
                    {user ? user.username : "Your name"}
                  </Text>
                  <Text
                    as="p"
                    className="font-roboto text-[12px] font-normal text-gray-600"
                  >
                    {user ? user.email : "yourname@gmail.com"}
                  </Text>
                </div>
              </div>
              <div className="h-px w-[28%] bg-gray-200" />
            </div>
          </div>

          <div className="container-xs flex flex-col items-start gap-3 self-stretch sm:gap-3">
            <div className="flex w-full justify-between bg-gray-50 py-2 px-2 transform transition duration-700 hover:bg-gray-100">
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

            <div className="flex w-full justify-between bg-gray-50 py-2 px-2 transform transition duration-700 hover:bg-gray-100">
              <div className="flex items-center gap-2.5">
                <Img
                  src="profileAssets/images/settings.png"
                  alt="Settings Image"
                  className="h-[24px]"
                />
                <Text
                  as="p"
                  className="text-[14px] font-normal text-blue_gray-900"
                >
                  Change Password
                </Text>
              </div>
              <Link to="/changePassword">
                <Button className="transform transition duration-700 hover:scale-110">
                  <Img
                    src="profileAssets/images/next.png"
                    alt="Arrow Right"
                    className="h-[24px]"
                  />
                </Button>
              </Link>
            </div>

            <div className="flex w-full justify-between bg-gray-50 py-2 px-2 transform transition duration-700 hover:bg-gray-100">
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
                onClick={toggleNotifications}
                className="transform transition duration-700 hover:scale-110"
              >
                <Text
                  as="p"
                  className={`text-[12px] font-normal ${
                    notificationsAllowed ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {notificationsAllowed ? "Allowed" : "Disallowed"}
                </Text>
              </Button>
            </div>

            <div className="flex w-full justify-center bg-gray-50 py-2 px-2 transform transition duration-700 hover:bg-gray-100">
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transform transition duration-700 hover:scale-110"
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
