import { Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, CommandInteraction } from "discord.js";
import { BotEnvironment } from "../types";
import ms from "ms";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default new Command(
	new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('View info about the current server'),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		const embed = new MessageEmbed()
			.setColor('#2ad4ff')
			.setTitle(interaction.guild?.name as string)
			.setDescription(interaction.guild?.description ? `${interaction.guild?.description}` : '')
			.addFields(
				{ name: 'Member count', value: `${interaction.guild?.memberCount as number}`, inline: true },
				{ name: 'Channel count', value: `${interaction.guild?.channels.cache.size as number}`, inline: true },
				{ name: 'Role count', value: `${interaction.guild?.roles.cache.size as number}`, inline: true },
				{ name: 'Boost count', value: `${interaction.guild?.premiumSubscriptionCount as number}`, inline: true },
				{ name: 'Created at', value: `${dayjs(interaction.guild?.createdTimestamp).format()} (${ms(Date.now() - (interaction.guild?.createdTimestamp as number))} ago)`, inline: true },
				{ name: 'ID', value: `${interaction.guild?.id as string}`, inline: true },
				{ name: 'Owner', value: `<@${interaction.guild?.ownerId as string}>`, inline: true },
			)
			.setThumbnail(interaction.guild?.iconURL() as string)
			.setImage(interaction.guild?.bannerURL() as string);
		await interaction.reply({ embeds: [embed] });
	},
);