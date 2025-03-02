const express = require("express");
const router = express.Router();
const User = require("../models/UserSub");
const Chat = require("../models/Chat");

router.post("/startChat", async (req, res) => {
    const { senderId, receiverId } = req.body;

    // ✅ Check if both users are subscribed
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender.isSubscribed || !receiver.isSubscribed) {
        return res.status(403).json({ message: "Both users must have an active subscription to chat." });
    }

    const newChat = new Chat({ users: [senderId, receiverId] });
    await newChat.save();
    res.status(201).json({ message: "Chat started successfully" });
});

module.exports = router;
