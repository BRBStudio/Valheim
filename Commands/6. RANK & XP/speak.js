const { SlashCommandBuilder } = require('discord.js');
const voiceQueue = require('../../queue'); // Nhập voiceQueue từ queue.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('Chuyển đổi văn bản thành giọng nói')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Tin nhắn cần chuyển đổi văn bản thành giọng nói')
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const user = interaction.user.displayName
        const channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply('Bạn cần tham gia một kênh thoại để sử dụng lệnh này!');
            return;
        }

        await interaction.deferReply();

        // Đưa yêu cầu đọc vào hàng đợi
        voiceQueue.addToQueue({ text: `${user} đã nói ${text}`, channel: channel, type: 'speak' });

        await interaction.editReply(`${text}`);
        // await interaction.deleteReply();
    },
};
