const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("slow-mode")
    .setDescription("Bật, tắt hoặc kiểm tra chế độ giới hạn thời gian nhắn tin")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .addSubcommand(subcommand => subcommand.setName("set").setDescription("Đặt chế độ giới hạn thời gian nhắn tin trong kênh").addIntegerOption(option => option.setName("duration").setDescription("Thời lượng của chế độ giới hạn thời gian nhắn tin được tính bằng giây").setRequired(true)).addChannelOption(option => option.setName("channel").setDescription("Kênh bạn muốn đặt chế độ giới hạn thời gian nhắn tin").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("off").setDescription("Tắt chế độ giới hạn thời gian nhắn tin trong kênh").addChannelOption(option => option.setName("channel").setDescription("Kênh bạn muốn tắt chế độ giới hạn thời gian nhắn tin").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("check").setDescription("Kiểm tra trạng thái giới hạn thời gian nhắn tin trong kênh").addChannelOption(option => option.setName("channel").setDescription("Kênh bạn muốn kiểm tra chế độ giới hạn thời gian nhắn tin").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("check-all").setDescription("Kiểm tra trạng thái giới hạn thời gian nhắn tin trong tất cả các kênh")),

    async execute(interaction, client) {
    
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        if (interaction.options.getSubcommand() === "set") {
            const duration = interaction.options.getInteger("duration");

            if (duration < 1 || duration > 21600) {
                return await interaction.reply({ content: "Thời lượng ở chế độ giới hạn thời gian nhắn tin phải nằm trong khoảng **1** đến **21600** giây.", ephemeral: true });
            }

            try {
                await channel.setRateLimitPerUser(duration);

                const slowmodeEmbed = new EmbedBuilder()
                .setColor(`Green`)
                .setAuthor({ name: `LỆNH SLOW-MODE | Được phát triển bởi Valheim Survival` })
                .setTitle(`${client.user.username} giới hạn thời gian nhắn tin trong kênh ⤵`)
                .setDescription(`Chế độ giới hạn thời gian nhắn tin được đặt thành ${duration} giây trong kênh ${channel.name}.`)
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
                .setFooter({ text: `Chế độ giới hạn thời gian nhắn tin đã được kích hoạt` });

                await interaction.reply({ embeds: [slowmodeEmbed], ephemeral: true});
            } catch (error) {
                client.logs.error("Không thể đặt chế độ giới hạn thời gian nhắn tin:", error);
                await interaction.reply({ content: "Không thể đặt chế độ giới hạn thời gian nhắn tin trong kênh này. Điều này có thể là do thiếu quyền ***QUẢN LÝ KÊNH***. Vui lòng thử lại.", ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === "off") {
            try {
                await channel.setRateLimitPerUser(0);

                const slowmodeEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setAuthor({ name: `LỆNH SLOW-MODE | Được phát triển bởi Valheim Survival` })
                .setTitle(`${client.user.username} giới hạn thời gian nhắn tin trong kênh ⤵`)
                .setDescription(`Chế độ giới hạn thời gian nhắn tin bị vô hiệu hóa trong ${channel.name}.`)
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
                .setFooter({ text: `Đã tắt chế độ giới hạn thời gian nhắn tin.` });

                await interaction.reply({ embeds: [slowmodeEmbed], ephemeral: true });
            } catch (error) {
                client.logs.error("Không thể tắt chế độ giới hạn thời gian nhắn tin:", error);
                await interaction.reply({ content: "Không tắt được chế độ giới hạn thời gian nhắn tin trong kênh này. Điều này có thể là do thiếu quyền ***QUẢN LÝ KÊNH***. Vui lòng thử lại.", ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === "check") {
            try {
                await channel.fetch();

                const slowmode = channel.rateLimitPerUser;

                if (slowmode === 0) {
                    await interaction.reply({ content: `Chế độ giới hạn thời gian nhắn tin không được bật trong ${channel.name}.`, ephemeral: true });
                } else {

                    const slowmodeCheckEmbed = new EmbedBuilder()
                    .setColor(`Green`)
                    .setAuthor({ name: `LỆNH SLOW-MODE | Được phát triển bởi Valheim Survival` })
                    .setTitle(`${client.user.username} giới hạn thời gian nhắn tin trong kênh ⤵`)
                    .setDescription(`Chế độ giới hạn thời gian nhắn tin được đặt thành ${slowmode} giây trong kênh ${channel.name}.`)
                    .setThumbnail(client.user.avatarURL())
                    .setTimestamp()
                    .setFooter({ text: `Đã bật chế độ giới hạn thời gian nhắn tin.` });

                    await interaction.reply({ embeds: [slowmodeCheckEmbed], ephemeral: true });
                }
            } catch (error) {
                client.logs.error("Không thể kiểm tra chế độ giới hạn thời gian nhắn tin:", error);
                await interaction.reply({ content: "Không kiểm tra được trạng thái chế độ giới hạn thời gian nhắn tin trong kênh này. Điều này có thể là do thiếu quyền ***QUẢN LÝ KÊNH***. Vui lòng thử lại.", ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === "check-all") {
            try {
                const channels = interaction.guild.channels.cache.filter(c => (c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice) && c.rateLimitPerUser > 0);
                const slowmodeFields = [];

                channels.forEach(channel => {
                    const slowmode = channel.rateLimitPerUser;
                    slowmodeFields.push({
                        name: `Kênh ${channel.name}`,
                        value: `${slowmode} giây`,
                        inline: false
                    });
                });

        if (slowmodeFields.length === 0) {
            await interaction.reply({ content: "Không có kênh nào cài đặt chế độ chậm.", ephemeral: true });
        } else {
                const totalPages = Math.ceil(slowmodeFields.length / 25);
                let currentPage = 0;

                const generateEmbed = (page) => {
                    const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setAuthor({ name: 'LỆNH SLOW-MODE | Được phát triển bởi Valheim Survival' })
                        .setTitle(`Đây là danh sách các kênh có chế độ giới hạn thời gian nhắn tin được ${client.user.username} cung cấp ⤵`)
                        .addFields(slowmodeFields.slice(page * 25, (page + 1) * 25))
                        .setThumbnail(client.user.avatarURL())
                        .setTimestamp()
                        .setFooter({ text: `Trang ${page + 1} / ${totalPages}` });

                    return embed;
                };

                const generateRow = (page) => {
                    return new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('Pagetruoc')
                                .setLabel('Trang trước')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === 0),
                            new ButtonBuilder()
                                .setCustomId('Pagetieptheo')
                                .setLabel('Trang tiếp theo')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === totalPages - 1)
                        );
                };

                const message = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [generateRow(currentPage)], ephemeral: true });

                const collector = message.createMessageComponentCollector();

                collector.on('collect', async (i) => {
                    if (i.customId === 'Pagetruoc' && currentPage > 0) {
                        currentPage--;
                    } else if (i.customId === 'Pagetieptheo' && currentPage < totalPages - 1) {
                        currentPage++;
                    }

                    await i.update({ embeds: [generateEmbed(currentPage)], components: [generateRow(currentPage)] });
                });
            

                    collector.on('end', async () => {
                        await message.edit({ components: [] });
                    });
                }
            } catch (error) {
                console.error("Không thể kiểm tra chế độ giới hạn thời gian nhắn tin trong tất cả các kênh:", error);
                await interaction.reply({ content: "Không kiểm tra được trạng thái chế độ giới hạn thời gian nhắn tin trong tất cả các kênh. Vui lòng thử lại.", ephemeral: true });
            }
        }
    },
};
