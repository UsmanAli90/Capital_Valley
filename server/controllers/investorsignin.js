const investoruser = require('../models/Investordb');
const bcrypt = require('bcrypt');

const InvestorsignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const investoruser1 = await investoruser.findOne({ email });

    if (!investoruser1) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, investoruser1.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Sign-in successful", user: investoruser1.email });
  } catch (err) {
    console.error("Error in InvestorsignIn:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { InvestorsignIn };
