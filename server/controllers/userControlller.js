const Startup = require("../models/Startupdb.js");
const Investor = require("../models/Investordb.js");


const getUsers = async (req, res) => {
    try {
        // Fetch all users from both collections
        const startupUsers = await Startup.find().select("username");
        const investorUsers = await Investor.find().select("username");

        // Combine results
        const users = [...startupUsers, ...investorUsers];

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





module.exports = { getUsers };