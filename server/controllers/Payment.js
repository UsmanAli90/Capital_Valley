const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
    try {
        const { amount, paymentMethodId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents (e.g., 1000 = $10)
            currency: "usd",
            payment_method: paymentMethodId,
            confirm: true,
        });

        console.log(`✅ Payment successful: ${paymentIntent.id}`);
        res.status(200).json({ success: true, message: "Payment Successful", paymentIntent });
    } catch (error) {
        console.error("❌ Payment failed:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
