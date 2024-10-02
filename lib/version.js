const axios = require('axios');
const config = require('../config')

// mã màu ansi
const color = {
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

function getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

async function getLatestVersion() {
    try {
        const response = await axios.get('https://api.github.com/repos/BRBSTUDIO/ConMuaLa/releases/latest');
        const latestVersion = response.data.tag_name;
        return latestVersion;
    } catch (error) {
        console.error(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Lỗi khi truy xuất phiên bản mới nhất. Không tìm thấy bản phát hành. ${color.reset}`);
    }
}

function checkVersion(currentVersion, client) {
    getLatestVersion().then((latestVersion) => {

        if (currentVersion < latestVersion) {

            console.log(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Chú ý, đã có bản cập nhật mới, vui lòng cài đặt nó - https://`);

        } else {
            console.log((`${color.yellow}✔️  ${client.user.username} đã được bật\n✔️  ID Bot: ${client.user.id}`));

            console.log(`${color.peach}Đảm bảo tham gia máy chủ hỗ trợ nếu bạn cần bất kỳ trợ giúp nào: ${config.LinkMoiBot}`); // link mời bot

            console.log(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Bạn có phiên bản mã mới nhất. (${config.botVersion})`);
        }
    });
}

module.exports = { getLatestVersion, checkVersion };