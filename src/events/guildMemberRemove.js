const guildSchema = require("../models/guildSchema");
const userSchema = require("../models/userSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  once: false,
  async execute(member) {
    let userProfile = await userSchema.findOne({ userId: member.id });

    if (userProfile) {
      userProfile.isActive = false;
      userProfile.save();
    }

    let guildProfile = await guildSchema.findOne({ guildId: member.guild.id });

    if (!guildProfile) return;

    if (!guildProfile.log.isActive) return;

    const joined = new Date(member.joinedAt);
    const embed = new MessageEmbed()
      .setTitle("Member Left")
      .setDescription(`User ${member.user.tag} has left.`)
      .setThumbnail(`${member.user.avatarURL({ dynamic: true })}`)
      .setColor("DEFAULT")
      .addField("Joined", `<t:${Math.floor(joined.getTime() / 1000)}:R>`, false)
      .setFooter({
        text: `User ID: ${member.id}`,
        icon_url: `${member.guild.me.user.avatarURL({ dynamic: false })}`,
      });

    const channel = member.guild.channels.cache.find(
      (channel) => channel.id === guildProfile.log.channel
    );

    if (!channel) return;

    return channel.send({ embeds: [embed] });
  },
};
