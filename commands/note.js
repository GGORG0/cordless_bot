const { SlashCommandBuilder } = require("@discordjs/builders");
const { commaLists } = require("common-tags");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Manage server notes")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View server note")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The note's name")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a server note")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The note's name")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a server note")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The note's name")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all server notes")
    ),
  async execute(interaction) {
    const notes = interaction.client.notedb;
    let gnotes = await notes.get(`${interaction.guild.id}`);
    if (!gnotes) {
      gnotes = [];
    }

    if (interaction.options.getSubcommand() === "create") {
      if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        interaction.reply("You do not have permission to use this command.", {
          ephemeral: true,
        });
        return;
      }

      await interaction.reply(
        "Please **reply to this message** with the note's content."
      );

      interaction.channel
        .awaitMessages({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1,
          time: 120e3,
          errors: ["time"],
        })
        .then(async (input) => {
          await notes.set(
            `${interaction.guild.id}.${interaction.options.getString("name")}`,
            input.first().content
          );
          await notes.set(
            `${interaction.guild.id}`,
            gnotes.concat([interaction.options.getString("name")])
          );
          await interaction.followUp("Note saved.");
        })
        .catch(async () => {
          await interaction.followUp("You took too long to reply. Cancelling.");
        });
    }
 else if (interaction.options.getSubcommand() === "remove") {
      if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        interaction.reply("You do not have permission to use this command.", {
          ephemeral: true,
        });
        return;
      }

      if (
        notes.get(
          `${interaction.guild.id}.${interaction.options.getString("name")}`
        ) === undefined
      ) {
        interaction.reply("Note does not exist.");
        return;
      }

      await notes.delete(
        `${interaction.guild.id}.${interaction.options.getString("name")}`
      );
      await notes.set(
        `${interaction.guild.id}`,
        gnotes.filter((n) => n !== interaction.options.getString("name"))
      );
      await interaction.reply("Note deleted successfully.");
    }
 else if (interaction.options.getSubcommand() === "list") {
      if (notes.length === 0) {
        interaction.reply("There are no notes.");
        return;
      }

      await interaction.reply(commaLists`Notes: ${gnotes}`);
    }
 else if (interaction.options.getSubcommand() === "view") {
      if (
        notes.get(
          `${interaction.guild.id}.${interaction.options.getString("name")}`
        ) === undefined
      ) {
        interaction.reply("Note does not exist.");
        return;
      }
      const note = await notes.get(
        `${interaction.guild.id}.${interaction.options.getString("name")}`
      );
      await interaction.reply(note);
    }
  },
};
