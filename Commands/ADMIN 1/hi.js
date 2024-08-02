const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hi')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Đây là tin nhắn chào mừng.'),
    async execute(interaction, client) {
        try {
            const nameserver = `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★`

            // Kiểm tra xem lệnh được gọi từ máy chủ mong muốn
            // if (interaction.guildId !== '1028540923249958912') {
            //     return await interaction.reply({ content: `Lệnh này chỉ có thể được sử dụng trong máy chủ ***${nameserver}***.`, ephemeral: true });
            // }

            // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            //     return await interaction.reply({ content: 'Lệnh này chỉ dành cho chủ sở hữu.', ephemeral: true });
            // }

            const embed = new EmbedBuilder()
                .setTitle(`Chào mừng bạn đến ${interaction.guild.name}!`)
                .setDescription(`Chào mừng đến với máy chủ của chúng tôi! Chúng tôi đã biến nơi đây thành sân chơi Valheim Survival đúng nghĩa, nhưng chúng ta có thể vui chơi và được là chính mình! Bạn có thể trò chuyện, chơi hoặc làm bất cứ điều gì bạn muốn ở đây. Tôi hy vọng chúng ta có thể kết bạn lâu dài và vui vẻ cùng nhau!\n\nNếu bạn cần bất kỳ trợ giúp nào, hãy liên hệ với một trong các Admin để được hỗ trợ bằng cách sử dụng lệnh này: </admin:1172947009410437142> hoặc bạn có thể dùng tag vai trò như @ADMIN, nhưng việc tag người dùng có ID là '1215380543815024700' sẽ bị loại bỏ vì đây là acc clone của Dev.`)
                .setColor(client.config.embedYellow)

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('butt1')
                        .setLabel(`Quy tắc ${interaction.guild.name}`)
                        .setEmoji('<:9VayEYA0VU:1248778363892400148>') // <:hanyaCheer:1173363092353200158>
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('butt2')
                        .setLabel('Quy tắc Valheim Survival')
                        .setEmoji(`<:arrowr1:1249618706066051096>`)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('butt3')
                        .setLabel(`Đặc quyền ${interaction.guild.name}`)
                        .setEmoji(`<:pinkstar:1249623499534893127>`)
                        .setStyle(ButtonStyle.Primary)
                );

            // Defer the reply to avoid timing out
            await interaction.deferReply({ ephemeral: true });

            // Send the embed message with buttons
            await interaction.channel.send({ embeds: [embed], components: [button] });

            // Confirm the action
            await interaction.editReply({ content: 'Tin nhắn chúc mừng của bạn đã được gửi!' });
        } catch (error) {
            console.error('Error handling interaction:', error);
            // If an error occurred, ensure we handle it appropriately
            if (!interaction.replied) {
                await interaction.editReply({ content: 'Đã xảy ra lỗi khi gửi tin nhắn chúc mừng.', ephemeral: true });
            }
        }
    }
};
