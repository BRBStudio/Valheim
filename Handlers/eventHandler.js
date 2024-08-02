// function loadEvents(client) {
//     const ascii = require('ascii-table')
//     const fs = require('fs')
//     const table = new ascii().setHeading('Events', "Status");

//     const folders = fs.readdirSync('./Events');
//     for (const folder of folders) {
//         const files = fs.readdirSync(`./Events/${folder}`).filter((file) => file.endsWith(".js"));

//         for (const file of files) {
//             const event = require(`../Events/${folder}/${file}`);

//             if (event.rest) {
//                 if (event.once)
//                     client.rest.once(event.name, (...args) =>
//                         client.execute(...args, client)
//                     );
//                 else
//                     client.rest.on(event.name, (...args) =>
//                         event.execute(...args, client)
//                     );
//             } else {
//                 if (event.once)
//                     client.once(event.name, (...args) => event.execute(...args, client));
//                 else client.on(event.name, (...args) => event.execute(...args, client));
//             }
//             table.addRow(file, "loaded");
//             continue;
//         }
//     }

//     // Thêm phần tải sự kiện cho Buttons
//     const buttonFiles = fs.readdirSync('./Events/Button').filter(file => file.endsWith('.js'));
//     for (const file of buttonFiles) {
//         const event = require(`../Events/Button/${file}`);
//         client.on(event.name, (...args) => event.execute(...args, client));
//         table.addRow(file, "loaded");
//     }

//     return console.log(table.toString(), "\nSự kiện đã tải");
// }

// module.exports = { loadEvents }

const ascii = require('ascii-table');
const fs = require('fs');

function loadEvents(client) {
    const table = new ascii().setHeading('Events', 'Status');

    const folders = fs.readdirSync('./Events');
    for (const folder of folders) {
        const files = fs.readdirSync(`./Events/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            try {
                const event = require(`../Events/${folder}/${file}`);

                if (event.rest) {
                    if (event.once) {
                        client.rest.once(event.name, (...args) =>
                            event.execute(...args, client)
                        );
                    } else {
                        client.rest.on(event.name, (...args) =>
                            event.execute(...args, client)
                        );
                    }
                } else {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                }
                table.addRow(file, 'loaded');
            } catch (error) {
                console.error(`Không thể tải sự kiện ${file}:`, error);
                table.addRow(file, 'error');
            }
        }
    }

    console.log(table.toString(), '\nSự kiện đã tải');
}

module.exports = { loadEvents };
