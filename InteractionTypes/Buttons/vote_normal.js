const { handleVoteInteraction } = require(`../../ButtonPlace/ActionRowBuilder`)

module.exports = {
    id: 'vote_normal',
    async execute(interaction) {
        if (interaction.customId && interaction.customId.startsWith('vote_')) {
            handleVoteInteraction(interaction);
        }
    }
}