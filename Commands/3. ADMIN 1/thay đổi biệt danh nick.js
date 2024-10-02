const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDMPermission(false)
        .setDescription('Thay đổi biệt danh của người dùng được chỉ định.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Biệt danh của người mà bạn muốn thay đổi.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Biệt hiệu được chỉ định sẽ trở thành biệt hiệu mới của người được chỉ định.')
                .setRequired(true)
        ),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Bạn phải là **Quản trị viên** hoặc vai trò của bạn phải có quyền **Quản trị viên** để thực hiện hành động này.", ephemeral: true});

        const nick = interaction.options.getString('name');

        const user = interaction.options.getUser('user') || interaction.user;

        const member = interaction.guild.members.cache.get(user.id);

        let TenCu = member.displayName; // Lưu biệt hiệu hiện tại của người dùng

        if (user.id === interaction.user.id) {

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ChangeNickname) && interaction.user.id !== '940104526285910046') {
                console.log('Người dùng không có quyền thay đổi biệt hiệu của chính mình.');
                return await interaction.reply({ content: 'Bạn **không** có quyền làm điều đó! Bạn cần có quyền **ĐỔI BIỆT DANH** để làm điều này.', ephemeral: true });
            }

            try {
                
                await interaction.member.setNickname(nick);
                return await interaction.reply({ content: `**Biệt hiệu** của bạn đã được đặt thành "**${nick}**"!`, ephemeral: true });
            } catch (err) {
                // Xử lý lỗi mà không in ra console
                return interaction.reply({ content: `**Không thể** thay đổi biệt hiệu của bạn! **Kiểm tra** quyền và **vị trí vai trò** của tôi rồi thử lại. tôi cần vai trò cao hơn vai trò của bạn.`, ephemeral: true });
            }
        } else {

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames) && interaction.user.id !== '940104526285910046') {
                return await interaction.reply({ content: `Bạn **không** có quyền thay đổi biệt hiệu của **người khác**! Bạn cần có quyền **QUẢN LÝ BIỆT DANH** để làm điều này.`, ephemeral: true });
            }

            try {
                
                await member.setNickname(nick);
                
                return await interaction.reply({ content: `Bạn đặt thành công biệt hiệu của **${TenCu}** 👉 **${nick}**!`, ephemeral: true });
            } catch (err) {
                // Xử lý lỗi mà không in ra console
                return interaction.reply({ content: `**Không thể** thay đổi biệt hiệu của ${user}! **Kiểm tra** quyền và **vị trí vai trò** của bạn rồi thử lại. tôi cần vai trò cao hơn vai trò của người dùng ${user}`, ephemeral: true });
            }
        }
    }
};

