const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config');
const { row3 } = require('../../ButtonPlace/ActionRowBuilder');
const { createInviteEmbed, createReportEmbed, createEmptyCategoryEmbed, createEmbedEmbed } = require(`../../Embeds/embedsCreate`)

// Biểu tượng cảm xúc danh mục lệnh slash
const SlashCommandEmojis = {
    '0. DEV': `👩🏻‍💻`,
    '1. SERVER OWNER': '👑',
    '2. ADMIN': '♛',
    '3. ADMIN 1': '♛',
    '4. THÀNH VIÊN': '👨‍👨‍👦‍👦',
    '5. THÀNH VIÊN 1': '👨‍👨‍👦‍👦',
    '6. RANK & XP': '🏆',
    '7. AI': '🤖',
    '8. GAMES': '🎮',
    'NUDE 18+': '🔞',
    'TUYỂN_DỤNG': '💼',
    'Utils': '🛠️',
    'other': '⌛' // Danh mục Mặc định
};

// Biểu tượng cảm xúc danh mục lệnh prefix
const PrefixCommandsEmojis = {
    '2. PREFIX': '♛', // Chuyển đổi khóa thành chữ in hoa để đồng nhất
    '1. PREFIXOFADMIN': '👑',
    'AI': '🤖',
    'Games': '🎮',
    'NUDE 18+': '🔞',
    'Rank & XP': '🏅',
    'Thành Viên': '🙋🏻‍♂️',
    'TUYỂN_DỤNG': '💼',
    'Utils': '🛠️',
    'other': '⌛' // Danh mục Mặc định
};

// Biểu tượng cảm xúc file lệnh, chỉ chứa tên file không có đuôi
const fileEmojis = {
    'Create-Role': `🎭`,
    'anti-swear': '🤬',
    'ban': `⚠️`,
    'brb': '📑',
    'commands-bot': '📜',
    'hi': '👋🏻',
    'discordjs-guide': '🔣',
    'ping': '🏓',
    'pickrole-add-role': '🔲',
    'pickrole-message-create': '🔲',
    'pickrole-message-delete': '🔲',
    'setup-server': '🖧',
    'leave-guild': '💬',
    'verification': '「 ✔ ᵛᵉʳᶦᶠᶦᵉᵈ 」',
    'welcome-setup': '🤝',
    'AI-LẤY-TRỘM-EMOJI': '👁️',
    'AI-TIẾNG-ANH': '🔣',
    'AI-TIẾNG-VIỆT': '🔣',
    'CHÀO-THÀNH-VIÊN': '👋',
    'ĐÂY-LÀ-AI': '🔍',
    'rank': '👑',
    'thanks': '🥰',
    'xp-reset': '🔄',
    'xpuse-reset': '🔄',
    'solve': `🔏`,
    'speak': `🗣️`,
    'invite': `🤖`,
    'invites-code': `👨🏻‍💻`,
    'profile': `📝`,
    'review': `💯`,
    'role-members': `📋`,
    'statute-server': `💬`,
    'todo': `📝`,
    'translate': `🌐`,
    'vote-image': `⭐`,
    'shows-role-members': `🔎`,
    'get-help': `🤝`,
    'help-valheim': `🆘`,
    'info-server': `🗄️`,
    'test-userinfo': `📑`
};

// Biểu tượng cảm xúc file lệnh, chỉ chứa tên file không có đuôi
const prefixEmojis = {
    'hello': '💬',
    'greet': '🤝'
};

// Đọc các lệnh prefix từ thư mục PrefixCommands
const prefixCommands = {};
const prefixCategories = {};
const prefixFolders = fs.readdirSync('./PrefixCommands');
for (const folder of prefixFolders) {
    const commandFiles = fs.readdirSync(`./PrefixCommands/${folder}`).filter(file => file.endsWith('.js'));
    const folderName = folder.toUpperCase();
    prefixCategories[folderName] = []; // Khởi tạo danh mục
    
    for (const file of commandFiles) {
        const fileNameWithoutExt = file.split('.').shift();
        prefixCommands[fileNameWithoutExt] = {
            name: fileNameWithoutExt,
            description: `Đây là lệnh prefix, hãy dùng ?${fileNameWithoutExt}`,
            emoji: prefixEmojis[fileNameWithoutExt] || '•'
        };
        prefixCategories[folderName].push(fileNameWithoutExt); // Thêm vào danh mục
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands-bot')
        .setDMPermission(false)
        .setDescription('Liệt kê tất cả các lệnh hoặc thông tin về một lệnh cụ thể'),

    async execute(interaction, client) {
        const commandFolders = fs.readdirSync('./Commands').filter(folder => !folder.startsWith('.'));
        const commandsByCategory = {};

        // Xử lý các lệnh trong thư mục Commands
        for (const folder of commandFolders) {
            const folderName = folder.toUpperCase();
            const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const fileNameWithoutExt = file.split('.').shift();
                const { default: commandFile } = await import(`./../${folder}/${file}`);
                if (commandFile && commandFile.data) {
                    commands.push({ 
                        name: commandFile.data.name, 
                        description: commandFile.data.description, 
                        emoji: fileEmojis[fileNameWithoutExt] || '•' 
                    });
                } else {
                    console.error(`Không tìm thấy dữ liệu lệnh trong tệp: ${file}`);
                }
            }

            commandsByCategory[folderName] = commands;
        }

        // Tạo các tùy chọn cho menu thả xuống lệnh gạch chéo
        const slashCommandOptions = Object.keys(commandsByCategory).map(folder => ({
            label: `${SlashCommandEmojis[folder] || '⌛'} ${folder}`,
            value: `slash-${folder}` // Phân biệt lệnh Slash
        }));

        // Tạo các tùy chọn cho menu thả xuống lệnh tiền tố
        const prefixOptions = Object.keys(prefixCategories).map(category => ({
            label: `${PrefixCommandsEmojis[category] || '❓'} ${category}`,
            value: `prefix-${category}` // Phân biệt danh mục tiền tố
        }));

        // Tạo menu thả xuống lệnh gạch chéo
        const slashSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('slash-category-select')
            .setPlaceholder('🔹 Chi tiết về lệnh gạch chéo (/)')
            .addOptions(slashCommandOptions.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.label)
                .setValue(option.value)));

        // Tạo menu thả xuống lệnh tiền tố
        const prefixSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('prefix-category-select')
            .setPlaceholder('🔸 Chi tiết về lệnh tiền tố (?)')
            .addOptions(prefixOptions.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.label)
                .setValue(option.value)));

        const embed = createEmbedEmbed(client)

        const row1 = new ActionRowBuilder()
            .addComponents(slashSelectMenu);

        const row2 = new ActionRowBuilder()
            .addComponents(prefixSelectMenu);

        const message = await interaction.reply({ embeds: [embed], components: [row1, row2, row3], ephemeral: false, fetchReply: true });

        const filter = i => i.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if (i.isStringSelectMenu()) {
                await i.deferUpdate();

                const [type, value] = i.values[0].split('-');
                if (type === 'slash') {
                    const selectedCategory = value;
                    const categoryCommands = commandsByCategory[selectedCategory];

                    if (categoryCommands.length === 0) {
                        const emptyCategoryEmbed = createEmptyCategoryEmbed(client)
                        
                            await i.editReply({ embeds: [emptyCategoryEmbed], components: [row1, row2, row3] });
                        
                    }

                    const commandChunks = chunkArray(categoryCommands, 25);

                    for (const chunk of commandChunks) {

                        const categoryEmbed = new EmbedBuilder()
                            .setTitle(`${selectedCategory}`)
                            .setDescription(config.DescriptionSlash)
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields(chunk.map(command => {
                                const name = `${command.emoji || ''} ${command.name || `Tên không xác định`}`;
                                const description = command.description || 'Không có mô tả';
                                return { name, value: description };
                            }));

                        try {
                            await i.editReply({ embeds: [categoryEmbed], components: [row1, row2, row3] });
                        } catch (error) {
                            console.error(`Lỗi cập nhật tương tác1: ${error.message}`);
                        }
                    }
                } else if (type === 'prefix') {
                    const selectedCategory = value;
                    const categoryCommands = prefixCategories[selectedCategory] || [];

                    if (categoryCommands.length === 0) {
                        const emptyCategoryEmbed = createEmptyCategoryEmbed(client)

                        try {
                            await i.editReply({ embeds: [emptyCategoryEmbed], components: [row1, row2, row3] });
                        } catch (error) {
                            console.error(`Lỗi cập nhật tương tác khi thư mục trống: ${error.message}`);
                        }
                        return;
                    }

                    const commandChunks = chunkArray(categoryCommands.map(cmd => ({
                        name: cmd,
                        description: client.prefixDescriptions[cmd] || 'Không có mô tả',
                        emoji: prefixCommands[cmd].emoji
                    })), 25);

                    for (const chunk of commandChunks) {
                        const categoryEmbed = new EmbedBuilder()
                            .setTitle(`${selectedCategory}`)
                            .setDescription(config.DescriptionPrefix)
                            .setThumbnail(client.user.displayAvatarURL())
                            .addFields(chunk.map(command => {
                                const name = `${command.emoji || ''} ${command.name || `Tên không xác định`}`;
                                const description = command.description || 'Không có mô tả';
                                return { name, value: description };
                            }));

                        try {
                            await i.editReply({ embeds: [categoryEmbed], components: [row1, row2, row3] });
                        } catch (error) {
                            console.error(`Lỗi cập nhật tương tác1: ${error.message}`);
                        }
                    }
                }
            }

            if (i.isButton()) {
                if (i.customId === 'deleteButton') {
                    try {
                        await i.update({ content: 'Đã xóa bỏ.', components: [], embeds: [] });
                        setTimeout(() => interaction.deleteReply().catch(() => {}), 0);
                    } catch (error) {
                        console.error(`Lỗi xóa phản hồi: ${error.message}`);
                    }
                }

                if (i.customId === 'inviteButton') {

                    const inviteEmbed = createInviteEmbed(client)
                    
                    try {
                        await i.update({ embeds: [inviteEmbed], components: [row3] }); // thay thế bằng components: [new ActionRowBuilder().addComponents(homeButton, reportButton, inviteButton, deleteButton)]
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác invite: ${error.message}`);
                    }
                }

                if (i.customId === 'reportButton') {
                    const reportEmbed = createReportEmbed(client)
                    
                    try {
                        await i.update({ embeds: [reportEmbed], components: [row3] }); // thay thế bằng components: [new ActionRowBuilder().addComponents(homeButton, reportButton, inviteButton, deleteButton)]
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác báo cáo: ${error.message}`);
                    }
                }

                if (i.customId === 'homeButton') {
                    try {
                        await i.update({ embeds: [embed], components: [row1, row2, row3] });
                    } catch (error) {
                        console.error(`Lỗi cập nhật tương tác trang chủ: ${error.message}`);
                    }
                }
            }
        });
    },
};

// Hàm chia mảng thành các phần nhỏ hơn
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}