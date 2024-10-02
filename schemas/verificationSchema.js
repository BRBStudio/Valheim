// dùng với lệnh /verification-custom và trong interactionCreate.js
const { model, Schema } = require('mongoose');

const createbuttonSchema = new Schema({
    buttonLabel: String, // tên nút
    namerolek: String, // ID vai trò
});

module.exports = model('CreateButton', createbuttonSchema);
