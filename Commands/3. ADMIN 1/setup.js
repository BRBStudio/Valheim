/*
dùng để thiết lập người dùng cho yêu cầu trợ giúp từ nút tag_user
*/
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const setupSchema = require('../../schemas/setupSchema');
const { checkAdministrator } = require(`../../permissionCheck`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Thiết lập và quản lý ID 4 người dùng cho yêu cầu trợ giúp')
        .addSubcommand(subcommand =>
            subcommand
                .setName('id')
                .setDescription('Thiết lập ID 4 người dùng cho yêu cầu trợ giúp từ nút trong diễn đàn')
                .addStringOption(option =>
                    option.setName('id1')
                        .setDescription('ID người dùng 1 (bắt buộc)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('id2')
                        .setDescription('ID người dùng 2 (bắt buộc)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('id3')
                        .setDescription('ID người dùng 3 (không bắt buộc)'))
                .addStringOption(option =>
                    option.setName('id4')
                        .setDescription('ID người dùng 4 (không bắt buộc)')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('removeid')
                .setDescription('Xóa ID người dùng khỏi cơ sở dữ liệu')),

    async execute(interaction) {

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'id') {
            // Lấy ID từ các tùy chọn
            const id1 = interaction.options.getString('id1');
            const id2 = interaction.options.getString('id2');
            const id3 = interaction.options.getString('id3');
            const id4 = interaction.options.getString('id4');

            // Lưu thông tin vào MongoDB
            await setupSchema.updateOne(
                { Guild: interaction.guild.id },
                { $set: { ID1: id1, ID2: id2, ID3: id3 || null, ID4: id4 || null } },
                { upsert: true }
            );

            await interaction.editReply({ content: 'Cấu hình ID người dùng đã được lưu thành công!', ephemeral: true });

        } else if (subcommand === 'removeid') {
            // Xóa thông tin khỏi MongoDB
            await setupSchema.deleteOne({ Guild: interaction.guild.id });

            await interaction.editReply({ content: 'ID người dùng đã được xóa khỏi cơ sở dữ liệu.', ephemeral: true });
        }
    },
};
