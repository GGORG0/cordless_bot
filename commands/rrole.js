const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rrole")
    .setDescription(
      "Create a reaction-role style message in the current channel (max 10 roles)"
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the message")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role1").setDescription("Role #1").setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role2").setDescription("Role #2").setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role3").setDescription("Role #3").setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName("role4").setDescription("Role #4").setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName("role5").setDescription("Role #5").setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName("role6").setDescription("Role #6").setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName("role7").setDescription("Role #7").setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName("role8").setDescription("Role #8").setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName("role9").setDescription("Role #9").setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName("role10").setDescription("Role #10").setRequired(false)
    ),
  async execute(interaction) {
    const roles = [];
    roles.push({
      label: "No color",
      value: "_clear",
      description: "Clear your color",
    });
    for (let i = 1; i <= 10; i++) {
      const role = interaction.options.getRole(`role${i}`);
      if (role) {
        roles.push({ label: role.name, value: role.id });
      }
    }
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("roleselect_color_mainguild")
        .setPlaceholder("Click me to select a color")
        .addOptions(roles)
    );

    const embed = new MessageEmbed()
      .setColor("#2ad4ff")
      .setTitle(interaction.options.getString("title"));

    if (interaction.options.getString("description")) {
      embed.setDescription(interaction.options.getString("description"));
    }

    await interaction.reply({ content: "Done!", ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [row] });
  },
};
