const { SlashCommandBuilder, PermissionsBitField } = require(`discord.js`)
const { createStealEmojiEmbed } = require(`../../Embeds/embedsCreate`);
const { default: axios } = require(`axios`);
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('steal-emoji')
    .setDescription('Thêm biểu tượng cảm xúc nhất định vào máy chủ')
    .addStringOption(option => option.setName('emoji').setDescription('Biểu tượng cảm xúc bạn muốn thêm vào máy chủ').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('Tên cho biểu tượng cảm xúc của bạn').setRequired(true)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Bạn phải là **Quản trị viên** hoặc vai trò của bạn phải có quyền **Quản trị viên** để thực hiện hành động này.", ephemeral: true});
 
        let emoji = interaction.options.getString('emoji')?.trim();
        const name = interaction.options.getString('name');
 
        if (emoji.startsWith("<") && emoji.endsWith(">")) {
        const id = emoji.match(/\d{15,}/g)[0];
 
        const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
        .then(image => {
            if (image) return "gif"
            else return "png"
        }).catch(err => {
            return "png"
        })
 
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }
 
        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "Bạn không thể làm điều này với biểu tượng cảm xúc mặc định!", ephemeral: true})
        }
 
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "Bạn không thể làm điều này với biểu tượng cảm xúc mặc định!", ephemeral: true})
        }
 
        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = createStealEmojiEmbed(emoji, name);
 
            return interaction.reply({ embeds: [embed] });
        }).catch(err => {
            interaction.reply({ content: "Bạn không thể thêm biểu tượng cảm xúc này vì bạn đã đạt đến giới hạn biểu tượng cảm xúc trên máy chủ của mình", ephemeral: true})
        })
    }
 
}