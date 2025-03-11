// SubscriptionController.js
const mongoose = require("mongoose");
const Startup = require("../models/Startupdb.js");
const Investor = require("../models/Investordb.js");
const checkSubscription = async (req, res) => {
    try {
        const { userId, type } = req.query;

        // Validate userId as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("Invalid userId in Subscription Controller");
            return res.status(400).json({ message: "Invalid userId." });
        }

        let user;
        if (type === "startup") {
            user = await Startup.findById(userId);
        } else if (type === "investor") {
            user = await Investor.findById(userId);
        } else {
            return res.status(400).json({ message: "Invalid user type." });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user has an active subscription
        const hasSubscription = user.isSubscribed;

        res.status(200).json({ hasSubscription });
    } catch (error) {
        console.error("Error checking subscription:", error);
        res.status(500).json({ message: "Failed to check subscription status." });
    }
};

module.exports = { checkSubscription };