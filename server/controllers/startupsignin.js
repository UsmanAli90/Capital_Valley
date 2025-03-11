const startupuser = require('../models/Startupdb');
const bcrypt = require('bcrypt');

const StartupsignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const startupuser1 = await startupuser.findOne({ email });


    if (!startupuser1) {
      console.log("No user found with provided email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, startupuser1.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    req.session.user = {
      id: startupuser1._id,
      email: startupuser1.email,
      username: startupuser1.username,
      type: startupuser1.type,
      avatar: startupuser1.avatar,
    };

    console.log("Session set with user data:", req.session.user);


    return res.status(200).json({ message: "Sign-in successful", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { StartupsignIn };