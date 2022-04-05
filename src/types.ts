import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { Client, Collection, CommandInteraction } from "discord.js";
import { readdirSync } from "fs";
import Keyv from "keyv";

export type Note = string | Array<string>;

export interface BotEnvironment {
	commands: Collection<string, Command>;
	db: Keyv<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
	notedb: Keyv<Note>;
	client: Client;
}
export class BotEnvironment {
	constructor(client: Client) {
		this.client = client;
	}

	init_db() {
		console.log(`[..] Connecting main database...`);
		this.db = new Keyv(`sqlite://${process.env.DB_PATH as string}`);
		this.db.on('error', (err: string) => { console.error('Keyv connection error (db):', err); process.exit(1); });
		console.log(`[OK] Connected main database`);

		console.log(`[..] Connecting note database...`);
		this.notedb = new Keyv(`sqlite://${process.env.DB_PATH as string}`, { namespace: 'notes' });
		this.notedb.on('error', (err: string) => { console.error('Keyv connection error (notedb):', err); process.exit(1); });
		console.log(`[OK] Connected note database`);
		
		this.db.get('blocked').then(async (blocked: string[] | null) => {
			if (!blocked) {
				await this.db.set('blocked', []);
			}
		}).catch((e) => console.error(e));
	}

	init_commands() {
		this.commands = new Collection();

		const commandFiles = readdirSync('./commands').filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));

		for (const file of commandFiles) {
			console.log(`[..] Registering command: ${file}...`);
			const command: Command = require(`./commands/${file}`).default; // eslint-disable-line
			this.commands.set(command.name, command);
			console.log(`[OK] Registered command: ${file}`);
		}
	}

	init_events() {
		const eventFiles = readdirSync('./events').filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));

		for (const file of eventFiles) {
			console.log(`[..] Registering event: ${file}...`);
			const event: (client: Client, env: BotEnvironment) => void = require(`./events/${file}`).default; // eslint-disable-line
			event(this.client, this);
			console.log(`[OK] Registered event: ${file}`);
		}
	}
}

type CommandFunction = (interaction: CommandInteraction, env: BotEnvironment) => Promise<void>;
type CommandBuilder = Partial<SlashCommandBuilder> | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export interface Command {
	data: CommandBuilder;
	name: string;
	execute: CommandFunction;
}
export class Command {
	constructor(data: CommandBuilder, execute: CommandFunction) {
		this.data = data;
		this.name = data.name === undefined ? '' : data.name;
		this.execute = execute;
	}

	async run(interaction: CommandInteraction, env: BotEnvironment) {
		await this.execute(interaction, env);
	}
}
