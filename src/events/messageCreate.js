const levels = require("../modules/levelSystem");
const guildSchema = require("../models/guildSchema");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (!message.guild) return;

    let guildProfile = await guildSchema.findOne({ guildId: message.guild.id });

    if (!guildProfile) return;

    if (guildProfile.leveling.isActive === false) return;

    if (message.author.bot) return;

    let member = message.guild.members.cache.find(
      (member) => member.id === message.author.id
    );
    let response = await levels.addExperience(member, guildProfile.leveling.xp);

    if (response[0] === true) {
      if (!guildProfile.leveling.channel) {
        let msg = guildProfile.leveling.message
          .replace("{userMention}", message.author.toString())
          .replace("{userLevel}", response[1])
          .replace("{totalXP}", response[2]);
        return message.channel.send({
          content: msg,
        });
      } else {
        channel = message.guild.channels.cache.find(
          (channel) => channel.id === guildProfile.leveling.channel
        );
        let msg = guildProfile.leveling.message
          .replace("{userMention}", message.author.toString())
          .replace("{userLevel}", response[1])
          .replace("{totalXP}", response[2]);
        return channel.send({
          content: msg,
        });
      }
    }
  },
};
