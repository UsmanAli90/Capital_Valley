import React from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionForm = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate("/payment"); // Redirects to Payment Page
  };

  return (
    <button
      onClick={handleSubscribe}
      className="bg-green-400 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    >
      Subscribe Now
    </button>
  );
}

export default SubscriptionForm;
