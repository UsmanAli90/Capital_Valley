const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  problem: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  niches: {
    type: [String], 
    required: true,
  },
  costRange: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.model("Post", PostSchema);
