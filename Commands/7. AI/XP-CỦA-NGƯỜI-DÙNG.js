const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("XP CỦA NGƯỜI DÙNG")
        .setDMPermission(false)
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        }
    }