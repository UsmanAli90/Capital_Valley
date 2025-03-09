// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  problem: { type: String, required: true },
  solution: { type: String, required: true }, // Full solution (optional, for owner access)
  niches: { type: [String], required: true },
  costRange: { type: String, required: true },
  companyName: { type: String, required: true },
  companyUrl: { type: String },
  productLink: { type: String },
  companyLocation: { type: String, required: true },
  activeUsers: { type: Number, required: true },
  isFullTime: { type: String, enum: ["Yes", "No"], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  abstract: { type: String, required: true }, // Summary for public display
  hash: { type: String, required: true }, // Local SHA-256 hash for verification
  ipfsHash: { type: String, required: true }, // Pinata IPFS hash
});

module.exports = mongoose.model("Post", PostSchema);