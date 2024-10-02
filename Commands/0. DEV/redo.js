// const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
// const UserAgreement = require('../../schemas/userAgreementSchema');
// const Blacklist = require('../../schemas/blacklistSchema');
// const interactionError = require('../../Events/WebhookError/interactionError');


// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("redo")
//         .setDescription("Khởi động lại sự kiện chấp nhận điều khoản dịch vụ")
//         .setDMPermission(false),

//     async execute(interaction) {
//         try {    
//         const userId = interaction.user.id;

//         const termsEmbed = new EmbedBuilder()
//             .setColor('#ee88aa')
//             .setTitle('Điều khoản và điều kiện')
//             .setDescription(
//                 `**1. Đăng Ký Và Sử Dụng Lệnh**\n`+

//                 `- Người dùng phải đăng ký một tài khoản hợp lệ để tham gia vào việc sử dụng lệnh của bot. Mỗi người dùng chỉ được phép tạo một tài khoản duy nhất.\n` +
//                 `- Việc sử dụng hệ thống phải tuân thủ các quy định của chúng tôi và không được sử dụng tài khoản để thực hiện các hành vi gian lận,` +
//                 ` lừa đảo hoặc gây thiệt hại cho người dùng khác.\n\n` +

//                 `**2. Tuyển Dụng Và Khiếu Nại**\n` +

//                 `- Hệ thống tuyển dụng có thể sẽ cập nhật hoặc hủy bỏ bất kỳ lúc nào trong tương lai mà không cần thông báo trước.quyết định của chúng tôi là quyết định cuối cùng.` +
//                 `- Việc khiếu nại, tức là dùng lệnh \`/feedback\` sec được chúng tôi xem xét kĩ lưỡng và gửi thông báo tới bạn. hãy chú ý tới nhắn của bạn.` +
//                 ` Lưu ý: khiếu nại cá nhân chúng tôi sẽ không giải quyết, chúng tôi chỉ hỗ trợ phản hồi về bot.` +
//                 `- Đừng đánh lừa các nhóm hỗ trợ của Discord. Không gửi báo cáo sai lệch hoặc độc hại cho bộ phận Phản hồi pháp lý của chúng tôi hoặc các nhóm hỗ trợ` +
//                 ` khách hàng khác, gửi nhiều báo cáo về cùng một vấn đề hoặc yêu cầu một nhóm người dùng báo cáo cùng một nội dung hoặc vấn đề. Việc vi phạm nguyên` +
//                 ` tắc này nhiều lần có thể dẫn đến cảnh báo tài khoản hoặc các hình phạt khác.` +

//                 `**3. Chính Sách Dùng Lệnh**\n` +

//                 `- Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh của bot.\n` +
//                 `- Mọi lệnh đã được phân chia rõ ràng từng mục để bạn hiểu rõ.\n\n` +
//                 `- Không cho phép Ứng Dụng của bạn bỏ qua hoặc phá vỡ các tính năng riêng tư, an toàn và/hoặc bảo mật của Discord` +
//                 `- Không thu thập, gạ gẫm hoặc lừa dối người dùng cung cấp mật khẩu hoặc các thông tin đăng nhập khác. Trong mọi trường hợp, bạn dùng Bot của` +
//                 ` chúng tôi yêu cầu hoặc cố gắng lấy thông tin đăng nhập từ người dùng Discord. Những thông tin này bao gồm những thông tin nhậy cảm như mật khẩu` +
//                 ` hoặc quyền truy cập tài khoản hoặc mã thông báo đăng nhập thì sẽ chúng tôi sẽ xử lý mà không thông báo.` +

//                 `**4. Chính Sách Bảo Mật**\n` +

//                 `- Thông tin cá nhân của người dùng sẽ được bảo mật và chỉ sử dụng cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.\n` +
//                 `- Chúng tôi cam kết bảo vệ thông tin của bạn khỏi các hành vi xâm phạm, nhưng không chịu trách nhiệm đối với các sự cố không lường trước do lỗi` +
//                 ` hệ thống hoặc tấn công mạng.\n\n` +

//                 `**5. Quyền và Nghĩa Vụ**\n` +

//                 `- Chúng tôi có quyền thay đổi, cập nhật hoặc hủy bỏ bất kỳ tính năng nào của hệ thống mà không cần thông báo trước.\n` +
//                 `- Người dùng có trách nhiệm tuân thủ các điều khoản và điều kiện này. Bất kỳ hành vi vi phạm nào cũng có thể dẫn đến việc tạm ngưng` +
//                 ` hoặc khóa tài khoản vĩnh viễn.\n\n` +

//                 `**6. Giải Quyết Tranh Chấp**\n` +

//                 `Mọi tranh chấp phát sinh liên quan đến việc sử dụng hệ thống sẽ được giải quyết theo pháp luật hiện hành và` +
//                 ` quyết định của chúng tôi là quyết định cuối cùng.`
//             );

//         const acceptButton = new ButtonBuilder()
//             .setCustomId('accept_terms')
//             .setLabel('Chấp Nhận')
//             .setStyle(ButtonStyle.Success);

//         const row = new ActionRowBuilder().addComponents(acceptButton);

//         // Gửi lại tin nhắn điều khoản dịch vụ
//         const termsMessage = await interaction.channel.send({
//             embeds: [termsEmbed],
//             components: [row]
//         });

//         // Bộ lọc để chỉ người dùng cụ thể có thể nhấn nút
//         const filter = (i) => i.customId === "accept_terms" && i.user.id === userId;

//         const collector = termsMessage.createMessageComponentCollector({
//             filter,
//             time: 3600000 // 1 tiếng
//         });

//         // Khi người dùng nhấn nút chấp nhận điều khoản
//         collector.on('collect', async (i) => {
//             await termsMessage.delete();
//             const newAgreement = new UserAgreement({ userId: interaction.user.id });
//             await newAgreement.save();

//             await interaction.channel.send(`${interaction.user.username} đã đồng ý với điều khoản dịch vụ.`);
//             collector.stop();
//         });

//         // Khi hết thời gian mà người dùng chưa chấp nhận
//         collector.on('end', async (collected) => {
//             if (collected.size === 0) {
//                 await termsMessage.edit({
//                     embeds: [termsEmbed],
//                     components: []
//                 });

//                 // Thêm người dùng vào blacklist nếu không chấp nhận điều khoản
//                 const newBlacklistEntry = new Blacklist({
//                     userId,
//                     reason: 'Không chấp nhận điều khoản dịch vụ'
//                 });
//                 await newBlacklistEntry.save();

//                 await interaction.channel.send(`${interaction.user.username} đã không chấp nhận điều khoản trong thời gian quy định.`);
//             }
//         });

//         await interaction.deferReply();
//         await interaction.deleteReply();
//     } catch (error) {
//         interactionError.execute(interaction, error, client);
//     }
//     }
// };

const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const UserAgreement = require('../../schemas/userAgreementSchema');
const Blacklist = require('../../schemas/blacklistSchema');
const interactionError = require('../../Events/WebhookError/interactionError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("redo")
        .setDescription("Khởi động lại sự kiện chấp nhận điều khoản dịch vụ")
        .setDMPermission(false),

    async execute(interaction) {
        try {    
            const userId = interaction.user.id;

            const termsEmbed = new EmbedBuilder()
                .setColor('#ee88aa')
                .setTitle('Điều khoản và điều kiện')
                .setDescription(
                    `**1. Đăng Ký Và Sử Dụng Lệnh**\n` +

                    `- Người dùng phải đăng ký một tài khoản hợp lệ để tham gia vào việc sử dụng lệnh của bot. Mỗi người dùng chỉ được phép tạo một tài khoản duy nhất.\n` +
                    `- Việc sử dụng hệ thống phải tuân thủ các quy định của chúng tôi và không được sử dụng tài khoản để thực hiện các hành vi gian lận,` +
                    ` lừa đảo hoặc gây thiệt hại cho người dùng khác.\n\n` +

                    `**2. Tuyển Dụng Và Khiếu Nại**\n` +

                    `- Hệ thống tuyển dụng có thể sẽ cập nhật hoặc hủy bỏ bất kỳ lúc nào trong tương lai mà không cần thông báo trước.quyết định của chúng tôi là quyết định cuối cùng.` +
                    `- Việc khiếu nại, tức là dùng lệnh \`/feedback\` sec được chúng tôi xem xét kĩ lưỡng và gửi thông báo tới bạn. hãy chú ý tới nhắn của bạn.` +
                    ` Lưu ý: khiếu nại cá nhân chúng tôi sẽ không giải quyết, chúng tôi chỉ hỗ trợ phản hồi về bot.` +
                    `- Đừng đánh lừa các nhóm hỗ trợ của Discord. Không gửi báo cáo sai lệch hoặc độc hại cho bộ phận Phản hồi pháp lý của chúng tôi hoặc các nhóm hỗ trợ` +
                    ` khách hàng khác, gửi nhiều báo cáo về cùng một vấn đề hoặc yêu cầu một nhóm người dùng báo cáo cùng một nội dung hoặc vấn đề. Việc vi phạm nguyên` +
                    ` tắc này nhiều lần có thể dẫn đến cảnh báo tài khoản hoặc các hình phạt khác.` +

                    `**3. Chính Sách Dùng Lệnh**\n` +

                    `- Bạn cần đồng ý với điều khoản dịch vụ để sử dụng lệnh của bot.\n` +
                    `- Mọi lệnh đã được phân chia rõ ràng từng mục để bạn hiểu rõ.\n\n` +
                    `- Không cho phép Ứng Dụng của bạn bỏ qua hoặc phá vỡ các tính năng riêng tư, an toàn và/hoặc bảo mật của Discord` +
                    `- Không thu thập, gạ gẫm hoặc lừa dối người dùng cung cấp mật khẩu hoặc các thông tin đăng nhập khác. Trong mọi trường hợp, bạn dùng Bot của` +
                    ` chúng tôi yêu cầu hoặc cố gắng lấy thông tin đăng nhập từ người dùng Discord. Những thông tin này bao gồm những thông tin nhậy cảm như mật khẩu` +
                    ` hoặc quyền truy cập tài khoản hoặc mã thông báo đăng nhập thì sẽ chúng tôi sẽ xử lý mà không thông báo.` +

                    `**4. Chính Sách Bảo Mật**\n` +

                    `- Thông tin cá nhân của người dùng sẽ được bảo mật và chỉ sử dụng cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.\n` +
                    `- Chúng tôi cam kết bảo vệ thông tin của bạn khỏi các hành vi xâm phạm, nhưng không chịu trách nhiệm đối với các sự cố không lường trước do lỗi` +
                    ` hệ thống hoặc tấn công mạng.\n\n` +

                    `**5. Quyền và Nghĩa Vụ**\n` +

                    `- Chúng tôi có quyền thay đổi, cập nhật hoặc hủy bỏ bất kỳ tính năng nào của hệ thống mà không cần thông báo trước.\n` +
                    `- Người dùng có trách nhiệm tuân thủ các điều khoản và điều kiện này. Bất kỳ hành vi vi phạm nào cũng có thể dẫn đến việc tạm ngưng` +
                    ` hoặc khóa tài khoản vĩnh viễn.\n\n` +

                    `**6. Giải Quyết Tranh Chấp**\n` +

                    `Mọi tranh chấp phát sinh liên quan đến việc sử dụng hệ thống sẽ được giải quyết theo pháp luật hiện hành và` +
                    ` quyết định của chúng tôi là quyết định cuối cùng.`
                );

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_terms')
                .setLabel('Chấp Nhận')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(acceptButton);

            // Gửi lại tin nhắn điều khoản dịch vụ
            const termsMessage = await interaction.channel.send({
                embeds: [termsEmbed],
                components: [row]
            });

            // Bộ lọc chỉ kiểm tra việc nhấn nút
            const filter = (i) => i.customId === "accept_terms";

            const collector = termsMessage.createMessageComponentCollector({
                filter,
                time: 3600000 // 1 tiếng
            });

            // Khi bất kỳ ai nhấn nút chấp nhận điều khoản
            collector.on('collect', async (i) => {
                await i.deferUpdate();
                const userId = i.user.id; // Lấy ID của người nhấn nút

                // Kiểm tra xem người dùng đã tồn tại trong UserAgreement hay chưa
                const existingAgreement = await UserAgreement.findOne({ userId });
                if (!existingAgreement) {
                    const newAgreement = new UserAgreement({ userId });
                    await newAgreement.save();
                    await i.followUp({ content: `${i.user.username} đã đồng ý với điều khoản dịch vụ.`, ephemeral: true });
                } else {
                    await i.followUp({ content: `Bạn đã đồng ý với điều khoản trước đó.`, ephemeral: true });
                }
            });

            // Khi hết thời gian mà người dùng chưa chấp nhận
            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    await termsMessage.edit({
                        embeds: [termsEmbed],
                        components: []
                    });

                    // Thêm người dùng đã sử dụng lệnh vào blacklist nếu không chấp nhận điều khoản
                    const newBlacklistEntry = new Blacklist({
                        userId,
                        reason: 'Không chấp nhận điều khoản dịch vụ'
                    });
                    await newBlacklistEntry.save();

                    await interaction.channel.send(`${interaction.user.username} đã không chấp nhận điều khoản trong thời gian quy định.`);
                }
            });

            await interaction.deferReply();
            await interaction.deleteReply();
        } catch (error) {
            interactionError.execute(interaction, error, client);
        }
    }
};
