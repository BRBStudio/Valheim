const { SlashCommandBuilder, PermissionsBitField, BitField } = require('discord.js');
const LockSchema = require('../../schemas/lockSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock-channel')
        .setDescription('Dùng lần 1 để khóa kênh, dùng lần 2 để mở khóa kênh'),
    async execute(interaction, client) {
        try {
            // Kiểm tra quyền Administrator
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({
                    content: '⚠️ Lệnh này chỉ có thể được sử dụng bởi quản trị viên (Administrator) của máy chủ!',
                    ephemeral: true // chỉ hiển thị cho người dùng đã gọi lệnh
                });
            }

            await interaction.deferReply();

            const lockData = await LockSchema.findOne({
                Guild: interaction.guild.id,
                Channel: interaction.channel.id
            }) ?? await LockSchema.create({
                Guild: interaction.guild.id,
                Channel: interaction.channel.id,
                Permissions: interaction.channel.permissionOverwrites,
                Locked: false
            });

            if (!lockData.Locked) {
                const oldPermissons = [];
                for (const perms of interaction.channel.permissionOverwrites.cache.values()) {
                    oldPermissons.push({
                        id: perms.id,
                        allow: perms.allow.bitfield,
                        deny: perms.deny.bitfield
                    });
                }

                await lockData.updateOne({
                    Permissions: oldPermissons
                });

                const permissions = [];
                permissions.push({
                    id: interaction.guild.id,
                    allow: [],
                    deny: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.CreatePublicThreads,
                        PermissionsBitField.Flags.CreatePrivateThreads,
                        PermissionsBitField.Flags.SendMessagesInThreads,
                        PermissionsBitField.Flags.AddReactions
                    ]
                });

                // Xác định quyền mặc định cho kênh
                const defaultPerms = interaction.channel.permissionsFor(interaction.guild.id).bitfield;

                if (defaultPerms & PermissionsBitField.Flags.ViewChannel) {
                    permissions[0].allow.push(PermissionsBitField.Flags.ViewChannel);
                } else {
                    permissions[0].deny.push(PermissionsBitField.Flags.ViewChannel);
                }

                await interaction.channel.permissionOverwrites.set(permissions);

                await lockData.updateOne({
                    Locked: true
                });

                await interaction.editReply({
                    content: `# 🔒 Kênh này đã bị khóa, vui lòng chờ!`
                });

            } else {
                const permissions = lockData.Permissions.map(perm => ({
                    ...perm,
                    allow: new BitField(perm.allow),
                    deny: new BitField(perm.deny)
                }));

                await interaction.channel.permissionOverwrites.set(permissions);

                await lockData.updateOne({
                    Locked: false
                });

                await interaction.editReply({
                    content: `# 🔓 Kênh này đã được mở khóa, cảm ơn sự kiên nhẫn của bạn!`
                });
            }
        } catch (error) {
            await interaction.editReply({
                content: `Lệnh này không có tác dụng với bài viết trong diễn đàn.`
            });
        }
    }
};




// const { SlashCommandBuilder } = require(`discord.js`);
// const Permission = require('discord.js').PermissionsBitField.Flags;
// const LockSchema = require('../../schemas/lockSchema');
// const { BitField } = require('discord.js');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('lock-channel')
// 		.setDescription('Dùng lần 1 để khóa kênh, dùng lần 2 để mở khóa kênh'),
// 	async execute(interaction, client) {
// 		try {
// 			const allowedRoles = [
// 				// '970775928701603841', // Moderator
// 				'1172947009410437142', // Vai trò Amin của máy chủ BRB
// 				// '1188986923293884426',
// 			];

// 			/*
// 			dùng ```diff\n+ ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★!\n``` để đổi chữ sang mầu xanh
// 			dùng ```diff\n- ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★!\n``` để đổi chữ sang mầu đỏ
// 			*/
// 			if (!interaction.member._roles.some(role => allowedRoles.includes(role))) {
// 				return await interaction.reply({
// 					content: '⚠️ Lệnh này được thiết lập cho riêng máy chủ **★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★!**! nhắn tin riêng tư (DM) cho [@Valheim Survival](https://discord.com/users/940104526285910046) nếu bạn cho rằng đây là vấn đề!',
// 				});
// 			}

// 			await interaction.deferReply();

// 			const lockData = await LockSchema.findOne({
// 				Guild: interaction.guild.id,
// 				Channel: interaction.channel.id
// 			}) ?? await LockSchema.create({
// 				Guild: interaction.guild.id,
// 				Channel: interaction.channel.id,
// 				Permissions: interaction.channel.permissionOverwrites,
// 				Locked: false
// 			});

// 			if (!lockData.Locked) {
// 				const oldPermissons = [];
// 				for (const perms of interaction.channel.permissionOverwrites.cache.values()) {
// 					oldPermissons.push({
// 						id: perms.id,
// 						allow: perms.allow.bitfield,
// 						deny: perms.deny.bitfield
// 					});
// 				}

// 				await lockData.updateOne({
// 					Permissions: oldPermissons
// 				});

// 				const permissions = [];
// 				for (const role of allowedRoles) {
// 					permissions.push({
// 						id: role,
// 						allow: [Permission.SendMessages, Permission.ViewChannel]
// 					});
// 				}

// 				const defaultPerms = interaction.channel.permissionsFor(interaction.guild.id).bitfield;

// 				const globalPerms = {
// 					id: interaction.guild.id,
// 					allow: [],
// 					deny: [Permission.SendMessages, Permission.CreatePublicThreads, Permission.CreatePrivateThreads, Permission.SendMessagesInThreads, Permission.AddReactions]
// 				}

// 				// Bitwise AND : 1101 & 0100 = 0100
// 				if (defaultPerms & Permission.ViewChannel) {
// 					globalPerms.allow.push(Permission.ViewChannel);
// 				} else {
// 					globalPerms.deny.push(Permission.ViewChannel);
// 				}

// 				permissions.push(globalPerms);

// 				await interaction.channel.permissionOverwrites.set(permissions);

// 				await lockData.updateOne({
// 					Locked: true
// 				});

// 				await interaction.editReply({
// 					content: `# 🔒 Kênh này đã bị khóa, vui lòng chờ!`
// 				});

// 			} else {
// 				const permissions = lockData.Permissions.map(perm => ({
// 					...perm,
// 					allow: new BitField(perm.allow),
// 					deny: new BitField(perm.deny)
// 				}));

// 				await interaction.channel.permissionOverwrites.set(permissions);

// 				await lockData.updateOne({
// 					Locked: false
// 				});

// 				await interaction.editReply({
// 					content: `# 🔓 Kênh này đã được mở khóa, cảm ơn sự kiên nhẫn của bạn!`
// 				});
// 			}
// 		} catch (error) {
// 			// console.error('Lỗi khi thực hiện lệnh khóa kênh:', error);
// 			await interaction.editReply({
// 				content: `Lệnh này không có tác dụng với bài viết trong diễn đàn.`
// 			});
// 		}
// 	}
// }
