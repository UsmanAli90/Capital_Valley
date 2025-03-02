import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function SubscriptionForm({ userId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      // 1. Create a PaymentMethod
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      // 2. Send paymentMethod.id + userId to server
      const response = await axios.post("http://localhost:3000/api/subscribe", {
        userId,
        paymentMethodId: paymentMethod.id,
      });

      if (response.status === 200) {
        setMessage("Subscription successful!");
      } else {
        setMessage(response.data.message || "Subscription failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error subscribing");
    }
  };

  return (
    <form onSubmit={handleSubscribe}>
      <h2>Subscribe for Chat Access</h2>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Subscribe
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default function SubscriptionPage() {
  // Suppose you get userId from Redux, context, or props
  const userId = "1234567890abcdef";

  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm userId={userId} />
    </Elements>
  );
}
