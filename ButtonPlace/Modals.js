// ButtonPlace/Modals.js

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

// Tạo modal exampleModal


// Tạo modal cho lệnh "say"
const sayModal = new ModalBuilder()
    .setCustomId('say')
    .setTitle('Nói điều gì đó thông qua bot')
    .addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('say')
                .setLabel('Nói gì đó đi')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Nhập một cái gì đó ...')
                .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('embed')
                .setLabel('Ok/no để bật tắt chế độ nhúng?')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('ok/no')
                .setRequired(false)
        )
    );


module.exports = {
    sayModal,
};
