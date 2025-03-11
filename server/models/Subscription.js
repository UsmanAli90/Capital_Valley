const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, required: true },
    isSubscribed: { type: Boolean, default: false },  // ✅ Add this field
});

module.exports = mongoose.model("UserSub", UserSchema);


