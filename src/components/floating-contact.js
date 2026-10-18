// ============================================================
// FLOATING QUICK CONTACT WIDGET, SCROLL-TO-TOP & LIVE SHOWROOM PROOF
// ============================================================

import { siteInfo } from '../data/site-info.js';
import { openGiftFinderModal, openFengShuiMatcherModal } from './feedback-modal.js';

export function createFloatingContact() {
  const container = document.createElement('div');
  container.className = 'floating-contact-hub';
  container.id = 'floating-contact-hub';

  container.innerHTML = `
    <!-- Smart Engagement Greeting Bubble -->
    <div id="smart-zalo-bubble" style="
      display: none;
      position: absolute;
      bottom: 170px;
      right: 0;
      width: 268px;
      background: #ffffff;
      border: 1px solid var(--color-accent-gold);
      border-radius: 12px;
      padding: 12px 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.18);
      font-family: var(--font-body);
      z-index: 860;
    ">
      <button type="button" id="close-smart-bubble" style="position: absolute; top: 6px; right: 8px; background: none; border: none; font-size: 13px; color: #888; cursor: pointer;" aria-label="Đóng">✕</button>
      <div style="font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 4px;">
        ✨ Phát Đạt Jewelry xin chào!
      </div>
      <div style="font-size: 12px; color: var(--color-text-secondary); line-height: 1.45; margin-bottom: 10px;">
        Bạn đang tìm quà tặng hay muốn xem gợi ý trang sức Bạc S925 hợp mệnh?
      </div>
      <div style="display: flex; gap: 6px;">
        <button type="button" id="bubble-open-fengshui" style="flex: 1; background: #FFF9EB; color: #7A5411; border: 1px solid #E5C158; border-radius: 6px; padding: 6px 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
          🔮 Hợp mệnh
        </button>
        <button type="button" id="bubble-open-gift" style="flex: 1; background: #FAF4E8; color: #8A6218; border: 1px solid var(--color-accent-gold); border-radius: 6px; padding: 6px 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
          🎁 Chọn quà
        </button>
        <a href="${siteInfo.zalo}" target="_blank" rel="noopener" style="flex: 1; background: #0068FF; color: #fff; border-radius: 6px; padding: 6px 8px; font-size: 11px; font-weight: 700; text-decoration: none; text-align: center;">
          💬 Zalo
        </a>
      </div>
    </div>

    <!-- Scroll-to-Top Button (appears on scroll > 400px) -->
    <button type="button" id="floating-scroll-top-btn" class="floating-btn" style="display: none; background: #ffffff; color: var(--color-brand-primary); border: 1px solid var(--color-border); cursor: pointer; width: 42px; height: 42px;" title="Lên đầu trang" aria-label="Lên đầu trang">
      <span class="floating-btn__tooltip">Lên đầu trang</span>
      <div class="floating-btn__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="18" height="18">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </div>
    </button>

    <!-- Floating Gift Assistant Button -->
    <button type="button" id="floating-gift-btn" class="floating-btn" style="background: linear-gradient(135deg, #C99738, #A87922); color: #fff; border: none; cursor: pointer;" title="Trợ lý chọn quà tặng 30 giây" aria-label="Chọn quà tặng">
      <span class="floating-btn__tooltip">Chọn quà tặng</span>
      <div class="floating-btn__icon" style="font-size: 18px;">🎁</div>
    </button>

    <!-- Floating Zalo Button -->
    <a href="${siteInfo.zalo}" target="_blank" rel="noopener" class="floating-btn floating-btn--zalo" title="Chat Zalo tư vấn 0898 025 013" aria-label="Zalo">
      <span class="floating-btn__tooltip">Tư vấn Zalo</span>
      <div class="floating-btn__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.07-.17 1.15-.72 2.76-1.78 3.86 1.76.12 3.65-.63 4.94-1.57.97.26 2 .41 3 .41 5.52 0 10-4.03 10-9s-4.48-9-10-9z"/>
        </svg>
      </div>
    </a>

    <!-- Floating Hotline Button -->
    <a href="${siteInfo.phoneHref}" class="floating-btn floating-btn--phone" title="Gọi Hotline ${siteInfo.phoneDisplay}" aria-label="Hotline">
      <span class="floating-btn__tooltip">Gọi ${siteInfo.phoneDisplay}</span>
      <div class="floating-btn__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      </div>
    </a>
  `;

  const bubble = container.querySelector('#smart-zalo-bubble');
  const scrollTopBtn = container.querySelector('#floating-scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 420) {
      scrollTopBtn.style.display = 'flex';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  container.querySelector('#floating-gift-btn').addEventListener('click', () => {
    bubble.style.display = 'none';
    openGiftFinderModal();
  });

  container.querySelector('#bubble-open-fengshui').addEventListener('click', () => {
    bubble.style.display = 'none';
    sessionStorage.setItem('pd_bubble_dismissed', '1');
    openFengShuiMatcherModal();
  });

  container.querySelector('#bubble-open-gift').addEventListener('click', () => {
    bubble.style.display = 'none';
    sessionStorage.setItem('pd_bubble_dismissed', '1');
    openGiftFinderModal();
  });

  container.querySelector('#close-smart-bubble').addEventListener('click', () => {
    bubble.style.display = 'none';
    sessionStorage.setItem('pd_bubble_dismissed', '1');
  });

  // Show smart greeting bubble after 9 seconds if not dismissed
  setTimeout(() => {
    if (
      !sessionStorage.getItem('pd_bubble_dismissed') &&
      !window.location.hash.startsWith('#/admin')
    ) {
      bubble.style.display = 'block';
    }
  }, 9000);

  return container;
}
