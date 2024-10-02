/*
***
    Events/Guild/messageCreateSlash.js
    Mã này gửi tin nhắn chào mừng đến kênh được chỉ định khi một máy chủ mới nhập vào thành viên.
    Dùng lệnh /welcome-setup để kích hoạt điều này
***
*/
const { Events, EmbedBuilder } = require("discord.js");
const WelcomeMessage = require("../../schemas/welcomeSchema.js");

module.exports = {
    name: Events.GuildMemberAdd,
        async execute(member) {
            try{
                const { user, guild } = member;

                const brb = `
   
        ██████╗ ██████╗░██████╗     
        ██╔══██╗██╔══██╗██╔══██╗    
        ██████╔╝██████╔╝██████╔╝    
        ██╔══██╗██╔══██╗██╔══██╗    
        ██████╔╝██║░░██║██████╔╝    
        ╚═════╝ ╚═╝░░╚═╝╚═════╝     
                                        
                `;
        
                // Lấy thông tin tin nhắn chào mừng từ cơ sở dữ liệu
                const welcomeMessage = await WelcomeMessage.findOne({
                    guildId: member.guild.id,
                });

                // Nếu không có thông tin tin nhắn chào mừng thì tạo một tin nhắn
                if (welcomeMessage) {
                    const channel = member.guild.channels.cache.get(welcomeMessage.channelId);
                    const rules = member.guild.channels.cache.get(welcomeMessage.rulesChannelId);  // Lấy kênh luật lệ
                    const owner = await guild.fetchOwner();  // Lấy thông tin của chủ sở hữu server

                // Kiểm tra nếu kênh tồn tại trước khi gửi tin nhắn
                if (!channel) {
                    console.error(`Không tìm thấy kênh với ID: ${welcomeMessage.channelId}`);
                    return;
                }

                const placeholders = {
                    b1: member.user.toString(),
                    b2: guild.name,
                    b3: guild.memberCount,
                };

                const messageContent = replacePlaceholders(welcomeMessage.message, placeholders).replace(/\\n/g, "\n");

                if (welcomeMessage.isEmbed) {
                // Gửi tin nhắn chào mừng dưới dạng nhúng
                const embed = new EmbedBuilder()
                        .setTitle(`Chào mừng ${user.username} đến với ${guild.name}🎉 !!!`)
                        .setColor("Random")
                        .setDescription(messageContent)
                        .addFields(
                            { name: `Luật Server`, value: rules ? `${rules}` : 'chưa có kênh rules', inline: true },
                            { name: "Admin", value: `${owner.displayName}`, inline: true }, // `${owner.user.tag}` tên đăng nhập (`${owner.displayName}` tên hiển thị)
                            { name: `Tổng số thành viên`, value: `${guild.memberCount}`, inline: false }
                        )
                        .setThumbnail(user.displayAvatarURL())
                        .setTimestamp();

                if (welcomeMessage.imageUrl) {
                embed.setImage(welcomeMessage.imageUrl);  // Thiết lập hình ảnh
                } else {
                    embed.addFields({ name: `TÊN BOT`, value: '```\n' + brb + '\n```', inline: false });  // Thêm trường TÊN BOT nếu không có hình ảnh
                }

                    channel.send({ embeds: [embed] });
                } else {
                    channel.send(messageContent);
                }
            }
        } catch (error) {
            console.error(`Đã xảy ra lỗi khi gửi tin nhắn chào mừng: ${error.message}`);
        }
    },
};

// function replacePlaceholders(message, placeholders) {
//     return message.replace(/{(.*?)}/g, (match, key) => placeholders[key] || match);
// }

// function replacePlaceholders(message, placeholders) {
//     // Thay thế các placeholder mà không cần dùng {}
//     return message
//         .replace(/user/g, placeholders.b1)
//         .replace(/name/g, placeholders.b2)
//         .replace(/tv/g, placeholders.b3)
//         .replace(/rules/g, placeholders.b4)
//         .replace(/\\n/g, "\n");
// }


function replacePlaceholders(message, placeholders) {
    return message.replace(/\b(b1|b2|b3)\b/gi, (match) => placeholders[match.toLowerCase()] || match);
}
