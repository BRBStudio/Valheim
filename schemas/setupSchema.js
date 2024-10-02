/*
dùng để lưu thiết lập người dùng cho yêu cầu trợ giúp từ nút tag_user
*/
const { model, Schema } = require('mongoose');

const setupSchema = new Schema({
    Guild: String,
    ID1: String,
    ID2: String,
    ID3: { type: String, default: null },
    ID4: { type: String, default: null }
});

module.exports = model('setupSchema', setupSchema);
