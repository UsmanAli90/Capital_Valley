const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure the email is unique
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false, // This field can be used for OTP verification
  },
  otpExpires: {
    type: Date,
    required: false, // This field can be used to set an expiration time for OTP
  },
  // Add any other fields as necessary
});

// Create and export the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = { User };
