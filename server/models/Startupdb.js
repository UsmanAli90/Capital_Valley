const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
    match: [/^(?:\d{5}-\d{7}-\d|\d{13})$/, 'Please provide a valid CNIC (format: 12345-1234567-1 or 1234512345671)'],
  },
  startupDescription: {
    type: String,
    required: true,
    maxlength: 500,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: "startup", // Changed from value to default
  },
  avatar: {
    type: String,
    default: "/avatars/default.png", // Default avatar
  },
  isSubscribed: { 
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Startup', startupSchema);