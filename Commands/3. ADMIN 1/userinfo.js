const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { profileImage } = require("discord-arts");
const { permissionMap } = require("../../permissionMap"); // Đường dẫn đến file permissionMap.js
  
module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Hiển thị thông tin về một người dùng.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Chọn người dùng để nhận thông tin")
                .setRequired(true)
        ),
    
    async execute(interaction) {
        try {
            // Trì hoãn phản hồi
            await interaction.deferReply();
    
            const User = interaction.options.getUser("user");
            const TargetedUser = await interaction.guild.members.fetch(
                User.id || interaction.member.id
            );
            await TargetedUser.fetch();
    
            function joinedSuff(number) {
                // Xác định đuôi số
                if (number % 100 >= 11 && number % 100 <= 13) return number + "th";
        
                switch (number % 10) {
                    case 1:
                    return number + "st";
                    case 2:
                    return number + "nd";
                    case 3:
                    return number + "rd";
                }

                return number + "th";
            }
    
            const fetchMembers = await interaction.guild.members.fetch();
            const JoinPos =
            Array.from(
                fetchMembers
                    .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                    .keys()
            ).indexOf(TargetedUser.id) + 1;
    
            const Accent = TargetedUser.user.accentColor
            ? TargetedUser.user.accentColor
            : "Random";
    
            let index = 1;
            let Perm;

            if (TargetedUser.id === interaction.guild.ownerId) {
                Perm = `Chủ sở hữu máy chủ`;
            } else if (TargetedUser.permissions.has(PermissionsBitField.Flags.Administrator)) {
                Perm = `Administrator`;
            } else {
                // Lấy vai trò chính và quyền của nó
                const primaryRole = TargetedUser.roles.highest;
                Perm = primaryRole.permissions
                    .toArray()
                    .map((P) => `${index++}. ${permissionMap[P] || P}.`)
                    .join("\n");
            }
    
            const roles = TargetedUser.roles.cache
                .filter((role) => role.name !== "@everyone")
                .sort((a, b) => b.position - a.position)
                .map((role) => `• ${role.name}`)
                .slice(0, 3);
    
            const member = await interaction.guild.members.fetch(User.id);

            const profileBuffer = await profileImage(User.id, {
                customBackground: "https://www.elle.vn/wp-content/uploads/2017/07/25/hinh-anh-dep-1.jpg",
                badgesFrame: true,
                borderColor: ["#f90257", "#043a92"],
                presenceStatus: member.presence?.status,
                squareAvatar: true,
            });

            const imageAttachment = new AttachmentBuilder(profileBuffer, {
                name: "profile.png",
            });
    
            const embed = new EmbedBuilder()
            .setAuthor({
                name: `${TargetedUser.user.username}`,
                iconURL:
                "https://cdn.discordapp.com/attachments/1064929361213530122/1066648072211410964/6879-member.png",
            })
            .setThumbnail(TargetedUser.user.avatarURL({ dynamic: true, size: 1024 }))
            .setColor("Green")
            .setFooter({ text: "Ⓒ Mọi quyền được bảo lưu cho BRB Studio" })
            .setTimestamp()
            .setDescription(
                `**Thông tin người dùng:** ${TargetedUser.user}
                
                **${TargetedUser.user.tag}** Đã tham gia với tư cách là
                thành viên thứ **${joinedSuff(
                JoinPos
                )}** của Hội (\`${interaction.guild.name}\`).
                `
            )
            .setImage("attachment://profile.png")
            .addFields(
                {
                name: `Đã tham gia bất hòa`,
                value: `<t:${parseInt(TargetedUser.user.createdTimestamp / 1000)}:R>`,
                inline: true,
                },
                
                {
                name: `Đã tham gia Máy chủ`,
                value: `<t:${parseInt(TargetedUser.joinedTimestamp / 1000)}:R>`,
                inline: true,
                },

                {
                    name: `\u200B`,
                    value: `\u200B`,
                    inline: true,
                },

                {
                name: `ID`,
                value: `\`\`\`${TargetedUser.id}\`\`\``,
                inline: true,
                },

                {
                name: `Màu sắc`,
                value: `\`\`\`${
                        TargetedUser.user.accentColor
                        ? `#${TargetedUser.user.accentColor.toString(16)}`
                        : "Không có"
                    }\`\`\``,
                inline: true,
                },

                {
                name: `Là ?`,
                value: `\`\`\`${TargetedUser.user.bot ? "Bot" : "Người dùng"} \`\`\``,
                inline: true,
                },

                {
                    name: `(1) Tên nick`,
                    value: `\`\`\`${TargetedUser.nickname || "Không có"} \`\`\``,
                },

                {
                name: `${
                        roles.length === 0 ? "(2) Quyền cơ bản discord" : "(2) Quyền vai trò"
                    }`,
                value: `\`\`\`yml\n${Perm}\`\`\``,
                },

                {
                name: `(3) Vai trò hàng đầu`,
                value: `\`\`\`yml\n${roles.join("\n") || `Chưa có vai trò nào`}\`\`\``,
                }
            );
    
            interaction.editReply({ embeds: [embed], files: [imageAttachment] });
        } catch (error) {
            console.error("Lỗi khi thực thi lệnh test-userinfo:", error);

            interaction.editReply({
                content: "Có lỗi xảy ra khi xử lý lệnh, vui lòng thử lại sau.",
                ephemeral: true,
            });

            interaction.client.emit('interactionError', interaction.client, interaction, error);
        }
    },
};
  