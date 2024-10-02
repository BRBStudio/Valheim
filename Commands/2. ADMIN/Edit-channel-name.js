const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit-channel-name')
        .setDescription('Đổi tên kênh mà bạn muốn')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Kênh bạn muốn đổi')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('name')
            .setDescription('Tên bạn muốn đổi')
            .setRequired(true)
        ),
        
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const name = interaction.options.getString('name');
        const oldName = channel.name; // Get the current name of the channel

        // Check if the channel is a text or voice channel
        let channelType = '';
        if (channel.type === ChannelType.GuildText) {
            channelType = 'văn bản';
        } else if (channel.type === ChannelType.GuildVoice) {
            channelType = 'thoại';
        } else {
            return interaction.reply({ content: 'Vui lòng chọn một kênh văn bản hoặc kênh thoại hợp lệ.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            // Rename the channel
            await channel.setName(name);
            // Provide feedback to the user
            const embed = new EmbedBuilder()
                .setTitle('Đổi tên thành công')
                .setDescription(`Tên kênh ${channelType} ***${oldName}*** đã được đổi thành ***${name}***`)
                .setColor('Green');
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error renaming channel:', error);
            // Provide error feedback to the user
            await interaction.editReply({ content: 'Đã xảy ra lỗi khi đổi tên kênh. Vui lòng thử lại sau.', ephemeral: true });
        }
    }
};
