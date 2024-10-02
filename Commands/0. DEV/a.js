const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const interactionError = require('../../Events/WebhookError/interactionError');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testk')
        .setDMPermission(false)
        .setDescription('Lệnh kiểm tra lỗi'),

    async execute(interaction, client) {

        const permissionEmbed = new EmbedBuilder().setDescription("`❌` Bạn không có quyền sử dụng lệnh này!").setColor(config.embedGreen).setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });
        
        // Kiểm tra quyền đặc biệt
        if (!checkPermissions(interaction)) {
            return interaction.reply({ embeds: [permissionEmbed] });
        };

            // Tạo một EmbedBuilder
        const embed = new EmbedBuilder()
        .setDescription('Đi đâu')
        .setColor(`'#0099ff'`);

    // Cố ý gây lỗi bằng cách gọi một phương thức không hợp lệ
    try {
        // Sử dụng phương thức `send` không hợp lệ (gọi `interaction.send` thay vì `interaction.reply`)
        interaction.reply({ embeds: [embed] });
    } catch (error) {
        // // Xử lý lỗi và gửi thông báo lỗi
        // console.error('Có lỗi xảy ra:', error);
        // await interaction.reply({ content: 'Đã xảy ra lỗi khi gửi tin nhắn.', ephemeral: true });
        interactionError.execute(interaction, error, client);
    }
        
    },
};
