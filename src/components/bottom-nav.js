// ============================================================
// MOBILE BOTTOM NAVIGATION BAR
// ============================================================

import { openGlobalSizeGuide } from './size-guide-modal.js';

export function createBottomNav() {
  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.id = 'mobile-bottom-nav';

  nav.innerHTML = `
    <a href="#/" class="bottom-nav-item" id="bnav-home">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span>Trang chủ</span>
    </a>

    <a href="#/jewelry" class="bottom-nav-item" id="bnav-jewelry">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20">
        <circle cx="12" cy="12" r="7"/>
        <polyline points="12 9 12 12 13.5 13.5"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      </svg>
      <span>Sản phẩm</span>
    </a>

    <a href="#/wishlist" class="bottom-nav-item" id="bnav-wishlist">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
      <span>Yêu thích</span>
    </a>

    <button type="button" class="bottom-nav-item" id="bnav-sizeguide">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20">
        <rect x="2" y="7" width="20" height="10" rx="2"/>
        <line x1="6" y1="7" x2="6" y2="11"/>
        <line x1="10" y1="7" x2="10" y2="13"/>
        <line x1="14" y1="7" x2="14" y2="11"/>
        <line x1="18" y1="7" x2="18" y2="13"/>
      </svg>
      <span>Đo size</span>
    </button>

    <a href="https://zalo.me/0898025013" target="_blank" rel="noopener" class="bottom-nav-item bottom-nav-item--highlight" id="bnav-zalo">
      <div class="zalo-badge-icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.07-.17 1.15-.72 2.76-1.78 3.86 1.76.12 3.65-.63 4.94-1.57.97.26 2 .41 3 .41 5.52 0 10-4.03 10-9s-4.48-9-10-9z"/>
        </svg>
      </div>
      <span>Tư vấn Zalo</span>
    </a>
  `;

  // Size guide button listener
  nav.querySelector('#bnav-sizeguide').addEventListener('click', (e) => {
    e.preventDefault();
    openGlobalSizeGuide('ring');
  });

  // Highlight active tab
  function updateActiveTab() {
    const hash = window.location.hash || '#/';
    nav.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('is-active'));

    if (hash === '#/' || hash === '') {
      nav.querySelector('#bnav-home')?.classList.add('is-active');
    } else if (hash.startsWith('#/jewelry') || hash.startsWith('#/product/')) {
      nav.querySelector('#bnav-jewelry')?.classList.add('is-active');
    } else if (hash.startsWith('#/wishlist')) {
      nav.querySelector('#bnav-wishlist')?.classList.add('is-active');
    }
  }

  window.addEventListener('hashchange', updateActiveTab);
  setTimeout(updateActiveTab, 50);

  return nav;
}
