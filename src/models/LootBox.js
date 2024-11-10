const mongoose = require("mongoose");

const LootBoxSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rewards: [
        {
            reward: { type: mongoose.Schema.Types.ObjectId, ref: "Reward" },
            weight: { type: Number, required: true },
        },
    ],
    isOpened: { type: Boolean, default: false },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    prize: { type: mongoose.Schema.Types.ObjectId, ref: "Reward" },
});

module.exports = mongoose.model("LootBox", LootBoxSchema);
