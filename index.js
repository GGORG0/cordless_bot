const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const Keyv = require('keyv');

const dotenv = require('dotenv');
dotenv.config();

console.log('Starting...');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

if (process.env.DB_PATH === undefined) {
	console.log('No DB_PATH specified in .env file. Using default path.');
	process.env.DB_PATH = 'data/db.sqlite';
}
const db = new Keyv(`sqlite://${process.env.DB_PATH}`);
db.on('error', err => console.error('Keyv connection error:', err));
client.db = db;

db.get('blocked').then(async blocked => {
	if (!blocked) {
		await db.set('blocked', []);
	}
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	console.log(`Added command: ${file}`);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	console.log(`Registered event: ${file}`);
}

client.login(process.env.DISCORD_TOKEN);
