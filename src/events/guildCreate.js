const guildSchema = require("../models/guildSchema");

module.exports = {
  name: "guildCreate",
  once: false,
  async execute(guild) {
    let guildProfile = await guildSchema.findOne({ guildId: guild.id });

    if (!guildProfile) {
      let profile = new guildSchema({
        guildId: guild.id,
        isActive: true,
      });
      profile.save();
    } else {
      guildProfile.isActive = true;
      guildProfile.save();
    }
  },
};
