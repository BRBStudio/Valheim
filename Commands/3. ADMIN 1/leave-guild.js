const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const channelSchema = require('../../schemas/channelSchema.js'); // Đảm bảo đường dẫn đúng

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave-guild')
        .setDMPermission(false)
        .setDescription('Thiết lập gửi thông báo khi thành viên rời server.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption(option =>
            option.setName('channelid')
                .setDescription('Chọn kênh bạn muốn nhận được thông báo thành viên rời máy chủ')
                .setRequired(false))
        .addBooleanOption(option => // Thêm lựa chọn boolean để xóa thiết lập
            option.setName('remove')
                .setDescription('Xóa thiết lập gửi thông báo')
                .setRequired(false)),

    async execute(interaction) {

        const removeSetting = interaction.options.getBoolean("remove");

        // if (removeSetting) {
        //     // Xóa thiết lập từ database nếu lựa chọn remove được chọn
        //     const guildId = interaction.guild.id;
        //     await channelSchema.findOneAndDelete({ Guild: guildId });
        //     return interaction.reply(`Thiết lập gửi thông báo khi thành viên rời máy chủ đã được xóa.`);
        // }

        if (removeSetting === true) {
            // Xóa thiết lập từ database nếu lựa chọn remove được chọn
            const guildId = interaction.guild.id;
            await channelSchema.findOneAndDelete({ Guild: guildId });
            return interaction.reply(`Thiết lập gửi thông báo khi thành viên rời máy chủ đã được xóa.`);
        } else if (removeSetting === false) {
            // Gửi thông báo rằng việc xóa thiết lập đã tạm dừng
            return interaction.reply(`Tạm dừng việc xóa thiết lập gửi thông báo khi thành viên rời máy chủ.`);
        }

        const channelId = interaction.options.getChannel("channelid").id;
        const guildId = interaction.guild.id;

        // Lưu thông tin vào database
        await channelSchema.findOneAndUpdate(
            { Guild: guildId },
            { Channel: channelId },
            { upsert: true, new: true }
        );

        await interaction.reply(`Thiết lập thành công kênh gửi thông báo khi thành viên rời máy chủ`);
    },
};

