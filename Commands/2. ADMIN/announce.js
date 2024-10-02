const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const tinycolor = require("tinycolor2");
const moment = require("moment-timezone");
const randomColor = require("randomcolor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("🔔 | Gửi thông báo nâng cao")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Chọn kênh để thông báo")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Tin nhắn thông báo, Mẹo: có thể dùng \\n: để xuống 1 dòng, {s1}mầu xanh{/s1} và {s2}mầu đỏ{/s2}")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("Tiêu đề của thông báo")
    )
    .addStringOption((option) =>
      option.setName("color").setDescription("Chọn Mầu bạn muốn (chỉ dành cho tin nhắn nhúng)").addChoices(
        { name: "Mầu ngẫu nhiên", value: "Random" },
        { name: "Mầu đỏ", value: "Red" },
        { name: "Mầu xanh dương", value: "Blue" },
        { name: "Mầu xanh lá cây", value: "Green" },
        { name: "Mầu tím", value: "Purple" },
        { name: "Mầu cam", value: "Orange" },
        { name: "Mầu vàng", value: "Yellow" },
        { name: "Mầu đen", value: "Black" },
        { name: "Mầu xanh lơ (rất đẹp)", value: "Cyan" },
        { name: "Mầu hồng", value: "Pink" },
        { name: "Mầu hoa oải hương", value: "Lavender" },
        { name: "Mầu sẫm (Mầu đỏ sẫm, hơi tím)", value: "Maroon" },
        { name: "Mầu ô liu", value: "Olive" },
        { name: "Mầu xanh lam (xanh nước biển)", value: "Teal" },
        { name: "Mầu bạc", value: "Silver" },
        { name: "Mầu vàng đồng", value: "Gold" },
        { name: "Mầu be", value: "Beige" },
        { name: "Mầu hải quân (xanh dương đậm)", value: "Navy" },
        { name: "Mầu tím đậm", value: "Indigo" },
        { name: "Mầu hồng tím", value: "Violet" },
      )
    )
    .addStringOption((option) =>
      option
        .setName("timestamp")
        .setDescription("Định dạng Hẹn thời gian để gửi thông báo (HH:mm DD/MM/YYYY)")
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel("channel");
      const messageText = interaction.options.getString("message");
      const title = interaction.options.getString("title") || "Thông báo";
      const color = interaction.options.getString("color") || "turquoise";
      const timestamp = interaction.options.getString("timestamp");

      const perm = new EmbedBuilder()
      .setColor(`Blue`)
      .setDescription(`\`\`\`yml\nBạn không có quyền đặt lại cấp độ xp trong máy chủ ${interaction.guild.name}.\`\`\``)

      if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true });

      let colorCode;

      if (color === "Random") {
        colorCode = randomColor();
      } else {
        colorCode = tinycolor(color);
      }

      if (color !== "Random" && !colorCode.isValid()) {
        return await interaction.reply({ content: "Mầu bạn nhập không hợp lệ.", ephemeral: true });
      }

      const processMessage = (text) => {
        return text
          .replace(/{s1}/g, '```diff\n+ ')
          .replace(/{\/s1}/g, '\n```')
          .replace(/{s2}/g, '```diff\n- ')
          .replace(/{\/s2}/g, '\n```')
          .replace(/{s3}/g, '✅ ')
          .replace(/{s4}/g, '❌ ')
          .replace(/\\n/g, '\n'); // Thêm dòng này để thay thế ký tự \n bằng xuống dòng thực sự;
      };

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(processMessage(messageText));

      if (color === "Random") {
        embed.setColor(colorCode);
      } else {
        embed.setColor(colorCode.toHexString());
      }

      if (timestamp) {
        const regex = /^(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/;
        const match = timestamp.match(regex);

        if (!match) {
          await interaction.reply({
            content: `Định dạng dấu thời gian không hợp lệ. Vui lòng sử dụng định dạng HH:mm DD/MM/YYYY\n\n***CHÚ THÍCH***:\nHH: hiển thị giờ\nmm: hiển thị phút\nDD: hiển thị ngày\nMM: hiển thị tháng\nYYYY: hiển thị năm .`,
            ephemeral: true,
          });
          return;
        }

        const [_, hour, minute, day, month, year] = match;
        const scheduledTime = moment.tz(`${year}-${month}-${day} ${hour}:${minute}`, "YYYY-MM-DD HH:mm", "Asia/Ho_Chi_Minh");

        if (!scheduledTime.isValid()) {
          await interaction.reply({
            content: "Có vẻ như bạn viết đã viết sai giá trị thời gian rồi. Vui lòng kiểm tra lại ngày và giờ",
            ephemeral: true,
          });
          return;
        }

        const delay = scheduledTime.valueOf() - Date.now();

        if (delay <= 0) {
          await interaction.reply({
            content: "Thời gian lên lịch phải là một thời gian trong tương lai.",
            ephemeral: true,
          });
          return;
        }

        await interaction.reply({
          content: `Thông báo sẽ được gửi vào lúc ${scheduledTime.format('HH:mm [ngày] DD/MM/YYYY')} (giờ Việt Nam)`,
          ephemeral: true,
        });

        setTimeout(async () => {
          await channel.send({ embeds: [embed] });
        }, delay);

      } else {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("confirm_send")
            .setEmoji(`<:177envelopesend:1252735130003443722>`)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("cancel_send")
            .setEmoji(`<:giphy5:1252736661763391548>`)
            .setStyle(ButtonStyle.Primary)
        );

        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply({
          content: "Xem trước thông báo:",
          embeds: [embed],
          components: [row],
        });

        const filter = (i) => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "confirm_send") {
            await i.update({
              content: "Thông báo đã được gửi thành công!",
              components: [],
            });
            await channel.send({ embeds: [embed] });
          } else if (i.customId === "cancel_send") {
            await i.update({
              content: "Thông báo bị hủy bỏ.",
              components: [],
            });
          }
        });

        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            await interaction.editReply({
              content: "Không có hành động. Thông báo bị hủy bỏ.",
              components: [],
            });
          }
        });
      }
    } catch (err) {
      console.error(err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "Đã xảy ra lỗi khi xử lý thông báo của bạn.",
          ephemeral: true,
        });
      }
    }
  },
};
