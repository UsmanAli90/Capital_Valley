import { Helmet } from "react-helmet";
import Button from "../component/button";
import Text from "../component/text";
import Img from "../component/img";
import Input from "../component/input";
import Header from "../../HomePage/Header";

export default function ProfilesettingPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
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
                <div className="flex items-start sm:flex-col">
                  <div className="flex w-full items-center gap-4 self-center">
                    <div className="w-[20%]">
                      <div className="flex flex-col items-end">
                        <Img
                          src="profileAssets/images/user.png"
                          alt="Profile Image"
                          className="h-[100px] w-[100px] rounded-[50%] object-cover"
                        />
                        <Button
                          color="white_A700"
                          size="xs"
                          shape="circle"
                          className="relative mt-[-24px] w-[24px] rounded-[12px] px-1"
                        >
                          <Img src="profileAssets/images/edit.png" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col items-start">
                      <Text
                        size="texts"
                        as="p"
                        className="text-[16px] font-normal text-blue_gray-900"
                      >
                        Your name
                      </Text>
                      <Text
                        as="p"
                        className="text-[14px] font-normal text-gray-600"
                      >
                        yourname@gmail.com
                      </Text>
                    </div>
                    <Button>
                      <Img
                        src="profileAssets/images/close.png"
                        alt="close"
                        className="h-[24px] sm:w-small"
                      />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-start gap-6">
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
                        defaultValue="your name"
                        className="text-[16px] font-normal text-blue_gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      />
                    </div>
                    <div className="h-px w-full bg-gray-100" />
                  </div>
                  <div className="flex flex-col gap-6 my-1 py-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <Text
                        size="texts"
                        as="p"
                        className="text-[16px] font-normal text-blue_gray-900"
                      >
                        Email account
                      </Text>
                      <Input
                        type="email"
                        name="email"
                        defaultValue="yourname@gmail.com"
                        className="text-[14px] font-normal text-blue_gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-6">
                      <div className="h-px w-full bg-gray-100" />
                      <div className="flex flex-wrap items-center gap-4 self-stretch">
                        <Text
                          size="texts"
                          as="p"
                          className="text-[16px] font-normal text-blue_gray-900"
                        >
                          Mobile number
                        </Text>
                        <Input
                          type="text"
                          name="mobile"
                          defaultValue="Add number"
                          className="text-[14px] font-normal text-blue_gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                      </div>
                      <div className="h-px w-full bg-gray-100" />
                    </div>
                    <div className="flex flex-col items-start gap-6">
                      <div className="h-px w-full bg-gray-100" />
                      <div className="flex flex-wrap items-center gap-4 self-stretch">
                        <Text
                          size="texts"
                          as="p"
                          className="text-[16px] font-normal text-blue_gray-900"
                        >
                          Location
                        </Text>
                        <Input
                          type="text"
                          name="location"
                          defaultValue="USA"
                          className="text-[14px] font-normal text-blue_gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                      </div>
                      <div className="h-px w-full bg-gray-100" />
                    </div>
                  </div>
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
