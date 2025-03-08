import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check authentication status with the backend
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include", // Include cookies for session validation
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("user"); // Clear invalid user data
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    };

    checkAuth();
  }, []);

  // While checking authentication, show a loading state
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If authenticated, render the component; otherwise, redirect to /signin
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/signin" replace />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;