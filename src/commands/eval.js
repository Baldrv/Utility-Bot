const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  category: "Utility",
  userPermissions: ["Use SlashCommands"],
  botPermissions: ["Embed Links", "Send Messages"],
  description: "Run a snippet of code",
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription(
      "Run some code in the channel. Warning: Not for inexperienced use."
    )
    .addStringOption((option) =>
      option.setName("code").setDescription("The code you want to evaluate.")
    ),
  async execute(interaction) {
    function clean(text) {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
    try {
      const code = interaction.options.getString("code");
      let evaled = await eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      interaction.reply(clean(evaled), { code: "xl" });
    } catch (err) {
      interaction.reply(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  },
};
