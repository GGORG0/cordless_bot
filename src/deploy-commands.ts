import { readdirSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes, APIApplicationCommand, APIApplicationCommandPermission } from "discord-api-types/v9";
import { Command } from "./types";
import "dotenv/config";

(async () => {

	if (process.env.DISCORD_TOKEN === undefined) {
		console.error('No DISCORD_TOKEN specified in .env file. Exiting.');
		process.exit(1);
	}
	
	if (process.env.MAIN_GUILD_ID === undefined) {
		console.error('No MAIN_GUILD_ID specified in .env file. Exiting.');
		process.exit(1);
	}
	
	if (process.env.BOT_ADMIN_ROLE === undefined) {
		console.error('No BOT_ADMIN_ROLE specified in .env file. Exiting.');
		process.exit(1);
	}
	
	if (process.env.CLIENT_ID === undefined) {
		console.error('No CLIENT_ID specified in .env file. Exiting.');
		process.exit(1);
	}
	
	console.log('Deploying commands...');
	
	const commands = [];
	const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
	
	for (const file of commandFiles) {
		const command: Command = require(`./commands/${file}`); // eslint-disable-line
		if(command.data.toJSON )
		commands.push(command.data.toJSON());
		console.log(`Added command: ${file}`);
	}
	
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
	
	const value = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.MAIN_GUILD_ID), { body: commands });
	console.log('Successfully registered application commands.');
	const cmds = value as APIApplicationCommand[];
	const perms: APIApplicationCommandPermission = {
		id: process.env.BOT_ADMIN_ROLE,
		type: 1,
		permission: true
	}
	const reqBody = cmds.map(c => ({ id: c.id, permissions: [perms] }));
	await rest.put(Routes.guildApplicationCommandsPermissions(process.env.CLIENT_ID, process.env.MAIN_GUILD_ID), { body: reqBody });
	console.log('Successfully set commands\' permissions.');
})().then().catch(console.error);
