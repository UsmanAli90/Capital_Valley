const investoruser = require('../models/Investordb');
const bcrypt = require('bcrypt');

const InvestorsignIn = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const investoruser1 = await investoruser.findOne({ email });
    console.log("User found in database:", investoruser1);

    if (!investoruser1) {
      console.log("No user found with provided email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, investoruser1.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      console.log("Passwords do not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: investoruser1._id,
      email: investoruser1.email,
      username: investoruser1.username,
      type: investoruser1.type,
    };

    console.log("Session set with user data:", req.session.user);

    return res.status(200).json({ message: "Sign-in successful", user: req.session.user });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { InvestorsignIn };