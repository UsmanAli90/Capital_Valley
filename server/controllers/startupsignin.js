const startupuser = require('../models/Startupdb');
const bcrypt = require('bcrypt');

const StartupsignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const startupuser1 = await startupuser.findOne({ email });

    if (!startupuser1) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, startupuser1.password);
    if (!isMatch) {

      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Sign-in successful", user: startupuser1.email });
  } catch (err) {
    console.error("Error in StartupsignIn:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { StartupsignIn };
