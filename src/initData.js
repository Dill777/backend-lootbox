const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Reward = require("./models/Reward");
const LootBox = require("./models/LootBox");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("Connected to MongoDB");

        await Reward.deleteMany({});
        await LootBox.deleteMany({});

        const rewards = await Reward.insertMany([
            { name: "Gold Coin", dropChance: 10 },
            { name: "Silver Coin", dropChance: 30 },
            { name: "Bronze Coin", dropChance: 60 },
        ]);

        const lootBoxes = [];

        for (let i = 0; i < 10; i++) {
            lootBoxes.push({
                name: `LootBox #${i + 1}`,
                rewards: rewards.map((reward) => ({
                    reward: reward._id,
                    weight: reward.dropChance,
                })),
            });
        }

        await LootBox.insertMany(lootBoxes);

        console.log("Initialization completed");
        process.exit();
    })
    .catch((err) => {
        console.error("Error:", err.message);
    });
