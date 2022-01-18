const guildSchema = require("../models/guildSchema");

module.exports = {
  name: "guildDelete",
  once: false,
  async execute(guild) {
    let guildProfile = await guildSchema.findOne({ guildId: guild.id });

    if (!guildProfile) {
      return;
    } else {
      guildProfile.isActive = false;
      guildProfile.save();
    }
  },
};
