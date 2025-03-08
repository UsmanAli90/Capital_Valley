const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db.js");
const Startup = require("./models/Startupdb.js");
const Investor = require("./models/Investordb.js"); // Added Investor model
const { createStartup } = require("./controllers/startupsignup.js");
const { createInvestor } = require("./controllers/investorsignup.js");
const { StartupsignIn } = require("./controllers/startupsignin.js");
const { InvestorsignIn } = require("./controllers/investorsignin.js");
const { forgotPassword, verifyOTP } = require("./controllers/forgotPassword");
const { forgotPassword1, verifyOTP1 } = require("./controllers/forgotPasswordInvestor.js");
const { resetPassword } = require("./controllers/resetPassword.js");
const { resetPassword1 } = require("./controllers/resetPasswordIvestor.js");
const { searchProfiles } = require("./controllers/searchcontroller.js");
const { createPost } = require("./controllers/PostUpload.js");
const { filterAndValidatePost } = require("./controllers/Postfilter.js");
const Post = require("./models/Post.js");
const { getUsers } = require("./controllers/userControlller.js");
const { sendMessage } = require("./controllers/Messages.js");
const { getMessages } = require("./controllers/Messages.js");
const { app, server } = require("./utils/socket.cjs");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added from main
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
connectDB(process.env.MONGO_URI);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Profile Route (Logged-in User)
app.get("/profile", (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({
      success: true,
      user: req.session.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Session expired",
    });
  }
});

// Profile Route (Specific User by ID)
app.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // First try to find in Startup collection
    let user = await Startup.findById(id).select("id username email type");
    if (!user) {
      // If not found in Startup, try Investor collection
      user = await Investor.findById(id).select("id username email type");
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update Profile Route
app.post("/updateProfile", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const updatedUser = await Startup.findOneAndUpdate(
      { email },
      { username: name },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    req.session.user = { username: updatedUser.username, email: updatedUser.email };

    res.status(200).json(req.session.user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server encountered an error" });
  }
});

// Route to get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("owner", "name email")
      .sort({ upvotes: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts." });
  }
});

// Route to get liked posts
app.get("/posts/liked/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const likedPosts = await Post.find({ upvotedBy: userId });

    if (!likedPosts.length) {
      return res.status(404).json({ message: "No liked posts found" });
    }

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to get owned posts
app.get("/posts/owned/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ owner: userId });

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching owned posts:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to upvote a post
app.patch("/posts/:id/upvote", async (req, res) => {
  const { id } = req.params;
  const { userId, upvoteChange } = req.body;

  console.log("Received upvote request:");
  console.log("Post ID:", id);
  console.log("User ID:", userId);
  console.log("Upvote Change:", upvoteChange);

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    let update = {};

    if (upvoteChange === 1) {
      update = {
        $inc: { upvotes: 1 },
        $addToSet: { upvotedBy: userId },
      };
    } else if (upvoteChange === -1) {
      update = {
        $inc: { upvotes: -1 },
        $pull: { upvotedBy: userId },
      };
    } else {
      return res.status(400).json({ message: "Invalid upvoteChange value" });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating upvote:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Existing Routes
app.post("/startupsignup", createStartup);
app.post("/investorsignup", createInvestor);
app.post("/startupsignin", StartupsignIn);
app.post("/investorsignin", InvestorsignIn);
app.post("/forgot-password", forgotPassword);
app.post("/forgot-password1", forgotPassword1);
app.post("/verify-otp", verifyOTP);
app.use("/reset-password", resetPassword);
app.use("/reset-password1", resetPassword1);
app.post("/verify-otp1", verifyOTP1);
app.get("/search", searchProfiles);
app.post("/filterposts", filterAndValidatePost, createPost);

// New Chat Routes from main
app.get("/chat", getUsers);
app.post("/send/:id", sendMessage);
app.get("/:id", getMessages);

// Start Server with WebSocket
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});