/**
 * ==========================================
 *  DANH SÁCH ẢNH - CHỈNH SỬA FILE NÀY
 * ==========================================
 *
 * Hướng dẫn:
 * 1. Đặt file ảnh vào folder  public/
 * 2. Thêm tên file vào mảng IMAGES bên dưới
 * 3. Hỗ trợ: .jpg, .jpeg, .png, .gif, .webp, .avif, .svg
 *
 * Ví dụ:
 *   { file: "anh1.jpg",  name: "Bình minh trên biển" },
 *   { file: "photo.png", name: "Khoảnh khắc đẹp" },
 *   { file: "img.webp" }   ← name có thể bỏ trống
 *
 * Thứ tự trong mảng = thứ tự chiếu.
 */

const IMAGES = [
    // ─── Thêm ảnh của bạn vào đây ───────────────────────────
    { file: "bìa fanpage.png", name: "Tiêu đề tuỳ chọn" },
    { file: "Bộ GTCL.jpg", name: "Ảnh thứ hai" },
    { file: "FANPAGE-01.png", name: "Ảnh thứ 3" },
    { file: "Ngày 18.5.JPG", name: "Ảnh thứ 4" },
    // { file: "anh3.webp" },
    // ────────────────────────────────────────────────────────
];

/**
 * Thời gian mỗi ảnh hiển thị (giây)
 */
const SLIDE_DURATION_SEC = 20;
