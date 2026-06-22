/**
 * SLIDESHOW SCRIPT
 * Đọc danh sách ảnh từ images.js → folder public/
 */

// ==================== STATE ====================
let slides = [];
let currentIndex = 0;
let slideInterval = null;
let progressStart = null;
let progressRaf = null;
let hideTimeout = null;
let controlsVisible = false;

// ==================== DOM ====================
const slidesContainer = document.getElementById('slidesContainer');
const loadingEl       = document.getElementById('loading');
const counterEl       = document.getElementById('counter');
const infoOverlay     = document.getElementById('infoOverlay');
const infoNameEl      = document.getElementById('infoName');
const progressBar     = document.getElementById('progressBar');
const fullscreenBtn   = document.getElementById('fullscreenBtn');
const dotsEl          = document.getElementById('dots');
const controls        = document.getElementById('controls');
const prevBtn         = document.getElementById('prevBtn');
const nextBtn         = document.getElementById('nextBtn');

const DURATION_MS = (typeof SLIDE_DURATION_SEC !== 'undefined' ? SLIDE_DURATION_SEC : 20) * 1000;

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Validate images.js
    if (typeof IMAGES === 'undefined') {
        showError('Không tìm thấy file <strong>images.js</strong>');
        return;
    }

    const list = (IMAGES || []).filter(item => item && item.file);

    if (list.length === 0) {
        showEmpty();
        return;
    }

    // Build slides data
    slides = list.map(item => ({
        src:  `public/${item.file}`,
        name: item.name || item.file
    }));

    preloadAndStart();
    setupEvents();
});

// ==================== PRELOAD ====================
function preloadAndStart() {
    let loaded = 0;
    const total = slides.length;

    slides.forEach((slide, i) => {
        const img = new Image();
        img.onload = img.onerror = () => {
            loaded++;
            if (loaded === total) afterLoad();
        };
        img.src = slide.src;
    });
}

function afterLoad() {
    renderSlides();
    renderDots();
    loadingEl.style.display = 'none';
    showSlide(0);
    startLoop();
}

// ==================== RENDER ====================
function renderSlides() {
    slidesContainer.innerHTML = '';
    slides.forEach((slide, i) => {
        const div = document.createElement('div');
        div.className = 'slide';

        const img = document.createElement('img');
        img.src = slide.src;
        img.alt = slide.name;
        img.draggable = false;

        div.appendChild(img);
        slidesContainer.appendChild(div);
    });
}

function renderDots() {
    dotsEl.innerHTML = '';
    if (slides.length <= 1) return;
    // Show dots only if ≤ 20 slides
    if (slides.length > 20) return;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => { jumpTo(i); });
        dotsEl.appendChild(dot);
    });
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// ==================== SHOW SLIDE ====================
function showSlide(index) {
    if (slides.length === 0) return;

    currentIndex = ((index % slides.length) + slides.length) % slides.length;

    document.querySelectorAll('.slide').forEach((el, i) => {
        el.classList.toggle('active', i === currentIndex);
    });

    // Counter
    counterEl.textContent = slides.length > 1 ? `${currentIndex + 1} / ${slides.length}` : '';

    // Info
    infoNameEl.textContent = slides[currentIndex].name;
    infoOverlay.classList.add('show');
    setTimeout(() => infoOverlay.classList.remove('show'), 4000);

    // Dots
    updateDots();

    // Progress bar
    startProgress();
}

function jumpTo(index) {
    clearInterval(slideInterval);
    showSlide(index);
    startLoop();
}

// ==================== LOOP ====================
function startLoop() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(next, DURATION_MS);
}

function next() {
    showSlide(currentIndex + 1);
}

function prev() {
    clearInterval(slideInterval);
    showSlide(currentIndex - 1);
    startLoop();
}

function nextManual() {
    clearInterval(slideInterval);
    showSlide(currentIndex + 1);
    startLoop();
}

// ==================== PROGRESS BAR ====================
function startProgress() {
    cancelAnimationFrame(progressRaf);
    progressStart = performance.now();

    function tick(now) {
        const elapsed = now - progressStart;
        const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
        progressBar.style.width = pct + '%';
        if (pct < 100) progressRaf = requestAnimationFrame(tick);
    }

    progressBar.style.width = '0%';
    progressRaf = requestAnimationFrame(tick);
}

// ==================== CONTROLS VISIBILITY ====================
function showControls() {
    controlsVisible = true;
    controls.classList.add('show');
    dotsEl.classList.add('show');
    fullscreenBtn.classList.add('show');

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideControls, 3000);
}

function hideControls() {
    controlsVisible = false;
    controls.classList.remove('show');
    dotsEl.classList.remove('show');
    fullscreenBtn.classList.remove('show');
}

// ==================== FULLSCREEN ====================
async function toggleFullscreen() {
    const el = document.getElementById('container');
    try {
        if (!document.fullscreenElement) {
            await (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen).call(el);
            fullscreenBtn.textContent = '⛶';
        } else {
            await (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen).call(document);
        }
    } catch (e) {}
}

// ==================== EVENTS ====================
function setupEvents() {
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', nextManual);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('mousemove', showControls);
    document.addEventListener('touchstart', showControls, { passive: true });

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextManual(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    });

    document.addEventListener('fullscreenchange', () => {
        fullscreenBtn.textContent = document.fullscreenElement ? '⛶' : '⛶';
    });

    // Swipe support
    let touchStartX = 0;
    document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) dx < 0 ? nextManual() : prev();
    });
}

// ==================== ERROR / EMPTY ====================
function showError(msg) {
    loadingEl.style.display = 'none';
    slidesContainer.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠</div>
            <div>${msg}</div>
        </div>`;
}

function showEmpty() {
    loadingEl.style.display = 'none';
    slidesContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🖼</div>
            <h2>Chưa có ảnh nào</h2>
            <p>Đặt ảnh vào folder <strong>public/</strong>, rồi khai báo trong <strong>images.js</strong></p>
            <code>// images.js
const IMAGES = [
    { file: "anh1.jpg",  name: "Tiêu đề" },
    { file: "anh2.png",  name: "Ảnh thứ 2" },
    { file: "anh3.webp" },
];</code>
        </div>`;
}
