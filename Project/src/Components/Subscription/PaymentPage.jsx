import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Load Stripe with environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("20"); // Default: Local Subscription
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("⚠️ Stripe is not loaded yet!");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name,
        email,
        address: { line1: billingAddress },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    // Ensure amount is either 20 or 200 (preventing manipulation)
    const validAmounts = ["20", "200"];
    if (!validAmounts.includes(paymentAmount)) {
      setMessage("❌ Invalid payment amount selected.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/payment", {
        userId,
        paymentMethodId: paymentMethod.id,
        name,
        email,
        billingAddress,
        amount: paymentAmount, // Sending amount to backend
      });

      if (response.status === 200) {
        setMessage("✅ Payment successful!");
        setTimeout(() => navigate("/chat"), 2000);
      } else {
        setMessage("❌ Payment failed. Try again.");
      }
    } catch (err) {
      setMessage("❌ Error processing payment");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4">Choose Subscription Plan</h2>

      {/* Subscription Plan Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium">Select Plan</label>
        <select
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="20">$20 - Local Subscription</option>
          <option value="200">$200 - Premium Subscription</option>
        </select>

        {/* Display Plan Description */}
        {paymentAmount === "20" ? (
          <p className="text-gray-600 mt-2">
            ✅ Access to basic features, idea posting, and searching startup ideas.
          </p>
        ) : (
          <p className="text-gray-600 mt-2">
            ⭐ Premium features include enhanced investor matching, direct messaging, and idea protection.
          </p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Enter Payment Details</h2>
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Cardholder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Billing Address</label>
          <input
            type="text"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Card Details */}
        <div className="border p-3 rounded-md bg-gray-100">
          <CardElement />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 w-full"
        >
          Pay Now
        </button>
      </form>

      {/* Message Display */}
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
};

// Payment Page with Stripe Elements
const PaymentPage = () => {
  const userId = "1234567890abcdef"; // Replace with actual user ID

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm userId={userId} />
    </Elements>
  );
};

export default PaymentPage;
