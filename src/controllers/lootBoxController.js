const LootBox = require("../models/LootBox");
const Reward = require("../models/Reward");
const User = require("../models/User");

exports.getAllLootBoxes = async (req, res) => {
    try {
        const lootBoxes = await LootBox.find().populate("openedBy", "username");
        return res.status(200).json(lootBoxes);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

exports.openLootBox = async (req, res) => {
    try {
        const { lootBoxId, userId } = req.body;

        const lootBox = await LootBox.findById(lootBoxId).populate(
            "rewards.reward"
        );
        if (!lootBox || lootBox.isOpened) {
            return res.status(400).json({
                message: "Loot box is already opened or does not exist",
            });
        }

        const reward = getRandomReward(lootBox.rewards);

        lootBox.isOpened = true;
        lootBox.openedBy = userId;
        await lootBox.save();

        const user = await User.findById(userId);
        user.rewards.push(reward._id);
        await user.save();

        return res.status(200).json({ message: "Loot box opened", reward });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

function getRandomReward(rewards) {
    const totalWeight = rewards.reduce((acc, curr) => acc + curr.weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (let i = 0; i < rewards.length; i++) {
        if (randomNum < rewards[i].weight) {
            return rewards[i].reward;
        }
        randomNum -= rewards[i].weight;
    }
}
