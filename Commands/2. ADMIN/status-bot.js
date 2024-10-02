const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { createStatusBotEmbed } = require(`../../Embeds/embedsCreate`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status-bot')
        .setDescription('Kiểm tra trạng thái online hoặc offline của các bot trong máy chủ'),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Bạn phải là **Quản trị viên** hoặc vai trò của bạn phải có quyền **Quản trị viên** để thực hiện hành động này.", ephemeral: true});

        const embed = await createStatusBotEmbed(interaction)

        await interaction.reply({ embeds: [embed] });
    }
};



