// const Message = require("../models/Message");


// exports.sendMessage = async (req, res) => {
//     try {
//         const { senderId, receiverId, message } = req.body;

//         const newMessage = new Message({ senderId, receiverId, message });
//         await newMessage.save();

//         res.status(201).json(newMessage);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to send message" });
//     }
// };


// exports.getMessages = async (req, res) => {
//     try {
//         const { senderId, receiverId } = req.params;

//         const messages = await Message.find({
//             $or: [
//                 { senderId, receiverId },
//                 { senderId: receiverId, receiverId: senderId },
//             ],
//         }).sort("createdAt"); 

//         res.status(200).json(messages);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch messages" });
//     }
// };
// import User from '../models/user.model.js';
const Startup = require('../models/Startupdb.js');
const Investor = require('../models/Investordb.js');
const Message = require('../models/Message.js');
const { getReceiverSocketId, io } = require('../utils/socket.cjs'); // Ensure the path is correct

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedinUser = req.user._id;
        const startupUsers = await Startup.find({ _id: { $ne: loggedinUser } }).select("-password");
        const investorUsers = await Investor.find({ _id: { $ne: loggedinUser } }).select("-password");
        const allUsers = [...startupUsers, ...investorUsers];

        res.status(200).json(allUsers);
    } catch (error) {
        console.log("error in getUsersForSidebar", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// const getMessages = async (req, res) => {
//     try {
//         const { id: userToChatId } = req.params;
//         const myId = req.user._id;
//         const messages = await Message.find({
//             $or: [
//                 { senderId: myId, receiverId: userToChatId },
//                 { senderId: userToChatId, receiverId: myId }
//             ]
//         });
//         console.log("Messages in Backend are:",messages);
//         res.status(200).json({ messages });
//     } catch (error) {
//         console.log("error in getMessages", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        console.log("myId:", myId); // Debugging
        console.log("userToChatId:", userToChatId); // Debugging

        if (!myId) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json({ messages });
    } catch (error) {
        console.log("error in getMessages", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const sendMessage = async (req, res) => {
    const { id: receiverId } = req.params;
    const { text, senderId } = req.body;

    try {
        // Save the message to the database
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
        });
        await newMessage.save();

        // Emit the message to the receiver using Socket.IO
        io.to(receiverId).emit('receiveMessage', newMessage);

        // Respond with the saved message
        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Export functions using CommonJS
module.exports = {
    getUsersForSidebar,
    getMessages,
    sendMessage,
};