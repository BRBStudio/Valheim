// format.js
const Bvoice = `Bvoice (tên kênh thoại bạn muốn tạo) - (tên danh mục bạn chọn để kênh thoại vào).\nví dụ Bvoice a-b (trong đó a là tên kênh thoại, b là tên danh mục chọn)`;

const helpValheim = `@mới (mặc định là tag bot mới) - (tên lệnh).\nví dụ: @Mới help valheim`;

const bforum = `Bạn cần cung cấp đủ các thông tin theo định dạng yêu cầu. Ví dụ cách viết đúng: \n` +
                `\`bsetupforum-rồng vàng-COUNTER-Nhấp vào nút để đăng bài\\nmỗi bài có 25 kí tự-thẻ 1 + thẻ 2 + thẻ kim cương-chơi game-game valheim không mọi người?-🎉\`\n\n` +
                `Trong đó: \n` +
                `- \`rồng vàng\`: Tên diễn đàn.\n` +
                `- \`COUNTER\`: Tên danh mục.\n` +
                `- \`Nhấp vào nút để đăng bài\\nmỗi bài có 25 kí tự\`: Hướng dẫn bài viết. Ký tự \\n sẽ được thay thế bằng xuống dòng thực tế.\n` +
                `- \`thẻ 1 + thẻ 2 + thẻ kim cương\`: Các thẻ của diễn đàn (ngăn cách bằng dấu cộng '+').\n` +
                `- \`chơi game\`: Tiêu đề bài viết.\n` +
                `- \`game valheim không mọi người?\`: Nội dung bài viết.\n` +
                `- \`🎉\`: chọn Emoji mặc định là 🎉.\n\n` +
                `<a:nu_1dF8UBv:1249331268332552213> \`ĐIỀU NÀY CÓ THỂ BẠN SẼ QUAN TÂM\`: Nếu bạn viết tên danh mục không tồn tại trong máy chủ của bạn thì kênh diễn đàn vẫn sẽ được tạo, nhưng không nằm trong danh mục nào hết.`;

module.exports = { 
    Bvoice,
    helpValheim,
    bforum
};
