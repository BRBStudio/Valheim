// mã này dùng cho welcome-event.js trong events và welcome-setup.js trong commands. thiết lập lời chào mừng thành viên mới
const mongoose = require("mongoose");
 
const welcomeMessageSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  message: String,
  isEmbed: { type: Boolean, default: false },
  imageUrl: { type: String, default: null },  // Thêm trường imageUrl
  rulesChannelId: String  // Thêm trường rulesChannelId
});
 
module.exports = mongoose.model("WelcomeMessage", welcomeMessageSchema);