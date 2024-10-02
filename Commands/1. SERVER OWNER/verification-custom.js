const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const CreateButton = require('../../schemas/verificationSchema.js');
const interactionError = require('../../Events/WebhookError/interactionError');
const { checkOwner } = require(`../../permissionCheck`)
const { VerifyCustomembed } = require(`../../Embeds/embedsDEV.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification-custom')
        .setDescription('Tạo xác minh tùy chỉnh.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Thiết lập nút xác minh vai trò')
                .addRoleOption(option =>
                    option.setName('roles')
                        .setDescription('Chọn vai trò mà bạn muốn giao cho người dùng')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('button')
                        .setDescription('Tên nút tùy chỉnh để người dùng tương tác')
                        .setRequired(true)
                )
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Gửi xác minh tài khoản đến kênh này')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Xóa tất cả các thiết lập xác minh tùy chỉnh')
        ),
    async execute(interaction) {

        const hasPermission = await checkOwner(interaction);
        if (!hasPermission) return;

        if (interaction.options.getSubcommand() === 'setup') {
            try {
                const role = interaction.options.getRole('roles');
                const buttonLabel = interaction.options.getString('button');
                const channel = interaction.options.getChannel('channel');

                // Lưu thông tin nút và vai trò vào CSDL
                const createButton = new CreateButton({
                    buttonLabel: buttonLabel,
                    namerolek: role.id // Lưu ID vai trò thay vì tên
                });
                await createButton.save();

                const button = new ButtonBuilder()
                    .setCustomId('verify-custom')
                    .setLabel(buttonLabel)
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(button);

                await channel.send({ embeds: [VerifyCustomembed], components: [row] });

                await interaction.reply({ content: `Đã gửi xác minh đến kênh ${channel}.`, ephemeral: true });
            } catch (error) {
                console.error('Lỗi khi xử lý lệnh tesss:', error);
                await interaction.reply({
                    content: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
                    ephemeral: true
                });
            }
        } else if (interaction.options.getSubcommand() === 'remove') {
            try {
                // Xóa tất cả các thiết lập xác minh tùy chỉnh từ CSDL
                await CreateButton.deleteMany({});

                await interaction.reply({ content: 'Đã xóa tất cả các thiết lập xác minh tùy chỉnh.', ephemeral: true });
            } catch (error) {
                interactionError.execute(interaction, error, client);
            }
        }
    },
};
