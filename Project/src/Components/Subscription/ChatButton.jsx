import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatButton = ({ userId, investorId, isSubscribed }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!isSubscribed) {
      // Navigate to the subscription page
      navigate("/subscribe");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/startChat", {
        senderId: userId,
        receiverId: investorId,
      });
      alert("Chat started successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error starting chat");
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleStartChat} 
      className="bg-green-500 text-white px-4 py-2 rounded-lg"
      disabled={loading}
    >
      {isSubscribed ? "Chat Now" : "Subscribe to Chat"}
    </button>
  );
};

export default ChatButton;
