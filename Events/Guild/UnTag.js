const { EmbedBuilder } = require('discord.js');
const unpingSchemas = require('../../schemas/unpingSchema');

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        if (message.author.bot) return; // Bỏ qua tin nhắn từ bot

        const guildId = message.guild.id; // Lấy ID của máy chủ
        const mentionedUser = message.mentions.users.first(); // Lấy người dùng đầu tiên được tag trong tin nhắn

        if (!mentionedUser) return; // Nếu không có người dùng nào được tag, kết thúc

        try {
            // Kiểm tra trong MongoDB xem người dùng bị tag có trong danh sách tránh ping không
            const result = await unpingSchemas.findOne({ Guild: guildId, User: mentionedUser.id });

            if (result) {
                // Nếu người dùng được tìm thấy trong danh sách tránh ping, tạo tin nhắn embed
                const pingEmbed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Tránh chủ sở hữu Ping")
                    .setDescription(`\`\`\`yml\nXin chào **${message.author.displayName}**!, ​​Vui lòng tránh ping người dùng **${mentionedUser.displayName}**. Đây là thông tin tôi nhận được từ BQT.\`\`\``)
                    .setTimestamp()
                    .setImage('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYm4xMGQ3NnoyNmY3bXV2Ymk5YnBzdHN6eWk4OWY5OWpzazZ0aGIxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yIdJwdk14j39Lm3epL/giphy.gif')
                    .setFooter({ text: `🤖 Được yêu cầu bởi ${client.user.username}                                                     ⏰` });

                // Gửi tin nhắn embed
                await message.channel.send({ embeds: [pingEmbed] });
            }
        } catch (error) {
            console.error(`Lỗi khi tìm kiếm trong MongoDB: ${error.message}`);
        }
    }
};


