const guildSchema = require("../models/guildSchema");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    let guildProfile;
    const profile = await guildSchema.findOne({
      guildId: interaction.guild.id,
    });

    if (!profile) {
      guildProfile = new guildSchema({
        guildId: interaction.guild.id,
      });
    } else {
      guildProfile = profile;
    }

    if (interaction.isCommand()) {
      let command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction, guildProfile);
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content: "There was an unexpected error while executing this command",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      let type = interaction.customId.split("-");

      try {
        //handle buttons based on type[0] here. Pretty much routing to the different system's button handlers.
        // params passed are: type[0], interaction, guildProfile
        // guildProfile is the entire database profile for that guild. It is set so it can be automatically
        // accessed within any command, to make it easier to update the guild profile & systems.
        // Custom Id Structure: handlerAcronym-id-option or handlerAcronym-option
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content:
            "There was an unexpected error while executing this button press.",
          ephemeral: true,
        });
      }
    }
    guildProfile.save();
    return;
  },
};
