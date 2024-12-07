const User = require("../models/Startupdb.js");
const { generateOTP, sendEmail } = require("../utils/utils");
const mongoose = require('mongoose');


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    const userId = user._id.toString();  // Convert ObjectId to string
    
    console.log(userId);
      if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate OTP and expiration time
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP via email
    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}. It is valid for 10 minutes.`);

    res.status(200).json({ message: "OTP sent. Check your email.", id:userId });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ message: "Error processing request." });
  }
};



const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    // Find user with matching OTP and check if OTP is still valid
    const user = await User.findOne({ otp, otpExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Clear OTP and expiration after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    res.status(500).json({ message: "Error verifying OTP." });
  }
};


const verifyOtpAndResetPassword = async (req, res) => {
  const { otp } = req.body;

  try {
      const user = await User.findOne({
          otp,
          otpExpires: { $gt: Date.now() },
      });

      if (!user) {
          return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      // OTP verified; return a token (or user ID) for the reset process
      res.status(200).json({ message: "OTP verified successfully!", userId: user._id });
  } catch (error) {
      res.status(500).json({ message: "Error verifying OTP." });
  }
};


module.exports = { forgotPassword,verifyOTP, verifyOtpAndResetPassword };
