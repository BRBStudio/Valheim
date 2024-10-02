// ButtonPlace/StringSelectMenuBuilder.js

const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder(`Vui lòng bấm vào để chọn tùy chọn.`)
            .setDisabled(false) // bật(true) tắt(false) menu
            .addOptions( // tùy chọn tối đa cho chuỗi chọn menu 25 tùy chọn
                {
                    label: 'Thành viên',
                    description: `cách trở thành thành viên BRB STUDIO`,
                    value: 'thành viên',
                    emoji: "1️⃣"
                },
                {
                    label: 'Link mod',
                    description: `Hướng dẫn lấy link mod`,
                    value: 'link mod',
                    emoji: "2️⃣"
                },
                {
                    label: 'Cài đặt mod',
                    description: `Hướng dẫn cài mod`,
                    value: 'cài mod',
                    emoji: "3️⃣"
                },
            ),
    );

const menu = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('invite-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder('Chọn một nền tảng...')
            .addOptions([
                {
                    label: 'Facebook',
                    value: 'yt'
                },
                {
                    label: 'Discord',
                    value: 'dc'
                },
            ])
    )

module.exports = {
    row,                                        // lệnh help-valheim.js
    menu,                                        // lệnh help-valheim.js
}

