/*
lấy nút tại ActionRowBuilder.js dùng cho lệnh:
- hi
*/
const { EmbedBuilder } = require(`discord.js`)
const config = require(`../../config`)
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    id: 'button5',
    async execute(interaction, client) {
    try {
        const infoembed = new EmbedBuilder()
                            .setTitle('__✿ BẮT ĐẦU__')
                            .setColor(config.embedBlurple)
                            .setFooter({ text: `⚠️ LƯU Ý: HÃY ĐỌC CÁC QUY TẮC CỦA CHÚNG TÔI`})
                            .setDescription('\nBạn là người mới sử dụng máy chủ? Vậy thì Hướng dẫn này là dành cho bạn, bạn của tôi!\n▹ **Một số bước đầu tiên:**\n\n> » Xác minh chính bạn trong <#1173537274542174218>.\n\n> » Thay đổi cập nhật mới tại: <#1194354502480957532>.\n\n> » Hãy giới thiệu bản thân với Cộng đồng trong: <#1028540923761664042>!\n\n> » Mọi ý kiến phản hồi sẽ được lưu trữ tại: <#1148874551514632192>\n\n> » Nếu bạn có bất kỳ thắc mắc nào, hãy nhắn tin cho chúng tôi <@&1172947009410437142>\n\n> » Nếu bạn có bất cứ điều gì khiếu nại về người dùng thì sử dụng lệnh /report-user\n\n> » Nếu bạn đóng góp ý kiến cho game Valheim, bạn có thể dùng lệnh /feedback ')

                        await interaction.reply({ embeds: [infoembed], ephemeral: true });

        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    },
};
