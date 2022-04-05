import { BotEnvironment, Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { commaLists } from "common-tags";
import { CommandInteraction, Permissions } from "discord.js";

export default new Command(
	new SlashCommandBuilder()
		.setName('note')
		.setDescription('Manage server notes')
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('View server note')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The note\'s name')
						.setRequired(true),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Create a server note')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The note\'s name')
						.setRequired(true),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a server note')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('The note\'s name')
						.setRequired(true),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List all server notes')),
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		let gnotes: Array<string> = await env.notedb.get(interaction.guild?.id as string) as Array<string>;
		if (!gnotes) {
			gnotes = [];
		}

		if (interaction.options.getSubcommand() === 'create') {

			if (!interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
				await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
				return;
			}

			await interaction.reply('Please **reply to this message** with the note\'s content.');

			interaction.channel?.awaitMessages({
				filter: m => m.author.id === interaction.user.id,
				max: 1,
				time: 120e3,
				errors: ['time'],
			}).then(async input => {
				await env.notedb.set(`${interaction.guild?.id as string}.${interaction.options.getString('name', true)}`, input.first()?.content as string);
				await env.notedb.set(`${interaction.guild?.id as string}`, gnotes.concat([interaction.options.getString('name', true)]));
				await interaction.followUp('Note saved.');
			}).catch(async () => {
				await interaction.followUp('You took too long to reply. Cancelling.');
			});

		}
		else if (interaction.options.getSubcommand() === 'remove') {
			if (!interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
				await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
				return;
			}

			if (await env.notedb.get(`${interaction.guild?.id as string}.${interaction.options.getString('name', true)}`) === undefined) {
				await interaction.reply('Note does not exist.');
				return;
			}

			await env.notedb.delete(`${interaction.guild?.id as string}.${interaction.options.getString('name', true)}`);
			await env.notedb.set(`${interaction.guild?.id as string}`, gnotes.filter(n => n !== interaction.options.getString('name', true)));
			await interaction.reply('Note deleted successfully.');
		}
		else if (interaction.options.getSubcommand() === 'list') {
			if ((await env.notedb.get(`${interaction.guild?.id as string}`) as Array<string>).length === 0) {
				await interaction.reply('There are no notes.');
				return;
			}

			await interaction.reply(commaLists`Notes: ${gnotes}`);
		}
		else if (interaction.options.getSubcommand() === 'view') {
			if (await env.notedb.get(`${interaction.guild?.id as string}.${interaction.options.getString('name', true)}`) === undefined) {
				await interaction.reply('Note does not exist.');
				return;
			}
			const note = await env.notedb.get(`${interaction.guild?.id as string}.${interaction.options.getString('name', true)}`) as string;
			await interaction.reply(note);
		}
	}
);