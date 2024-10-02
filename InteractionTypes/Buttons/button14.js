/*
lấy nút tại ActionRowBuilder.js dùng cho lệnh:
- ping
*/
const interactionError = require('../../Events/WebhookError/interactionError');
module.exports = {
    id: 'button14',
    async execute(interaction, client) {
        
    try{
            await interaction.reply({ content: 'Button KLK được nhấn!', ephemeral: true });

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
