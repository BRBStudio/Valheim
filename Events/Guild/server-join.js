const { EmbedBuilder, ChannelType } = require('discord.js');
const { button } = require('../../ButtonPlace/ActionRowBuilder');

/*
Gửi lời chào khi mời bot BRB vào máy chủ
*/

module.exports = {
    name: "guildCreate",
    async execute(guild) {

        async function sendMessage(channel) {

            const message = `
                Cảm ơn đã mời bot của chúng tôi vào máy chủ của ***${guild.name}***!
                Để bot hoạt động tốt nhất, vui lòng làm theo các bước sau:
                1. Mở Discord và vào máy chủ mà bot đã được mời.\n
                2. Truy cập vào phần "Server Settings" (Cài đặt máy chủ).\n
                3. Chọn "Roles" (Vai trò).\n
                4. Tìm và chọn vai trò của bot.\n
                5. Kéo vai trò của bot lên trên cùng trong danh sách các vai trò.\n
                6. Dùng lệnh __/brb__ nhận hướng dẫn vào game valheim hoặc __/bot-commands__ để xem tất cả các lệnh của tôi.\n
                7. Bạn cũng có thể dùng lệnh __/valheim__ sau đó chọn game bạn muốn mời người chơi, để họ tham gia phòng của bạn\n

                >>> ❓ ***LƯU Ý:***
                **Nếu có bất kỳ câu hỏi nào, vui lòng dùng lệnh /mailbox gửi thông tin về cho chúng tôi hoặc liên hệ với DEV** [@Valheim Survival](https://discord.com/users/940104526285910046)!
            `;

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`Cảm ơn vì đã mời tôi! 😍`)
                .setImage(`https://media.tenor.com/Fn9Zb7_CDR0AAAAM/discord-hello.gif`)
                .setDescription(message)
                .setFooter({ text: 'Vui lòng xóa tin nhắn này bằng nút nếu nó ở kênh xấu!' });

            try {
                const msg = await channel.send({ content: 'Chào bạn!', embeds: [embed], components: [button] });

                const collect = msg.createMessageComponentCollector();
                collect.on('collect', async i => {
                    if (i.customId == 'deleteNew') {
                        await msg.delete();
                    }
                });

                return true;
            } catch (error) {
                // console.error(`Không thể gửi tin nhắn vào ${channel.name}:`, error);
                return false;
            }
        }

        const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);

        for (const channel of channels.values()) {
            const success = await sendMessage(channel);
            if (success) break;
        }
    }
}


////////// mời bot vào kênh sẽ hiện ra tin nhắn ///////////////////
//////////////////////////////////////////////////////////////////
//  ____  ____  ____    ____  _             _ _                //
// | __ )|  _ \| __ )  / ___|| |_ _   _  __| (_) ___          //
// |  _ \| |_) |  _ \  \___ \| __| | | |/ _` | |/ _ \        //
// | |_) |  _ <| |_) |  ___) | |_| |_| | (_| | | (_) |      //
// |____/|_| \_\____/  |____/ \__|\__,_|\__,_|_|\___/      //
//                                                        //
///////////////////////////////////////////////////////////