const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  niches: { type: [String], required: true },
  costRange: { type: String, required: true },
  companyName: { type: String, required: true },
  companyUrl: { type: String },
  productLink: { type: String },
  companyLocation: { type: String, required: true },
  activeUsers: { type: Number, required: true },
  isFullTime: { type: String, enum: ["Yes", "No"], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true },
  upvotes: { type: Number, default: 0 }, // Count of upvotes
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store users who upvoted
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
