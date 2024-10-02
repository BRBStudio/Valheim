const { SlashCommandBuilder } = require('discord.js');
const { row } = require(`../../ButtonPlace/StringSelectMenuBuilder`);
const { ThanhVien, LinkMod, SetupMod } = require(`../../Embeds/embedsDEV`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help-valheim')
        .setDescription(`Hỗ trợ vào game Valheim dành riêng cho máy chủ BRB STUDIO !`),

    async execute(interaction) {

        const message = await interaction.reply({ content: 'Tôi ở đây để hỗ trợ bạn ❤!', components: [row], ephemeral: false });

        const collector = await message.createMessageComponentCollector()

        collector.on(`collect`, async (i) => {
            if (i.customId === 'select') {
                    const value = i.values[0];
                    if (i.user.id !== interaction.user.id) {
                        return await i.reply({ content: `Chỉ ${interaction.user.tag} mới có thể tương tác với menu này! Nếu bạn muốn dùng hãy ấn */help*`, ephemeral: true})
                    }
                    if (value === "thành viên") {
                        await i.update({content: `Cách Để Trở Thành ***Thành Viên***`, embeds: [ThanhVien]})
                    }

                    if (value === "link mod") {
                        await i.update({content: `Cách Lấy Link Mod`, embeds: [LinkMod]})
                    }

                    if (value === "cài mod") {
                        await i.update({content: `Hướng Dẫn Cài Mod`, embeds: [SetupMod]})
                    }
                }
            } 
        )
    } 
}