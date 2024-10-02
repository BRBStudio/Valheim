const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");
const { sayModal } = require("../../ButtonPlace/Modals"); // Import modal từ mod.js
const { checkAdministrator } = require(`../../permissionCheck`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName("say-bot")
    .setDMPermission(false)
    .setDescription("Gửi tin nhắn qua bot")
    .setDMPermission(false)
    .addChannelOption(options => options.setName("channel").setDescription("Kênh bạn muốn gửi tin nhắn").setRequired(false)),
    async execute(interaction, client) {

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;
   
        let channel = interaction.options.getChannel("channel");

        if (!channel) { channel = interaction.channel }

        // Hiển thị modal đã được định nghĩa trong mod.js
        await interaction.showModal(sayModal);
    },
};