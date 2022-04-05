import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { BotEnvironment, Command } from "../types";
import { commaLists } from "common-tags";

export default new Command(
	new SlashCommandBuilder()
		.setName('gban')
		.setDescription('Manage global (bot-wide) bans')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a user to the global ban list')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user to ban')
						.setRequired(true),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a user from the global ban list')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user to unban')
						.setRequired(true),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List all users banned globally')),
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		const blocked: Array<string> = await env.db.get('blocked') as Array<string>;

		if (interaction.options.getSubcommand() === 'add') {
			if (blocked.includes(interaction.options.getUser('user', true).id)) {
				await interaction.reply('User is already globally banned.');
				return;
			}

			await env.db.set('blocked', blocked.concat([interaction.options.getUser('user', true).id]));
			await interaction.reply('User has been globally banned.');
		}
		else if (interaction.options.getSubcommand() === 'remove') {
			if (!blocked.includes(interaction.options.getUser('user', true).id)) {
				await interaction.reply('User is not globally banned.');
				return;
			}

			await env.db.set('blocked', blocked.filter(user => user !== interaction.options.getUser('user', true).id));
			await interaction.reply('User has been globally unbanned.');
		}
		else if (interaction.options.getSubcommand() === 'list') {
			if (blocked.length === 0) {
				await interaction.reply('There are no globally banned users.');
				return;
			}

			await interaction.reply(commaLists`Users globally banned: ${blocked}`);
		}
	}
);