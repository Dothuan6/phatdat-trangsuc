// ============================================================
// FLOATING QUICK CONTACT WIDGET
// ============================================================

import { siteInfo } from '../data/site-info.js';

export function createFloatingContact() {
  const container = document.createElement('div');
  container.className = 'floating-contact-hub';
  container.id = 'floating-contact-hub';

  container.innerHTML = `
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

  return container;
}
