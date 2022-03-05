const { SlashCommandBuilder } = require('@discordjs/builders');
const { stripIndent } = require('common-tags');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test if the bot is working'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(stripIndent`
		Pong!
		Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms
		WebSocket latency: ${interaction.client.ws.ping}ms`);
	},
};