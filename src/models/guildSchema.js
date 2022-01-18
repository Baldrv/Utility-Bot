const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildId: { type: String, unique: true, require: true },
  isActive: { type: Boolean, default: true },
  log: {
    isActive: { type: Boolean, default: false },
    channel: { type: String },
  },
  welcomer: {
    isActive: { type: Boolean, default: false },
    channel: { type: String },
    message: {
      type: String,
      default:
        "Welcome {userMention} to {server}. You are member #{memberCount}!",
    },
    color: { type: String, default: "DEFAULT" },
    image: { type: String },
  },
  leveling: {
    isActive: { type: Boolean, default: false },
    image: {
      type: String,
      default: "https://ak.picdn.net/shutterstock/videos/18933008/thumb/1.jpg",
    },
    channel: { type: String },
    message: {
      type: String,
      default: "Good Job {userMention}, You chatted your way to {userLevel}!",
    },
    baseXP: { type: Number, default: 500 },
    xp: { type: Number, default: 10 },
    levels: [
      {
        level: { type: Number },
        role: { type: String },
      },
    ],
    ignored: [],
  },
});

const model = new mongoose.model("Guild", guildSchema);

module.exports = model;
