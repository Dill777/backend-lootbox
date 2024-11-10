const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dropChance: { type: Number, required: true }, // В процентах, например, 10
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reward", rewardSchema);
