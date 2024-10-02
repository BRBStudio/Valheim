const { Client, WebhookClient, EmbedBuilder, GatewayIntentBits, Partials, ActivityType, Collection } = require('discord.js');
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const ascii = require('ascii-table');
const colors = require('colors'); // dùng để đổi màu chữ cho terminal

const webhookURL = 'https://discord.com/api/webhooks/1275804964467507281/aOzwICNmgVvXz1SyBOzbKDJmOQiiWhrsXtXqS4fbP0e2-EM2vAz_y2vnPz-PpdB3bC0Z';
const webhookClient = new WebhookClient({ url: webhookURL });

const { User, Message, GuildMember } = Partials

const { loadEvents } = require('./Handlers/EventHandler');
const { loadCommands } = require('./Handlers/CommandsHandler');
const { loadButtons } = require('./Handlers/ButtonHandler'); // Thêm dòng này
const { loadPrefix } = require('./Handlers/PrefixHandler')
const { loadModals } = require ('./Handlers/ModalsHandler')
const { loadContextMenus } = require('./Handlers/ContextMenuHandler'); // Thêm dòng này
const { loadSelectMenus } = require('./Handlers/SelectMenusHandler'); // Thêm dòng này

const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers, // theo dõi các thành viên
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildPresences, // theo dõi trạng thái
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution
        ],
    partials: [User, Message, GuildMember],
});


const config = require('./config');
client.config = config;

// Kiểm soát phiên bản //
const currentVersion = `${config.botVersion}`;
const { checkVersion } = require('./lib/version');

client.commands = new Collection();
client.prefixCommands = new Collection(); // Thêm dòng này
client.prefixCommandsDescriptions = {}; // Thêm dòng này
client.buttons = new Collection(); // Thêm dòng này
client.contextMenus = new Collection(); // Thêm dòng này
client.modals = new Collection(); // Thêm dòng này
client.selectMenus = new Collection(); // Thêm dòng này
client.roleSelectMenus = new Collection();

// Nạp các lệnh button
const buttonPath = path.join(__dirname, 'InteractionTypes/buttons');
const buttonFiles = fs.readdirSync(buttonPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const button = require(path.join(buttonPath, file));
    // client.buttons.set(button.customId, button);
    client.buttons.set(button.id, button); // Đặt ID nút để xử lý sau này
}

// client.login(process.env.token).then(() => {
//     loadEvents(client);
//     loadCommands(client);
//     loadButtons(client); // Thêm dòng này
//     checkVersion(currentVersion);
//     loadPrefix(client)
// });

// gộp Events, Commands... vào 1 hàng trong terminal
client.login(process.env.token).then(() => {
    const eventData = loadEvents(client);
    const commandData = loadCommands(client);
    const buttonData = loadButtons(client);
    const prefixData = loadPrefix(client);
    const contextMenuData = loadContextMenus(client); // Thêm dòng này
    const modalData = loadModals(client); // Thêm dòng này
    const selectMenuData = loadSelectMenus(client); // Thêm dòng này

    // const combinedTable = new ascii().setHeading('Events', 'Events Status', 'Commands', 'Commands Status', 'Buttons', 'Buttons Status', 'Prefix Commands', 'Prefix Commands Status');
    // const combinedTable1 = new ascii().setHeading('contextMenu', 'contextMenu Status', 'modal', 'modal Status', 'selectMenu', 'selectMenu Status');

    // Tạo bảng ASCII không màu để định dạng dữ liệu
    const combinedTable = new ascii().setHeading(
        'Events'.padEnd(3),
        'Events Status'.padEnd(3),
        'Commands'.padEnd(3),
        'Commands Status'.padEnd(3),
        'Buttons'.padEnd(3),
        'Buttons Status'.padEnd(3),
        'Prefix Commands'.padEnd(3),
        'Prefix Commands Status'.padEnd(3)
    );

    const combinedTable1 = new ascii().setHeading(
        'contextMenu'.padEnd(3),
        'contextMenu Status'.padEnd(3),
        'modal'.padEnd(3),
        'modal Status'.padEnd(3),
        'selectMenu'.padEnd(3),
        'selectMenu Status'.padEnd(3),
    );

    // Tìm số lượng bản ghi lớn nhất
    const maxLength = Math.max(
        eventData.length,
        commandData.length,
        buttonData.length,
        prefixData.length,
        contextMenuData.length, // Thêm dòng này
        modalData.length, // Thêm dòng này
        selectMenuData.length, // Thêm dòng này
    );

    // Điền dữ liệu vào bảng tổng hợp
    for (let i = 0; i < maxLength; i++) {
        const event = eventData[i] || { name: '', status: '' };
        const command = commandData[i] || { name: '', status: '' };
        const button = buttonData[i] || { name: '', status: '' };
        const prefix = prefixData[i] || { name: '', status: '' };
        const contextMenu = contextMenuData[i] || { name: '', status: '' }; // Thêm dòng này
        const modal = modalData[i] || { name: '', status: '' }; // Thêm dòng này
        const selectMenu = selectMenuData[i] || { name: '', status: '' }; // Thêm dòng này

        // combinedTable.addRow(
        //     event.name || '',
        //     event.status || '',
        //     command.name || '',
        //     command.status || '',
        //     button.name || '',
        //     button.status || '',
        //     prefix.name || '',
        //     prefix.status || '',
        // );

        // combinedTable1.addRow(
        //     contextMenu.name || '', // Thêm dòng này
        //     contextMenu.status || '', // Thêm dòng này
        //     modal.name || '', // Thêm dòng này
        //     modal.status || '', // Thêm dòng này
        //     selectMenu.name || '', // Thêm dòng này
        //     selectMenu.status || '' // Thêm dòng này
        // );

        combinedTable.addRow(
            event.name.padEnd(3),
            event.status.padEnd(3),
            command.name.padEnd(3),
            command.status.padEnd(3),
            button.name.padEnd(3),
            button.status.padEnd(3),
            prefix.name.padEnd(3),
            prefix.status.padEnd(3)
        );

        combinedTable1.addRow(
            contextMenu.name.padEnd(3),
            contextMenu.status.padEnd(3),
            modal.name.padEnd(3),
            modal.status.padEnd(3),
            selectMenu.name.padEnd(3),
            selectMenu.status.padEnd(3),
        );

    }

    // Thay đổi màu cho các giá trị trong bảng
    const applyColor = (line) => {
        // Thay đổi màu cho các giá trị cụ thể
        if (line.includes('Events')) {
            return colors.green(line); // màu hàng ngang trên
        } else if (line.includes('Commands')) {
            return colors.white(line); // màu cột
        } else if (line.includes('contextMenu')) {
            return colors.green(line); // màu hàng ngang dưới
        } else {
            return colors.white(line); // Mặc định là màu vàng cho các dòng còn lại
        }
    };

    // const applyColor = (line) => {
    //     // Áp dụng màu cho các tiêu đề và trạng thái
    //     return line
    //         .replace(/(?<=\|\s)Events(?=\s\|)/g, colors.red('$&'))
    //         .replace(/(?<=\|\s)Events Status(?=\s\|)/g, colors.red('$&'))
    //         .replace(/(?<=\|\s)Commands(?=\s\|)/g, colors.green('$&'))
    //         .replace(/(?<=\|\s)Commands Status(?=\s\|)/g, colors.green('$&'))
    //         .replace(/(?<=\|\s)Buttons(?=\s\|)/g, colors.yellow('$&'))
    //         .replace(/(?<=\|\s)Buttons Status(?=\s\|)/g, colors.yellow('$&'))
    //         .replace(/(?<=\|\s)Prefix Commands(?=\s\|)/g, colors.cyan('$&'))
    //         .replace(/(?<=\|\s)Prefix Commands Status(?=\s\|)/g, colors.cyan('$&'))
    //         .replace(/(?<=\|\s)contextMenu(?=\s\|)/g, colors.green('$&'))
    //         .replace(/(?<=\|\s)contextMenu Status(?=\s\|)/g, colors.green('$&'))
    //         .replace(/(?<=\|\s)modal(?=\s\|)/g, colors.magenta('$&'))
    //         .replace(/(?<=\|\s)modal Status(?=\s\|)/g, colors.magenta('$&'))
    //         .replace(/(?<=\|\s)selectMenu(?=\s\|)/g, colors.blue('$&'))
    //         .replace(/(?<=\|\s)selectMenu Status(?=\s\|)/g, colors.blue('$&'));
    // };
    

    // const colorTable = combinedTable.toString().split('\n').map(line => {
    //     // Chỉ thay đổi màu cho nội dung không phải khung
    //     return line.includes('|') ? applyColor(line) : colors.white(line);
    // }).join('\n');

    // const colorTable1 = combinedTable1.toString().split('\n').map(line => {
    //     // Chỉ thay đổi màu cho nội dung không phải khung
    //     return line.includes('|') ? applyColor(line) : colors.white(line);
    // }).join('\n');

    // Áp dụng màu cho các tiêu đề trong bảng
const colorTable = combinedTable.toString().split('\n').map(line => {
    // Áp dụng màu cho các dòng có chứa '|' (khung bảng)
    return line.includes('|') ? applyColor(line) : colors.white(line);
}).join('\n');

const colorTable1 = combinedTable1.toString().split('\n').map(line => {
    // Áp dụng màu cho các dòng có chứa '|' (khung bảng)
    return line.includes('|') ? applyColor(line) : colors.white(line);
}).join('\n');

    // console.log(combinedTable.toString(), "\nTất cả các lệnh đã được tải");
    // console.log(combinedTable1.toString(), "\nCác tương tác bổ sung đã được tải");
    // console.log(combinedTable.toString()); // đang dùng dòng này
    // console.log(combinedTable1.toString()); // đang dùng dòng này

    console.log(colorTable);
    console.log(colorTable1);
    checkVersion(currentVersion,client);
});

// Xử lý lỗi chưa được xử lý (không có try-catch).
process.on('uncaughtException', async (error) => {
    // console.error('Lỗi chưa được xử lý:', error);

    // Xử lý lỗi cụ thể
    let color = "Red";
    let title = "Lỗi chưa được xử lý";
    let description = `**Lỗi Code:** \`${error.name || 'Không xác định'}\`\n**Lỗi tin nhắn:** \`${error.message || 'Không xác định'}\`\n**Hiển thị lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;

    // Xử lý các lỗi cụ thể
    if (error.code === 10062) {
        color = "Purple";
        title = "Lỗi Unknown Interaction";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code === 50013) {
        color = "Blue";
        title = "Lỗi Missing Permissions";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code !== 10008) {
        color = "Green";
        title = "Lỗi Không Xác Định";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code === 10008) {
        color = "Orange";
        title = "Lỗi Unknown Message";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    } else if (error.code === 50007) {
        color = "Pink";
        title = "Lỗi Invalid Form Body";
        description = `**Mã lỗi:** \`${error.code}\`\n**Tin nhắn lỗi:** \`${error.message}\`\n**Chi tiết lỗi:** \`\`\`yml\n${error.stack || 'Không có thông tin lỗi'}\`\`\`\n${error}`;
    }
    
    // Gửi lỗi tới webhook
    try {
        await webhookClient.send({
            embeds: [
                new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: `Bộ nhớ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%` })
                .setTimestamp()
            ]
        });
    } catch (webhookError) {
        console.error('Lỗi khi gửi thông báo lỗi đến webhook:', webhookError);
    }
});

// Được kích hoạt khi một Promise bị từ chối mà không có xử lý lỗi
process.on('unhandledRejection', async (reason, promise) => {
    // console.error('Lỗi từ promise chưa được xử lý:', reason);

    // Xử lý lỗi cụ thể
    let color = "Orange";
    let title = "Lỗi từ promise chưa được xử lý";
    let description = `**Lỗi:** \`${reason.message || 'Không xác định'}\`\n**Promise:** \`${promise}\`\n**Hiển thị lỗi:** \`\`\`yml\n${reason.stack || 'Không có thông tin lỗi'}\`\`\`\n${reason}`;

    // Gửi lỗi tới webhook
    try {
        await webhookClient.send({
            embeds: [
                new EmbedBuilder()
                .setColor(color) 
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: `Bộ nhớ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%` })
                .setTimestamp()
            ]
        });
    } catch (webhookError) {
        console.error('Lỗi khi gửi thông báo lỗi đến webhook:', webhookError);
    }
});

// Được kích hoạt khi một Promise bị từ chối và sau đó được xử lý
process.on('rejectionHandled', (promise) => {
    console.log('Promise bị từ chối sau đó được xử lý:', promise);
    // Xử lý thêm nếu cần
});

// mã màu ansi dùng cho cảnh báo process.on('warning', (warning)
const colorAnsi = {
    red: '\x1b[31m',
    orange: '\x1b[38;5;202m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    pink: '\x1b[38;5;213m',
    torquise: '\x1b[38;5;45m', // Xanh ngọc
    reset: '\x1b[0m',          // màu mặc định

    lightRed: '\x1b[38;5;197m',     // Đỏ sáng
    lightGreen: '\x1b[38;5;82m',    // Xanh lá cây sáng
    lightYellow: '\x1b[38;5;227m',  // Vàng sáng
    lightBlue: '\x1b[38;5;75m',     // Xanh dương sáng
    lightPink: '\x1b[38;5;213m',    // Hồng sáng

    darkRed: '\x1b[38;5;124m',      // Đỏ tối
    darkGreen: '\x1b[38;5;22m',     // Xanh lá cây tối
    darkYellow: '\x1b[38;5;130m',   // Vàng tối
    darkBlue: '\x1b[38;5;17m',      // Xanh dương tối
    darkPink: '\x1b[38;5;199m',     // Hồng tối

    cyan: '\x1b[36m',               // Xanh lam nhạt
    magenta: '\x1b[35m',            // Tím
    gray: '\x1b[90m',               // Xám
    lightGray: '\x1b[37m',          // Xám sáng
    darkGray: '\x1b[90m',           // Xám đen

    lightCyan: '\x1b[96m',          // Xanh lam sáng
    lightMagenta: '\x1b[95m',       // Tím sáng
    darkCyan: '\x1b[36m',           // Xanh lam tối
    darkMagenta: '\x1b[35m',        // Tím tối
    brown: '\x1b[33m',              // Nâu

    purple: '\x1b[35m',             // Tím
    lightPurple: '\x1b[38;5;171m',  // Tím sáng
    deepBlue: '\x1b[38;5;17m',      // Xanh dương sâu
    olive: '\x1b[38;5;64m',         // Xanh ô liu
    teal: '\x1b[38;5;37m',          // Xanh lam xanh

    salmon: '\x1b[38;5;209m',       // Đỏ hồng
    peach: '\x1b[38;5;216m',        // Đào
    lavender: '\x1b[38;5;207m',     // Hoa oải hương
    mint: '\x1b[38;5;119m',         // Xanh bạc hà
    coral: '\x1b[38;5;202m'         // San hô
}

process.on('warning', (warning) => {
    console.warn(`${colorAnsi.red}[ TÊN CẢNH BÁO ]:`, warning.name); // Tên cảnh báo
    console.warn(`${colorAnsi.red}[ NỘI DUNG CẢNH BÁO ]:`, warning.message); // Nội dung cảnh báo
    console.warn(`${colorAnsi.red}[ CHI TIẾT CẢNH BÁO ]:`, warning.stack); // Chi tiết cảnh báo (stack trace)
});


/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/
