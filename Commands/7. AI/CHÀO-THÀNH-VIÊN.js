const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("CHÀO THÀNH VIÊN")
        .setDMPermission(false)
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        }
    }