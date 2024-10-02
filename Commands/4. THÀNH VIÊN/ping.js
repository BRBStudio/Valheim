const { SlashCommandBuilder, EmbedBuilder } = require("discord.js"); 
const { button13, button14 } = require('../../ButtonPlace/ActionRowBuilder');
const { COOLDOWN } = require('../../config');
const { createPingEmbed } = require(`../../Embeds/embedsCreate`)

module.exports = {
    cooldown: COOLDOWN,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDMPermission(false)
        .setDescription('Ping! Xem tốc độ phản hồi của bot.'),

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const embed = createPingEmbed(client, interaction);

        await interaction.deleteReply()

        await interaction.channel.send({ embeds: [embed], components: [button13, button14] });

    },
};

