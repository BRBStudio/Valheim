const { SlashCommandBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("report-user")
        .setDescription("Tố cáo người dùng tới *** QTV ***")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addUserOption(options => options.setName('user').setDescription('Người dùng bạn muốn tố cáo').setRequired(true)),

    async execute(interaction) {
        let user = interaction.options.getMember("user");

        if (!user) {
            user = interaction.user;
        }

        let reportModal = new ModalBuilder()
            .setCustomId("report")
            .setTitle("Tố cáo người dùng");

        let reportInput = new TextInputBuilder()
            .setCustomId("report")
            .setLabel("Lý do tố cáo")
            .setPlaceholder("Nhập lý do bạn muốn tố cáo người dùng này...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        let reportEmbed = new TextInputBuilder()
            .setCustomId('embed')
            .setLabel("Bật/tắt chế độ nhúng? dùng on/off")
            .setPlaceholder("on/off")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Thêm TextInput ẩn để lưu trữ ID của người dùng được tố cáo
        let userIdInput = new TextInputBuilder()
            .setCustomId('userId')
            .setLabel("Khuyến nghị: không chỉnh sửa phần này")
            .setValue(user.id) // Truyền ID của người dùng vào đây
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        let report = new ActionRowBuilder().addComponents(reportInput);
        let reportEmb = new ActionRowBuilder().addComponents(reportEmbed);
        let userRow = new ActionRowBuilder().addComponents(userIdInput); // Hàng chứa User ID ẩn

        reportModal.addComponents(report, reportEmb, userRow);

        await interaction.showModal(reportModal);
    }
};

