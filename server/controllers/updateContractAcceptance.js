const Contract = require("../models/Contract");
const updateContractAcceptance = async (req, res) => {
    try {
        const { contractID } = req.params;

        // Find the contract by ID and update isAccepted to true
        const updatedContract = await Contract.findByIdAndUpdate(
            contractID,
            { isAccepted: true },
            { new: true } // Return the updated document
        );

        if (!updatedContract) {
            return res.status(404).json({ message: "Contract not found." });
        }

        res.status(200).json({ message: "Contract accepted successfully.", contract: updatedContract });
    } catch (error) {
        console.error("Error updating contract acceptance:", error);
        res.status(500).json({ message: "Failed to update contract acceptance." });
    }
};

module.exports = { updateContractAcceptance };