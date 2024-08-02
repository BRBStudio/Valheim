const fs = require('fs');
const ascii = require('ascii-table');

function loadButtons(client) {
    const table = new ascii().setHeading("Button", "Status");

    client.buttons = new Map();
    const buttonFiles = fs.readdirSync('./Buttons').filter(file => file.endsWith('.js'));

    for (const file of buttonFiles) {

    try {
        const button = require(`../Buttons/${file}`);
        client.buttons.set(button.id, button);
        table.addRow(file, "loaded");
        } catch (error) {
            table.addRow(file, "failed");
            console.error(`Lỗi khi nạp button ${file}:`, error);
        }
    }

    console.log(table.toString(), "\nNút đã được tải");

}

module.exports = { loadButtons };
