// // const { EmbedBuilder } = require('discord.js');
// // const levelSchema = require(`../../schemas/messagelevelSchema`);

// // const levelRoles = {
// //     10: "1265806346050343034",
// //     20: "1268278580652019806",
// //     30: "1265806351896940548",
// //     1: "1269363379466801240"
// // };

// // const levelChannelAccess = {
// //     10: "1265806385661218848",
// //     9: "1265806387146002508",
// //     5: "1265806389234761812",
// //     20: "1265806392304865360"
// // };

// // module.exports = {
// //     name: "messageCreate",
// //     async execute(message) {
// //         const { guild, author, member } = message;

// //         if (!guild || author.bot) return;

// //         try {
// //             let data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec();

// //             if (!data) {
// //                 await levelSchema.create({
// //                     Guild: guild.id,
// //                     User: author.id,
// //                     XP: 0,
// //                     Level: 0,
// //                 });
// //                 data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec(); // Tìm nạp lại dữ liệu sau khi tạo
// //             }
// //             const channel = message.channel;
// //             const give = 1;

// //             const requireXP = data.Level * data.Level * 20 + 20;

// //             if (data.XP + give >= requireXP) {

// //                 data.XP += give;
// //                 data.Level += 1;

// //                 // Thêm vào: Cấp vai trò dựa trên cấp độ
// //             for (const [level, roleId] of Object.entries(levelRoles)) {
// //                 if (data.Level >= parseInt(level) && !member.roles.cache.has(roleId)) {
// //                     const role = guild.roles.cache.get(roleId);
// //                     if (role) await member.roles.add(role);
// //                 }
// //             }

// //             // Thêm vào: Cấp quyền truy cập vào các kênh dựa trên cấp độ
// //             for (const [level, channelId] of Object.entries(levelChannelAccess)) {
// //                 if (data.Level >= parseInt(level)) {
// //                     const channel = guild.channels.cache.get(channelId);
// //                     // if (channel) await channel.permissionOverwrites.create(member.id, { ViewChannel: true, SendMessages: false });
// //                     if (channel) {
// //                         let permissions = { ViewChannel: true, SendMessages: false, ManageMessages: false };
// //                         if (data.Level >= 3) permissions.SendMessages = true;
// //                         if (data.Level >= 5) permissions.ManageMessages = true;
// //                         await channel.permissionOverwrites.create(member.id, permissions);
// //                     }
// //                 }
// //             }

// //                 await data.save();

// //                 if (!channel) return;       

// //                 const embed = new EmbedBuilder()
// //                     .setColor('Blue')
// //                     .setDescription(`${author} đã đạt đến level ${data.Level}!`)
// //                     .setTitle(`CHÚC MỪNG 🏆!!!`)
// //                     .setTimestamp()
// //                     .setThumbnail(`https://media4.giphy.com/media/yGjmoMPc31ixmSC8rQ/giphy.gif?cid=6c09b952qfmih47mkaj71yr2bvt41tvruo1472q66eivmk4n&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s`)
// //                     .setImage(`https://i.pinimg.com/originals/03/31/72/033172391439095c5505c35f38a11a5b.gif`)
// //                     .setFooter({ text: `Valheim Survival` });

// //                 channel.send({ embeds: [embed] });
// //             } else {
// //                 data.XP += give;
// //                 await data.save();
// //             }
// //         } catch (err) {
// //             console.error("Xảy ra lỗi:", err);
// //         }
// //     }
// // };




// const { EmbedBuilder } = require('discord.js');
// const levelSchema = require('../../schemas/messagelevelSchema');

// module.exports = {
//     name: "messageCreate",
//     async execute(message) {
//         const { guild, author, member } = message;

//         if (!guild || author.bot) return;

//         try {
//             let data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec();

//             if (!data) {
//                 await levelSchema.create({
//                     Guild: guild.id,
//                     User: author.id,
//                     XP: 0,
//                     Level: 0,
//                 });
//                 data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec(); // Tìm nạp lại dữ liệu sau khi tạo
//             }
            
//             const channel = message.channel;
//             const give = 1;

//             const requireXP = data.Level * data.Level * 20 + 20;

//             if (data.XP + give >= requireXP) {
//                 data.XP += give;
//                 data.Level += 1;

//                 // Lưu dữ liệu và lấy thông tin các người dùng đứng đầu bảng xếp hạng
//                 const topUsers = await levelSchema.find({ Guild: guild.id }).sort({ XP: -1 }).limit(10);

//                 // Truy vấn vai trò từ cơ sở dữ liệu
//                 const rankData = await levelSchema.findOne({ Guild: guild.id }).exec();

//                 const rankRoles = {
//                     1: rankData.Roles.roles1,
//                     2: rankData.Roles.roles2,
//                     3: rankData.Roles.roles3,
//                 };

//                 // Gán vai trò cho các người đứng đầu bảng xếp hạng
//                 topUsers.forEach((userData, index) => {
//                     const roleID = rankRoles[index + 1];
//                     if (index < 3 && userData.User === author.id) {
//                         const role = guild.roles.cache.get(roleID);
//                         if (role && !member.roles.cache.has(role.id)) {
//                             member.roles.add(role).catch(console.error);
//                         }
//                     }
//                 });

//                 // // Thêm vào: Cấp quyền truy cập vào các kênh dựa trên cấp độ
//             // for (const [level, channelId] of Object.entries(levelChannelAccess)) {
//             //     if (data.Level >= parseInt(level)) {
//             //         const channel = guild.channels.cache.get(channelId);
//             //         // if (channel) await channel.permissionOverwrites.create(member.id, { ViewChannel: true, SendMessages: false });
//             //         if (channel) {
//             //             let permissions = { ViewChannel: true, SendMessages: false, ManageMessages: false };
//             //             if (data.Level >= 3) permissions.SendMessages = true;
//             //             if (data.Level >= 5) permissions.ManageMessages = true;
//             //             await channel.permissionOverwrites.create(member.id, permissions);
//             //         }
//             //     }
//             // }

//                 await data.save();

//                 if (!channel) return;       

//                 const embed = new EmbedBuilder()
//                     .setColor('Blue')
//                     .setDescription(`${author} đã đạt đến level ${data.Level}!`)
//                     .setTitle(`CHÚC MỪNG 🏆!!!`)
//                     .setTimestamp()
//                     .setThumbnail(`https://media4.giphy.com/media/yGjmoMPc31ixmSC8rQ/giphy.gif?cid=6c09b952qfmih47mkaj71yr2bvt41tvruo1472q66eivmk4n&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s`)
//                     .setImage(`https://i.pinimg.com/originals/03/31/72/033172391439095c5505c35f38a11a5b.gif`)
//                     .setFooter({ text: `Valheim Survival` });

//                 channel.send({ embeds: [embed] });
//             } else {
//                 data.XP += give;
//                 await data.save();
//             }
//         } catch (err) {
//             console.error("Xảy ra lỗi:", err);
//         }
//     }
// };






const { EmbedBuilder } = require('discord.js');
const levelSchema = require('../../schemas/messagelevelSchema');

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        const { guild, author, member } = message;

        if (!guild || author.bot) return;

        try {
            let data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec();

            if (!data) {
                await levelSchema.create({
                    Guild: guild.id,
                    User: author.id,
                    XP: 0,
                    Level: 0,
                    Channels: {},  // Đảm bảo có trường Channels
                    Levels: {}     // Đảm bảo có trường Levels
                });
                data = await levelSchema.findOne({ Guild: guild.id, User: author.id }).exec(); // Tìm nạp lại dữ liệu sau khi tạo
            }

            const channel = message.channel;
            const give = 1;

            const requireXP = data.Level * data.Level * 20 + 20;

            if (data.XP + give >= requireXP) {
                data.XP += give;
                data.Level += 1;
                await data.save();

                // Lấy cấu hình kênh và cấp độ yêu cầu
                const rankData = await levelSchema.findOne({ Guild: guild.id });
                const channelLevels = {
                    [rankData.Levels.level1]: rankData.Channels.channel1,
                    [rankData.Levels.level2]: rankData.Channels.channel2,
                    [rankData.Levels.level3]: rankData.Channels.channel3,
                };

                // Cấu hình quyền cho từng cấp độ
                const levelPermissions = {
                    [rankData.Levels.level1]: {
                        ViewChannel: true,
                        SendMessages: true,
                        AttachFiles: true,
                        ManageRoles: true,
                        ReadMessageHistory: true,
                    },
                    [rankData.Levels.level2]: {
                        ViewChannel: true,
                        SendMessages: true,
                        AttachFiles: true,
                        ManageRoles: true,
                        ReadMessageHistory: true,
                    },
                    [rankData.Levels.level3]: {
                        ViewChannel: true,
                        SendMessages: true,
                        AttachFiles: true,
                        ManageRoles: true,
                        ReadMessageHistory: true,
                    }
                };

                // Cấp quyền truy cập vào các kênh dựa trên cấp độ
                for (const [level, channelID] of Object.entries(channelLevels)) {
                    const parsedLevel = parseInt(level);
                    const accessChannel = guild.channels.cache.get(channelID);

                    if (accessChannel && data.Level >= parsedLevel) {
                        const permissions = levelPermissions[parsedLevel];
                        await accessChannel.permissionOverwrites.edit(member, permissions)
                            .catch(console.error);
                    }
                }

                // Gửi tin nhắn chúc mừng khi đạt level mới
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(`${author} đã đạt đến level ${data.Level}!`)
                        .setTitle(`CHÚC MỪNG 🏆!!!`)
                        .setTimestamp()
                        .setThumbnail(`https://media4.giphy.com/media/yGjmoMPc31ixmSC8rQ/giphy.gif?cid=6c09b952qfmih47mkaj71yr2bvt41tvruo1472q66eivmk4n&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s`)
                        .setImage(`https://i.pinimg.com/originals/03/31/72/033172391439095c5505c35f38a11a5b.gif`)
                        .setFooter({ text: client.user.username });

                    await channel.send({ embeds: [embed] }).catch(console.error);
                }

            } else {
                data.XP += give;
                await data.save();
            }
        } catch (err) {
            console.error("Xảy ra lỗi:", err);
        }
    }
};


