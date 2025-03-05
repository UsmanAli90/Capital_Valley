const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure you have Stripe configured
const {processPayment} = require("../controllers/Payment")

router.post("api/payment", processPayment);

module.exports = router;
