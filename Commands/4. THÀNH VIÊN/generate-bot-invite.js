const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require(`../../config`)

// Tạo bộ đệm để lưu trữ các tương tác đã xử lý
const handledInteractions = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate-bot-invite')
        .setDescription('Tạo lời mời bot bằng ID bot!')
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName('bot_id')
                .setDescription('ID của bot để nhận được lời mời!')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            // Kiểm tra xem tương tác đã được xử lý chưa
            if (handledInteractions.has(interaction.id)) {
                return;
            }

            const ID = interaction.options.getString('bot_id');

            const embed = new EmbedBuilder()
                .setColor(config.embedBlurple)
                .setDescription(`> Đã tạo thành công lời mời cho <@${ID}>! [Bấm vào đây](https://discord.com/oauth2/authorize?client_id=${ID}&permissions=8&integration_type=0&scope=bot)`)
                .setImage(`https://cdn.dribbble.com/users/6985884/screenshots/15849023/media/6dfb9f3caf75d8b6acc1f9bde6b885fa.gif`);

            /*
            có thể dùng cái này (https://discord.com/oauth2/authorize?client_id=${ID}&permissions=8&integration_type=0&scope=bot)
            */

            await interaction.reply({ embeds: [embed] });

            // Thêm ID tương tác vào bộ đệm
            handledInteractions.add(interaction.id);
        } catch (error) {
            if (error.code === 'InteractionAlreadyReplied') {
                console.error('Tương tác đã được trả lời hoặc bị trì hoãn:', interaction.id);
            } else {
                console.error('Lỗi xử lý tương tác:', error);
            }
        }
    }
}
