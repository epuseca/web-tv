# Frontend - Slideshow
HTML + CSS + JavaScript + **MongoDB Data API**

## 🔄 Lưu ý Kiến Trúc
Frontend **lấy dữ liệu trực tiếp từ MongoDB** qua MongoDB Data API - **không qua backend API**.

Backend Admin vẫn tồn tại để quản lý dữ liệu (CRUD), nhưng Frontend độc lập và có thể deployed riêng.

## Cấu trúc thư mục
```
/frontend
├── index.html        # Main slideshow page
├── script.js         # Slideshow logic + MongoDB Data API
└── README.md         # Hướng dẫn này
```

## 🚀 Setup MongoDB Data API

### 1️⃣ Enable MongoDB Data API trên Atlas
[Xem chi tiết: `../MONGODB_DATA_API_SETUP.md`]

**Tóm tắt:**
1. Vào MongoDB Atlas → App Services
2. Tạo New App → Enable Data API
3. Copy App ID và API Key

### 2️⃣ Cấu hình Frontend

**Cách A: Hardcode (Dev)** - Edit `script.js`:
```javascript
const CONFIG = {
    DATA_API_URL: 'https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find',
    DATA_API_KEY: 'YOUR_API_KEY',
    ...
}
```

**Cách B: Query Parameter (Recommended)** - Mở file:
```
index.html?dataApiUrl=XXX&dataApiKey=YYY
```

**Cách C: Console Runtime** - DevTools (F12 → Console):
```javascript
setMongoConfig('https://...', 'API_KEY')
```

---

## 💻 Cách sử dụng

### Local (với MongoDB có sẵn)
```bash
# 1. Cấu hình MongoDB Data API (xem trên)
# 2. Mở file index.html hoặc dùng Live Server
# 3. Frontend sẽ tự tải dữ liệu từ MongoDB
```

Script **tự động phát hiện** credentials từ:
1. localStorage override
2. Query parameters
3. Hardcoded values (nếu cấu hình)

### Production (deployed)

#### Frontend deploy:
- **Netlify**: Drag & drop `/frontend` folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Push to gh-pages branch
- **Render Static**: Create Static Site

#### Cấu hình trên Production:

**Option 1: Query Parameters**
```
https://your-slideshow.netlify.app/index.html?dataApiUrl=https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find&dataApiKey=YOUR_API_KEY
```

**Option 2: Environment Variables** (nếu dùng build tool)
```
VITE_MONGO_DATA_API_URL=...
VITE_MONGO_DATA_API_KEY=...
```

**Option 3: Backend Proxy** (Option nhưng không cần)
```
Giữ backend để proxy MongoDB requests (bảo mật hơn)
```

---

## ✨ Features

✅ Slideshow 20 giây/ảnh  
✅ Fade effect  
✅ Toàn màn hình (fullscreen)  
✅ Auto-hide controls  
✅ Keyboard shortcuts  
✅ Tự auto-refresh mỗi 60 giây  
✅ **Lấy data trực tiếp từ MongoDB**  
✅ Query param / localStorage config  

---

## ⌨️ Keyboard Shortcuts

| Phím | Chức năng |
|------|----------|
| → | Slide tiếp theo |
| ← | Slide trước |
| Space | Slide tiếp theo |
| F | Toggle fullscreen |
| Esc | Thoát fullscreen |

---

## 🐛 Debugging

### Check Connection
Mở DevTools (F12) → Console:

```javascript
// Xem status
logStatus()

// Output:
// 📊 Slideshow Status: {
//   mongoDataApiUrl: "https://...",
//   database: "portal-backend",
//   collection: "images",
//   totalSlides: 5,
//   ...
// }
```

### Change MongoDB Config at Runtime
```javascript
setMongoConfig(
    'https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find',
    'YOUR_API_KEY'
)
```

### View Console Logs
- Opening DevTools automatically shows connection logs
- Look for `✅ Tải X hình ảnh thành công` or error messages

---

## 🔐 Bảo Mật

⚠️ **Không hardcode API Key vào source code nếu push lên GitHub!**

**Cách tốt:**
- Dùng query parameters
- Dùng environment variables
- Dùng localStorage (set từ console/admin panel)

**Cách tệ:**
- Hardcode API Key trong source
- Commit sensitive data lên Git

---

## 📊 Database Schema

Frontend expects documents với structure:
```javascript
{
    "_id": ObjectId,
    "name": String,           // Tên hình ảnh
    "description": String,    // Mô tả
    "imageData": String,      // Base64 image data
    "isActive": Boolean,      // true = hiển thị, false = ẩn
    "createdAt": Date,        // Thời tạo
    "updatedAt": Date         // Lần sửa cuối
}
```

⚠️ Frontend **chỉ lấy images có `isActive: true`**

---

## 📝 Quản lý Dữ liệu

- **Thêm/Sửa/Xóa ảnh**: Dùng Backend Admin (`backend/views/admin.ejs`)
- **Toggle ảnh**: Backend → click nút toggle
- **Frontend**: Chỉ đọc dữ liệu (read-only)

---

## 🚨 Common Issues

| Lỗi | Giải pháp |
|-----|----------|
| "Không có hình ảnh" | Thêm ảnh từ backend admin & set `isActive: true` |
| "MongoDB error 401" | Kiểm tra API Key có đúng không |
| "404 Not Found" | Database/Collection name có đúng không |
| Blank screen | Mở DevTools check console logs |

---

## 🎯 Kiến Trúc Tổng Thể

```
┌─────────────────────────┐
│   Frontend Slideshow    │
│  (index.html + script)  │
│    HTML/CSS/JS (ES6+)   │
│                         │
│  └─ MongoDB Data API───→│ MongoDB Atlas
│     (Direct connection) │ portal-backend
└─────────────────────────┘

┌─────────────────────────┐
│   Backend Admin Panel   │
│ (Node.js + Express)     │
│    EJS + Ant Design     │
│                         │
│  └─ REST API (CRUD)───→│ MongoDB Atlas
│     (Management only)   │ portal-backend
└─────────────────────────┘
```

**Key Points:**
- ✅ Frontend & Backend hoàn toàn độc lập
- ✅ Cùng Database → đồng bộ dữ liệu real-time
- ✅ Frontend có thể deploy anywhere (Netlify, Vercel, etc.)
- ✅ Backend chạy Local hoặc trên Server riêng

---

## 📚 Referensi

- [MongoDB Data API Docs](https://www.mongodb.com/docs/atlas/app-services/data-api/)
- [script.js](./script.js) - Chi tiết code
- [MONGODB_DATA_API_SETUP.md](../MONGODB_DATA_API_SETUP.md) - Setup guide chi tiết


