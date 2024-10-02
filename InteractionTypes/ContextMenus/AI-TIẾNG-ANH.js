const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const config = require(`../../config`)

module.exports = {
    data: {
        name: 'AI TIẾNG ANH',
        type: ApplicationCommandType.Message,
    },
    async execute(interaction, msg) {
        if (!interaction.isMessageContextMenuCommand()) return; // Sửa lỗi chính tả ở đây

        if (interaction.commandName === 'AI TIẾNG ANH') { // Sửa điều kiện lệnh đúng
            
            //sử dụng để lấy nội dung tin nhắn mà người dùng đã chọn để dịch.
            const targetMessage = interaction.targetMessage;

            // Kiểm tra xem targetMessage có tồn tại và có nội dung không
            if (!targetMessage || !targetMessage.content || !/\w/.test(targetMessage.content)) {
                return interaction.reply({ content: `🆘 Đây không phải chữ hoặc tin nhắn không có nội dung, vui lòng chọn nội dung có tin nhắn bằng chữ để sử dụng AI.`, ephemeral: true });
            }

            // Lấy nội dung tin nhắn gốc
            const content = targetMessage.content;

            // Dịch tin nhắn sang tiếng Anh
            translate(content, { to: 'en' }).then(translation => {

                embedGocTA = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nTin nhắn gốc:`)
                    .setColor(config.embedDarkOrange)
                    .setDescription(`\`\`\`yml\n${targetMessage}\`\`\``)
                    .setThumbnail(`https://i.imgur.com/dZsQfqP.gif`)
                    .setFooter({ text: `⏰` })
                    .setTimestamp()
                
                embedDichTA = new EmbedBuilder()
                    .setTitle(`Apps Bot Valheim\n\nDịch tin nhắn:`)
                    .setColor(config.embedDarkGreen)
                    .setDescription(`\`\`\`yml\n${translation.text}\`\`\``)
                    .setThumbnail(`https://i.imgur.com/dZsQfqP.gif`)
                    .setFooter({ text: `⏰` })
                    .setTimestamp()
                    
                // Hiển thị tin nhắn gốc và tin nhắn dịch
                interaction.reply({ embeds: [embedGocTA, embedDichTA], ephemeral: true });
            }).catch(err => {
                console.error('Lỗi khi dịch:', err);
                interaction.reply(`Đã xảy ra lỗi khi dịch tin nhắn.`);
            });
        }
    }
};