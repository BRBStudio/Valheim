// anti-swear.js
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const AntiwordConfig = require('../../schemas/antiwordSchema');
const colors = require('../../lib/colorConverter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-swear')
        .setDMPermission(false)
        .setDescription('Cấu hình hệ thống chống chửi thề')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addSubcommand(command => command.setName("addword").setDescription('🤬 | Thêm một từ vào danh sách từ xấu').addStringOption(option => option.setName('badword').setDescription('Từ bạn muốn thêm').setRequired(true)))
        .addSubcommand(command => command.setName('channel').setDescription('🤬 | Thiết lập Kênh kiểm duyệt người dùng đã dùng từ xấu').addChannelOption(option => option.setName('channels').setDescription('kênh mà bạn muốn kiểm duyệt người dùng đã dùng từ xấu').setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('🤬 | Xóa một từ khỏi danh sách từ xấu').addStringOption(option => option.setName('word').setDescription('Từ cần xóa').setRequired(true)))
        .addSubcommand(command => command.setName('list').setDescription('🤬 | Xem danh sách từ xấu'))
        .addSubcommand(command => command.setName('removeall').setDescription('🤬 | Xóa tất cả từ xấu'))
        .addSubcommand(command => command.setName('removechannel').setDescription('🤬 | Xóa thiết lập Kênh kiểm duyệt người dùng đã dùng từ xấu')),

    async execute(interaction) {

        if (!interaction.guild) {
                interaction.reply("Bạn chỉ có thể dùng lệnh của bot ở trong sever");
                return;
            }

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            
            case "addword":
                const guildId = interaction.guild.id;
                const badword = interaction.options.getString('badword').toLowerCase();
                let guildConfig = await AntiwordConfig.findOne({ guildId });

                if (!guildConfig) {
                    guildConfig = new AntiwordConfig({
                    guildId: guildId,
                    badWords: [badword]
                    });
                } else {
                        if (!guildConfig.badWords) {
                        guildConfig.badWords = [badword];
                    } else {
                            // Kiểm tra xem từ đó đã tồn tại trong mảng badWords chưa
                            if (!guildConfig.badWords.includes(badword)) {
                            guildConfig.badWords.push(badword);
                        } else {
                            // Nếu từ đã tồn tại, hãy gửi tin nhắn cho biết rằng
                            interaction.reply(`Từ **${badword}** đã tồn tại trong danh sách từ xấu.`);
                            return;
                        }
                    }
                }

                await guildConfig.save();

                const embedAdd = new EmbedBuilder()
                    .setColor(colors.embedBlack) 
                    .setDescription(` Thành công!\n Đã thêm **${badword}** vào danh sách từ xấu`)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`);

                interaction.reply({ embeds: [embedAdd] });
            break;

            case "remove":
                const word = interaction.options.getString('word').toLowerCase();
                const guildIdToRemove = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdToRemove },
                    { $pull: { badWords: word } }
                );

                const embedRemove = new EmbedBuilder()
                    .setColor(colors.embedGreen) 
                    .setDescription(`⛔ Thành công!\n🛑 Đã xóa **${word}** khỏi danh sách từ xấu`)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
                    .setTimestamp();

                await interaction.reply({ embeds: [embedRemove] });
            break;

            case "list":
                const guildIdToList = interaction.guild.id;
                const guildConfigToList = await AntiwordConfig.findOne({ guildId: guildIdToList });

                if (!guildConfigToList || !guildConfigToList.badWords || guildConfigToList.badWords.length === 0) {
                const nowords = new EmbedBuilder()
                    .setColor(colors.embedCyan) 
                    .setDescription(`\`❗ Không có từ nào trong danh sách từ xấu!\``)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
                    .setTimestamp();

                    return interaction.reply({ embeds: [nowords] });
                } else {
                const listembed = new EmbedBuilder()
                    .setAuthor({ name: `Đây là danh sách những từ xấu`, iconURL: interaction.guild.iconURL() })
                    .setDescription(`*${guildConfigToList.badWords.join('\n')}*`)
                    .setImage(`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG9sZmxiYTN4ZXMxaWY3c2R1dHZudGp3bWl4OG1uZmxnZDVmOXJ6MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dhsagLKDGYVySLsDrF/giphy.gif`)
                    .setColor(colors.embedBlack); 
                    await interaction.reply({ embeds: [listembed] });
                }
            break;

            case "channel":
                const selectedChannel = interaction.options.getChannel('channels');
                const guildIdForChannel = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdForChannel },
                    { selectedChannelId: selectedChannel.id }
                );

                interaction.reply(`Tin nhắn đã được gửi vào kênh ${selectedChannel} để bạn kiểm duyệt.`);
            break;

            case "removeall":
                const guildIdToRemoveAll = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdToRemoveAll },
                    { badWords: [] } // Xóa tất cả các từ xấu
                );

                interaction.reply(`Đã xóa tất cả từ xấu khỏi danh sách.`);
            break;

            case "removechannel":
                const guildIdToRemoveChannel = interaction.guild.id;

                await AntiwordConfig.findOneAndUpdate(
                    { guildId: guildIdToRemoveChannel },
                    { $unset: { selectedChannelId: "" } } // Xóa thuộc tính selectedChannelId
                );

                interaction.reply(`Đã xóa thiết lập kênh kiểm duyệt người dùng đã dùng từ xấu.`);
            break;

            default:
                throw new Error('Lệnh không được hỗ trợ.');
            }
    }
};