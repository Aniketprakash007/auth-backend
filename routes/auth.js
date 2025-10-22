const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, school, grade, location, email, password } = req.body;

    if (!name || !school || !grade || !location || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({ name, school, grade, location, email, password: hashedPassword, otp, verified: false });
    await user.save();

    // For testing → return OTP in response (replace with email/SMS later)
    res.json({ msg: "Signup successful! Please verify OTP.", otp });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "No registered user found. Please sign up first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    res.json({ msg: "Login successful! Enter OTP to continue.", otp });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Verify OTP
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ msg: "All fields are required", success: false });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found.", success: false });

    if (user.otp === otp) {
      user.verified = true;
      user.otp = null; // clear otp
      await user.save();

      const token = crypto.randomBytes(16).toString("hex");
      return res.json({ msg: "OTP verified successfully!", success: true, token });
    } else {
      return res.status(400).json({ msg: "Invalid OTP.", success: false });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message, success: false });
  }
});

module.exports = router;
