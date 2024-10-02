const { EmbedBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, PermissionsBitField, ButtonBuilder } = require('discord.js');
const config = require('../../config');
const { verify } = require('../../ButtonPlace/ButtonBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification')
        .setDMPermission(false)
        .setDescription('Đặt kênh xác minh vai trò thành viên')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Gửi xác minh tài khoản đến kênh này')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        try {

            // Kiểm tra xem tương tác có tồn tại không
            if (!interaction) {
                return;
            }

            await interaction.deferReply()

            const channel = interaction.options.getChannel('channel');
            const verifyEmbed = new EmbedBuilder()
                .setTitle("Kích Hoạt Thành Viên")
                .setDescription('Nhấp vào nút để xác minh tài khoản của bạn và đồng ý tuân thủ quy định server để có quyền truy cập vào các kênh.')
                .setColor(config.embedGreen);

            await interaction.guild.roles.fetch();


            let sendChannel = await channel.send({
                embeds: [verifyEmbed],
                components: [
                    new ActionRowBuilder().setComponents(
                        verify,
                    ),
                ],
            });

            if (!sendChannel) {
                return interaction.reply({ content: 'Đã có lỗi xảy ra, vui lòng thử lại sau.', ephemeral: false });
            }

            await interaction.deleteReply()
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Đã có lỗi xảy ra khi xử lý nút.', ephemeral: false });
        }
    },
};