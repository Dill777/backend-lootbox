const User = require("../models/User");

exports.login = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        let user = await User.findOne({ username });

        if (!user) {
            user = new User({ username });
            await user.save();
        }

        return res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};
