const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
    category: "Utility",
    userPermissions: ["Use SlashCommands"],
    botPermissions: ["Send Messages", "Embed Links"],
    description: "View a list of commands",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("View a list of commands")
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription("View Specific command help")
                .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        let input = interaction.options.getString('command');

        if (!input) {
            let categories = ["Utility", "Setup", "Leveling"];
            let commands = interaction.client.commands;
            const embed = new MessageEmbed()
                .setTitle("Command List")
                .setDescription("All commands for V1 edition of the bot are listed below.")
            for (category of categories) {
                let catCommands = commands.filter(command => command.category === category);
                let commandList = catCommands.map((command) => `\`${command.data.name}\``).join(', ');
                embed.addField(category, `${commandList}`, false)
            };

            return interaction.reply({
                embeds: [embed],
            });
        } else {
            let command = interaction.client.commands.get(input);

            if (!command) {
                return interaction.reply({
                    content: `No command found with name: ${input}`,
                    ephemeral: true,
                });
            };

            const embed = new MessageEmbed()
                .setTitle(`${command.data.name} Help`)
                .setDescription(`${command.data.description}`)
                .addField("Usage", "POTATOS", false)

            return interaction.reply({
                embeds: [embed],
            });
        };
    },
};