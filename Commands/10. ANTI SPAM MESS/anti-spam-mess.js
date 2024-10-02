const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const AutoMod = require('../../schemas/autoModSchema');

// Hàm để chuyển đổi thời gian từ định dạng chuỗi thành giây
const parseTime = (timeStr) => {
    const timeFormat = timeStr.toLowerCase();
    const value = parseInt(timeFormat.slice(0, -1));
    const unit = timeFormat.slice(-1);

    if (isNaN(value)) return NaN;

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 60 * 60 * 24;
        default: return NaN;
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anti-spam-mess")
        .setDescription("Cài đặt hệ thống ngăn spam tin nhắn cho server")
        .setDMPermission(false) // Không cho phép dùng trong DM
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addIntegerOption(option => 
            option.setName("limit")
                .setDescription("Giới hạn tin nhắn spam")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("mute_time")
                .setDescription("Thời gian mute (ví dụ: 10s, 5m, 1h)")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("difference")
                .setDescription("Khoảng thời gian giữa các tin nhắn (ví dụ: 2s, 1m)")
                .setRequired(true)
        ),
    
    async execute(interaction, client) {
        if (!interaction.guild) {
            return;
        }

        // Kiểm tra quyền Administrator
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply(`**${interaction.user.displayName}** cần quyền **\`Administrator\`** để sử dụng lệnh.`);
        }

        // Lấy cài đặt từ MongoDB
        let guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
        if (!guildConfig) {
            guildConfig = new AutoMod({ guildId: interaction.guild.id });
        }

        // Nếu chưa thiết lập kênh log
        if (!guildConfig.logChannelId) {
            return interaction.reply(`**${interaction.user.displayName}** cần sử dụng lệnh **\`setup-anti-channel\`** trước khi setup **\`Hệ thống ngăn spam tin nhắn tự động\`**.`);
        }

        // Lấy các tham số từ lệnh
        const limit = interaction.options.getInteger("limit");
        const muteTimeInput = interaction.options.getString("mute_time");
        const differenceInput = interaction.options.getString("difference");

        const muteTime = parseTime(muteTimeInput); // Chuyển đổi muteTime từ chuỗi thành giây
        const difference = parseTime(differenceInput); // Chuyển đổi difference từ chuỗi thành giây

        if (isNaN(limit) || isNaN(muteTime) || isNaN(difference)) {
            return interaction.reply(`**${interaction.user.displayName}** vui lòng cung cấp đúng tham số.\n\nVí dụ:\n\`limit: 10\`                  (tức là tối đa 10 tin nhắn sẽ bị mute)\n\`mute_time: 10s\`      (tức là thời gian mute là 10 giây)\n\`mute_time: 10m\`      (tức là thời gian mute là 10 phút)\n\`mute_time: 10h\`      (tức là thời gian mute là 10 tiếng)\n\`mute_time: 10d\`         (tức là thời gian mute là 10 ngày)\n\`difference: 10s\`         (tức là khoảng cách giữa các tin nhắn là 10 giây sẽ coi là spawm)\n\`difference: 10m\`      (tức là khoảng cách giữa các tin nhắn là 10 phút sẽ coi là spawm).`);
        }

        // Cập nhật cài đặt Heat
        guildConfig.heatSettings.limit = limit;
        guildConfig.heatSettings.muteTime = muteTime;
        guildConfig.heatSettings.difference = difference;
        await guildConfig.save();

        // Tạo và gửi thông báo thành công
        const successEmbed = new EmbedBuilder()
            .setTitle('CÀI ĐẶT HỆ THỐNG CHỐNG SPAM TIN NHẮN ĐÃ ĐƯỢC CẬP NHẬT')
            .setDescription(
                `**Số lượng tin nhắn tối đa sẽ bị mute**: ${limit} hành động\n` +
                `**Thời gian mute**: ${muteTimeInput} [${muteTime} giây]\n` +
                `**khoảng cách giữa các tin nhắn sẽ coi là spam**: ${differenceInput} [${difference}s/hành động]\n` +
                `**Hình phạt**: Mute`
            )
            .setColor(`Gold`);

        return interaction.reply({ embeds: [successEmbed] });
    }
};