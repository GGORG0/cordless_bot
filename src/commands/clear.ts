import { SlashCommandIntegerOption, SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions } from "discord.js";
import { BotEnvironment, Command } from "../types";

export default new Command(
	new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Bulk delete messages')
		.addIntegerOption((option: SlashCommandIntegerOption) =>
			option
				.setName('amount')
				.setDescription('The amount of messages to delete')
				.setRequired(true),
		),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		if (!interaction.inGuild()) return;
		if (!interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
			return;
		}
		if (interaction.options.getInteger('amount', true) > 100) {
			await interaction.reply({ content: 'You can only delete up to 100 messages at a time.', ephemeral: true });
			return;
		}
		await interaction.deferReply({ ephemeral: true });
		await interaction.channel?.bulkDelete(interaction.options.getInteger('amount', true));
		await interaction.editReply('Messages deleted.');
	}
);
