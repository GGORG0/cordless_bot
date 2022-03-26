const ms = require("ms");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const updateStatus = async () => {
      client.user.setActivity(
        `Alpha version | ${client.guilds.cache.size} servers | up for ${ms(
          client.uptime
        )}`,
        { type: "WATCHING" }
      );
    };

    updateStatus();

    setInterval(() => {
      updateStatus();
    }, 60000);

    if (!client.application?.owner) await client.application?.fetch();

    const permissions = [
      {
        id: client.application?.owner?.id,
        type: "USER",
        permission: true,
      },
    ];

    const commands = await client.guilds.cache
      .get(process.env.MAIN_GUILD_ID)
      ?.commands.fetch();
    for (const command of commands.values()) {
      command.permissions.set({ permissions });
    }
  },
};
