// permissionMap.js dùng cho userinfo.js

// Tạo bản đồ ánh xạ quyền hệ thống sang tên dễ hiểu hơn
const permissionMap = {
    "CreateInstantInvite": "Tạo liên kết mời",
    "KickMembers": "Đuổi thành viên",
    "BanMembers": "Cấm thành viên",
    "Administrator": "Quản trị viên",
    "ManageChannels": "Quản lý kênh",
    "ManageGuild": "Quản lý máy chủ",
    "AddReactions": "Thêm phản ứng",
    "ViewAuditLog": "Xem nhật ký kiểm tra",
    "PrioritySpeaker": "Người nói ưu tiên",
    "Stream": "Phát trực tuyến",
    "ViewChannel": "Xem kênh",
    "SendMessages": "Gửi tin nhắn",
    "SendTTSMessages": "Gửi tin nhắn TTS",
    "ManageMessages": "Quản lý tin nhắn",
    "EmbedLinks": "Nhúng liên kết",
    "AttachFiles": "Đính kèm tệp",
    "ReadMessageHistory": "Xem lịch sử tin nhắn",
    "MentionEveryone": "Gọi mọi người",
    "UseExternalEmojis": "Sử dụng biểu tượng cảm xúc bên ngoài",
    "Connect": "Kết nối",
    "Speak": "Nói",
    "UseVAD": "Sử dụng VAD",
    "ChangeNickname": "Thay đổi biệt danh",
    "ManageNicknames": "Quản lý biệt danh",
    "ManageRoles": "Quản lý vai trò",
    "ManageWebhooks": "Quản lý webhook",
    "UseApplicationCommands": "Sử dụng lệnh ứng dụng",
    "RequestToSpeak": "Yêu cầu nói",
    "CreatePublicThreads": "Tạo chủ đề công khai",
    "CreatePrivateThreads": "Tạo chủ đề riêng tư",
    "UseExternalStickers": "Sử dụng nhãn dán bên ngoài",
    "SendMessagesInThreads": "Gửi tin nhắn trong chủ đề",
    "UseEmbeddedActivities": "Sử dụng hoạt động nhúng",
    "UseSoundboard": "Sử dụng bảng âm thanh",
    "UseExternalSounds": "Sử dụng âm thanh bên ngoài",
    "SendVoiceMessages": "Gửi tin nhắn thoại",
    "SendPolls": "Gửi khảo sát"
};
  
module.exports = {
    permissionMap,
}
  