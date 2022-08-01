import { CommandInteraction } from "discord.js";
import { BotEnvironment, Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndent } from "common-tags";

export default new Command(
	new SlashCommandBuilder()
	.setName('eval')
	.setDescription('Run the provided JavaScript code')
	.setDefaultPermission(false),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		if (interaction.user.id !== (interaction.client.application?.owner?.id || (await interaction.client.application?.fetch())?.owner?.id)) {
			await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
			return;
		}
		
		await interaction.reply('Please **reply to this message** with the code in a codeblock with `js` set as the lang.');
		let input;
		try {
			input = await interaction.channel?.awaitMessages({
				filter: m => m.author.id === interaction.user.id,
				max: 1,
				time: 120e3,
				errors: ['time'],
			});
		}
		catch {
			await interaction.followUp('You took too long to reply. Cancelling.');
			return;
		}
		const code = input?.first()?.content.replace(/```js/, '').replace(/```/, '');
		if(code === undefined) return; // oh my god typescript
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let evaled: any;
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			evaled = eval(code);
		}
		catch (err) {
			await interaction.followUp(stripIndent`There was an error while evaluating the code.
			\`\`\`js
			${err}
			\`\`\``);
			return;
		}
		await interaction.followUp(`\`\`\`json\n${JSON.stringify(evaled, null, 2)}\n\`\`\``);
	}
)