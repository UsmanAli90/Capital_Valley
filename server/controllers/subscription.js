// routes/subscription.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User"); // or Startup/Investor model, whichever you use

router.post("/subscribe", async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.body;
    if (!userId || !paymentMethodId) {
      return res.status(400).json({ message: "Missing userId or paymentMethodId" });
    }

    // 1. Retrieve user from DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Create a PaymentIntent on Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10 subscription fee (in cents)
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true, // Immediately confirm the payment
    });

    // 3. If payment is successful, update user subscription
    user.isSubscribed = true;
    await user.save();

    res.status(200).json({ message: "Subscription successful!", paymentIntent });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
