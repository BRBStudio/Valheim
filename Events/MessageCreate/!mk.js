const { EmbedBuilder } = require(`discord.js`)
const config = require(`../../config`)

module.exports = {
    name: 'messageCreate',
    execute(msg) {
        embed = new EmbedBuilder()
                .setColor(config.embedCyan)
                .setDescription(`\`\`\`yml\n123456sd5wd1d1wd65s1đư61d1ad\`\`\``)

        if(msg.content === '!mk') {
            msg.reply({content: `Xin chào! đây là mật khẩu vào game valheim của bạn:`, embeds: [embed], ephemeral: true})
        }
    }
};
