const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const checks = require("../modules/permissions");
const welcomer = require("../modules/welcomer");

module.exports = {
  category: "Setup",
  userPermissions: ["Adminsitrator"],
  botPermissions: ["Send Messages"],
  description:
    "Configure the welcome system for your server. Use `/welcome [Choice: your-choice] [Data: help]` for indepth instructions.",
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Configure the welcome system for your server.")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Choose which portion to configure or get help")
        .setRequired(true)
        .addChoice("Set Channel", "channel")
        .addChoice("Set Color", "color")
        .addChoice("Set Image", "image")
        .addChoice("Set Message", "message")
        .addChoice("Toggle On/Off", "toggle")
        .addChoice("Preview", "preview")
    )
    .addStringOption((option) =>
      option
        .setName("data")
        .setDescription("The data to set for the selected choice.")
        .setRequired(false)
    ),
  async execute(interaction, guildProfile) {
    let choice = interaction.options.getString("choice");
    let input = interaction.options.getString("data");

    if (input === "help") {
      if (choice === "preview") {
        return welcomer.sendPreview(interaction, guildProfile);
      }
      return welcomer.sendHelp(interaction, choice);
    } else {
      let check = await checks.user(
        interaction,
        interaction.member,
        Permissions.FLAGS.ADMINISTRATOR
      );
      if (!check === true) return;
      switch (choice) {
        case "channel":
          const channel = interaction.guild.channels.cache.find(
            (channel) => channel.id === input
          );
          if (!channel) {
            return interaction.reply({
              content:
                "Channel was not found. Please make sure you are putting in the channel's Id. For more information type help into the data field.",
              ephemeral: true,
            });
          }
          await welcomer.setChannel(interaction, guildProfile, channel);
          break;
        case "color":
          await welcomer.setColor(interaction, guildProfile, input);
          break;
        case "image":
          await welcomer.setImage(interaction, guildProfile, input);
          break;
        case "message":
          await welcomer.setMessage(interaction, guildProfile, input);
          break;
        case "toggle":
          await welcomer.setStatus(interaction, guildProfile, input);
          break;
        case "preview":
          await welcomer.sendPreview(interaction, guildProfile);
          break;
        default:
          await welcomer.sendHelp(interaction, choice);
          break;
      }
    }
  },
};
