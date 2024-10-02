const { SlashCommandBuilder } = require('discord.js');
const interactionError = require(`../../Events/WebhookError/interactionError.js`);
const { createRefreshPingEmbed } = require('../../Embeds/embedsCreate.js');
const { RefreshPingButton } = require('../../ButtonPlace/ActionRowBuilder.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping-api')
        .setDescription('Thông tin ping bot có vấn đề, chỉnh sửa sau'),

    async execute(interaction) {
        try {
            const circles = {
                good: 'High 🟢',
                okay: 'Mid: 🟡',
                bad: 'Low: 🔴',
            };

            await interaction.deferReply();

            const startTimestamp = Date.now();

            const ws = interaction.client.ws.ping;

            const msgEdit = Date.now() - startTimestamp;

            let days = Math.floor(interaction.client.uptime / 86400000);
            let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
            let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
            let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

            const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
            const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

            const pingEmbed = createRefreshPingEmbed(wsEmoji, ws, msgEmoji, msgEdit, days, hours, minutes, seconds, interaction)

            await interaction.editReply({ embeds: [pingEmbed], components: [RefreshPingButton] });

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
