import { Client, GuildMemberRoleManager, Interaction, MessageActionRow, MessageSelectMenu, MessageSelectOption, Role } from "discord.js";
import { BotEnvironment } from "../types";

export default (client: Client, env: BotEnvironment) => {
	client.on('interactionCreate', async (interaction: Interaction) => {
		const blocked: Array<string> = await env.db.get('blocked') as Array<string>;

		if (interaction.isCommand()) {
			if (blocked.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this bot.', ephemeral: true });

			const command = env.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.run(interaction, env);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		else if (interaction.isSelectMenu() && interaction.inGuild()) {
			if (interaction.customId.startsWith('roleselect')) {
				const regexp = /^\d+$/;
				await interaction.deferReply({ ephemeral: true });

				// ts is pure pain
				if (interaction.message.components === undefined) return;
				if (!(interaction.message.components[0] instanceof MessageActionRow)) return;
				if (!(interaction.message.components[0].components[0] instanceof MessageSelectMenu)) return;
				interaction.message.components[0].components[0].options.forEach((c: MessageSelectOption) => {
					if (c.value === '_clear') return;
					let role;
					if (regexp.test(c.value)) {
						role = interaction.guild?.roles.cache.find(r => r.id === c.value);
					}
					else {
						const crole = c.value.replace('_', ' ');
						role = interaction.guild?.roles.cache.find(r => r.name.toLowerCase() === crole);
					}

					(interaction.member?.roles as GuildMemberRoleManager).remove(role as Role).then().catch(console.error);
				});
				if (interaction.values[0] !== '_clear') {
					let role;
					if (regexp.test(interaction.values[0])) {
						role = interaction.guild?.roles.cache.find(r => r.id === interaction.values[0]);
					}
					else {
						const crole = interaction.values[0].replace('_', ' ');
						role = interaction.guild?.roles.cache.find(r => r.name.toLowerCase() === crole);
					}
					
					// just so that ts is happy
					if (!(interaction.member?.roles instanceof GuildMemberRoleManager)) return;
					if (role === undefined) return;
					await interaction.member?.roles.add(role)
						.then(() =>
							interaction.editReply({ content: `You have been given the role **${interaction.values[0].replace('_', ' ')}**!` }));
				}
				else {
					await interaction.editReply({ content: 'You have been removed from all selectable roles!' });
				}
			}
		}
	});
}