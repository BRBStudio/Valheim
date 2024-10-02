const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ChannelType, ButtonStyle } = require('discord.js');
const ticket = require('../../schemas/ticketSchema');
const pingStaff = require(`../../schemas/pingstaffSchema`);

module.exports = {
    id: 'ticketModal',
    async execute(interaction) {
        if (interaction.customId && interaction.customId.startsWith('ticketModal')) {
            const selectedValue = interaction.customId.split('-')[1];
            const user = interaction.user;
            const data = await ticket.findOne({ Guild: interaction.guild.id });

            if (!data) {
                return await interaction.reply({ content: `Lấy làm tiếc! Có vẻ như bạn đã tìm thấy thông báo này nhưng hệ thống vé vẫn chưa được thiết lập ở đây.`, ephemeral: true });
            } else {
                const why = interaction.fields.getTextInputValue('whyTicket');
                const info = interaction.fields.getTextInputValue('infoTicket');
                // // Log giá trị để kiểm tra
                // console.log('Giá trị whyTicket:', why);
                // console.log('Giá trị infoTicket:', info);
                const category = await interaction.guild.channels.cache.get(data.Category);

                // Tăng số vé hiện tại
                data.currentTicketNumber += 1;
                if (selectedValue === 'discordTicket') {
                    data.currentDiscordTicketNumber += 1;
                } else if (selectedValue === 'gameTicket') {
                    data.currentGameTicketNumber += 1;
                }
                await data.save();

                const ticketNumber = selectedValue === 'discordTicket'
                    ? data.currentDiscordTicketNumber.toString().padStart(5, '0')
                    : data.currentGameTicketNumber.toString().padStart(5, '0');

                // Đặt tên kênh mới dựa trên giá trị được chọn
                let channelName = `ticket-${ticketNumber}`;
                if (selectedValue === 'discordTicket') {
                    channelName = `discord-${ticketNumber}`;
                } else if (selectedValue === 'gameTicket') {
                    channelName = `game-${ticketNumber}`;
                }

                // Lấy thông tin vai trò từ schema
                const pingStaffData = await pingStaff.findOne({ Guild: interaction.guild.id });
                if (!pingStaffData) {
                    return await interaction.reply({ content: `🚫 Không tìm thấy thông tin vai trò trong hệ thống. Hãy dùng lệnh ***ping-staff manage*** để setup 2 vai trò cho vé discord và vé valheim.`, ephemeral: true });
                }

                // // Lấy các quyền từ pingStaffData
                // const roleOverwrites = pingStaffData.Roles.map(role => ({
                //     id: role.RoleID,
                //     allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                // }));

                // // Lưu thông tin vai trò vào cơ sở dữ liệu
                // const roles = pingStaffData.Roles.map(role => ({
                //     id: role.RoleID,
                //     name: role.RoleName // Giả sử bạn có tên vai trò trong pingStaffData
                // }));

                // Lấy các quyền từ pingStaffData dựa trên loại vé
                const roleOverwrites = pingStaffData.Roles
                    .filter(role => (selectedValue === 'discordTicket' && role.ChannelType === 'discord-') || 
                                     (selectedValue === 'gameTicket' && role.ChannelType === 'game-'))
                    .map(role => ({
                        id: role.RoleID,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                    }));

                // Lưu thông tin vai trò vào cơ sở dữ liệu
                const roles = pingStaffData.Roles
                    .filter(role => (selectedValue === 'discordTicket' && role.ChannelType === 'discord-') || 
                                     (selectedValue === 'gameTicket' && role.ChannelType === 'game-'))
                    .map(role => ({
                        id: role.RoleID,
                        name: role.RoleName
                    }));

                if (selectedValue === 'discordTicket') {
                    data.roles.discord = roles;
                } else if (selectedValue === 'gameTicket') {
                    data.roles.game = roles;
                }
                await data.save();

                // Tạo kênh mới cho vé
                const channel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    topic: `Người Sử dụng vé: ${user.id}\nLý do tạo vé: ${why}`,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                        },
                        ...roleOverwrites // Thêm quyền từ vai trò
                    ]
                });

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`Vé từ ${user.displayName} 🎫`)
                    .setDescription(`Lý do mở đầu: ${why}\n\nThông tin bổ sung: ${info}\n\n⚠️ | hãy dùng lệnh /ping-staff list để xem vai trò hỗ trợ nào phù hợp với bạn `)
                    .setTimestamp();

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('closeTicket')
                            .setLabel(`🔐 Đóng vé`)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('ticketTranscript')
                            .setLabel('📜 Nhật ký trò chuyện')
                            .setStyle(ButtonStyle.Primary)
                    );

                await channel.send({ embeds: [embed], components: [button] });
                await interaction.reply({ content: `✨ Vé của bạn đã được mở trong ${channel}`, ephemeral: true });
            }
        }
    }
};
