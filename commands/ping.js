const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test if the bot is working'),
	async execute(interaction) {
		await interaction.reply(`Pong! Latency is ${interaction.client.ws.ping}ms.`);
	},
};