const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomquestionembed } = require(`../../Embeds/embedsDEV`)
const { checkAdministrator } = require(`../../permissionCheck`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('random-question')
    .setDescription('🤔💭 | Gửi một câu hỏi ngẫu nhiên trong kênh hiện tại')
    .addRoleOption(option => option.setName('ping-role').setDescription('chọn vai trò cần ping')),
    async execute(interaction) {

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;
        
        const pingrole = interaction.options.getRole('ping-role') || `Gửi lời chúc tới mn nha`;

        await interaction.deferReply();
        await interaction.deleteReply()

        const msg = await interaction.channel.send({ content: `${pingrole}`, embeds: [randomquestionembed] })
        msg.react('✅')
        msg.react('❌')
    }
}