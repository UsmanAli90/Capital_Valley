import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InvestorForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    cnic: "",
    areasOfInterest: "",
    agreed: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

    if (!formData.areasOfInterest) {
      newErrors.areasOfInterest = "Areas of interest are required.";
    }

    if (!formData.agreed) {
      newErrors.agreed = "You must agree to the terms and conditions.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch("http://localhost:3000/investorsignup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Investor account created successfully!");
          console.log("Response Data:", data);
          navigate("/signin");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || "Something went wrong!"}`);
        }
      } catch (error) {
        console.error("Error creating investor account:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      className="card p-4 shadow-lg"
      style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "15px" }}
      onSubmit={handleSubmit}
    >
      <h2 className="text-center mb-4 fw-bold">Sign Up</h2>

      <div className="mb-3">
        <label className="form-label fw-semibold">Email</label>
        <input
          type="email"
          name="email"
          className={`form-control rounded-pill ${
            errors.email ? "is-invalid" : ""
          }`}
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Username</label>
        <input
          type="text"
          name="username"
          className={`form-control rounded-pill ${
            errors.username ? "is-invalid" : ""
          }`}
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && (
          <div className="invalid-feedback">{errors.username}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Password</label>
        <input
          type="password"
          name="password"
          className={`form-control rounded-pill ${
            errors.password ? "is-invalid" : ""
          }`}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        <small className="text-muted">
          • Use 8 or more characters
          <br />• One Uppercase character, lowercase, special character, and
          number
        </small>
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">CNIC</label>
        <input
          type="text"
          name="cnic"
          className={`form-control rounded-pill ${
            errors.cnic ? "is-invalid" : ""
          }`}
          placeholder="Enter your CNIC"
          value={formData.cnic}
          onChange={handleChange}
        />
        {errors.cnic && <div className="invalid-feedback">{errors.cnic}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Areas of Interest</label>
        <textarea
          name="areasOfInterest"
          className={`form-control rounded-pill ${
            errors.areasOfInterest ? "is-invalid" : ""
          }`}
          rows="2"
          placeholder="Enter areas of interest"
          value={formData.areasOfInterest}
          onChange={handleChange}
        ></textarea>
        {errors.areasOfInterest && (
          <div className="invalid-feedback">{errors.areasOfInterest}</div>
        )}
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          name="agreed"
          id="email-updates-investor"
          checked={formData.agreed}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="email-updates-investor">
          I want to receive emails about the product, feature updates, and
          events.
        </label>
        {errors.agreed && <div className="text-danger">{errors.agreed}</div>}
      </div>

      <p className="small text-muted">
        By creating an account, you agree to the{" "}
        <a href="#" className="text-decoration-none">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="#" className="text-decoration-none">
          Privacy Policy
        </a>
        .
      </p>

      <button type="submit" className="btn btn-secondary w-100 rounded-pill">
        Create an account
      </button>
    </form>
  );
}

export default InvestorForm;
