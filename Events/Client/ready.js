const ms = require('ms');
const figlet = require('figlet'); // Đảm bảo bạn đã cài đặt gói figlet
const mongoose = require('mongoose');
require('dotenv').config(); // Tải biến môi trường từ .env

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        const { user, ws } = client

        // Lấy chuỗi kết nối MongoDB từ biến môi trường
        const mongodb = process.env.MONGODB_URI;

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
            })
            .catch(err => {
                console.error('Lỗi kết nối MongoDB:', err);
            });

        setInterval(() => {
            const ping = ws.ping;

            user.setActivity({
                name: `Ping: ${ping} ms`,
                type: 3,
            });

        }, ms("5s"));

        console.log((`✔️  ${client.user.username} đã được bật\n✔️  ID Bot: ${client.user.username}`));
        console.log(`Đảm bảo tham gia máy chủ hỗ trợ nếu bạn cần bất kỳ trợ giúp nào: https://discord.com/oauth2/authorize?client_id=1268569140466028649&permissions=8&integration_type=0&scope=bot`);
    },
};













// const ms = require('ms');
// const figlet = require('figlet'); // Đảm bảo bạn đã cài đặt gói figlet
// const mongoose = require('mongoose');
// const { mongodb } = require('../../config.json')

// module.exports = {
//     name: "ready",
//     once: true,
//     async execute(client) {

//         const { user, ws } = client

//         // Kết nối đến MongoDB
//         if (!mongodb) {
//             console.error('Không có chuỗi kết nối MongoDB được cung cấp trong config.json');
//             return;
//           }
      
//           // Kết nối MongoDB
//           mongoose.connect(mongodb)
//             .then(() => {
//               // Khi kết nối thành công, hiển thị văn bản ASCII trong console
//               figlet('Ket noi MongoDB thanh cong!', function (err, data) {
//                 if (err) {
//                   console.log('Có lỗi xảy ra khi tạo văn bản ASCII:', err);
//                   return;
//                 }
//                 const border = '*'.repeat(data.split('\n')[0].length + 4); // Tạo đường viền cho ASCII art
//                     console.log(border);
//                     console.log(`* ${data.trim()} *`); // ⋆⦿ ⋆
//                     console.log(border);
//                 // console.log(data);
//               });
//             })
//             .catch(err => {
//               console.error('Lỗi kết nối MongoDB:', err);
//             });

//         setInterval(() => {

//             const ping = ws.ping

//             user.setActivity({
//                 name: `Ping: ${ping} ms`,
//                 type: 3,
//             })

//         }, ms("5s"))

//         console.log((`✔️  ${client.user.username} đã được bật\n✔️  ID Bot: ${client.user.username}`));
//         console.log(`Đảm bảo tham gia máy chủ hỗ trợ nếu bạn cần bất kỳ trợ giúp nào: https://discord.com/oauth2/authorize?client_id=1268569140466028649&permissions=8&integration_type=0&scope=bot`);

//     },
// };