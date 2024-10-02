const { ChannelType } = require(`discord.js`)
/*
khi có bất kì bot nào đó rời khỏi máy chủ sẽ có tin nhắn thống báo tới kênh
*/
module.exports = {
            name: "guildMemberRemove",
            async execute(member) {
                const guild = member.guild;
    
                // Kiểm tra nếu người rời khỏi là một bot
                if (member.user.bot) {
                    const channelName = "bot-bot"; // Thay tên kênh cụ thể vào đây
                    const channel = guild.channels.cache.find(channel => channel.name === channelName && channel.type === ChannelType.GuildText);

                    if (channel) {
                        channel.send(`Bot ${member.user.tag} đã rời khỏi máy chủ.`);
                    } else {

                    const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText); // Lọc ra chỉ các kênh văn bản
                    const randomChannel = channels.random(); // Chọn ngẫu nhiên một kênh từ danh sách các kênh văn bản

                    // khi không tìm thấy kênh channel sẽ nhắc nhở người dùng
                    if (randomChannel) {
                        randomChannel.send(`Hãy tạo kênh văn bản có tên "${channelName}" để nhận tin nhắn khi có bất kì bot nào rời khỏi máy chủ của bạn.`);
                    } else {
                    // console.log('Không tìm thấy kênh văn bản!');
                    return;           
                }
                // console.log('Không tìm thấy kênh văn bản có tên:', channelName);
            }
        }
    }
}