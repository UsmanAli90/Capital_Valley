const Contract = require("../models/Contract");
const declineContract = async (req, res) => {
    try {
        const { contractID } = req.params;

        // Find the contract by ID and update isDeclined to true
        const updatedContract = await Contract.findByIdAndUpdate(
            contractID,
            { isDeclined: true },
            { new: true } // Return the updated document
        );

        if (!updatedContract) {
            return res.status(404).json({ message: "Contract not found." });
        }

        res.status(200).json({ message: "Contract declined successfully.", contract: updatedContract });
    } catch (error) {
        console.error("Error declining contract:", error);
        res.status(500).json({ message: "Failed to decline contract." });
    }
};

module.exports = { declineContract };