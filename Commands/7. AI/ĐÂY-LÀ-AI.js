const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("ĐÂY LÀ AI?")
        .setDMPermission(false)
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        }
    }