const startupuser = require('../models/Startupdb');
const bcrypt = require('bcrypt');

const StartupsignIn = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const startupuser1 = await startupuser.findOne({ email });
    console.log("User found in database:", startupuser1);

    if (!startupuser1) {
      console.log("No user found with provided email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, startupuser1.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      console.log("Passwords do not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a session
    req.session.user = {
      id: startupuser1._id,
      email: startupuser1.email,
      username: startupuser1.username,
    };

    console.log("Session set with user data:", req.session.user);

    // Send JSON response with session information
    return res.status(200).json({ message: "Sign-in successful", user: req.session.user });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { StartupsignIn };