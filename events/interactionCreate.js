module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const blocked = await interaction.client.db.get("blocked");
    if (blocked.includes(interaction.user.id))
      return interaction.reply({
        content: "You are not allowed to use this bot.",
        ephemeral: true,
      });

    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    } else if (interaction.isSelectMenu()) {
      if (interaction.customId.startsWith("roleselect")) {
        const regexp = /^\d+$/;
        await interaction.deferReply({ ephemeral: true });
        interaction.message.components[0].components[0].options.forEach((c) => {
          if (c.value === "_clear") return;
          let role;
          if (regexp.test(c.value)) {
            role = interaction.guild.roles.cache.find((r) => r.id === c.value);
          } else {
            const crole = c.value.replace("_", " ");
            role = interaction.guild.roles.cache.find(
              (r) => r.name.toLowerCase() === crole
            );
          }
          interaction.member.roles.remove(role);
        });
        if (interaction.values[0] !== "_clear") {
          let role;
          if (regexp.test(interaction.values[0])) {
            role = interaction.guild.roles.cache.find(
              (r) => r.id === interaction.values[0]
            );
          } else {
            const crole = interaction.values[0].replace("_", " ");
            role = interaction.guild.roles.cache.find(
              (r) => r.name.toLowerCase() === crole
            );
          }
          await interaction.member.roles
            .add(role)
            .then(() =>
              interaction.editReply({
                content: `You have been given the role **${interaction.values[0].replace(
                  "_",
                  " "
                )}**!`,
                ephemeral: true,
              })
            );
        } else {
          await interaction.editReply({
            content: "You have been removed from all selectable roles!",
            ephemeral: true,
          });
        }
      }
    }
  },
};
