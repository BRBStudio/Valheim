// changelogs.js
const { SlashCommandBuilder } = require('discord.js');
const Version = require(`../../schemas/versionSchema`); // Import model Version từ thư mục schemas
const { botVersion: currentVersion } = require('../../config'); // Import thông tin botVersion từ config.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelogs')
        .setDescription('Kiểm tra phiên bản của bot'),

    async execute(interaction) {
        try {
            // Lấy thông tin phiên bản đã lưu trong MongoDB
            const versionData = await Version.findOne(); // Tìm một bản ghi trong MongoDB

            // Nếu không tìm thấy bản ghi, thông báo người dùng
            if (!versionData) {
                return interaction.reply('Không tìm thấy thông tin phiên bản trong cơ sở dữ liệu.');
            }

            const previousVersion = versionData.botVersion; // Lấy phiên bản cũ từ MongoDB

            // So sánh phiên bản cũ và mới
            if (previousVersion !== currentVersion) {
                // Nếu có sự khác biệt, gửi tin nhắn
                return interaction.reply(`**Bot đã được cập nhật!**\nPhiên bản cũ: **${currentVersion}**\nPhiên bản mới: **${previousVersion}**`);
            } else {
                // Nếu không có sự khác biệt
                return interaction.reply(`Bot hiện tại đang ở phiên bản: **${currentVersion}**, không có cập nhật mới.`);
            }
        } catch (error) {
            console.error('Error retrieving version from MongoDB:', error);
            return interaction.reply('Đã xảy ra lỗi khi lấy thông tin phiên bản từ MongoDB.');
        }
    },
};
