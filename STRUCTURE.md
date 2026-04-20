## 📂 Cấu Trúc Dự Án Mới (Backend + Frontend Tách Biệt)

Tôi đã chia dự án thành **Backend** và **Frontend** riêng biệt:

```
e:\Work in Mobifone\Web TV - render\
├── backend/                          ⬅️ Node.js Backend
│   ├── server.js                     # Express server chính
│   ├── package.json                  # Dependencies
│   ├── .env                          # MongoDB URI + Config
│   ├── .gitignore
│   ├── models/
│   │   └── Image.js                 # MongoDB Image schema
│   ├── views/
│   │   └── admin.ejs                # Admin interface (Ant Design)
│   └── README.md                    # Hướng dẫn backend
│
├── frontend/                         ⬅️ Static Slideshow Frontend
│   ├── index.html                    # Slideshow UI
│   ├── script.js                     # Slideshow logic (NO localStorage)
│   ├── README.md                     # Hướng dẫn frontend
│   └── config.md
│
├── README_SPLIT.md                   # 📖 Hướng dẫn chính (CHI TIẾT)
├── DEPLOYMENT_GUIDE.md               # 🚀 Hướng dẫn deployment
├── CLAUDE.md                         # Yêu cầu gốc
├── README.md                         # README cũ
├── index.html                        # (cũ - không dùng)
├── script.js                         # (cũ - không dùng)
├── server.js                         # (cũ - không dùng)
├── package.json                      # (cũ - không dùng)
├── models/                           # (cũ - không dùng)
├── views/                            # (cũ - không dùng)
└── .env.example                      # (cũ - không dùng)
```

---

## 🎯 Điểm Chính của Kiến Trúc Mới

### ✅ Backend (Node.js + Express)
- Chạy trên **localhost:3000** local hoặc **Render.com** production
- Quản lý CRUD hình ảnh
- API endpoints: `/api/images/*`
- Admin panel: `http://localhost:3000`
- **File chính**: `backend/server.js`

### ✅ Frontend (Static HTML + JS)
- File tĩnh không cần build
- Deploy trên **Netlify/Vercel** (hoặc bất kỳ CDN nào)
- Kết nối đến backend qua API
- Không có localhost hardcode
- **File chính**: `frontend/script.js` (Smart API URL detection)

### ✅ Tự động phát hiện API URL
Script tự động:
1. Nếu `localhost` → dùng `http://localhost:3000`
2. Nếu production → dùng domain hiện tại
3. Hỗ trợ query parameter: `?apiUrl=https://...`
4. Hỗ trợ localStorage override

---

## 🚀 Chạy Nhanh

### Local Development
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev
# Truy cập: http://localhost:3000

# Terminal 2: Frontend
# Mở frontend/index.html trực tiếp
# hoặc dùng Live Server extension
```

### Production (Render + Netlify)
```bash
# 1. Deploy Backend lên Render.com
# 2. Deploy Frontend lên Netlify
# 3. Update frontend URL với API URL: ?apiUrl=https://...
```

---

## 📖 File Quan Trọng Cần Đọc

| File | Mục đích | Ưu tiên |
|------|---------|--------|
| **README_SPLIT.md** | 📋 Hướng dẫn chi tiết hoàn chỉnh | ⭐⭐⭐ |
| **DEPLOYMENT_GUIDE.md** | 🚀 Cách deploy lên Render + Netlify | ⭐⭐⭐ |
| **backend/README.md** | 📖 Hướng dẫn backend riêng | ⭐⭐ |
| **frontend/README.md** | 📖 Hướng dẫn frontend riêng | ⭐⭐ |
| **backend/server.js** | 💻 Code backend (API endpoints) | ⭐⭐ |
| **frontend/script.js** | 🎬 Code frontend (Slideshow logic) | ⭐ |

---

## 🔌 API Kết Nối

### Frontend → Backend
**Script tự động phát hiện:**
```javascript
// Local: http://localhost:3000
// Production: https://your-backend.render.com
// Query: ?apiUrl=https://your-backend.render.com
```

**Endpoints:**
- `GET /api/images/active` - Lấy các ảnh kích hoạt

---

## 📦 Migration từ Cấu Trúc Cũ

**File Cũ** | **Vị trí Mới** | **Ghi Chú**
---|---|---
`server.js` | `backend/server.js` | ✅ Giữ nguyên
`package.json` | `backend/package.json` | ✅ Giữ nguyên
`models/Image.js` | `backend/models/Image.js` | ✅ Giữ nguyên
`views/admin.ejs` | `backend/views/admin.ejs` | ✅ Giữ nguyên
`index.html` | `frontend/index.html` | ✅ Giữ nguyên
`script.js` | `frontend/script.js` | ⬆️ **Cập nhật** (Smart API URL)

---

## 🎯 Lợi Ích của Kiến Trúc Mới

### ✨ Tách Biệt Rõ Ràng
- Backend: chỉ API, dễ maintain & upgrade
- Frontend: chỉ UI, dễ deploy lên cdn

### ✨ Dễ Scale
- Scale backend riêng
- Scale frontend riêng
- Không phụ thuộc lẫn nhau

### ✨ Dễ Deploy
- Backend → Render/Heroku
- Frontend → Netlify/Vercel
- Deploy độc lập, không affect nhau

### ✨ Flexible
- Frontend có thể chỉ định API URL
- Hỗ trợ multiple backends
- Hỗ trợ environment khác nhau

---

## ⚡ Quick Start Checklist

- [ ] Đọc **README_SPLIT.md** để hiểu kiến trúc
- [ ] Chạy `npm install` trong `backend/`
- [ ] Chạy `npm run dev` trong `backend/`
- [ ] Mở `frontend/index.html` trên browser
- [ ] Kiểm tra slideshow load hình ảnh
- [ ] Thử keyboard shortcuts (→, F, Space)
- [ ] Đọc **DEPLOYMENT_GUIDE.md** để deploy production

---

## 📞 Support

### Local Issues?
```javascript
// Mở DevTools Console (F12)
logStatus()  // Xem API URL & status
setApiUrl('http://localhost:3000')  // Override API URL
```

### Deployment Issues?
```bash
# Backend logs
Render Dashboard → Logs

# Frontend logs
Browser DevTools → Network tab
```

---

## 🎨 Next Steps

1. ✅ Test local (backend + frontend)
2. ✅ Deploy backend lên Render
3. ✅ Deploy frontend lên Netlify
4. ✅ Connect & test production
5. 🔒 Add authentication (optional)
6. 📊 Add analytics (optional)

---

**Selamat! Sistem sudah siap untuk production! 🚀**
