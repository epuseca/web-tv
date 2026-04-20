# Backend - Admin Panel
Node.js + Express + MongoDB

## Cấu trúc thư mục
```
/backend
├── server.js          # Express server
├── package.json       # Dependencies
├── .env              # Environment variables
├── models/
│   └── Image.js      # MongoDB schema
└── views/
    └── admin.ejs     # Admin interface
```

## Cài đặt & Chạy

### 1. Cài dependencies
```bash
cd backend
npm install
```

### 2. Tạo file .env
```env
MONGO_URL=mongodb+srv://root:tTSX93jcaZ0jdhLZ@mern-learn.8g9yxqj.mongodb.net/portal-backend
PORT=3000
NODE_ENV=development
```

### 3. Chạy server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

URL: http://localhost:3000

---

## API Endpoints

- `GET /` - Admin panel
- `GET /api/images` - Tất cả hình ảnh
- `GET /api/images/active` - Hình ảnh kích hoạt
- `POST /api/images` - Thêm hình ảnh
- `PUT /api/images/:id` - Cập nhật hình ảnh
- `DELETE /api/images/:id` - Xóa hình ảnh
- `PATCH /api/images/:id/toggle` - Toggle trạng thái

---

## Deploy lên Render.com

### Option 1: Sử dụng Render CLI
```bash
render deploy --source=backend
```

### Option 2: Connect GitHub
1. Push code lên GitHub
2. Vào render.com → New Web Service
3. Connect GitHub repo
4. Settings:
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: Add `MONGO_URL`

### Sau khi deploy
- Backend URL sẽ là: `https://your-app.render.com`
- Update frontend để dùng URL này

---

## Lưu ý
- Nên thêm authentication trước khi deploy production
- Limit request size là 50MB
- CORS được bật để frontend có thể gọi API
