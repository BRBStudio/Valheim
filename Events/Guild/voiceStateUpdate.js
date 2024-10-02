/*
bot đọc tên người dùng khi người dùng tham gia kênh thoại
*/
const voiceQueue = require('../../queue'); // Nhập voiceQueue từ queue.js

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState, newState) {
        try {
            const voiceChannel = newState.channel;
            if ((oldState.channelId !== newState.channelId) && voiceChannel) {
                // Kiểm tra xem người dùng có phải là bot hay không
                if (newState.member.user.bot) return; // Nếu là bot thì thoát hàm

                const displayName = newState.member.displayName; // Lấy tên hiển thị của người dùng
                const textToSpeak = `${displayName} đã vào kênh thoại ${voiceChannel.name}.`; // Tạo văn bản cần phát

                // Thêm yêu cầu vào hàng đợi
                voiceQueue.addToQueue({ text: textToSpeak, channel: voiceChannel, type: 'voice' });
            }
        } catch (error) {
            console.error('Lỗi xử lý voiceStateUpdate:', error);
        }
    }
};
