const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const WelcomeMessage = require("../../schemas/welcomeSchema.js");
const config = require('../../config');
const { checkOwner } = require(`../../permissionCheck`)
const { removedEmbed } = require(`../../Embeds/embedsDEV.js`)
    
    module.exports = {
        data: new SlashCommandBuilder()
            .setName("welcome-setup")
            .setDMPermission(false)
            .setDescription("Cấu hình hệ thống tin nhắn chào mừng")
            .addSubcommand((subcommand) =>
                subcommand
                .setName("set")
                .setDescription("Đặt hệ thống tin nhắn chào mừng tới máy chủ")
                .addStringOption((option) =>
                    option
                    .setName("message")
                    .setDescription(`b1: tên người tham gia,b2: tên máy chủ,b3: hiển thị thứ tự,b4: kênh luật,\\n: để xuống 1 dòng`)
                    .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                    .setName("channel")
                    .setDescription("Kênh gửi tin nhắn chào mừng tới")
                    .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                    .setName("rules")
                    .setDescription("Nơi mọi người đọc luật.")
                    .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                    .setName("embed")
                    .setDescription("Gửi tin nhắn chào mừng dưới dạng nhúng")
                    .setRequired(false)
                )
                .addAttachmentOption((option) => option
                    .setName('image')
                    .setDescription('Hình ảnh của bạn')
                    .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
                subcommand
                .setName("remove")
                .setDescription("Xóa hệ thống tin nhắn chào mừng khỏi máy chủ")
            ),
    
    async execute(interaction) {

        const hasPermission = await checkOwner(interaction);
        if (!hasPermission) return;

        const { options } = interaction;
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;
        const isEmbed = interaction.options.getBoolean("embed");
        const image = options.getAttachment('image');
    
        let welcomeMessage = await WelcomeMessage.findOne({ guildId });
        if (!welcomeMessage) {
            welcomeMessage = new WelcomeMessage({ guildId });
        }

        if (subcommand === "set") {
            // SET
            const channelId = interaction.options.getChannel("channel").id;
            const message = interaction.options.getString("message");
            const rulesChannelId = interaction.options.getChannel("rules").id;
            welcomeMessage.channelId = channelId;
            welcomeMessage.message = message;
            welcomeMessage.isEmbed = isEmbed;
            welcomeMessage.imageUrl = image ? image.url : null;  // Lưu URL của hình ảnh nếu có
            welcomeMessage.rulesChannelId = rulesChannelId;

            await welcomeMessage.save();
    
            const successEmbed = new EmbedBuilder()
                .setTitle("Hệ thống tin nhắn chào mừng")
                .setColor(config.embedGreen)
                .setDescription(`Thông báo chào mừng được đặt thành: ${message}.\n\nKênh chào mừng thành viên mới: <#${channelId}>\nBật tắt tin nhắn nhúng: ${isEmbed ? "Bật" : "tắt"}`);
    
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    
        } else if (subcommand === "remove") {
                // TOGGLE
                let existingData = await WelcomeMessage.findOne({ guildId });
        
                if (!existingData) {
                
                return await interaction.reply({ content: "Hệ thống tin nhắn chào mừng chưa được thiết lập trên máy chủ này", ephemeral: true });
        
            }
    
            if (existingData) {
        
                await WelcomeMessage.deleteOne({ guildId });
                await interaction.reply({
                    embeds: [removedEmbed],
                    ephemeral: true,
                });
            }
        }
    },
};