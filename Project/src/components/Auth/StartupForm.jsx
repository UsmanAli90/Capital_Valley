import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function StartupForm() {
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
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      newErrors.email =
        "Email should not contain negative signs or plus signs.";
    } else {
      // Additional check to ensure the email domain is valid
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
        // Add more valid domains as needed
      ];
      if (!validDomains.includes(domain)) {
        newErrors.email =
          "Please enter a valid email address with a commonly used domain.";
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
      newErrors.username =
        "Username should not contain negative signs or plus signs.";
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
      newErrors.cnic =
        "CNIC must be exactly 13 digits or follow the format 12345-1234567-1.";
    } else if (/^0+$/.test(formData.cnic.replace(/-/g, ""))) {
      newErrors.cnic = "CNIC cannot be all zeros.";
    } else if (/[+-]/.test(formData.cnic)) {
      newErrors.cnic = "CNIC should not contain negative signs or plus signs.";
    } else if (/[a-zA-Z]/.test(formData.cnic)) {
      newErrors.cnic =
        "CNIC should not contain alphabets, only numbers are allowed.";
    } else {
      const parts = formData.cnic.split("-");
      if (parts.length === 3) {
        if (
          parts[0] === "00000" ||
          parts[1] === "0000000" ||
          parts[2] === "0"
        ) {
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
          alert("Account created successfully!");
          navigate("/signin");
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.message || "Unable to sign up.");
        }
      } catch (error) {
        console.error("Error creating account:", error);
        alert("An error occurred. Please try again.");
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
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-4">Create Your Startup Account</h1>
        <p className="text-center text-gray-600 mb-8">Join Capital Valley and start your journey</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="form-control rounded-pill w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="form-control rounded-pill w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <small className="text-danger">{errors.username}</small>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control rounded-pill w-full px-3 py-2 border border-gray-300"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="input-group-append">
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <small className="text-muted">
              • Use 8 or more characters
              <br />• One uppercase, lowercase, special character, and number
            </small>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CNIC</label>
            <input
              type="text"
              className="form-control rounded-pill w-full px-3 py-2 border border-gray-300"
              placeholder="Enter your CNIC"
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
            />
            {errors.cnic && <small className="text-danger">{errors.cnic}</small>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Startup Description</label>
            <textarea
              className="form-control w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="2"
              placeholder="Enter your startup description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && <small className="text-danger">{errors.description}</small>}
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="email-updates"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="email-updates">
              I want to receive emails about the product, feature updates, and events.
            </label>
            {errors.agree && <small className="text-danger">{errors.agree}</small>}
          </div>

          <p className="small text-muted mb-4">
            By creating an account, you agree to the{" "}
            <a href="#" className="text-decoration-none text-green-600 hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-decoration-none text-green-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200">
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
}

export default StartupForm;
