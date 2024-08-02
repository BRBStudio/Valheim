// const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('ping')
//         .setDescription('Ping! Xem tốc độ phản hồi của bot.'),

//     async execute(interaction, client) {
//         const icon = interaction.user.displayAvatarURL();
//         const tag = interaction.user.tag;

//         const embed = new EmbedBuilder()
//             .setTitle('**`🏓・PONG!`**')
//             .setDescription(`**\`🍯・ĐỘ TRỄ: ${client.ws.ping} ms\`**`)
//             .setColor("Yellow")
//             .setFooter({ text: `Được yêu cầu bởi ${tag}`, iconURL: icon })
//             .setTimestamp();

//         const btn = new ActionRowBuilder()
//             .addComponents(
//                 new ButtonBuilder()
//                     .setCustomId('btn')
//                     .setStyle(ButtonStyle.Primary)
//                     .setEmoji('🔁')
//             );

//         const vd = new ActionRowBuilder()
//             .addComponents(
//                 new ButtonBuilder()
//                     .setCustomId(`klk`)
//                     .setStyle(ButtonStyle.Danger)
//                     .setEmoji(`💨`)
//             )

//         const msg = await interaction.reply({ embeds: [embed], components: [btn, vd] });

//         const collector = msg.createMessageComponentCollector();
//         collector.on('collect', async i => {
//             if (i.customId == 'btn') {
//                 i.update({
//                     embeds: [
//                         new EmbedBuilder()
//                             .setTitle('**`🏓・PONG!`**')
//                             .setDescription(`**\`🍯・ĐỘ TRỄ: ${client.ws.ping} ms\`**`)
//                             .setColor("Yellow")
//                             .setFooter({ text: `Được yêu cầu bởi ${tag}`, iconURL: icon })
//                             .setTimestamp()
//                     ], components: [btn]
//                 });
//             };
//         });
//     },
// };



const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping! Xem tốc độ phản hồi của bot.'),

    async execute(interaction, client) {
        const icon = interaction.user.displayAvatarURL();
        const tag = interaction.user.tag;

        const embed = new EmbedBuilder()
            .setTitle('**`🏓・PONG!`**')
            .setDescription(`**\`🍯・ĐỘ TRỄ: ${client.ws.ping} ms\`**`)
            .setColor("Yellow")
            .setFooter({ text: `Được yêu cầu bởi ${tag}`, iconURL: icon })
            .setTimestamp();

        const btn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('btn')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔁')
            );

        const vd = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('klk')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('💨')
            );

        await interaction.reply({ embeds: [embed], components: [btn, vd] });
    },
};
