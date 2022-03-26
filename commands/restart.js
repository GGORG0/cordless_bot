const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the bot"),
  async execute(interaction) {
    if (interaction.user.id !== interaction.client.application?.owner?.id) {
      await interaction.reply(
        "You do not have permission to use this command."
      );
      return;
    }
    if (!process.env.IN_PM2) {
      await interaction.reply(
        "This command can only be used in a PM2 environment.",
        { ephemeral: true }
      );
      return;
    }

    await interaction.reply("Restarting...");

    process.exit(0);
  },
};
