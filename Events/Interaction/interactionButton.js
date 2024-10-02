/*
Chức năng: Xử lý các sự kiện tương tác nút bấm.
*/
const { ButtonInteraction } = require('discord.js');
const interactionError = require('../WebhookError/interactionError');

// Xuất module để sử dụng trong tệp chính
module.exports = {
    name: "interactionCreate", // Tên sự kiện mà module này sẽ xử lý

    // Hàm sẽ được thực thi khi sự kiện xảy ra
    async execute(interaction, client) {
            // Kiểm tra xem tương tác có phải là tương tác nút không
            if (!interaction.isButton()) return;

        try {
            // Lấy customId của nút đã nhấn
            const customId = interaction.customId;

            // Danh sách các nút cần loại trừ của lệnh discordjs-guide.js
            const DiscordjsGuideButtons = ['previous_button', 'next_button', 'end_button', 'restart_button'];

            // Danh sách các nút cần loại trừ của lệnh setup-server.js
            const SetupServerButtons = [`setup-sv-no`, `setup-sv-ok`, `setup-sv-no1`, `setup-sv-ok1`, `setup-sv-no2`, `setup-sv-ok2`]

            // Danh sách các nút cần loại trừ của lệnh brb.js
            const brbButtons = ['previouss_button', 'nextt_button', 'restartt_button'];

            // Danh sách các nút cần loại trừ của lệnh bot-commands.js
            const BotCommandsButtons = ['homeButton', 'reportButton', 'inviteButton', 'deleteButton'];

            // Danh sách các nút cần loại trừ của lệnh mailbox.js
            const MailboxButtons = ['sendButton', 'cancelButton'];

            // Danh sách các nút cần loại trừ của lệnh Create-Role.js
            const CreateRoleButtons = ['yes', 'no'];

            // Danh sách các nút cần loại trừ của lệnh feedback.js
            const feedbackButtons = ['sendButton', 'cancelButton'];
            
            // Danh sách các nút cần loại trừ của lệnh emoji.js
            const EmojiButtons = ['a_page', 'b_page'];

            // Danh sách các nút cần loại trừ của lệnh slow-mode.js
            const SlowModeButtons = ['Pagetruoc', 'Pagetieptheo'];

            // // Danh sách các nút cần loại trừ của lệnh pickrole-add-role.js
            // const PickroleAddRoleButtons = ['role-1', 'role-2', 'role-3', 'role-4', 'role-4', 'role-6', 'role-7', 'role-8', 'role-9', 'role-10']

            // Danh sách các nút cần loại trừ khi bot được mời vào máy chủ
            const BotJoinServerButtons = ['deleteNew'];

            // Danh sách các nút cần loại trừ của lệnh setviewtime.js
            const SetviewTimeButtons = ['Page1'];

            // Danh sách các nút cần loại trừ của lệnh message-secret.js
            const MessageSecretButtons = ['view'];

            // Danh sách các nút cần loại trừ của lệnh modpanel-PhatCoThoiGian.js
            const ModPanelButtons = [`ban`, `untimeout`, `kick`, `1`, `2`, `3`, `4`, `5`]

            // Danh sách các nút cần loại trừ của lệnh ban.js
            const BanButtons = ['confirm_ban', 'cancel_ban'];

            // Danh sách các nút cần loại trừ của lệnh ban.js
            const InfoServerButtons = ['serverinfo', 'servermemberinfo'];

            // Danh sách các nút cần loại trừ của lệnh announce.js
            const AnnounceButtons = ['confirm_send', 'cancel_send'];

            // Danh sách các nút cần loại trừ của lệnh user-scraper.js
            const CreateView_User_JsonButtons = ['view_raw', 'view_user_json'];

            // Danh sách các nút cần loại trừ của sự kiện bot.js
            const Accept_TermsButtons = ['accept_terms'];

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (Accept_TermsButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (CreateView_User_JsonButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (InfoServerButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (MessageSecretButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (AnnounceButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (SetviewTimeButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (BanButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (ModPanelButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (SlowModeButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (CreateRoleButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (SetupServerButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (feedbackButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (MailboxButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (EmojiButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            // if (PickroleAddRoleButtons.includes(customId)) {
            //     return; // Không làm gì cả
            // }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (DiscordjsGuideButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            if (brbButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            if (BotCommandsButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Nếu customId là một trong các nút cần loại trừ, không xử lý
            if (BotJoinServerButtons.includes(customId)) {
                return; // Không làm gì cả
            }

            // Lấy lệnh từ client.buttons bằng customId
            const button = client.buttons.get(customId);

            // Nếu không tìm thấy lệnh, trả lời rằng button không xác định
            if (!button) {
                // interaction.reply({ content: "Button không xác định", ephemeral: true });
                // interactionError.execute(interaction, error, client);

                // interactionError.execute(interaction, new Error("Button không xác định"), client);
                // return;

                // Gửi thông báo lỗi chi tiết với customId của button không xác định
                const error = new Error(`Nút chưa được xử lý: ${customId}`);

                interactionError.execute(interaction, error, client);
                return;
            }

            // Thực thi lệnh nút
            button.execute(interaction, client);
        } catch (error) {
            // // Log lỗi ra console để dễ dàng kiểm tra
            // console.error('Lỗi khi xử lý interaction:', error);

            // // Thông báo lỗi cho người dùng nếu cần thiết
            // interaction.reply({ content: "Đã xảy ra lỗi khi xử lý nút. Vui lòng thử lại sau.", ephemeral: true });
            interactionError.execute(interaction, error, client);
        }
    },
};


