// dùng với các lệnh antiwordSchema.js cấm từ xấu
const { model, Schema } = require('mongoose')

const antiwordSchema = new Schema({
  guildId: String,
  badWords: [String], // Sửa thành badWords
  selectedChannelId: String // Thêm selectedChannelId
})

module.exports = model('antiwords', antiwordSchema)
