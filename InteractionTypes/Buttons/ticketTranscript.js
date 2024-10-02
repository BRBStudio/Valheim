/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho lệnh:
    - hi
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');
const sourcebin = require("sourcebin");

module.exports = {
    id: 'ticketTranscript',
    async execute(interaction, client) {
    try {

            // Tạo transcript cho vé
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            let content = "";
            messages.reverse().forEach(msg => {
                content += `${msg.author.username}: ${msg.content}\n`;
            });

            const bin = await sourcebin.create({
                title: `NHẬT KÝ TRÒ CHUYỆN CHO KÊNH ${interaction.channel.name}`,
                description: `Nhật ký trò chuyện được sử dụng trong máy chủ ➥ ${interaction.guild.name}`,
                files: [
                    {
                        name: 'Nhật ký trò chuyện', // Đặt tên file
                        content: content, // Nội dung của file
                        language: 'SQL' // Định dạng chữ nội dung, 'text' là văn bản thông thường
                    }
                ]
            });

            await interaction.reply({ content: `📜 **Đây là nhật ký trò chuyện của bạn: [Bấm vào đây để xem](${bin.url})**`, ephemeral: true });

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};




// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
// const config = require(`../../config`)
// const interactionError = require('../../Events/WebhookError/interactionError');
// const sourcebin = require("sourcebin_js");

// module.exports = {
//     id: 'ticketTranscript',
//     async execute(interaction, client) {
//     try {

//             // Tạo transcript cho vé
//             const messages = await interaction.channel.messages.fetch({ limit: 100 });
//             let content = "";
//             messages.reverse().forEach(msg => {
//                 content += `${msg.author.username}: ${msg.content}\n`;
//             });

//             const bin = await sourcebin.create([
//                 {
//                     name: 'Nhật ký trò chuyện',
//                     content: content,
//                     language: 'SQL'
//                 }
//             ], {
//                 title: `NHẬT KÝ TRÒ CHUYỆN CHO KÊNH ${interaction.channel.name}`,
//                 description: `Nhật ký trò chuyện được sử dụng trong máy chủ ➥ ${interaction.guild.name}`
//             });

//             await interaction.reply({ content: `📜 **Đây là nhật ký trò chuyện của bạn: [Bấm vào đây để xem](${bin.url})**`, ephemeral: true });

//         } catch (error) {
//             interactionError.execute(interaction, error, client);
//         }
//     },
// };
