// ============================================================
// ABOUT US PAGE
// ============================================================

import { t } from '../i18n.js';

export function renderAbout(container) {
  const page = document.createElement('div');
  page.className = 'page-about container section';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.style.textAlign = 'center';
  title.style.marginBottom = '48px';
  title.textContent = t('nav.about') || 'Về Chúng Tôi';
  page.appendChild(title);

  const content = document.createElement('div');
  content.style.maxWidth = '800px';
  content.style.margin = '0 auto';
  content.style.lineHeight = '1.8';
  content.style.fontSize = '1.05rem';
  content.style.color = 'var(--color-text-primary)';

  content.innerHTML = `
    <div style="margin-bottom: 40px;">
      <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 24px; text-align: center; color: var(--color-brand-primary);">Câu Chuyện Thương Hiệu Phát Đạt Jewelry</h2>
      <p style="margin-bottom: 20px;">Được thành lập với sứ mệnh mang đến vẻ đẹp tinh tế, sang trọng nhưng gần gũi cho phụ nữ Việt Nam, <strong>Phát Đạt Jewelry</strong> tin rằng mỗi món trang sức nhỏ bé đều mang một nguồn năng lượng tích cực và may mắn riêng cho người đeo.</p>
      <p>Từ họa tiết cỏ ba lá biểu trưng cho may mắn, những đóa hoa nhỏ đính đá rạng rỡ cho đến những viên đá Moissanite lấp lánh tựa ánh sao, chúng tôi mang đến những thiết kế trang sức bạc hiện đại, nhẹ nhàng để bạn tự tin toả sáng trong công việc hằng ngày cũng như những buổi tiệc đặc biệt.</p>
    </div>

    <div style="margin-bottom: 40px; text-align: center;">
      <img src="./images/gallery/g16.jpg" alt="Chế tác trang sức Phát Đạt Jewelry" style="width: 100%; max-height: 420px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    </div>

    <div>
      <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 24px; text-align: center; color: var(--color-brand-primary);">Tiêu Chuẩn Bạc 925 & Cam Kết Trọn Đời</h2>
      <p style="margin-bottom: 20px;">Tất cả sản phẩm tại Phát Đạt Jewelry đều được chế tác từ <strong>Bạc chuẩn 925 cao cấp</strong> (92.5% bạc nguyên chất), được phủ thêm lớp xi mạ vàng 18K hoặc bạch kim sáng bóng giúp tăng độ bền màu và chống oxy hóa vượt trội, đặc biệt tuyệt đối an toàn và êm dịu cho làn da nhạy cảm.</p>
      <p style="margin-bottom: 20px;">Đặc biệt, Phát Đạt Jewelry cam kết chính sách <strong>bảo hành đánh bóng và làm sáng miễn phí trọn đời</strong> cho tất cả khách hàng, cùng hộp đựng quà trang nhã đi kèm cho từng sản phẩm.</p>
      <div style="text-align: center; margin-top: 32px;">
        <a href="#/jewelry" class="btn" style="background-color: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">KHÁM PHÁ CÁC BỘ SƯU TẬP</a>
      </div>
    </div>
  `;

  page.appendChild(content);
  container.appendChild(page);
}
