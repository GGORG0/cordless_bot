import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { BotEnvironment, Command } from "../types";
import ms from "ms";

export default new Command(
	new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('View info about the bot'),
	async (interaction: CommandInteraction, env: BotEnvironment) => {
		if (!interaction.client.application?.owner) await interaction.client.application?.fetch();
		const embed = new MessageEmbed()
			.setColor('#2ad4ff')
			.setTitle('Cordless')
			.setDescription('Your multi-function Discord bot')
			.addFields(
				{ name: 'Server count', value: `${interaction.client.guilds.cache.size}`, inline: true },
				{ name: 'Command count', value: `${env.commands.size}`, inline: true },
				{ name: 'Uptime', value: `${ms(interaction.client.uptime as number) }`, inline: true },
				{ name: 'Author', value: `<@${interaction.client.application?.owner?.id as string}>`, inline: true },
				{ name: 'User ID', value: `${interaction.client.user?.id as string}`, inline: true },
				{ name: 'Node.js version', value: `${process.version}`, inline: true },
				{ name: 'Source code', value: '[Click me!](https://gh.ggorg.tk/cordless_bot)', inline: true },
				{ name: 'Support server', value: '[Click me!](https://discord.gg/dRNxjZphvu)', inline: true },
				{ name: 'Add me', value: '[Click me!](https://discord.com/api/oauth2/authorize?client_id=949390883038572605&permissions=540404806&scope=applications.commands%20bot)', inline: true },
			)
			.setThumbnail('https://gh.ggorg.tk/cordless_bot/raw/master/assets/pfp.png');
		await interaction.reply({ embeds: [embed] });
	}
);