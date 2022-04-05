import { BotEnvironment, Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";

export default new Command(
	new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the bot\'s latency'),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		const sent: Message = await interaction.reply({ content: 'Pinging...', fetchReply: true }) as Message;
		const embed = new MessageEmbed()
			.setColor('#2ad4ff')
			.setTitle('Bot latency')
			.addFields(
				{ name: 'Roundtrip latency', value: `${(sent.createdTimestamp - interaction.createdTimestamp) / 2}ms (full journey took ${sent.createdTimestamp - interaction.createdTimestamp}ms)`, inline: false },
				{ name: 'WebSocket latency', value: `${interaction.client.ws.ping}ms`, inline: false },
			);

		await interaction.editReply({ content: 'Pong!', embeds: [embed] });
	}
);