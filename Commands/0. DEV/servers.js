const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { createServerDetailsEmbed, createMissingPermissionsEmbed } = require(`../../Embeds/embedsCreate`);
const sourcebin = require("sourcebin");

const User = require('../../schemas/premiumUserSchema');
const PremiumCode = require('../../schemas/premiumSchema');

// Thêm danh sách các ID người dùng được phép sử dụng lệnh
const allowedUsers = ["940104526285910046", "1215380543815024700"];

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("servers")
        .setDescription("Danh sách máy chủ"),
    async execute(interaction, client) {

        // Kiểm tra xem người dùng có được phép sử dụng lệnh hay không
        if (!allowedUsers.includes(interaction.user.id)) {
            return interaction.reply({ content: "Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
        }

        // Thông báo rằng bot đang xử lý lệnh
    await interaction.deferReply(); // Thêm dòng này
        
        // Lấy danh sách máy chủ
        try {
            const serverDetails = [];
            const missingPermissionsGuilds = [];

            const getVietnameseDate = (date) => {
                const options = {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'Asia/Ho_Chi_Minh'
                };
                return new Intl.DateTimeFormat('vi-VN', options).format(date);
            };

            await Promise.all(
                client.guilds.cache.map(async (guild) => {
                    try {
                        // Kiểm tra xem bot có yêu cầu quyền trong bang hội không
                        const botMember = guild.members.cache.get(client.user.id);
                        const requiredPermissions = [PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.ViewChannel];
                        const missingPermissions = requiredPermissions.filter(perm => !botMember.permissions.has(perm));
                        
                        if (missingPermissions.length > 0) {
                            missingPermissionsGuilds.push({
                                id: guild.id,
                                name: guild.name,
                                missingPermissions: missingPermissions.map(perm => Object.keys(PermissionsBitField).find(key => PermissionsBitField[key] === perm))
                            });
                            return;
                        }

                        let invites = await guild.invites.fetch();
                        let invite = invites.find((invite) => !invite.temporary);

                        // If no non-temporary invite found, create a new one
                        if (!invite) {
                            let channelId = guild.systemChannelId;
                            if (!channelId || !guild.channels.cache.has(channelId)) {
                                // Fall back to finding the first available text channel
                                const textChannels = guild.channels.cache.filter(ch => ch.isTextBased());
                                if (textChannels.size > 0) {
                                    channelId = textChannels.first().id;
                                } else {
                                    throw new Error('No available channel to create an invite.');
                                }
                            }
                            invite = await guild.invites.create(channelId, { maxAge: 0, maxUses: 0 });
                        }

                        const owner = await guild.members.fetch(guild.ownerId);

                        serverDetails.push({
                            id: guild.id,
                            name: guild.name,
                            memberCount: guild.memberCount,
                            createdAt: getVietnameseDate(guild.createdAt),
                            invite: invite ? invite.url : "Không có lời mời nào",
                            owner: owner ? owner.user.tag : "Chủ sở hữu không xác định",
                        });
                    } catch (error) {
                        console.error(`Lỗi khi tìm nạp thông tin chi tiết về bang hội ${guild.id}:`, error);
                    }
                })
            );

            serverDetails.sort((a, b) => b.memberCount - a.memberCount);

            const biggestServer = serverDetails[0];

            const embed = createServerDetailsEmbed(biggestServer); // Sử dụng hàm từ embedsCreate.js

            // Nếu có máy chủ thiếu quyền hạn, tạo Embed cho chúng
            let missingPermissionsEmbed;
            if (missingPermissionsGuilds.length > 0) {
                missingPermissionsEmbed = createMissingPermissionsEmbed(missingPermissionsGuilds); // Sử dụng hàm từ embedsCreate.js
            }

            const formattedList = serverDetails
                .map(
                    (server,index) => `
        Tên máy chủ ${index + 1}:     ${server.name}
        ID Máy chủ:      ${server.id}
        Số lượng thành viên:    ${server.memberCount}
        Ngày thành lập:   ${server.createdAt}
        Nhấp link bên dưới để vào máy chủ:          ${server.invite}
        Người sở hữu:           ${server.owner}
        ━━━━━━━━━━━━━━━`
                )
                .join("\n");

            // Tạo sourcebin chứa chi tiết máy chủ
            sourcebin
                .create({
                    title: "Chi tiết máy chủ của bạn",
                    description: "Danh sách các máy chủ",
                    files: [
                    {
                        name: "Được tạo bởi BRB Studio", // Tên của file (tùy chọn)
                        content: formattedList, // Nội dung file
                        language: "CoffeeScript" // Ngôn ngữ của file (text, javascript, etc.)
                    }
                    ]
                })
                .then((src) => {
                    const replyContent = `Tất cả chi tiết máy chủ - ${src.url}`;

                    interaction.editReply({
                    content: replyContent,
                    embeds: [embed, missingPermissionsEmbed].filter(Boolean),
                    ephemeral: false,
                    });
                })
                .catch((error) => {
                    console.error("Lỗi tạo sourcebin:", error);
                    interaction.editReply({ content: "Đã xảy ra lỗi khi tạo chi tiết máy chủ.", ephemeral: true });
                });

        } catch (error) {
            console.error("Error fetching server details:", error);
            interaction.editReply({ content: "Đã xảy ra lỗi khi tìm nạp thông tin chi tiết về máy chủ.", ephemeral: true });
        }
    },
};





// const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
// const { createServerDetailsEmbed, createMissingPermissionsEmbed } = require(`../../Embeds/embedsCreate`);
// const sourcebin = require("sourcebin_js");

// const User = require('../../schemas/premiumUserSchema');
// const PremiumCode = require('../../schemas/premiumSchema');

// // Thêm danh sách các ID người dùng được phép sử dụng lệnh
// const allowedUsers = ["940104526285910046", "1215380543815024700"]; // Thay thế ID_USER1, ID_USER2 bằng các ID thực tế

// module.exports = {
//     developer: true,
//     data: new SlashCommandBuilder()
//         .setName("servers")
//         .setDescription("Danh sách máy chủ"),
//     async execute(interaction, client) {

//         // Kiểm tra xem người dùng có được phép sử dụng lệnh hay không
//         if (!allowedUsers.includes(interaction.user.id)) {
//             return interaction.reply({ content: "Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
//         }
        
//         // Lấy danh sách máy chủ
//         try {
//             const serverDetails = [];
//             const missingPermissionsGuilds = [];

//             const getVietnameseDate = (date) => {
//                 const options = {
//                     weekday: 'long',
//                     day: '2-digit',
//                     month: '2-digit',
//                     year: 'numeric',
//                     timeZone: 'Asia/Ho_Chi_Minh'
//                 };
//                 return new Intl.DateTimeFormat('vi-VN', options).format(date);
//             };

//             await Promise.all(
//                 client.guilds.cache.map(async (guild) => {
//                     try {
//                         // Kiểm tra xem bot có yêu cầu quyền trong bang hội không
//                         const botMember = guild.members.cache.get(client.user.id);
//                         const requiredPermissions = [PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.ViewChannel];
//                         const missingPermissions = requiredPermissions.filter(perm => !botMember.permissions.has(perm));
                        
//                         if (missingPermissions.length > 0) {
//                             missingPermissionsGuilds.push({
//                                 id: guild.id,
//                                 name: guild.name,
//                                 missingPermissions: missingPermissions.map(perm => Object.keys(PermissionsBitField).find(key => PermissionsBitField[key] === perm))
//                             });
//                             return;
//                         }

//                         let invites = await guild.invites.fetch();
//                         let invite = invites.find((invite) => !invite.temporary);

//                         // If no non-temporary invite found, create a new one
//                         if (!invite) {
//                             let channelId = guild.systemChannelId;
//                             if (!channelId || !guild.channels.cache.has(channelId)) {
//                                 // Fall back to finding the first available text channel
//                                 const textChannels = guild.channels.cache.filter(ch => ch.isTextBased());
//                                 if (textChannels.size > 0) {
//                                     channelId = textChannels.first().id;
//                                 } else {
//                                     throw new Error('No available channel to create an invite.');
//                                 }
//                             }
//                             invite = await guild.invites.create(channelId, { maxAge: 0, maxUses: 0 });
//                         }

//                         const owner = await guild.members.fetch(guild.ownerId);

//                         serverDetails.push({
//                             id: guild.id,
//                             name: guild.name,
//                             memberCount: guild.memberCount,
//                             createdAt: getVietnameseDate(guild.createdAt),
//                             invite: invite ? invite.url : "Không có lời mời nào",
//                             owner: owner ? owner.user.tag : "Chủ sở hữu không xác định",
//                         });
//                     } catch (error) {
//                         console.error(`Lỗi khi tìm nạp thông tin chi tiết về bang hội ${guild.id}:`, error);
//                     }
//                 })
//             );

//             serverDetails.sort((a, b) => b.memberCount - a.memberCount);

//             const biggestServer = serverDetails[0];

//             const embed = createServerDetailsEmbed(biggestServer); // Sử dụng hàm từ embedsCreate.js

//             // Nếu có máy chủ thiếu quyền hạn, tạo Embed cho chúng
//             let missingPermissionsEmbed;
//             if (missingPermissionsGuilds.length > 0) {
//                 missingPermissionsEmbed = createMissingPermissionsEmbed(missingPermissionsGuilds); // Sử dụng hàm từ embedsCreate.js
//             }

//             const formattedList = serverDetails
//                 .map(
//                     (server,index) => `
//         Tên máy chủ ${index + 1}:     ${server.name}
//         ID Máy chủ:      ${server.id}
//         Số lượng thành viên:    ${server.memberCount}
//         Ngày thành lập:   ${server.createdAt}
//         Nhấp link bên dưới để vào máy chủ:          ${server.invite}
//         Người sở hữu:           ${server.owner}
//         ━━━━━━━━━━━━━━━`
//                 )
//                 .join("\n");

//             // Tạo sourcebin chứa chi tiết máy chủ
//             sourcebin
//                 .create([
//                     {
//                         name: `Chi tiết máy chủ của bạn`,
//                         content: formattedList,
//                         languageId: "CoffeeScript", // đổi không chữ ở đây LiveScriptwisp
//                     },
//                 ])
//                 .then((src) => {
//                     const replyContent = [
//                         `Tất cả chi tiết máy chủ - ${src.url}`,
//                     ];

//                     interaction.reply({
//                         content: replyContent.join(""),
//                         embeds: [embed, missingPermissionsEmbed].filter(Boolean),
//                         ephemeral: false,
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Lỗi tạo sourcebin:", error);
//                     interaction.reply({ content: "Đã xảy ra lỗi khi tạo chi tiết máy chủ.", ephemeral: true });
//                 });
//         } catch (error) {
//             console.error("Error fetching server details:", error);
//             interaction.reply({ content: "Đã xảy ra lỗi khi tìm nạp thông tin chi tiết về máy chủ.", ephemeral: true });
//         }
//     },
// };