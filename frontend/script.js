/**
 * SLIDESHOW SYSTEM - Frontend Logic
 * Lấy dữ liệu trực tiếp từ MongoDB Atlas thông qua API
 * 
 * CẤU HÌNH API URL:
 * 1. Để sử dụng backend local: API_BASE_URL = 'http://localhost:3000'
 * 2. Để sử dụng backend remote (Render/Heroku): API_BASE_URL = 'https://your-backend-url.com'
 * 3. Để sử dụng MongoDB Data API trực tiếp: Xem hướng dẫn dưới
 */

// ==================== CONFIG ====================
const CONFIG = {
    // API Base URL - Thay đổi này để kết nối đến backend
    // - Local: 'http://localhost:3000'
    // - Remote: 'https://your-app.render.com' hoặc domain khác
    // - Tự động dùng domain hiện tại: window.location.origin
    API_BASE_URL: getApiBaseUrl(),

    // Thời gian hiển thị mỗi hình ảnh (milliseconds)
    SLIDE_DURATION: 20000, // 20 giây
    // Thời gian fade in/out effect (milliseconds)
    FADE_DURATION: 800,
    // Thời gian tự động ẩn các nút điều khiển (milliseconds)
    AUTO_HIDE_CONTROLS: 3000, // 3 giây
    // Thời gian làm mới danh sách hình ảnh (milliseconds)
    REFRESH_INTERVAL: 60000 // 1 phút
};

// ==================== HELPER: GET API URL ====================
/**
 * Xác định API URL dựa trên environment
 */
function getApiBaseUrl() {
    // Kiểm tra localStorage có URL override
    const savedUrl = localStorage.getItem('slideshow_api_url');
    if (savedUrl) {
        console.log('📍 Sử dụng API URL từ localStorage:', savedUrl);
        return savedUrl;
    }

    // Kiểm tra query parameter ?apiUrl=xxx
    const params = new URLSearchParams(window.location.search);
    const queryUrl = params.get('apiUrl');
    if (queryUrl) {
        console.log('📍 Sử dụng API URL từ query parameter:', queryUrl);
        return queryUrl;
    }

    // Nếu là localhost, dùng localhost:3000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('📍 Local mode - Sử dụng http://localhost:3000');
        return 'http://localhost:3000';
    }

    // Mặc định sử dụng domain hiện tại
    const url = `${window.location.protocol}//${window.location.host}`;
    console.log('📍 Production mode - Sử dụng current domain:', url);
    return url;
}

// ==================== STATE ====================
let slides = [];
let currentIndex = 0;
let isPlaying = true;
let slideInterval = null;
let lastMouseMove = 0;
let hideControlsTimeout = null;

// ==================== DOM ELEMENTS ====================
const slidesContainer = document.getElementById('slidesContainer');
const loading = document.getElementById('loading');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const progressBar = document.getElementById('progressBar');
const infoOverlay = document.getElementById('infoOverlay');
const infoTitle = document.getElementById('infoTitle');
const infoDescription = document.getElementById('infoDescription');
const infoCounter = document.getElementById('infoCounter');

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎬 Slideshow System khởi động...');
    console.log(`🔗 API URL: ${CONFIG.API_BASE_URL}`);

    // Tải hình ảnh từ API
    await loadImages();

    // Khởi động trình chiếu
    if (slides.length > 0) {
        startSlideshow();
    } else {
        showError('Không có hình ảnh để hiển thị');
    }

    // Setup event listeners
    setupEventListeners();

    // Làm mới danh sách hình ảnh định kỳ
    setInterval(() => {
        console.log('🔄 Làm mới danh sách hình ảnh...');
        loadImages();
    }, CONFIG.REFRESH_INTERVAL);
});

// ==================== LOAD IMAGES ====================

/**
 * Tải danh sách hình ảnh từ API
 */
async function loadImages() {
    try {
        // Fetch dữ liệu từ API
        const endpoint = `${CONFIG.API_BASE_URL}/api/images/active`;
        console.log(`📥 Đang tải từ: ${endpoint}`);

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        slides = await response.json();

        console.log(`✅ Tải ${slides.length} hình ảnh thành công`);

        // Nếu chưa bắt đầu slide show, khởi động
        if (slides.length > 0 && !slideInterval) {
            startSlideshow();
        }

        // Ẩn loading nếu có hình ảnh
        if (slides.length > 0) {
            loading.style.display = 'none';
        }

        return slides;
    } catch (error) {
        console.error('❌ Lỗi khi tải hình ảnh:', error);

        // Nếu lỗi API, thử kết nối lại sau 5 giây
        if (!slideInterval) {
            setTimeout(loadImages, 5000);
        }

        return [];
    }
}

// ==================== SLIDESHOW LOGIC ====================

/**
 * Khởi động trình chiếu
 */
function startSlideshow() {
    console.log('▶️ Bắt đầu trình chiếu');

    // Xóa slide cũ từ DOM nếu có
    if (slidesContainer.children.length === 0) {
        renderSlides();
    }

    // Hiển thị slide đầu tiên
    showSlide(0);

    // Bắt đầu vòng lặp chiếu
    startSlideshowLoop();
}

/**
 * Render tất cả slides vào DOM
 */
function renderSlides() {
    slidesContainer.innerHTML = '';

    slides.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = image.imageData;
        img.alt = image.name;
        // Lazy loading tùy chọn
        if (index > 0) {
            img.loading = 'lazy';
        }

        slide.appendChild(img);
        slidesContainer.appendChild(slide);
    });
}

/**
 * Hiển thị slide tại vị trí index
 */
function showSlide(index) {
    if (slides.length === 0) return;

    // Ensure index trong phạm vi
    currentIndex = (index + slides.length) % slides.length;

    // Ẩn tất cả slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });

    // Hiển thị slide hiện tại
    const activeSlide = document.querySelector(`.slide:nth-child(${currentIndex + 1})`);
    if (activeSlide) {
        activeSlide.classList.add('active');
    }

    // Cập nhật thông tin
    updateInfo();

    // Reset progress bar
    resetProgressBar();
}

/**
 * Chuyển sang slide tiếp theo
 */
function nextSlide() {
    showSlide(currentIndex + 1);
}

/**
 * Quay lại slide trước
 */
function prevSlide() {
    showSlide(currentIndex - 1);
}

/**
 * Vòng lặp tự động chuyển slide
 */
function startSlideshowLoop() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }

    slideInterval = setInterval(() => {
        nextSlide();
    }, CONFIG.SLIDE_DURATION);
}

// ==================== INFO & PROGRESS ====================

/**
 * Cập nhật thông tin hiển thị
 */
function updateInfo() {
    if (slides.length === 0) return;

    const currentImage = slides[currentIndex];

    infoCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
    infoTitle.textContent = currentImage.name;
    infoDescription.textContent = currentImage.description || 'Không có mô tả';

    // Hiển thị info overlay
    infoOverlay.classList.add('show');

    // Ẩn sau 5 giây
    setTimeout(() => {
        infoOverlay.classList.remove('show');
    }, 5000);
}

/**
 * Reset progress bar animation
 */
function resetProgressBar() {
    progressBar.style.animation = 'none';
    // Trigger reflow
    void progressBar.offsetWidth;
    progressBar.style.animation = 'progress 20s linear forwards';
}

// ==================== FULLSCREEN ====================

/**
 * Toggle fullscreen mode
 */
async function toggleFullscreen() {
    const container = document.querySelector('.slideshow-container');

    try {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (container.requestFullscreen) {
                await container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                await container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
                await container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
                await container.msRequestFullscreen();
            }

            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            console.log('📺 Vào chế độ fullscreen');
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }

            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            console.log('📺 Thoát chế độ fullscreen');
        }
    } catch (error) {
        console.error('❌ Lỗi fullscreen:', error);
    }
}

/**
 * Auto-hide controls sau thời gian không có tác động
 */
function scheduleHideControls() {
    // Clear timeout cũ nếu có
    if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
    }

    // Hiển thị button
    fullscreenBtn.classList.add('show');

    // Ẩn sau 3 giây
    hideControlsTimeout = setTimeout(() => {
        fullscreenBtn.classList.remove('show');
    }, CONFIG.AUTO_HIDE_CONTROLS);
}

// ==================== EVENT LISTENERS ====================

/**
 * Setup các event listeners
 */
function setupEventListeners() {
    // Fullscreen button
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Mouse movement - hiển thị controls
    document.addEventListener('mousemove', (e) => {
        scheduleHideControls();
    });

    // Touch movement - hiển thị controls
    document.addEventListener('touchmove', (e) => {
        scheduleHideControls();
    }, { passive: true });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);

    // Fullscreen change
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);

    // Hiển thị controls lần đầu
    scheduleHideControls();

    console.log('✅ Event listeners đã được setup');
}

/**
 * Xử lý key press
 */
function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowRight':
        case ' ':
            nextSlide();
            break;
        case 'ArrowLeft':
            prevSlide();
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'Escape':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
}

/**
 * Xử lý sự kiện fullscreen change
 */
function onFullscreenChange() {
    if (!document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

// ==================== ERROR HANDLING ====================

/**
 * Hiển thị error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div>
            <i class="fas fa-exclamation-triangle"></i>
            <div>${message}</div>
            <div style="font-size: 12px; margin-top: 10px; color: rgba(255, 77, 79, 0.7);">
                <small>API URL: ${CONFIG.API_BASE_URL}</small><br>
                Đang thử kết nối lại...
            </div>
        </div>
    `;

    slidesContainer.innerHTML = '';
    slidesContainer.appendChild(errorDiv);
    loading.style.display = 'none';

    console.error('❌ ' + message);

    // Thử lại sau 5 giây
    setTimeout(() => {
        loadImages();
    }, 5000);
}

// ==================== UTILS ====================

/**
 * Log slideshow status
 */
function logStatus() {
    console.log('📊 Slideshow Status:', {
        apiUrl: CONFIG.API_BASE_URL,
        totalSlides: slides.length,
        currentIndex: currentIndex,
        isPlaying: isPlaying,
        currentSlide: slides[currentIndex] ? slides[currentIndex].name : 'No slide',
        slideDuration: `${CONFIG.SLIDE_DURATION / 1000}s`,
        autoHideControls: `${CONFIG.AUTO_HIDE_CONTROLS / 1000}s`
    });
}

/**
 * Set API URL (để override runtime)
 */
function setApiUrl(url) {
    localStorage.setItem('slideshow_api_url', url);
    CONFIG.API_BASE_URL = url;
    console.log('🔗 API URL đã được set thành:', url);
    loadImages();
}

// Export functions để gọi từ console
window.logStatus = logStatus;
window.setApiUrl = setApiUrl;

console.log('🎬 Slideshow Script loaded successfully');
