const { ChannelType } = require('discord.js');
const interactionError = require('../WebhookError/interactionError');

module.exports = {
    name: 'messageCreate',
    execute(msg) {
        // Bỏ qua nếu tin nhắn là từ bot
        if (msg.author.bot) return;

        try {
            // Kiểm tra nếu tin nhắn được gửi trong kênh văn bản của máy chủ
            if (msg.channel.type === ChannelType.GuildText) {
                // Biểu thức chính quy để kiểm tra tên kênh và danh mục (category)
                const voiceRegex = /^Bvoice\s+(.+?)\s*-\s*(.+)$/i;
                const match = msg.content.match(voiceRegex);

                // Nếu tin nhắn phù hợp với định dạng
                if (match) {
                    const voiceChannelName = match[1].trim(); // Lấy tên kênh từ tin nhắn
                    const categoryName = match[2].trim(); // Lấy tên danh mục từ tin nhắn

                    // Tìm danh mục (category) dựa trên tên
                    const category = msg.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === categoryName.toLowerCase());

                    if (!category) {
                        return msg.reply(`Không tìm thấy danh mục với tên: ${categoryName}`);
                    }

                    // Tạo kênh voice trong danh mục được chỉ định
                    msg.guild.channels.create({
                        name: voiceChannelName,
                        type: ChannelType.GuildVoice,
                        parent: category.id // Đặt kênh trong danh mục tìm thấy
                    })
                    .then(channel => {
                        msg.reply(`Đã tạo kênh thoại: ${channel.name} trong danh mục ${category.name}`);
                    })
                    .catch(error => {
                        // Gửi lỗi nếu không tạo được kênh
                        interactionError.execute(msg, error, msg.client);
                    });
                }
            }
        } catch (error) {
            interactionError.execute(msg, error, msg.client);
        }
    }
};
