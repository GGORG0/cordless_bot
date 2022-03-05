module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const blocked = await interaction.client.db.get('blocked');
		if (blocked.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this bot.', ephemeral: true });

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};