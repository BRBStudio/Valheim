const { PermissionsBitField, ChannelType } = require('discord.js');
const countSchema = require('../../schemas/countSchema'); // Đảm bảo đường dẫn chính xác đến tệp countSchema.js

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        let isUpdating = false;

        // Thiết lập hàm cập nhật để chạy lại sau mỗi 1 phút (60000ms)
        setInterval(async () => {
            if (isUpdating) {
                // console.log('Quá trình cập nhật trước chưa hoàn tất, đợi lần cập nhật tiếp theo.');
                return; 
            }

            isUpdating = true; 
            // console.log('Bắt đầu quá trình cập nhật...');

            try {
                // Lấy danh sách các máy chủ có thiết lập tính năng đếm số lượng từ MongoDB
                const countDataList = await countSchema.find({});

                // Duyệt qua danh sách các máy chủ
                await Promise.all(countDataList.map(async (countData) => {
                    const guild = client.guilds.cache.get(countData.Guild);

                    // Nếu bot đang ở trong máy chủ này
                    if (guild) {
                        // console.log(`Đang xử lý máy chủ: ${guild.id}`);

                        // Lấy các dữ liệu cần thiết
                        const memberCount = (await guild.members.fetch()).size;
                        const bannedUsers = await guild.bans.fetch();
                        const botCount = (await guild.members.fetch()).filter(member => member.user.bot).size;
                        const boostCount = guild.premiumSubscriptionCount;

                        // Cập nhật vào MongoDB
                        await countSchema.updateOne(
                            { Guild: guild.id },
                            {
                                MemberCount: memberCount,
                                BanCount: bannedUsers.size,
                                BotCount: botCount,
                                BoostCount: boostCount
                            }
                        );

                        // console.log(`Đã cập nhật dữ liệu vào MongoDB cho máy chủ ${guild.id}`);

                        // Cập nhật tên kênh
                        await Promise.all(countData.Channels.map(async (channelInfo) => {
                            const channel = await guild.channels.fetch(channelInfo.id);
                            if (channel) {
                                let newName = '';

                                if (channel.name.startsWith("👥 Thành Viên")) {
                                    newName = `👥 Thành Viên: ${memberCount}`;
                                } else if (channel.name.startsWith("🚫 Ban")) {
                                    newName = `🚫 Ban: ${bannedUsers.size}`;
                                } else if (channel.name.startsWith("🤖 Bot")) {
                                    newName = `🤖 Bot: ${botCount}`;
                                } else if (channel.name.startsWith("💎 Tăng Cường")) {
                                    newName = `💎 Tăng Cường: ${boostCount}`;
                                }

                                if (newName && channel.name !== newName) {
                                    await channel.setName(newName).catch(console.error);
                                    // console.log(`Đã cập nhật tên kênh: ${newName}`);
                                }
                            }
                        }));
                    }
                }));
            } catch (error) {
                console.error('Có lỗi xảy ra trong quá trình cập nhật:', error);
            }

            // console.log('Hoàn tất quá trình cập nhật.');
            isUpdating = false; 
        }, 60000); // Cập nhật mỗi phút
    },
};

