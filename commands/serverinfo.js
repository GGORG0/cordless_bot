const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('View info about the current server'),
	async execute(interaction) {
		const guild = interaction.guild;
		const embed = new MessageEmbed()
			.setColor('#2ad4ff')
			.setTitle(guild.name)
			.setDescription(guild.description ? `${guild.description}` : '')
			.addFields(
				{ name: 'Member count', value: `${guild.memberCount}`, inline: true },
				{ name: 'Channel count', value: `${guild.channels.cache.size}`, inline: true },
				{ name: 'Role count', value: `${guild.roles.cache.size}`, inline: true },
				{ name: 'Boost count', value: `${guild.premiumSubscriptionCount}`, inline: true },
				{ name: 'Created at', value: `${dayjs(guild.createdTimestamp)} (${ms(Date.now() - guild.createdTimestamp)} ago)`, inline: true },
				{ name: 'ID', value: `${guild.id}`, inline: true },
				{ name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
			)
			.setThumbnail(guild.iconURL())
			.setImage(guild.bannerURL());
		await interaction.reply({ embeds: [embed] });
	},
};