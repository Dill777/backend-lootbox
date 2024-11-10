const User = require("./models/User");
const LootBox = require("./models/LootBox");
const Reward = require("./models/Reward");

let timer = null;
let timeLeft = 120; // 2 mins

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("join", async (userId) => {
            socket.userId = userId;
            await User.findByIdAndUpdate(userId, { onlineStatus: true });
            io.emit("updateUsers", await getAllUsers());
        });

        socket.on("disconnect", async () => {
            console.log("Client disconnected:", socket.id);
            if (socket.userId) {
                await User.findByIdAndUpdate(socket.userId, {
                    onlineStatus: false,
                });
                io.emit("updateUsers", await getAllUsers());
            }
        });

        socket.on("openLootBox", async ({ lootBoxId, userId }) => {
            const lootBox = await LootBox.findOneAndUpdate(
                { _id: lootBoxId, isOpened: false },
                { $set: { isOpened: true, openedBy: userId } },
                { new: true }
            ).populate("rewards.reward openedBy");

            if (!lootBox) {
                socket.emit("error", {
                    message: "Loot box is already opened or does not exist",
                });
                return;
            }

            const reward = getRandomReward(lootBox.rewards);

            const user = await User.findById(userId);
            user.rewards.push(reward._id);
            await user.save();

            console.log(userId, lootBoxId, "Received reward:", reward.name);

            lootBox.prize = reward._id;
            await lootBox.save();

            const allLootBoxes = await getAllLootBoxes();
            const allUsers = await getAllUsers();

            console.log("Emitting updateLootBoxes and updateUsers");
            io.emit("updateLootBoxes", allLootBoxes);
            io.emit("updateUsers", allUsers);

            socket.emit("rewardReceived", reward);

            const unopenedBoxes = await LootBox.countDocuments({
                isOpened: false,
            });
            if (unopenedBoxes === 0) {
                startTimer(io);
            }
        });
    });
};

// Дополнительные функции
async function getAllUsers() {
    return await User.find().populate("rewards");
}

async function getAllLootBoxes() {
    return await LootBox.find({})
        .populate("openedBy", "username")
        .populate("prize");
}

function getRandomReward(rewards) {
    const totalWeight = rewards.reduce((acc, curr) => acc + curr.weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (let i = 0; i < rewards.length; i++) {
        if (randomNum < rewards[i].weight) {
            return rewards[i].reward;
        }
        randomNum -= rewards[i].weight;
    }
    // Return the last reward if the random number is not in the range
    return rewards[rewards.length - 1].reward;
}

function startTimer(io) {
    if (timer) {
        return;
    }
    timeLeft = 120; // 2 mins
    io.emit("timer", timeLeft);

    timer = setInterval(async () => {
        timeLeft--;
        io.emit("timer", timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;

            await resetLootBoxes();
            io.emit("updateLootBoxes", await getAllLootBoxes());
        }
    }, 1000);
}

async function resetLootBoxes() {
    await LootBox.updateMany({}, { $set: { isOpened: false, openedBy: null } });
}
