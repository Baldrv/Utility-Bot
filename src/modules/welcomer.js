const help = require("../data/welcomeHelp.json");
const { MessageEmbed } = require("discord.js");

exports.sendHelp = async function (interaction, choice) {
  let info = help.find((info) => info.name === choice);
  const embed = new MessageEmbed(info.embed);

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setImage = async function (interaction, guildProfile, data) {
  guildProfile.welcomer.image = data;

  const embed = new MessageEmbed()
    .setTitle("Welcome System Setup")
    .setDescription("Image set!")
    .setImage(data)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setMessage = async function (interaction, guildProfile, data) {
  guildProfile.welcomer.message = data;

  let message = data
    .replace("{userMention}", interaction.member.toString())
    .replace("{userTag}", interaction.user.tag)
    .replace("{memberCount}", interaction.guild.memberCount)
    .replace("{server}", interaction.guild.name);

  const embed = new MessageEmbed()
    .setTitle("Welcome System Setup")
    .setDescription("Welcome message set!")
    .setColor("DEFAULT")
    .addField("Message Preview", `${message}`, false);

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setColor = async function (interaction, guildProfile, data) {
  guildProfile.welcomer.color = data;

  const embed = new MessageEmbed()
    .setTitle("Welcome System Setup")
    .setDescription(
      "**Welcome system color set!** \n*Is this color fine with you? If not use the command again to change the color. \n\nFor a list of colors use this command again and type `help` in the data field*"
    )
    .setColor(data);

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setChannel = async function (interaction, guildProfile, data) {
  guildProfile.welcomer.channel = data.id;

  const embed = new MessageEmbed()
    .setTitle("Welcome System Setup")
    .setDescription(`Welcome messages will now be sent in ${data.toString()}`)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setStatus = async function (interaction, guildProfile, data) {
  let bool;

  if (data.toLowerCase() === "on") {
    bool = true;
  } else if (data.toLowerCase() === "off") {
    bool = false;
  }

  guildProfile.welcomer.isActive = bool;

  const embed = new MessageEmbed()
    .setTitle("Welcome System Status")
    .setDescription(
      `Welcomer system is now ${bool ? "`Enabled`" : "`Disabled`"}.`
    )
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.sendPreview = async function (interaction, guildProfile) {
  let welcomer = guildProfile.welcomer;
  let message = welcomer.message
    .replace("{userMention}", interaction.member.toString())
    .replace("{userTag}", interaction.user.tag)
    .replace("{memberCount}", interaction.guild.memberCount)
    .replace("{server}", interaction.guild.name);

  const embed = new MessageEmbed()
    .setTitle("A New Member has Joined!")
    .setDescription(`${message}`)
    .setImage(welcomer.image)
    .setColor(welcomer.color);

  return interaction.reply({
    content: `Welcome System is currently ${
      welcomer.isActive ? "`Enabled`" : "`Disabled`"
    }. To Turn this system On/Off use\n> \`/welcome [Choice: Toggle On/Off] [Data: "on" or "off"]\``,
    embeds: [embed],
  });
};
