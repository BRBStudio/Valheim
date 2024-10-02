const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require(`../../config`)

module.exports = {
    data: {
        name: 'CHÀO THÀNH VIÊN',
        type: ApplicationCommandType.User,
    },
    async execute(interaction, client) {
        if (!interaction.isUserContextMenuCommand()) return;

        if (interaction.commandName === 'CHÀO THÀNH VIÊN') {

            // Đánh dấu tương tác để tránh lỗi "Ứng dụng không phản hồi"
            await interaction.deferReply({ ephemeral: true });

            // Kiểm tra xem bot có các quyền cần thiết hay không
            const botMember = interaction.guild.members.cache.get(client.user.id);
            const requiredPermissions = [
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.EmbedLinks,
                PermissionsBitField.Flags.UseExternalEmojis,
                PermissionsBitField.Flags.SendMessagesInThreads,
                PermissionsBitField.Flags.CreatePublicThreads,
                PermissionsBitField.Flags.AddReactions
            ];

            if (!botMember.permissions.has(requiredPermissions)) {
                // Gửi thông báo vào kênh nếu bot thiếu quyền
                await interaction.channel.send({ content: config.BotPermissions });
                // Xóa phản hồi đã trì hoãn
                await interaction.deleteReply();
                return;
            }

            // Kiểm tra xem người dùng có các quyền cần thiết hay không
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                // Gửi thông báo vào kênh nếu người dùng không có quyền
                await interaction.channel.send({ content: config.OwnerPermissions });
                // Xóa phản hồi đã trì hoãn
                await interaction.deleteReply();
                return;
            }

            try {
                const embed = new EmbedBuilder()
                    .setTitle(`Chào mừng bạn đến ${interaction.guild.name}!`)
                    .setDescription('Chào mừng đến với máy chủ của chúng tôi! Chúng tôi đã biến nơi đây thành sân chơi Valheim Survival đúng nghĩa, nhưng chúng ta có thể vui chơi và được là chính mình! Bạn có thể trò chuyện, chơi hoặc làm bất cứ điều gì bạn muốn ở đây. Tôi hy vọng chúng ta có thể kết bạn lâu dài và vui vẻ cùng nhau!\n\nNếu bạn cần bất kỳ trợ giúp nào, hãy liên hệ với một trong các Admin để được hỗ trợ bằng cách sử dụng lệnh này: </admin:1172947009410437142> hoặc bạn có thể dùng tag vai trò như @ADMIN.');

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('button3')
                            .setLabel(`Quy tắc ${interaction.guild.name}`)
                            .setEmoji('<:9VayEYA0VU:1248778363892400148>')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('button4')
                            .setLabel(`Đặc quyền ${interaction.guild.name}`)
                            .setEmoji(`<:arrowr1:1249618706066051096>`)
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('button5')
                            .setLabel(`Quy tắc Valheim Survival`)
                            .setEmoji(`<:pinkstar:1249623499534893127>`)
                            .setStyle(ButtonStyle.Primary)
                    );

                // Gửi tin nhắn với embed và nút bấm
                await interaction.channel.send({ embeds: [embed], components: [button] });
                // Xóa phản hồi đã trì hoãn
                await interaction.deleteReply();
            } catch (error) {
                console.error('Lỗi xử lý tương tác:', error);
                // Xử lý lỗi nếu xảy ra
                await interaction.channel.send({ content: 'Đã xảy ra lỗi khi gửi tin nhắn chúc mừng.' });
                // Xóa phản hồi đã trì hoãn
                await interaction.deleteReply();
            }
        }
    },
};




