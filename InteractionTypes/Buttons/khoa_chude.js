/*
    Chức năng: Định nghĩa một nút bấm và hành động khi nút này được nhấn.
    lấy nút tại ActionRowBuilder.js dùng cho khóa chủ đề
*/
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'khoa_chude',
    async execute(interaction, client) {
    try {

                // Lấy ID kênh của interaction
                const threadID = interaction.channelId;
            try {
                // Lấy kênh từ ID và khóa kênh
                const channel = await interaction.guild.channels.fetch(threadID);
                // await channel.delete();

                // Kiểm tra xem ID thread có phải là do người dùng viết hay không
                if (channel.isThread() && channel.ownerId !== interaction.user.id) {
                    return interaction.reply(`\`\`\`yml\nChỉ tác giả mới có thể khóa bài viết của họ.\`\`\``);
                }

                await channel.setLocked(true);
                // console.log("Kênh đã được khóa thành công.");
                        
                await interaction.reply(`\`\`\`yml\nChủ đề trên diễn đàn đã được khóa thành công. Để mở lại liên hệ với ☎ Valheim Suvival ☎\`\`\``);
                

            } catch (error) {
                // console.error('Đã xảy ra lỗi khi khóa chủ đề:', error);
                await interaction.reply(`\`\`\`yml\n/solve chỉ dùng được trên bài viết diễn đàn\`\`\``);
            }

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
