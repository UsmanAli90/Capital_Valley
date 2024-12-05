const express = require("express");
const router = express.Router();
const Startup = require("../models/Startupdb");
const Investor = require("../models/Investordb"); 

router.get("/profile/:id", async (req, res) => {
  const { id } = req.params; 
  const { role } = req.query; 

  try {
    let user;
    if (role === "startup") {
      user = await Startup.findById(id);
    } else if (role === "investor") {
      user = await Investor.findById(id);
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
