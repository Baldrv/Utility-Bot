const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, require: true },
  isActive: { type: Boolean, default: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

const model = new mongoose.model("users", userSchema);

module.exports = model;
