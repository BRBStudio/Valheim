const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');

    module.exports = {
        data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick 1 người dùng")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("người dùng sẽ bị đá.")
                .setRequired(true)
        )
        .addStringOption(option =>                                                    /////  thêm chỗ viết nơi chỉ định kênh cần đăng
            option.setName("reason")
                .setDescription("lý do đá thành viên")
                .setRequired(true)
                .setMinLength(1)                  //// nhập 1 kí tự 
                .setMaxLength(5000)               //// cho đến 5000 kí tự
        )
        .addAttachmentOption(option =>
            option.setName('picture')
                .setDescription('Thêm hình ảnh liên quan thằng đó vi phạm luật')
                .setRequired(false)),
    
        async execute(interaction, client){
            const { options, channel } = interaction;

            const user = options.getUser("target");
            const picture = options.getAttachment('picture');
            const reason = options.getString("reason") || "Không có lý do";
            const responses = [
                `Máy chủ này là nơi tôn nghiêm, bạn đã vi phạm luật đã được nêu ra trước đó.`,

                `Freya bị trục xuất khỏi ánh sáng, bị ràng buộc bởi bóng tối, Trong cô đơn, không tìm thấy niềm an ủi. Bạn cũng giống vậy, sau này hãy hành xử như 1 chiến binh.`,

                `Bạn nên nhớ luật server được đặt ra, bất kì ai cũng phải chấp hành kể cả Admin.`,

                `Bị cấm khỏi server, một mình, Trong bóng tối ngự trị, nơi sự im lặng ngự trị, Tiếng vang của sự mất mát, ở vùng đồng bằng trống trải.`,
                                
                `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ là nơi hội tụ các chiến binh valheim ngự trị.Hãy trở thành ánh sáng dẫn dắt mọi ngươi...`,
                
            ]

            // Tìm nạp chủ bang hội
            const guildOwner = await interaction.guild.fetchOwner();
            const chusohuu = guildOwner.user.displayName;

            const randomMessage = responses[ Math.floor(Math.random() * responses.length)];

            const member = await interaction.guild.members.fetch(user.id);

            const errEmbed = new EmbedBuilder()
                .setDescription(`bạn không thể thực hiện hành động với ${user.displayName} vì họ có vai trò cao hơn.\n\n\n ${randomMessage}`)
                .setColor(0xc72c3b)

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {    
            await member.kick({ reason });

            const hinhanh = `https://media1.tenor.com/m/9PPzm9JjGpsAAAAC/mochi-peach.gif`

            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.displayName} Đã đá thành công ${user} với lý do: ${reason}`)
                .setThumbnail(hinhanh)
                .addFields({ name: 'Hình ảnh bằng chứng (nếu có) ⤵', value: `> 👇 Xem bên dưới 👇` })
                .setFooter({ text: `${randomMessage}`})

                if (picture) {
                    embed.setImage(picture.url);
                }

            const dmEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setAuthor({ name: `Đây là tin nhắn của ${client.user.username}`})
                .setTitle(`THÔNG TIN ĐẦY ĐỦ VỀ VIỆC KICK TV ⤵`)
                .addFields({ name: 'Tên máy chủ bị đá', value: `> ***${interaction.guild.name}***`, inline: false })
                .addFields({ name: 'Chủ sở hữu máy chủ', value: `> ***${chusohuu}***`, inline: false })
                .addFields({ name: 'Người đá bạn khỏi máy chủ', value: `> ***${interaction.user.displayName}***`, inline: false })
                .addFields({ name: 'Lý do', value: `> ${reason}`, inline: false })
                .addFields({ name: 'Hình ảnh bằng chứng (nếu có) ⤵', value: `> 👇 Xem bên dưới 👇` })
                .setFooter({ text: `${randomMessage}`})
                .setThumbnail(client.user.avatarURL())

                if (picture) {
                    dmEmbed.setImage(picture.url);
                }

            await user.send({ embeds: [dmEmbed] }).catch((err) => { return client.logs.error('[KICK] Gửi tin nhắn trực tiếp cho người dùng không thành công.') }); // gửi tin nhắn DM cho người dùng

            await interaction.reply({
                embeds: [embed],
            }); // gửi tin nhắn thông báo cho người dùng lệnh
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: `Không thể đá thành viên này! Hãy kiểm tra vị trí vai trò của tôi và thử lại.`, ephemeral: true });
        }    
    }
}