const { MessageEmbed } = require("discord.js");

exports.user = async function (interaction, member, permissions) {
  let command = interaction.client.commands.get(interaction.commandName);

  if (!command) return true;

  if (!member.permissions.has(permissions)) {
    const embed = new MessageEmbed()
      .setTitle("Missing Permissions")
      .setDescription(
        `This command requires ${command.userPermissions.join(
          ", "
        )} permissions. Which you don't have.`
      )
      .setColor("RED");

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return false;
  }
  return true;
};

exports.bot = async function (interaction, permissions) {};
