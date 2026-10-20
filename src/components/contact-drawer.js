// ============================================================
// SMART CONTACT & SUPPORT DRAWER HUB — Phát Đạt Jewelry
// ============================================================

import { siteInfo } from '../data/site-info.js';
import { addCustomerContact } from '../services/supabase.js';
import {
  showToast,
  openGiftFinderModal,
  openFengShuiMatcherModal,
  openWarrantyLookupModal,
  openCoupleBuilderModal,
  openAnniversaryReminderModal,
  openFaceHandStylingModal,
  openLightboxModal
} from './feedback-modal.js';
import { openGlobalSizeGuide } from './size-guide-modal.js';
import { getComfortPrefs, saveComfortPrefs, applyComfortPrefs } from '../data/wishlist-store.js';

export function createContactDrawer() {
  const overlay = document.createElement('div');
  overlay.className = 'contact-drawer-overlay';
  overlay.id = 'contact-drawer-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'contact-drawer';
  drawer.id = 'contact-drawer';

  const hour = new Date().getHours();
  const isOpenNow = hour >= 9 && hour < 21;

  drawer.innerHTML = `
    <div class="contact-drawer__header" style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%); color: #fff; padding: 18px 20px;">
      <div>
        <span class="contact-drawer__title" style="color: #fff; font-weight: 700; font-size: 16px; display: block;">Trung Tâm Hỗ Trợ & Tư Vấn</span>
        <span style="font-size: 11.5px; color: ${isOpenNow ? '#68F7A6' : '#FCD34D'}; font-weight: 600;">
          ${isOpenNow ? '● Cửa hàng Quận 7 đang mở cửa (09:00 – 21:00)' : '🌙 Ngoài giờ mở cửa — Để lại SĐT mai tiệm gọi ngay'}
        </span>
      </div>
      <button class="contact-drawer__close" aria-label="Close" style="color: #fff;">✕</button>
    </div>

    <div class="contact-drawer__body" id="contact-drawer-body" style="padding: 20px; overflow-y: auto;">
      <!-- Direct Contact Channels -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;">
        <a href="${siteInfo.zalo}" target="_blank" rel="noopener" style="background: #0068FF; color: #fff; border-radius: 8px; padding: 12px; text-decoration: none; text-align: center; font-weight: 700; font-size: 13px;">
          💬 Chat Zalo Ngay
          <div style="font-size: 10.5px; font-weight: 400; opacity: 0.9; margin-top: 2px;">Xem video mẫu thật</div>
        </a>
        <a href="${siteInfo.phoneHref}" style="background: var(--color-brand-primary); color: #fff; border-radius: 8px; padding: 12px; text-decoration: none; text-align: center; font-weight: 700; font-size: 13px;">
          📞 Gọi ${siteInfo.phoneDisplay}
          <div style="font-size: 10.5px; font-weight: 400; opacity: 0.9; margin-top: 2px;">Hỗ trợ nhanh 24/7</div>
        </a>
      </div>

      <!-- Inline 30s Callback Request -->
      <div style="background: #FBF9F5; border: 1px solid #E5DEC9; border-radius: 10px; padding: 14px; margin-bottom: 18px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 4px;">📲 Yêu cầu chuyên viên gọi lại trong 5 phút</div>
        <div style="font-size: 11.5px; color: var(--color-text-secondary); margin-bottom: 10px;">Chỉ cần nhập SĐT, Phát Đạt sẽ liên hệ tư vấn mẫu & báo giá ngay:</div>
        <form id="drawer-quick-cb-form" style="display: flex; gap: 6px;">
          <input type="tel" id="drawer-cb-phone" required placeholder="Nhập số điện thoại của bạn..." style="flex: 1; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12.5px;">
          <button type="submit" style="background: var(--color-accent-gold); color: #143F3B; border: none; border-radius: 6px; padding: 0 12px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap;">Gửi SĐT</button>
        </form>
      </div>

      <!-- 7 Smart Jewelry Tools -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 11.5px; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Công cụ tiện ích độc quyền</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button type="button" id="cd-tool-ruler" style="background: #fff; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: left; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--color-text-primary);">
            📏 Đo nhẫn trên màn hình
          </button>
          <button type="button" id="cd-tool-gift" style="background: #fff; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: left; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--color-text-primary);">
            🎁 Trợ lý chọn quà 30s
          </button>
          <button type="button" id="cd-tool-couple" style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: 8px; padding: 10px; text-align: left; cursor: pointer; font-size: 12px; font-weight: 600; color: #9D174D;">
            💑 Thiết kế Nhẫn/Vòng đôi
          </button>
          <button type="button" id="cd-tool-styling" style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 10px; text-align: left; cursor: pointer; font-size: 12px; font-weight: 600; color: #1E40AF;">
            👗 Chọn theo dáng mặt/tay
          </button>
          <button type="button" id="cd-tool-fengshui" style="background: #fff; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: left; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--color-text-primary);">
            🔮 Chọn đá hợp mệnh
          </button>
          <button type="button" id="cd-tool-reminder" style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 10px; text-align: left; cursor: pointer; font-size: 12px; font-weight: 600; color: #166534;">
            📅 Sổ tay nhắc kỷ niệm
          </button>
          <button type="button" id="cd-tool-warranty" style="grid-column: 1 / -1; background: #fff; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--color-text-primary);">
            🛡️ Tra cứu Thẻ Bảo Hành Điện Tử bằng Số Điện Thoại
          </button>
        </div>
      </div>

      <!-- Comfort Reading & Eye Care Mode (Vòng 9) -->
      <div style="background: #F8FAF9; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 12px 14px; margin-bottom: 18px;">
        <div style="font-size: 11.5px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 8px;">👁️ Chế độ hiển thị dịu mắt & dễ đọc:</div>
        <div style="display: flex; gap: 8px;">
          <button type="button" id="cd-comfort-font" style="flex: 1; padding: 7px 10px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; font-size: 12px; font-weight: 600; cursor: pointer;">
            🔠 Chữ lớn dễ đọc (A+)
          </button>
          <button type="button" id="cd-comfort-warm" style="flex: 1; padding: 7px 10px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; font-size: 12px; font-weight: 600; cursor: pointer;">
            🌙 Nền ấm dịu mắt
          </button>
        </div>
      </div>

      <!-- Store Info & Official Social Channels Card -->
      <div style="background: #F4F9F8; border: 1px solid #C5DEDB; border-radius: 10px; padding: 14px; font-size: 12.5px; line-height: 1.6; margin-bottom: 14px;">
        <div style="font-weight: 700; color: var(--color-brand-primary); margin-bottom: 4px;">📍 Showroom Phát Đạt Jewelry</div>
        <div style="color: var(--color-text-secondary);">${siteInfo.address}</div>
        <div style="color: var(--color-text-secondary); margin-bottom: 10px;">Giờ mở cửa: <strong>${siteInfo.hours}</strong></div>
        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
          <a href="#/stores" class="drawer-nav-link" style="color: var(--color-brand-primary); font-weight: 700; text-decoration: underline;">📅 Đặt lịch hẹn thử mẫu</a>
          <span>·</span>
          <a href="#/contact" class="drawer-nav-link" style="color: var(--color-brand-primary); font-weight: 700; text-decoration: underline;">Gửi lời nhắn</a>
        </div>

        <!-- Official Social Channels + Instagram QR -->
        <div style="border-top: 1px dashed #B5D5D0; padding-top: 10px;">
          <div style="font-size: 11.5px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 8px;">🌐 Kênh Mạng Xã Hội Chính Thức:</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 10px;">
            <a href="${siteInfo.facebook}" target="_blank" rel="noopener" style="background: #1877F2; color: #fff; text-decoration: none; border-radius: 6px; padding: 7px 6px; text-align: center; font-size: 11.5px; font-weight: 700;">
              📘 Facebook
            </a>
            <a href="${siteInfo.tiktok}" target="_blank" rel="noopener" style="background: #111111; color: #fff; text-decoration: none; border-radius: 6px; padding: 7px 6px; text-align: center; font-size: 11.5px; font-weight: 700;">
              🎵 TikTok
            </a>
            <a href="${siteInfo.instagram}" target="_blank" rel="noopener" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; text-decoration: none; border-radius: 6px; padding: 7px 6px; text-align: center; font-size: 11.5px; font-weight: 700;">
              📸 Instagram
            </a>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--color-border-light); border-radius: 8px; padding: 8px 10px;">
            <img src="${siteInfo.instagramQr || './images/instagram-qr.png'}" alt="QR Instagram @jewelryphatdat" id="cd-ig-qr-thumb" style="width: 56px; height: 56px; object-fit: contain; border-radius: 6px; cursor: zoom-in; flex-shrink: 0;" title="Bấm để phóng to Mã QR Instagram">
            <div style="font-size: 11.5px; line-height: 1.45;">
              <strong style="color: #C13584; display: block;">Instagram: @jewelryphatdat</strong>
              <span style="color: var(--color-text-secondary);">Quét mã QR hoặc bấm vào ảnh để phóng to xem bộ sưu tập mới nhất.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function openDrawer() {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function toggleDrawer() {
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  overlay.addEventListener('click', closeDrawer);
  drawer.querySelector('.contact-drawer__close').addEventListener('click', closeDrawer);
  document.addEventListener('toggle-contact-drawer', toggleDrawer);

  drawer.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Inline Callback Form Submit
  drawer.querySelector('#drawer-quick-cb-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = drawer.querySelector('#drawer-cb-phone');
    const cleanPhone = input.value.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 12) {
      showToast('Vui lòng nhập số điện thoại hợp lệ (9 - 11 số)!', 'warning');
      return;
    }
    await addCustomerContact({
      fullName: 'Khách yêu cầu gọi nhanh (Header Drawer)',
      phone: cleanPhone,
      subject: 'Yêu cầu gọi lại nhanh 5 phút',
      message: `Khách để lại SĐT ${cleanPhone} tại Trung tâm hỗ trợ nhanh.`
    });
    input.value = '';
    closeDrawer();
    showToast('Đã nhận SĐT! Chuyên viên Phát Đạt sẽ gọi lại cho bạn ngay.', 'success', 3500);
  });

  // Tool Launchers
  drawer.querySelector('#cd-tool-ruler').addEventListener('click', () => {
    closeDrawer();
    openGlobalSizeGuide('ruler');
  });
  drawer.querySelector('#cd-tool-gift').addEventListener('click', () => {
    closeDrawer();
    openGiftFinderModal();
  });
  drawer.querySelector('#cd-tool-fengshui').addEventListener('click', () => {
    closeDrawer();
    openFengShuiMatcherModal();
  });
  drawer.querySelector('#cd-tool-warranty').addEventListener('click', () => {
    closeDrawer();
    openWarrantyLookupModal();
  });
  drawer.querySelector('#cd-tool-couple').addEventListener('click', () => {
    closeDrawer();
    openCoupleBuilderModal();
  });
  drawer.querySelector('#cd-tool-styling').addEventListener('click', () => {
    closeDrawer();
    openFaceHandStylingModal();
  });
  drawer.querySelector('#cd-tool-reminder').addEventListener('click', () => {
    closeDrawer();
    openAnniversaryReminderModal();
  });

  const igQrThumb = drawer.querySelector('#cd-ig-qr-thumb');
  if (igQrThumb) {
    igQrThumb.addEventListener('click', () => {
      closeDrawer();
      openLightboxModal([siteInfo.instagramQr || './images/instagram-qr.png'], 0, 'Mã QR Instagram @jewelryphatdat — Phát Đạt Jewelry');
    });
  }

  // Comfort Mode Toggles
  const fontBtn = drawer.querySelector('#cd-comfort-font');
  const warmBtn = drawer.querySelector('#cd-comfort-warm');
  function syncComfortButtons() {
    const prefs = getComfortPrefs();
    applyComfortPrefs(prefs);
    fontBtn.style.background = prefs.largeText ? 'var(--color-brand-primary)' : '#fff';
    fontBtn.style.color = prefs.largeText ? '#fff' : 'var(--color-text-primary)';
    warmBtn.style.background = prefs.warmTone ? 'var(--color-brand-primary)' : '#fff';
    warmBtn.style.color = prefs.warmTone ? '#fff' : 'var(--color-text-primary)';
  }
  syncComfortButtons();

  fontBtn.addEventListener('click', () => {
    const cur = getComfortPrefs();
    const next = saveComfortPrefs({ largeText: !cur.largeText });
    syncComfortButtons();
    showToast(next.largeText ? 'Đã bật Chế độ chữ lớn dễ đọc (A+)!' : 'Đã trở về cỡ chữ tiêu chuẩn.', 'info', 2200);
  });

  warmBtn.addEventListener('click', () => {
    const cur = getComfortPrefs();
    const next = saveComfortPrefs({ warmTone: !cur.warmTone });
    syncComfortButtons();
    showToast(next.warmTone ? 'Đã bật Chế độ nền ấm dịu mắt!' : 'Đã trở về màu nền tiêu chuẩn.', 'info', 2200);
  });

  return { overlay, drawer, open: openDrawer, close: closeDrawer };
}

