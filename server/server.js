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
const { getUsers } = require('./controllers/userControlller.js')
const { sendMessage } = require('./controllers/Messages.js')
const { getMessages } = require('./controllers/Messages.js')
const {app,server} =require('./utils/socket.cjs')


dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.patch('/posts/:id/upvote', async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL
    const { upvoteChange } = req.body; // Extract the change (+1 or -1) from the request body

    console.log('Received ID:', id);
    console.log('Received upvoteChange:', upvoteChange);

    // Validate upvoteChange value
    if (typeof upvoteChange !== 'number') {
        return res.status(400).json({ message: 'Invalid upvoteChange value' });
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $inc: { upvotes: upvoteChange } }, // Adjust the upvotes field by +1 or -1
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('Updated Post:', updatedPost);
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error:', error.stack);
        res.status(500).json({ message: 'Server error', error });
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

app.get("/chat", getUsers)
app.post("/send/:id", sendMessage);
app.get('/:id', getMessages);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
