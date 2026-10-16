// ============================================================
// STORES PAGE — Cửa hàng, Bản đồ & Đặt lịch hẹn thử trang sức
// ============================================================

import { siteInfo } from '../data/site-info.js';
import { addCustomerContact } from '../services/supabase.js';
import { showToast } from '../components/feedback-modal.js';

export function renderStores(container) {
  const page = document.createElement('div');
  page.className = 'page-stores';
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  page.innerHTML = `
    <section class="info-hero">
      <img src="./images/gallery/g9.jpg" alt="Cửa hàng Phát Đạt Jewelry">
      <h1>Cửa Hàng Phát Đạt Jewelry</h1>
    </section>
    <div class="info-body" style="max-width: 1040px;">
      <div class="contact-cards">
        <a class="contact-card" href="${siteInfo.mapsLink}" target="_blank" rel="noopener">
          <h3>📍 Địa chỉ</h3><p>${siteInfo.address}</p>
        </a>
        <a class="contact-card" href="${siteInfo.phoneHref}">
          <h3>📞 Điện thoại / Zalo</h3><p>${siteInfo.phoneDisplay}</p>
        </a>
        <div class="contact-card">
          <h3>🕘 Giờ làm việc</h3><p>${siteInfo.hours}</p>
        </div>
      </div>

      <!-- Showroom Appointment Booking Section -->
      <div style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px; padding: 28px; margin: 32px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.04);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; align-items: start;">
          <div>
            <span style="display: inline-block; background: var(--color-brand-light); color: var(--color-brand-primary); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 20px; margin-bottom: 10px;">✨ Dịch Vụ VIP Tại Cửa Hàng</span>
            <h2 style="font-family: var(--font-display); font-size: 24px; color: var(--color-brand-primary); margin: 0 0 10px;">Đặt Lịch Hẹn Ghé Tiệm & Thử Mẫu</h2>
            <p style="font-size: 13.5px; color: var(--color-text-secondary); line-height: 1.6; margin: 0 0 16px;">
              Đặt lịch trước giúp chuyên viên Phát Đạt chuẩn bị sẵn các mẫu trang sức bạn yêu thích, hỗ trợ đo ni tay chuẩn xác và làm sáng trang sức bạc miễn phí ngay tại tiệm.
            </p>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--color-text-primary); display: flex; flex-direction: column; gap: 8px;">
              <li>✔️ Giữ sẵn mẫu trang sức bạn muốn thử tại quầy riêng</li>
              <li>✔️ Miễn phí vệ sinh & đánh bóng trang sức bạc 925 mang theo</li>
              <li>✔️ Gói quà hộp nhung & viết thiệp tay lấy ngay trong 5 phút</li>
            </ul>
          </div>

          <form id="store-booking-form" style="background: #FBF9F5; padding: 20px; border-radius: 10px; border: 1px solid #EFECE6;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Họ và tên *</label>
                <input type="text" id="book-name" required placeholder="Nguyễn Văn A" style="width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;">
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Số điện thoại *</label>
                <input type="tel" id="book-phone" required placeholder="09xx xxx xxx" style="width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Ngày dự kiến ghé *</label>
                <input type="date" id="book-date" required value="${tomorrow}" min="${new Date().toISOString().slice(0, 10)}" style="width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;">
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Khung giờ</label>
                <select id="book-time" style="width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; background: #fff;">
                  <option value="Sáng (09:00 - 12:00)">Sáng (09:00 - 12:00)</option>
                  <option value="Chiều (13:30 - 17:30)">Chiều (13:30 - 17:30)</option>
                  <option value="Tối (17:30 - 21:00)">Tối (17:30 - 21:00)</option>
                </select>
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Nhu cầu hoặc mẫu muốn thử trước</label>
              <input type="text" id="book-note" placeholder="VD: Thử dây chuyền Cỏ Ba Lá, đo size nhẫn, đánh bóng bạc..." style="width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;">
            </div>

            <button type="submit" id="book-submit-btn" class="btn btn--solid" style="width: 100%; background: var(--color-brand-primary); border-color: var(--color-brand-primary); color: #fff; font-weight: 700;">
              📅 XÁC NHẬN ĐẶT LỊCH HẸN
            </button>
          </form>
        </div>
      </div>

      <iframe class="map-embed" src="${siteInfo.mapsEmbed}" loading="lazy" title="Bản đồ cửa hàng" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="text-center" style="margin-top: 24px;">
        <a href="${siteInfo.mapsLink}" target="_blank" rel="noopener" class="btn">CHỈ ĐƯỜNG GOOGLE MAPS</a>
      </div>
    </div>
  `;

  const form = page.querySelector('#store-booking-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = page.querySelector('#book-submit-btn');
    const name = page.querySelector('#book-name').value.trim();
    const phone = page.querySelector('#book-phone').value.trim();
    const date = page.querySelector('#book-date').value;
    const time = page.querySelector('#book-time').value;
    const note = page.querySelector('#book-note').value.trim();

    btn.disabled = true;
    btn.textContent = 'ĐANG GỬI LỊCH HẸN...';

    await addCustomerContact({
      fullName: name,
      phone,
      subject: `Đặt lịch hẹn Showroom (${date} - ${time})`,
      message: `Lịch hẹn ghé cửa hàng ngày ${date} khung giờ ${time}.${note ? ' Ghi chú: ' + note : ''}`
    });

    btn.disabled = false;
    btn.textContent = '📅 XÁC NHẬN ĐẶT LỊCH HẸN';
    form.reset();
    page.querySelector('#book-date').value = tomorrow;
    showToast(`Đã đặt lịch hẹn ngày ${date} (${time}) thành công! Cửa hàng sẽ liên hệ xác nhận với bạn.`, 'success');
  });

  container.appendChild(page);
}
