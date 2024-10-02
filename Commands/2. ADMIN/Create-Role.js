const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const tinycolor = require('tinycolor2');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-role')
        .setDescription('Tạo vai trò trong máy chủ')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Tên vai trò bạn muốn tạo')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('color')
                .setDescription('Chọn màu sắc của vai trò')
                .setRequired(true)
                .addChoices(
                    { name: "Mầu đỏ", value: "Red" },
                    { name: "Mầu xanh dương", value: "Blue" },
                    { name: "Mầu xanh lá cây", value: "Green" },
                    { name: "Mầu tím", value: "Purple" },
                    { name: "Mầu cam", value: "Orange" },
                    { name: "Mầu vàng", value: "Yellow" },
                    { name: "Mầu đen", value: "Black" },
                    { name: "Mầu xanh lơ (rất đẹp)", value: "Cyan" },
                    { name: "Mầu hồng", value: "Pink" },
                    { name: "Mầu hoa oải hương", value: "Lavender" },
                    { name: "Mầu sẫm (Mầu đỏ sẫm, hơi tím)", value: "Maroon" },
                    { name: "Mầu ô liu", value: "Olive" },
                    { name: "Mầu xanh lam (xanh nước biển)", value: "Teal" },
                    { name: "Mầu bạc", value: "Silver" },
                    { name: "Mầu vàng đồng", value: "Gold" },
                    { name: "Mầu be", value: "Beige" },
                    { name: "Mầu hải quân (xanh dương đậm)", value: "Navy" },
                    { name: "Mầu tím đậm", value: "Indigo" },
                    { name: "Mầu hồng tím", value: "Violet" },
                ))
        .addNumberOption(option =>
            option
                .setName('position')
                .setDescription('Vị trí Vai trò')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('mention')
                .setDescription('Vai trò này có nên được mọi người nhắc đến hay không')
                .addChoices(
                    { name: 'Có', value: 'true' },
                    { name: 'Không', value: 'false' }
                )
                .setRequired(true)),
    async execute(interaction, client) {
        const name = interaction.options.getString('name');
        const position = interaction.options.getNumber('position');
        const mention = interaction.options.getString('mention');
        const colorValue = interaction.options.getString('color');

        // Kiểm tra quyền của bot
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return await interaction.reply({ content: 'Bot không có quyền quản lý vai trò (Manage Roles)', ephemeral: true });
        }

        // Kiểm tra quyền của người dùng
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return await interaction.reply({ content: 'Bạn không có quyền quản lý vai trò (Manage Roles)', ephemeral: true });
        }

        // Tạo ánh xạ giữa giá trị màu và tên màu
        const colorMap = {
            "Red": "Mầu đỏ",
            "Blue": "Mầu xanh dương",
            "Green": "Mầu xanh lá cây",
            "Purple": "Mầu tím",
            "Orange": "Mầu cam",
            "Yellow": "Mầu vàng",
            "Black": "Mầu đen",
            "Cyan": "Mầu xanh lơ (rất đẹp)",
            "Pink": "Mầu hồng",
            "Lavender": "Mầu hoa oải hương",
            "Maroon": "Mầu sẫm (Mầu đỏ sẫm, hơi tím)",
            "Olive": "Mầu ô liu",
            "Teal": "Mầu xanh lam (xanh nước biển)",
            "Silver": "Mầu bạc",
            "Gold": "Mầu vàng đồng",
            "Beige": "Mầu be",
            "Navy": "Mầu hải quân (xanh dương đậm)",
            "Indigo": "Mầu tím đậm",
            "Violet": "Mầu hồng tím"
        };

        const colorHexMap = {
            "Red": "#FF0000",
            "Blue": "#0000FF",
            "Green": "#008000",
            "Purple": "#800080",
            "Orange": "#FFA500",
            "Yellow": "#FFFF00",
            "Black": "#050505",
            "Cyan": "#00FFFF",
            "Pink": "#FFC0CB",
            "Lavender": "#E6E6FA",
            "Maroon": "#800000",
            "Olive": "#808000",
            "Teal": "#008080",
            "Silver": "#C0C0C0",
            "Gold": "#FFD700",
            "Beige": "#F5F5DC",
            "Navy": "#000080",
            "Indigo": "#4B0082",
            "Violet": "#EE82EE"
        };

        const colorName = colorMap[colorValue] || colorValue;

        // Chuyển đổi tên màu thành mã màu hex
        const colorHex = colorHexMap[colorValue] || tinycolor(colorValue).toHexString();

        if (!colorHex) {
            return await interaction.reply({ content: `Không tìm thấy mã màu cho tên màu "${colorValue}"`, ephemeral: true });
        }

        const CreateRoleembed = new EmbedBuilder()
            .setTitle('Tạo vai trò')
            .setDescription(`Bạn muốn tạo một vai trò được đặt tên ***${name}*** có ***${colorName}*** ở vị trí ***${position}***???`)
            .setColor('Random');

        const CreateRoleSuccessembed = new EmbedBuilder()
            .setTitle('Tạo vai trò')
            .setDescription(`Bạn đã tạo một vai trò được đặt tên ***${name}*** có ***${colorName}*** ở vị trí ***${position}***`)
            .setColor('Green');

        const co = new EmbedBuilder()
            .setTitle('Tạo vai trò')
            .setDescription(`Bạn đã tạo vai trò ***${name}*** có ***${colorName}*** ở vị trí ***${position}***`)
            .setColor('Random');

        const khong = new EmbedBuilder()
            .setTitle('Tạo vai trò')
            .setDescription(`Đã hủy việc tạo vai trò ***${name}*** có ***${colorName}*** ở vị trí ***${position}***`)
            .setColor('Random');

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setEmoji(`<:yes:1253444746291183679>`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('no')
                    .setEmoji(`<:_ew_no_:1253443732083179521>`)
                    .setStyle(ButtonStyle.Danger)
            );

        const msg = await interaction.reply({ embeds: [CreateRoleembed], components: [buttons], fetchReply: true, ephemeral: true });

        const collector = msg.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 40000
        });

        collector.on('collect', async i => {
            const id = i.customId;
            const value = id;
        
            if (value === 'yes') {
                try {
                    const createdRole = await interaction.guild.roles.create({
                        name: name,
                        color: colorHex,
                        position: position,
                        mentionable: mention === 'true',
                        permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ViewChannel]
                    });
                    await i.update({ embeds: [CreateRoleSuccessembed], components: [], ephemeral: true });
                } catch (error) {
                    if (error.code === 50013) {
                        const co1 = new EmbedBuilder()
                            .setTitle('SỬA LỖI VAI TRÒ TẠO CAO HƠN VAI TRÒ CỦA BOT')
                            .setDescription(`Bạn đã tạo vai trò ***${name}*** có ***${colorName}*** ở vị trí ***${position}***\nMặc dù vị trí ***${position}*** nằm trên vai trò của bot nhưng vẫn sẽ được tạo và được chuyển xuống vị trí cuối cùng`)
                            .setColor('Red');
                        await i.update({ embeds: [co1], components: [], ephemeral: true });
                    } else {
                        console.error(error);
                        await i.update({ content: 'Đã xảy ra lỗi khi tạo vai trò.', ephemeral: true });
                    }
                }
            } else if (value === 'no') {
                await i.update({ embeds: [khong], components: [], ephemeral: true });
            }
            collector.stop(); // Dừng bộ thu thập sau khi đã xử lý
        });
        
        

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: 'Hết thời gian để trả lời.', components: [], ephemeral: true });
            }
        });
    }
};
