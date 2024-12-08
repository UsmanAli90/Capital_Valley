const Post = require("../models/Post");
const Startup = require("../models/Startupdb");

const createPost = async (req, res) => {
  const {
    problem,
    solution,
    niches,
    costRange,
    companyName,
    companyUrl,
    productLink,
    companyLocation,
    activeUsers,
    isFullTime,
  } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    const user = await Startup.findOne({ username: req.session.user.username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const newPost = await Post.create({
      problem,
      solution,
      niches,
      costRange,
      companyName,
      companyUrl,
      productLink,
      companyLocation,
      activeUsers,
      isFullTime,
      owner: user._id, // Save the owner's ObjectId
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ error: "Failed to save post." });
  }
};

module.exports = {
  createPost,
};