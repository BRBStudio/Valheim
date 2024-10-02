const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Xóa tối đa 100 tin nhắn của một người dùng cụ thể dựa trên loại')
        .addUserOption(option => option.setName('target').setDescription('Chọn một người dùng').setRequired(false))
        .addStringOption(option =>
            option.setName('type')
            .setDescription('Loại tin nhắn cần xóa')
            .setRequired(false)
            .addChoices(
                { name: 'Tất cả', value: 'all' },
                { name: 'Chỉ văn bản', value: 'text' },
                { name: 'Embeds', value: 'embed' },
                { name: 'Tệp đính kèm', value: 'attachment' },
                { name: 'Links', value: 'links' },
                { name: 'Đề cập', value: 'mentions' },
                { name: 'Thành viên không có vai trò', value: 'norole' },
                { name: 'Thành viên không có Avatar', value: 'noavatar' },
                { name: 'Tin nhắn có phản ứng', value: 'reactions' },
                { name: 'Tin nhắn có biểu tượng cảm xúc', value: 'emojis' },
            )),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Bạn cần có quyền **quản lý tin nhắn** để sử dụng lệnh này.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('target');
        const type = interaction.options.getString('type');
        const messages = await interaction.channel.messages.fetch({ limit: 100 });

        const filteredMessages = messages.filter(m => {
        if (targetUser && m.author.id !== targetUser.id) return false;

        switch (type) {
            case 'all':
            return true;
            case 'text':
            return m.content && !m.attachments.size && !m.embeds.length;
            case 'embed':
            return m.embeds.length > 0;
            case 'attachment':
            return m.attachments.size > 0;
            case 'links':
            return m.content.includes('http://') || m.content.includes('https://');
            case 'mentions':
            return m.mentions.users.size > 0 || m.mentions.roles.size > 0;
            case 'norole':
            return m.member && m.member.roles.cache.size <= 1;
            case 'noavatar':
            return m.author.displayAvatarURL() === m.author.defaultAvatarURL;
            case 'reactions':
            return m.reactions.cache.size > 0;
            case 'emojis':
            return m.content.match(/<:\w+:\d+>/g) || m.content.match(/<a:\w+:\d+>/g);
        }
        });

    try {
            if (filteredMessages.size === 0) {
                return interaction.reply({ content: 'Không tìm thấy tin nhắn nào phù hợp với tiêu chí của bạn.', ephemeral: true });
            }
        
            await interaction.channel.bulkDelete(filteredMessages, true);
            await interaction.reply({ content: `Tin nhắn đã xóa${targetUser ? ` từ ${targetUser.username}` : ''}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Đã xảy ra lỗi khi cố gắng lọc thư trong kênh này.', ephemeral: true });
        }
    },
};
