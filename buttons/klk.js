module.exports = {
    id: 'klk',
    async execute(interaction, client) {
        await interaction.reply({ content: 'Button KLK được nhấn!', ephemeral: true });
    },
};
