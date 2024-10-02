const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder } = require(`discord.js`);
const roleSchema = require("../../schemas/roleSchema");
const { COOLDOWN } = require('../../config');
const config = require(`../../config`)
const { checkAdministrator } = require(`../../permissionCheck`)

module.exports = {
  cooldown: COOLDOWN,
  data: new SlashCommandBuilder()
    .setName("pickrole-message-delete")
    .setDMPermission(false)
    .setDescription("Xóa tin nhắn theo ID.")
    .addStringOption(option =>
        option.setName("messageid")
            .setDescription("ID của tin nhắn.")
            .setRequired(true)),
  async execute(interaction, client) {
        const {options} = interaction;

        const hasPermission = await checkAdministrator(interaction);
        if (!hasPermission) return;

        const messageid = options.getString("messageid");

        const data = await roleSchema.findOne({ MessageID: messageid });

        if (!data) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedCyan)
                    .setDescription(`**Không có tin nhắn nào tương ứng với ID đã cung cấp. Chỉ áp dụng với ID tin nhắn từ lệnh /pickrole-message-create!**`)
                ],
            ephemeral: true
        });
        }

        const channel = await client.channels.fetch(data.ChannelID);
        const message = await channel.messages.fetch(messageid);
        message.delete();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedCyan)
                    .setDescription(`**Đã xóa tin nhắn tương ứng!**\nĐể thiết lập lại Thông báo chọn vai trò sử dụng \`/pickrole-message-create\``)
                ], ephemeral:true
        });

        await roleSchema.findOneAndDelete({MessageID: messageid});
    },
};
