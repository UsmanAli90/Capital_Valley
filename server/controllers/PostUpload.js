const Post = require("../models/Post");

const createPost = async (req, res) => {
  const { problem, solution, niches, costRange } = req.body;

  try {
    const newPost = await Post.create({
      problem,
      solution,
      niches,
      costRange,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error saving post:", error);
    res.status(500).json({ error: "Failed to save post." });
  }
};

module.exports = {
  createPost,
};
