// New backend route to get all contracts for the authenticated user
const mongoose = require("mongoose");
const Contract = require("../models/Contract.js");
const getAllUserContracts = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        // Fetch all contracts where the user is either sender OR receiver
        const contracts = await Contract.find({
            $or: [
                { senderId: userObjectId },
                { receiverId: userObjectId }
            ]
        }).sort({ createdAt: -1 }); // Sort by newest first

        console.log(`Found ${contracts.length} contracts for user ${userId}`);

        res.status(200).json({ contracts });
    } catch (error) {
        console.error("Error fetching user contracts:", error);
        res.status(500).json({ message: "Failed to fetch contracts." });
    }
};


module.exports = { getAllUserContracts };

