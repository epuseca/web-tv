# Frontend - Slideshow
HTML + CSS + JavaScript

## Cấu trúc thư mục
```
/frontend
├── index.html        # Main slideshow page
├── script.js         # Slideshow logic
└── config.md         # Configuration guide
```

## Cách sử dụng

### 1. Local (với backend chạy ở localhost:3000)
```bash
# Mở file index.html trực tiếp hoặc sử dụng Live Server
```

Script tự động phát hiện nếu server là localhost → dùng http://localhost:3000

### 2. Production (backend deployed)
Có 3 cách cấu hình API URL:

#### Cách A: Query Parameter
```
https://your-slideshow.netlify.app/index.html?apiUrl=https://your-backend.render.com
```

#### Cách B: Local Storage (via Console)
Mở DevTools (F12) → Console:
```javascript
setApiUrl('https://your-backend.render.com')
```

#### Cách C: Update script.js
Sửa trực tiếp trong `script.js`:
```javascript
API_BASE_URL: 'https://your-backend.render.com'
```

---

## Deploy Frontend

### Option 1: Netlify (Recommended)
```bash
# Drag & drop /frontend folder
```

### Option 2: Vercel
```bash
# Project settings → Framework = Next.js (skip)
# Deploy static files
```

### Option 3: GitHub Pages
```bash
# Push /frontend to separate repo
# Enable Pages in settings
```

### Option 4: Render Static Site
1. Create new Static Site
2. Connect GitHub
3. Publish directory: `/frontend`

---

## Features

✅ Slideshow 20 giây/ảnh  
✅ Fade effect  
✅ Toàn màn hình (fullscreen)  
✅ Auto-hide controls  
✅ Keyboard shortcuts  
✅ Tự auto-refresh mỗi 60 giây  
✅ Config API URL dễ dàng  

---

## Keyboard Shortcuts

| Phím | Chức năng |
|------|----------|
| → | Slide tiếp theo |
| ← | Slide trước |
| Space | Slide tiếp theo |
| F | Toggle fullscreen |
| Esc | Thoát fullscreen |

---

## Debugging

Mở DevTools (F12) → Console:

```javascript
// Xem status
logStatus()

// Đổi API URL
setApiUrl('https://your-backend.render.com')

// Xem logs
console.log() output
```

---

## Lưu ý
- Cần CORS enabled trên backend
- Chỉ hiển thị hình ảnh có `isActive: true`
- Tự động retry nếu lỗi kết nối
- Hỗ trợ lazy loading cho ảnh
