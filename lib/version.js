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
    torquise: '\x1b[38;5;45m',
    reset: '\x1b[0m'
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
        const response = await axios.get('https://api.github.com/repos/Kkkermit/Testify/releases/latest');
        const latestVersion = response.data.tag_name;
        return latestVersion;
    } catch (error) {
        console.error(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Lỗi khi truy xuất phiên bản mới nhất. Không tìm thấy bản phát hành. ${color.reset}`);
    }
}

function checkVersion(currentVersion) {
    getLatestVersion().then((latestVersion) => {
        if (currentVersion < latestVersion) {
            console.log(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Chú ý, đã có bản cập nhật mới, vui lòng cài đặt nó - https://`);
        } else {
            console.log(`${color.torquise}[${getTimestamp()}] [PHIÊN BẢN MỚI NHẤT] Bạn có phiên bản mã mới nhất. (${config.botVersion})`);
        }
    });
}

module.exports = { getLatestVersion, checkVersion };