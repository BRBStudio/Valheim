// /*
//     Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
//     lấy nút tại ActionRowBuilder.js dùng cho kêu gọi sự giúp đỡ trong bài viết chủ đề
// */
// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
// const config = require(`../../config`)
// const interactionError = require('../../Events/WebhookError/interactionError');

// module.exports = {
//     id: 'tag_user',
//     async execute(interaction, client) {
//     try {

//         // Lấy id người được chỉ định
//         const user1 = `940104526285910046`
//         const user2 = `1215380543815024700`

//         // Tìm nạp người dùng theo ID
//         const user1ID = await client.users.fetch(user1);
//         const user2ID = await client.users.fetch(user2);

//         // Tạo embed message
//         const embed = new EmbedBuilder()
//             .setTitle('TRỢ GIÚP')
//             .setDescription(`Này những người giúp đỡ! <@${interaction.user.id}> cần giúp đỡ! Hãy cố gắng hết sức để hỗ trợ họ!\n\n> <@${user1}>\n> <@${user2}>`) // Thay đổi id người dùng tùy theo nhu cầu`)
//             .setImage(`https://data.textstudio.com/output/sample/animated/2/4/3/5/help-3-5342.gif`)
//             .setColor(config.embedRandom);

//         // Gửi tin nhắn embed
//         await interaction.reply({ embeds: [embed], ephemeral: false });

//         // Tạo tin nhắn DM embed cho user1, user2
//         const dmEmbed = new EmbedBuilder()
//             .setTitle('Yêu cầu trợ giúp mới')
//             .setDescription(`Bạn nhận được yêu cầu trợ giúp từ <@${interaction.user.id}>.\nHãy cố gắng hết sức để hỗ trợ họ!`)
//             .setColor(config.embedRandom)
//             .setImage(`https://cdn.dribbble.com/users/66340/screenshots/3089041/spinner2.gif`)
//             .setTimestamp();

//         // Gửi tin nhắn riêng tư DM tới user1ID
//         try {
//                 await user1ID.send({ embeds: [dmEmbed] });
//             } catch (error) {
//                 console.error(`Không thể gửi DM cho ${user1.tag}:`, error);
//             }

//         // Gửi tin nhắn riêng tư DM tới user2ID
//         try {
//                 await user2ID.send({ embeds: [dmEmbed] });
//             } catch (error) {
//                 console.error(`Không thể gửi DM cho ${user2.tag}:`, error);
//             }

//         } catch (error) {
//             interactionError.execute(interaction, error, client);
//         }
//     },
// };



/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho kêu gọi sự giúp đỡ trong bài viết chủ đề
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');
const setupSchema = require('../../schemas/setupSchema');

module.exports = {
    id: 'tag_user',
    async execute(interaction, client) {
        try {
            // Lấy thông tin ID từ MongoDB
            const setupData = await setupSchema.findOne({ Guild: interaction.guild.id });
            if (!setupData) {
                return interaction.reply({ content: 'Cấu hình người dùng chưa được thiết lập. Chủ sở hữu máy chủ cần sử dụng lệnh `/setup id` để cấu hình.', ephemeral: true });
            }

            // Lấy các ID người dùng từ dữ liệu
            const { ID1, ID2, ID3, ID4 } = setupData;

            // Tìm nạp người dùng theo ID
            const user1ID = await client.users.fetch(ID1);
            const user2ID = await client.users.fetch(ID2);
            const user3ID = ID3 ? await client.users.fetch(ID3) : null;
            const user4ID = ID4 ? await client.users.fetch(ID4) : null;

            // Tạo embed message
            const embed = new EmbedBuilder()
                .setTitle('TRỢ GIÚP')
                .setDescription(`Này những người giúp đỡ! <@${interaction.user.id}> cần giúp đỡ! Hãy cố gắng hết sức để hỗ trợ họ!\n\n> <@${ID1}>\n> <@${ID2}>\n${ID3 ? `> <@${ID3}>\n` : ''}${ID4 ? `> <@${ID4}>\n` : ''}`)
                .setImage('https://data.textstudio.com/output/sample/animated/2/4/3/5/help-3-5342.gif')
                .setColor(config.embedRandom);

            // Gửi tin nhắn embed
            await interaction.reply({ embeds: [embed], ephemeral: false });

            // Tạo tin nhắn DM embed cho các người dùng
            const dmEmbed = new EmbedBuilder()
                .setTitle('Yêu cầu trợ giúp mới')
                .setDescription(`Bạn nhận được yêu cầu trợ giúp từ <@${interaction.user.id}>.\nHãy cố gắng hết sức để hỗ trợ họ!`)
                .setColor(config.embedRandom)
                .setImage('https://cdn.dribbble.com/users/66340/screenshots/3089041/spinner2.gif')
                .setTimestamp();

            // Gửi tin nhắn riêng tư DM tới các người dùng
            const usersToNotify = [user1ID, user2ID, user3ID, user4ID].filter(user => user); // Lọc các giá trị không hợp lệ

            for (const user of usersToNotify) {
                try {
                    await user.send({ embeds: [dmEmbed] });
                } catch (error) {
                    console.error(`Không thể gửi DM cho ${user.tag}:`, error);
                }
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};