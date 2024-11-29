import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StartupForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    cnic: "",
    description: "",
    agree: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate(); 

  const validateForm = () => {
    const errors = {};


    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.username) {
      errors.username = "Username is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
        formData.password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.";
    }

    if (!formData.cnic) {
      errors.cnic = "CNIC is required.";
    } else if (!/^\d{13}$/.test(formData.cnic)) {
      errors.cnic = "CNIC must be exactly 13 digits.";
    }

    if (!formData.description) {
      errors.description = "Startup description is required.";
    }

    if (!formData.agree) {
      errors.agree = "You must agree to receive updates.";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      console.log("Form submitted successfully:", formData);

      setTimeout(() => {
        navigate("/signin");
      }, 500);
    } else {
      setFormErrors(errors);
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
          className="form-control rounded-pill"
          placeholder="Enter your email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {formErrors.email && (
          <small className="text-danger">{formErrors.email}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Username</label>
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Enter your username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {formErrors.username && (
          <small className="text-danger">{formErrors.username}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Password</label>
        <input
          type="password"
          className="form-control rounded-pill"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <small className="text-muted">
          • Use 8 or more characters<br />
          • One Uppercase character, lowercase, special character, and number
        </small>
        {formErrors.password && (
          <small className="text-danger">{formErrors.password}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">CNIC</label>
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Enter your CNIC"
          name="cnic"
          value={formData.cnic}
          onChange={handleChange}
        />
        {formErrors.cnic && (
          <small className="text-danger">{formErrors.cnic}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Startup Description</label>
        <textarea
          className="form-control rounded-pill"
          rows="2"
          placeholder="Enter your startup description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        {formErrors.description && (
          <small className="text-danger">{formErrors.description}</small>
        )}
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="email-updates"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="email-updates">
          I want to receive emails about the product, feature updates, and
          events.
        </label>
        {formErrors.agree && (
          <small className="text-danger">{formErrors.agree}</small>
        )}
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

export default StartupForm;
