const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models//Investordb.js");

// Reset the user's password
const resetPassword1 = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findById(userId); // Assuming you have a User model with the ID
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {resetPassword1};
