import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './ForgotPassword';

function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [usertype, setUsertype] = useState("startup");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsertypeChange = (type) => {
    setUsertype(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Email is required" : "",
        password: !formData.password ? "Password is required" : "",
      });
      return;
    }

    if (!usertype) {
      alert("Please select a user type (Startup Founder or Investor).");
      return;
    }

    try {
      const endpoint =
        usertype === "startup"
          ? "http://localhost:3000/startupsignin"
          : "http://localhost:3000/investorsignin";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session handling
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user details in local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        console.log("Logged-in User Data:", data);

        navigate("/"); // Redirect to home page
      } else {
        alert(`Error: ${data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-green-200 d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h1 className="text-center mb-4">Sign in</h1>

        <div>
          <input
            type="checkbox"
            id="startup-checkbox"
            checked={usertype === "startup"}
            onChange={() => handleUsertypeChange("startup")}
          />
          <label className="ms-2" htmlFor="startup-checkbox">
            Startup Founder
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            id="investor-checkbox"
            checked={usertype === "investor"}
            onChange={() => handleUsertypeChange("investor")}
          />
          <label className="ms-2" htmlFor="investor-checkbox">
            Investor
          </label>
        </div>

        <br />
        <br />

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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="mb-3 text-end">
            <Link to={usertype === "investor" ? "/forgot-password-investor" : "/forgot-password"} className="text-decoration-none">
              Forgot your password?
            </Link>
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
