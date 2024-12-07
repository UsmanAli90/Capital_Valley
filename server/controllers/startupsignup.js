const Startup = require("../models/Startupdb.js");
const bcrypt = require('bcrypt');
const createStartup = async (req, res) => {
  try {
    const { email, username, password, cnic, description } = req.body;

    if (!email || !username || !password || !cnic || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStartup = new Startup({ email, username, password, cnic, startupDescription: description });
    console.log("New Startup is",newStartup)


    const savedStartup = await newStartup.save();
    console.log("New Startup is",Startup)
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
