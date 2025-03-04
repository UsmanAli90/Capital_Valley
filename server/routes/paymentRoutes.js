const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure you have Stripe configured

router.post("/payment", async (req, res) => {
  const { userId, paymentMethodId, name, email, billingAddress, amount } = req.body;

  // Allowed subscription amounts
  const validAmounts = [20, 200];

  // Validate amount
  if (!validAmounts.includes(Number(amount))) {
    return res.status(400).json({ error: "Invalid payment amount." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });
    console.log("Amount in cents:", amount * 100);
    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
