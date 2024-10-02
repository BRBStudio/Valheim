const { SlashCommandBuilder,EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require(`../../schemas/messagelevelSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-reset`)
    .setDMPermission(false)
    .setDescription(`Đặt lại tất cả cấp độ XP của máy chủ`),

    async execute (interaction) {

        const guildName = interaction.guild.name;

        const perm = new EmbedBuilder()
        .setColor(`Blue`)
        .setDescription(`\`\`\`yml\n🏅 Bạn không có quyền đặt lại cấp độ xp trong máy chủ ${guildName}.\`\`\``)

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true });

        const { guildId } = interaction;

        try {
            // Xóa tất cả dữ liệu cấp độ XP
            const result = await levelSchema.deleteMany({ Guild: guildId });

            // Kiểm tra xem có tài liệu nào bị xóa không
            if (result.deletedCount === 0) {
                const noDataEmbed = new EmbedBuilder()
                    .setColor(`Blue`)
                    .setDescription(`\`\`\`yml\n🏅 Không có dữ liệu cấp độ XP nào để xóa trong máy chủ ${guildName}.\`\`\``);
                return await interaction.reply({ embeds: [noDataEmbed] });
            }

            const embed = new EmbedBuilder()
                .setColor(`Blue`)
                .setDescription(`\`\`\`yml\n🏅 Hệ thống xp trong máy chủ ${guildName} đã được thiết lập lại!\`\`\``);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error resetting XP:", error);
            const errorEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setDescription(`\`\`\`yml\n⚠️ Đã xảy ra lỗi khi thiết lập lại hệ thống xp trong máy chủ ${guildName}.\`\`\``);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}