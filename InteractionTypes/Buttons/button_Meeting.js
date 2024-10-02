/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho lệnh:
    - meeting-virtual
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'button_Meeting',
    async execute(interaction, client) {
    try {

        await interaction.deferUpdate();
        
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
