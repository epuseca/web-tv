const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import model
const Image = require('./models/Image');

// ==================== MIDDLEWARE ====================
// Cấu hình body parser với giới hạn 50MB cho Base64
app.use(bodyParser.json({ limit: '50mb', strict: false }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Cấu hình EJS làm view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Phục vụ các file tĩnh
app.use(express.static('public'));

// ==================== DATABASE CONNECTION ====================
// Kết nối MongoDB Atlas
const mongoURL = process.env.MONGO_URL || 'mongodb+srv://root:tTSX93jcaZ0jdhLZ@mern-learn.8g9yxqj.mongodb.net/portal-backend';

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Atlas connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== ROUTES ====================

// Trang chủ Admin
app.get('/', async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        res.render('admin', { images });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// ==================== API ENDPOINTS ====================

// GET - Lấy tất cả hình ảnh (API)
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// GET - Lấy các hình ảnh active (dùng cho slideshow)
app.get('/api/images/active', async (req, res) => {
    try {
        const images = await Image.find({ isActive: true }).sort({ createdAt: 1 });
        res.json(images);
    } catch (error) {
        console.error('Error fetching active images:', error);
        res.status(500).json({ error: 'Failed to fetch active images' });
    }
});

// GET - Lấy một hình ảnh theo ID
app.get('/api/images/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

// POST - Thêm hình ảnh mới
app.post('/api/images', async (req, res) => {
    try {
        const { name, description, imageData, isActive } = req.body;

        // Validate dữ liệu
        if (!name || !imageData) {
            return res.status(400).json({ error: 'Name and image data are required' });
        }

        // Tạo hình ảnh mới
        const newImage = new Image({
            name,
            description: description || '',
            imageData,
            isActive: isActive !== undefined ? isActive : true
        });

        // Lưu vào database
        await newImage.save();

        res.status(201).json({
            success: true,
            message: 'Image created successfully',
            image: newImage
        });
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Failed to create image' });
    }
});

// PUT - Cập nhật hình ảnh
app.put('/api/images/:id', async (req, res) => {
    try {
        const { name, description, imageData, isActive } = req.body;

        // Tìm và cập nhật hình ảnh
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Cập nhật các trường
        if (name !== undefined) image.name = name;
        if (description !== undefined) image.description = description;
        if (imageData !== undefined) image.imageData = imageData;
        if (isActive !== undefined) image.isActive = isActive;

        // Lưu thay đổi
        await image.save();

        res.json({
            success: true,
            message: 'Image updated successfully',
            image
        });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

// DELETE - Xóa hình ảnh
app.delete('/api/images/:id', async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// PATCH - Toggle trạng thái active
app.patch('/api/images/:id/toggle', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        image.isActive = !image.isActive;
        await image.save();

        res.json({
            success: true,
            message: 'Image status toggled successfully',
            image
        });
    } catch (error) {
        console.error('Error toggling image status:', error);
        res.status(500).json({ error: 'Failed to toggle image status' });
    }
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}`);
});
