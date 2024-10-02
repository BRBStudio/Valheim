const { EmbedBuilder, ChannelType, version } = require(`discord.js`)
const config = require(`../config`)
const os = require('node:os');
const osu = require('node-os-utils');
require(`loadavg-windows`);
const cpuStat = require(`cpu-stat`);
const tinycolor = require('tinycolor2');
const gethelpSchema = require(`../schemas/gethelpSchema`);





const createPingEmbed = (client, interaction) => {
    const icon = interaction.user.displayAvatarURL();
    const tag = interaction.user.tag;

    return new EmbedBuilder()
        .setTitle('**`🏓・PONG!`**')
        .setDescription(`**\`🍯・ĐỘ TRỄ: ${client.ws.ping} ms\`**`)
        .setColor(config.embedRed)
        .setFooter({ text: `Được yêu cầu bởi ${tag}`, iconURL: icon })
        .setTimestamp();
};

const createEmojiEmbed = async (interaction) => {
    const guildOwner = await interaction.guild.fetchOwner();

    return new EmbedBuilder()
        .setTitle(`THÔNG BÁO`)
        .setColor(config.embedGreen)
        .setDescription(`Bạn bị liệt vào danh sách đen và không thể sử dụng lệnh. Liên hệ ***${guildOwner.user.username}*** nếu điều này là sai`) // Liên hệ [Valheim Survival](https://discord.com/users/940104526285910046)
}

const createHiEmbed = (interaction) => {

    return new EmbedBuilder()
        .setTitle(`Chào mừng bạn đến ${interaction.guild.name}!`)
        .setDescription(
            `Chào mừng đến với máy chủ của chúng tôi! Chúng tôi đã biến nơi đây thành sân chơi đúng nghĩa, nhưng chúng ta có thể vui chơi và được là chính mình! Bạn có thể trò chuyện, chơi hoặc làm bất cứ điều gì bạn muốn ở đây. Tôi hy vọng chúng ta có thể kết bạn lâu dài và vui vẻ cùng nhau!\n\nNếu bạn cần bất kỳ trợ giúp nào, hãy liên hệ với một trong các Admin để được hỗ trợ bằng cách sử dụng lệnh này: </admin:1172947009410437142> hoặc bạn có thể dùng tag vai trò như @ADMIN, nhưng việc tag người dùng có ID là '1215380543815024700' sẽ bị loại bỏ vì đây là acc clone của Dev.`
        )
        .setColor(config.embedYellow);
};

const createStatsEmbed = async (client, interaction) => {
        const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏓 | Đang tìm nạp số liệu thống kê...').setColor('Red')] });

        const meminfo = await osu.mem.info();
        const usedPercent = meminfo.usedMemPercentage;
        const freePercent = meminfo.freeMemPercentage;
        const usedMem = os.totalmem() - os.freemem();

    // Hàm tính toán bộ nhớ đệm
    function calculateCachedMemoryGB() {
        const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024); // Tổng bộ nhớ hệ thống tính bằng GB
        const freeMemoryGB = os.freemem() / (1024 * 1024 * 1024); // Bộ nhớ còn trống tính bằng GB
        const usedMemoryGB = totalMemoryGB - freeMemoryGB; // Bộ nhớ đã sử dụng tính bằng GB

        // Tính toán bộ nhớ đệm
        const cachedMemoryGB = usedMemoryGB - (process.memoryUsage().heapUsed / (1024 * 1024 * 1024));
        return cachedMemoryGB.toFixed(0);
    }

    // Hàm tính toán tỷ lệ sử dụng CPU
    function calculateCpuUsage() {
        const cpus = os.cpus();
        const adjustedTotalCores = cpus.length / 2;

        // Tính toán tổng sử dụng CPU
        const totalUsage = cpus.reduce((acc, core) => acc + core.times.user + core.times.nice + core.times.sys + core.times.idle, 0);

        // Tính toán tỷ lệ sử dụng CPU dựa trên tổng số lõi đã điều chỉnh
        const cpuPercentage = ((1 - cpus[0].times.idle / totalUsage) * adjustedTotalCores) / 10;
        return cpuPercentage.toFixed(2);
    }

    // Hàm định dạng thời gian hoạt động
    function formatUptime(uptime) {
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));

        return `d ${days}・h ${hours}・m ${minutes}・s ${seconds}`;
    }

    // Hàm định dạng kích thước bytes
    function formatBytes(bytes) {
        let size;
        if (bytes < 1000) size = `${bytes} B`;
        else if (bytes < 1000000) size = `${(bytes / 1000).toFixed(2)} KB`;
        else if (bytes < 1000000000) size = `${(bytes / 1000000).toFixed(2)} MB`;
        else if (bytes < 1000000000000) size = `${(bytes / 1000000000).toFixed(2)} GB`;
        else if (bytes < 1000000000000000) size = `${(bytes / 1000000000000).toFixed(2)} TB`;
        return size;
    }

    // Tạo embed số liệu thống kê
    return new EmbedBuilder()
        .setTitle(`:chart_with_upwards_trend: Số liệu thống kê của ${client.user.username}`)
        .setColor('Random')
        .setDescription(`\`\`\`yml\nTên: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nĐộ trễ API: ${client.ws.ping}ms\nĐộ trễ người dùng: ${Math.floor(msg.createdAt - interaction.createdAt)}ms\nThời gian hoạt động: ${formatUptime(client.uptime)}\`\`\``)
        .addFields([
            {
                name: ':bar_chart: Thống kê chung',
                value: `\`\`\`yml\nTổng số máy chủ: ${client.guilds.cache.size}\nNgười dùng: ${client.guilds.cache.map((e) => e.memberCount).reduce((a, b) => a + b, 0).toLocaleString()}\nDiscordJS: v${version}\nNodeJS: ${process.version}\`\`\``,
                inline: false,
            },
            {
                name: ':gear: Thống kê hệ thống',
                value: `\`\`\`yml\nHệ điều hành: ${os.type().replace('Windows_NT', 'Windows').replace('Darwin', 'macOS')}\nPhiên bản của hệ điều hành: ${os.platform() + ' ' + os.release()}\nThời gian hoạt động: ${formatUptime(os.uptime())}\nCPU: ${os.arch()}\`\`\``,
                inline: false,
            },
            {
                name: ':file_cabinet: Thống kê CPU',
                value: `\`\`\`yml\nChip ${cpuStat.avgClockMHz().toFixed(0)} MHz\nLõi: ${osu.cpu.count()}\nSử dụng CPU: ${calculateCpuUsage()}% / 50%\`\`\``,
                inline: true,
            },
            {
                name: ':straight_ruler: Thống kê RAM',
                value: `\`\`\`yml\nTổng bộ nhớ: ${formatBytes(os.totalmem())}\nBộ nhớ còn trống: ${formatBytes(os.freemem())} (${freePercent}%)\nBộ nhớ đã sử dụng: ${formatBytes(usedMem)} (${usedPercent.toFixed(1)}%)\nBộ nhớ đệm: ${calculateCachedMemoryGB()} GB\`\`\``,
                inline: false,
            },
            {
                name: ':man_technologist_tone1: Thống kê khác',
                value: `\`\`\`yml\nSố lượng lệnh: ${client.commands.size}\nSố lượng kênh: ${client.channels.cache.size.toLocaleString()}\nEmojis: ${client.emojis.cache.size.toLocaleString()}\`\`\``,
                inline: true,
            },
            { name: '`⚙️`** | Nhà phát triển:**', value: `\`\`\`yml\nValheim Survival\`\`\``, inline: true },
        ])
        .setThumbnail(`https://i.imgur.com/9bQGPQM.gif`) //https://i.imgur.com/9bQGPQM.gif
        .setImage('https://i.imgur.com/mBvxp6R.gif')
        .setFooter({ text: `Phiên bản: ${config.botVersion}` });
};

const createServerDetailsEmbed = (biggestServer) => {
    return new EmbedBuilder()
        .setColor("Green")
        .setTitle("Chi tiết máy chủ")
        .setImage(`https://i.imgur.com/e36VjTp.gif`)
        .setDescription("Dưới đây là chi tiết về máy chủ lớn nhất")
        .addFields([
            { name: 'Tên máy chủ', value: biggestServer.name },
            { name: 'ID Máy chủ', value: biggestServer.id },
            { name: 'Số lượng thành viên', value: `${biggestServer.memberCount}` },
            { name: 'Ngày thành lập', value: biggestServer.createdAt },
            { name: 'Nhấp link bên dưới để vào máy chủ', value: biggestServer.invite },
            { name: 'Người sở hữu', value: biggestServer.owner }
        ]);
};

const createMissingPermissionsEmbed = (missingPermissionsGuilds) => {
    return new EmbedBuilder()
        .setColor("Red")
        .setTitle("Thiếu quyền hạn")
        .setDescription("Các máy chủ sau không có đủ quyền hạn để bot lấy thông tin chi tiết:")
        .addFields(
            missingPermissionsGuilds.map(guild => ({
                name: 'Tên máy chủ',
                value: guild.name,
                inline: true
            }),
            {
                name: 'ID Máy chủ',
                value: guild.id,
                inline: true
            },
            {
                name: 'Thiếu quyền hạn',
                value: guild.missingPermissions.join(', '),
                inline: true
            }
        ))
        
};

const createBasicEmbed = (interaction) => {
        const { guild } = interaction;
        const { members, stickers, role } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL();
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;
        const channels = interaction.guild.channels.cache.size; // tổng số kênh hiện có trong một máy chủ
        const category = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size // danh mục
        const text = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size // kênh văn bản
        const voice = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size // kênh thoại
        const username1 = "Valheim Survival";
        const username2 = "Test15";
                        
        const user1 = guild.members.cache.find((member) => member.user.username === username1); // Tìm người dùng đầu tiên
        const user2 = guild.members.cache.find((member) => member.user.username === username2); // Tìm người dùng thứ 2                      
        const combinedValue = `\`\`\`diff\n+ ${user1?.displayName || `${username1}`} \n+ ${user2?.displayName || `${username2}`} \`\`\``; // Kết hợp thông tin cho cả hai người dùng trong một giá trị bằng cách sử dụng các ký tự mẫu
        const coloredNameField = { 
                    name: `\`\`\`\u200b ✨✿ **Người điều hành** ✿✨ \`\`\``, // màu name của .addfield{} 
        };

        /////////////////////// Đếm số lượng kênh thông báo
        const announcementChannels = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement); // kênh thông báo
        const announcementCount = announcementChannels.size;

        const stage = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size // Kênh sân khấu
        const forum = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size // tổng kênh chủ đề bất kể công khai hay riêng tư.

        //// bộ đếm kênh chát ///////////////////////////////
        const threadChannels = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.PublicThread); // kênh chủ đề riêng tư
        const threadCount = threadChannels.size;

        ///////// danh sách thay thế, ví dụ ${usename} = ...
        const rolelist = guild.roles.cache.toJSON().join(' ')
        const botCount = members.cache.filter(member => member.user.bot).size
        const vanity = guild.vanityURLCode || '[Facebook](https://www.facebook.com/profile.php?id=100092393403399)'
        const sticker = stickers.cache.size
        const highestrole = interaction.guild.roles.highest
        const animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size
        const description = interaction.guild.description || 'No description'
        
        //////// Thêm các người dùng khác nếu cần
        const usernameMap = {
            user1: "Valheim Survival",
            user2: "Pasunom",      
        };

        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);

        const toPascalCase = (string, separator = false) => {
        const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
          return separator ? splitPascal(pascal, separator) : pascal;
        };

        const features = guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None"

        let baseVerification = guild.verificationLevel;

        ////////////////////////// Cấp độ xác minh
        if (baseVerification == 0) baseVerification = "Không có"
        if (baseVerification == 1) baseVerification = "Thấp"
        if (baseVerification == 2) baseVerification = "Trung bình"
        if (baseVerification == 3) baseVerification = "Cao"
        if (baseVerification == 4) baseVerification = "Rất cao"

    return new EmbedBuilder()
        .setAuthor({ name: name, iconURL: icon })
        .setURL("https://discord.com/channels/1028540923249958912/1173537274542174218")
        .setDescription("Chào mừng đến kỷ nguyên mới\n\nđây là FB của tôi nếu bạn cần sự hỗ trợ từ FB\n***[Facebook](https://www.facebook.com/profile.php?id=100092393403399)***\n\n> Lệnh hỗ trợ\n```/help```\n*Bot của ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★*\n`Bot Valheim` or ``Khi nào có sẽ cho vào``\n\n[Link Youtube](https://www.youtube.com/channel/UCg1k7_fu9RnEWO5t6p630bA)\n\n``@ADMIN``, ``@BRB STUDIO``, ``#channel``, ``@Thành Viên``, @here, @everyone đề cập đến\n\n|| Các lệnh của bot||\n\n**Đang chỉnh, chưa dùng được. Để không ảnh hưởng đến bot hoạt động, đề nghị không dùng cho đến khi có thông báo mới **\n~~/menu~~\n\n> ||Lệnh của admin||\n__/ban__\n__/unban__\n__/kick__\n__/poll__\n__/verification__\n\n> ||Lệnh của người dùng||\n**/basic(giải đáp thắc mắc cơ bản)**\n**/user-info**\n**/help**\n**/event**\n**/giverole**\n**/hi**\n**/ping**")
        .addFields(
            {
                name: "» Làm sao để lấy link mod?",
                value: "Đầu tiên bạn cần vào **[📌┊🦋rules🦋](https://discord.com/channels/1028540923249958912/1173537274542174218)** để kích hoạt tài khoản lên thành viên, khi trở thành thành viên bạn sẽ thấy [📂┊🦋𝑳𝒊𝒏𝒌-𝑴𝒐𝒅🦋](https://discord.com/channels/1028540923249958912/1111674941557985400)",
                inline: false
            },
            {
                name: "» Thế giới có thường xuyên cập nhật không? có thông báo khi server cập nhật không?",
                value: "Tất nhiên rồi, nó được công khai mà :))",
                inline: false
            },
            {
                name: "» Vào đâu để biết khi nào có sự kiện",
                value: "[🏇┊🦋event-sự-kiện🦋](https://discord.com/channels/1028540923249958912/1139719596820152461)",
                inline: false
            },
            { name: `» Vai trò cao nhất`,
                value: `${highestrole}`,
                inline: true
            },
            { 
                name: "» Ngày tạo",
                value: `<t:${parseInt(createdTimestamp / 1000 )}:R>`,
                inline: true
            },
            { 
                name: "» Chủ sở hữu máy chủ",
                value: `<@${ownerId}>`,
                inline: true
            },
            { 
                name: "» URL độc quyền",
                value: `${vanity}`,
                inline: true
            },
            { 
                name: "» Số lượng thành viên",
                value: `${memberCount - botCount}`,
                inline: true
            },
            { 
                name: "» Số lượng bot",
                value: `${botCount}`,
                inline: true
            },
            { 
                name: "» Số lượng emoji",
                value: `${emojis}`,
                inline: true
            },
            { 
                name: "» Biểu tượng cảm xúc hoạt hình",
                value: `${animated}`,
                inline: true
            },
            { 
                name: "» Số lượng nhãn dán",
                value: `${sticker}`,
                inline: true
            },
            { 
                name: `» Số lượng vai trò`,
                value: `${roles}`,
                inline: true
            },
            { 
                name: "» Cấp độ xác minh",
                value: `${baseVerification}`,
                inline: true
            },
            { 
                name: "» Tăng số lượng",
                value: `${guild.premiumSubscriptionCount}`,
                inline: true
            },
            { 
                name: "» Kênh",
                value: `Tổng: 📜 ${channels} | <:4974discordcreatecategorywhite:1204771498355855401> ${category} | <:m_channel:1204771510305296474> ${text} | <:6322channelvoice:1204771500574507019> ${voice} | <:1697discordannouncementwhite:1204771495998529576> ${announcementCount} | <:6528channelstage:1204771502885568553> ${stage} | <:9372discordforumdark:1204771507981787156> ${forum} | <:8582discordthreadwhite:1204771505481711616> ${threadCount}`,
                inline: false
            },
            { 
                name: `» Chức năng dành cho máy chủ`,
                value: `\`\`\`${features}\`\`\``
            },
            {
                name: `» Danh sách vai trò`,
                value: `${rolelist}`
            },
            {
                name: `» Số lượng Chủ đề công khai`,
                value: `${threadCount}`
            },
            { 
                name: coloredNameField.name,
                value: combinedValue,
                inline: true
            },
        )
        .setImage("https://images-ext-2.discordapp.net/external/z5x-r6jMsdwwIB3154VGplo0GI42Bd1ma3wXgvmcq5A/https/i.ibb.co/Wf34yd3/standard.gif")
        .setThumbnail("https://images-ext-2.discordapp.net/external/_T0Cb2tVMjPrszLCx-7Do1A5lRZrPliSVzbno44v6kU/https/i.ibb.co/S54HQLJ/standard-2.gif")
        .setColor(config.embedBlurple)
        .setFooter({ text: `Server ID: ${id}`})
        .setTimestamp();
}

const createStealEmojiEmbed = (emoji, name) => {

    return new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`Thêm ${emoji}, với cái tên ${name}`);
};
       
const createStatusBotEmbed = async (interaction) => {

    const guild = interaction.guild;
    const members = await guild.members.fetch();
    const bots = members.filter(member => member.user.bot);

    const onlineBots = [];
    const offlineBots = [];

    bots.forEach(bot => {
        if (bot.presence?.status === 'online') {
            onlineBots.push(bot.user);
        } else {
            offlineBots.push(bot.user);
        }
    });

    const onlineBotsField = onlineBots.length ? onlineBots.map(bot => `- ${bot}`).join('\n') : 'Không có bot nào online';
    const offlineBotsField = offlineBots.length ? offlineBots.map(bot => `- ${bot}`).join('\n') : 'Không có bot nào offline';

    // Tạo đường kẻ dọc với ký tự `│` cho cột dài nhất
    const maxLines = Math.max(onlineBots.length, offlineBots.length);
    const verticalLine = Array(maxLines).fill('│').join('\n');

    return new EmbedBuilder()
        .setTitle(`Trạng thái của các bot trong máy chủ ***${guild.name}***`)
        .addFields(
            { name: 'Bot Online', value: onlineBotsField, inline: true },
            { name: '\u200B', value: verticalLine, inline: true }, // Đây là đường thẳng dọc
            { name: 'Bot Offline', value: offlineBotsField, inline: true }
        )
        .setColor('Green')
        .setTimestamp();

};

// Hàm tạo embed cho tin nhắn bí mật
const createSecretMessageEmbed = (message) => {
    return new EmbedBuilder()
        .setColor('Blue')
        .setDescription(message);
};

// Hàm tạo embed cảnh báo
const createSnoopingWarningEmbed = (member) => {
    return new EmbedBuilder()
        .setColor('Yellow')
        .setDescription(`⚠️ Tin nhắn này dành cho ${member} dừng việc soi mói đi nhé :))`);
};

// tạo hàm embed 
const createNotificationEmbed = (interaction) => {
    const { options } = interaction;
    const title = options.getString('title');
    const description = options.getString('description');
    const color = options.getString('color');
    const image = options.getAttachment('image');

    // Chuyển đổi tên màu thành mã HEX
    const colorObject = tinycolor(color);

    if (!colorObject.isValid()) {
        return { error: true, message: "Màu bạn nhập không hợp lệ." };
    }

    // Chuyển đổi tên màu thành mã HEX
    const colorCode = colorObject.toHexString();

    
    const embed = new EmbedBuilder()
        .setColor(colorCode)
        .setFooter({ text: "Time", iconURL: "https://s.wsj.net/public/resources/images/OG-DW646_202003_M_20200302171613.gif" })
        .setTimestamp();

    if (title) {
        embed.setTitle(title);
    }
    if (description) {
        embed.setDescription(description);
    }
    if (image) {
        embed.setImage(image.attachment);
    }

    return { error: false, embed };
};

const createErrorEmbed = (color) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Error')
        .setDescription('Sai thông tin khi tạo ra đối tượng tương lai của bạn.');
};

// 
const createBadWordsEmbed = (message) => {
    return new EmbedBuilder()
        .setTitle(`Hệ thống kiểm duyệt tự động`)
        .setColor(config.embedRed)
        .setTimestamp()
        .setThumbnail('https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTHsK1ZoItA_jI8Qsh_g-KScUGYtHjh5MqFuQGjFQAXyKD8UYneQToPyqYOgGzQWnbl')
        .setDescription(`${message.author}, tin nhắn của bạn đã bị hệ thống kiểm duyệt tự động của chúng tôi phát hiện vì vi phạm các quy tắc máy chủ của chúng tôi. Tình trạng này sẽ được điều tra thêm.`)
        .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`);
};

// Hàm mới tạo logEmbed
const createLogEmbed = (message) => {
    const now = new Date();
    const dayOfWeek = now.toLocaleString('vi-VN', { weekday: 'long' });
    const month = now.toLocaleString('vi-VN', { month: 'long' });
    const day = now.toLocaleString('vi-VN', { day: 'numeric' });
    const year = now.getUTCFullYear();

    return new EmbedBuilder()
        .setTitle(`Hệ thống kiểm duyệt tự động`)
        .setColor(config.embedWhite)
        .setThumbnail('https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTHsK1ZoItA_jI8Qsh_g-KScUGYtHjh5MqFuQGjFQAXyKD8UYneQToPyqYOgGzQWnbl')
        .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
        .setTimestamp()
        .addFields(
            {
                name: '🙋‍♂️ **Từ**',
                value: `${message.author}`,
                inline: false,
            },
            {
                name: '📜 **Tin nhắn**',
                value: `${message.content}`,
                inline: true,
            },
            {
                name: '🕓 Ngày',
                value: `${dayOfWeek} ngày ${day} ${month} Năm ${year}`,
                inline: true,
            }
        );
};

const createInviteEmbed = (client) => {
    const clientId = client.user.id;

    return new EmbedBuilder()
        .setTitle(config.TitleInviteBot)
        .setDescription(config.DescriptionInviteBot(clientId)) // Gọi hàm với clientId
        .setThumbnail(client.user.displayAvatarURL());
};

const createReportEmbed = (client) => {
    return new EmbedBuilder()
        .setTitle(config.TitleReportBot)
        .setDescription(config.DescriptionReportBot)
        .setThumbnail(client.user.displayAvatarURL());
};

const createEmptyCategoryEmbed = (client) => {
    return new EmbedBuilder()
        .setTitle(config.TitleEmptyCategory)
        .setDescription(config.DescriptionEmptyCategory)
        .setColor(config.embedGreen)
        .setThumbnail(client.user.displayAvatarURL());
};

const createEmbedEmbed = (client) => {
    return new EmbedBuilder()
        .setTitle(config.TitleCommandsHelp)
        .setDescription(config.DescriptionCommandsHelp)
        .setThumbnail(client.user.displayAvatarURL());
};

const createChannelNotFoundEmbed = (nameChannel) => {
    return new EmbedBuilder()
        .setColor('Green')
        .setTitle(`❗ KHÔNG TÌM THẤY KÊNH ${nameChannel}`)
        .setDescription(`Máy chủ cần có kênh văn bản ***${nameChannel}*** để nhận đơn ứng tuyển của thành viên`);
};

// Hàm tạo embed cho Discord
function createDiscordEmbed(tag, icon, botIcon, reason, age, position, experience, user, guild, joinedAtFormatted) {
    return new EmbedBuilder()
        .setTitle('ĐƠN ĐĂNG KÝ TUYỂN DỤNG DISCORD')
        .setAuthor({ name: tag, iconURL: icon })
        .setThumbnail(botIcon)
        .setImage('https://www.shrm.org/content/dam/en/shrm/topics-tools/news/talent-acquisition/202101-Talent-Trends-1_bi4qgd.gif')
        .setDescription(`**Người nộp đơn:** ${user.displayName} \n\n**Lý do:** ${reason} \n\n **Tuổi:** ${age} \n\n **Vị trí ứng tuyển:**\n - ${position} \n\n **Kinh nghiệm:** ${experience}`)
        .addFields({ name: `Đã tham gia ${guild.name}`, value: joinedAtFormatted, inline: false })
        .setTimestamp();
}

// Hàm tạo embed cho Valheim
function createValheimEmbed(tag, icon, botIcon, reason, age, position, experience, user, guild, joinedAtFormatted) {
    return new EmbedBuilder()
        .setTitle('ĐƠN ĐĂNG KÝ TUYỂN DỤNG VALHEIM')
        .setAuthor({ name: tag, iconURL: icon })
        .setThumbnail(botIcon)
        .setImage('https://www.shrm.org/content/dam/en/shrm/topics-tools/news/talent-acquisition/202101-Talent-Trends-1_bi4qgd.gif')
        .setDescription(`**Người nộp đơn:** ${user.displayName} \n\n**Lý do:** ${reason} \n\n **Tuổi:** ${age} \n\n **Vị trí ứng tuyển:**\n - ${position} \n\n **Kinh nghiệm:** ${experience}`)
        .addFields({ name: `Đã tham gia ${guild.name}`, value: joinedAtFormatted, inline: false })
        .setTimestamp();
}

const createGetHelpListEmbed = async (interaction) => {
    const serverId = interaction.guild.id;

    let data = await gethelpSchema.findOne({ serverId });

            if (!data || data.userIds.length === 0) {
                await interaction.reply('Chưa có người dùng nào được thiết lập để nhận yêu cầu trợ giúp.');
                return;
            }

            // Tạo danh sách người dùng để hiển thị
            const userTags = data.userIds.map(id => `<@${id}>`).join('\n');

    return new EmbedBuilder()
        .setTitle('DANH SÁCH NGƯỜI GIÚP ĐỠ')
        .setDescription(`Danh sách người dùng hiện tại sẽ giúp đỡ thành viên trong bài viết diễn đàn:\n\n${userTags}`)
        .setColor('Random')
        .setTimestamp();
};

const createGetHelpDMEmbed = async (interaction) => {

    return new EmbedBuilder()
        .setTitle(`YÊU CẦU TRỢ GIÚP`)
        .setDescription(`Hãy cố gắng hết sức để hỗ trợ <@${interaction.user.id}>!`)
        .setColor('Random')
        .setImage('https://cdn.dribbble.com/users/66340/screenshots/3089041/spinner2.gif')
        .setTimestamp();
};

const createGetHelpTagEmbed = async (interaction) => {
    const serverId = interaction.guild.id;

    const data = await gethelpSchema.findOne({ serverId });

            if (!data || data.userIds.length === 0) {
                await interaction.reply('Chưa có người dùng nào được thiết lập để nhận yêu cầu trợ giúp.');
                return;
            }

            // Tạo danh sách người dùng để tag trong description
            const userTags = data.userIds.map(id => `> <@${id}>`).join('\n');

    return new EmbedBuilder()
        .setTitle('TRỢ GIÚP')
        .setDescription(`<@${interaction.user.id}> đang cần giúp đỡ! Hãy cố gắng hết sức để hỗ trợ họ!\n\n ${userTags}`)
        .setColor('Random')
        .setImage('https://cdn.dribbble.com/users/66340/screenshots/3089041/spinner2.gif')
        .setTimestamp();
};


function createRefreshPingEmbed(wsEmoji, ws, msgEmoji, msgEdit, days, hours, minutes, seconds, interaction) {
    return new EmbedBuilder()
        .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
        .setColor(config.embedGreen)
        .setTimestamp()
        .setFooter({ text: `Đã ping vào` })
        .addFields(
            { name: 'Độ trễ của Websocket', value: `${wsEmoji} \`${ws}ms\`` },
            { name: 'Độ trễ API', value: `${msgEmoji} \`${msgEdit}ms\`` },
            { name: `${interaction.client.user.username} Thời gian hoạt động`, value: `ghi giờ \`${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây\`` }
        );
}

function createIdEmbed(user) {
    return new EmbedBuilder()
        .setTitle(`THÔNG TIN ĐẦY ĐỦ`)
        .setColor(config.embedGreen)
        .addFields({ name: `Tên hiển thị trong máy chủ:`, value: `\`\`\`${user.displayName}\`\`\``, inline: false })
        .addFields({ name: `Tên đăng nhập:`, value: `\`\`\`${user.username}\`\`\``, inline: false })
        .addFields({ name: `ID người dùng:`, value: `\`\`\`yml\n${user.id}\`\`\``, inline: false }) // `\`${user.id}\``
}

module.exports = {
    createPingEmbed,                            // lệnh ping.js
    createHiEmbed,                              // lệnh hi.js
    createStatsEmbed,                           // lệnh info-bot.js
    createServerDetailsEmbed,                   // lệnh server.js
    createMissingPermissionsEmbed,              // lệnh server.js
    createBasicEmbed,                           // lệnh basic.js
    createEmojiEmbed,                           // lệnh emoji.js
    createStealEmojiEmbed,                      // lệnh steal-emoji.js
    createStatusBotEmbed,                       // lệnh status-bot.js
    createSecretMessageEmbed,                   // lệnh message-secret.js
    createSnoopingWarningEmbed,                 // lệnh message-secret.js
    createNotificationEmbed,                    // lệnh notification.js
    createErrorEmbed,                           // lệnh notification.js
    createBadWordsEmbed,                        // dùng cho badwords.js trong thư mục Events
    createLogEmbed,                             // dùng cho badwords.js trong thư mục Events
    createInviteEmbed,                          // lệnh bot-commands.js
    createReportEmbed,                          // lệnh bot-commands.js
    createEmptyCategoryEmbed,                   // lệnh bot-commands.js
    createEmbedEmbed,                           // lệnh bot-commands.js
    createChannelNotFoundEmbed,                 // lệnh recruitment.js
    createDiscordEmbed,                         // lệnh recruitment.js
    createValheimEmbed,                         // lệnh recruitment.js
    createGetHelpListEmbed,                     // lệnh get-help.js
    createGetHelpDMEmbed,                       // lệnh get-help.js
    createGetHelpTagEmbed,                      // lệnh get-help.js
    createRefreshPingEmbed,                     // dùng tại xủ lý nút refreshping.js và lệnh ping-api.js
    createIdEmbed,                              // lệnh id.js
}