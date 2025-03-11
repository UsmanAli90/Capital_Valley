const Stripe = require("stripe");
const dotenv = require("dotenv");
const Startup = require("../models/Startupdb.js"); // Add this line
const Investor = require("../models/Investordb.js"); // Add this line

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

processPayment = async (req, res) => {
    try {
        // const { paymentMethodId, amount } = req.body;
        const { paymentMethodId, amount, userId, type } = req.body;
    
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
          return_url: "http://localhost:5173/chat", // Change this to your actual frontend success page
        });

        console.log("In payment Controller Payment successful, updating subscription for:", userId, type);

        // Update the user's subscription status
        let updatedUser;
        if (type === "startup") {
            updatedUser = await Startup.findByIdAndUpdate(
                userId, 
                { isSubscribed: true },
                { new: true }
            );
        } else if (type === "investor") {
            updatedUser = await Investor.findByIdAndUpdate(
                userId,
                { isSubscribed: true },
                { new: true }
            );
        }
        
        console.log("In PaymentController: Updated user:", updatedUser);
        if (req.user) {
          req.user.isSubscribed = true;
      }
      
      res.json({ 
          success: true, 
          paymentIntent,
          user: {
              id: updatedUser._id,
              isSubscribed: updatedUser.isSubscribed
          }
      });
    } catch (error) {
      console.error("Stripe Payment Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
};
module.exports = {
    processPayment,
  };
