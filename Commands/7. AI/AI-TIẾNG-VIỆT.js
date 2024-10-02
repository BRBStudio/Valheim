const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("AI TIẾNG VIỆT")
        .setDMPermission(false)
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        }
    }