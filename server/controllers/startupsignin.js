const startupuser = require('../models/Startupdb');


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
    
    if (startupuser1.password !== password) {
      console.log("password is ", req.password)
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Sign-in successful", user: startupuser.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { StartupsignIn };
