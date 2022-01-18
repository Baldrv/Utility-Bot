const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const checks = require("../modules/permissions");
const roler = require("../modules/selfRoles");
const helper = require("../modules/helper");

module.exports = {
  category: "Setup",
  userPermissions: ["Administrator"],
  botPermissions: ["Send Messages"],
  description: "Build a Self Roles System for your server",
  data: new SlashCommandBuilder()
    .setName("self-roles")
    .setDescription("Build a self roles system for your server.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send this self role message in.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("roles")
        .setDescription(
          "The roles you want included in the message. Must be seperated by a comma."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    let input = interaction.options.getString("roles");
    let channel = interaction.options.getChannel("channel");

    if (input.toLowerCase() === "help") {
      return roler.sendHelp(interaction);
    } else {
      let rolesArray = input.split(" ");

      if (rolesArray.length > 20) {
        return interaction.reply({
          content: "You can only have up to 20 roles per message.",
        });
      }
      console.log(rolesArray);
      let buttons = [];
      for (rolesA of rolesArray) {
        let roleString = rolesA.replace("<@&", "").replace(">", "");
        console.log(roleString);
        let roleObj = interaction.guild.roles.cache.find(
          (roleObj) => roleObj.id === roleString
        );
        const button = new MessageButton()
          .setLabel(`${roleObj.name}`)
          .setStyle("SECONDARY")
          .setCustomId(`SR-${roleObj.id}`);
        buttons.push(button);
      }

      const buttonChunks = helper.chunkArray(buttons, 5);
      console.log(`Chunks: \n${buttonChunks}`);
      const components = buttonChunks.map((row) =>
        new MessageActionRow().addComponents(row)
      );
      console.log(buttonChunks);
      console.log(components);

      const embed = new MessageEmbed()
        .setTitle("Self Roles")
        .setDescription("Press a button below to add / remove that role")
        .setColor(interaction.guild.me.displayHexColor);

      await channel.send({
        embeds: [embed],
        components: components,
      });
    }
  },
};
