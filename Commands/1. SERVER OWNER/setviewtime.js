const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setviewtime') // Tên lệnh
    .setDescription('Đặt thời gian xem tin nhắn trước khi tự động cập nhật trạng thái') // Mô tả lệnh
    .addStringOption(option => 
        option.setName('mess') // Tên tham số
            .setDescription('Văn bản bạn muốn đưa vào tin nhắn') // Mô tả tham số
            .setRequired(true) // Không bắt buộc phải có tham số này
      )
    .addNumberOption(option =>
        option.setName('option') // Tên tham số
            .setDescription('Đặt giới hạn thời gian xem tin nhắn') // Mô tả tham số
            .setRequired(true) // Bắt buộc phải có tham số này
            .addChoices(
                { name: '5 phút', value: 5 }, // Tên và giá trị lựa chọn
                { name: '10 phút', value: 10 }, 
                { name: '15 phút', value: 15 }, 
                { name: '20 phút', value: 20 }, 
                { name: '25 phút', value: 25 },
                { name: '30 phút', value: 30 },
                { name: '1 tiếng', value: 60 },
                { name: '2 tiếng', value: 120 },
                { name: '3 tiếng', value: 180 },
                { name: '4 tiếng', value: 240 },
                { name: '5 tiếng', value: 300 },
                { name: '1 ngày', value: 1440 },
        )
    )
    .addAttachmentOption(option => 
        option.setName('image') // Tên tham số
            .setDescription('Hình ảnh bạn muốn đưa vào tin nhắn') // Mô tả tham số
            .setRequired(true) // Bắt buộc phải có tham số này
    ),

  async execute(interaction) { // Thực thi lệnh khi người dùng gọi lệnh
    try {
        // Kiểm tra xem người thực hiện lệnh có phải là chủ sở hữu máy chủ không
        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: 'Chỉ chủ sở hữu máy chủ mới có quyền sử dụng lệnh này.', ephemeral: true }); // Phản hồi nếu người thực hiện không phải là chủ sở hữu máy chủ
        }

        const time = interaction.options.getNumber('option'); // Lấy giá trị của tham số 'option'
        const desc = interaction.options.getString('mess') || '   '; // Lấy giá trị của tham số 'text' hoặc đặt giá trị mặc định
        const file = interaction.options.getAttachment('image'); // Lấy giá trị của tham số 'image'
        const fileURL = file.url; // Lấy URL của tệp đính kèm

        const Profile = new EmbedBuilder()
            .setDescription(`:stopwatch:┃***Tin nhắn này được tính thời gian và một lượt xem (${time} phút)***`) // Đặt mô tả của embed
            .setColor('DarkBlue'); // Đặt màu của embed

        const Outro = new EmbedBuilder()
            .setDescription(':stopwatch:┃***Đã xem tin nhắn***') // Đặt mô tả của embed
            .setColor('DarkRed'); // Đặt màu của embed

        const Pesan = new EmbedBuilder()
            .setDescription(`${desc}`) // Đặt mô tả của embed
            .setImage(fileURL) // Đặt hình ảnh của embed
            .setColor('DarkRed'); // Đặt màu của embed

        const enable = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId(`Page1`) // Đặt ID tùy chỉnh của nút
                .setLabel(`Xem tin nhắn`) // Đặt nhãn của nút
                .setEmoji('📁') // Đặt biểu tượng của nút
                .setStyle(ButtonStyle.Secondary) // Đặt kiểu của nút
            );

        const disable = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId(`Page2`) // Đặt ID tùy chỉnh của nút
                .setLabel(`Đã xem tin nhắn`) // Đặt nhãn của nút
                .setEmoji('📂') // Đặt biểu tượng của nút
                .setStyle(ButtonStyle.Secondary) // Đặt kiểu của nút
                .setDisabled(true) // Vô hiệu hóa nút
            );

        const m = await interaction.reply({ embeds: [Profile], components: [enable] }); // Gửi tin nhắn ban đầu với embed 'Profile' và nút 'enable'

        // Thêm bộ đếm thời gian để tự động chuyển sang 'Outro' sau khi hết thời gian
        setTimeout(() => {
            m.edit({ embeds: [Outro], components: [disable] }).catch(console.error);
        }, time * 60000);


        const collector = m.createMessageComponentCollector(); // Tạo bộ thu thập sự kiện cho các nút

        collector.on('collect', async m => {
            if (m.customId === 'Page1') {
            await m.update({ embeds: [Pesan], components: [disable] }); // Cập nhật tin nhắn với embed 'Pesan' và nút 'disable'
            }
        });
        
        } catch (err) {
        console.log(err); // In lỗi ra console nếu có
        }
    }
};