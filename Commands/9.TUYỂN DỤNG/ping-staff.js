// const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
// const pingStaff = require('../../schemas/pingstaffSchema');
// const ticketSchema = require('../../schemas/ticketSchema');
// const checkPermissions = require('../../Handlers/checkPermissions');
// const config = require('../../config');

// var timeout = [];

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('ping-staff')
//         .setDescription('Ping nhân viên để kiểm tra xem họ có trực tuyến không')
//         .addSubcommand(command => command.setName('manage').setDescription('Cài đặt ping trong vai trò mà bạn muốn')
//             .addRoleOption(option => option.setName('role').setDescription('Chọn vai trò mà bạn muốn các thành viên có thể đề cập đến').setRequired(true))
//             .addStringOption(option => option.setName('description').setDescription('Mô tả vai trò, bắt buộc có chữ discord hoặc game để thêm vai trò vào kênh bạn muốn.').setRequired(true)))
//         .addSubcommand(option => option.setName('s').setDescription('Ping tất cả nhân viên đang có vai trò')
//             .addRoleOption(option => option.setName('role').setDescription('Vai trò bạn muốn ping').setRequired(true)))
//         .addSubcommand(option => option.setName('delete').setDescription('Xóa thiết lập ping trong vai trò mà bạn muốn')
//             .addRoleOption(option => option.setName('role').setDescription('Vai trò bạn muốn xóa thiết lập ping').setRequired(true)))
//         .addSubcommand(option => option.setName('list').setDescription('Hiển thị danh sách các vai trò có thể giúp đỡ'))
//         .addSubcommand(option => option.setName('data').setDescription('Xóa tất cả dữ liệu trong hệ thống ping nhân viên (Chỉ dành cho chủ sở hữu máy chủ)')), // Thêm lệnh phụ mới,
//     async execute(interaction) {
//         const { guild, options } = interaction;
//         const sub = options.getSubcommand();

//         switch (sub) {
//             case 'manage':
//                 // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                 //     return await interaction.reply({ content: `Bạn không có quyền quản lý hệ thống ping vai trò`, ephemeral: true });
//                 // }

//                 const permissionEmbed = new EmbedBuilder().setDescription("`❌` Bạn không có quyền sử dụng lệnh này!").setColor('Blue').setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });
//                 // Lấy ID của người dùng thực hiện lệnh
//                     const userId = interaction.user.id;
//                     // Kiểm tra quyền
//                 if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                 // Nếu người dùng không phải là quản trị viên, kiểm tra quyền đặc biệt
//                 if (userId === config.specialUsers[0] || checkPermissions(interaction)) {
//                     // Nếu người dùng có quyền đặc biệt, tiếp tục thực hiện lệnh
//                 } else {
//                     return interaction.reply({ embeds: [permissionEmbed] });
//                 }
//                 }

//                 const roleToAdd = options.getRole('role');
//                 const roleDescription = options.getString('description');
//                 const roleToAddObject = { RoleID: roleToAdd.id, RoleName: roleToAdd.name, RoleDescription: roleDescription };

//                 try {
//                     let updatedDocument = await pingStaff.findOne({ Guild: interaction.guild.id });

//                     if (!updatedDocument) {
//                         updatedDocument = new pingStaff({
//                             Guild: interaction.guild.id,
//                             Roles: [roleToAddObject],
//                         });
//                     } else {
//                         const existingRole = updatedDocument.Roles.find(role => role.RoleID === roleToAdd.id);
//                         if (!existingRole) {
//                             updatedDocument.Roles.push(roleToAddObject);
//                         } else {
//                             return await interaction.reply({ content: `Vai trò ${roleToAdd.name} đã được cài đặt trong hệ thống ping vai trò.`, ephemeral: true });
//                         }
//                     }

//                     await updatedDocument.save();

//                     // Cấp quyền cho các thành viên của vai trò trong các kênh phù hợp
//                     // const channelsToUpdate = interaction.guild.channels.cache.filter(channel => 
//                     //     (roleDescription.toLowerCase().includes('discord') && channel.name.startsWith('discord-')) ||
//                     //     (roleDescription.toLowerCase().includes('game') && channel.name.startsWith('game-'))
//                     // );
//                     const channelsToUpdate = interaction.guild.channels.cache.filter(channel => {
//                         if (roleDescription.toLowerCase().includes('discord')) {
//                             return channel.name.startsWith('discord-');
//                         } else if (roleDescription.toLowerCase().includes('game')) {
//                             return channel.name.startsWith('game-');
//                         }
//                         return false; // Nếu không có từ khóa phù hợp, không cập nhật bất kỳ kênh nào
//                     });

//                     channelsToUpdate.forEach(channel => {
//                         channel.permissionOverwrites.edit(roleToAdd.id, {
//                             ViewChannel: true,
//                             SendMessages: true,
//                             ReadMessageHistory: true
//                         }).catch(err => console.error(`Không thể cập nhật quyền cho kênh ${channel.name}:`, err));
//                     });

//                     const embed = new EmbedBuilder()
//                         .setColor('#ee88aa')
//                         .setDescription(`Hệ thống ping đã được thiết lập với vai trò ${roleToAdd.name}.`);

//                     await interaction.reply({ embeds: [embed], ephemeral: true });
//                 } catch (error) {
//                     console.error('Lỗi khi lưu dữ liệu vào MongoDB:', error);
//                     return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng lưu dữ liệu. Vui lòng thử lại sau.`, ephemeral: true });
//                 }
//                 break;

//             case 's':
//                 const roleToPing = options.getRole('role');
//                 const data = await pingStaff.findOne({ Guild: interaction.guild.id });

//                 if (!data || !data.Roles || !data.Roles.some(role => role.RoleID === roleToPing.id)) {
//                     return await interaction.reply({ content: `Hệ thống ping chưa được kích hoạt cho vai trò ${roleToPing.name} mà bạn đã chọn`, ephemeral: true });
//                 }

//                 const selectedRole = data.Roles.find(role => role.RoleID === roleToPing.id);
//                 const roleDescriptions = selectedRole ? selectedRole.RoleDescription : 'Không có mô tả cho vai trò này.';

//                 const expectedChannelPrefix = roleDescriptions.toLowerCase().includes('discord') ? 'discord-' : 'game-';
//                 if (!interaction.channel.name.startsWith(expectedChannelPrefix)) {
//                     return await interaction.reply({ content: `Bạn chỉ có thể sử dụng lệnh này trong các kênh ${expectedChannelPrefix}.`, ephemeral: true });
//                 }

//                 if (timeout.includes(interaction.user.id)) {
//                     return await interaction.reply({ content: `Bạn đang trong thời gian hồi chiêu 1 phút cho lệnh này! Thử lại sau`, ephemeral: true });
//                 }

//                 const membersToPing = interaction.guild.members.cache.filter(member => {
//                     const memberRoles = member.roles.cache;
//                     return memberRoles.has(roleToPing.id);
//                 }).filter(member => {
//                     const status = member.presence?.status;
//                     console.log(`Thành viên ${member.user.tag} - Vai trò: ${roleToPing.name} - Trạng thái: ${status}`); // Debug trạng thái thành viên
//                     return ['online', 'dnd', 'idle'].includes(status);
//                 });

//                 if (membersToPing.size === 0) {
//                     await interaction.reply({ content: `Không có ai trực tuyến trong vai trò ${roleToPing}... Thử lại sau`, ephemeral: true });
//                 } else {
//                     const memberList = membersToPing.map(member => member.toString()).join('\n+ ');

//                     const embed = new EmbedBuilder()
//                         .setColor('Green')
//                         .setDescription(`Các thành viên này sẽ hỗ trợ bạn về ${roleDescriptions}! Họ sẽ sớm ở bên bạn.`);

//                     await interaction.reply({ embeds: [embed], content: `\>\>\> ** <@&${roleToPing.id}> NGƯỜI NÀY ĐANG CẦN SỰ GIÚP ĐỠ TỪ CÁC BẠN!**\n\n + ${memberList}\n\n` });

//                     timeout.push(interaction.user.id);
//                     setTimeout(() => {
//                         timeout.shift();
//                     }, 60000);
//                 }
//                 break;

//             case 'delete':
//                 if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                     return await interaction.reply({ content: `Bạn không có quyền quản lý hệ thống nhân viên ping`, ephemeral: true });
//                 }

//                 const roleToDelete = options.getRole('role');

//                 try {
//                     // Xóa vai trò khỏi cơ sở dữ liệu
//                     const deletedDocument = await pingStaff.findOneAndUpdate(
//                         { Guild: interaction.guild.id },
//                         { $pull: { Roles: { RoleID: roleToDelete.id } } },
//                         { new: true }
//                     );

//                     // Kiểm tra xem vai trò đã bị xóa khỏi cơ sở dữ liệu chưa
//                     if (!deletedDocument || deletedDocument.Roles.some(role => role.RoleID === roleToDelete.id)) {
//                         return await interaction.reply({ content: `Không tìm thấy vai trò ${roleToDelete.name} trong hệ thống nhân viên ping`, ephemeral: true });
//                     }

//                     // Lấy thông tin kênh từ ticketSchema
//                     const ticketData = await ticketSchema.findOne({ Guild: interaction.guild.id });
//                     if (!ticketData) {
//                         return await interaction.reply({ content: `Không tìm thấy thông tin hệ thống vé cho máy chủ này.`, ephemeral: true });
//                     }

//                     // Tìm kiếm và xóa vai trò khỏi các kênh
//                     const channelsToUpdate = interaction.guild.channels.cache.filter(channel => {
//                         return channel.name.startsWith('discord-') || channel.name.startsWith('game-');
//                     });

//                     channelsToUpdate.forEach(async channel => {
//                         const permissions = channel.permissionOverwrites.cache.get(roleToDelete.id);
//                         if (permissions) {
//                             await channel.permissionOverwrites.delete(roleToDelete.id)
//                                 .catch(err => console.error(`Không thể xóa vai trò khỏi kênh ${channel.name}:`, err));
//                         }
//                     });

//                     const embed = new EmbedBuilder()
//                         .setColor('#ee88aa')
//                         .setDescription(`Vai trò ${roleToDelete.name} đã bị xóa khỏi các kênh discord- và game-`);

//                     await interaction.reply({ embeds: [embed], ephemeral: true });
//                 } catch (error) {
//                     console.error('Lỗi khi xóa dữ liệu từ MongoDB:', error);
//                     return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng xóa dữ liệu. Vui lòng thử lại sau.`, ephemeral: true });
//                 }
//                 break;


//             case 'list':
//                 try {
//                     const listData = await pingStaff.findOne({ Guild: interaction.guild.id });

//                     if (!listData || !listData.Roles || listData.Roles.length === 0) {
//                         return await interaction.reply({ content: `Không có vai trò nào trong hệ thống ping nhân viên.`, ephemeral: true });
//                     }

//                     const roleDescriptions = listData.Roles.map(role => `**${role.RoleName}**: ${role.RoleDescription}`).join('\n');

//                     const embed = new EmbedBuilder()
//                         .setColor('#ffaa00')
//                         .setTitle('Danh sách các vai trò đang được theo dõi')
//                         .setDescription(roleDescriptions);

//                     await interaction.reply({ embeds: [embed], ephemeral: true });
//                 } catch (error) {
//                     console.error('Lỗi khi lấy danh sách từ MongoDB:', error);
//                     return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng lấy danh sách vai trò. Vui lòng thử lại sau.`, ephemeral: true });
//                 }
//                 break;
            
//             case 'data':
//                 // Kiểm tra xem người dùng có phải là chủ sở hữu máy chủ không
//                 if (interaction.user.id !== guild.ownerId) {
//                     return await interaction.reply({ content: `Chỉ chủ sở hữu máy chủ mới có quyền sử dụng lệnh này!`, ephemeral: true });
//                 }

//                 try {
//                     // Xóa tất cả dữ liệu từ pingStaff
//                     await pingStaff.deleteMany({ Guild: guild.id });
                    
//                     const embed = new EmbedBuilder()
//                         .setColor('#ff0000')
//                         .setDescription(`Tất cả dữ liệu trong hệ thống ping nhân viên đã được xóa thành công!`);

//                     await interaction.reply({ embeds: [embed], ephemeral: true });
//                 } catch (error) {
//                     console.error('Lỗi khi xóa dữ liệu từ MongoDB:', error);
//                     return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng xóa tất cả dữ liệu. Vui lòng thử lại sau.`, ephemeral: true });
//                 }
//                 break;

//             default:
//                 await interaction.reply({ content: `Lệnh không hợp lệ!`, ephemeral: true });
//                 break;
//         }
//     }
// };


















// ddoanj duoi dnag thu nghiem đã xong, dùng thử 1 thời gian xem lỗi gì không 
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const pingStaff = require('../../schemas/pingstaffSchema');
const ticketSchema = require('../../schemas/ticketSchema');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
const config = require('../../config');

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping-staff')
        .setDescription('Ping nhân viên để kiểm tra xem họ có trực tuyến không')
        .addSubcommand(command => command.setName('manage').setDescription('Cài đặt ping trong vai trò mà bạn muốn')
            .addRoleOption(option => option.setName('role').setDescription('Chọn vai trò mà bạn muốn các thành viên có thể đề cập đến').setRequired(true))
            .addStringOption(option => option.setName('description').setDescription('Mô tả vai trò, bắt buộc có chữ discord hoặc game để thêm vai trò vào kênh bạn muốn.').setRequired(true))
            .addStringOption(option => option.setName('channel-type').setDescription('Chọn loại kênh hỗ trợ (discord hoặc game)').setRequired(true)
            .addChoices(
                { name: 'Discord', value: 'discord-' },
                { name: 'Game', value: 'game-' }
            )))
        .addSubcommand(option => option.setName('s').setDescription('Ping tất cả nhân viên đang có vai trò')) // .addRoleOption(option => option.setName('role').setDescription('Vai trò bạn muốn ping').setRequired(true))
        .addSubcommand(option => option.setName('delete').setDescription('Xóa thiết lập ping trong vai trò mà bạn muốn')
            .addRoleOption(option => option.setName('role').setDescription('Vai trò bạn muốn xóa thiết lập ping').setRequired(true)))
        .addSubcommand(option => option.setName('list').setDescription('Hiển thị danh sách các vai trò có thể giúp đỡ'))
        .addSubcommand(option => option.setName('data').setDescription('Xóa tất cả dữ liệu trong hệ thống ping nhân viên (Chỉ dành cho chủ sở hữu máy chủ)')), // Thêm lệnh phụ mới,
    async execute(interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'manage':
                // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                //     return await interaction.reply({ content: `Bạn không có quyền quản lý hệ thống ping vai trò`, ephemeral: true });
                // }

                const permissionEmbed = new EmbedBuilder().setDescription("`❌` Bạn không có quyền sử dụng lệnh này!").setColor('Blue').setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });
                // Lấy ID của người dùng thực hiện lệnh
                    const userId = interaction.user.id;
                    // Kiểm tra quyền
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                // Nếu người dùng không phải là quản trị viên, kiểm tra quyền đặc biệt
                if (userId === config.specialUsers[0] || checkPermissions(interaction)) {
                    // Nếu người dùng có quyền đặc biệt, tiếp tục thực hiện lệnh
                } else {
                    return interaction.reply({ embeds: [permissionEmbed] });
                }
                }

                const roleToAdd = options.getRole('role');
                const roleDescription = options.getString('description');
                const channelType = options.getString('channel-type');
                const roleToAddObject = { RoleID: roleToAdd.id, RoleName: roleToAdd.name, RoleDescription: roleDescription, ChannelType: channelType };

                try {
                    let updatedDocument = await pingStaff.findOne({ Guild: interaction.guild.id });

                    if (!updatedDocument) {
                        updatedDocument = new pingStaff({
                            Guild: interaction.guild.id,
                            Roles: [roleToAddObject],
                        });
                    } else {
                        const existingRole = updatedDocument.Roles.find(role => role.RoleID === roleToAdd.id);
                        if (!existingRole) {
                            updatedDocument.Roles.push(roleToAddObject);
                        } else {
                            return await interaction.reply({ content: `Vai trò ${roleToAdd.name} đã được cài đặt trong hệ thống ping vai trò.`, ephemeral: true });
                        }
                    }

                    await updatedDocument.save();

                    // Cấp quyền cho các thành viên của vai trò trong các kênh phù hợp
                    // const channelsToUpdate = interaction.guild.channels.cache.filter(channel => 
                    //     (roleDescription.toLowerCase().includes('discord') && channel.name.startsWith('discord-')) ||
                    //     (roleDescription.toLowerCase().includes('game') && channel.name.startsWith('game-'))
                    // );
                    const channelsToUpdate = interaction.guild.channels.cache.filter(channel => {
                        if (channelType === 'discord-' && roleDescription.toLowerCase().includes('discord')) {
                            return channel.name.startsWith('discord-');
                        } else if (channelType === 'game-' && roleDescription.toLowerCase().includes('game')) {
                            return channel.name.startsWith('game-');
                        }
                        return false; // Nếu không có từ khóa phù hợp, không cập nhật bất kỳ kênh nào
                    });

                    channelsToUpdate.forEach(channel => {
                        channel.permissionOverwrites.edit(roleToAdd.id, {
                            ViewChannel: true,
                            SendMessages: true,
                            ReadMessageHistory: true
                        }).catch(err => console.error(`Không thể cập nhật quyền cho kênh ${channel.name}:`, err));
                    });

                    const embed = new EmbedBuilder()
                        .setColor('#ee88aa')
                        .setDescription(`Hệ thống ping đã được thiết lập với vai trò ${roleToAdd.name}.`);

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } catch (error) {
                    console.error('Lỗi khi lưu dữ liệu vào MongoDB:', error);
                    return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng lưu dữ liệu. Vui lòng thử lại sau.`, ephemeral: true });
                }
                break;

            case 's':
                // const roleToPing = options.getRole('role');
                // const data = await pingStaff.findOne({ Guild: interaction.guild.id });

                // if (!data || !data.Roles || !data.Roles.some(role => role.RoleID === roleToPing.id)) {
                //     return await interaction.reply({ content: `Hệ thống ping chưa được kích hoạt cho vai trò ${roleToPing.name} mà bạn đã chọn`, ephemeral: true });
                // }

                // const selectedRole = data.Roles.find(role => role.RoleID === roleToPing.id);
                // const roleDescriptions = selectedRole ? selectedRole.RoleDescription : 'Không có mô tả cho vai trò này.';

                // // const expectedChannelPrefix = roleDescriptions.toLowerCase().includes('discord') ? 'discord-' : 'game-';
                // const expectedChannelPrefix = selectedRole ? (selectedRole.ChannelType === 'discord-' ? 'discord-' : 'game-') : '';
                // if (!interaction.channel.name.startsWith(expectedChannelPrefix)) {
                //     return await interaction.reply({ content: `Bạn chỉ có thể sử dụng lệnh này trong các kênh ${expectedChannelPrefix}.`, ephemeral: true });
                // }

                // if (timeout.includes(interaction.user.id)) {
                //     return await interaction.reply({ content: `Bạn đang trong thời gian hồi chiêu 1 phút cho lệnh này! Thử lại sau`, ephemeral: true });
                // }

                // const membersToPing = interaction.guild.members.cache.filter(member => {
                //     const memberRoles = member.roles.cache;
                //     return memberRoles.has(roleToPing.id);
                // }).filter(member => {
                //     const status = member.presence?.status;
                //     return ['online', 'dnd', 'idle'].includes(status);
                // });

                // if (membersToPing.size === 0) {
                //     await interaction.reply({ content: `Không có ai trực tuyến trong vai trò ${roleToPing}... Thử lại sau`, ephemeral: true });
                // } else {
                //     const memberList = membersToPing.map(member => member.toString()).join('\n+ ');

                //     const embed = new EmbedBuilder()
                //         .setColor('Green')
                //         .setDescription(`Các thành viên này sẽ hỗ trợ bạn về ${roleDescriptions}! Họ sẽ sớm ở bên bạn.`);

                //     await interaction.reply({ embeds: [embed], content: `\>\>\> ** <@&${roleToPing.id}> NGƯỜI NÀY ĐANG CẦN SỰ GIÚP ĐỠ TỪ CÁC BẠN!**\n\n + ${memberList}\n\n` });

                //     timeout.push(interaction.user.id);
                //     setTimeout(() => {
                //         timeout.shift();
                //     }, 60000);
                // }
                // break;
                const data = await pingStaff.findOne({ Guild: interaction.guild.id });

                if (!data || !data.Roles || data.Roles.length === 0) {
                    return await interaction.reply({ content: `Hệ thống ping chưa được kích hoạt.`, ephemeral: true });
                }

                // Tìm vai trò phù hợp để ping
                const channelName = interaction.channel.name;
                const expectedRole = data.Roles.find(role => {
                    if (channelName.startsWith('discord-') && role.ChannelType === 'discord-') {
                        return true;
                    } else if (channelName.startsWith('game-') && role.ChannelType === 'game-') {
                        return true;
                    }
                    return false;
                });

                if (!expectedRole) {
                    
                    // return await interaction.reply({ content: `Chỉ áp dụng với kênh vé.`, ephemeral: true });
                    
                    // Xác định loại kênh hiện tại
                    const channelType = channelName.startsWith('discord-') ? 'discord-' : (channelName.startsWith('game-') ? 'game-' : '');

                    // Kiểm tra nếu kênh không có tiền tố phù hợp
                    if (!channelType) {
                        return await interaction.reply({ 
                            content: `Vui lòng sử dụng lệnh này trong kênh vé \`discord-\` hoặc \`game-\`.`,
                            ephemeral: true 
                        });
                    }

                    // Nếu có tiền tố nhưng không tìm thấy vai trò
                    return await interaction.reply({ 
                        content: `Vai trò cho loại kênh ${channelType} chưa được thiết lập trong hệ thống ping. Vui lòng thiết lập vai trò tương ứng để sử dụng lệnh này.`,
                        ephemeral: true 
                    });
                }

                if (timeout.includes(interaction.user.id)) {
                    return await interaction.reply({ content: `Bạn đang trong thời gian hồi chiêu 1 phút cho lệnh này! Thử lại sau`, ephemeral: true });
                }

                const roleToPing = await interaction.guild.roles.fetch(expectedRole.RoleID);
                const membersToPing = interaction.guild.members.cache.filter(member => member.roles.cache.has(roleToPing.id))
                    .filter(member => ['online', 'dnd', 'idle'].includes(member.presence?.status || ''));

                if (membersToPing.size === 0) {
                    await interaction.reply({ content: `Không có ai trực tuyến trong vai trò ${roleToPing}... Thử lại sau`, ephemeral: true });
                } else {
                    const memberList = membersToPing.map(member => member.toString()).join('\n+ ');

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`Các thành viên này sẽ hỗ trợ bạn! Họ sẽ sớm ở bên bạn.`);

                    await interaction.reply({ embeds: [embed], content: `\>\>\> ** <@&${roleToPing.id}> NGƯỜI NÀY ĐANG CẦN SỰ GIÚP ĐỠ TỪ CÁC BẠN!**\n\n + ${memberList}\n\n` });

                    timeout.push(interaction.user.id);
                    setTimeout(() => {
                        timeout.shift();
                    }, 60000);
                }
                break;

            case 'delete':
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return await interaction.reply({ content: `Bạn không có quyền quản lý hệ thống nhân viên ping`, ephemeral: true });
                }

                const roleToDelete = options.getRole('role');

                try {
                    // Xóa vai trò khỏi cơ sở dữ liệu
                    const deletedDocument = await pingStaff.findOneAndUpdate(
                        { Guild: interaction.guild.id },
                        { $pull: { Roles: { RoleID: roleToDelete.id } } },
                        { new: true }
                    );

                    // Kiểm tra xem vai trò đã bị xóa khỏi cơ sở dữ liệu chưa
                    if (!deletedDocument || deletedDocument.Roles.some(role => role.RoleID === roleToDelete.id)) {
                        return await interaction.reply({ content: `Không tìm thấy vai trò ${roleToDelete.name} trong hệ thống nhân viên ping`, ephemeral: true });
                    }

                    // Lấy thông tin kênh từ ticketSchema
                    const ticketData = await ticketSchema.findOne({ Guild: interaction.guild.id });
                    if (!ticketData) {
                        return await interaction.reply({ content: `Không tìm thấy thông tin hệ thống vé cho máy chủ này.`, ephemeral: true });
                    }

                    // Tìm kiếm và xóa vai trò khỏi các kênh
                    const channelsToUpdate = interaction.guild.channels.cache.filter(channel => {
                        return channel.name.startsWith('discord-') || channel.name.startsWith('game-');
                    });

                    channelsToUpdate.forEach(async channel => {
                        const permissions = channel.permissionOverwrites.cache.get(roleToDelete.id);
                        if (permissions) {
                            await channel.permissionOverwrites.delete(roleToDelete.id)
                                .catch(err => console.error(`Không thể xóa vai trò khỏi kênh ${channel.name}:`, err));
                        }
                    });

                    const embed = new EmbedBuilder()
                        .setColor('#ee88aa')
                        .setDescription(`Vai trò ${roleToDelete.name} đã bị xóa khỏi các kênh discord- và game-`);

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } catch (error) {
                    console.error('Lỗi khi xóa dữ liệu từ MongoDB:', error);
                    return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng xóa dữ liệu. Vui lòng thử lại sau.`, ephemeral: true });
                }
                break;


            case 'list':
                // try {
                //     const listData = await pingStaff.findOne({ Guild: interaction.guild.id });

                //     if (!listData || !listData.Roles || listData.Roles.length === 0) {
                //         return await interaction.reply({ content: `Không có vai trò nào trong hệ thống ping nhân viên.`, ephemeral: true });
                //     }

                //     const roleDescriptions = listData.Roles.map(role => `**${role.RoleName}**: ${role.RoleDescription}`).join('\n');

                //     const embed = new EmbedBuilder()
                //         .setColor('#ffaa00')
                //         .setTitle('Danh sách các vai trò đang được theo dõi')
                //         .setDescription(roleDescriptions);

                //     await interaction.reply({ embeds: [embed], ephemeral: true });
                // } catch (error) {
                //     console.error('Lỗi khi lấy danh sách từ MongoDB:', error);
                //     return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng lấy danh sách vai trò. Vui lòng thử lại sau.`, ephemeral: true });
                // }
                try {
                    const listData = await pingStaff.findOne({ Guild: interaction.guild.id });
    
                    if (!listData || !listData.Roles || listData.Roles.length === 0) {
                        return await interaction.reply({ content: `Không có vai trò nào trong hệ thống ping nhân viên.`, ephemeral: true });
                    }
    
                    const discordRoles = listData.Roles.filter(role => role.ChannelType === 'discord-');
                    const gameRoles = listData.Roles.filter(role => role.ChannelType === 'game-');
    
                    const discordRoleDescriptions = discordRoles.length > 0 
                        ? discordRoles.map(role => `- **${role.RoleName}**: ${role.RoleDescription}`).join('\n') 
                        : 'Không có vai trò nào hỗ trợ kênh Discord.';

                    const gameRoleDescriptions = gameRoles.length > 0 
                        ? gameRoles.map(role => `- **${role.RoleName}**: ${role.RoleDescription}`).join('\n') 
                        : 'Không có vai trò nào hỗ trợ kênh Game.';
    
                    const embed = new EmbedBuilder()
                        .setColor('#ffaa00')
                        .setTitle('Danh sách các vai trò hỗ trợ các kênh')
                        .setDescription(`
                            **Vai trò hỗ trợ kênh Discord:**
                            ${discordRoleDescriptions}

                            **Vai trò hỗ trợ kênh Game:**
                            ${gameRoleDescriptions}
                        `);
    
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách từ MongoDB:', error);
                    return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng lấy danh sách vai trò. Vui lòng thử lại sau.`, ephemeral: true });
                }
                break;
            
            case 'data':
                // Kiểm tra xem người dùng có phải là chủ sở hữu máy chủ không
                if (interaction.user.id !== guild.ownerId) {
                    return await interaction.reply({ content: `Chỉ chủ sở hữu máy chủ mới có quyền sử dụng lệnh này!`, ephemeral: true });
                }

                try {
                    // Xóa tất cả dữ liệu từ pingStaff
                    await pingStaff.deleteMany({ Guild: guild.id });
                    
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`Tất cả dữ liệu trong hệ thống ping nhân viên đã được xóa thành công!`);

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } catch (error) {
                    console.error('Lỗi khi xóa dữ liệu từ MongoDB:', error);
                    return await interaction.reply({ content: `Đã xảy ra lỗi khi cố gắng xóa tất cả dữ liệu. Vui lòng thử lại sau.`, ephemeral: true });
                }
                break;

            default:
                await interaction.reply({ content: `Lệnh không hợp lệ!`, ephemeral: true });
                break;
        }
    }
};