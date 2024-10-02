const { Schema, model } = require('mongoose');

// Định nghĩa schema cho người dùng đã đồng ý với điều khoản dịch vụ
const userAgreementSchema = new Schema({
    userId: {
        type: String,
        required: true, // Bắt buộc phải có
        unique: true, // Phải là duy nhất
    },
    acceptedAt: {
        type: Date,
        default: Date.now, // Thời gian đồng ý, mặc định là thời điểm hiện tại
    }
});

// Tạo mô hình từ schema
module.exports = model('UserAgreement', userAgreementSchema);
