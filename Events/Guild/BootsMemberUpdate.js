const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember) {
        // Kiểm tra nếu có sự thay đổi trong trạng thái tăng cường
        if (!oldMember.premiumSince && newMember.premiumSince) {
            // ID của kênh là không cần thiết nữa, ta sẽ tìm kênh văn bản đầu tiên
            let avatarURL = newMember.user.displayAvatarURL({ format: 'webp', dynamic: true, size: 1024 });
            avatarURL = avatarURL.replace('.webp', '.png');

            let embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle("Cảm ơn bạn đã tăng cường!")
                .setDescription(`Cảm ơn ${newMember.user.toString()}, đã tăng cường máy chủ của chúng tôi! Sự hỗ trợ của bạn có ý nghĩa rất lớn đối với chúng tôi.`)
                .setThumbnail(newMember.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setImage(`https://api.aggelos-007.xyz/boostcard?avatar=${avatarURL}&username=${newMember.user.username}`)
                .setTimestamp();

            // Tìm kênh văn bản đầu tiên trong guild
            const textChannel = newMember.guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);

            // Gửi tin nhắn embed đến kênh văn bản đầu tiên tìm thấy
            if (textChannel) {
                return textChannel.send({ embeds: [embed] });
            } else {
                console.log("Không tìm thấy kênh văn bản trong guild.");
            }
        }
    }
}
