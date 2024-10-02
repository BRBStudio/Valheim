const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js");
const { finalEmbed } = require(`../../Embeds/embedsDEV`)
  
module.exports = {
    data: new SlashCommandBuilder()
      .setName("role-members")
      .setDescription("Xem tất cả người dùng có vai trò"),
  
    async execute(interaction) {
        const row1 = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
            .setCustomId("roles")
            .setPlaceholder("Chọn 1 - 10 vai trò...")
            .setMinValues(1)
            .setMaxValues(10)
        );

        interaction.reply({
            embeds: [finalEmbed],
            components: [row1],
            ephemeral: true,
        });
    },
};