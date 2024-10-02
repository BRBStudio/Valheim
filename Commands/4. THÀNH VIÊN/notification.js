const { SlashCommandBuilder } = require('discord.js');
const { createNotificationEmbed, createErrorEmbed } = require('../../Embeds/embedsCreate');
const { checkManageMessages } = require(`../../permissionCheck`);

module.exports = {
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName('notification')
        .setDescription('Tạo thông báo mới bằng embed')
        .addStringOption(option => option
            .setName('title')
            .setDescription('Tiêu đề nội dung của bạn. Mẹo nhỏ: nên viết hoa tiêu đề sẽ ấn tượng hơn')
            .setRequired(true))
        .addStringOption(option => option
            .setName('description')
            .setDescription('Mô tả nội dung của bạn')
            .setRequired(false))
        .addStringOption(option => option
            .setName('color')
            .setDescription('Màu cạnh viền của bạn')
            .setRequired(false)
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
            )
        )
        .addAttachmentOption(option => option
            .setName('image')
            .setDescription('Hình ảnh của bạn')
            .setRequired(false)),

    async execute(interaction) {

        // Kiểm tra quyền quản lý tin nhắn
        const hasPermission = await checkManageMessages(interaction);
        if (!hasPermission) return; // Nếu không có quyền, thoát khỏi hàm

        const { error, embed, message } = createNotificationEmbed(interaction);

        if (error) {
            return await interaction.reply({ content: message, ephemeral: true });
        }

        try {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {

            const embedError = createErrorEmbed(embed.color);

            await interaction.reply({ embeds: [embedError], ephemeral: true });
        }
    }
};

