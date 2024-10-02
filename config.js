const { Guild } = require("discord.js");

module.exports = {

    // PHIÊN BẢN BOT //
    botVersion: "v1.0.0",
    
    // NGƯỜI DÙNG ĐẶC BIỆT //
    specialUsers: ["940104526285910046", "1215380543815024700"],

    // QUYỀN //
    BotPermissions: `Bot thiếu quyền hạn cần thiết để thực hiện lệnh này`,
    OwnerPermissions: `\`\`\`diff\n+Chỉ dành cho chủ sở hữu.\`\`\``,
    
    // THÔNG TIN BOT //
    Statusdnd: `dnd`,
    Statusonline: `online`,
    Statusofline: `offline`,
    EventListeners: 100,
    TitleInviteBot: `MỜI BOT`,
    DescriptionInviteBot: (clientId) => `[Nhấn vào đây để mời bot đến server của bạn](https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=8)`,
    TitleReportBot: `BÁO CÁO BOT`,
    DescriptionReportBot: `Nếu bạn muốn báo cáo bot, vui lòng gửi tin nhắn đến admin hoặc sử dụng hệ thống báo cáo của chúng tôi.`,
    TitleEmptyCategory: `DANH MỤC TRỐNG`,
    DescriptionEmptyCategory: `Vui lòng chọn danh mục khác hoặc chờ DEV thêm vào.`,
    DescriptionPrefix: `Danh sách các lệnh ? có sẵn trong danh mục này:`,
    DescriptionSlash: `Danh sách các lệnh / có sẵn trong danh mục này:`,
    TitleCommandsHelp: `COMMANDS-HELP`,
    TitleOnGame: `HƯỚNG DẪN VÀO GAME`,
    TitleCaiMod: `HƯỚNG DẪN TẢI MOD VÀ CÀI MOD`,
    TitleBRB: `Các Lệnh của Bot Valheim`,
    DescriptionBRB: `**Ấn / trước khi viết lệnh**`,
    DescriptionCommandsHelp: `Chọn một menu để xem chi tiết về lệnh`,
    Dev: `Valheim Survival`,
    DevBy: `| Được phát triển bởi Valheim Survival`,
    Dev1: `Lệnh này **chỉ** dùng cho NPT bot`,
    NoPerms: `Bạn **không** có quyền cần thiết để sử dụng lệnh này!`,
    OwnerOnlyCommand: `Lệnh này **chỉ** dành cho chủ sở hữu!`,
    GuildOnlyCommand: `Lệnh này **chỉ** có thể được sử dụng trong máy chủ.`,
    BadMessage: `Tin nhắn của bạn bao gồm ngôn từ tục tĩu **không** được phép!`,
    botInvite: `[Moi]https://discord.gg/s2ec8Y2uPa`,
    botServerInvite: `https://discord.com/oauth2/authorize?client_id=1268569140466028649&permissions=8&integration_type=0&scope=bot`,
    LinkMoiBot: `https://bit.ly/BotValheim`,

    // THỜI GIAN HỒI CHIÊU //
    COOLDOWN: 5, // 5 giây

    // MÀU SẮC EMBED //
    embedRandom: "Random",                          // Mầu ngẫu nhiên
    embedBlurple: "Blurple",                        // Mầu tím đỏ
    embedBlue: "Blue",                              // Mầu xanh dương
    embedGreen: "Green",                            // Mầu xanh lá cây
    embedRed: "Red",                                // Mầu đỏ
    embedDarkRed: "DarkRed",                        // Mầu đỏ đậm
    embedLuminousVividPink: "LuminousVividPink",    // màu hồng sáng
    embedGold: "Gold",                              // Mầu vàng đồng
    embedOrange: "Orange",                          // Mầu cam
    embedYellow: "Yellow",                          // Mầu vàng
    embedBlack: "Black",                            // Mầu đen
    embedPink: "Pink",                              // Mầu hồng
    embedLavender: "Lavender",                      // Mầu hoa oải hương
    embedMaroon: "Maroon",                          // Mầu sẫm (Mầu đỏ sẫm, hơi tím)
    embedOlive: "Olive",                            // Mầu ô liu
    embedTeal: "Teal",                              // Mầu xanh lam (xanh nước biển)
    embedSilver: "Silver",                          // Mầu bạc
    embedBeige: "Beige",                            // Mầu be
    embedAqua: "Aqua",                              // màu xanh nhạt gần giống như màu cyan
    embedNavy: "Navy",                              // Mầu hải quân (xanh dương đậm)
    embedIndigo: "Indigo",                          // Mầu tím đậm
    embedViolet: "Violet",                          // Mầu hồng tím
    embedPurple: "Purple",                          // Mầu tím
    embedFuchsia: "Fuchsia",                        // màu đỏ tươi
    embedDarkOrange: "DarkOrange",                  // Mầu cam đậm
    embedDarkGreen: "DarkGreen",                    // Mầu xanh lá cây đậm
    embedCyan: "#00FFFF",                           // Mầu xanh lơ (rất đẹp)
    embedWhite: "White",                            // Màu Trắng

    // EMOJIS ĐỘNG //
    tuchoiEmoji: "<a:tickred51:1240060253240819843>",
    dongyEmoji: "<a:_verified_:1240060278863958056>",
    echEmoji: "<a:ech7:1234014842004705360>",
    nitroEmoji: "<a:hanyaCheer:1173363092353200158>",
    helpEmoji: "<a:help:1247600956804300882>",
    khoaEmoji: "<a:khoa:1247600800889442334>",

    // EMOJIS TĨNH //
    arrowDownEmoji: "↴",
    errorEmoji: "❌",
    warning: "⚠️",

    // ID KÊNH //
    slashCommandLoggingChannel: "1238869804744441896", // kênh ghi lệnh gạch chéo
    prefixCommandLoggingChannel: "1241592178480775188", // Kênh ghi lệnh tiền tố
    suggestionChannel: "1240335460463677503", // Kênh gợi ý
    bugReportChannel: "1240341717031456840", // Kênh báo cáo lỗi
    botLeaveChannel: "1139731092329480332", // Kênh ghi nhật ký cho bot rời khỏi máy chủ
    botJoinChannel: "1240480049681928203", // Kênh ghi nhật ký cho bot tham gia máy chủ
    commandErrorChannel: "1240912641719930970", // Kênh ghi nhật ký lỗi lệnh

    // ID MÁY CHỦ //
    server1: `1028540923249958912`, // Máy chủ chính
    server2: `1225228795070648351`, // máy chủ test1
    server3: `1225250831280898168`, // máy chủ test2
}
