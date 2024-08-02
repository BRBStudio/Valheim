const ascii = require('ascii-table');
const fs = require('fs');

function loadCommands(client) {
    const table = new ascii().setHeading("Commands", "Status");

    let commandsArray = [];
    let prefixCommandsArray = [];

    // Đọc các thư mục chứa lệnh Slash
    const commandsFolder = fs.readdirSync('./Commands');
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'));

        // Kiểm tra lỗi khi có tệp lệnh trong thư mục không có đầy đủ thông tin
        if (commandFiles.length === 0) {
            console.error(`Không có tệp lệnh hợp lệ trong thư mục '${folder}'.`);
            continue;
        }


        for (const file of commandFiles) {
            try {
                const commandFile = require(`../Commands/${folder}/${file}`);

                // Báo lỗi khi file không có đầy đủ thông tin 'data.name' hoặc không hợp lệ
                if (!('data' in commandFile) || !commandFile.data || !commandFile.data.name) {
                    console.error(`Tệp lệnh '${file}' thiếu thông tin cần thiết (data.name).`);
                    table.addRow(file, "error (missing data.name)");
                    continue;
                }

                // Đăng ký lệnh Slash
                client.commands.set(commandFile.data.name, commandFile);

                commandsArray.push(commandFile.data.toJSON());

                table.addRow(file, "loaded");
            } catch (error) {
                console.error(`Không thể tải lệnh gạch chéo ${file}:`, error);
                table.addRow(file, "error");
            }
        }
    }

    // Đọc các thư mục chứa lệnh prefix
    const prefixCommandsFolder = fs.readdirSync('./PrefixCommands');
    for (const file of prefixCommandsFolder) {
        if (file.endsWith('.js')) {
            try {
                const commandFile = require(`../PrefixCommands/${file}`);

                // Báo lỗi khi file không có đầy đủ thông tin 'execute' hoặc không hợp lệ
                if (!('execute' in commandFile)) {
                    console.error(`Tệp lệnh '${file}' thiếu thông tin cần thiết (execute).`);
                    table.addRow(file, "error (missing execute)");
                    continue;
                }

                // Đăng ký lệnh prefix
                client.prefixCommands.set(commandFile.name, commandFile);

                prefixCommandsArray.push(commandFile.name);

                table.addRow(file, "loaded (prefix)");
            } catch (error) {
                console.error(`Không thể tải lệnh tiền tố ${file}:`, error);
                table.addRow(file, "lỗi (tiền tố)");
            }
        }
    }

    // Đăng ký các lệnh Slash với Discord
    try {
        client.application.commands.set(commandsArray);
    } catch (error) {
        console.error('Không thể đăng ký lệnh Slash với Discord:', error);
    }

    console.log(table.toString(), "\nLệnh đã tải");

    return { commandsArray, prefixCommandsArray };
}

module.exports = { loadCommands };
