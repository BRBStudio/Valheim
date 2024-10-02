const { CommandInteraction } = require('discord.js');
const { COOLDOWN } = require('../../config');
const config = require('../../config');
const interactionError = require('../WebhookError/interactionError'); // Import interactionError để xử lý lỗi
const Blacklist = require('../../schemas/blacklistSchema');
const checkPermissions = require('../../Handlers/CheckPermissionSpecial'); // người dùng đặc biệt
const UserAgreement = require('../../schemas/userAgreementSchema');

/*
tương tác lệnh slash và đăng ký lệnh slash
*/

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) { // Thay đổi hàm thành bất đồng bộ
        // Kiểm tra xem tương tác có phải là một lệnh slash không
        if (!interaction.isChatInputCommand()) return;

        // Kiểm tra xem lệnh được gửi từ một máy chủ hoặc không
        if (!interaction.guild) {
            return interaction.reply(`${config.GuildOnlyCommand}`);
        }

        // // Kiểm tra người dùng có trong danh sách Blacklist không
        // const blacklistedUser = await Blacklist.findOne({ userId: interaction.user.id });

        // // Nếu người dùng bị blacklist và không phải là người dùng đặc biệt thì chặn lệnh
        // if (blacklistedUser && !checkPermissions(interaction.member)) {
        //     return interaction.reply({ content: "Bạn đã bị cấm sử dụng bot vì vi phạm điều luật. Vui lòng liên hệ với Dev để được giải quyết", ephemeral: true });
        // }
 
        // // Kiểm tra xem người dùng đã đồng ý với điều khoản dịch vụ chưa
        // const userAgreement = await UserAgreement.findOne({ userId: interaction.user.id });
 
        // // Nếu người dùng chưa đồng ý, không cho phép sử dụng lệnh
        // if (!userAgreement) {
        //     return interaction.reply({ content: "Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh này.", ephemeral: true });
        // }
 

        // Lấy lệnh từ bộ sưu tập lệnh của client dựa trên tên lệnh
        const command = client.commands.get(interaction.commandName);

        // Kiểm tra xem lệnh có tồn tại không
        if (!command) {
            return interaction.reply({ content: "Lệnh lỗi thời, bạn có thể phản hồi điều này về bot với Dev để họ sửa đổi" });
        }

        // Kiểm tra xem lệnh có đang trong thời gian hồi chiêu không
        const now = Date.now();
        const cooldownAmount = (command.cooldown || COOLDOWN) * 1000; // đây là 1 giây

        // Tạo một mảng để lưu thời gian người dùng đã sử dụng lệnh
        const cooldowns = client.cooldowns || (client.cooldowns = new Map());

        // Tạo key duy nhất cho mỗi người dùng và máy chủ
        const key = `${interaction.guild.id}-${interaction.user.id}-${interaction.commandName}`;

        if (!cooldowns.has(key)) {
            cooldowns.set(key, now);
        } else {
            const expirationTime = cooldowns.get(key) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Vui lòng chờ ${timeLeft.toFixed(1)} giây nữa để sử dụng lệnh này.`, ephemeral: true });
            }
        }

        // Cập nhật thời gian lệnh được sử dụng
        cooldowns.set(key, now);
        setTimeout(() => cooldowns.delete(key), cooldownAmount);

        try {
            // Thực thi lệnh
            await command.execute(interaction, client);
        } catch (error) {
            // console.error("Đã xảy ra lỗi khi thực thi lệnh:", error); // Ghi lỗi ra console
            // await interaction.reply({ content: "Đã xảy ra lỗi khi thực thi lệnh." });
            
            // Gọi hàm xử lý lỗi từ interactionError.js
            interactionError.execute(interaction, error, client);
        }
    },
};








// const { CommandInteraction } = require('discord.js');
// const { COOLDOWN } = require('../../config');
// const config = require('../../config');

// module.exports = {
//     name: "interactionCreate",

//     async execute(interaction, client) { // Thay đổi hàm thành bất đồng bộ
//         // Kiểm tra xem tương tác có phải là một lệnh slash không
//         if (!interaction.isChatInputCommand()) return;

//         // Kiểm tra xem lệnh được gửi từ một máy chủ hoặc không
//         if (!interaction.guild) {
//             return interaction.reply(`${config.GuildOnlyCommand}`);
//         }

//         // Lấy lệnh từ bộ sưu tập lệnh của client dựa trên tên lệnh
//         const command = client.commands.get(interaction.commandName);

//         // Kiểm tra xem lệnh có tồn tại không
//         if (!command) {
//             return interaction.reply({ content: "Lệnh lỗi thời" });
//         }

//         // Kiểm tra xem lệnh có đang trong thời gian hồi chiêu không
//         const now = Date.now();
//         const cooldownAmount = (command.cooldown || COOLDOWN) * 1000; // đây là 1 giây

//         // Tạo một mảng để lưu thời gian người dùng đã sử dụng lệnh
//         const cooldowns = client.cooldowns || (client.cooldowns = new Map());

//         const timestamps = cooldowns.get(interaction.user.id) || (cooldowns.set(interaction.user.id, new Map()), cooldowns.get(interaction.user.id));
//         const expirationTime = timestamps.get(interaction.commandName) + cooldownAmount;

//         if (timestamps.has(interaction.commandName)) {
//             if (now < expirationTime) {
//                 const timeLeft = (expirationTime - now) / 1000;
//                 return interaction.reply({ content: `Vui lòng chờ ${timeLeft.toFixed(1)} giây nữa để sử dụng lệnh này.`, ephemeral: true });
//             }
//         }

//         // Cập nhật thời gian lệnh được sử dụng
//         timestamps.set(interaction.commandName, now);
//         setTimeout(() => timestamps.delete(interaction.commandName), cooldownAmount);

//         try {
//             // Thực thi lệnh
//             await command.execute(interaction, client);
//         } catch (error) {
//             console.error("Đã xảy ra lỗi khi thực thi lệnh:", error); // Ghi lỗi ra console
//             await interaction.reply({ content: "Đã xảy ra lỗi khi thực thi lệnh." });
//         }
//     },
// };