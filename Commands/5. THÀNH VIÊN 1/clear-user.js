const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear_user")
    .setDMPermission(false)
    .setDescription("🗑️ | Xóa một số lượng tin nhắn cụ thể được cung cấp.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Tin nhắn sẽ bị xóa khỏi một người dùng cụ thể trong một kênh.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Số lượng tin nhắn cần xóa khỏi kênh.")
        .setMinValue(1)
        .setMaxValue(50)
        .setRequired(true)
    ),

  userPermissions: [PermissionsBitField.Flags.ManageMessages],
  botPermissions: [PermissionsBitField.Flags.ManageMessages],

  async execute(interaction) {
    const { options, channel } = interaction;

    const amount = options.getInteger("amount");
    const target = options.getUser("target");

    const messages = await channel.messages.fetch({ limit: 100 }); // số lượng tin nhắn được lấy là 100

    const filtered = messages.filter((msg) => msg.author.id === target.id).first(amount);

    if (filtered.size === 0) {
      const res = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`Không tìm thấy tin nhắn nào từ ${target} để xóa.`);
      return interaction.reply({
        embeds: [res],
        ephemeral: true,
      });
    }

    await channel.bulkDelete(filtered).then((messages) => {
      const res = new EmbedBuilder()
        .setColor(`Green`)
        .setDescription(`Đã xóa thành công ***${messages.size}*** tin nhắn từ ${target}.`);
      interaction.reply({
        embeds: [res],
        ephemeral: true,
      });
    });
  },
};
