// ============================================================
// CONTACT PAGE — Liên Hệ Tư Vấn & Giải Đáp Nhanh (FAQ)
// ============================================================

import { addCustomerContact } from '../services/supabase.js';
import { showToast } from '../components/feedback-modal.js';
import { createAccordion } from '../components/accordion.js';
import { siteInfo } from '../data/site-info.js';

export function renderContact(container) {
  const page = document.createElement('div');
  page.className = 'page-contact';

  let selectedTopic = 'Tư vấn chọn mẫu trang sức';

  page.innerHTML = `
    <section class="contact-hero" style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%); color: #fff; padding: 48px 0; text-align: center;">
      <div class="container">
        <span style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent-gold); font-weight: 700; display: block; margin-bottom: 8px;">CHĂM SÓC KHÁCH HÀNG PHÁT ĐẠT</span>
        <h1 class="contact-hero__title" style="color: #fff; font-family: var(--font-display); margin-bottom: 10px;">Liên Hệ & Tư Vấn Trang Sức</h1>
        <p class="contact-hero__desc" style="color: rgba(255,255,255,0.85); max-width: 560px; margin: 0 auto;">
          Đội ngũ chuyên viên Phát Đạt Jewelry luôn sẵn sàng gửi video thực tế tại quầy, tư vấn chọn size nhẫn và hỗ trợ gói quà tặng miễn phí.
        </p>
      </div>
    </section>

    <div class="container" style="max-width: 1060px; padding: 40px 20px;">
      <!-- Quick Contact Channels -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; margin-bottom: 36px;">
        <a href="${siteInfo.zalo}" target="_blank" rel="noopener" style="background: #F0F7FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 18px; text-decoration: none; color: var(--color-text-primary); display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #0068FF; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">Zalo</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: #0052CC;">Chat Zalo Trực Tiếp</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Phản hồi trong 3–5 phút · Gửi video mẫu thật</div>
          </div>
        </a>

        <a href="${siteInfo.phoneHref}" style="background: #FBF9F5; border: 1px solid #E5DEC9; border-radius: 10px; padding: 18px; text-decoration: none; color: var(--color-text-primary); display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--color-accent-gold); color: #143F3B; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">📞</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--color-brand-primary);">Hotline: ${siteInfo.phoneDisplay}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Hoạt động ${siteInfo.hours}</div>
          </div>
        </a>

        <a href="#/stores" style="background: #F4F9F8; border: 1px solid #C5DEDB; border-radius: 10px; padding: 18px; text-decoration: none; color: var(--color-text-primary); display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--color-brand-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">📍</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--color-brand-primary);">Cửa Hàng Quận 7</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Đặt lịch thử mẫu & đánh bóng bạc miễn phí</div>
          </div>
        </a>
      </div>

      <!-- Main Grid: Form + FAQ -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 36px; align-items: start;">
        <!-- Vietnamese Streamlined Form -->
        <div style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px; padding: 28px; box-shadow: 0 6px 24px rgba(0,0,0,0.04);">
          <h2 style="font-family: var(--font-display); font-size: 22px; color: var(--color-brand-primary); margin: 0 0 6px;">Gửi Yêu Cầu Tư Vấn Nhanh</h2>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 18px;">Để lại thông tin, chuyên viên Phát Đạt sẽ liên hệ qua Zalo hoặc gọi lại cho bạn trong ít phút.</p>

          <form id="vn-contact-form">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 12.5px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px;">Chủ đề bạn cần hỗ trợ *</label>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;" id="contact-topic-pills">
                <button type="button" class="gift-quiz-pill is-selected" data-topic="Tư vấn chọn mẫu trang sức" style="font-size: 12px; padding: 6px 11px;">💎 Tư vấn chọn mẫu</button>
                <button type="button" class="gift-quiz-pill" data-topic="Tư vấn chọn quà & viết thiệp" style="font-size: 12px; padding: 6px 11px;">🎁 Chọn quà & Thiệp tay</button>
                <button type="button" class="gift-quiz-pill" data-topic="Đặt chỉnh size nhẫn / dây" style="font-size: 12px; padding: 6px 11px;">📏 Chỉnh size nhẫn/dây</button>
                <button type="button" class="gift-quiz-pill" data-topic="Bảo hành & Làm sáng bạc" style="font-size: 12px; padding: 6px 11px;">✨ Bảo hành & Làm sáng</button>
                <button type="button" class="gift-quiz-pill" data-topic="Đổi mẫu / Hỗ trợ đơn hàng" style="font-size: 12px; padding: 6px 11px;">🔄 Đổi trả / Đơn hàng</button>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
              <div>
                <label style="display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 5px;">Họ và tên *</label>
                <input type="text" id="ct-fullname" required placeholder="VD: Nguyễn Minh Anh" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px;">
              </div>
              <div>
                <label style="display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 5px;">Số điện thoại / Zalo *</label>
                <input type="tel" id="ct-phone" required placeholder="09xx xxx xxx" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px;">
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 5px;">Email (Không bắt buộc)</label>
              <input type="email" id="ct-email" placeholder="example@gmail.com" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px;">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 5px;">Nội dung hoặc mã sản phẩm quan tâm *</label>
              <textarea id="ct-message" rows="3" required placeholder="VD: Mình muốn xem ảnh thật mẫu dây chuyền Cỏ Ba Lá xà cừ (PD001) và tư vấn hộp quà sinh nhật..." style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px;"></textarea>
            </div>

            <button type="submit" id="ct-submit-btn" class="btn btn--solid" style="width: 100%; background: var(--color-brand-primary); border-color: var(--color-brand-primary); color: #fff; font-weight: 700; padding: 13px;">
              📩 GỬI YÊU CẦU TƯ VẤN NGAY
            </button>
          </form>
        </div>

        <!-- FAQ Accordion Column -->
        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--color-accent-gold); text-transform: uppercase; letter-spacing: 0.12em;">GIẢI ĐÁP THẮC MẮC NHANH</span>
          <h2 style="font-family: var(--font-display); font-size: 22px; color: var(--color-brand-primary); margin: 4px 0 16px;">Câu Hỏi Thường Gặp (FAQ)</h2>
          <div id="contact-faq-container"></div>
        </div>
      </div>
    </div>
  `;

  // Topic pill selection
  page.querySelectorAll('#contact-topic-pills .gift-quiz-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      page.querySelectorAll('#contact-topic-pills .gift-quiz-pill').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedTopic = btn.dataset.topic;
    });
  });

  // Populate FAQ Accordions
  const faqContainer = page.querySelector('#contact-faq-container');
  const faqs = [
    {
      q: '1. Trang sức Bạc 925 tại Phát Đạt đeo lâu có bị đen hay ngứa không?',
      a: '<p style="font-size:13px;line-height:1.6;color:var(--color-text-secondary);">Tất cả sản phẩm đều chế tác từ <strong>Bạc chuẩn S925 quốc tế</strong> phủ xi vàng 18K hoặc bạch kim cao cấp, hoàn toàn không chứa niken nên <strong>tuyệt đối an toàn, không gây ngứa</strong> cho da nhạy cảm. Đặc tính của bạc thật có thể xỉn nhẹ theo mồ hôi sau thời gian dài, nhưng tiệm hỗ trợ <strong>đánh bóng & làm sáng miễn phí trọn đời</strong>.</p>'
    },
    {
      q: '2. Nhận hàng kiểm tra không vừa size nhẫn có được đổi không?',
      a: '<p style="font-size:13px;line-height:1.6;color:var(--color-text-secondary);">Quý khách được <strong>đồng kiểm tra hàng trước khi thanh toán</strong> và hỗ trợ <strong>đổi size / đổi mẫu miễn phí trong vòng 7 ngày</strong> kể từ khi nhận hàng.</p>'
    },
    {
      q: '3. Mua làm quà tặng thì tiệm có gói sẵn hộp quà và thiệp không?',
      a: '<p style="font-size:13px;line-height:1.6;color:var(--color-text-secondary);">Mỗi món trang sức đều được <strong>tặng kèm miễn phí hộp nhung/hộp nơ sang trọng, túi giấy, khăn lau bạc chuyên dụng và thiệp chúc mừng viết tay</strong> theo đúng nội dung bạn yêu cầu.</p>'
    },
    {
      q: '4. Thời gian giao hàng tại TP.HCM và các tỉnh mất bao lâu?',
      a: '<p style="font-size:13px;line-height:1.6;color:var(--color-text-secondary);">• <strong>Nội thành TP.HCM:</strong> Giao nhanh trong ngày (2–4h) hoặc 1–2 ngày.<br>• <strong>Các tỉnh thành khác:</strong> Từ 2–4 ngày làm việc qua đơn vị vận chuyển uy tín.</p>'
    },
    {
      q: '5. Làm sao để bảo hành làm sáng trang sức bạc khi ở xa?',
      a: '<p style="font-size:13px;line-height:1.6;color:var(--color-text-secondary);">Bạn có thể dùng khăn lau bạc chuyên dụng (được tặng kèm sẵn trong hộp) để lau sáng ngay tại nhà trong 30 giây, hoặc gửi sản phẩm về cửa hàng Quận 7 để kỹ thuật viên đánh bóng miễn phí trọn đời.</p>'
    }
  ];

  faqs.forEach((item, idx) => {
    faqContainer.appendChild(createAccordion(item.q, item.a, idx === 0));
  });

  // Form submission
  const form = page.querySelector('#vn-contact-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = page.querySelector('#ct-fullname').value.trim();
    const phone = page.querySelector('#ct-phone').value.trim();
    const email = page.querySelector('#ct-email').value.trim();
    const message = page.querySelector('#ct-message').value.trim();
    const submitBtn = page.querySelector('#ct-submit-btn');

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 12) {
      showToast('Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số)!', 'warning');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'ĐANG GỬI YÊU CẦU...';

    await addCustomerContact({
      fullName,
      phone: cleanPhone,
      email,
      subject: selectedTopic,
      message
    });

    showToast('Gửi yêu cầu tư vấn thành công! Chuyên viên Phát Đạt sẽ liên hệ với bạn sớm nhất.', 'success', 4000);
    submitBtn.textContent = '✓ ĐÃ GỬI YÊU CẦU THÀNH CÔNG!';
    form.reset();
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = '📩 GỬI YÊU CẦU TƯ VẤN NGAY';
    }, 3000);
  });

  container.appendChild(page);
}

