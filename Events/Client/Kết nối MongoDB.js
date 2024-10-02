const { ActivityType } = require(`discord.js`)
const ms = require('ms');
const figlet = require('figlet'); // Đảm bảo bạn đã cài đặt gói figlet
const mongoose = require('mongoose');
require('dotenv').config(); // Tải biến môi trường từ .env
const config = require(`../../config`)
const autoresponderHandler = require('../../Handlers/autoresponderHandler');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        // // Tăng số lượng listener tối đa cho client
        // client.setMaxListeners(60);

        const { user, ws } = client

        // Lấy chuỗi kết nối MongoDB từ biến môi trường
        const mongodb = process.env.MONGODB_URI;
        // console.log('Chuỗi kết nối MongoDB:', mongodb);

        // Kết nối đến MongoDB
        if (!mongodb) {
            console.error('Không có chuỗi kết nối MongoDB được cung cấp trong .env');
            return;
        }

        // Kết nối MongoDB
        mongoose.connect(mongodb)
            .then(() => {
                // Khi kết nối thành công, hiển thị văn bản ASCII trong console
                figlet('Ket noi MongoDB thanh cong!', function (err, data) {
                    if (err) {
                        console.log('Có lỗi xảy ra khi tạo văn bản ASCII:', err);
                        return;
                    }
                    const border = '*'.repeat(data.split('\n')[0].length + 4); // Tạo đường viền cho ASCII art
                    console.log(border);
                    console.log(`* ${data.trim()} *`); // ⋆⦿ ⋆
                    console.log(border);
                });

                // Kích hoạt autoresponder handler khi kết nối thành công
                // console.log('Kích hoạt autoresponder handler.');
                autoresponderHandler(client);

            })
            .catch(err => {
                console.error('Lỗi kết nối MongoDB:', err);
            });

        // Hàm để cập nhật hoạt động của bot
        function updateActivity() {
            const currentActivity = user.presence.activities[0];
            if (currentActivity && currentActivity.name.startsWith('Ping:')) {
                user.setActivity({
                    name: '🔞 Streaming Status!',
                    type: ActivityType.Streaming,
                    url: 'https://www.youtube.com/watch?v=kp7pXzjXStw',
                    details: 'Đây là một thông điệp mô tả hoạt động',
                    state: '/bot-commands | Valheim Studio',
                });
            } else {
                const ping = ws.ping;
                user.setActivity({
                    name: `Ping: ${ping} ms`,
                    type: 3,
                });
            }
        }

        // Cập nhật hoạt động mỗi 5 giây
        setInterval(updateActivity, ms("5m"));

        // console.log((`✔️  ${client.user.username} đã được bật\n✔️  ID Bot: ${client.user.id}`));
        // console.log(`Đảm bảo tham gia máy chủ hỗ trợ nếu bạn cần bất kỳ trợ giúp nào: ${config.botServerInvite}`);
    },
};

/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/