const Startup = require("../models/Startupdb.js");
const bcrypt = require('bcryptjs');

const createStartup = async (req, res) => {
  try {
    const { email, username, password, cnic, description } = req.body;

    if (!email || !username || !password || !cnic || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const securePassword = hashedPassword;

    const newStartup = new Startup({ email, username, password: securePassword, cnic, startupDescription: description });

    try {
      await newStartup.save();
      console.log("New Startup is", newStartup);
      res.status(201).json({ message: "Startup created successfully", startup: newStartup });
    } catch (error) {
      console.error("Error creating startup:", error);
      res.status(500).json({ message: "Error creating startup", error: error.message });
    }


    const savedStartup = await newStartup.save();
    console.log("New Startup is", Startup)
    res.status(201).json({ message: "Startup created successfully", savedStartup });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or CNIC already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createStartup };
