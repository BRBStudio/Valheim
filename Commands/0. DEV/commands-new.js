const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const interactionError = require('../../Events/WebhookError/interactionError');
const { Bvoice, helpValheim, bforum } = require('../../ButtonPlace/format');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands-new') 
        .setDMPermission(false)
        .setDescription('Định dạng lệnh mới ( không phải lệnh / và ? )'),
    
    async execute(interaction, client) {
        try {
            // Tạo embed để phản hồi cho người dùng
            const embed = new EmbedBuilder()
                .setColor(`Red`) // Màu sắc của embed
                .setTitle('Định dạng lệnh mới') // Tiêu đề của embed
                .addFields(
                    { name: `<a:VpQX0uNFuk:1249329135118057544> Cách sử dụng lệnh tạo kênh voice`, value: Bvoice },
                    { name: `\u200b`, value: `\u200b` },
                    { name: `<a:VpQX0uNFuk:1249329135118057544> Cách sử dụng lệnh giúp đỡ`, value: helpValheim },
                    { name: `\u200b`, value: `\u200b` },
                    { name: `<a:VpQX0uNFuk:1249329135118057544> Cách sử dụng lệnh setup kênh chủ đề`, value: bforum }
                );

            await interaction.deferReply();
            await interaction.deleteReply();
            // Gửi phản hồi cho người dùng
            await interaction.channel.send({ embeds: [embed] });
        } catch (error) {
            // Xử lý lỗi và gọi hàm xử lý lỗi
            interactionError.execute(interaction, error, client);
        }
    }
};
