const mongoose = require('mongoose');

// Định nghĩa schema cho hình ảnh
const imageSchema = new mongoose.Schema({
    // Tên của hình ảnh
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Mô tả chi tiết về hình ảnh
    description: {
        type: String,
        trim: true,
        default: ''
    },
    // Trạng thái kích hoạt (chỉ hiển thị hình ảnh có isActive = true trên slideshow)
    isActive: {
        type: Boolean,
        default: true
    },
    // Dữ liệu hình ảnh lưu dưới dạng Base64 string
    imageData: {
        type: String,
        required: true
    },
    // Thời gian tạo bản ghi
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Thời gian cập nhật lần cuối
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware để tự động cập nhật updatedAt trước khi lưu
imageSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Xuất model Image
module.exports = mongoose.model('Image', imageSchema);
