const { SlashCommandBuilder } = require("@discordjs/builders");
const { stripIndent } = require("common-tags");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Run the provided JavaScript code")
    .setDefaultPermission(false),
  async execute(interaction) {
    if (interaction.user.id !== interaction.client.application?.owner?.id) {
      await interaction.reply(
        "You do not have permission to use this command."
      );
      return;
    }

    await interaction.reply(
      "Please **reply to this message** with the code in a codeblock with `js` set as the lang."
    );
    let input;
    try {
      input = await interaction.channel.awaitMessages({
        filter: (m) => m.author.id === interaction.user.id,
        max: 1,
        time: 120e3,
        errors: ["time"],
      });
    } catch {
      await interaction.followUp("You took too long to reply. Cancelling.");
      return;
    }
    const code = input.first().content.replace(/```js/, "").replace(/```/, "");
    let evaled;
    try {
      evaled = eval(code);
    } catch (err) {
      await interaction.followUp(stripIndent`There was an error while evaluating the code.
			\`\`\`js
			${err}
			\`\`\``);
      return;
    }
    if (typeof evaled !== "string") {
      await interaction.followUp(
        `\`\`\`json\n${JSON.stringify(evaled, null, 2)}\n\`\`\``
      );
    } else {
      await interaction.followUp(`\`\`\`\n${evaled}\n\`\`\``);
    }
  },
};
