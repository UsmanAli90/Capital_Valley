const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db.js");
const Startup = require("./models/Startupdb.js");
const Investor = require("./models/Investordb.js");
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
const { processPayment } = require("./controllers/Payment.js");
const Post = require("./models/Post.js");
const { getUsers } = require("./controllers/userControlller.js");
const { sendMessage } = require("./controllers/Messages.js");
const { getMessages } = require("./controllers/Messages.js");
const Message = require("./models/Message.js");
const crypto = require("crypto");
const { PinataSDK } = require("pinata");
const { Blob } = require("buffer");
const { saveContract, getContracts } = require("./controllers/ContractController.js");
const { updateContractAcceptance } = require('./controllers/updateContractAcceptance.js');
const { declineContract } = require('./controllers/updateContractDecline.js');
const { checkSubscription } = require("./controllers/SubscriptionController.js");
const { getAllUserContracts } = require('./controllers/getAllUserContracts.js');
const { getPostSolutionById } = require('./controllers/PostSolution.js');

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const { saveContract, getContracts } = require("./controllers/ContractController.js");

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL,
});


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

const attachUser = (req, res, next) => {
    if (req.session.user) {
        console.log("User in session:", req.session.user);
        req.user = req.session.user;
        req.user._id = req.session.user.id;
        next();
    } else {
        console.log("No user in session");
        return res.status(401).json({ message: "Unauthorized: No user in session" });
    }
};

// Define the /update-avatar route
app.post("/update-avatar", attachUser, async (req, res) => {
    console.log("Received /update-avatar request:", req.body);
    const { avatar } = req.body;
    if (!avatar) {
        console.log("No avatar provided in request body");
        return res.status(400).json({ message: "Avatar URL is required" });
    }

    try {
        const userId = req.session.user.id;
        console.log("User ID from session:", userId);
        console.log("User type from session:", req.session.user.type);
        console.log("Attempting to update avatar to:", avatar);

        let updatedUser;

        if (req.session.user.type === "startup") {
            console.log("Updating Startup user with ID:", userId);
            updatedUser = await Startup.findByIdAndUpdate(userId, { avatar }, { new: true });
            console.log("Updated Startup user:", updatedUser);
        } else if (req.session.user.type === "investor") {
            console.log("Updating Investor user with ID:", userId);
            updatedUser = await Investor.findByIdAndUpdate(userId, { avatar }, { new: true });
            console.log("Updated Investor user:", updatedUser);
        }

        if (!updatedUser) {
            console.log("No user found with ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Updating session with new avatar:", avatar);
        req.session.user.avatar = avatar;
        console.log("Updated session user:", req.session.user);

        res.status(200).json({ message: "Avatar updated", user: req.session.user });
        console.log("Response sent successfully");
    } catch (error) {
        console.error("Error updating avatar:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Other routes
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
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

app.get("/profile/:id", async (req, res) => {

    try {
        const { id } = req.params;
        let user = await Startup.findById(id).select("id username email type avatar");
        if (!user) user = await Investor.findById(id).select("id username email type avatar");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, user: { id: user._id, username: user.username, email: user.email, type: user.type, avatar: user.avatar } });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



app.post("/updateProfile", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
    try {
        const updatedUser = await Startup.findOneAndUpdate({ email }, { username: name }, { new: true, upsert: true, setDefaultsOnInsert: true });
        req.session.user = { username: updatedUser.username, email: updatedUser.email };
        res.status(200).json(req.session.user);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Server encountered an error" });
    }
});

app.get("/posts", async (req, res) => {

    try {
        const posts = await Post.find()
            .populate("owner", "email username avatar") // Populate owner with email and username
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/share-full-idea/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if the user is authorized to view the full idea
        if (req.session.user._id !== post.owner.toString()) {
            return res.status(403).json({ message: "Unauthorized: Only the owner can share the full idea" });
        }

        // Fetch the full idea from Pinata
        const file = await pinata.pinList(post.ipfsHash);
        const fullIdea = JSON.parse(file.data.toString());

        res.status(200).json({ success: true, idea: fullIdea });
    } catch (error) {
        console.error("Error sharing full idea:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/posts/liked/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "User ID is required" });
        const likedPosts = await Post.find({ upvotedBy: userId })
            .select("problem niches costRange companyName companyUrl productLink companyLocation activeUsers isFullTime upvotes owner abstract createdAt hash ipfsHash");
        if (!likedPosts.length) return res.status(404).json({ message: "No liked posts found" });
        res.status(200).json(likedPosts);
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.get("/posts/owned/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ owner: userId })
            .select("problem niches costRange companyName companyUrl productLink companyLocation activeUsers isFullTime upvotes owner abstract createdAt hash ipfsHash");
        if (!posts.length) return res.status(404).json({ message: "No posts found" });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching owned posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.patch("/posts/:id/upvote", async (req, res) => {
    const { id } = req.params;
    const { userId, upvoteChange } = req.body;
    console.log("Received upvote request:", { id, userId, upvoteChange });
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    try {
        let update = {};
        if (upvoteChange === 1) update = { $inc: { upvotes: 1 }, $addToSet: { upvotedBy: userId } };
        else if (upvoteChange === -1) update = { $inc: { upvotes: -1 }, $pull: { upvotedBy: userId } };
        else return res.status(400).json({ message: "Invalid upvoteChange value" });
        const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true });
        if (!updatedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error updating upvote:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/filterposts", filterAndValidatePost, async (req, res) => {
    try {
        console.log("Received post data:", req.body);
        const { problem, solution, niches, costRange, companyName, companyUrl, productLink, companyLocation, activeUsers, isFullTime, owner: bodyOwner } = req.body;
        const owner = bodyOwner || req.session.user?._id;

        if (!owner) {
            console.error("Owner not found in session or body:", { session: req.session.user, body: bodyOwner });
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        // Generate abstract
        console.log("Generating abstract...");
        const abstract = `${problem}. Niche: ${niches[0] || "N/A"}`;

        // Prepare full idea for Pinata
        console.log("Preparing full idea for Pinata...");
        const fullIdea = JSON.stringify({ problem, solution, niches, costRange, companyName, companyUrl, productLink, companyLocation, activeUsers, isFullTime });

        let ipfsHash;
        try {
            console.log("Uploading to Pinata using SDK...");
            const blob = new Blob([Buffer.from(fullIdea)]);
            const timestamp = Date.now(); // Use timestamp for uniqueness
            const filename = `fullIdea_${timestamp}.json`; // Unique filename
            const file = new File([blob], filename, { type: "application/json" });
            const upload = await pinata.upload.public.file(file); // Match documentation
            console.log("Pinata upload response:", upload);
            ipfsHash = upload.cid; // Use 'cid' as per documentation response
            console.log("Pinata upload successful, CID:", ipfsHash);
        } catch (pinataError) {
            console.error("Pinata upload failed:", pinataError);
            console.warn("Using fallback CID...");
            ipfsHash = "QmPlaceholderHashForTesting123";
        }

        // Generate SHA-256 hash
        console.log("Generating SHA-256 hash...");
        const hash = crypto.createHash("sha256").update(fullIdea).digest("hex");

        // Create post in MongoDB
        console.log("Creating post in MongoDB...");
        const post = await Post.create({
            problem,
            solution,
            niches,
            costRange,
            companyName,
            companyUrl,
            productLink,
            companyLocation,
            activeUsers: Number(activeUsers),
            isFullTime,
            owner,
            abstract,
            hash,
            ipfsHash,
        });

        console.log("Post created successfully:", post);
        res.status(201).json(post);
    } catch (error) {
        console.error("Error in /filterposts:", error);
        res.status(500).json({ message: `Server error while creating post: ${error.message}` });
    }


});

app.get("/verify-idea/:hash", async (req, res) => {
    try {
        const { hash } = req.params;
        const post = await Post.findOne({ hash });
        if (!post) return res.status(404).json({ message: "Idea not found" });

        if (req.session.user._id !== post.owner.toString()) {
            return res.status(403).json({ message: "Unauthorized: Only the owner can view the full idea" });
        }

        console.log("Fetching full idea from Pinata using SDK...");
        const file = await pinata.gateways.get(post.ipfsHash);
        const fullIdea = JSON.parse(file.data.toString()); // Convert Buffer to string and parse JSON
        console.log("Fetched full idea:", fullIdea);


        res.status(200).json({ success: true, idea: fullIdea });
    } catch (error) {
        console.error("Error verifying idea:", error);
        res.status(500).json({ message: "Server error" });
    }
});

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
app.use("/api/payment", processPayment);

app.get("/chat", attachUser, getUsers);
app.post("/send/:id", attachUser, sendMessage);
app.get("/messages/:id", attachUser, getMessages);
app.post("/contracts/:id", attachUser, saveContract);
app.get('/getcontract/:id', attachUser, getContracts);
app.put('/contract/:contractID/accept', updateContractAcceptance);
app.put('/contract/:contractID/decline', declineContract);
app.get("/check-subscription", attachUser, checkSubscription);
app.get('/getUserContracts', attachUser, getAllUserContracts);
app.get('/getPostSolution/:postId', attachUser, getPostSolutionById);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('sendMessage', async (message) => {
        // Check if message is null or undefined
        if (!message) {
            console.error('Received null or undefined message object');
            return; // Exit the function early
        }

        // Check if message has the required properties
        if (!message.senderId || !message.receiverId) {
            console.error('Message missing required fields:', message);
            return; // Exit the function early
        }

        const { senderId, receiverId, text, _id } = message;

        try {
            // Check if the message already has an _id (meaning it was already saved)
            if (_id) {
                // Message already saved, just forward it
                console.log('Message already saved, just forwarding:', message);

                // Emit the message to the receiver's room
                io.to(receiverId).emit('receiveMessage', message);

                // No need to emit back to sender as they already have it
            } else {
                // New message that needs to be saved
                const newMessage = new Message({
                    senderId,
                    receiverId,
                    text,
                });
                const savedMessage = await newMessage.save();

                // Emit the saved message to the receiver's room
                io.to(receiverId).emit('receiveMessage', savedMessage);

                // Emit the saved message back to the sender's room
                io.to(senderId).emit('receiveMessage', savedMessage);

                console.log('New message saved and sent:', savedMessage);
            }
        } catch (error) {
            console.error("Error saving or sending message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

app.post("/contracts", saveContract);
app.get("/getcontracts", getContracts);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

