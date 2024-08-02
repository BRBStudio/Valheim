const { ButtonInteraction } = require('discord.js');

// Xuất module để sử dụng trong tệp chính
module.exports = {
    name: "interactionCreate", // Tên sự kiện mà module này sẽ xử lý

    // Hàm sẽ được thực thi khi sự kiện xảy ra
    execute(interaction, client) {
            // Kiểm tra xem tương tác có phải là tương tác nút không
            if (!interaction.isButton()) return;

        try {
            // Lấy customId của nút đã nhấn
            const customId = interaction.customId;

            // Danh sách các nút cần loại trừ của lệnh discordjs-guide.js
            const DiscordjsGuideButtons = ['previous_button', 'next_button', 'end_button', 'restart_button'];

            // Danh sách các nút cần loại trừ của lệnh brb.js
            const brbButtons = ['previouss_button', 'nextt_button', 'restartt_button'];

            // Danh sách các nút cần loại trừ của lệnh discordjs-guide.js
            const BotCommandsButtons = ['homeButton', 'reportButton', 'inviteButton', 'deleteButton'];

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (DiscordjsGuideButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            if (brbButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            if (BotCommandsButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Lấy lệnh từ client.buttons bằng customId
            const button = client.buttons.get(customId);

            // Nếu không tìm thấy lệnh, trả lời rằng button không xác định
            if (!button) {
                interaction.reply({ content: "Button không xác định", ephemeral: true });
                return;
            }

            // Thực thi lệnh nút
            button.execute(interaction, client);
        } catch (error) {
            // Log lỗi ra console để dễ dàng kiểm tra
            console.error('Lỗi khi xử lý interaction:', error);

            // Thông báo lỗi cho người dùng nếu cần thiết
            interaction.reply({ content: "Đã xảy ra lỗi khi xử lý nút. Vui lòng thử lại sau.", ephemeral: true });
        }
    },
};
