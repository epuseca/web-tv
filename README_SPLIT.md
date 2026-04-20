# 📺 Hệ Thống Trình Chiếu Hình Ảnh (Slideshow & Admin)
### Backend + Frontend tách biệt

Hệ thống quản lý và trình chiếu hình ảnh toàn diện với:
- **Backend Admin**: Node.js + Express (quản lý CRUD)
- **Frontend Slideshow**: HTML + CSS + JS (trình chiếu tĩnh)
- **Database**: MongoDB Atlas

---

## 🎯 Cấu trúc Dự Án

```
project/
├── backend/                    # Node.js Backend (Admin Panel)
│   ├── server.js              # Express server
│   ├── package.json           
│   ├── .env                   # Biến môi trường
│   ├── models/
│   │   └── Image.js          # MongoDB schema
│   ├── views/
│   │   └── admin.ejs         # Admin interface
│   ├── README.md             # Hướng dẫn backend
│   └── .gitignore
│
├── frontend/                   # Static Frontend (Slideshow)
│   ├── index.html            # Main slideshow page
│   ├── script.js             # Slideshow logic
│   ├── README.md             # Hướng dẫn frontend
│   └── config.md
│
├── README.md                 # File này
└── CLAUDE.md                 # Yêu cầu ban đầu
```

---

## 🚀 Hướng Dẫn Nhanh

### Backend (Admin Panel)
```bash
cd backend
npm install
npm run dev
# Truy cập: http://localhost:3000
```

### Frontend (Slideshow)
```bash
# Tùy chọn 1: Mở file index.html trực tiếp
# Tùy chọn 2: Sử dụng Live Server extension
# URL: file:///path/to/frontend/index.html
```

---

## 📋 Các Tính Năng

### Backend Admin Panel
✅ Giao diện Ant Design  
✅ Thêm/Sửa/Xóa hình ảnh  
✅ Preview thumbnail  
✅ Toggle Active/Inactive  
✅ Form upload Base64 (50MB max)  
✅ Danh sách real-time  

### Frontend Slideshow
✅ Trình chiếu tự động (20 giây/ảnh)  
✅ Fade in/out effect  
✅ Fullscreen mode  
✅ Auto-hide controls  
✅ Keyboard shortcuts  
✅ Tự refresh mỗi 60 giây  
✅ Chỉ hiển thị hình ảnh active  

---

## 🔌 Cách Kết Nối Frontend & Backend

### Cấu hình tự động
Frontend tự động phát hiện:
- **Localhost mode**: Dùng `http://localhost:3000`
- **Production mode**: Dùng domain hiện tại

### Cấu hình manual

#### 1️⃣ Query Parameter
```
http://localhost:3000/frontend/index.html?apiUrl=https://your-backend.render.com
```

#### 2️⃣ Console (Debugging)
Mở DevTools (F12) → Console:
```javascript
setApiUrl('https://your-backend.render.com')
logStatus()
```

#### 3️⃣ Code Direct
Edit `frontend/script.js`:
```javascript
API_BASE_URL: 'https://your-backend.render.com'
```

---

## 📦 Deployment

### Deploy Backend (Recommended: Render.com)

1. **Create Web Service**
   - Connect GitHub repo
   - Build command: `npm install`
   - Start command: `npm start` (from `/backend`)

2. **Environment Variables**
   ```
   MONGO_URL=mongodb+srv://root:tTSX93jcaZ0jdhLZ@mern-learn.8g9yxqj.mongodb.net/portal-backend
   PORT=3000
   NODE_ENV=production
   ```

3. **Lấy Backend URL**
   → `https://your-app.render.com`

---

### Deploy Frontend (Recommended: Netlify)

1. **Upload /frontend folder**
   - Netlify → New Site → Drag & Drop → Select `/frontend`
   - Deploy!

2. **Frontend URL**
   → `https://your-slideshow.netlify.app`

3. **Cấu hình API URL**
   ```
   https://your-slideshow.netlify.app/index.html?apiUrl=https://your-backend.render.com
   ```

---

### Alternative Hosting Options

| Platform | Backend | Frontend |
|----------|---------|----------|
| **Render** | ✅ | ✅ Static Site |
| **Heroku** | ✅ | ❌ (Phí) |
| **Netlify** | ❌ (Chỉ static) | ✅ |
| **Vercel** | ✅ | ✅ |
| **Railway** | ✅ | ✅ |
| **GitHub Pages** | ❌ | ✅ (Public) |

---

## 🎯 API Endpoints

Tất cả endpoints được prefix bởi`/api`

### Hình ảnh
- `GET /images` - Tất cả hình ảnh
- `GET /images/active` - Chỉ active images
- `GET /images/:id` - Chi tiết hình ảnh
- `POST /images` - Thêm hình ảnh
- `PUT /images/:id` - Cập nhật hình ảnh
- `DELETE /images/:id` - Xóa hình ảnh
- `PATCH /images/:id/toggle` - Toggle trạng thái

---

## 🛠️ Troubleshooting

### ❌ Frontend không load hình ảnh

**Giải pháp:**
1. Kiểm tra console (F12)
2. Xác nhận backend đang chạy
3. Kiểm tra API URL: `logStatus()` trong console
4. Kiểm tra CORS settings

```javascript
// Console
logStatus()
setApiUrl('http://localhost:3000')
```

### ❌ MongoDB connection error

**Giải pháp:**
1. Kiểm tra connection string trong `.env`
2. Kiểm tra MongoDB Atlas IP whitelist
3. Verify MongoDB credentials

### ❌ Fullscreen không hoạt động

**Giải pháp:**
- Một số trình duyệt cần HTTPS
- Kiểm tra browser permissions
- Thử: `https://` thay vì `http://`

---

## 📊 Monitoring

### Backend Logs
```bash
# Terminal running backend
npm run dev
```

### Frontend Logs
```javascript
// Browser Console (F12)
logStatus()  // Xem status
```

---

## 🔒 Bảo Mật (Lưu ý)

⚠️ **Production Deployment Should:**
- ✅ Thêm authentication cho admin panel
- ✅ Limit request rate
- ✅ Validate all inputs
- ✅ Sử dụng HTTPS
- ✅ Secure MongoDB credentials
- ✅ Enable CORS chỉ cho trusted origins

---

## 📝 File Quan Trọng

| File | Mục đích |
|------|---------|
| `backend/server.js` | Express server + routes |
| `backend/models/Image.js` | MongoDB schema |
| `frontend/script.js` | Slideshow logic |
| `frontend/index.html` | Slideshow UI |
| `backend/.env` | Config backend |

---

## 🎓 Hướng Dẫn Chi Tiết

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

## ⌨️ Keyboard Shortcuts (Slideshow)

| Phím | Hành động |
|------|----------|
| `→` | Slide tiếp theo |
| `←` | Slide trước |
| `Space` | Slide tiếp theo |
| `F` | Toggle fullscreen |
| `Esc` | Thoát fullscreen |

---

## 💡 Tips

1. **Locally testing**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   # Mở frontend/index.html
   ```

2. **Production checklist**
   - [ ] Deploy backend
   - [ ] Copy backend URL
   - [ ] Update frontend API URL
   - [ ] Deploy frontend
   - [ ] Test slideshow
   - [ ] Test fullscreen
   - [ ] Test keyboard shortcuts

3. **Database backup**
   ```bash
   # MongoDB Atlas có auto-backup
   # Kiểm tra settings → Backup & Restore
   ```

---

## 📄 License
MIT - Tự do sử dụng và modify

---

**Made with ❤️ for Modern Slideshow Systems**
