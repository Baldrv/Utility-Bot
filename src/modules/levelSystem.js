const canvacord = require("canvacord");
const userSchema = require("../models/userSchema");
const guildSchema = require("../models/guildSchema");
const { MessageEmbed, MessageAttachment, File } = require("discord.js");
const levelHelp = require("../data/levelHelp.json");

exports.getCard = async function (interaction, member, guildProfile) {
  const userData = await userSchema.findOne({ userId: member.id });

  // Need to figure out how to set ranks per user's level + experience
  const rank = new canvacord.Rank()
    .setAvatar(member.user.avatarURL({ dynamic: false, format: "png" }))
    .setCurrentXP(userData.xp)
    .setLevel(userData.level)
    .setBackground("IMAGE", guildProfile.leveling.image)
    .setRequiredXP(userData.level * guildProfile.leveling.baseXP)
    .setProgressBar("#FFFFFF", "COLOR")
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator);

  let data = await rank.build().then((buffer) => {
    interaction.reply({
      files: [{ attachment: buffer, name: "RankCard.png" }],
    });
  });
};

exports.addExperience = async function (member, amount) {
  let userData = await userSchema.findOne({ userId: member.id });
  let levelUp;

  if (!userData) {
    let newData = new userSchema({
      userId: member.id,
      isActive: true,
      xp: amount,
      level: 1,
    });
    newData.save();
    levelUp = [false, 1];
    return levelUp;
  }
  if (userData.xp + amount === userData.level * 500) {
    userData.level = userData.level + 1;
    userData.xp = 0;
    levelUp = [true, userData.level];
  } else if (userData.xp + amount > userData.level * 500) {
    let difference = userData.xp + amount - userData.level * 500;
    userData.level = userData.level + 1;
    userData.xp = difference;
    levelUp = [true, userData.level];
  } else {
    userData.xp = userData.xp + amount;
    levelUp = [false, userData.level];
  }
  userData.save();
  if (levelUp) {
    await updateLevelRole(member, userData);
  }
  return levelUp;
};

async function updateLevelRole(member, userData) {
  let guildData = await guildSchema.findOne({
    guildId: member.guild.id,
  });

  if (!guildData.leveling.roles) return;

  let level = guildData.leveling.roles.find(
    (role) => role.level === userData.level
  );
  let previousLevel = guildData.leveling.roles.find(
    (role) => role.level === userData.level - 1
  );

  if (!level) return;

  try {
    await member.roles.add(level.role);
    if (previousLevel) {
      await member.roles.remove(previousLevel.role);
    }
  } catch (err) {
    console.error(err);
  }
  return;
}

exports.sendHelp = async function (interaction, choice) {
  let help = levelHelp.find((help) => help.name === choice);

  const embed = new MessageEmbed(help.embed);

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setBaseXP = async function (interaction, guildProfile, data) {
  guildProfile.leveling.baseXP = data;

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(`The Base XP for level 1 is set to: ${data}`)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setXPEarned = async function (interaction, guildProfile, data) {
  guildProfile.leveling.xp = data;

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(`Xp earned per message is set to ${data}`)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setChannel = async function (interaction, guildProfile, data) {
  guildProfile.leveling.channel = data;

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(`Level up announcements will now send in <#${data}>`)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setIgnored = async function (interaction, guildProfile, data) {
  guildProfile.leveling.ignored.push(data);

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(
      `Added channel <#${data}> to ignored list. Users will no longer earn XP in this channel`
    )
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.removeIgnored = async function (interaction, guildProfile, data) {
  guildProfile.leveling.ignored.pull(data);

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(
      `Removed <#${data}> from the ignored channel list. Members will now earn XP in this channel.`
    )
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setMilestone = async function (interaction, guildProfile, data) {
  let levelData = data.split("-");
  let level = {
    level: parseInt(levelData[0].replace(" ", "")),
    role: levelData[1].replace(" ", ""),
  };

  if (parseInt(levelData[0]) === NaN) {
    return interaction.reply({
      content:
        "There was an issue determining what level you want to apply the role to. Please make sure its in acceptable format. \nI.E: `1 - 246574732462357`, 1 being the level.",
      ephemeral: true,
    });
  }

  let milestone = guildProfile.leveling.levels.find(
    (level) => level.level === parseInt(levelData[0].replace(" ", ""))
  );

  if (!milestone) {
    guildProfile.leveling.levels.push(level);
  } else {
    guildProfile.leveling.levels.pull(milestone);
    guildProfile.leveling.levels.push(level);
  }

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(
      `Milestone added. Users will now gain <@&${levelData[1].replace(
        " ",
        ""
      )}> at Level ${levelData[0].replace(" ", "")}.`
    )
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.removeMilestone = async function (interaction, guildProfile, data) {
  let response;

  if (data.toLowerCase() === "all") {
    guildProfile.leveling.levels = [];
    response = "All milestones have been removed!";
  } else {
    let milestone = guildProfile.leveling.levels.find(
      (level) => level.level === parseInt(data)
    );

    if (!milestone) {
      response = `No milestone found for level ${data}`;
    } else {
      guildProfile.leveling.levels.pull(milestone);
      response = `Milestone removed for level ${data}`;
    }
  }
  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(`${response}`)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setImage = async function (interaction, guildProfile, data) {
  guildProfile.leveling.image = data;

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(
      "Image has been set for Rank Cards. Heres a preview of that image. If it doesn't show up in this embed, chances are it will not work as an image."
    )
    .setImage(data)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setMessage = async function (interaction, guildProfile, data) {
  guildProfile.leveling.message = data;

  let message = data
    .replace("{userMention}", interaction.member.toString())
    .replace("{userTag}", interaction.user.tag)
    .replace("{userLevel}", "100")
    .replace("{totalXP}", "256.7k");

  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(
      "You custom level up message has been set. You can view a preview below."
    )
    .setColor("DEFAULT")
    .addField("Preview", `${message}`, false);

  return interaction.reply({
    embeds: [embed],
  });
};

exports.setStatus = async function (interaction, guildProfile, data) {
  let response;

  if (data.toLowerCase() === "on" || data.toLowerCase() === "off") {
    let bool;
    if (data.toLowerCase() === "off") {
      bool = false;
    } else if (data.toLowerCase() === "on") {
      bool = true;
    }

    guildProfile.leveling.isActive = bool;
    response = `Level System is now \`${bool ? "Enabled" : "Disabled"}\``;
  } else {
    response =
      "Please make sure you are providing either `on` or `off` to enable or disable the leveling system.";
  }
  const embed = new MessageEmbed()
    .setTitle("Level System Setup")
    .setDescription(`${response}`)
    .setColor("DEFAULT");

  return interaction.reply({
    embeds: [embed],
  });
};
