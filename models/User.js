const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  school: { type: String, required: true },
  grade: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  otp: { type: String },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
