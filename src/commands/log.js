const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const checks = require("../modules/permissions");
const logs = require("../modules/logger");

module.exports = {
  category: "Setup",
  userPermissions: ["Administrator"],
  botPermissions: ["Send Messages"],
  description: "Configure the logging system for your server.",
  data: new SlashCommandBuilder()
    .setName("logging")
    .setDescription("Configure the logging system for your server")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("The portion of the logging system to set up.")
        .setRequired(true)
        .addChoice("Set Channel", "channel")
        .addChoice("Toggle On/Off", "toggle")
    )
    .addStringOption((option) =>
      option
        .setName("data")
        .setDescription("The data to store for this choice selection")
        .setRequired(true)
    ),
  async execute(interaction, guildProfile) {
    let input = interaction.options.getString("data");
    let choice = interaction.options.getString("choice");

    if (input.toLowerCase() === "help") {
      await logs.sendHelp(interaction, choice);
    } else {
      let check = await checks.user(
        interaction,
        interaction.member,
        Permissions.FLAGS.ADMINISTRATOR
      );
      if (check === "false") return;
      switch (choice) {
        case "channel":
          let channel = interaction.guild.channels.cache.find(
            (channel) => channel.id === input
          );
          if (!channel) {
            return interaction.reply({
              content:
                "Could not find channel. Please make sure you are inputting the channel ID. Need help? Rerun the command and type `help` into the data field.",
              ephemeral: true,
            });
          }
          await logs.setChannel(interaction, guildProfile, channel);
          break;
        case "toggle":
          await logs.setStatus(interaction, guildProfile, input);
          break;
        default:
          await logs.sendHelp(interaction, choice);
          break;
      }
    }
  },
};
