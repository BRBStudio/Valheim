const { SlashCommandBuilder } = require('discord.js');
const { checkAdministrator } = require(`../../permissionCheck`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh-channel')
        .setDescription('Làm mới lại kênh.')
        .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Kênh muốn làm mới.")
              .setRequired(true)
          ),
    async execute(interaction) {

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const { options, channel: currentChannel } = interaction;
        const channel = options.getChannel("channel");

        // Lưu ID của kênh hiện tại
        const currentChannelId = currentChannel.id;

        // Trì hoãn phản hồi mà không gửi tin nhắn
        await interaction.deferReply({ ephemeral: true });

        // Tạo bản sao của kênh
        const newChannel = await channel.clone();

        // Đặt lại vị trí của kênh mới
        await newChannel.setPosition(channel.position);
        await newChannel.setName(channel.name); // Giữ tên kênh
        await newChannel.setTopic(channel.topic); // Giữ chủ đề kênh
        await newChannel.setNSFW(channel.nsfw); // Giữ trạng thái NSFW nếu có

        // Xóa kênh cũ
        await channel.delete();

        // Gửi tin nhắn xác nhận vào kênh mới
        await newChannel.send({ content: 'Kênh đã được làm mới thành công!' });

        if (currentChannelId === channel.id) {
            // Xóa phản hồi đã trì hoãn nếu lệnh được thực hiện trong kênh không bị làm mới
            await interaction.deleteReply().catch(() => {});
        } else {
            // Xóa phản hồi đã trì hoãn nếu lệnh được thực hiện trong kênh bị làm mới
            await interaction.deleteReply().catch(() => {});
        }
    },
};
