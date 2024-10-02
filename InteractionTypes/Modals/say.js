// InteractionTypes/Modals/bb.js

const {EmbedBuilder} = require(`discord.js`)
const config = require(`../../config`)

module.exports = {
    id: 'say',
    async execute(interaction) {
        // Lấy giá trị từ các input của modal
        const message = interaction.fields.getTextInputValue('say'); // Lấy giá trị từ ô 'say'
        const embedSay = interaction.fields.getTextInputValue('embed'); // Lấy giá trị từ ô 'embed'

        // // Lấy thông tin của bot (tên và hình ảnh)
        // const botName = interaction.client.user.username;
        // const botAvatar = interaction.client.user.displayAvatarURL();

        // Tạo embed để gửi nếu người dùng chọn 'bật' chế độ nhúng
        const embed = new EmbedBuilder()
            // .setAuthor({ name: botName, iconURL: botAvatar })
            .setDescription(message)
            .setColor(config.embedCyan);
        
        // Kiểm tra chế độ nhúng và gửi tin nhắn
        if (embedSay === "ok" || embedSay === "OK") {
            await interaction.channel.send({ embeds: [embed] });
        } else {
            await interaction.channel.send(message);
        }

        await interaction.deferUpdate(); // Đảm bảo interaction được xử lý đúng cách
    }
};
