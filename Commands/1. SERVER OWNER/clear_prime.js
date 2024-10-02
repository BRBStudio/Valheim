const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const interactionError = require('../../Events/WebhookError/interactionError');
const { checkOwner } = require(`../../permissionCheck`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear_prime")
        .setDescription("🗑️ | Xóa tất cả tin nhắn trong kênh")
        .setDMPermission(false)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Số lượng tin nhắn cần xóa')
                .setRequired(true)),

    async execute(interaction) {

            const hasPermission = await checkOwner(interaction);
            if (!hasPermission) return;

            // Trì hoãn trả lời để giảm chi phí API
            await interaction.deferReply({ ephemeral: true });

            // Lấy kênh và khởi tạo bộ đếm cho các tin nhắn đã xóa
            const channel = interaction.channel;
            const amount = interaction.options.getInteger('amount');
            let deletedSize = 0;

        try {
            // Lấy tất cả tin nhắn và xóa chúng một cách đơn lẻ
            const fetchedMessages = await channel.messages.fetch({ limit: amount });
            await Promise.all(fetchedMessages.map(async (message) => {
                await message.delete();
                deletedSize++;
            }));
        } catch (error) {
            // console.error("Lỗi khi xóa tin nhắn:", error);
            // return interaction.followUp({
            //   content: "Đã xảy ra lỗi khi xóa tin nhắn.",
            // });
            interactionError.execute(interaction, error, client);
        }

            // Gửi thông báo sau khi đã xóa tin nhắn
            await interaction.followUp({
            content: `Đã xóa thành công **${deletedSize}** tin nhắn trong kênh này.`,
        });
    },
};
