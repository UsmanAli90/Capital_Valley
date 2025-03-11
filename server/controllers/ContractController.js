const Contract = require("../models/Contract");

const saveContract = async (req, res) => {
    try {
        console.log("Request Params:", req.params); // Debugging log
        console.log("Request Body:", req.body); // Debugging log
        //   const { investorAddress, secondUserAddress, investmentAmount, equityPercentage, paymentTimestamp, conditions } = req.body;
        const { investorAddress, secondUserAddress, investmentAmount, equityPercentage, conditions, postId,
            postName } = req.body;
        const { id: receiverId } = req.params;
        const { senderId } = req.body;
        console.log("sender ID", senderId);
        console.log("receiver ID", receiverId);

        if (!receiverId) {
            return res.status(400).json({ message: "receiverId is missing in request parameters." });
        }

        // Create a new contract instance
        const newContract = new Contract({
            senderId,
            receiverId,
            investmentAmount,
            equityPercentage,
            conditions, 
            investor: investorAddress,
            startup: secondUserAddress,
            postId,
            postName,
        });

        // Save the contract to the database
        await newContract.save();

        // req.io.emit('contractCreated', newContract); // Emit to all connected clients

        res.status(201).json({ message: "Contract details saved successfully.", contract: newContract });
    } catch (error) {
        console.error("Error saving contract details:", error);
        res.status(500).json({ message: "Failed to save contract details." });
    }
};


const mongoose = require("mongoose"); // Ensure ObjectId conversion


const getContracts = async (req, res) => {
    try {
        const { id: userToContractID } = req.params; // The user you are contracting with
        const myId = req.user._id; // Authenticated user

        console.log("myId:", myId); // Debugging
        console.log("userToContractId:", userToContractID); // Debugging

        if (!mongoose.Types.ObjectId.isValid(myId) || !mongoose.Types.ObjectId.isValid(userToContractID)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const myObjectId = new mongoose.Types.ObjectId(myId);
        const userToContractObjectId = new mongoose.Types.ObjectId(userToContractID);
        console.log("myObjectId after changing:", myObjectId); // Debugging
        console.log("userToContractObjectId after changing:", userToContractObjectId); // Debugging

        // Fetch only contracts between the two users
        const contracts = await Contract.find({
            $or: [
                { senderId: myObjectId, receiverId: userToContractObjectId },
                { senderId: userToContractObjectId, receiverId: myObjectId }
            ]
        });

        console.log("Contracts in Controller are", contracts);

        res.status(200).json({ contracts });
    } catch (error) {
        console.error("Error fetching contracts:", error);
        res.status(500).json({ message: "Failed to fetch contracts." });
    }
};


module.exports = { saveContract, getContracts };