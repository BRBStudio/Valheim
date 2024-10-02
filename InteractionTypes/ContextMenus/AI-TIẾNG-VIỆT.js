const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const config = require(`../../config`)

module.exports = {
    data: {
        name: 'AI TIẾNG VIỆT',
        type: ApplicationCommandType.Message,
    },
    async execute(interaction, msg) {
        if (!interaction.isMessageContextMenuCommand()) return; // Sửa lỗi chính tả ở đây

        if (interaction.commandName === 'AI TIẾNG VIỆT') { // Sửa điều kiện lệnh đúng
            const targetMessage = interaction.targetMessage;

            // Kiểm tra xem targetMessage có tồn tại và có nội dung không
            if (!targetMessage || !targetMessage.content || !/\w/.test(targetMessage.content)) {
                return interaction.reply({ content: `🆘 Đây không phải chữ hoặc tin nhắn không có nội dung, vui lòng chọn nội dung có tin nhắn bằng chữ để sử dụng AI.`, ephemeral: true });
            }

            // Trì hoãn phản hồi để tránh lỗi timeout
            await interaction.deferReply({ ephemeral: true });

            // Lấy nội dung tin nhắn gốc
            const content = targetMessage.content;

            try {
                // Xác định ngôn ngữ của tin nhắn
                const detectedTranslation = await translate(content, { to: 'en' });
                const detectedLang = detectedTranslation.from.language.iso;

                // Nếu tin nhắn đã là tiếng Việt thì không dịch
                if (detectedLang === 'vi') {
                    return interaction.editReply({ content: `Tin nhắn đã là tiếng Việt. Không cần dịch.` });
                }

                // Nếu không phải tiếng Việt, dịch tin nhắn sang tiếng Việt
                const translated = await translate(content, { to: 'vi' });
                const embedGocTV = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nTin nhắn gốc:`)
                    .setColor(config.embedDarkOrange)
                    .setDescription(`\`\`\`yml\n${targetMessage.content}\`\`\``)
                    .setFooter({ text: `⏰` })
                    .setThumbnail('https://i.imgur.com/dZsQfqP.gif')
                    .setTimestamp();

                const embedDichTV = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nDịch tin nhắn:`)
                    .setColor(config.embedDarkGreen)
                    .setDescription(`\`\`\`yml\n${translated.text}\`\`\``)
                    .setFooter({ text: `⏰` })
                    .setThumbnail('https://i.imgur.com/dZsQfqP.gif')
                    .setTimestamp();

                // Hiển thị tin nhắn gốc và tin nhắn dịch
                interaction.editReply({ embeds: [embedGocTV, embedDichTV] });
            } catch (err) {
                console.error('Lỗi:', err);
                interaction.editReply({ content: `Đã xảy ra lỗi khi dịch tin nhắn.` });
            }
        }
    }
};
