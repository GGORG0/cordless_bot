import { Client, Intents } from "discord.js";
import { BotEnvironment } from "./types";
import "dotenv/config";

(async () => {
	process.chdir(__dirname);

	console.log('Starting...');
	
	if (process.env.IN_PM2) {
		console.log('Running in PM2.');
	}
	
	const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
	
	if (process.env.DB_PATH === undefined) {
		console.warn('No DB_PATH specified in .env file. Using default path.');
		process.env.DB_PATH = '/data/db.sqlite';
	}
	
	if (process.env.DISCORD_TOKEN === undefined) {
		console.error('No DISCORD_TOKEN specified in .env file. Exiting.');
		process.exit(1);
	}
	
	if (process.env.MAIN_GUILD_ID === undefined) {
		console.error('No MAIN_GUILD_ID specified in .env file. Exiting.');
		process.exit(1);
	}
	
	if (process.env.BOT_ADMIN_ROLE === undefined) {
		console.error('No MAIN_GUILD_ID specified in .env file. Exiting.');
		process.exit(1);
	}
	
	if (process.env.CLIENT_ID === undefined) {
		console.error('No CLIENT_ID specified in .env file. Exiting.');
		process.exit(1);
	}
	
	const env = new BotEnvironment(client);
	console.log('Initializing database...');
	env.init_db();
	console.log('Registering commands...');
	env.init_commands();
	console.log('Registering events...');
	env.init_events();
	
	await client.login(process.env.DISCORD_TOKEN);
}) ().then().catch(console.error);

