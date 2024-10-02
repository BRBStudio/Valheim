// // nút tại ActionRowBuilder.js
// const { EmbedBuilder } = require(`discord.js`)
// const config = require(`../../config`)

// module.exports = {
//     id: 'button13',
//     async execute(interaction, client) {
//         const icon = interaction.user.displayAvatarURL();
//         const tag = interaction.user.tag;

//         const embed = new EmbedBuilder()
//             .setTitle('**`🏓・PONG!`**')
//             .setDescription(`**\`🍯・ĐỘ TRỄ: ${client.ws.ping} ms\`**`)
//             .setColor(config.embedYellow)
//             .setFooter({ text: `Được yêu cầu bởi ${tag}`, iconURL: icon })
//             .setTimestamp();

//         await interaction.update({ embeds: [embed] });
//     },
// };


/*
lấy nút tại ActionRowBuilder.js dùng cho lệnh:
- ping
*/
const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'button13',
    async execute(interaction, client) {
        try{
            const icon = interaction.user.displayAvatarURL();
            const tag = interaction.user.tag;

            const embed = new EmbedBuilder()
                .setTitle('**`🏓・PONG!`**')
                .setDescription(`**\`🍯・ĐỘ TRỄ: ${client.ws.ping} ms\`**`)
                .setColor(config.embedYellow)
                .setFooter({ text: `Được yêu cầu bởi ${tag}`, iconURL: icon })
                .setTimestamp();

            await interaction.update({ embeds: [embed] });
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};



