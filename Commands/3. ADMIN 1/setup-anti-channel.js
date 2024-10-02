// const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
// const AutoMod = require('../../schemas/autoModSchema');
// const { checkAdministrator } = require(`../../permissionCheck`)

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('setup-anti-channel')
//         .setDescription('Thiết lập bot mới cho server của bạn')
//         .setDMPermission(false), // Không cho phép dùng trong DM

//     async execute(interaction, client) {
//         const start = Date.now(); // Lưu lại thời điểm bắt đầu để tính thời gian thiết lập

//         const hasPermission = await checkAdministrator(interaction);
//         if (!hasPermission) return;

//         // Gửi tin nhắn khởi tạo thiết lập
//         await interaction.reply({ content: 'Đang khởi tạo dữ liệu thiết lập nhanh!', ephemeral: true });

//         // Kiểm tra quyền của bot
//         if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
//             !interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
//             return interaction.editReply(':ca_reject: Bot không có quyền cần thiết để tiếp tục (Quản lý Vai trò, Quản lý Kênh).');
//         }
//         await interaction.followUp({ content: 'Đang kiểm tra quyền hạn...', ephemeral: true });

//         // Kiểm tra vị trí vai trò của bot
//         const botRole = interaction.guild.members.me.roles.highest;
//         if (!botRole) {
//             return interaction.editReply({ content: 'Không thể tìm thấy vai trò của bot để kiểm tra.', ephemeral: true });
//         }
//         await interaction.followUp({ content:'Đang kiểm tra vị trí vai trò...', ephemeral: true });

//         // Tạo mute role nếu chưa tồn tại
//         let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
//         if (!muteRole) {
//             muteRole = await interaction.guild.roles.create({
//                 name: 'Muted',
//                 color: '#818386',
//                 permissions: [],
//                 reason: 'Tạo role Muted cho hệ thống ngăn spam tin nhắn',
//             });

//             // Cập nhật các kênh để role "Muted" không có quyền gửi tin nhắn
//             interaction.guild.channels.cache.forEach(async (channel) => {
//                 await channel.permissionOverwrites.create(muteRole, {
//                     SendMessages: false,
//                     Speak: false,
//                     Connect: false,
//                 });
//             });
//         }
//         await interaction.followUp({ content: 'Đang tạo mute role...', ephemeral: true });

//         // Tạo kênh log nếu chưa tồn tại
//         let logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'log-spam-tin-nhắn');
//         if (!logChannel) {
//             logChannel = await interaction.guild.channels.create({
//                 name: 'log-spam-tin-nhắn',
//                 type: 0, // Loại là text channel
//                 reason: 'Tạo kênh log cho hệ thống ngăn spam tin nhắn',
//             });
//         }
//         await interaction.followUp({ content: 'Đang tạo kênh log...', ephemeral: true });

//         // Lưu thông tin vào cơ sở dữ liệu
//         let guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
//         if (!guildConfig) {
//             guildConfig = new AutoMod({
//                 guildId: interaction.guild.id,
//                 logChannelId: logChannel.id,
//                 heatSettings: {
//                     limit: 5,
//                     muteTime: 300,
//                     difference: 10,
//                 },
//             });
//         } else {
//             guildConfig.logChannelId = logChannel.id;
//         }

//         await guildConfig.save();
//         await interaction.followUp({ content: 'Đang lưu cài đặt...', ephemeral: true });

//         // Tính toán thời gian thực hiện
//         const end = Date.now();
//         const timeTaken = end - start;

//         // Phản hồi hoàn thành thiết lập
//         return interaction.followUp(`Setup Thành Công!\nQuá trình thiết lập kết thúc thành công trong ${timeTaken}ms. Bây giờ bạn có thể tiếp tục dùng lệnh \`/anti-spam-mess\` để cài đặt khác theo yêu cầu của riêng bạn.\nNếu bạn không dùng lệnh \`/anti-spam-mess\` để cài đặt theo yêu cầu cảu bạn thì mặc định sẽ là \`\`\`Limit: 5, muteTime: 300, difference: 10\`\`\``);
//     },
// };




const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const AutoMod = require('../../schemas/autoModSchema');
const { checkAdministrator } = require(`../../permissionCheck`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-anti-channel')
        .setDescription('Thiết lập bot mới cho server của bạn')
        .setDMPermission(false), // Không cho phép dùng trong DM

    async execute(interaction, client) {
        const start = Date.now(); // Lưu lại thời điểm bắt đầu để tính thời gian thiết lập

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        // Gửi tin nhắn khởi tạo thiết lập
        await interaction.reply({ content: 'Đang khởi tạo dữ liệu thiết lập nhanh!', ephemeral: true });

        // Kiểm tra quyền của bot
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
            !interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.editReply(':ca_reject: Bot không có quyền cần thiết để tiếp tục (Quản lý Vai trò, Quản lý Kênh).');
        }
        await interaction.followUp({ content: 'Đang kiểm tra quyền hạn...', ephemeral: true });

        // Kiểm tra vị trí vai trò của bot
        const botRole = interaction.guild.members.me.roles.highest;
        if (!botRole) {
            return interaction.editReply({ content: 'Không thể tìm thấy vai trò của bot để kiểm tra.', ephemeral: true });
        }
        await interaction.followUp({ content:'Đang kiểm tra vị trí vai trò...', ephemeral: true });

        // Tạo mute role nếu chưa tồn tại
        let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            muteRole = await interaction.guild.roles.create({
                name: 'Muted',
                color: '#818386',
                permissions: [],
                reason: 'Tạo role Muted cho hệ thống ngăn spam tin nhắn',
            });

            // Cập nhật các kênh để role "Muted" không có quyền gửi tin nhắn
            interaction.guild.channels.cache.forEach(async (channel) => {
                await channel.permissionOverwrites.create(muteRole, {
                    SendMessages: false,
                    Speak: false,
                    Connect: false,
                });
            });
        }
        await interaction.followUp({ content: 'Đang tạo mute role...', ephemeral: true });

        // Tạo kênh log nếu chưa tồn tại
        let logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'log-spam-tin-nhắn');
        if (!logChannel) {
            logChannel = await interaction.guild.channels.create({
                name: 'log-spam-tin-nhắn',
                type: 0, // Loại là text channel
                reason: 'Tạo kênh log cho hệ thống ngăn spam tin nhắn',
            });
        }
        await interaction.followUp({ content: 'Đang tạo kênh log...', ephemeral: true });

        // Lưu thông tin vào cơ sở dữ liệu
        let guildConfig = await AutoMod.findOne({ guildId: interaction.guild.id });
        if (!guildConfig) {
            guildConfig = new AutoMod({
                guildId: interaction.guild.id,
                logChannelId: logChannel.id,
                heatSettings: {
                    limit: 5,
                    muteTime: 300,
                    difference: 10,
                },
                antiLinkChannels: [logChannel.id], // Thêm kênh chống liên kết
            });
        } else {
            guildConfig.logChannelId = logChannel.id;
        }

        await guildConfig.save();
        await interaction.followUp({ content: 'Đang lưu cài đặt...', ephemeral: true });

        // Tính toán thời gian thực hiện
        const end = Date.now();
        const timeTaken = end - start;

        // Phản hồi hoàn thành thiết lập
        return interaction.followUp(`Setup Thành Công!\nQuá trình thiết lập kết thúc thành công trong ${timeTaken}ms. Bây giờ bạn có thể tiếp tục dùng lệnh \`/anti-spam-mess\` để cài đặt khác theo yêu cầu của riêng bạn.\nNếu bạn không dùng lệnh \`/anti-spam-mess\` để cài đặt theo yêu cầu cảu bạn thì mặc định sẽ là \`\`\`Limit: 5, muteTime: 300, difference: 10\`\`\``);
    },
};