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
const { resetPassword } = require('./controllers/resetPassword.js');
const { searchProfiles } = require('./controllers/searchcontroller.js')
const { createPost } = require('./controllers/PostUpload.js')
const { filterAndValidatePost } = require("./controllers/Postfilter.js");



dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", // Frontend origin
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
// Endpoint for getting profile data
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


// Endpoint to handle user profile updates
app.post("/updateProfile", async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    try {
        // Find the user entry by email and update their name
        const updatedUser = await Startup.findOneAndUpdate(
            { email }, // Match by email
            { username: name },
            { new: true, upsert: true, setDefaultsOnInsert: true } // Update or create user
        );

        // Update session with the new user data
        req.session.user = { username: updatedUser.username, email: updatedUser.email };

        res.status(200).json(req.session.user);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Server encountered an error" });
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
app.get('/search',searchProfiles)
app.post("/verify-otp1", verifyOTP1);
app.post("/posts", createPost);
app.get('/search', searchProfiles)
app.post("/posts", filterAndValidatePost, createPost);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
