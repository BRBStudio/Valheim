const { ModalSubmitInteraction } = require('discord.js');

module.exports = {
    name: "interactionCreate", // Tên sự kiện mà module này sẽ xử lý

    execute(interaction, client) {
        // Kiểm tra xem tương tác có phải là tương tác modal không
        if (!interaction.isModalSubmit()) return;

        try {
            // Lấy customId của modal đã gửi
            const customId = interaction.customId;

            // Lấy lệnh từ client.modals bằng customId
            const modal = client.modals.get(customId);

            // Nếu không tìm thấy lệnh, trả lời rằng modal không xác định
            if (!modal) {
                interaction.reply({ content: "Modal không xác định", ephemeral: true });
                return;
            }

            // Thực thi lệnh modal
            modal.execute(interaction, client);
        } catch (error) {
            console.error('Lỗi khi xử lý interaction:', error);
            interaction.reply({ content: "Đã xảy ra lỗi khi xử lý modal. Vui lòng thử lại sau.", ephemeral: true });
        }
    },
};
