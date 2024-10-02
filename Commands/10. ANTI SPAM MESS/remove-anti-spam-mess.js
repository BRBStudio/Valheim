const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const AutoMod = require('../../schemas/autoModSchema');
const { checkAdministrator } = require(`../../permissionCheck`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-anti-spam-mess')
        .setDescription('Xóa dữ liệu hệ thống chống spam tin nhắn và kênh bot-mới')
        .setDMPermission(false),

    async execute(interaction, client) {
        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        // Xóa dữ liệu từ MongoDB
        const guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
        if (!guildConfig) {
            return interaction.reply('Không tìm thấy dữ liệu hệ thống chống spam tin nhắn cho server này.');
        }

        await AutoMod.deleteOne({ guildId: interaction.guild.id });
        await interaction.reply('Đã xóa dữ liệu hệ thống chống spam tin nhắn.');

        // Tìm và xóa kênh 'bot-mới'
        const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'log-spam-tin-nhắn');
        if (logChannel) {
            await logChannel.delete('Xóa kênh bot-mới khi xóa hệ thống chống spam tin nhắn.');
        } else {
            await interaction.followUp('Không tìm thấy kênh bot-mới.');
        }
    },
};
