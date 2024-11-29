import "./signin.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    // } else if (
    //   !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
    //     formData.password
    //   )
    // ) {
    //   newErrors.password =
    //     "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {

      navigate("/signup"); 
    }
  };

  return (
    <div className="bg-image d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Sign in</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className={`form-control rounded-pill ${
                errors.email ? "is-invalid" : ""
              }`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-2 position-relative">
            <label htmlFor="password" className="form-label">
              Your password
            </label>
            <input
              type="password"
              className={`form-control rounded-pill ${
                errors.password ? "is-invalid" : ""
              }`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="mb-3 text-end">
            <a href="#" className="text-decoration-none">
              Forget your password
            </a>
          </div>
          <button type="submit" className="btn btn-secondary w-100">
            Sign in
          </button>
        </form>
        <div className="mt-3 text-center">
          <span className="text-muted">Don’t have an account? </span>
          <Link to="/signup" className="text-decoration-none">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;
