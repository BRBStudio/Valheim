## Tên bot: Mới
## Tác giả: Valheim Survival
## Phiên bản phát hành: v1.0.0 

# Bot này được tạo bởi Cơn Mưa Lạ
- Cần bất kỳ hỗ trợ mã hóa nào, hãy tham gia máy chủ mã hóa của tôi https://discord.gg/s2ec8Y2uPa

- CÀI ĐẶT NÀY (nếu bạn chưa có)
    + node.js https://nodejs.org/en (đảm bảo cài đặt phiên bản LTS!)
    + Mã Visual Studio https://code.visualstudio.com/

- Cổng thông tin Discord Dev: https://discord.com/developers/applications

- Đảm bảo tham gia máy chủ mã hóa của tôi nếu bạn cần hỗ trợ và nó sẽ xây dựng một cộng đồng mã hóa tốt: Mã hóa Pu1s3: https://discord.gg/s2ec8Y2uPa

# Mời Bot của tôi:
- https://discord.com/oauth2/authorize?client_id=1268569140466028649&permissions=8&integration_type=0&scope=bot

# Đường dẫn để nhắn tin với người dùng
- [liên hệ Valheim Survival](https://discord.com/users/703098031092006964) thay '703098031092006964' thành id của mình

# Tất cả máy chủ Discord của tôi:
- Chính ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★: https://discord.gg/s2ec8Y2uPa
- Phụ: hiện tại chưa muốn cho vào

# Trang web của tôi:
- https:// hiện tại chưa có

- Error: no test specified\" && exit 1

# const response = await axios.get('https://api.github.com/repos/Kkkermit/Testify/releases/latest'); trong version.js đây là mẫu

# Kiểm tra xem lệnh được gửi từ một máy chủ hoặc không
    if (!interaction.guild) {
        return interaction.reply("Lệnh này chỉ có thể được sử dụng trong một máy chủ.");
        }

# Lấy mầu từ dữ liệu config.js thì thêm 2 cái bên dưới
- const config = require('../../config');
- config.embedYellow

# Chú thích:
- InteractionTypes :
    + Nơi xử lý các lệnh

- Interaction trong thư mục Events:
    + Nơi xử lý sự kiện khi người dùng chọn một tùy chọn và thực hiện lệnh tương ứng.

- handler: 
    + Đọc danh sách file có trong các thư mục
    + Tạo danh sách lệnh, sử dụng require nhập lệnh tệp và lấy các thuộc tính namevà descriptionlệnh của tệp đó.
    + Hiển thị lệnh thông tin bao gồm tên và mô tả của chúng và trong bảng điều khiển

- PrefixCommands:
    + Nơi viết lệnh tiền tố

- schemas:
    + Nơi để file lưu trữ mongoDB

- lib:
    + Nơi để thông tin phiên bản bot
    + Nơi chuyển đổi mầu ( dùng đường dẫn const colors = require('../../lib/colorConverter'); )

-

- EventHandling:
    + Nơi xử lý tin nhắn

- config.js:
    + Nơi để thông tin dữ liệu như mầu, lấy dữ liệu bằng cách dùng const config = require(../../config)
    + Dùng thời gian hồi chiêu thì dùng `const { COOLDOWN } = require('../../config');` và `cooldown: COOLDOWN,`
    + Cách lấy hàm DescriptionInviteBot: (clientId)
        *   const clientId = client.user.id; // Thay clientId bằng ID của bot, có thể lấy từ config hoặc client
        *   .setDescription(config.DescriptionInviteBot(clientId)) // Gọi hàm với clientId

- index.js:
    + Thư mục chính của bot

- ButtonPlace.js:
    + Tạo các nút nút tại đây, sau đó khi cần có thể lấy thông tin từ đây mà không cần phải viết nút tại đó nữa
    + Cách tạo hàm và lấy hàm row99 với interaction dùng trong lệnh hi
        *   Cách lấy hàm:
                    Tạo row với interaction
                    const row = row99(interaction);
                    sau đó dùng như bình thường
        *   Cách tạo hàm:
                    const row99 = (interaction) => new ActionRowBuilder()
    
- Dùng [Valheim Survival](https://discord.com/users/940104526285910046) để nhắn tin trực tiếp tới người dùng, thay id 940104526285910046 thành id mong muốn

- Dùng await i.deferUpdate(); // Xác nhận sự tương tác mà không gửi tin nhắn
- Dùng await i.deferReply(); // Xác nhận sự tương tác và gửi tin nhắn kết hợp với await i.deleteReply();
- Dùng await i.deleteReply(); // Xóa phản hồi đã trì hoãn
- Dùng await i.editReply({ content: '...' }); // Sửa tin nhắn đã
- Dùng await i.followUp({ content: '...' }); // Gửi tin nhắn tiếp
- Dùng interaction.reply ({ embeds: [embed], components: [button], ephemeral: true }) // dùng để phản hồi tin nhắn
- user.displayName dùng displayName để hiển thị tên hiển thị người dùng trong discord (tôi thích dùng điều này hơn)

# Các cài đặt liên quan:
- npm i colors (để sử dụng màu cho terminal)
- npm i ascii-table (để sử dụng màu cho terminal)
- npm i dotenv (cài đặt .env)
- npm i figlet (dùng để làm đẹp terminal)
- npm i sharp để xử lý và thao tác hình ảnh trong Node.js
    + Chuyển đổi định dạng hình ảnh
    + Thay đổi kích thước hình ảnh (Resize)
    + Cắt và chỉnh sửa hình ảnh
    + Nén hình ảnh
    + Hiệu suất cao
    + Xử lý ảnh bất đồng bộ
- npm i canvacord là một thư viện Node.js giúp tạo các ảnh và ảnh động với sự hỗ trợ của Canvacord API để tạo ảnh meme, ảnh động, và nhiều loại hình ảnh khác
    + Tạo ảnh động, ảnh có hiệu ứng động, và chỉnh sửa ảnh trực tiếp thông qua API
    + Tạo ảnh meme, cung cấp nhiều mẫu ảnh meme phổ biến có thể tùy chỉnh với văn bản và hình ảnh
    + Cho phép gửi các ảnh động và ảnh thay đổi trực tiếp trong các tin nhắn của bot
    + Cung cấp nhiều loại hiệu ứng đặc biệt như ảnh động GIF, ảnh với hiệu ứng đặc biệt, và nhiều tính năng khác.
- npm i canvas
    + Tạo hình ảnh động.
    + Vẽ đồ họa cho các ứng dụng trò chơi
    + Tạo hình ảnh tùy chỉnh, chẳng hạn như biểu đồ, thẻ xếp hạng (rank cards), hoặc avatar.
    + Kết xuất văn bản và hình ảnh cho các ứng dụng server-side.
- npm i colors
- npm i colors
- npm i colors
- npm uninstall cli-table3 ( xóa bỏ thư viện cli-table3 ra khỏi dự án)

- .setDMPermission(false) không để hiện thị lệnh trong tin nhắn DM

- lệnh speak  cần cài npm i ffmpeg-static và npm i libsodium-wrappers

- npm install bottleneck
    + dùng để giới hạn số lượng cập nhật đồng thời

- npm install discord.js@14.15.3
- npm install discord.js@14.14.1


- LỖI const sourcebin = require("sourcebin_js");  TẠI CÁC FILE **ticketTranscript.js** VÀ **servers.js** ĐÃ ĐƯỢC SỬA THÀNH DÙNG THƯ VIỆN **npm install sourcebin**, ĐỂ KIỂM TRA NẾU KHÔNG LỖI GÌ THÌ SẼ XÓA THƯ VIỆN **"sourcebin_js": "^0.0.3-ignore",**

- LỖI const { profileImage } = require("discord-arts");  TẠI CÁC FILE **test-userinfo.js** VÌ THƯ VIỆN **discord-arts**, SẼ HIỂN THỊ BÁO ĐỎ, ĐIỀU NÀY KHÔNG ẢNH HƯỜNG GÌ TỚI BOT. KHI NÀO TÌM ĐƯỢC CÁCH KHẮC PHỤC SẼ TÍNH


- .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice)

- if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return await interaction.reply({ content: '**Bạn không có quyền dùng lệnh này!**', ephemeral: true });
        } quyền dùng lệnh
        
- const { checkAdministrator } = require(`../../permissionCheck`)
// Kiểm tra quyền quản lý tin nhắn
        const hasPermission = await checkManageMessages(interaction);
        if (!hasPermission) return; // Nếu không có quyền, thoát khỏi hàm

- hoist: true, // hiển thị vai trò riêng biệt

- xủ lý khi tương tác lỗi 
        const interactionError = require('../../Events/WebhookError/interactionError');
        try {} catch (error) {
                interactionError.execute(interaction, error, client);
            }

/*=============== Được Thực Hiện Bởi Valheim Survival ================
||                                                                  ||
||    ____    ____    ____     ____   _               _ _           ||
||   | __ )  |  _ \  | __ )   / ___| | |_   _   _  __| (_)  ___     ||
||   |  _ \  | |_) | |  _ \   \___ \ | __| | | | |/ _` | | / _ \    ||
||   | |_) | |  _ <  | |_) |   ___) || |_  | |_| | (_| | |( (_) |   ||
||   |____/  |_| \_\ |____/   |____/  \__|  \__,_|\__,_|_| \___/    ||
||                                                                  ||
=====================================================================*/
- “ ”
- có thời gian sẽ điều chỉnh lại lệnh recruitment
- .setFooter({ text: client.user.username }); hiển thị tên bot
- { name: `\u200b`, value: `\u200b` }, giá trị trường trống

- await interaction.reply({ content: `Tặng quà đã bắt đầu! Phần thưởng: **${reward}**\nThời gian kết thúc: <t:${Math.floor(giveawayEndDate / 1000)}:R>`, ephemeral: true });
- ?retryWrites=true&w=majority&appName=botapha // bỏ botmoi và thay thành dòng này trong .env nếu lỗi
- bit.ly // trang web rút gọn link, ẩn thổng tin bảo mật
- https://discord.com/oauth2/authorize?client_id=1268569140466028649&permissions=8&integration_type=0&scope=bot // link mời bot