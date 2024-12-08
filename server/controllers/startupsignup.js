const Startup = require("../models/Startupdb.js");
const bcrypt = require('bcryptjs');

const createStartup = async (req, res) => {
  try {
    const { email, username, password, cnic, description } = req.body;

    // Check for required fields
    if (!email || !username || !password || !cnic || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const securePassword = hashedPassword;

    // Create a new startup instance
    const newStartup = new Startup({ email, username, password: securePassword, cnic, startupDescription: description, type: "startup" });

    try {
      await newStartup.save();
      console.log("New Startup is", newStartup);

      // Send JSON response indicating successful signup
      res.status(201).json({ message: "Startup created successfully", startup: newStartup });
    } catch (error) {
      console.error("Error creating startup:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error creating startup", error: error.message });
      }
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or CNIC already exists" });
    }
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = { createStartup };