const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the bot\'s latency'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		const embed = new MessageEmbed()
			.setColor('#2ad4ff')
			.setTitle('Bot latency')
			.addFields(
				{ name: 'Roundtrip latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: false },
				{ name: 'WebSocket latency', value: `${interaction.client.ws.ping}ms`, inline: false },
			);

		await interaction.editReply({ content: 'Pong!', embeds: [embed] });
	},
};