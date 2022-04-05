import { BotEnvironment, Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default new Command(
	new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot'),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		if (interaction.user.id !== interaction.client.application?.owner?.id) {
			await interaction.reply('You do not have permission to use this command.');
			return;
		}
		if (!process.env.IN_PM2) {
			await interaction.reply({ content: 'This command can only be used in a PM2 environment.', ephemeral: true });
			return;
		}

		await interaction.reply('Restarting...');

		process.exit(0);
	}
);