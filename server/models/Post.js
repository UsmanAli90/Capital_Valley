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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
