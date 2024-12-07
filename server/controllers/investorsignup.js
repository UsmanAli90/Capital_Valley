const Investor = require("../models/Investordb"); // Assuming you have an Investor model
const bcrypt = require('bcrypt');
const createInvestor = async (req, res) => {
  try {
    const { email, username, password, cnic, areasOfInterest, agreed } = req.body;

    // Check for required fields
    if (!email || !username || !password || !cnic || !areasOfInterest || agreed === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(req.body.password)
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const securePassword = hashedPassword;

    // Create a new investor instance
    const newInvestor = new Investor({
      email,
      username,
      password: securePassword,
      cnic,
      areasOfInterest,
      agreed,
    });

    console.log("New Investor is:", newInvestor);

    try {
      // Save the new investor to the database
      const savedInvestor = await newInvestor.save();

      console.log("Saved Investor:", savedInvestor);

      // Respond with success
      res.status(201).json({ message: "Investor created successfully", savedInvestor });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Email or CNIC already exists" });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or CNIC already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createInvestor };
