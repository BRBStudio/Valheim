const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const config = require("../../config");
const { row } = require("../../ButtonPlace/ActionRowBuilder");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("brb")
        .setDMPermission(false)
        .setDescription("Menu hỗ trợ máy chủ BRB Studio"),

async execute(interaction) {
            const linkmod =
            "[📂┊🦋𝑳𝒊𝒏𝒌-𝑴𝒐𝒅🦋](https://discord.com/channels/1028540923249958912/1111674941557985400)";
            const kichhoatthanhvien =
            "[📌┊🦋rules🦋](https://discord.com/channels/1028540923249958912/1173537274542174218)";
            const { guild } = interaction; ////tương tác lệnh là dùng
            const id = guild.id; /// id người dùng discord

            const embeds = [
            // Các embed ở đây
            new EmbedBuilder()
                .setTitle(config.TitleOnGame)
                .setColor(config.embedCyan)
                .setDescription(
                `**để vào game bạn cần vào đồng ý luật tại ${kichhoatthanhvien} để trở thành Thành Viên trước đã**`
                )
                .addFields(
                {
                    name: "ý nghĩa thành viên",
                    value: `Chỉ khi nào bạn là Thành Viên bạn mới cập nhật và tương tác được với mọi thứ liên quan đến Valheim Survival.`,
                },
                {
                    name: "Ví dụ",
                    value:
                    "```js\nBạn muốn vào server Valheim Survival? bạn muốn lấy link mod? bạn muốn theo dõi quá trình server đang cập nhật gì và cập nhật đến đâu? chỉ khi bạn là thành viên mới xem được điều đó \n```",
                },
                {
                    name: "Giải trình",
                    value:
                    "Khi bạn là thành viên ngoài những điều nói trên bạn sẽ xem được tất cả mọi thứ mà chỉ Thành Viên mới có.\n\n```bash\nValheim Survival\n```",
                    inline: false,
                }
                )
                .setImage(`https://i.imgur.com/9bQGPQM.gif`)
                .setFooter({ text: `Trang 1` }), //// chân trang

            new EmbedBuilder()
                .setTitle(config.TitleCaiMod)
                .setDescription(
                `**Bắt Đầu Tải & Cài Mod.**\nChỉ khi là Thành Viên bạn mới thấy ${linkmod}.`
                )
                .addFields(
                {
                    name: "Hướng dẫn tải mod",
                    value:
                    "```js\nvào link mod trong mục thông tin cập nhật để tải mod\n```",
                },
                {
                    name: "Cài mod",
                    value:
                    "```js\nGiải nén file mod bạn vừa tải về, coppy toàn bộ file bên trong folder BRB STUDIO => paste vào nơi bạn để game valheim trên steam.\nNếu không biết file đó nằm ở đâu thì bạn có thể vào steam => thư viện steam => valheim kích chuột phải => chọn quản lý (dòng số 4) => chọn mở thư mục trên máy ( dòng số 2)\n```",
                    inline: false,
                }
                )
                .setImage(`https://i.imgur.com/9bQGPQM.gif`)
                .setFooter({ text: `Trang 2` }), //// chân trang,

            new EmbedBuilder()
                .setTitle(config.TitleBRB)
                .setColor(config.embedRandom)
                .setDescription(config.DescriptionBRB)
                .addFields(
                {
                    name: "/ping",
                    value: "```Độ trễ gửi về```",
                },
                {
                    name: "/brb",
                    value: "```Menu hỗ trợ.```",
                },
                {
                    name: "/announce",
                    value: "```Gửi thông báo nâng cao, chỉ hỗ trợ quyền Admin.```",
                },
                {
                    name: "/ban",
                    value:
                    '```"Ban" nick của người chơi nào đó, chỉ hỗ trợ quyền Admin.```',
                },
                {
                    name: "/kick",
                    value:
                    "\n```'Kick' nick của người chơi nào đó, chỉ hỗ trợ quyền Admin.\n```",
                },
                {
                    name: "/unban",
                    value:
                    "\n```Bỏ 'ban' nick của người chơi nào đó, chỉ hỗ trợ quyền Admin.\n```",
                },
                {
                    name: "/basic",
                    value: "\n```Hỗ trợ cơ bản\n```",
                },
                {
                    name: "/clear",
                    value: "\n```Xóa tin nhắn của ai đó, tối đa 98 tin.\n```",
                },
                {
                    name: "/emoji",
                    value: "\n```Xem tất cả emoji có trong ★彡 B͙R͙B͙ S͙T͙U͙D͙I͙O͙ 彡★.\n```",
                },
                {
                    name: "/event",
                    value: "\n```Event trong Valheim, chỉ hỗ trợ quyền Admin.\n```",
                },
                {
                    name: "/feedback",
                    value:
                    "Gửi phản hồi cho nhóm điều hành, trong đó có:\n```+ Mục phản hồi.\n+ Thông tin phản hồi.\n```",
                },
                {
                    name: "/giverole",
                    value:
                    "\n```Cung cấp cho người dùng một vai trò. chỉ hỗ trợ quyền Admin.\n```",
                },
                {
                    name: "/hi",
                    value: "\n```Nói lời chào với ai đó.\n```",
                },
                {
                    name: "/notification",
                    value:
                    "\nTạo thông báo mới, trong đó có:\n```+ Tiêu đề nội dung của bạn\n+ Mô tả nội dung của bạn\n+ Màu cạnh viền của bạn\n+ Hình ảnh của bạn\n```",
                },
                {
                    name: "/help",
                    value: "\n```Bạn cần đưa ra lựa chọn sẽ có lời giải đáp\n```",
                },
                {
                    name: "/user-info",
                    value:
                    "\n```Cung cấp thông tin về người dùng, bạn có thế chỉ định người mà bạn muốn lấy thông tin\n```",
                }
                )
                .setImage(`https://i.imgur.com/9bQGPQM.gif`)
                .setFooter({ text: `Trang 3` }), //// chân trang,
            ];

        let currentPage = 0;

            try {
                const message = await interaction.reply({
                    embeds: [embeds[currentPage]],
                    components: [row],
                    ephemeral: true, // Đặt ephemeral thành true để chỉ hiển thị thông báo cho người dùng đã kích hoạt lệnh.
                    //Bằng cách thêm ephemeral: true vào interaction.reply phương thức,
                    //phản hồi sẽ chỉ hiển thị với người dùng đã kích hoạt lệnh và nó sẽ không hiển thị với những người dùng khác trong cùng kênh.
                });
            } catch (error) {
                if (error.code === 10062) {
                    console.error("Lỗi tương tác khi gửi tin nhắn:", error);
                    return;
                }
            }

        const filter = (i) =>
            (i.customId === "previouss_button" ||
                i.customId === "nextt_button" ||
                i.customId === "restartt_button") &&
            i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
        });

        collector.on("collect", async (i) => {
            try {
                if (i.customId === "previouss_button") {
                        currentPage--;
                    } else if (i.customId === "nextt_button") {
                        currentPage++;
                    } else if (i.customId === "restartt_button") {
                        currentPage = 0;
                    }

                if (currentPage >= 0 && currentPage < embeds.length) {
                        await i.update({
                            embeds: [embeds[currentPage]],
                            components: [row],
                        });
                    } else {
                        await i.update({
                            embeds: [
                            new EmbedBuilder()
                                .setDescription("Không còn trang nào.")
                                .setColor(config.embedWhite)
                            ],
                            components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setCustomId("restartt_button")
                                .setEmoji(`<:UK8zaNG86f:1250122827596697620>`)
                                .setStyle("Primary"))
                            ],
                        });
                    }
            } catch (error) {
                if (error.code === 10062) {
                    console.error("Lỗi tương tác khi cập nhật tin nhắn:", error);
                    return;
                }
            }
        });

        collector.on("end", (collected) => {
            if (collected.size === 0) {
                interaction.followUp("Bạn mất quá nhiều thời gian để trả lời.");
            }
        });
    },
};
