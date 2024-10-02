const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('solve')
        .setDescription('Khóa chủ đề trên diễn đàn'),
    async execute(interaction) {

        // Lấy ID kênh của interaction
        const threadID = interaction.channelId;

        try {
            // Lấy kênh từ ID và khóa kênh
            const channel = await interaction.guild.channels.fetch(threadID);
            // await channel.delete();

            // Kiểm tra xem ID thread có phải là do người dùng viết hay không
            if (channel.isThread() && channel.ownerId !== interaction.user.id) {
                return interaction.reply(`\`\`\`yml\nBạn không phải là tác giả của bài viết này!\`\`\``);
            }

            await channel.setLocked(true);
            // console.log("Kênh đã được khóa thành công.");
                       
            await interaction.reply(`\`\`\`yml\nChủ đề trên diễn đàn đã được khóa thành công. Để mở lại liên hệ với ☎ Admin ☎\`\`\``);
            

        } catch (error) {
            // console.error('Đã xảy ra lỗi khi khóa chủ đề:', error);
            await interaction.reply(`\`\`\`yml\n/solve chỉ dùng được trên bài viết diễn đàn\`\`\``);
        }
    },
};