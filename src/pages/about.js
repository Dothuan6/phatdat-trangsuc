// ============================================================
// ABOUT US PAGE — Câu Chuyện Thương Hiệu, Chế Tác Bạc 925 & FAQ
// ============================================================

import { t } from '../i18n.js';
import { createAccordion } from '../components/accordion.js';
import { openGiftFinderModal } from '../components/feedback-modal.js';

export function renderAbout(container) {
  const page = document.createElement('div');
  page.className = 'page-about container section';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.style.textAlign = 'center';
  title.style.marginBottom = '36px';
  title.textContent = t('nav.about') || 'Về Phát Đạt Jewelry';
  page.appendChild(title);

  const content = document.createElement('div');
  content.style.maxWidth = '920px';
  content.style.margin = '0 auto';
  content.style.lineHeight = '1.8';
  content.style.fontSize = '1.02rem';
  content.style.color = 'var(--color-text-primary)';

  content.innerHTML = `
    <div style="margin-bottom: 40px; text-align: center;">
      <span style="font-size: 12px; font-weight: 700; color: var(--color-accent-gold); text-transform: uppercase; letter-spacing: 0.14em;">SỨ MỆNH THƯƠNG HIỆU</span>
      <h2 style="font-family: var(--font-display); font-size: 2rem; margin: 8px 0 20px; color: var(--color-brand-primary);">Câu Chuyện Thương Hiệu Phát Đạt Jewelry</h2>
      <p style="margin-bottom: 18px;">Được thành lập tại Quận 7, TP.HCM với sứ mệnh mang đến vẻ đẹp tinh tế, sang trọng nhưng gần gũi cho phụ nữ Việt Nam, <strong>Phát Đạt Jewelry</strong> tin rằng mỗi món trang sức nhỏ bé đều mang một nguồn năng lượng tích cực và may mắn riêng cho người đeo.</p>
      <p>Từ họa tiết cỏ ba lá biểu trưng cho may mắn, những đóa hoa nhỏ đính đá rạng rỡ cho đến những viên đá Moissanite lấp lánh tựa ánh sao, chúng tôi mang đến những thiết kế trang sức bạc hiện đại, nhẹ nhàng để bạn tự tin toả sáng trong công việc hằng ngày cũng như những buổi tiệc đặc biệt.</p>
    </div>

    <div style="margin-bottom: 44px; text-align: center;">
      <img src="./images/gallery/g16.jpg" alt="Chế tác trang sức Phát Đạt Jewelry" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.08);">
    </div>

    <!-- 4-Step Craftsmanship Process -->
    <div style="margin-bottom: 48px;">
      <h2 style="font-family: var(--font-display); font-size: 1.85rem; margin-bottom: 24px; text-align: center; color: var(--color-brand-primary);">Quy Trình Chế Tác & Kiểm Định Bạc Chuẩn S925</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px;">
        <div style="background: #FBF9F5; border: 1px solid #EFECE6; border-radius: 10px; padding: 20px;">
          <div style="font-size: 24px; margin-bottom: 8px;">01 · 🥈</div>
          <h4 style="color: var(--color-brand-primary); margin: 0 0 6px; font-size: 15px;">Tuyển Chọn Phôi Bạc S925</h4>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.55;">Sử dụng 92.5% bạc nguyên chất kết hợp hợp kim cao cấp giúp tạo độ cứng cáp, không chứa chì hay niken gây kích ứng da.</p>
        </div>
        <div style="background: #FBF9F5; border: 1px solid #EFECE6; border-radius: 10px; padding: 20px;">
          <div style="font-size: 24px; margin-bottom: 8px;">02 · 💎</div>
          <h4 style="color: var(--color-brand-primary); margin: 0 0 6px; font-size: 15px;">Chấu Đá Vi Điểm Thủ Công</h4>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.55;">Từng viên đá CZ, đá Moissanite và mặt xà cừ thiên nhiên được nạm chấu tỉ mỉ dưới kính hiển vi để giữ độ bắt sáng tối đa.</p>
        </div>
        <div style="background: #FBF9F5; border: 1px solid #EFECE6; border-radius: 10px; padding: 20px;">
          <div style="font-size: 24px; margin-bottom: 8px;">03 · ✨</div>
          <h4 style="color: var(--color-brand-primary); margin: 0 0 6px; font-size: 15px;">Xi Mạ Vàng 18K & Bạch Kim</h4>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.55;">Phủ lớp xi điện phân đa tầng giúp bề mặt sáng bóng như vàng trắng/vàng 18K và hạn chế tối đa quá trình oxy hóa.</p>
        </div>
        <div style="background: #FBF9F5; border: 1px solid #EFECE6; border-radius: 10px; padding: 20px;">
          <div style="font-size: 24px; margin-bottom: 8px;">04 · 🎁</div>
          <h4 style="color: var(--color-brand-primary); margin: 0 0 6px; font-size: 15px;">Đóng Gói Hộp Quà & Bảo Hành</h4>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.55;">Kiểm tra độ bóng lần cuối, đóng hộp nhung sang trọng kèm khăn lau bạc và kích hoạt bảo hành làm sáng trọn đời.</p>
        </div>
      </div>
    </div>

    <!-- Interactive FAQ Section -->
    <div style="margin-bottom: 44px;">
      <h2 style="font-family: var(--font-display); font-size: 1.85rem; margin-bottom: 20px; text-align: center; color: var(--color-brand-primary);">Câu Hỏi Thường Gặp Về Trang Sức Phát Đạt</h2>
      <div id="about-faq-list"></div>
    </div>

    <div style="text-align: center; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
      <a href="#/jewelry" class="btn" style="background-color: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">KHÁM PHÁ CÁC BỘ SƯU TẬP</a>
      <button type="button" id="about-gift-btn" class="btn" style="background: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 700;">🎁 MỞ TRỢ LÝ CHỌN QUÀ 30S</button>
    </div>
  `;

  const faqList = content.querySelector('#about-faq-list');
  const aboutFaqs = [
    {
      q: 'Làm sao phân biệt Bạc 925 thật tại Phát Đạt Jewelry?',
      a: '<p style="font-size:13.5px;line-height:1.6;color:var(--color-text-secondary);">Mỗi sản phẩm tại Phát Đạt đều có khắc ký hiệu <strong>S925</strong> tinh xảo trên móc khóa hoặc lòng nhẫn, đi kèm thẻ bảo hành chính hãng của cửa hàng tại 709 Trần Xuân Soạn, Quận 7.</p>'
    },
    {
      q: 'Chính sách bảo hành đánh bóng & làm sáng trọn đời áp dụng như thế nào?',
      a: '<p style="font-size:13.5px;line-height:1.6;color:var(--color-text-secondary);">Bất kỳ khi nào trang sức của bạn bị mờ sau thời gian dài sử dụng, bạn chỉ cần mang ghé trực tiếp cửa hàng hoặc gửi về tiệm, kỹ thuật viên sẽ siêu âm làm sạch và đánh bóng miễn phí 100% không giới hạn số lần.</p>'
    },
    {
      q: 'Da nhạy cảm đeo trang sức bạc xi vàng của shop có bị ngứa không?',
      a: '<p style="font-size:13.5px;line-height:1.6;color:var(--color-text-secondary);">Hoàn toàn không. Phôi bạc S925 chuẩn quốc tế của Phát Đạt không pha tạp niken — nguyên nhân chính gây kích ứng da ở các loại mỹ ký giá rẻ.</p>'
    }
  ];
  aboutFaqs.forEach((f, idx) => faqList.appendChild(createAccordion(f.q, f.a, idx === 0)));

  content.querySelector('#about-gift-btn').addEventListener('click', () => openGiftFinderModal());

  page.appendChild(content);
  container.appendChild(page);
}

