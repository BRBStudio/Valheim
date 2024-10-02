const { SlashCommandBuilder, ActionRowBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { translate_tiengviet, translate_tienganh, translate_cancel } = require('../../ButtonPlace/ButtonBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDMPermission(false)
        .setDescription('Dịch ngôn ngữ.'),
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const actionRow = new ActionRowBuilder().addComponents(translate_tiengviet, translate_tienganh, translate_cancel);

        const time = new EmbedBuilder()
                        .setColor(`Green`)
                        .setTitle("🌐 Chọn ngôn ngữ bạn muốn dịch!")
                        .setTimestamp()
                        .setFooter({ text: `Chúc bạn 1 ngày tốt lành tại ***${interaction.guild.name}***` });

        if (!interaction.deferred && !interaction.replied) {
            await interaction.reply({
                // content: '🌐 Chọn ngôn ngữ bạn muốn dịch!',
                components: [actionRow],
                embeds: [time],
                ephemeral: true
            });
        }
    },
};