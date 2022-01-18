const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const checks = require("../modules/permissions");
const levelSystem = require("../modules/levelSystem");

module.exports = {
  category: "Setup",
  description: "Set up the leveling system for this server",
  userPermissions: ["Administrator"],
  botPermissions: ["Send Messages", "Embed Links"],
  data: new SlashCommandBuilder()
    .setName("levels")
    .setDescription("Set up the leveling system for this server")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("The portion to set up")
        .setRequired(true)
        .addChoice("Set Channel", "setChannel")
        .addChoice("Set Ignored", "setIgnored")
        .addChoice("Remove Ignored", "removeIgnored")
        .addChoice("Set Milestone", "setMilestone")
        .addChoice("Remove Milestone", "removeMilestone")
        .addChoice("Set Base XP", "setBaseXp")
        .addChoice("Set XP Earned", "setXpEarned")
        .addChoice("Set Message", "setMessage")
        .addChoice("Set Image", "setImage")
        .addChoice("Toggle On/Off", "toggle")
    )
    .addStringOption((option) =>
      option
        .setName("data")
        .setDescription("Data to store for selected choice")
        .setRequired(true)
    ),
  async execute(interaction, guildProfile) {
    let data = interaction.options.getString("data");
    let choice = interaction.options.getString("choice");

    async function checkChannel(data) {
      let channel = interaction.guild.channels.cache.find(
        (channel) => channel.id === data
      );

      if (!channel) {
        await interaction.reply({
          content:
            "Channel not found. Please make sure you are sending the Channel ID. For help re-run the command and type `help` in the data field",
          ephemeral: true,
        });
        return false;
      } else {
        return true;
      }
    }

    if (data.toLowerCase() === "help") {
      await levelSystem.sendHelp(interaction, choice);
    } else {
      let check = await checks.user(
        interaction,
        interaction.member,
        Permissions.FLAGS.ADMINISTRATOR
      );

      if (check === false) return;
      switch (choice) {
        case "setChannel":
          let isChannel = await checkChannel(data);
          if (!isChannel) return;
          await levelSystem.setChannel(interaction, guildProfile, data);
          break;
        case "setIgnored":
          let isAChannel = await checkChannel(data);
          if (!isAChannel) return;
          await levelSystem.setIgnored(interaction, guildProfile, data);
          break;
        case "removeIgnored":
          let isItChannel = await checkChannel(data);
          if (!isItChannel) return;
          await levelSystem.removeIgnored(interaction.guildProfile, data);
          break;
        case "setMilestone":
          await levelSystem.setMilestone(interaction, guildProfile, data);
          break;
        case "removeMilestone":
          await levelSystem.removeMilestone(interaction, guildProfile, data);
          break;
        case "setBaseXp":
          await levelSystem.setBaseXP(interaction, guildProfile, data);
          break;
        case "setXpEarned":
          await levelSystem.setXPEarned(interaction, guildProfile, data);
          break;
        case "setMessage":
          await levelSystem.setMessage(interaction, guildProfile, data);
          break;
        case "setImage":
          await levelSystem.setImage(interaction, guildProfile, data);
          break;
        case "toggle":
          await levelSystem.setStatus(interaction, guildProfile, data);
          break;
        default:
          await levelSystem.sendHelp(interaction, choice);
          break;
      }
    }
    return;
  },
};
