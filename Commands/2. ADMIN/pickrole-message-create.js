const {PermissionsBitField,
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChannelType
} = require(`discord.js`);
const roleSchema = require("../../schemas/roleSchema");
const { COOLDOWN } = require('../../config');
const config = require(`../../config`)
const { checkAdministrator } = require(`../../permissionCheck`)

// .setColor('#2C2D31')

module.exports = {
  cooldown: COOLDOWN,
  data: new SlashCommandBuilder()
    .setName("pickrole-message-create")
    .setDMPermission(false)
    .setDescription("Cài đặt vai trò chọn tin nhắn.")
    .addStringOption(option =>
        option.setName("title")
            .setDescription("Tiêu đề của tin nhắn.")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("description")
            .setDescription("Chú thích của tin nhắn.")
            .setRequired(true))
    .addChannelOption(option =>
        option.setName("channel")
            .setDescription("Gửi đến kênh nào?")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
  
    .addStringOption(option => 
        option.setName('image')
        .setDescription(`Ảnh to đính kèm (sử dụng link png).`)
        .setRequired(false))
  
    .addStringOption(option => 
        option.setName('thumbnail')
        .setDescription(`Hình nhỏ của tin nhắn (sử dụng link png).`)
        .setRequired(false)),
  
  async execute(interaction, client) {
    const { options } = interaction;

    const hasPermission = await checkAdministrator(interaction);
    if (!hasPermission) return;

    const channel = options.getChannel("channel");
    const title = options.getString("title");
    const description = options.getString("description");
    const image = options.getString('image') || 'null';
    const thumbnail = interaction.options.getString('thumbnail') || 'null';
  

  const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(config.embedCyan)
        .setDescription(`${description}`)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

    if (image) {
                if (!image.startsWith('http') && image !== 'null') return await interaction.reply({ content: '**Ảnh to không hợp lệ!**', ephemeral: true})
            }
    if (thumbnail) {
                if (!thumbnail.startsWith('http') && thumbnail !== 'null') return await interaction.reply({ content: '**Ảnh nhỏ không hợp lệ!**', ephemeral: true})
            }
    
    if (image !== 'null') {
                embed.setImage(image)
            }
    
    if (thumbnail !== 'null') {
                embed.setThumbnail(thumbnail)
            }


      const mess = await channel.send({ embeds: [embed]});
      const messid = mess.id;

      const data = await roleSchema.create({
        Guild: interaction.guild.id,
        ChannelID: channel.id,
        MessageID: messid,
        Title: title,
        Description: description,
    });

    if (image !== 'null') {
       await roleSchema.findOneAndUpdate(
          {MessageID: messid}, {Image: image}, {new: true});
    }
    
    if (thumbnail !== 'null') {
       await roleSchema.findOneAndUpdate(
          {MessageID: messid}, {Thumbnail: thumbnail}, {new: true});
    }
    
    await interaction.reply({embeds: [
        new EmbedBuilder()
       .setColor(config.embedCyan)
       .setTitle(`**Đã thiết lập thành công Thông báo chọn vai trò!**`)
       .addFields({name:'ID Tin nhắn', value: `\`\`\`yml\n${data.MessageID}\`\`\``})
       .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
       .setTimestamp()
    ], ephemeral:true});
  },
};
