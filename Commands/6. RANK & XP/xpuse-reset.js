const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require(`../../schemas/messagelevelSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xpuse-reset`)
    .setDMPermission(false)
    .setDescription(`Đặt lại thành viên XP`)
    .addUserOption(option => option.setName(`user`).setDescription(`Thành viên bạn muốn xóa xp của`).setRequired(true)),

    async execute (interaction) {

        const guildName = interaction.guild.name;

        const perm = new EmbedBuilder()
        .setColor(`Blue`)
        .setDescription(`\`\`\`yml\n🏅 Bạn không có quyền đặt lại cấp độ xp trong máy chủ ${guildName}.\`\`\``)

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [ perm], ephemeral: true });

        const { guildId } = interaction;

        const target = interaction.options.getUser(`user`);

        try {
            await levelSchema.deleteMany({ Guild: guildId, User: target.id });

            const embed = new EmbedBuilder()
                .setColor(`Blue`)
                .setDescription(`🏅 ${target.displayName} xp đã được thiết lập lại!`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Lỗi khi xóa dữ liệu XP:", error);
            await interaction.reply("⚠️ Đã xảy ra lỗi khi xóa dữ liệu XP.");
        }
    }
}