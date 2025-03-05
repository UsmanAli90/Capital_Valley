const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

processPayment = async (req, res) => {
    try {
        const { paymentMethodId, amount } = req.body;
    
        // Validate amount to prevent tampering
        const validAmounts = [20, 200]; // Allowed amounts in dollars
        if (!validAmounts.includes(Number(amount))) {
          return res.status(400).json({ success: false, message: "Invalid payment amount" });
        }
    
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: "usd",
          payment_method: paymentMethodId,
          confirm: true,
          return_url: "http://localhost:3000", // Change this to your actual frontend success page
        });
        
        res.json({ success: true, paymentIntent });
      } catch (error) {
        console.error("Stripe Payment Error:", error);
        res.status(400).json({ success: false, message: error.message });
      }
};
module.exports = {
    processPayment,
  };