const investoruser = require('../models/Investordb')
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');


const app = express();

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.json());

const InvestorsignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const investoruser1 = await investoruser.findOne({ email });
    const isMatch = await bcrypt.compare(password, investoruser1.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!investoruser1 || investoruser1.password !== password) {

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a session
    req.session.user = {
      id: investoruser1._id,
      email: investoruser1.email,
      // Add other details as needed
    };
  

    const investorDetails = await investoruser.findById(investoruser1._id);
    console.log(investorDetails);


    res.status(200).json({ message: "Sign-in successful", user: investorDetails });
  } catch (err) {
    console.error("Error in InvestorsignIn:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { InvestorsignIn };
