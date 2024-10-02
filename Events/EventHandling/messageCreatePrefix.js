/*
***
    Events/EventHandling/messageCreateSlash.js
    Mã này xử lý các tin nhắn được gửi đến trong Discord máy chủ và thực thi lệnh khi có tiền tố
***
*/
require('dotenv').config(); // Tải biến môi trường từ .env
const cooldowns = new Map();

module.exports = {
    name: 'messageCreate',
    once: false, // Xác định sự kiện này có chỉ xảy ra một lần hay không. false có nghĩa là nó sẽ xảy ra mỗi khi có tin nhắn mới
    execute(message, client) {
        if (!message.guild || message.author.bot) return;

        // Lấy prefix từ biến môi trường
        const prefix = process.env.PREFIX;

        // Kiểm tra xem tin nhắn có bắt đầu bằng prefix hay không
        if (!message.content.startsWith(prefix)) return;
        
        // Lấy các tham số của lệnh
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.prefixCommands.get(commandName);
        if (!command) return;

        const now = Date.now();
        const timestamps = cooldowns.get(message.author.id) || {};
        const cooldownAmount = 5 * 1000; // 10 = 10 giây

        if (timestamps[commandName] && (now - timestamps[commandName]) < cooldownAmount) {
            const timeLeft = ((timestamps[commandName] + cooldownAmount) - now) / 1000;
            return message.channel.send(`Bạn đã gửi tin nhắn quá nhanh, điều này sẽ dẫn đến discord hiểu lầm bạn đang spam tin nhắn. Vui lòng chờ ít nhất **${timeLeft.toFixed(1)}** để dùng lại lệnh.`);
        }

        timestamps[commandName] = now;
        cooldowns.set(message.author.id, timestamps);

        try {
            // Xóa tin nhắn lệnh prefix
            message.delete().catch(err => console.error('Không thể xóa tin nhắn:', err));

            // Thực thi lệnh
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('Đã xảy ra lỗi khi thực hiện lệnh.');
        }
    },
};






