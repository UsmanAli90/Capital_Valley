const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: true,
    unique: true,
    default: () => {
      // Generate a random Ethereum-like address (42 characters, starts with 0x)
      const randomHex = "0x" + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      return randomHex;
    },
  },
  investmentAmount: {
    type: Number,
    required: true,
  },
  equityPercentage: {
    type: Number,
    required: true,
  },
  conditions: {
    type: String,
    default: "", // Default to an empty string if no conditions are provided
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  investor: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Basic Ethereum address validation (42 characters, starts with 0x)
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Ethereum address!`,
    },
  },
  startup: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Basic Ethereum address validation (42 characters, starts with 0x)
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Ethereum address!`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contract", contractSchema);