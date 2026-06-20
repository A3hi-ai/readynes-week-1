const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/authdb");

const User = mongoose.model("User", {
    email: String,
    password: String
});

// Register
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await User.create({
        email,
        password: hash
    });

    res.json({ message: "User Registered" });
});

// Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
        return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
        return res.status(400).json({ message: "Wrong password" });

    res.json({ message: "Login Successful" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});