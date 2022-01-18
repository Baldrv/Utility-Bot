const { version } = require("../data/config.json");
const userSchema = require("../models/userSchema");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await client.user.setActivity({
      name: `/help | ${version}`,
      type: "WATCHING",
    });
    await client.user.setStatus("dnd");
    console.log(`${client.user.tag} has logged onto Discord`);
  },
};
