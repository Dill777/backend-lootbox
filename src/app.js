// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const lootBoxRoutes = require("./routes/lootBoxRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/lootboxes", lootBoxRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
