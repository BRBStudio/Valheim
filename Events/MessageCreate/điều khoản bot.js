const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const UserAgreement = require('../../schemas/userAgreementSchema');
const Blacklist = require('../../schemas/blacklistSchema');

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        // Kiểm tra nếu không phải là tin nhắn từ server hoặc kênh không hợp lệ
        if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;

        if (message.channel?.partial) await message.channel.fetch().catch(() => { });
        if (message.member?.partial) await message.member.fetch().catch(() => { });

        // Kiểm tra nếu tin nhắn từ bot thì bỏ qua
        if (message.author.bot) return;

        // Tìm kiếm trong cơ sở dữ liệu xem người dùng đã đồng ý điều khoản chưa
        const existingAgreement = await UserAgreement.findOne({ userId: message.author.id }).exec();

        // Nếu người dùng chưa đồng ý, gửi tin nhắn yêu cầu chấp nhận điều khoản
        if (!existingAgreement) {
            // Kiểm tra xem đã gửi tin nhắn điều khoản chưa
            const sentTermsMessage = await message.channel.messages.fetch({ limit: 10 });
            const termsMessageExists = sentTermsMessage.some(msg => msg.author.id === client.user.id && msg.embeds.length > 0);

            // Gửi tin nhắn điều khoản chỉ nếu chưa gửi trước đó
            if (!termsMessageExists) {
                // Tạo embed cho điều khoản dịch vụ
                const termsEmbed = new EmbedBuilder()
                    .setColor('#ee88aa')
                    .setTitle('Điều khoản và điều kiện')
                    .setDescription(
                        `**1. Đăng ký và Sử dụng**\n`+
    
                        `- Người dùng phải đăng ký một tài khoản hợp lệ để tham gia vào hệ thống kinh tế. Mỗi người dùng chỉ được phép tạo một tài khoản duy nhất.\n` +
                        `- Việc sử dụng hệ thống phải tuân thủ các quy định của chúng tôi và không được sử dụng tài khoản để thực hiện các hành vi gian lận,` +
                        ` lừa đảo hoặc gây thiệt hại cho người dùng khác.\n\n` +
    
                        `**2. Tiền Ảo và Giao Dịch**\n` +
    
                        `- Hệ thống sử dụng tiền ảo, gọi là "Túi Mực", để thực hiện các giao dịch và hoạt động trong ứng dụng. "Túi Mực" không có giá trị thực tế và` +
                        ` không thể được quy đổi thành tiền thật.\n` +
                        `- Người dùng có thể kiếm và sử dụng "Túi Mực" thông qua các hoạt động như chơi game, tham gia sự kiện, hoặc hoàn thành nhiệm vụ.\n` +
                        `- Việc chuyển nhượng, mua bán hoặc trao đổi "Túi Mực" giữa các tài khoản người dùng phải tuân thủ các quy định của chúng tôi.`+
                        ` Mọi hành vi vi phạm sẽ bị xử lý theo quy định.\n\n` +
    
                        `**3. Chính Sách Hoàn Tiền**\n` +
    
                        `- Tất cả các giao dịch liên quan đến "Túi Mực" là cuối cùng và không được hoàn tiền.\n` +
                        `- Chúng tôi không chịu trách nhiệm cho bất kỳ mất mát hoặc thiệt hại nào liên quan đến "Túi Mực" do lỗi người dùng hoặc hành vi gian lận.\n\n` +
    
                        `**4. Chính Sách Bảo Mật**\n` +
    
                        `- Thông tin cá nhân của người dùng sẽ được bảo mật và chỉ sử dụng cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.\n` +
                        `- Chúng tôi cam kết bảo vệ thông tin của bạn khỏi các hành vi xâm phạm, nhưng không chịu trách nhiệm đối với các sự cố không lường trước do lỗi` +
                        ` hệ thống hoặc tấn công mạng.\n\n` +
    
                        `**5. Quyền và Nghĩa Vụ**\n` +
    
                        `- Chúng tôi có quyền thay đổi, cập nhật hoặc hủy bỏ bất kỳ tính năng nào của hệ thống kinh tế mà không cần thông báo trước.\n` +
                        `- Người dùng có trách nhiệm tuân thủ các điều khoản và điều kiện này. Bất kỳ hành vi vi phạm nào cũng có thể dẫn đến việc tạm ngưng` +
                        ` hoặc khóa tài khoản vĩnh viễn.\n\n` +
    
                        `**6. Giải Quyết Tranh Chấp**\n` +
    
                        `Mọi tranh chấp phát sinh liên quan đến việc sử dụng hệ thống sẽ được giải quyết theo pháp luật hiện hành và` +
                        ` quyết định của chúng tôi là quyết định cuối cùng.`
                    );

                // Tạo nút chấp nhận điều khoản
                const acceptButton = new ButtonBuilder()
                    .setCustomId('accept_terms')
                    .setLabel('Chấp Nhận')
                    .setStyle(ButtonStyle.Success);

                const row = new ActionRowBuilder().addComponents(acceptButton);
                const termsMessage = await message.channel.send({
                    embeds: [termsEmbed],
                    components: [row]
                });

                // Bộ lọc để chỉ người dùng cụ thể có thể nhấn nút
                const filter = (i) => i.customId === "accept_terms" && i.user.id === message.author.id;

                const collector = termsMessage.createMessageComponentCollector({
                    filter,
                    time: 10000, // Thời gian thu thập phản hồi là 1 tiếng
                });

                // Khi người dùng nhấn nút chấp nhận điều khoản
                collector.on('collect', async (i) => {
                    await termsMessage.delete();
                    const newAgreement = new UserAgreement({ userId: message.author.id });
                    await newAgreement.save();

                    await message.channel.send(`Bạn đã đồng ý với điều khoản dịch vụ.`);
                    collector.stop();
                });

                // Khi hết thời gian mà người dùng chưa chấp nhận
                collector.on('end', async (collected) => {
                    if (collected.size === 0) {
                        await termsMessage.edit({
                            embeds: [termsEmbed],
                            components: [],
                        });

                        // Thêm người dùng vào blacklist nếu không chấp nhận điều khoản
                        const newBlacklistEntry = new Blacklist({
                            userId: message.author.id,
                            reason: 'Không chấp nhận điều khoản dịch vụ'
                        });
                        await newBlacklistEntry.save();

                        await message.channel.send("Bạn đã không chấp nhận điều khoản trong thời gian quy định.");
                    }
                });
            }

            return; // Kết thúc hàm để không thực hiện thêm mã nào khác
        }
    }
};






// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const UserAgreement = require('../../schemas/userAgreementSchema');
// const Blacklist = require('../../schemas/blacklistSchema');

// module.exports = {
//     name: "messageCreate",

//     async execute(message, client) {
//         // Kiểm tra nếu không phải là tin nhắn từ server hoặc kênh không hợp lệ
//         if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;

//         if (message.channel?.partial) await message.channel.fetch().catch(() => { });
//         if (message.member?.partial) await message.member.fetch().catch(() => { });
        

//         // Kiểm tra nếu tin nhắn từ bot thì bỏ qua
//         if (message.author.bot) return;

//         // Tìm kiếm trong cơ sở dữ liệu xem người dùng đã đồng ý điều khoản chưa
//         const existingAgreement = await UserAgreement.findOne({ userId: message.author.id }).exec();

//         // Nếu người dùng chưa đồng ý, gửi tin nhắn yêu cầu chấp nhận điều khoản
//         if (!existingAgreement) {
//             // Tạo embed cho điều khoản dịch vụ
//             const termsEmbed = new EmbedBuilder()
//                 .setColor('#ee88aa')
//                 .setTitle('Điều khoản và điều kiện')
//                 .setDescription(
//                     `**1. Đăng ký và Sử dụng**\n`+

//                     `- Người dùng phải đăng ký một tài khoản hợp lệ để tham gia vào hệ thống kinh tế. Mỗi người dùng chỉ được phép tạo một tài khoản duy nhất.\n` +
//                     `- Việc sử dụng hệ thống phải tuân thủ các quy định của chúng tôi và không được sử dụng tài khoản để thực hiện các hành vi gian lận,` +
//                     ` lừa đảo hoặc gây thiệt hại cho người dùng khác.\n\n` +

//                     `**2. Tiền Ảo và Giao Dịch**\n` +

//                     `- Hệ thống sử dụng tiền ảo, gọi là "Túi Mực", để thực hiện các giao dịch và hoạt động trong ứng dụng. "Túi Mực" không có giá trị thực tế và` +
//                     ` không thể được quy đổi thành tiền thật.\n` +
//                     `- Người dùng có thể kiếm và sử dụng "Túi Mực" thông qua các hoạt động như chơi game, tham gia sự kiện, hoặc hoàn thành nhiệm vụ.\n` +
//                     `- Việc chuyển nhượng, mua bán hoặc trao đổi "Túi Mực" giữa các tài khoản người dùng phải tuân thủ các quy định của chúng tôi.`+
//                     ` Mọi hành vi vi phạm sẽ bị xử lý theo quy định.\n\n` +

//                     `**3. Chính Sách Hoàn Tiền**\n` +

//                     `- Tất cả các giao dịch liên quan đến "Túi Mực" là cuối cùng và không được hoàn tiền.\n` +
//                     `- Chúng tôi không chịu trách nhiệm cho bất kỳ mất mát hoặc thiệt hại nào liên quan đến "Túi Mực" do lỗi người dùng hoặc hành vi gian lận.\n\n` +

//                     `**4. Chính Sách Bảo Mật**\n` +

//                     `- Thông tin cá nhân của người dùng sẽ được bảo mật và chỉ sử dụng cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm người dùng.\n` +
//                     `- Chúng tôi cam kết bảo vệ thông tin của bạn khỏi các hành vi xâm phạm, nhưng không chịu trách nhiệm đối với các sự cố không lường trước do lỗi` +
//                     ` hệ thống hoặc tấn công mạng.\n\n` +

//                     `**5. Quyền và Nghĩa Vụ**\n` +

//                     `- Chúng tôi có quyền thay đổi, cập nhật hoặc hủy bỏ bất kỳ tính năng nào của hệ thống kinh tế mà không cần thông báo trước.\n` +
//                     `- Người dùng có trách nhiệm tuân thủ các điều khoản và điều kiện này. Bất kỳ hành vi vi phạm nào cũng có thể dẫn đến việc tạm ngưng` +
//                     ` hoặc khóa tài khoản vĩnh viễn.\n\n` +

//                     `**6. Giải Quyết Tranh Chấp**\n` +

//                     `Mọi tranh chấp phát sinh liên quan đến việc sử dụng hệ thống sẽ được giải quyết theo pháp luật hiện hành và` +
//                     ` quyết định của chúng tôi là quyết định cuối cùng.`
//                 );

//             // Tạo nút chấp nhận điều khoản
//             const acceptButton = new ButtonBuilder()
//                 .setCustomId('accept_terms')
//                 .setLabel('Chấp Nhận')
//                 .setStyle(ButtonStyle.Success);

//             const row = new ActionRowBuilder().addComponents(acceptButton);
//             const termsMessage = await message.channel.send({
//                 embeds: [termsEmbed],
//                 components: [row]
//             });

//             // Bộ lọc để chỉ người dùng cụ thể có thể nhấn nút
//             const filter = (i) => i.customId === "accept_terms" && i.user.id === message.author.id;

//             const collector = termsMessage.createMessageComponentCollector({
//                 filter,
//                 time: 10000, // Thời gian thu thập phản hồi là 10 giây
//             });

//             // Khi người dùng nhấn nút chấp nhận điều khoản
//             collector.on('collect', async (i) => {
//                 await termsMessage.delete();
//                 const newAgreement = new UserAgreement({ userId: message.author.id });
//                 await newAgreement.save();

//                 await message.channel.send(`Bạn đã đồng ý với điều khoản dịch vụ.`);
//                 collector.stop();
//             });

//             // Khi hết thời gian mà người dùng chưa chấp nhận
//             collector.on('end', async (collected) => {
//                 if (collected.size === 0) {
//                     await termsMessage.edit({
//                         embeds: [termsEmbed],
//                         components: [],
//                     });

//                     // Thêm người dùng vào blacklist nếu không chấp nhận điều khoản
//                     const newBlacklistEntry = new Blacklist({
//                         userId: message.author.id,
//                         reason: 'Không chấp nhận điều khoản dịch vụ'
//                     });
//                     await newBlacklistEntry.save();

//                     await message.channel.send("Bạn đã không chấp nhận điều khoản trong thời gian quy định.");
//                 }
//             });

//             return; // Kết thúc hàm để không thực hiện thêm mã nào khác
//         }
//     }
// };
