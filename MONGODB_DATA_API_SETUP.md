# 🗄️ MongoDB Data API Setup Guide

## 📋 Tổng quan
Frontend giờ **lấy dữ liệu trực tiếp từ MongoDB Atlas** mà không cần backend API. Điều này được thực hiện thông qua **MongoDB Data API**.

---

## 🚀 Bước 1: Enable MongoDB Data API trên Atlas

### 1.1 Đăng nhập MongoDB Atlas
- Truy cập: https://cloud.mongodb.com/
- Đăng nhập với tài khoản của bạn

### 1.2 Chọn Project
- Chọn **Project** mà bạn đang dùng (hiện tại là `mern-learn`)

### 1.3 Tạo hoặc truy cập App Services
1. Ở sidebar trái, chọn **App Services**
2. Nhấp **Create New App**
3. Đặt tên: `slideshow-data-api` (hoặc tên khác)
4. Chọn **Cluster0** là data source
5. Nhấp **Create App**

### 1.4 Enable Data API
1. Trong App dashboard, chọn tab **Data API**
2. Bật toggle **Enable the Data API**
3. Chọn **HTTP Method**: POST
4. Nhấp **Save**

---

## 🔑 Bước 2: Tạo API Key

### 2.1 Tạo API Key
1. Chọn tab **Data API**
2. Kéo xuống tìm **API Keys**
3. Nhấp **Create API Key**
4. Đặt tên: `slideshow-frontend` (hoặc tên khác)
5. Chọn **Review & Deploy**
6. **Copy and save the API Key** - ⚠️ Bạn chỉ nhìn thấy nó một lần!

### 2.2 Lấy App ID
1. Ở tab **Data API**, tìm mục **Endpoint**
2. Copy URL endpoint, nó sẽ trông như:
```
https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find
```
3. **YOUR_APP_ID** chính là App ID bạn cần

---

## 🔐 Bước 3: Cấu hình Frontend

### Cách A: Hardcode trong script.js (Nhanh cho dev)

Mở `frontend/script.js` và tìm:
```javascript
const CONFIG = {
    DATA_API_URL: getDataApiUrl() || 'https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find',
    DATA_API_KEY: getDataApiKey() || 'YOUR_API_KEY',
    ...
}
```

Thay thế:
- `YOUR_APP_ID` → App ID bạn copy ở bước 2.2
- `YOUR_API_KEY` → API Key bạn copy ở bước 2.1

**Ví dụ:**
```javascript
const CONFIG = {
    DATA_API_URL: 'https://data.mongodb-api.com/app/slideshow-abc123/endpoint/data/v1/action/find',
    DATA_API_KEY: 'MdBnPxYz1A2B3C4D5E6F7G8H9I0J1K2L',
    ...
}
```

### Cách B: Dùng Query Parameter (Bảo mật cho production)

Mở `frontend/index.html` với:
```
file:///E:/Work%20in%20Mobifone/Web%20TV%20-%20render/frontend/index.html?dataApiUrl=https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find&dataApiKey=YOUR_API_KEY
```

Hoặc khi deployed:
```
https://your-slideshow.netlify.app/index.html?dataApiUrl=https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find&dataApiKey=YOUR_API_KEY
```

### Cách C: Dùng Local Storage (Console)

1. Mở DevTools (F12) → Console
2. Chạy:
```javascript
setMongoConfig(
    'https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/find',
    'YOUR_API_KEY'
)
```

---

## ✅ Bước 4: Kiểm Tra Kết Nối

### 4.1 Kiểm tra trên Local

1. Mở `frontend/index.html` trực tiếp (hoặc dùng Live Server)
2. Mở **DevTools** (F12)
3. Chọn tab **Console**
4. Bạn sẽ thấy logs như:
```
🎬 Slideshow System khởi động...
🔗 MongoDB Data API URL: https://data.mongodb-api.com/app/...
🔐 Database: portal-backend | Collection: images
📥 Đang tải từ MongoDB Data API...
✅ Tải 5 hình ảnh thành công từ MongoDB
```

Nếu **lỗi**, kiểm tra:
- ✔️ App ID đúng?
- ✔️ API Key đúng?
- ✔️ Data API đã được bật?
- ✔️ Collection `images` tồn tại?

### 4.2 Check Status từ Console

```javascript
logStatus()
```

Sẽ hiển thị:
```
📊 Slideshow Status: {
  mongoDataApiUrl: "https://data.mongodb-api.com/app/...",
  database: "portal-backend",
  collection: "images",
  totalSlides: 5,
  ...
}
```

---

## 🛡️ Bước 5: Bảo Mật (Quan trọng!)

### ⚠️ API Key không nên hardcode vào code

**Tốt:**
```javascript
// Dùng query parameter
?dataApiUrl=XXX&dataApiKey=XXX

// Hoặc dùng localStorage qua console
setMongoConfig('XXX', 'XXX')

// Hoặc biến môi trường (nếu deploy qua build tool)
process.env.MONGO_DATA_API_KEY
```

**Tệ:**
```javascript
// ❌ Không bao giờ hardcode vào source code
DATA_API_KEY: 'YOUR_SECRET_KEY' // Visible to everyone!
```

### Tùy chọn bảo mật:
1. **Giới hạn API Key**: Trong MongoDB Atlas, bạn có thể cấu hình API Key chỉ đọc
2. **CORS**: MongoDB Data API sẽ yêu cầu domain allow-list
3. **Rotation**: Thay đổi API Key định kỳ

---

## 📊 Payload & Response Format

### Payload gửi tới MongoDB Data API
```javascript
{
    "collection": "images",
    "database": "portal-backend",
    "dataSource": "Cluster0",
    "filter": { "isActive": true },
    "sort": { "createdAt": -1 }
}
```

### Response trả về
```javascript
{
    "documents": [
        {
            "_id": "ObjectId...",
            "name": "Hình 1",
            "description": "Mô tả",
            "imageData": "data:image/jpeg;base64,...",
            "isActive": true,
            "createdAt": "2024-04-20T...",
            "updatedAt": "2024-04-20T..."
        },
        ...
    ]
}
```

---

## 🔄 Thay đổi Database hoặc Collection

Nếu dữ liệu của bạn nằm ở database/collection khác, sửa trong `script.js`:

```javascript
const CONFIG = {
    DATABASE: 'your-database-name',  // Thay đổi
    COLLECTION: 'your-collection-name',  // Thay đổi
    ...
}
```

---

## 🐛 Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-----------|---------|
| `HTTP error! status: 401` | API Key sai hoặc hết hạn | Kiểm tra/tạo lại API Key |
| `HTTP error! status: 404` | Database/Collection không tồn tại | Kiểm tra tên database/collection |
| `CORS error` | Domain không được phép | Thêm domain vào CORS allow-list trong MongoDB |
| `No documents returned` | Không có ảnh với `isActive: true` | Thêm ảnh từ backend admin |

---

## 📱 Kiểm tra trên Điện thoại

1. Backend admin vẫn chạy trên localhost:3000
2. Frontend (với MongoDB Data API config) có thể test trên:
   - Máy tính: `file:///...index.html?dataApiUrl=...&dataApiKey=...`
   - Điện thoại cùng network: `http://your-pc-ip:8000/index.html?dataApiUrl=...&dataApiKey=...` (nếu dùng Serve)

---

## 🎉 Hoàn tất!

Giờ frontend của bạn lấy dữ liệu **trực tiếp từ MongoDB**, hoàn toàn độc lập với backend API!

**Recap:**
- ✅ Frontend lấy dữ liệu từ MongoDB Data API
- ✅ Backend Admin vẫn quản lý dữ liệu (CRUD)
- ✅ Slideshow hoạt động without backend API
- ✅ Có thể deploy frontend riêng độc lập

---

## 📞 Hỗ trợ

Nếu có vấn đề, kiểm tra:
1. Console logs (F12 → Console tab)
2. Network tab (F12 → Network) - xem request tới MongoDB Data API
3. MongoDB Atlas dashboard - kiểm tra dữ liệu

