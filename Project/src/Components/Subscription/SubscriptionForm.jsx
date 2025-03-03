import React from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionForm = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate("/payment"); // Redirects to Payment Page
  };

  return (
    <button onClick={handleSubscribe}>Subscribe</button>
  );
}

export default SubscriptionForm;
