# 🚀 Hướng Dẫn Deployment Chi Tiết

## 📋 Tổng Quan

Hệ thống bao gồm 2 phần deploy riêng:
1. **Backend** → Render.com (hoặc Heroku/Railway)
2. **Frontend** → Netlify (hoặc Vercel/GitHub Pages)

---

## Part 1: Deploy Backend lên Render.com

### Bước 1: Chuẩn Bị Code
```bash
# Chắc chắn tất cả file đã lưu
cd backend
npm install  # Test local trước
npm run dev  # Kiểm tra server chạy OK
```

### Bước 2: Push lên GitHub
```bash
# Khởi tạo git (nếu chưa có)
git init
git remote add origin https://github.com/YOUR-USERNAME/slideshow-system.git

# Commit code
git add .
git commit -m "Initial commit: slideshow backend"
git push -u origin main
```

### Bước 3: Connect Render.com
1. Truy cập [render.com](https://render.com)
2. Sign up/Login
3. Dashboard → **New Web Service**
4. Chọn: **Connect GitHub repository**
5. Authorize & chọn repo `slideshow-system`

### Bước 4: Configure Render
```
Service Name: slideshow-backend
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
Instance Type: Free (hoặc Paid)
```

### Bước 5: Environment Variables
Trong Render Dashboard:
- Chọn Service → Environment
- Add Variables:
  ```
  MONGO_URL=mongodb+srv://root:tTSX93jcaZ0jdhLZ@mern-learn.8g9yxqj.mongodb.net/portal-backend
  PORT=3000
  NODE_ENV=production
  ```

### Bước 6: Deploy
- Click **Create Web Service**
- Render tự động build & deploy
- Chờ status = **Live** (2-5 phút)

### Bước 7: Lấy Backend URL
```
Backend URL: https://slideshow-backend-xxx.render.com
```

**Kiểm tra:**
```
https://slideshow-backend-xxx.render.com/api/images
```
Nếu trả về JSON array → ✅ Success!

---

## Part 2: Deploy Frontend lên Netlify

### Bước 1: Chuẩn Bị Frontend
```bash
# Copy backend URL vào frontend/script.js
# hoặc sử dụng query parameter
```

### Bước 2: Push Frontend lên GitHub
```bash
# Tạo folder frontend hoặc branch riêng
git add frontend/
git commit -m "Add slideshow frontend"
git push
```

### Bước 3: Connect Netlify
1. Truy cập [netlify.com](https://netlify.com)
2. Sign up/Login
3. **Add new site** → **Import an existing project**
4. Connect GitHub
5. Chọn repo `slideshow-system`

### Bước 4a: Build Configuration (Nếu chọn Git)
```
Base directory: frontend
Build command: (leave empty)
Publish directory: frontend
```

### Bước 4b: Deploy (Drag & Drop)
```
Netlify → Create new site → Drag files
- Chọn tất cả file trong /frontend folder
- Drag vào Netlify
- Auto deploy!
```

### Bước 5: Configure Frontend
**Option A: Update Netlify Environment**
```
Site settings → Build & deploy → Environment
Add: API_URL=https://slideshow-backend-xxx.render.com
```

**Option B: Update URL via Query Parameter**
```
https://slideshow-frontend-xxx.netlify.app/index.html?apiUrl=https://slideshow-backend-xxx.render.com
```

### Bước 6: Test Slideshow
1. Mở: `https://slideshow-frontend-xxx.netlify.app`
2. Chờ loading
3. Kiểm tra:
   - [ ] Hình ảnh load đúng
   - [ ] Slide chuyển mỗi 20 giây
   - [ ] Fullscreen button hoạt động
   - [ ] Keyboard shortcuts (Arrow, F, Space)

---

## Alternative: Deploy Backend lên Heroku

### Prerequisite
- Heroku CLI installed
- Heroku account

### Các Bước
```bash
# Login Heroku
heroku login

# Create app
cd backend
heroku create slideshow-backend

# Add environment variables
heroku config:set MONGO_URL="mongodb+srv://root:..."
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

---

## Alternative: Deploy Frontend lên Vercel

### Các Bước
1. Truy cập [vercel.com](https://vercel.com)
2. Import Project → Select GitHub repo
3. Framework: **Other** (Static)
4. Root: `frontend`
5. Deploy!

---

## Alternative: Deploy Frontend lên GitHub Pages

### Các Bước
```bash
# Tạo branch gh-pages
git checkout -b gh-pages
mv frontend/* .
rm -rf backend CLAUDE.md README.md
git add .
git commit -m "Deploy to GitHub Pages"
git push -u origin gh-pages

# Enable GitHub Pages
GitHub → Settings → Pages
- Source: Branch: gh-pages
- Save
```

URL: `https://your-username.github.io/slideshow-system`

---

## 🔧 Post-Deployment Configuration

### 1. Cập Nhật Frontend API URL
**Option 1: Query Parameter** ✅ Easiest
```
https://slideshow-frontend-xxx.netlify.app/index.html?apiUrl=https://slideshow-backend-xxx.render.com
```

**Option 2: Environment Variable in Netlify**
```
Build & deploy → Environment → Add:
API_URL=https://slideshow-backend-xxx.render.com
```

**Option 3: Edit script.js & Redeploy**
```javascript
// frontend/script.js
API_BASE_URL: 'https://slideshow-backend-xxx.render.com'
```

### 2. Enable Auto-Rebuild
**Backend (Render):**
- Auto-deploys on push to main ✅

**Frontend (Netlify):**
- Build hooks → Add new build hook
- Copy URL → Add to GitHub Actions (optional)

### 3. Monitor Deployment
**Backend**
```bash
# Check logs
Render Dashboard → Service → Logs
```

**Frontend**
```bash
# Check deploy
Netlify Dashboard → Deploys → Latest
```

---

## ✅ Deployment Checklist

### Backend
- [ ] GitHub repo created
- [ ] Render.com connected
- [ ] Environment variables set
- [ ] API endpoint working
- [ ] Test: `curl https://backend-url.render.com/api/images`

### Frontend  
- [ ] Frontend repo/folder pushed
- [ ] Netlify/Vercel connected
- [ ] API URL configured
- [ ] Test: Navigate to slideshow URL
- [ ] Test: Slideshow displays images
- [ ] Test: Keyboard shortcuts work
- [ ] Test: Fullscreen works

### Production Ready
- [ ] Both URLs work
- [ ] CORS enabled
- [ ] SSL/TLS (automatic on Render/Netlify)
- [ ] MongoDB Atlas backup enabled
- [ ] No sensitive data in code

---

## 🐛 Troubleshooting Deployment

### ❌ Backend not deploying

**Solution:**
1. Check Render logs
2. Verify `npm install` works locally
3. Verify `npm start` works locally
4. Check `package.json` main field
5. Verify PORT=3000 in render.yaml

### ❌ Frontend not loading images

**Solution:**
1. Check browser console (DevTools F12)
2. Copy API URL from Render
3. Run in console: `setApiUrl('https://backend-url')`
4. Check network tab → API requests
5. Verify CORS headers

### ❌ 502 Bad Gateway

**Solution:**
1. Check backend memory usage
2. Restart service
3. Check database connection
4. Verify env variables set

### ❌ Slow performance

**Solution:**
1. Upgrade to paid tier
2. Enable caching
3. Compress images (Base64)
4. Use CDN for frontend

---

## 📝 Production Deployment Best Practices

### Security
- ✅ Use environment variables (never commit secrets)
- ✅ Enable database backups
- ✅ Use HTTPS (automatic on Render/Netlify)
- ✅ Rate limiting on API
- ✅ Validate all inputs
- ⚠️ Add authentication for admin panel

### Performance
- ✅ Enable caching headers
- ✅ Compress images
- ✅ Use CDN for frontend
- ✅ Monitor database performance
- ✅ Set up alerts for errors

### Maintenance
- ✅ Regular backups (MongoDB Atlas auto-backup)
- ✅ Monitor logs
- ✅ Update dependencies regularly
- ✅ Test new features before deploy
- ✅ Keep documentation updated

---

## 📊 Cost Estimation

| Service | Tier | Cost |
|---------|------|------|
| **Render** | Free | $0/month |
| **Render** | Starter | $7/month |
| **Netlify** | Free | $0/month |
| **MongoDB** | Free | 512MB |
| **MongoDB** | M10 | $57/month |
| **Total** | Minimal | ~$0-65/month |

---

## 🎯 What's Next?

1. ✅ Add authentication to admin panel
2. ✅ Add image optimization
3. ✅ Add analytics
4. ✅ Add user management
5. ✅ Add payment integration

---

**Need Help?**
- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
