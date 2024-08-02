require('dotenv').config(); // Tải biến môi trường từ .env

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(message, client) {
        if (!message.guild || message.author.bot) return;

        // const prefix = '?'; // Đặt prefix của bạn ở đây
        // Lấy prefix từ biến môi trường
        const prefix = process.env.PREFIX;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.prefixCommands.get(commandName);
        if (!command) return;

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Đã xảy ra lỗi khi thực hiện lệnh.');
        }
    },
};
