const { SlashCommandBuilder } = require("discord.js");
const gethelpSchema = require(`../../schemas/gethelpSchema`);
const { checkAdministrator } = require(`../../permissionCheck`);
const { createGetHelpListEmbed, createGetHelpDMEmbed, createGetHelpTagEmbed } = require(`../../Embeds/embedsCreate`);
const { threadembed } = require(`../../Embeds/embedsDEV`);


module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-help")
        .setDescription("Gọi người giúp đỡ (chỉ dùng trong diễn đàn).")
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Thiết lập người dùng trợ giúp')
                .addUserOption(option => option.setName('user').setDescription('Chọn người dùng').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tag')
                .setDescription('Gửi yêu cầu trợ giúp')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Xóa người dùng trợ giúp')
                .addUserOption(option => option.setName('user').setDescription('Chọn người dùng').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Xem danh sách người dùng trợ giúp')
        ),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const serverId = interaction.guild.id;

        if (subcommand === 'setup') {

            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;

            const user = interaction.options.getUser('user');
            let data = await gethelpSchema.findOne({ serverId });

            if (!data) {
                data = new gethelpSchema({ serverId, userIds: [] });
            }

            if (!data.userIds.includes(user.id)) {
                data.userIds.push(user.id);
                await data.save();
                await interaction.reply(`Người dùng ${user.tag} đã được thêm vào danh sách trợ giúp.`);
            } else {
                await interaction.reply(`Người dùng ${user.tag} đã được thiết lập trước đó.`);
            }

        } else if (subcommand === 'tag') {

            if (!interaction.channel || !interaction.channel.isThread()) {

                await interaction.reply({ embeds: [threadembed], ephemeral: true });
                return;
            }
            
            const serverId = interaction.guild.id;

            const data = await gethelpSchema.findOne({ serverId });
            
            const embed = await createGetHelpTagEmbed (interaction)

            // Gửi tin nhắn tới kênh
            await interaction.reply({ embeds: [embed], ephemeral: false });

            // Tạo tin nhắn DM embed
            const dmEmbed = await createGetHelpDMEmbed (interaction)

            // Gửi tin nhắn DM tới tất cả người dùng đã thiết lập
            for (const userId of data.userIds) {
                const user = await client.users.fetch(userId);
                try {
                    await user.send({ embeds: [dmEmbed] });
                } catch (error) {
                    console.error(`Không thể gửi DM cho ${user.tag}:`, error);
                }
            }
        } else if (subcommand === 'remove') {

            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;

            const user = interaction.options.getUser('user');
            let data = await gethelpSchema.findOne({ serverId });

            if (!data || !data.userIds.includes(user.id)) {
                await interaction.reply(`Người dùng ${user.tag} không có trong danh sách trợ giúp.`);
                return;
            }

            // Xóa người dùng khỏi danh sách
            data.userIds = data.userIds.filter(id => id !== user.id);
            await data.save();
            await interaction.reply(`Người dùng ${user.tag} đã được xóa khỏi danh sách trợ giúp.`);
        } else if (subcommand === 'list') {

            const hasPermission = await checkAdministrator(interaction);
            if (!hasPermission) return;

            const embed = await createGetHelpListEmbed (interaction)

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};

