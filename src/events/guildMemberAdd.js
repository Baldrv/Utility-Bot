const { MessageEmbed } = require("discord.js");
const guildSchema = require("../models/guildSchema");
const userSchem = require("../models/userSchema");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    let userProfile = await userSchema.findOne({ userId: member.id });

    if (!userProfile) {
      let newProfile = new userSchema({
        userId: member.id,
      });
      newprofile.save();
    } else {
      userProfile.isActive = true;
      userProfile.save();
    }

    let guildProfile = await guildSchema.findOne({ guildId: member.guild.id });

    if (!guildProfile) return;

    if (guildProfile.log.isActive) {
      const created = new Date(member.user.createdAt);
      const embed = new MessageEmbed()
        .setTitle("Member Joined")
        .setDescription(`User ${member.user.tag} has joined!`)
        .setColor("DEFAULT")
        .setThumbnail(`${member.user.avatarURL({ dynamic: true })}`)
        .addFields([
          {
            name: "User Info",
            value: `${member.user.toString()} \n${member.user.tag}\n${
              member.id
            }`,
            inline: false,
          },
          {
            name: "Account Type",
            value: `${member.user.bot ? "Bot Account" : "User Account"}`,
            inline: false,
          },
          {
            name: "Created On",
            value: `${created.toLocaleString(
              member.guild.preferredLocale
            )} \n<t:${Math.floor(created.getTime() / 1000)}:R>`,
            inline: false,
          },
        ]);
      const channel = member.guild.channels.cache.find(
        (channel) => channel.id === guildProfile.log.channel
      );

      if (!channel) return;

      await channel.send({ embeds: [embed] });
    }

    if (guildProfile.welcomer.isActive === false) return;

    let message = guildProfile.welcomer.message
      .replace("{userMention}", member.toString())
      .replace("{userTag}", member.user.tag)
      .replace("{memberCount}", String(member.guild.memberCount))
      .replace("{server}", member.guild.name);
    const embed = new MessageEmbed()
      .setTitle("A New Member Has Joined!")
      .setDescription(`${message}`)
      .setImage(
        guildProfile.welcomer.image ? guildProfile.welcomer.image : "None"
      )
      .setColor(guildProfile.welcomer.color);

    const channel = member.guild.channels.cache.find(
      (channel) => channel.id === guildProfile.welcomer.channel
    );

    if (!channel) return;

    return channel.send({ embeds: [embed] });
  },
};
