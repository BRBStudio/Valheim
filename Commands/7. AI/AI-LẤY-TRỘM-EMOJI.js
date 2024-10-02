const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("AI LẤY TRỘM EMOJI")
        .setDMPermission(false)
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        }
    }