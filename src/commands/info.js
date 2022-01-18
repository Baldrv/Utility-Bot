const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, version } = require("discord.js");
const config = require("../data/config.json");
const helper = require("../modules/helper");
const os = require("os");

module.exports = {
  category: "Utility",
  userPermissions: ["Use Application Commands"],
  botPermissions: ["Send Messages", "Embed Links"],
  description: "View information about the bot.",
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("View information about the bot"),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle("Bot Info")
      .setColor("DEFAULT")
      .addFields([
        {
          name: "Bot Developers",
          value: "`Moros#0741`",
          inline: true,
        },
        {
          name: "Bot Version",
          value: `${config.versionInfo} \n${config.version}`,
          inline: true,
        },
        {
          name: "Total Users",
          value: `${interaction.client.users.cache.size}`,
          inline: true,
        },
        {
          name: "Total Guilds",
          value: `${interaction.client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: "Uptime",
          value: `${helper.formatTime(interaction.client.uptime)}`,
          inline: true,
        },
        {
          name: "Ping",
          value: `${interaction.client.ws.ping}ms`,
          inline: true,
        },
        { name: "Operating System", value: `${os.platform}`, inline: true },
        {
          name: "Discord.js Version",
          value: `v${version}`,
          inline: true,
        },
        { name: "Shards", value: "1/1", inline: true },
      ]);
    return interaction.reply({
      embeds: [embed],
    });
  },
};
