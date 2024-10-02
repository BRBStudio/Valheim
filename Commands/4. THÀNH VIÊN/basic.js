const { SlashCommandBuilder } = require('discord.js');
const { createBasicEmbed } = require('../../Embeds/embedsCreate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('basic')
        .setDescription('📔 | Giải đáp thắc mắc cơ bản.'),
    
    async execute(interaction) {
        try {
            // Tạo embed sử dụng hàm từ embedsCreate.js
            const embed = createBasicEmbed(interaction);
            
            // Gửi tin nhắn phản hồi với nội dung và embed
            await interaction.reply({ 
                content: "Giải đáp thắc mắc cơ bản.",
                embeds: [embed], 
                ephemeral: true // Chỉ gửi tin nhắn cho người gửi lệnh
            });
        } catch (err) {
            // In lỗi ra console và gửi thông báo lỗi tới người dùng
            console.error("Lỗi khi xử lý lệnh:", err);
            await interaction.reply({ 
                content: "Đã xảy ra lỗi khi xử lý lệnh.",
                ephemeral: true 
            });
        }
    },
};

