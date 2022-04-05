import { Client } from "discord.js";
import { BotEnvironment } from "../types";
import ms from "ms";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (client: Client, env: BotEnvironment) => {
	client.once('ready', () => {
		console.log(`Ready! Logged in as ${client.user?.tag as string}`);
		const updateStatus = () => {
			client.user?.setActivity(`Alpha version | ${client.guilds.cache.size} servers | up for ${ms(client.uptime as number)}`, { type: 'WATCHING' });
		};
		
		updateStatus();
		
		setInterval(() => {
			updateStatus();
		}, 60000);
		
		// if (!client.application?.owner) await client.application?.fetch();
		
		// const permissions = [
		// 	{
		// 		id: client.application?.owner?.id,
		// 		type: 'USER',
		// 		permission: true,
		// 	},
		// ];
		
		// const commands = await client.guilds.cache.get(process.env.MAIN_GUILD_ID)?.commands.fetch();
		// for (const command of commands?.values()) {
		// 	command.permissions.set({ permissions });
		// }
	});
}