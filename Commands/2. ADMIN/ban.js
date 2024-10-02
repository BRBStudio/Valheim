const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban(cấm) 1 người dùng")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("người dùng sẽ bị ban vĩnh viễn.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("lý do ban thành viên")
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option.setName('picture')
                .setDescription('Thêm hình ảnh liên quan thằng đó vi phạm luật')
                .setRequired(false)),

    async execute(interaction, client) {
        const { options, channel } = interaction;

        const user = options.getUser("target");
        const picture = options.getAttachment('picture');
        const reason = options.getString("reason") || "Không có lý do";
        const responses = [
            `Máy chủ này là nơi tôn nghiêm, bạn đã vi phạm luật đã được nêu ra trước đó.`,
            `Freya bị trục xuất khỏi ánh sáng, bị ràng buộc bởi bóng tối,
            Trong cô đơn, không tìm thấy niềm an ủi.
            Bạn cũng giống vậy, sau này hãy hành xử như 1 chiến binh.`,
            `Bạn nên nhớ luật server được đặt ra, bất kì ai cũng phải chấp hành kể cả Admin.`,
            `Rời khỏi server, một mình,
            Trong bóng tối ngự trị, nơi sự im lặng ngự trị,
            Tiếng vang của sự mất mát, ở vùng đồng bằng trống trải.`,
            `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ là nơi hội tụ các chiến binh valheim ngự trị.
            Hãy trở thành ánh sáng dẫn dắt mọi ngươi...`,
        ];

        const randomMessage = responses[Math.floor(Math.random() * responses.length)];

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`bạn không thể thực hiện hành động với ${user.displayName} vì họ có vai trò cao hơn.`)
            .setColor(0xc72c3b);

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        const embed1 = new EmbedBuilder()
            .setColor('#39c7bf')
            .setTitle('🔨 LÝ DO ĐÁNG BỊ BAN')
            .setDescription(`**⛔ <@${interaction.user.id}>** yêu cầu cấm **${user}**.\n\n⛔ Lý Do: ${reason}\n\n*⛔ Hành động này đã được **Administration** xác nhận.* \n\n⛔ Vui lòng xác nhận hoặc hủy hành động này bên dưới ⤵`)
            .setThumbnail(user.displayAvatarURL())
            .setThumbnail(`https://i.imgur.com/LpRsN3t.gif`)
            .addFields(
                { name: "ID người bị ban", value: user.id, inline: true },
                { name: "BQT máy chủ", value: interaction.user.displayName, inline: true }
            )
            .setFooter({ text: `${randomMessage}`, iconURL: interaction.client.user.displayAvatarURL() });

        if (picture) {
            embed1.setImage(picture.url);
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_ban')
                    .setLabel('Đồng Ý')
                    .setEmoji('✔️')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_ban')
                    .setLabel('Từ Chối')
                    .setEmoji('✖️')
                    .setStyle(ButtonStyle.Secondary),
            );

        await interaction.reply({
            embeds: [embed1],
            components: [row]
        });

        const filter = (i) => {
            return ['confirm_ban', 'cancel_ban'].includes(i.customId) && i.user.id === interaction.user.id;
        };

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_ban') {
                await handleConfirmBan(i, interaction, user, reason, picture);
            } else if (i.customId === 'cancel_ban') {
                await handleCancelBan(i, interaction);
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Bạn đã không thực hiện lệnh ban lên người này.', embeds: [], components: [], ephemeral: true });
            }
        });
    }
};

async function handleConfirmBan(i, interaction, user, reason, picture) {
    try {
        const guildOwner = await interaction.guild.fetchOwner();
        const chusohuu = guildOwner.user.displayName;
        const responses = [
            `Máy chủ này là nơi tôn nghiêm, bạn đã vi phạm luật đã được nêu ra trước đó.`,
            `Freya bị trục xuất khỏi ánh sáng, bị ràng buộc bởi bóng tối,
            Trong cô đơn, không tìm thấy niềm an ủi.
            Bạn cũng giống vậy, sau này hãy hành xử như 1 chiến binh.`,
            `Bạn nên nhớ luật server được đặt ra, bất kì ai cũng phải chấp hành kể cả Admin.`,
            `Rời khỏi server, một mình,
            Trong bóng tối ngự trị, nơi sự im lặng ngự trị,
            Tiếng vang của sự mất mát, ở vùng đồng bằng trống trải.`,
            `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ là nơi hội tụ các chiến binh valheim ngự trị.
            Hãy trở thành ánh sáng dẫn dắt mọi ngươi...`,
        ];

        const randomMessage = responses[Math.floor(Math.random() * responses.length)];

        const dmEmbed = new EmbedBuilder()
            .setColor(`Red`)
            .setAuthor({ name: `Đây là tin nhắn của ${interaction.client.user.username}` })
            .setTitle(`📜 THÔNG TIN ĐẦY ĐỦ VỀ BAN TV CỦA BẠN ⤵`)
            .addFields({ name: 'Tên máy chủ bị ban(cấm)', value: `> ***${interaction.guild.name}***`, inline: false })
            .addFields({ name: 'Chủ sở hữu máy chủ', value: `> ***${chusohuu}***`, inline: false })
            .addFields({ name: 'Người ban(cấm) bạn khỏi máy chủ', value: `> ***${interaction.user.displayName}***`, inline: false })
            .addFields({ name: 'Lý do', value: `> ${reason}`, inline: false })
            .addFields({ name: 'Hình ảnh bằng chứng (nếu có) ⤵', value: `> 👇 Xem bên dưới 👇`, inline: false })
            .setFooter({ text: `${randomMessage}` })
            .setThumbnail(interaction.client.user.avatarURL());

        if (picture) {
            dmEmbed.setImage(picture.url);
        }

        await user.send({ embeds: [dmEmbed] }).catch((err) => { return interaction.client.logs.error('[BAN] Gửi tin nhắn trực tiếp cho người dùng không thành công.') });

        const hinhanh = `https://i.imgur.com/LpRsN3t.gif`;

        const embed = new EmbedBuilder()
            .setTitle('CẤM THÀNH CÔNG!!!')
            .setDescription(`${user} đã bị cấm khỏi máy chủ ${i.guild.name}`)
            .addFields({ name: 'Lý Do', value: `${reason}` })
            .setColor(0x5fb041)
            .setThumbnail(hinhanh)
            .setFooter({ text: `${randomMessage}`, iconURL: interaction.client.user.displayAvatarURL() });

        if (picture) {
            embed.setImage(picture.url);
        }

        await i.guild.members.ban(user, {
            reason: `Bị cấm bởi ${i.user.displayName}: ${reason}`,
        });
        await i.reply({ content: '', embeds: [embed] });
    } catch (error) {
        console.error(error);

        const responses = [
            `Máy chủ này là nơi tôn nghiêm, bạn đã vi phạm luật đã được nêu ra trước đó.`,
            `Freya bị trục xuất khỏi ánh sáng, bị ràng buộc bởi bóng tối,
            Trong cô đơn, không tìm thấy niềm an ủi.
            Bạn cũng giống vậy, sau này hãy hành xử như 1 chiến binh.`,
            `Bạn nên nhớ luật server được đặt ra, bất kì ai cũng phải chấp hành kể cả Admin.`,
            `Rời khỏi server, một mình,
            Trong bóng tối ngự trị, nơi sự im lặng ngự trị,
            Tiếng vang của sự mất mát, ở vùng đồng bằng trống trải.`,
            `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ là nơi hội tụ các chiến binh valheim ngự trị.
            Hãy trở thành ánh sáng dẫn dắt mọi ngươi...`,
        ];
    
        const randomMessage = responses[Math.floor(Math.random() * responses.length)];

        const errorEmbed = new EmbedBuilder()
            .setColor('#39c7bf')
            .setTitle('CẤM THẤT BẠI')
            .setDescription(`Cấm không thành công **${user.displayName}** từ máy chủ ${i.guild.name}.\n\n\n${randomMessage}`)
            .setTimestamp()
            .setFooter({
                text: `Đã xảy ra lỗi`,
                iconUrl: i.client.user.displayAvatarURL(),
            });
        await i.reply({ content: '', embeds: [errorEmbed] });
    }
}

async function handleCancelBan(i, interaction) {

    const responses = [
        `Máy chủ này là nơi tôn nghiêm, bạn đã vi phạm luật đã được nêu ra trước đó.`,
        `Freya bị trục xuất khỏi ánh sáng, bị ràng buộc bởi bóng tối, Trong cô đơn, không tìm thấy niềm an ủi.Bạn cũng giống vậy, sau này hãy hành xử như 1 chiến binh.`,
        `Bạn nên nhớ luật server được đặt ra, bất kì ai cũng phải chấp hành kể cả Admin.`,
        `Rời khỏi server, một mình, Trong bóng tối ngự trị, nơi sự im lặng ngự trị, Tiếng vang của sự mất mát, ở vùng đồng bằng trống trải.`,
        `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ là nơi hội tụ các chiến binh valheim ngự trị. Hãy trở thành ánh sáng dẫn dắt mọi ngươi...`,
        
    ];

    const randomMessage = responses[Math.floor(Math.random() * responses.length)];

    const cancelEmbed = new EmbedBuilder()
        .setColor('#39c7bf')
        .setTitle(`LỆNH CẤM ĐÃ BỊ HỦY BỎ`)
        .setDescription(`May cho bạn là ***${i.user.displayName}*** trong máy chủ ***${i.guild.name}*** đang còn tình người nha.\n\n\n${randomMessage}`)
        .setTimestamp()
        .setFooter({ text: `Đã nhận lòng tốt của ***${i.user.displayName}***`, iconURL: i.user.displayAvatarURL() });

    await i.update({ embeds: [cancelEmbed], components: [] });
}