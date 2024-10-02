const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const revSchema = require('../../schemas/reviewSchema');
const config = require(`../../config`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('Lệnh đánh giá')
    .addSubcommand(command => command.setName('setup').setDescription('Thiết lập hệ thống đánh giá').addChannelOption(option => option.setName('channel').setDescription('Kênh nơi các bài đánh giá sẽ được đăng').setRequired(true)))
    .addSubcommand(command => command.setName('disable').setDescription('Vô hiệu hóa hệ thống đánh giá'))
    .addSubcommand(command => command.setName('leave').setDescription('Để lại đánh giá cho máy chủ của chúng tôi').addStringOption(option => option.setName('stars').setDescription('Số sao bắt đầu bạn để lại cho chúng tôi').addChoices(
        { name: "⭐", value: "⭐" },
        { name: "⭐⭐", value: "⭐⭐" },
        { name: "⭐⭐⭐", value: "⭐⭐⭐" },
        { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
        { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
    ).setRequired(true)).addStringOption(option => option.setName('description').setDescription('Nếu muốn bạn có thể để lại lời nhận xét').setRequired(false))),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const data = await revSchema.findOne({ Guild: interaction.guild.id});

        switch(sub) {
            case 'setup':

                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply ({ content: `⛔ | Bạn không có quyền thiết lập hệ thống đánh giá`, ephemeral: true })
                if(data) return await interaction.reply({ content: `❌ | Bạn đã thiết lập hệ thống!`, ephemeral: true })
                else {
                    const channel = interaction.options.getChannel('channel')

                    await revSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id
                    });

                    await interaction.reply({ content: `✅ | Hệ thống đánh giá đã được thiết lập`, ephemeral: true})
                }
            break;

            case 'disable':
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply ({ content: `⛔ | Bạn không có quyền thiết lập hệ thống đánh giá`, ephemeral: true })
                if(!data) return await interaction.reply({ content: `❌ | Bạn đã thiết lập hệ thống!`, ephemeral: true})

                else {
                    await revSchema.deleteOne({ Guild: interaction.guild.id });
                    await interaction.reply({ content: `✅ | Hệ thống đánh giá đã bị vô hiệu hóa.`, ephemeral: true });
                }
                
            break;

            case 'leave':
                
                if (!data) return await interaction.reply({ content: `❌ | Hệ thống đánh giá chưa được thiết lập! `, ephemeral: true });
                else if (data) {

                    const channelID = data.Channel;
                    const stars = interaction.options.getString("stars");
                    const description = interaction.options.getString("description")|| 'Không có lời nhận xét.';;
                    const channel = interaction.guild.channels.cache.get(channelID);
                    const member = interaction.user.tag

                    const embed1 = new EmbedBuilder()
                    .setColor(config.embedBlurple)
                    .setDescription(`Đánh giá từ ${member}`)
                    .addFields(
                        { name: "Ngôi sao", value: `${stars}`, inline: true },
                        { name: "Đánh giá", value: `${description}\n` },
                        )
                    .setTimestamp()
                    .setImage(`https://gifs.eco.br/wp-content/uploads/2022/11/gifs-de-review-1.gif`)
    
                    const embed2 = new EmbedBuilder()
                    .setColor(config.embedBlurple)
                    .setDescription(`Đánh giá của bạn đã được gửi thành công ${channel}`)
                    .setTimestamp()
                    .setImage(`https://gifs.eco.br/wp-content/uploads/2022/11/gifs-de-review-1.gif`)
    
                    channel.send({ embeds: [embed1] });
                    
                    return interaction.reply({ embeds: [embed2], ephemeral: true });

                }
        }
    }
}