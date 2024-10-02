const { ApplicationCommandType } = require('discord.js');

module.exports = {
    name: 'interactionCreate', // Tên sự kiện mà module này sẽ xử lý

    async execute(interaction, client) {
        // Kiểm tra xem tương tác có phải là một lệnh ngữ cảnh người dùng hoặc ngữ cảnh tin nhắn không
        if (!interaction.isUserContextMenuCommand() && !interaction.isMessageContextMenuCommand()) return; // && !interaction.isMessageContextMenuCommand()


        try {
            // Lấy tên lệnh từ interaction
            const commandName = interaction.commandName;
            // console.log(`Nhận lệnh context menu: ${commandName}`);

            // Lấy lệnh từ client.contextMenus bằng commandName
            const contextMenu = client.contextMenus.get(commandName);

            // Nếu không tìm thấy lệnh, trả lời rằng context menu không xác định
            if (!contextMenu) {
                console.log(`Lệnh context menu không xác định: ${commandName}`);
                await interaction.reply({ content: 'Context Menu không xác định', ephemeral: true });
                return;
            }

            // Thực thi lệnh context menu
            // console.log(`Lệnh context menu: ${commandName} đã được xử lý.`);
            await contextMenu.execute(interaction, client);
        } catch (error) {
            console.error('Lỗi khi xử lý interaction:', error);
            await interaction.reply({ content: 'Đã xảy ra lỗi khi xử lý. Vui lòng thử lại sau hoặc liên hệ với DEV', ephemeral: true });
        }
    },
};
