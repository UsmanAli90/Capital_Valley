const express = require("express")
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./db.js');
const Startup = require('./models/Startupdb.js');
const { createStartup } = require('./controllers/startupsignup.js')
const { createInvestor } = require('./controllers/investorsignup.js')
const { StartupsignIn } = require('./controllers/startupsignin.js')
const { InvestorsignIn } = require('./controllers/investorsignin.js')
const { forgotPassword, verifyOTP } = require("./controllers/forgotPassword");
const { forgotPassword1, verifyOTP1 } = require("./controllers/forgotPasswordInvestor.js");
const { resetPassword } = require('./controllers/resetPassword.js');
const { resetPassword1 } = require('./controllers/resetPasswordIvestor.js');
const { searchProfiles } = require('./controllers/searchcontroller.js')
const { createPost } = require('./controllers/PostUpload.js')
const { filterAndValidatePost } = require("./controllers/Postfilter.js");
const Post = require('./models/Post.js');


dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}));
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


app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }

        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully" });
    });
});

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
        // Determine the sort order
        const posts = await Post.find()
            .populate("owner", "name email")
            .sort({ upvotes: -1 });

        // Send the posts as a response
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error while fetching posts." });
    }
});


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



app.get("/posts/owned/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ owner: userId }); // ✅ Fetch posts owned by user

        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching owned posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
});



app.patch('/posts/:id/upvote', async (req, res) => {
    const { id } = req.params;
    const { userId, upvoteChange } = req.body; // ✅ Include userId

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
                $addToSet: { upvotedBy: userId } // ✅ Add user to upvotedBy list
            };
        } else if (upvoteChange === -1) {
            update = { 
                $inc: { upvotes: -1 }, 
                $pull: { upvotedBy: userId } // ✅ Remove user from upvotedBy list
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







app.post("/startupsignup", createStartup);
app.post("/investorsignup", createInvestor);
app.post("/startupsignin", StartupsignIn);
app.post("/investorsignin", InvestorsignIn);
app.post("/forgot-password", forgotPassword);
app.post("/forgot-password1", forgotPassword1);
app.post("/verify-otp", verifyOTP);
app.use('/reset-password', resetPassword);
app.use('/reset-password1', resetPassword1);
app.post("/verify-otp1", verifyOTP1);
app.get('/search', searchProfiles)
app.post("/filterposts", filterAndValidatePost, createPost);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
