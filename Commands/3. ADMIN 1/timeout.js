const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Hết thời gian chờ của người dùng')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Đặt thời gian chờ')
            .addUserOption(option => option
                .setName('user')
                .setDescription('Người dùng hết thời gian chờ')
                .setRequired(true))
            .addStringOption(option => option
                .setName('days')
                .setDescription('Thời gian chờ tính bằng ngày'))
            .addStringOption(option => option
                .setName('hours')
                .setDescription('Thời gian chờ tính bằng giờ'))
            .addStringOption(option => option
                .setName('minutes')
                .setDescription('Thời gian chờ tính bằng phút'))
            .addStringOption(option => option
                .setName('seconds')
                .setDescription('Thời gian chờ tính bằng giây'))
            .addStringOption(option => option
                .setName('reason')
                .setDescription('Lý do hết thời gian')))
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Xóa thời gian chờ')
            .addUserOption(option => option
                .setName('user')
                .setDescription('Người dùng xóa thời gian chờ khỏi')
                .setRequired(true)))
        .setDMPermission(false),
    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            const embed1 = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Lỗi')
                .setDescription('Bạn không có quyền sử dụng lệnh này! Quyền cần thiết: **Quản lý vai trò**.')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return await interaction.channel.send({ embeds: [embed1], ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {

            const user = interaction.options.getUser('user');
            const days = interaction.options.getString('days');
            const hours = interaction.options.getString('hours');
            const minutes = interaction.options.getString('minutes');
            const seconds = interaction.options.getString('seconds');
            const reason = interaction.options.getString('reason') || 'Không có lý do';

            const timeMember = await interaction.guild.members.fetch(user.id);

            if (!days && !hours && !minutes && !seconds) {
                const embed2 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('THIẾT LẬP TIMEOUT')
                    .setDescription('Bạn phải cung cấp ít nhất một tùy chọn thời gian để thiết lập timeout!')
                    .setTimestamp()
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed2], ephemeral: true });
            }

            if (!timeMember) {
                const embed3 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('TIMEOUT2')
                    .setDescription('Người dùng được đề cập không còn ở trong máy chủ.')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed3], ephemeral: true });
            }

            if (interaction.member.id === timeMember.id) {
                const embed5 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('TIMEOUT3')
                    .setDescription('Bạn không thể tự Timeout bản thân!')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed5], ephemeral: true });
            }

            if (!timeMember.kickable) {
                const embed4 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('KHÔNG THỂ THIẾT LẬP TIMEOUT')
                    .setDescription('Bạn không thể thiết lập timeout cho người dùng này vì họ có vai trò cao hơn/giống bạn.')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed4], ephemeral: true });
            }

            if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed6 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('KHÔNG THỂ TIMEOUT NGƯỜI DÙNG QTV')
                    .setDescription(`Bạn không thể thiết lập timeout cho người dùng có quyền quản trị viên`)
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed6], ephemeral: true });
            }

            let duration2 = (parseInt(days) || 0) * 86400 + (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
            if (duration2 === 0) {
                const embed7 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('THỜI GIAN TIMEOUT KHÔNG HỢP LỆ')
                    .setDescription('Bạn không thể chỉ định thời lượng 0 cho timeout!')
                    .setTimestamp()
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed7], ephemeral: true });
            }

            let duration = (parseInt(days) || 0) * 86400 + (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
            if (duration > 604800) {
                const embed8 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('THỜI GIAN TIMEOUT QUÁ DÀI')
                    .setDescription('❌ Bạn không thể chỉ định thời lượng nhiều hơn 1 tuần!')
                    .setTimestamp()
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed8], ephemeral: true });
            }

            let displayDays = Math.floor(duration / 86400);
            let displayHours = Math.floor((duration % 86400) / 3600);
            let displayMinutes = Math.floor((duration % 3600) / 60);
            let displaySeconds = duration % 60;

            let durationString = `${displayDays > 0 ? displayDays + ' ngày' : ''}${displayHours > 0 ? (displayDays > 0 ? ', ' : '') + displayHours + ' tiếng' : ''}${displayMinutes > 0 ? (displayDays > 0 || displayHours > 0 ? ', ' : '') + displayMinutes + ' phút' : ''}${displaySeconds > 0 ? (displayDays > 0 || displayHours > 0 || displayMinutes > 0 ? ', ' : '') + displaySeconds + ' giây' : ''}`;

            await timeMember.timeout(duration * 1000, reason);

            const embed9 = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('ĐÃ THIẾT LẬP TIMEOUT')
                .setDescription(`${user} đang bị timeout`)
                .addFields(
                    { name: 'Khoảng thời gian', value: durationString, inline: true},
                    { name: 'Lý do', value: reason, inline: true }
                )
                .setTimestamp()
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                
                await interaction.deferReply()
                await interaction.deleteReply()
            return await interaction.channel.send({ embeds: [embed9] });

        }

        if (subcommand === 'remove') {

            const user = interaction.options.getUser('user');

            const timeMember = await interaction.guild.members.fetch(user.id);

            if (!timeMember) {
                const embed10 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('TIMEOUT9')
                    .setDescription('Người dùng được đề cập không còn ở trong máy chủ.')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                    await interaction.deferReply()
                    await interaction.deleteReply()
                return await interaction.channel.send({ embeds: [embed10], ephemeral: true });
            }

            await timeMember.timeout(null);

            const embed11 = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('TIMEOUT0')
                .setDescription(`TIMEOUT cho ${user} đã tạm dừng.`)
                .setTimestamp()
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })

                await interaction.deferReply()
                    await interaction.deleteReply()
            return await interaction.channel.send({ embeds: [embed11] });
        }
    }
};