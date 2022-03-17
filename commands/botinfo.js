const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const os = require('node:os');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('View info about the bot'),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor('#2ad4ff')
			.setTitle('Cordless')
			.setDescription('Your multi-function Discord bot')
			.addFields(
				{ name: 'Server count', value: `${interaction.client.guilds.cache.size}`, inline: true },
				{ name: 'Command count', value: `${interaction.client.commands.size}`, inline: true },
				{ name: 'Uptime', value: `${ms(interaction.client.uptime)}`, inline: true },
				{ name: 'Author', value: `<@${interaction.client.application?.owner?.id}>`, inline: true },
				{ name: 'User ID', value: `${interaction.client.user.id}`, inline: true },
				{ name: 'Node.js version', value: `${process.version}`, inline: true },
				{ name: 'RAM Usage', value: `${os.freemem()} free out of ${os.totalmem()}`, inline: true },
				{ name: 'CPU Usage', value: `${os.cpus()}`, inline: true },
				{ name: 'Source code', value: '[Click me!](https://gh.ggorg.tk/cordless_bot)', inline: true },
				{ name: 'Support server', value: '[Click me!](https://discord.gg/dRNxjZphvu)', inline: true },
				{ name: 'Add me', value: '[Click me!](https://discord.com/api/oauth2/authorize?client_id=949390883038572605&permissions=540404806&scope=applications.commands%20bot)', inline: true },
			)
			.setThumbnail('https://gh.ggorg.tk/cordless_bot/raw/master/assets/pfp.png');
		await interaction.reply({ embeds: [embed] });
	},
};