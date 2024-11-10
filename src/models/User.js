const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
    onlineStatus: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
