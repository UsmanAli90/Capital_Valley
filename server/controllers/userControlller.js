const Startup = require("../models/Startupdb.js");
const Investor = require("../models/Investordb.js");

const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id; // Assuming the current user's ID is stored in req.user._id

        // Fetch all users from both collections, excluding the current user
        const startupUsers = await Startup.find({ _id: { $ne: currentUserId } }).select("username profilepic");
        const investorUsers = await Investor.find({ _id: { $ne: currentUserId } }).select("username profilepic");

        // Combine results
        const users = [...startupUsers, ...investorUsers];

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getUsers };