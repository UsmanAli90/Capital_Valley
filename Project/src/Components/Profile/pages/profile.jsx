import { Helmet } from "react-helmet";
import Text from "../component/text";
import Img from "../component/img";
import Button from "../component/button";
import { useNavigate } from "react-router-dom";
import Header from '../../HomePage/Header'
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>User Profile Manage Your Settings and Notifications</title>
        <meta
          name="description"
          content="Access your user profile to update settings, manage notifications, and log out. Personalize your experience with our user-friendly options."
        />
      </Helmet>
      <Header></Header>
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
                Your name
              </Text>
              <Text
                as="p"
                className="font-roboto text-[12px] font-normal text-gray-600"
              >
                yourname@gmail.com
              </Text>
            </div>
          </div>

          <div className="h-px w-[28%] bg-gray-200" />
        </div>
      </div>

      <div className="container-xs flex flex-col items-start gap-3 self-stretch sm:gap-3">
        <div className="flex w-[28%] justify-center bg-gray-50 py-2 sm:w-full">
          <div className="flex flex-1 items-center gap-2.5 px-2">
            <Img
              src="profileAssets/images/profile.png"
              alt="User Image"
              className="h-[24px]"
            />

            <Text as="p" className="text-[14px] font-normal text-black-900">
              My Profile
            </Text>
          </div>
          <Button onClick={() => navigate("/ProfileSetting")}>
            <Img
              src="profileAssets/images/next.png"
              alt="Right Arrow"
              className="h-[24px]"
            />
          </Button>
        </div>

        <div className="mx-2.5 flex self-stretch sm:mx-0 my-2 py-2">
          <div className="flex items-center gap-2.5">
            <Img
              src="profileAssets/images/settings.png"
              alt="Settings Image"
              className="h-[24px]"
            />

            <Text as="p" className="text-[14px] font-normal text-blue_gray-900">
              Settings
            </Text>
          </div>
          <Link to="/profileSetting">
            <Button>
              <Img
                src="profileAssets/images/next.png"
                alt="Arrow Right"
                className="h-[24px]"
              />
            </Button>
          </Link>
        </div>

        <div className="mx-2.5 flex self-stretch sm:mx-0 my-2 py-2">
          <div className="flex items-center gap-2.5">
            <Img
              src="profileAssets/images/bell.png"
              alt="Bell Image"
              className="h-[24px]"
            />

            <Text as="p" className="text-[14px] font-normal text-blue_gray-900">
              Notification
            </Text>
          </div>
          <Text as="p" className="text-[12px] font-normal text-blue_gray-700">
            Allow
          </Text>
        </div>

        <div className="mx-2.5 mb-2 flex self-stretch sm:mx-0 my-2 py-2">
          <div className="flex items-center gap-2.5">
            <Link to='/signin'>
              <Button className="mx-2.5 mb-2 flex self-stretch items-center gap-2.5 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded sm:mx-0 my-2">
                <Img
                  src="profileAssets/images/power-off.png"
                  alt="Arrow Right Blue"
                  className="h-[24px]"
                />

                <Text as="p" className="text-[14px] font-normal">
                  Log Out
                </Text>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
