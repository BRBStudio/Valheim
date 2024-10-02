const ascii = require('ascii-table');
const fs = require('fs');

function loadCommands(client) {
    const table = new ascii().setHeading("Commands", "Status");
    const commandData = [];

    let commandsArray = [];
    const commandsFolder = fs.readdirSync('./Commands');
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'));

        if (commandFiles.length === 0) {
            console.error(`Không có tệp lệnh hợp lệ trong thư mục '${folder}'.`);
            continue;
        }

        for (const file of commandFiles) {
            try {
                
                delete require.cache[require.resolve(`../Commands/${folder}/${file}`)]; // Xóa cache của lệnh, dùng để reload lệnh mà không cần khởi động lại bot
                const commandFile = require(`../Commands/${folder}/${file}`);

                if (!('data' in commandFile) || !commandFile.data || !commandFile.data.name) {
                    console.error(`Tệp lệnh '${file}' trong thư mục '${folder}' trống hoặc thiếu thông tin cần thiết (data.name).`);
                    table.addRow(file, "Lỗi (Thiếu data.name)");
                    commandData.push({ name: file, status: 'error' });
                    continue;
                }

                // Thiết lập DMPermission cho tất cả các lệnh
                commandFile.data.setDMPermission(false);

                client.commands.set(commandFile.data.name, commandFile);
                commandsArray.push(commandFile.data.toJSON());
                table.addRow(file, "loaded");
                commandData.push({ name: file, status: 'loaded' });
            } catch (error) {
                console.error(`Không thể tải lệnh gạch chéo ${file} của thư mục ${folder}:`, error);
                table.addRow(file, "error");
                commandData.push({ name: file, status: 'error' });
            }
        }
    }

    try {
        client.application.commands.set(commandsArray);
    } catch (error) {
        console.error('Không thể đăng ký lệnh Slash với Discord:', error);
    }

    // console.log(table.toString(), "\nLệnh đã tải");
    return commandData;
}

module.exports = { loadCommands };
