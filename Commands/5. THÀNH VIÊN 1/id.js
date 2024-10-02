const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createIdEmbed } = require(`../../Embeds/embedsCreate`);
// const checkPermissions = require('../../Handlers/CheckPermissionSpecial');
// const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription('ID người dùng')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Chọn người dùng để lấy ID của họ')),
    async execute(interaction) {

        // const permissionEmbed = new EmbedBuilder().setDescription("`❌` Bạn không có quyền sử dụng lệnh này!").setColor(config.embedGreen).setAuthor({ name: 'BRB Studio Valheim', iconURL: 'https://i.imgur.com/coUpySu.jpg', url: 'https://discord.gg/Jc3QuUEnnd' });
        
        // Kiểm tra quyền đặc biệt
        // if (!checkPermissions(interaction)) {
        //     return interaction.reply({ embeds: [permissionEmbed] });
        // };

        // Lấy người dùng được chọn từ tùy chọn (nếu có), nếu không thì lấy người gửi lệnh
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = createIdEmbed(user)
        
        await interaction.deferReply();
        await interaction.deleteReply();
        // Phản hồi với ID của người dùng được chọn
        // await interaction.reply(`**${user.displayName}** ID người dùng là: \`${user.id}\``);
        await interaction.channel.send({ embeds: [embed] });
    },
};
