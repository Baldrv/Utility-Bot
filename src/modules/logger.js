const { MessageEmbed } = require("discord.js");
const help = require("../data/loggerHelp.json");

exports.sendHelp = async function (interaction, choice) {
  let info = help.find((info) => info.name === choice);
  const embed = new MessageEmbed(info.embed);

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setChannel = async function (interaction, guildProfile, data) {
  guildProfile.log.channel = data.id;

  const embed = new MessageEmbed()
    .setTitle("Logging System Configuration")
    .setDescription(`Logs will now be sent to ${data.toString()}`)
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

  guildProfile.log.isActive = bool;

  const embed = new MessageEmbed()
    .setTitle("Log System Configuration")
    .setDescription(`Log System is now: ${bool ? "`Enabled`" : "`Disabled`"}.`)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};
