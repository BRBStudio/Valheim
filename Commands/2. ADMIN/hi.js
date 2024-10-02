const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { rowHi } = require("../../ButtonPlace/ActionRowBuilder");
const { createHiEmbed } = require(`../../Embeds/embedsCreate`)
const { checkAdministrator } = require(`../../permissionCheck`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hi")
        .setDMPermission(false)
        .setDescription("Đây là tin nhắn chào mừng."),
    async execute(interaction, client) {

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        // trì hoãn phản hồi
        await interaction.deferReply({ ephemeral: false });

        const embed = createHiEmbed(interaction)

        const row = rowHi(interaction);

        await interaction.channel.send({ embeds: [embed], components: [row] });

        // xóa phản hồi đã bị trì hoãn
        await interaction.deleteReply();

    },
};
