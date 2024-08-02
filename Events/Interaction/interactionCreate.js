// const { CommandInteraction } = require('discord.js');

// module.exports = {
//     name: "interactionCreate",

//     execute(interaction, client) {
//         if (!interaction.isChatInputCommand()) return;

//         const command = client.commands.get(interaction.commandName);

//         if (!command) {
//             interaction.reply({ content: "lệnh lỗi thời" });
//         }

//         command.execute(interaction, client);
//     },
// };

const { CommandInteraction } = require('discord.js');

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) { // Thay đổi hàm thành bất đồng bộ
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            return interaction.reply({ content: "Lệnh lỗi thời" });
        }

        try {
            await command.execute(interaction, client); // Bọc lệnh thực thi trong try
        } catch (error) {
            console.error("Đã xảy ra lỗi khi thực thi lệnh:", error); // Ghi lỗi ra console
            await interaction.reply({ content: "Đã xảy ra lỗi khi thực thi lệnh." }); // Gửi thông báo lỗi đến người dùng
        }
    },
};
