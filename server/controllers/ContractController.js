const Contract = require("../models/Contract");

// Save contract details
const saveContract = async (req, res) => {
  try {
    const { investorAddress, secondUserAddress, investmentAmount, equityPercentage, paymentTimestamp, conditions } = req.body;

    // Create a new contract instance
    const newContract = new Contract({
      investmentAmount,
      equityPercentage,
      conditions, // Save additional conditions
      paymentDate: new Date(paymentTimestamp * 1000), // Convert timestamp to Date
      investor: investorAddress,
      startup: secondUserAddress,
    });

    // Save the contract to the database
    await newContract.save();

    res.status(201).json({ message: "Contract details saved successfully.", contract: newContract });
  } catch (error) {
    console.error("Error saving contract details:", error);
    res.status(500).json({ message: "Failed to save contract details." });
  }
};

// Get all contracts
const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.status(200).json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    res.status(500).json({ message: "Failed to fetch contracts." });
  }
};

module.exports = { saveContract, getContracts };