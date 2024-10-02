const { EmbedBuilder } = require(`discord.js`)
const CreateButton = require('../../schemas/verificationSchema.js');
const config = require(`../../config`)

module.exports = {
    id: 'verify-custom',
    async execute(interaction, client) {
        try {
            // Lấy thông tin từ CSDL
            const buttonInfo = await CreateButton.findOne({ buttonLabel: interaction.component.label });

            if (!buttonInfo) {
                await interaction.deferReply();
                await interaction.deleteReply();
                await interaction.channel.send({
                    content: 'Nút đã bị xóa, bạn không thể làm gì khác, hãy liên hệ với chủ sở hữu máy chủ nếu bạn cần nút này',
                });

                // nếu nút đã bị xóa dữ liệu thì ngăn người dùng tương tác bằng cách xóa tin nhắn chứa nút
                await interaction.message.delete();
                return;
            }

            

            // Kiểm tra xem vai trò đã tồn tại trong server hay chưa
            let guildRole = interaction.guild.roles.cache.get(buttonInfo.namerolek);

            if (!guildRole) {
                console.error('Vai trò không tồn tại trong server.');
                return await interaction.reply({
                    content: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
                    ephemeral: true
                });
            }

            // Cấp vai trò cho thành viên tương tác
            await interaction.member.roles.add(guildRole);

            // Phản hồi với thông báo
            await interaction.reply({
                content: `Đã kích hoạt vai trò ${guildRole.name} cho tài khoản của bạn.`,
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                content: `Bot thiếu quyền ***QUẢN LÝ VAI TRÒ*** hoặc vai trò mà bạn muốn gắn cho người dùng cao hơn vai trò của bot`,
                ephemeral: true
            });
        }
    },
};