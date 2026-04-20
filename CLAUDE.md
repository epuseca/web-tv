# Prompt: Xây dựng Hệ thống Trình chiếu Hình ảnh (Slideshow & Admin)

## 1. Tổng quan kiến trúc
Tôi cần xây dựng một hệ thống gồm hai phần độc lập sử dụng chung một cơ sở dữ liệu MongoDB Atlas.
- **Phần 1: Backend Admin (Chạy Local):** Sử dụng Node.js, Express và EJS để quản lý dữ liệu (CRUD). 
- **Phần 2: Frontend Slideshow (Static File):** Sử dụng HTML/CSS/JS thuần để trình chiếu hình ảnh trên TV (Render dưới dạng trang tĩnh).

## 2. Thông tin kỹ thuật
- **Database:** MongoDB Atlas 
  - URL: `mongodb+srv://root:tTSX93jcaZ0jdhLZ@mern-learn.8g9yxqj.mongodb.net/portal-backend`
  - Schema: 
    - `name`: String
    - `description`: String
    - `isActive`: Boolean (mặc định true)
    - `imageData`: String (Lưu trữ ảnh dưới dạng chuỗi Base64)
    - `createdAt`: Date
- **Công nghệ Frontend:** HTML5, CSS3, JavaScript (ES6+), Ant Design (phiên bản CDN hoặc thư viện CSS/JS tương đương để đảm bảo giao diện chuyên nghiệp).
- **Công nghệ Backend:** Node.js, Express, Mongoose, EJS, Body-parser (giới hạn upload tối thiểu 50mb cho Base64).

## 3. Yêu cầu chi tiết chức năng

### A. Backend Admin (Node.js + EJS) - Local Only
1. **Giao diện:** Sử dụng Ant Design (nhúng qua CDN) để tạo bảng danh sách hình ảnh đẹp mắt.
2. **Chức năng CRUD:**
   - **Thêm ảnh:** Form cho phép nhập Tên, Mô tả, trạng thái Active và một nút chọn file ảnh (Client-side sẽ convert ảnh sang Base64 trước khi gửi lên server).
   - **Danh sách:** Hiển thị dưới dạng Table có Preview ảnh nhỏ, nút sửa, nút xóa và toggle Active.
   - **Cập nhật/Xóa:** Cho phép thay đổi thông tin hoặc gỡ bỏ ảnh khỏi database.
3. **Kết nối:** Kết nối trực tiếp đến MongoDB Atlas qua Mongoose.

### B. Frontend Slideshow (Static HTML/JS) - Render.com
1. **Giao diện:** Toàn màn hình (Full-screen), tối giản, tập trung vào hình ảnh.
2. **Lấy dữ liệu:** Sử dụng Fetch API hoặc thư viện JS để lấy dữ liệu trực tiếp từ MongoDB (Sử dụng giải pháp bypass CORS hoặc MongoDB Data API nếu cần, hoặc giả định Frontend có thể truy cập DB qua logic JS).
   - *Lưu ý:* Chỉ lấy các ảnh có `isActive: true`.
3. **Logic trình chiếu:**
   - Mỗi ảnh hiển thị trong 20 giây.
   - Hiệu ứng chuyển cảnh (fade-in/fade-out) mượt mà.
   - Vòng lặp vô tận (Loop).
4. **Nút Fullscreen:** Đặt ở góc trên bên phải màn hình, tự động ẩn sau 3 giây không di chuyển chuột và hiện lại khi có tác động.

## 4. Yêu cầu mã nguồn
Hãy viết mã nguồn chi tiết cho các file sau:
1. `server.js`: File chạy Backend Node.js.
2. `models/Image.js`: Mongoose Schema.
3. `views/admin.ejs`: Giao diện quản lý Admin.
4. `index.html`: File Frontend tĩnh duy nhất để trình chiếu.
5. `script.js`: Logic xử lý Slideshow và lấy dữ liệu cho `index.html`.

Hãy đảm bảo code sạch, có comment giải thích và giao diện UI/UX hiện đại theo phong cách Ant Design.