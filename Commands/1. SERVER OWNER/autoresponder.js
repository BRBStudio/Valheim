const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Autoresponder = require('../../schemas/autoresponderSchema');
const config = require(`../../config`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoresponder')
        .setDescription('Chọn nội dung bot phản hồi với tin nhắn nào')
        .addSubcommand(subcommand =>
        subcommand
            .setName('setup')
            .setDescription('Thiết lập câu mà bot nghe và phản hồi')
            .addStringOption(option => option.setName('sentence').setDescription('Câu mà bot nghe.').setRequired(true))
            .addStringOption(option => option.setName('response').setDescription('Câu trả lời.').setRequired(true))
        )
        .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Hiển thị danh sách nội dung bot phản hồi')
        )
        .addSubcommand(subcommand =>
        subcommand
            .setName('remove-all')
            .setDescription('Xóa tất cả mọi thứ')
        ),

async execute(interaction) {

            const guildOwner = await interaction.guild.fetchOwner();
            
            // Kiểm tra nếu người dùng không phải là chủ sở hữu máy chủ
            if ((interaction.options.getSubcommand() === 'setup' || interaction.options.getSubcommand() === 'remove-all') &&
            interaction.user.id !== guildOwner.id) {
                return await interaction.reply({ content: 'Lệnh này chỉ dành cho chủ sở hữu.', ephemeral: true });
            }

            // Tải các autoresponder từ cơ sở dữ liệu
            const guildId = interaction.guild.id;
            const autoresponders = await Autoresponder.find({ guildId: guildId });

            const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            const word = interaction.options.getString('sentence');
            const response = interaction.options.getString('response');

            // Tạo autoresponder mới và lưu vào cơ sở dữ liệu
            const newAutoresponder = new Autoresponder({ guildId: guildId, questions: [word], answer: [response] });

            await newAutoresponder.save();

            const filter = message => {
                const content = message.content.toLowerCase();

                return content.includes(word);
            };
                
            // const collector = interaction.channel.createMessageCollector({ filter, dispose: true });
            // collector.on('collect', async message => {
            //   await message.channel.send(`${response}`);
            // });

            // Tạo collector cho toàn bộ guild thay vì chỉ một kênh
            const collector = interaction.client.on('messageCreate', async message => {
                if (message.guild.id === guildId && filter(message)) {
                     await message.channel.send(`${response}`);
                }
            });

            const embed = new EmbedBuilder()
                .setTitle('Đã thiết lập trả lời tự động!')
                .addFields(
                    { name: 'Câu mà bot nghe:', value: word },
                    { name: 'Phản ứng tự động:', value: response },
                )
                .setColor(config.embedFuchsia)
                .setTimestamp();

                await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'list') {
            if (autoresponders.length === 0) {
                await interaction.reply('Không có autoresponders nào được cài đặt cho máy chủ này.');
                return;
            }
                
            const fields = [];

            autoresponders.forEach((autoresponder, index) => {
                if (autoresponder.questions.length > 0 && autoresponder.answer.length > 0) {
                     fields.push({ name: `Câu mà bot nghe ${index}:`, value: autoresponder.questions[0] });
                    fields.push({ name: `Phản ứng tự động ${index}:`, value: autoresponder.answer[0] });
                }
            });

            const embed = new EmbedBuilder()
                .setTitle('Danh sách autoresponders')
                .setColor(config.embedFuchsia)
                .addFields(fields)
                .setTimestamp();

                await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'remove-all') {
                
            // Xóa tất cả autoresponders từ cơ sở dữ liệu
            await Autoresponder.deleteMany({ guildId: guildId });

            await interaction.reply({ content: 'Đã xóa tất cả autoresponders.', ephemeral: true });
                
        }
    },
};

/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/