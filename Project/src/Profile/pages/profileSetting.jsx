import { Helmet } from "react-helmet";
import Button from "../components/button";
import Text from "../components/text";
import Img from "../components/img";
import Input from "../components/input";

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

      <form
        className="flex w-full flex-col items-start gap-[46px] bg-white-a700 p-10 sm:p-5"
        onSubmit={handleSubmit}
      >
        <div className="self-stretch">
          <div className="flex flex-col gap-4">
            <div className="flex items-start sm:flex-col">
              <div className="flex w-[44%] items-center gap-2 self-center sm:w-full">
                <div className="w-[4%]">
                  <div className="flex flex-col items-end">
                    <Img
                      src="profileAssets/images/user.png"
                      alt="Profile Image"
                      className="h-[50px] w-[50px] rounded-[25px] object-cover md:h-auto"
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

            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col items-start gap-6">
                <div className="h-px w-[46%] bg-gray-200" />

                <div className="flex flex-wrap gap-[335px] self-stretch md:gap-5">
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
                    className="text-[16px] font-normal text-blue_gray-700"
                  />
                </div>

                <div className="h-px w-[46%] bg-gray-100" />
              </div>

              <div className="flex flex-col gap-[22px] my-1 py-1">
                <div className="flex flex-wrap items-center gap-[196px] md:gap-5">
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
                    className="text-[14px] font-normal text-blue_gray-700"
                  />
                </div>

                <div className="flex flex-col items-start gap-[22px]">
                  <div className="h-px w-[46%] bg-gray-100" />

                  <div className="flex flex-wrap items-center gap-[261px] self-stretch md:gap-5">
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
                      className="text-[14px] font-normal text-blue_gray-700"
                    />
                  </div>

                  <div className="h-px w-[46%] bg-gray-100" />
                </div>

                <div className="flex flex-col items-start gap-[22px]">
                  <div className="h-px w-[46%] bg-gray-100" />

                  <div className="flex flex-wrap items-center gap-[261px] self-stretch md:gap-5">
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
                      className="text-[14px] font-normal text-blue_gray-700"
                    />
                  </div>

                  <div className="h-px w-[46%] bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          shape="round"
          className="min-w-[144px] rounded-md px-6 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 sm:px-5"
        >
          Save Change
        </Button>
      </form>
    </>
  );
}
