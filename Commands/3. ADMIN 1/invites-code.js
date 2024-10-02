const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { checkAdministrator } = require(`../../permissionCheck`)
const { embed } = require(`../../Embeds/embedsDEV`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites-code')
        .setDescription('Tìm nạp và hiển thị tất cả lời mời cho máy chủ.'),
    async execute(interaction) {
        
        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        await interaction.deferReply();

        try {
            const invites = await interaction.guild.invites.fetch();
            
            if (!invites.size) {
                return interaction.editReply({
                    content: 'Không tìm thấy lời mời nào cho máy chủ này.',
                    ephemeral: true
                });
            }

            const inviteList = invites.map(invite => ({
                code: invite.code,
                inviter: `${invite.inviter.tag} (${invite.inviter.id})`,
                timestamp: `<t:${Math.floor(invite.createdTimestamp / 1000)}:R>`
            }));

            inviteList.forEach(invite => {
                embed.addFields(
                    { name: 'Mã số', value: invite.code, inline: true },
                    { name: 'Người mời', value: invite.inviter, inline: true },
                    { name: 'Thời gian', value: invite.timestamp, inline: true }
                );
            });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching invites:', error);
            await interaction.editReply({
                content: 'Đã xảy ra lỗi khi tìm nạp lời mời.',
                ephemeral: true
            });
        }
    },
};