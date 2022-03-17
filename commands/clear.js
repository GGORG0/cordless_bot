const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Bulk delete messages')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of messages to delete')
				.setRequired(true),
		),
	async execute(interaction) {
		if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			interaction.reply('You do not have permission to use this command.', { ephemeral: true });
			return;
		}
		if (interaction.options.getInteger('amount') > 100) {
			interaction.reply('You can only delete up to 100 messages at a time.', { ephemeral: true });
			return;
		}
		await interaction.deferReply({ ephemeral: true });
		await interaction.channel.bulkDelete(interaction.options.getInteger('amount'));
		await interaction.editReply('Messages deleted.');
	},
};