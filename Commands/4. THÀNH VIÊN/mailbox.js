// Import các class và module cần thiết từ thư viện discord.js
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Mailbox = require('../../schemas/mailboxSchema'); 

    // Định nghĩa các tùy chọn cho mỗi loại phản hồi
    const options = {
        bug: {
            name: "Báo cáo lỗi",
            replyMessage: "Cảm ơn bạn đã gửi báo cáo lỗi! Chúng tôi sẽ xem xét và xử lý ngay.",
            previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Báo cáo lỗi:`
        },
        suggestion: {
            name: "Báo cáo đề xuất",
            replyMessage: "Cảm ơn bạn đã gửi đề xuất! Chúng tôi sẽ xem xét và xử lý nhanh chóng.",
            previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Báo cáo lỗi:`
        },
        review: {
            name: "Đánh giá phản hồi",
            replyMessage: "Cảm ơn bạn đã gửi đánh giá! Chúng tôi tôn trọng quyết định của bạn.",
            previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Báo cáo lỗi:`
        },
        other: {
            name: "Báo cáo khác",
            replyMessage: "Cảm ơn bạn đã gửi báo cáo! Chúng tôi sẽ cân nhắc về điều đó.",
            previewMessage: `Dưới đây là xem trước phản hồi của bạn cho Báo cáo lỗi:`
        },
    };

// Xuất module để sử dụng trong ứng dụng Discord
module.exports = {
    // Định nghĩa thông tin của Slash Command
    data: new SlashCommandBuilder()
        .setName("mailbox")
        .setDescription("📬 | Phản hồi về bot cho DEV")
        .addStringOption(option => option.setName(`option`).setDescription(`Chọn danh mục phản hồi`).setRequired(true).addChoices(
            { name: options.bug.name, value: "bug" },
            { name: options.suggestion.name, value: "suggestion" },
            { name: options.review.name, value: "review" },
            { name: options.other.name, value: "other" },
        ))
        .addStringOption(option => option.setName(`feedback`).setDescription(`Thông tin phản hồi của bạn`).setRequired(true)),

    // Hàm xử lý khi Slash Command được thực thi
    async execute(interaction, client, member) {

    // Kiểm tra xem Slash Command được gọi từ máy chủ có ID là '1028540923249958912' hay không
        // if (interaction.guildId !== '1028540923249958912') {
        //     return interaction.reply({ content: "Lệnh này chỉ có thể sử dụng trong máy chủ của BRB Studio.", ephemeral: true });
        // }

    // Lấy thông tin của người gửi Slash Command và các tùy chọn từ người dùng
        const user = interaction.user;
        const option = interaction.options.get(`option`).value;
        const feedback = interaction.options.get(`feedback`).value;

    // Tạo embed dựa trên loại phản hồi và thêm timestamp
        const feedbackEmbed = new EmbedBuilder()
            .setTitle(options[option].name)
            .setDescription(`\`\`\`${feedback}\`\`\``)
            .setColor('Random')
            .setImage(`https://i.gifer.com/origin/bc/bc77626a04355c8c12cf05a09f87c61a_w200.gif`)
            .addFields({ name: `CHÚ Ý:`, value: `Phản hồi của bạn sẽ được gửi tới DEV.\n\n***Nếu bạn đang ở máy chủ khác và cần giúp đỡ?***\nHãy thêm tên discord của bạn kèm lời mời (mời vào máy chủ của bạn) vào phản hồi, tốt nhất là lời mời vĩnh viễn vì tôi còn phải giúp đỡ nhiều người khác nữa,nếu là lời mời ngắn hạn có thể tôi sẽ bỏ lỡ điều gì đó từ bạn.`, inline: true })
            .setTimestamp(); // Thêm timestamp vào đây;

     // Tạo nút "Send"
        const sendButton = new ButtonBuilder()
            .setCustomId('sendButton')
            .setLabel('OK')
            .setEmoji(`<:zzahhdinook:1249470387016695808>`)
            .setStyle(ButtonStyle.Success);

    // Tạo nút "Cancel"
        const cancelButton = new ButtonBuilder()
            .setCustomId('cancelButton')
            .setLabel('Cancel')
            .setEmoji(`<:2629notick:1249471458565165156>`)
            .setStyle(ButtonStyle.Danger);
   

    // Hiển thị xem trước và nút cho người tương tác
        const row = new ActionRowBuilder()
            .addComponents(sendButton, cancelButton);

    // Gửi tin nhắn xem trước và lấy tin nhắn đó để thực hiện xóa sau này
        const previewMessage = await interaction.reply({ content: options[option].previewMessage, embeds: [feedbackEmbed], components: [row], ephemeral: true });

    // Tạo lắng nghe sự kiện cho nút
        const filter = i => i.customId === 'sendButton' || i.customId === 'cancelButton';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

    // Biến kiểm soát trạng thái của nút
        let sendButtonClicked = false;
        let cancelButtonClicked = false;

    // Xử lý sự kiện khi người dùng ấn nút
        collector.on('collect', async i => {
            if (i.customId === 'sendButton' && !sendButtonClicked) {
                sendButtonClicked = true;

                // Tạo liên kết mời vào máy chủ của người gửi phản hồi
                const userGuild = interaction.guild;
                let inviteLink;
                try {
                    const invite = await userGuild.invites.create(interaction.channel.id, { maxAge: 0, maxUses: 1 });
                    inviteLink = invite.url;
                } catch (error) {
                    console.error(`Không thể tạo liên kết mời: ${error.message}`);
                    inviteLink = "Không thể tạo liên kết mời";
                }

                const feedbackEmbedADM = new EmbedBuilder()
                        .setTitle(options[option].name)
                        .setDescription(`\`\`\`${feedback}\`\`\``)
                        .setColor('Green')
                        .setImage(`https://i.gifer.com/origin/bc/bc77626a04355c8c12cf05a09f87c61a_w200.gif`)
                        .addFields({ name: `Người dùng đã gửi yêu cầu:`, value: `${i.user.displayName}`, inline: false })
                        .addFields({ name: `Được gửi từ máy chủ:`, value: `${i.guild.name}`, inline: false })
                        .setTimestamp(); // Thêm timestamp vào đây;

                // Tạo nút vào máy chủ của người gửi phản hồi
                const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Vào máy chủ để hỗ trợ')
                                .setStyle(ButtonStyle.Link)
                                .setURL(inviteLink)
                        );

                // Gửi phản hồi và tin nhắn cảm ơn
                interaction.followUp({ content: options[option].replyMessage, ephemeral: true });

                // Gửi embed vào kênh feedback
                const guild = client.guilds.cache.get("1028540923249958912"); // ID máy chủ brb studio
                const channel = guild.channels.cache.get('1148874551514632192'); // ID kênh lưu trữ feedback trong máy chủ brb studio
                channel.send({ embeds: [feedbackEmbedADM], components: [row] });

                // Kiểm tra nếu tin nhắn xem trước tồn tại trước khi cố gắng xóa
                await previewMessage.delete().catch(error => {
                    console.error(`Không thể xóa tin nhắn xem trước1: ${error.message}`);
                });
            } else if (i.customId === 'cancelButton' && !cancelButtonClicked) {
                cancelButtonClicked = true;

                // Huỷ tin nhắn xem trước
                interaction.followUp({ content: `Bạn đã huỷ việc gửi phản hồi.`, ephemeral: true });

                // Kiểm tra nếu tin nhắn xem trước tồn tại trước khi cố gắng xóa
                await previewMessage.delete().catch(error => {
                    console.error(`Không thể xóa tin nhắn xem trước2: ${error.message}`);
                });
            }
        });

        // Xử lý sự kiện khi thời gian chờ kết thúc
        collector.on('end', collected => {
            if (collected.size === 0) {
                // Nếu không có sự kiện nào được thu thập, thông báo về việc hết thời gian
                interaction.followUp({ content: `Bạn đã không thực hiện hành động nào tong 2 phút, vì vậy sẽ không tương tác được với nút nữa.`, ephemeral: true });
            }
        });
    }
};