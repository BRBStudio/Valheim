const { EmbedBuilder } = require(`discord.js`)

module.exports = {
    id: 'btn',
    async execute(interaction, client) {
        const icon = interaction.user.displayAvatarURL();
        const tag = interaction.user.tag;

        const embed = new EmbedBuilder()
            .setTitle('**`🏓・PONG!`**')
            .setDescription(`**\`🍯・ĐỘ TRỄ: ${client.ws.ping} ms\`**`)
            .setColor("Yellow")
            .setFooter({ text: `Được yêu cầu bởi ${tag}`, iconURL: icon })
            .setTimestamp();

        await interaction.update({ embeds: [embed] });
    },
};
