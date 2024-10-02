const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../schemas/messagelevelSchema');
const { Font, LeaderboardBuilder, RankCardBuilder } = require('canvacord');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDMPermission(false)
        .setDescription('Nhận thứ hạng thành viên trong máy chủ')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Xem thứ hạng của một thành viên cụ thể')
                .addUserOption(option => option.setName('user').setDescription('Thành viên có thứ hạng bạn muốn kiểm tra').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Xem danh sách 10 người đứng đầu bảng xếp hạng')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup-level')
                .setDescription('Thiết lập quyền truy cập kênh dựa trên cấp độ')
                .addChannelOption(option => option.setName('channel1').setDescription('Kênh cho người đạt level cao nhất').setRequired(true))
                .addIntegerOption(option => option.setName('level1').setDescription('Level cần thiết cho kênh 1').setRequired(true))
                .addChannelOption(option => option.setName('channel2').setDescription('Kênh cho người đạt level cao thứ 2').setRequired(true))
                .addIntegerOption(option => option.setName('level2').setDescription('Level cần thiết cho kênh 2').setRequired(true))
                .addChannelOption(option => option.setName('channel3').setDescription('Kênh cho người đạt level cao thứ 3').setRequired(true))
                .addIntegerOption(option => option.setName('level3').setDescription('Level cần thiết cho kênh 3').setRequired(true))
        ),

    async execute(interaction) {
        const { options, user, guild } = interaction;
        const subcommand = options.getSubcommand();
        const memberOption = options.getMember('user') || user;
        const member = guild.members.cache.get(memberOption.id);

        // Lấy dữ liệu của 10 người dùng từ cơ sở dữ liệu
        const topUsers = await levelSchema.find({ Guild: guild.id }).sort({ XP: -1 }).limit(10);

        // Truy vấn trực tiếp từ cơ sở dữ liệu
        const players = await Promise.all(topUsers.map(async (data, index) => {
            try {
                const cachedMember = await guild.members.fetch(data.User);
                const rank = Math.floor(data.Level / 10) + 1; // Xác định rank dựa trên level
                return {
                    avatar: cachedMember.user.displayAvatarURL({ forceStatic: true }),
                    username: cachedMember.user.username,
                    displayName: cachedMember.displayName,
                    level: data.Level,
                    xp: data.XP,
                    rank: rank,
                };
            } catch (error) {
                console.error(`👑 Không thể tìm thấy thành viên với ID ${data.User} trong máy chủ.`);
                return null;
            }
        }));

        const validPlayers = players.filter(player => player !== null);

        // Đường dẫn đến hình ảnh nền trong thư mục 'anh'
        const backgroundPath = path.join(__dirname, '../../anh/leaderboard-background5.png');

        // Kiểm tra xem tệp có tồn tại không
        if (!fs.existsSync(backgroundPath)) {
            console.error('Thư mục ảnh không tồn tại:', backgroundPath);
            return await interaction.reply({ content: '👑 Đã xảy ra lỗi khi tạo bảng xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
        }

        if (subcommand === 'all') {
            if (validPlayers.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`👑 Hiện tại không có dữ liệu để hiển thị bảng xếp hạng.`);
                return await interaction.reply({ embeds: [embed] });
            }
        
            await interaction.deferReply(); // Trì hoãn phản hồi để tránh lỗi hết thời gian chờ
        
            try {
                Font.loadDefault();
        
                // Cập nhật để sắp xếp lại danh sách theo thứ tự
                const leaderboard = new LeaderboardBuilder()
                    .setHeader({
                        title: `${guild.name} - Top 10 Thành Viên`,
                        subtitle: `${guild.memberCount} thành viên`,
                        image: guild.iconURL({ format: 'png' }) || 'https://i.imgur.com/k00ckcI.png',
                    })
                    .setPlayers(validPlayers.map((player, index) => ({
                        ...player,
                        rank: index + 1 // Đặt rank là chỉ số + 1
                    })))
                    .setBackground(fs.readFileSync(backgroundPath)) // Sử dụng ảnh nền từ thư mục anh
                    .setVariant('default');
        
                const image = await leaderboard.build({ format: 'png' });
                const attachment = new AttachmentBuilder(image, { name: 'leaderboard.png' });
        
                await interaction.editReply({ files: [attachment] });
            } catch (error) {
                console.error("Error building leaderboard image:", error);
                await interaction.editReply({ content: '👑 Đã xảy ra lỗi khi tạo bảng xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
            }
        } else if (subcommand === 'user') {
            const memberRank = validPlayers.find(player => player.username === member.user.username);

            if (validPlayers.length === 0 || !memberRank) {
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`👑 ${member} Chưa nhận được XP nào, hãy thử lại khi ${member} trò chuyện thêm một chút.`);
                return await interaction.reply({ embeds: [embed] });
            }

            await interaction.deferReply();

            try {
                const displayName = memberRank.displayName;
                const username = memberRank.username;
                const avatar = memberRank.avatar;
                const currentXP = memberRank.xp;
                const requiredXP = (memberRank.level * memberRank.level * 20) + 20;
                const level = memberRank.level;
                const rank = validPlayers.findIndex(player => player.username === username) + 1; // Đặt rank là chỉ số + 1

                Font.loadDefault();

                const rankCard = new RankCardBuilder()
                    .setDisplayName(displayName)
                    .setUsername(username)
                    .setAvatar(avatar)
                    .setCurrentXP(currentXP)
                    .setRequiredXP(requiredXP)
                    .setLevel(level)
                    .setRank(rank)
                    .setOverlay(90)
                    .setBackground(fs.readFileSync(backgroundPath)) // Sử dụng ảnh nền từ thư mục anh
                    .setStatus('online')
                    .setTextStyles({
                        level: "LEVEL :", // Văn bản tùy chỉnh cho cấp độ
                        xp: "EXP :", // Văn bản tùy chỉnh cho điểm kinh nghiệm
                        rank: "RANK :", // Văn bản tùy chỉnh cho thứ hạng
                    })
                    .setProgressCalculator((currentXP, requiredXP) => {
                        const percentage = Math.floor((currentXP / requiredXP) * 100);
                        return Math.max(percentage, 0); // Đảm bảo giá trị không âm
                    });

                rankCard.setStyles({
                    progressbar: {
                        thumb: {
                            style: {
                                backgroundColor: "cyan",
                            },
                        },
                    },
                });

                const card = await rankCard.build({ format: 'png' });
                const attachment = new AttachmentBuilder(card, { name: 'rank.png' });

                const embed2 = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('Rank Card')
                    .setDescription(`📊 **${username}** hiện đang ở vị trí thứ **${rank}** với Level **${level}** và XP **${currentXP}**.`)
                    .setImage('attachment://rank.png');

                await interaction.editReply({ embeds: [embed2], files: [attachment] });
            } catch (error) {
                console.error("Error building rank card:", error);
                await interaction.editReply({ content: '⚠️ Đã xảy ra lỗi khi tạo thẻ xếp hạng. Vui lòng thử lại sau.', ephemeral: true });
            }
        } else if (subcommand === 'setup-level') {
            const channel1 = options.getChannel('channel1');
            const level1 = options.getInteger('level1');
            const channel2 = options.getChannel('channel2');
            const level2 = options.getInteger('level2');
            const channel3 = options.getChannel('channel3');
            const level3 = options.getInteger('level3');

            // Cập nhật cấu hình mongoDB


            // Kiểm tra vai trò trong các kênh
            const rolesInChannel1 = channel1.guild.roles.cache.filter(role => channel1.permissionOverwrites.cache.has(role.id));
            const rolesInChannel2 = channel2.guild.roles.cache.filter(role => channel2.permissionOverwrites.cache.has(role.id));
            const rolesInChannel3 = channel3.guild.roles.cache.filter(role => channel3.permissionOverwrites.cache.has(role.id));

            console.log(`Vai trò trong kênh ${channel1.name}: ${rolesInChannel1.map(role => role.name).join(', ')}`);
            console.log(`Vai trò trong kênh ${channel2.name}: ${rolesInChannel2.map(role => role.name).join(', ')}`);
            console.log(`Vai trò trong kênh ${channel3.name}: ${rolesInChannel3.map(role => role.name).join(', ')}`);

            // Đảm bảo rằng các cấp độ được nhập theo thứ tự giảm dần
            if (!(level1 > level2 && level2 > level3)) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('⚠️ Cấp độ cần thiết phải được sắp xếp theo thứ tự từ cao nhất đến thấp nhất.\n\nVui lòng nhập lại lệnh với các cấp độ đúng thứ tự.')
                    .addFields(
                        { name: 'Kênh yêu cầu level cao nhất', value: `\`${level1}\` phải lớn hơn \`${level2}\`, và \`${level2}\` phải lớn hơn \`${level3}\`.` },
                    );
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            try {
                // Cập nhật quyền cho các vai trò trong kênh 1
                rolesInChannel1.forEach(async role => {
                    await channel1.permissionOverwrites.edit(role.id, {
                        ViewChannel: true,                 // Cho phép xem kênh
                        ReadMessageHistory: true,          // Cho phép đọc lịch sử tin nhắn
                        SendMessages: false,               // Không cho phép gửi tin nhắn
                        ManageChannels: false,             // Không cho phép quản lý kênh
                        AddReactions: false,               // Không cho phép thêm phản ứng
                        AttachFiles: false,                // Không cho phép gửi tệp đính kèm
                        MentionEveryone: false,            // Không cho phép gắn thẻ @everyone
                        ManageMessages: false,             // Không cho phép quản lý tin nhắn
                        EmbedLinks: false,                 // Không cho phép nhúng liên kết
                        UseExternalEmojis: false,          // Không cho phép sử dụng emoji ngoài
                        Connect: false,                    // Không cho phép kết nối vào kênh thoại
                        Speak: false,                      // Không cho phép nói trong kênh thoại
                        Stream: false,                     // Không cho phép phát trực tiếp
                        MoveMembers: false,                // Không cho phép di chuyển thành viên trong kênh thoại
                        PrioritySpeaker: false,            // Không cho phép ưu tiên phát biểu trong kênh thoại
                        UseVAD: false,                     // Không cho phép sử dụng phát hiện giọng nói
                        ChangeNickname: false,             // Không cho phép thay đổi biệt danh
                        ManageNicknames: false,            // Không cho phép quản lý biệt danh
                        ManageRoles: false,                // Không cho phép quản lý vai trò
                        ManageWebhooks: false,             // Không cho phép quản lý webhook
                        DeafenMembers: false,              // Không cho phép câm thành viên
                        MuteMembers: false,                // Không cho phép làm im thành viên
                        ViewAuditLog: false,               // Không cho phép xem nhật ký kiểm toán
                        // Các quyền khác tắt hết
                    });
                });

                // Cập nhật quyền cho các vai trò trong kênh 2
                rolesInChannel2.forEach(async role => {
                    await channel2.permissionOverwrites.edit(role.id, {
                        ViewChannel: true,                 // Cho phép xem kênh
                        ReadMessageHistory: true,          // Cho phép đọc lịch sử tin nhắn
                        SendMessages: false,               // Không cho phép gửi tin nhắn
                        ManageChannels: false,             // Không cho phép quản lý kênh
                        AddReactions: false,               // Không cho phép thêm phản ứng
                        AttachFiles: false,                // Không cho phép gửi tệp đính kèm
                        MentionEveryone: false,            // Không cho phép gắn thẻ @everyone
                        ManageMessages: false,             // Không cho phép quản lý tin nhắn
                        EmbedLinks: false,                 // Không cho phép nhúng liên kết
                        UseExternalEmojis: false,          // Không cho phép sử dụng emoji ngoài
                        Connect: false,                    // Không cho phép kết nối vào kênh thoại
                        Speak: false,                      // Không cho phép nói trong kênh thoại
                        Stream: false,                     // Không cho phép phát trực tiếp
                        MoveMembers: false,                // Không cho phép di chuyển thành viên trong kênh thoại
                        PrioritySpeaker: false,            // Không cho phép ưu tiên phát biểu trong kênh thoại
                        UseVAD: false,                     // Không cho phép sử dụng phát hiện giọng nói
                        ChangeNickname: false,             // Không cho phép thay đổi biệt danh
                        ManageNicknames: false,            // Không cho phép quản lý biệt danh
                        ManageRoles: false,                // Không cho phép quản lý vai trò
                        ManageWebhooks: false,             // Không cho phép quản lý webhook
                        DeafenMembers: false,              // Không cho phép câm thành viên
                        MuteMembers: false,                // Không cho phép làm im thành viên
                ViewAuditLog: false,               // Không cho phép xem nhật ký kiểm toán
                                // Các quyền khác tắt hết
                    });
                });

                // Cập nhật quyền cho các vai trò trong kênh 3
                rolesInChannel3.forEach(async role => {
                    await channel3.permissionOverwrites.edit(role.id, {
                        ViewChannel: true,                 // Cho phép xem kênh
                        ReadMessageHistory: true,          // Cho phép đọc lịch sử tin nhắn
                        SendMessages: false,               // Không cho phép gửi tin nhắn
                        ManageChannels: false,             // Không cho phép quản lý kênh
                        AddReactions: false,               // Không cho phép thêm phản ứng
                        AttachFiles: false,                // Không cho phép gửi tệp đính kèm
                        MentionEveryone: false,            // Không cho phép gắn thẻ @everyone
                        ManageMessages: false,             // Không cho phép quản lý tin nhắn
                        EmbedLinks: false,                 // Không cho phép nhúng liên kết
                        UseExternalEmojis: false,          // Không cho phép sử dụng emoji ngoài
                        Connect: false,                    // Không cho phép kết nối vào kênh thoại
                        Speak: false,                      // Không cho phép nói trong kênh thoại
                        Stream: false,                     // Không cho phép phát trực tiếp
                        MoveMembers: false,                // Không cho phép di chuyển thành viên trong kênh thoại
                        PrioritySpeaker: false,            // Không cho phép ưu tiên phát biểu trong kênh thoại
                        UseVAD: false,                     // Không cho phép sử dụng phát hiện giọng nói
                        ChangeNickname: false,             // Không cho phép thay đổi biệt danh
                        ManageNicknames: false,            // Không cho phép quản lý biệt danh
                        ManageRoles: false,                // Không cho phép quản lý vai trò
                        ManageWebhooks: false,             // Không cho phép quản lý webhook
                        DeafenMembers: false,              // Không cho phép câm thành viên
                        MuteMembers: false,                // Không cho phép làm im thành viên
                        ViewAuditLog: false,               // Không cho phép xem nhật ký kiểm toán
                        // Các quyền khác tắt hết
                    });
                });


                // Cập nhật cấu hình kênh và level cho máy chủ
                await levelSchema.findOneAndUpdate(
                    { Guild: guild.id },
                    {
                        $set: {
                            "Channels.channel1": channel1.id,
                            "Levels.level1": level1,
                            "Channels.channel2": channel2.id,
                            "Levels.level2": level2,
                            "Channels.channel3": channel3.id,
                            "Levels.level3": level3
                        }
                    },
                    { upsert: true, new: true }
                );
                
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription('📊 Thiết lập quyền truy cập kênh dựa trên cấp độ thành công!')
                    .addFields(
                        { name: 'Kênh cho level top 1', value: `${channel1}`, inline: true },
                        { name: 'Kênh cho level top 1', value: `${channel2}`, inline: true },
                        { name: 'Kênh cho level top 3', value: `${channel3}`, inline: true },
                        { name: 'Level yêu cầu top 1', value: `${level1}`, inline: true },
                        { name: 'Level yêu cầu top 2', value: `${level2}`, inline: true },
                        { name: 'Level yêu cầu top 3', value: `${level3}`, inline: true }
                    );
                    
                return await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Lỗi khi cập nhật kênh:', error);
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('⚠️ Đã xảy ra lỗi khi thiết lập quyền truy cập kênh. Vui lòng thử lại sau.');
                return await interaction.reply({ embeds: [embed] });
            }
        }
    }
}    

