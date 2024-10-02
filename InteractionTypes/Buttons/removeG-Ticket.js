const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'removeG-Ticket',
    async execute(interaction, client) {
    try {

            // Kiểm tra quyền của người dùng trước khi thực hiện thao tác
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const ticketChannels = interaction.guild.channels.cache.filter(channel => /^game-/i.test(channel.name));

                if (ticketChannels.size === 0) {
                    return await interaction.reply({ content: `🚫 Không có kênh ticket nào để xóa.`, ephemeral: true });
                }

                ticketChannels.forEach(channel => {
                    channel.delete().catch(err => console.error(`Không thể xóa kênh ${channel.name}:`, err));
                });

                await interaction.reply({ content: `✅ Đã xóa tất cả các kênh ticket.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `🚫 Bạn không có quyền thực hiện thao tác này.`, ephemeral: true });
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};