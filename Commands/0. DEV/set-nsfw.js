const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const { BRB } = require(`../../Embeds/embedsDEV`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-nsfw')
        .setDMPermission(false)
        .setDescription('Thiết lập hoặc xóa thiết lập NSFW cho một kênh.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Thao tác bạn muốn thực hiện')
                .setRequired(true)
                .addChoices(
                    { name: 'Thiết lập', value: 'set' },
                    { name: 'Bỏ thiết lập', value: 'unset' }
                ))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Kênh bạn muốn thiết lập hoặc xóa thiết lập NSFW')
                .setRequired(false)),
    async execute(interaction) {

        if (!checkPermissions(interaction)) {
            await interaction.deferReply({ ephemeral: true });
            await interaction.deleteReply();
            return await interaction.channel.send({ embeds: [BRB], ephemeral: true });
        }

        const action = interaction.options.getString('action');
        let channel = interaction.options.getChannel('channel');

        if (!channel) {
            channel = interaction.channel;
        }

        if (![ChannelType.GuildText, ChannelType.GuildForum].includes(channel.type)) {
            await interaction.deferReply({ ephemeral: true });
            await interaction.deleteReply()
            return await interaction.channel.send({ content: 'Kênh này không phải là kênh văn bản!', ephemeral: true });
        }

        try {
            const nsfw = action === 'set';
            await channel.edit({ nsfw });
            await interaction.deferReply({ ephemeral: true });
            await interaction.deleteReply();
            await interaction.channel.send({ content: `Kênh **${channel.name}** đã được ${nsfw ? 'thiết lập' : 'xóa thiết lập'} NSFW.` });
        } catch (error) {
            console.error(error);
            await interaction.deferReply({ ephemeral: true });
            await interaction.deleteReply();
            await interaction.channel.send({ content: 'Đã xảy ra lỗi khi thiết lập kênh NSFW. Vui lòng thử lại sau.', ephemeral: true });
        }
    }
};
