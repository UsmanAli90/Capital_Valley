const mongoose = require("mongoose");

const generateRandomEthAddress = () => {
    const randomHex = [...Array(40)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    return `0x${randomHex}`;
};

const contractSchema = new mongoose.Schema({

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    investmentAmount: {
        type: Number,
        required: true,
    },
    equityPercentage: {
        type: Number,
        required: true,
    },
    conditions: {
        type: String,
    },
    investor: {
        type: String,
        required: true,
        default: generateRandomEthAddress,
        validate: {
            validator: function (v) {
                return /^0x[a-fA-F0-9]{40}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid Ethereum address!`,
        },
    },
    startup: {
        type: String,
        required: true,
        default: generateRandomEthAddress,
        validate: {
            validator: function (v) {
                return /^0x[a-fA-F0-9]{40}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid Ethereum address!`,
        },
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    postName: {
        type: String
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    isDeclined: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Contract", contractSchema);