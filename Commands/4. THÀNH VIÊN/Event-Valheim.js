const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('Tìm kiếm ý tưởng trò chơi bạn muốn!')
    .addIntegerOption(op =>
      op.setName('people')
        .setDescription('Bạn cần bao nhiêu người cho ý tưởng này.')
        .setRequired(true)

    )
    .addStringOption(op =>
      op.setName('building')
        .setDescription('Đưa ra yêu cầu về ý tưởng bạn muốn?')
        .setRequired(true)
    )
    .addIntegerOption( op =>
      op.setName('minute')
        .setDescription('Bạn muốn kết thúc việc tìm ý tưởng này khi nào? Tính theo phút.')
        .setRequired(true)
    )
    ,

  execute(interaction) {
        const numOfPeople = interaction.options.getInteger('people')
        const building = interaction.options.getString('building')
        const minute = interaction.options.getInteger('minute')

        const author = interaction.member.user.username

        interaction.reply(`***${author}*** đang tìm kiếm ${numOfPeople} người lên ý tưởng ***${building} *** cho ***BRB STUDIO Survival***. Bài nộp kết thúc sau ***${minute}*** phút.`)
    }
}