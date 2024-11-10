const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("rewards");
        return res.status(200).json(users);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};
