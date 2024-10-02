const { SlashCommandBuilder, ComponentType } = require('discord.js');
const { menu } = require(`../../ButtonPlace/StringSelectMenuBuilder`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Mời bạn đến máy chủ của chúng tôi!'),
    async execute(interaction, client) {

        await interaction.reply({ content: 'Chọn một tùy chọn từ menu bên dưới!', ephemeral: true });

        const initialMessage = await interaction.channel.send({ components: [menu] });

        const filter = (i) => i.user.id === interaction.user.id;

        const collector = await initialMessage.createMessageComponentCollector(

            {
                filter,
                componentType: ComponentType.StringSelect,
                time: 30_000,
                dispose: true,
            }
        );

        collector.on('collect', (interaction) => {

            if (interaction.values[0] === "yt") {
                interaction.update({ content: `### \🔗 **Facebook**\n↪ [Mời ngay!](https://www.facebook.com/profile.php?id=100092393403399)`, components: [] }).catch((e) => { });
            } else if (interaction.values[0] === "dc") {
                interaction.update({ content: `### \🔗 **Discord**\n↪ [Mời ngay!](https://discord.com/oauth2/authorize?client_id=1159874172290334730&permissions=8&scope=bot)`, components: [] }).catch((e) => { });
            };

        });

        collector.on('end', (collected, reason) => {
            if (reason == "time") {
                initialMessage.edit({ content: `### ⏰ **| Đã hết giờ lựa chọn!**`, components: [] }).then((msg) => {

                    setTimeout(() => {
                        msg.delete();
                    }, 8_000);

                });
            };
        });
    },
};