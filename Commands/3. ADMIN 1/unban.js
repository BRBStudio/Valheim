const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('🚫 | Bỏ cấm người dùng khỏi máy chủ bất hòa.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .addStringOption(option => 
        option.setName("userid")
        .setDescription("ID discord của người dùng bạn muốn bỏ cấm.")
        .setRequired(true)
        ),

    async execute(interaction, client) {
        const { channel, options } = interaction;

        const userId = options.getString("userid");
        const responses = [
            `Máy chủ này là nơi tôn nghiêm, hãy chấp hành đúng luật đã được nêu ra trước đó.`,
            
            `Freya bị trục xuất khỏi ánh sáng, bị ràng buộc bởi bóng tối,
             Trong cô đơn, không tìm thấy niềm an ủi.
             Bạn cũng giống vậy, sau này hãy hành xử như 1 chiến binh.`,
             
            `Bạn nên nhớ luật server được đặt ra, bất kì ai cũng phải chấp hành kể cả Admin.`,
             
            `Bạn đã được gỡ bỏ lệnh ban  hoặc cấm , bạn không còn một mình nữa,
             Trong bóng tối ngự trị, nơi sự im lặng ngự trị,
             Tiếng vang của sự mất mát, ở vùng đồng bằng trống trải.`,
             
            `★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★ là nơi hội tụ các chiến binh valheim ngự trị.
            Hãy trở thành ánh sáng dẫn dắt mọi ngươi...`,
        ]
        

        // Tìm nạp chủ bang hội
        const guildOwner = await interaction.guild.fetchOwner();
        const chusohuu = guildOwner.user.displayName;

        const randomMessage = responses[ Math.floor(Math.random() * responses.length)];

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setDescription(`Đã bỏ cấm id thành công ${userId} từ guild.\n\n\n ${randomMessage}`)
                .setColor(0x5fb041)
                .setTimestamp();

            const dmEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setAuthor({ name: `Đây là tin nhắn của ${client.user.username}`})
                .setTitle(`THÔNG TIN ĐẦY ĐỦ VỀ BỎ BAN TV ⤵`)
                .addFields({ name: 'Tên máy chủ đã được bỏ ban(cấm)', value: `> ***${interaction.guild.name}***`, inline: false })
                .addFields({ name: 'Chủ sở hữu máy chủ', value: `> ***${chusohuu}***`, inline: false })
                .addFields({ name: 'Người bỏ ban(cấm) bạn khỏi máy chủ', value: `> ***${interaction.user.username}***`, inline: false })
                .addFields({ name: 'Lý do', value: `> ${reason}\n\n\n${randomMessage}`, inline: false })
                .setFooter({ text: `Thông tin bỏ cấm(ban)`})
                .setTimestamp()
                .setThumbnail(client.user.avatarURL())

            await user.send({ embeds: [dmEmbed] }).catch((err) => { return client.logs.error('[UNBAN] Gửi tin nhắn trực tiếp cho người dùng không thành công.') }); // gửi tin nhắn DM cho người dùng

            await interaction.reply({
                embeds: [embed],
            });
        } catch(err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`vui lòng cung cấp ID thành viên hợp lệ.\n\n\n ${randomMessage}`)
                .setColor(0xc72c3b);

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}