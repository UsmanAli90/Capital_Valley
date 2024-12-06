const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Invalid email format"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [50, "Username cannot exceed 50 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (value) {
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
      },
      message: "Password must include uppercase, lowercase, number, and special character",
    },
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(?:\d{5}-\d{7}-\d|\d{13})$/,
      'Please provide a valid CNIC (format: 12345-1234567-1 or 1234512345671)',
    ],
  },

  areasOfInterest: {
    type: String,
    required: [true, "Areas of interest are required"],
  },
  agreed: {
    type: Boolean,
    required: [true, "You must agree to the terms"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Investor", investorSchema);
