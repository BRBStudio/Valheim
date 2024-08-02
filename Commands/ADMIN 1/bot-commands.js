const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const fs = require('fs');

// Biểu tượng cảm xúc danh mục lệnh
const commandEmojis = {
    'ADMIN 1': '👑',
    'ADMIN 2': '👑',
    'AI' : '🤖',
    'Games': '🎮',
    'NUDE 18+': '🔞',
    'Rank & XP': '🏅',
    'Thành Viên': '🙋🏻‍♂️',
    'TUYỂN_DỤNG': '💼',
    'Utils': '🛠️',
    'other': '⌛' // Danh mục Mặc định
};

// Biểu tượng cảm xúc file lệnh
const fileEmojis = {
    'rank.js': '👑',
    'thanks.js': '❤',
    'AI-Lời-Chào.js': '💚',
    'modpanel-PhatCoThoiGian.js': '👑',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-commands')
        .setDescription('📜 | Liệt kê tất cả các lệnh hoặc thông tin về một lệnh cụ thể'),

    async execute(interaction, client) {
        const commandFolders = fs.readdirSync('./Commands').filter(folder => !folder.startsWith('.'));
        const commandsByCategory = {};

        for (const folder of commandFolders) {
            // const folderName = folder.toLowerCase(); // Chuyển đổi tên thư mục thành chữ thường
            const folderName = folder.toUpperCase(); // Chuyển đổi tên thư mục thành chữ hoa
            const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const { default: commandFile } = await import(`./../${folder}/${file}`);
                if (commandFile && commandFile.data) {
                    commands.push({ name: commandFile.data.name, description: commandFile.data.description, emoji: fileEmojis[file] || '•' }); // mới thêm emoji cho file nếu không muốn thì bỏ dòng `emoji: fileEmojis[file]`
                } else {
                    console.error(`Không tìm thấy dữ liệu lệnh trong tệp: ${file}`);
                }
            }

            // commandsByCategory[folder] = commands;
            commandsByCategory[folderName] = commands;
        }

        const dropdownOptions = Object.keys(commandsByCategory).map(folder => ({
            // label: folder,
            label: `${commandEmojis[folder] || '⌛'} ${folder}`,
            value: folder
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('category-select')
            .setPlaceholder('❄️ Chọn một danh mục')
            .addOptions(...dropdownOptions.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.label)
                .setValue(option.value)));

        const embed = new EmbedBuilder()
            .setTitle('Command - Help')
            .setDescription('Chọn một danh mục từ menu thả xuống để xem các lệnh')
            .setThumbnail(client.user.displayAvatarURL());

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        const homeButton = new ButtonBuilder()
            .setCustomId("homeButton")
            .setLabel("Trang chủ")
            .setStyle("Primary");
       
        const reportButton = new ButtonBuilder()
            .setCustomId("reportButton")
            .setLabel("Báo cáo")
            .setStyle("Primary");
       
        const inviteButton = new ButtonBuilder()
            .setCustomId("inviteButton")
            .setLabel("Mời Bot")
            .setStyle("Primary");
       
        const deleteButton = new ButtonBuilder()
            .setCustomId("deleteButton")
            .setLabel("Xóa bỏ")
            .setStyle("Danger");

        const row1 = new ActionRowBuilder()
            .addComponents(homeButton, reportButton, inviteButton, deleteButton);

        const message = await interaction.reply({ embeds: [embed], components: [row, row1], ephemeral: false, fetchReply: true });

        const filter = i => i.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
 

            if (i.isStringSelectMenu() && i.customId === 'category-select') {
                // const selectedCategory = i.values[0].toLowerCase(); // Nhận danh mục đã chọn, Chuyển đổi danh mục đã chọn thành chữ thường
                const selectedCategory = i.values[0].toUpperCase(); // Chuyển đổi danh mục đã chọn thành chữ hoa
                const categoryCommands = commandsByCategory[selectedCategory];

                if (categoryCommands.length === 0) {
                    const emptyCategoryEmbed = new EmbedBuilder()
                        .setTitle('Danh mục trống')
                        .setDescription('Vui lòng chọn danh mục khác hoặc chờ DEV thêm vào.')
                        .setColor('Green')
                        .setThumbnail(client.user.displayAvatarURL());

                    try {
                        await i.update({ embeds: [emptyCategoryEmbed], components: [row, row1] });
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác khi thư mục trống: ${error.message}`);
                    }
                    return;
                }

                const commandChunks = chunkArray(categoryCommands, 25);

                for (const chunk of commandChunks) {
                    const categoryEmbed = new EmbedBuilder()
                        .setTitle(`${selectedCategory}`)
                        .setDescription('Danh sách các lệnh có sẵn trong danh mục này:')
                        .setThumbnail(client.user.displayAvatarURL())
                        .addFields(chunk.map(command => {
                            // const name = command.name || `Tên không xác định` // 'Unknown';
                            const name = `${command.emoji || ''} ${command.name || `Tên không xác định`}`; // Thêm emoji vào tên lệnh
                            const description = command.description || 'Không có mô tả';
                            return { name, value: description };
                        }));

                    try {
                        await i.update({ embeds: [categoryEmbed], components: [row, row1] });
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác1: ${error.message}`);
                    }
                }
            }

            if (i.isButton()) {
                if (i.customId === 'deleteButton') {
                    try {
                        await i.update({ content: 'Đã xóa bỏ.', components: [], embeds: [] });
                        setTimeout(() => interaction.deleteReply().catch(() => {}), 0); // Bỏ qua lỗi khi xóa, thay 0 thành 5000 để thành 5s mới xóa1
                    } catch (error) {
                        console.error(`Lỗi xóa phản hồi: ${error.message}`);
                    }
                }

                if (i.customId === 'inviteButton') {
                    const inviteLink = `https://discord.com/oauth2/authorize?client_id=1159874172290334730&permissions=8&scope=bot`;
            
                    const inviteEmbed = new EmbedBuilder()
                        .setDescription(`Sử dụng liên kết dưới đây để mời tôi đến máy chủ của bạn. Tôi yêu cầu quyền **Quản trị** để có chức năng tốt hơn. Tuy nhiên, bạn có thể đặt quyền của tôi theo ý muốn.` +
                        `\n\nNhấp chuột vào [Mời bot](${inviteLink}) để mời.`)
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setColor(0x2b2d31);
            
                    try {
                        await i.update({ embeds: [inviteEmbed], components: [row, row1] });
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác2: ${error.message}`);
                    }
                }

                if (i.customId === 'reportButton') {
                    const reportEmbed = new EmbedBuilder()
                        .setDescription(`Dùng lệnh /mailbox nếu bạn muốn báo cáo bất kỳ lỗi hoặc lỗi nào. Valheim Surival cùng đội ngũ của anh ấy sẽ liên hệ lại với bạn sớm nhất có thể.`)
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setColor(0x2b2d31);

                    try {
                        await i.update({ embeds: [reportEmbed], components: [row, row1] });
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác3: ${error.message}`);
                    }
                }

                if (i.customId === 'homeButton') {
                    try {
                        await i.update({ embeds: [embed], components: [row, row1] });
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác4: ${error.message}`);
                    }
                }
            }
    });

        // collector.on('end', async () => {
        //     try {
        //         await message.edit({ components: [row] }).catch(() => {}); // Bỏ qua lỗi khi chỉnh sửa
        //     } catch (error) {
        //         console.error(`Lỗi cập nhật tương tác5: ${error.message}`);
        //     }
        // });
    }
};

function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
}



//// Liệt kê tất cả các lệnh hoặc thông tin về một lệnh cụ thể ////
//////////////////////////////////////////////////////////////////
//  ____  ____  ____    ____  _             _ _                //
// | __ )|  _ \| __ )  / ___|| |_ _   _  __| (_) ___          //
// |  _ \| |_) |  _ \  \___ \| __| | | |/ _` | |/ _ \        //
// | |_) |  _ <| |_) |  ___) | |_| |_| | (_| | | (_) |      //
// |____/|_| \_\____/  |____/ \__|\__,_|\__,_|_|\___/      //
//                                                        //
///////////////////////////////////////////////////////////