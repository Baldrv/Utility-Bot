const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const rankCard = require("../modules/levelSystem");

module.exports = {
  category: "General",
  userPermissions: ["Send Messages"],
  botPermissions: ["Embed Links", "Send Messages"],
  description: "View your's or another members rank.",
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your's or another members rank.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user who's rank you want to view.")
    ),
  async execute(interaction, guildProfile) {
    if (!guildProfile.leveling.isActive) {
      return interaction.reply({
        content: "The level system is disabled for this server.",
        ephemeral: true,
      });
    }
    let user = interaction.options.getUser("user");
    let member;
    if (!user) {
      member = interaction.member;
    } else {
      member = interaction.guild.members.cache.find(
        (member) => member.id === user.id
      );
    }

    await rankCard.getCard(interaction, member, guildProfile);
    return;
  },
};
