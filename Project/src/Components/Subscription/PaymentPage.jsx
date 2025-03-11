// import React, { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // Load Stripe with environment variable
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const PaymentForm = ({ userId }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [billingAddress, setBillingAddress] = useState("");
//   const [paymentAmount, setPaymentAmount] = useState("20"); // Default: Local Subscription
//   const [message, setMessage] = useState("");

//   const handlePayment = async (e) => {
//     e.preventDefault();

//     // Check if Stripe is loaded
//     if (!stripe || !elements) {
//       setMessage("⚠️ Stripe is not loaded yet!");
//       return;
//     }

//     // Get CardElement reference
//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) {
//       setMessage("❌ Card details are not entered properly.");
//       return;
//     }

//     try {
//       // Create payment method
//       const { paymentMethod, error } = await stripe.createPaymentMethod({
//         type: "card",
//         card: cardElement,
//         billing_details: {
//           name,
//           email,
//           address: { line1: billingAddress },
//         },
//       });

//       if (error) {
//         setMessage(error.message);
//         console.error("Payment Method Error:", error);
//         return;
//       }

//       // Validate payment amount
//       const validAmounts = ["20", "200"];
//       if (!validAmounts.includes(paymentAmount)) {
//         setMessage("❌ Invalid payment amount selected.");
//         return;
//       }

//       // Send payment to backend
//       const response = await axios.post("http://localhost:3000/api/payment", {
//         userId,
//         paymentMethodId: paymentMethod.id,
//         amount: paymentAmount, 
//       });
      
//       if (response.status === 200) {
//         setMessage("✅ Payment successful!");
//         setTimeout(() => navigate("/chat"), 2000);
//       } else {
//         setMessage("❌ Payment failed. Try again.");
//       }
//     } catch (err) {
//       setMessage("❌ Error processing payment");
//       console.error("Server Error:", err);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
//       <h2 className="text-2xl font-semibold mb-4">Choose Subscription Plan</h2>

//       {/* Subscription Plan Selection */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium">Select Plan</label>
//         <select
//           value={paymentAmount}
//           onChange={(e) => setPaymentAmount(e.target.value)}
//           className="w-full p-2 border rounded-md"
//           required
//         >
//           <option value="20">$20 - Local Subscription</option>
//           <option value="200">$200 - Premium Subscription</option>
//         </select>

//         {/* Display Plan Description */}
//         {paymentAmount === "20" ? (
//           <p className="text-gray-600 mt-2">
//             ✅ Access to basic features, idea posting, and searching startup ideas.
//           </p>
//         ) : (
//           <p className="text-gray-600 mt-2">
//             ⭐ Premium features include enhanced investor matching, direct messaging, and idea protection.
//           </p>
//         )}
//       </div>

//       <h2 className="text-2xl font-semibold mb-4">Enter Payment Details</h2>
//       <form onSubmit={handlePayment} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Cardholder Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Billing Address</label>
//           <input
//             type="text"
//             value={billingAddress}
//             onChange={(e) => setBillingAddress(e.target.value)}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>

//         {/* Card Details */}
//         <div className="border p-3 rounded-md bg-gray-100">
//           <CardElement />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={!stripe}
//           className="hover:bg-green-500 bg-green-400 text-white px-6 py-3 rounded-lg mt-4 w-full"
//         >
//           Pay Now
//         </button>
//       </form>

//       {/* Message Display */}
//       {message && <p className="text-red-500 mt-2">{message}</p>}
//     </div>
//   );
// };

// // Payment Page with Stripe Elements
// const PaymentPage = () => {
//   const userId = "1234567890abcdef"; // Replace with actual user ID

//   return (
//     <Elements stripe={stripePromise}>
//       <PaymentForm userId={userId} />
//     </Elements>
//   );
// };

// export default PaymentPage;



import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../HomePage/Header";
import { toast } from "react-hot-toast"; // Add this import

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const BASE_URL = "http://localhost:3000"; // Add BASE_URL

const PaymentForm = ({ userId, userType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("20"); // Default: Local Subscription
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet!");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card details are not entered properly.");
      setIsProcessing(false);
      return;
    }

    try {
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
        toast.error(error.message);
        console.error("Payment Method Error:", error);
        setIsProcessing(false);
        return;
      }

      const validAmounts = ["20", "200"];
      if (!validAmounts.includes(paymentAmount)) {
        toast.error("Invalid payment amount selected.");
        setIsProcessing(false);
        return;
      }

 // Send payment to backend - using fetch with credentials like the second implementation
 const response = await fetch(`${BASE_URL}/api/payment`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    paymentMethodId: paymentMethod.id,
    amount: parseInt(paymentAmount), 
    userId: userId,
    type: userType // Include user type (startup or investor)
  }),
  credentials: 'include',
});

const result = await response.json();

if (result.success) {
  // Update user in localStorage as in second implementation
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const updatedUser = {...currentUser, isSubscribed: true};
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  toast.success("Payment successful!");
        setTimeout(() => navigate("/chat"), 2000);
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (err) {
      toast.error(err.message || "Error processing payment");
      console.error("Server Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-2">
      <div className="w-full max-w-5xl mx-4 flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="w-full lg:w-1/3 bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 flex items-center justify-center">
          <div className="text-center">
            {/* Placeholder for Logo - No bouncy effect */}
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
              {/* Add your logo image here, e.g., <img src="/path/to/logo.png" alt="Logo" /> */}
            </div>
            <h1 className="text-3xl font-bold mb-2">Capital Valley</h1>
            <p className="text-sm">Choose your subscription plan.</p>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-r-lg shadow-lg">
          <div className="space-y-8">
            {/* Choose Subscription Plan Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose Subscription Plan</h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Plan</label>
                <select
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                >
                  <option value="20">$20 - Local Subscription</option>
                  <option value="200">$200 - Premium Subscription</option>
                </select>
                <div
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    paymentAmount === "20" ? "bg-green-100" : "bg-green-200"
                  }`}
                >
                  {paymentAmount === "20" ? (
                    <p className="text-gray-600 text-sm">
                      ✅ Access to basic features, idea posting, and searching startup ideas.
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      ⭐ Premium features include enhanced investor matching, direct messaging, and idea protection.
                    </p>
                  )}
                </div>
              </div>
            </div>

{/* Enter Payment Details Section */}
<div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Payment Details</h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Billing Address</label>
                  <input
                    type="text"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>

                <div className="border p-3 rounded-lg bg-gray-100">
                  <CardElement />
                </div>
                <button
                  type="submit"
                  disabled={!stripe}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 w-full"
                >
                  Pay Now
                </button>
              </form>
            </div>

            {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
const PaymentPage = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <div className="text-center mt-10">Loading user data...</div>;
  }

  return (
    <>
    <Helmet>
      <title>Payment - Capital Valley</title>
      <meta
        name="description"
        content="Choose and pay for your subscription plan to unlock Capital Valley features."
      />
    </Helmet>
    <Header />
    <Elements stripe={stripePromise}>
      <PaymentForm userId={userId} />
    </Elements>
  </>
  );
};

export default PaymentPage;