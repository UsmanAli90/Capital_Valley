import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

function StartupForm({ usertype }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    cnic: "",
    description: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first.");
      return;
    }
    try {
      setVerifying(true);
       const res = await fetch("http://localhost:3000/api/email/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (res.ok) {
        setVerificationCodeSent(true);
        toast.success("Verification code sent to your email.");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to send code.");
      }
    } catch (err) {
      toast.error("Error sending code.");
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!enteredCode) {
      toast.error("Please enter the code.");
      return;
    }
    try {
      setVerifying(true);
      const res = await fetch("http://localhost:3000/api/email/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: enteredCode }),
      });
      if (res.ok) {
        setIsEmailVerified(true);
        toast.success("Email verified!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Invalid code.");
      }
    } catch (err) {
      toast.error("Error verifying code.");
    } finally {
      setVerifying(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (
      !formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      newErrors.email = "Please enter a valid email address.";
    } else if (/\s/.test(formData.email)) {
      newErrors.email = "Email should not contain spaces.";
    } else if (/[^a-zA-Z0-9._%+-@]/.test(formData.email)) {
      newErrors.email = "Email contains invalid characters.";
    } else if (/[+-]/.test(formData.email)) {
      newErrors.email = "Email should not contain negative signs or plus signs.";
    } else {
      const domain = formData.email.split("@")[1];
      const validDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "aol.com",
        "icloud.com",
        "mail.com",
        "zoho.com",
      ];
      if (!validDomains.includes(domain)) {
        newErrors.email = "Please enter a valid email address with a commonly used domain.";
      }
    }

    if (!formData.username) {
      newErrors.username = "Username is required.";
    } else if (/^\d+$/.test(formData.username)) {
      newErrors.username = "Username cannot be all numbers.";
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Username should not contain spaces.";
    } else if (/[^a-zA-Z0-9._-]/.test(formData.username)) {
      newErrors.username = "Username contains invalid characters.";
    } else if (/[+-]/.test(formData.username)) {
      newErrors.username = "Username should not contain negative signs or plus signs.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    } else if (formData.username.length > 50) {
      newErrors.username = "Username cannot exceed 50 characters.";
    } else if (/^\d/.test(formData.username)) {
      newErrors.username = "Username should not start with a number.";
    }

    if (
      !formData.password.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    } else if (/\s/.test(formData.password)) {
      newErrors.password = "Password should not contain spaces.";
    }

    if (!formData.cnic) {
      newErrors.cnic = "CNIC is required.";
    } else if (
      !/^\d{5}-\d{7}-\d$/.test(formData.cnic) &&
      !/^\d{13}$/.test(formData.cnic)
    ) {
      newErrors.cnic = "CNIC must be exactly 13 digits or follow the format 12345-1234567-1.";
    } else if (/^0+$/.test(formData.cnic.replace(/-/g, ""))) {
      newErrors.cnic = "CNIC cannot be all zeros.";
    } else if (/[+-]/.test(formData.cnic)) {
      newErrors.cnic = "CNIC should not contain negative signs or plus signs.";
    } else if (/[a-zA-Z]/.test(formData.cnic)) {
      newErrors.cnic = "CNIC should not contain alphabets, only numbers are allowed.";
    } else {
      const parts = formData.cnic.split("-");
      if (parts.length === 3) {
        if (parts[0] === "00000" || parts[1] === "0000000" || parts[2] === "0") {
          newErrors.cnic = "CNIC cannot be dominated by zeros.";
        }
      }
    }

    if (!formData.description) {
      newErrors.description = "Startup description is required.";
    }

    if (!formData.agree) {
      newErrors.agree = "You must agree to the terms and conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      toast.error("Please verify your email first.");
      return;
    }

    if (validate()) {
      try {
        const response = await fetch("http://localhost:3000/startupsignup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Account created successfully! Redirecting to login page...");
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Unable to sign up.");
        }
      } catch (error) {
        console.error("Error creating account:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Email and Username */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-sm placeholder-gray-400"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEmailVerified}
            />
            {!isEmailVerified && (
              <button
                type="button"
                className="mt-2 text-green-600 underline text-xs"
                onClick={handleSendCode}
                disabled={verifying || verificationCodeSent}
              >
                {verificationCodeSent ? "Code Sent" : "Send Verification Code"}
              </button>
            )}
            {verificationCodeSent && !isEmailVerified && (
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="text"
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Enter code"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                />
                <button
                  type="button"
                  className="text-green-600 underline text-xs"
                  onClick={handleVerifyCode}
                  disabled={verifying}
                >
                  Verify
                </button>
              </div>
            )}
            {isEmailVerified && (
              <p className="text-green-600 text-xs mt-1">Email verified!</p>
            )}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex-1 mt-2 md:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-sm placeholder-gray-400"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
        </div>

        {/* Row 2: Password and CNIC */}
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-sm placeholder-gray-400"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              • 8+ characters, uppercase, lowercase, number, special
            </p>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex-1 mt-2 md:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNIC
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-sm placeholder-gray-400"
              placeholder="Enter your CNIC"
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
            />
            {errors.cnic && (
              <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>
            )}
          </div>
        </div>

        {/* Row 3: Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Startup Description
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-sm placeholder-gray-400"
            rows="2"
            placeholder="Enter your startup description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Row 4: Checkbox and Terms */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-green-600"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label className="ml-2 text-sm text-gray-700">
              I want to receive emails about updates and events.
            </label>
          </div>
          <p className="text-sm text-gray-600">
            By creating an account, you agree to the{" "}
            <a href="#" className="text-green-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>

        {/* Row 5: Submit Button */}
        <div className="text-center mt-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 shadow-md text-sm"
            disabled={!isEmailVerified}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default StartupForm;