import { navigate } from '../router.js';
import { t, currentLang, toggleLang } from '../i18n.js';
import { products, formatPrice, searchProducts, categories, collections } from '../data/products.js';

const SVG_ICONS = {
  hamburger: `<div class="hamburger-icon"><span></span><span></span><span></span></div>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  wishlist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
};

export function createHeader() {
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'site-header-wrapper';

  // Top Announcement Bar
  const topBar = document.createElement('div');
  topBar.className = 'top-announcement-bar';
  topBar.style.cssText = `
    background-color: var(--color-brand-primary);
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    padding: 7px 16px;
    letter-spacing: 0.04em;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    z-index: 801;
  `;
  topBar.innerHTML = `
    <span>✨ Phát Đạt Jewelry – Bạc 925 Tinh Tế · Bảo Hành Làm Sáng Trọn Đời · Hotline / Zalo: <strong>0898 025 013</strong></span>
  `;

  const header = document.createElement('header');
  header.className = 'site-header';
  header.id = 'site-header';

  header.innerHTML = `
    <div class="header-inner">
      <div class="header-left">
        <button class="header-menu-btn" id="menu-toggle" aria-label="Open menu">
          ${SVG_ICONS.hamburger}
        </button>
        <button class="header-search-btn" aria-label="Search">
          ${SVG_ICONS.search}
          <span>Tìm kiếm</span>
        </button>
      </div>
      <div class="header-center">
        <a href="#/" class="brand-logo" id="brand-logo">
          <img src="/images/logo.png" alt="Phát Đạt Jewelry" style="height: 52px; width: auto; object-fit: contain;">
        </a>
      </div>
      <div class="header-right">
        <button class="header-region hide-mobile" id="lang-toggle" aria-label="Toggle language">
          <span style="${currentLang === 'vi' ? 'font-weight: 600;' : 'opacity: 0.5;'}">VN</span>
          <span style="margin: 0 4px;">|</span>
          <span style="${currentLang === 'en' ? 'font-weight: 600;' : 'opacity: 0.5;'}">EN</span>
        </button>
        <button class="header-icon" id="wishlist-toggle" aria-label="Yêu thích" onclick="window.location.hash='#/wishlist'" title="Bộ sưu tập yêu thích">
          ${SVG_ICONS.wishlist}
        </button>
        <button class="header-icon" id="contact-toggle" aria-label="Tư vấn" title="Tư vấn nhanh">
          ${SVG_ICONS.phone}
        </button>
      </div>
    </div>
  `;

  headerWrapper.appendChild(topBar);
  headerWrapper.appendChild(header);

  // Scroll behavior
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 15) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  });

  // Search toggle
  header.querySelector('.header-search-btn').addEventListener('click', () => {
    openSearchDrawer();
  });

  // Menu toggle
  header.querySelector('#menu-toggle').addEventListener('click', () => {
    openNavDrawer();
  });

  // Contact toggle
  header.querySelector('#contact-toggle').addEventListener('click', () => {
    const event = new CustomEvent('toggle-contact-drawer');
    document.dispatchEvent(event);
  });

  // Language toggle
  const langToggle = header.querySelector('#lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      toggleLang();
    });
  }

  return headerWrapper;
}

export function createHeaderSpacer() {
  const spacer = document.createElement('div');
  spacer.className = 'header-spacer';
  spacer.style.height = '105px';
  return spacer;
}

// ── Navigation Drawer ──

function openNavDrawer() {
  const existing = document.querySelector('.nav-overlay');
  if (existing) existing.remove();
  const existingDrawer = document.querySelector('.nav-drawer');
  if (existingDrawer) existingDrawer.remove();

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';

  const drawer = document.createElement('nav');
  drawer.className = 'nav-drawer';
  drawer.innerHTML = `
    <div class="nav-drawer__header">
      <div style="font-weight: 600; color: var(--color-brand-primary);">DANH MỤC TRANG SỨC</div>
      <button class="nav-drawer__close" aria-label="Close menu">✕</button>
    </div>
    <div class="nav-drawer__items">
      <a class="nav-item" href="#/">
        <span>${t('nav.home')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry">
        <span>Tất cả trang sức Bạc 925</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/necklaces">
        <span>Dây chuyền & Mặt dây</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/rings">
        <span>Nhẫn bạc & Nhẫn Moissanite</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/bracelets">
        <span>Lắc tay & Vòng tay</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/earrings">
        <span>Bông tai & Hoa tai</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/high-jewelry">
        <span>Bộ sưu tập đặc biệt</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/about">
        <span>Về Phát Đạt Jewelry</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/wishlist">
        <span>Danh sách yêu thích</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/stores">
        <span>Hệ thống cửa hàng</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/contact">
        <span>Liên hệ & Tư vấn</span>
        <span class="nav-item__chevron">›</span>
      </a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.classList.add('no-scroll');

  requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
  });

  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      overlay.remove();
      drawer.remove();
    }, 400);
  }

  overlay.addEventListener('click', closeDrawer);
  drawer.querySelector('.nav-drawer__close').addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

// ── Search Drawer with Realtime Dynamic Search ──

function openSearchDrawer() {
  const existing = document.querySelector('.search-overlay');
  if (existing) existing.remove();
  const existingDrawer = document.querySelector('.search-drawer');
  if (existingDrawer) existingDrawer.remove();

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'search-drawer';
  drawer.innerHTML = `
    <div class="search-drawer__inner">
      <div class="search-drawer__top">
        ${SVG_ICONS.search}
        <input type="text" class="search-drawer__input" placeholder="Tìm nhẫn, dây chuyền cỏ ba lá, đá moissanite..." autofocus>
        <button class="search-drawer__close" aria-label="Close search">✕</button>
      </div>
      <div class="search-drawer__content" id="search-drawer-content">
        <div class="search-col">
          <h4 class="search-col__title">Danh mục</h4>
          <ul class="search-col__list">
            <li><a href="#/jewelry/necklaces">Dây chuyền</a></li>
            <li><a href="#/jewelry/bracelets">Vòng tay & Lắc tay</a></li>
            <li><a href="#/jewelry/rings">Nhẫn thời trang</a></li>
            <li><a href="#/jewelry/earrings">Bông tai</a></li>
          </ul>
        </div>
        <div class="search-col">
          <h4 class="search-col__title">Bộ sưu tập</h4>
          <ul class="search-col__list">
            <li><a href="#/collections/co-ba-la">Cỏ Ba Lá may mắn</a></li>
            <li><a href="#/collections/hoa-xinh">Hoa Xinh đính đá</a></li>
            <li><a href="#/collections/anh-sao">Ánh Sao Moissanite</a></li>
            <li><a href="#/collections/hat-ngoc">Hạt Ngọc tối giản</a></li>
          </ul>
        </div>
        <div class="search-col search-col--wide">
          <h4 class="search-col__title" id="search-results-title">Sản phẩm gợi ý hôm nay</h4>
          <div class="search-creations-grid" id="search-results-grid">
            <!-- Will be dynamically populated -->
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.classList.add('no-scroll');

  const inputEl = drawer.querySelector('.search-drawer__input');
  const resultsGrid = drawer.querySelector('#search-results-grid');
  const resultsTitle = drawer.querySelector('#search-results-title');

  function renderSearchResults(items) {
    resultsGrid.innerHTML = '';
    if (items.length === 0) {
      resultsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px 0; color: var(--color-text-secondary); text-align: center;">
          Không tìm thấy mẫu trang sức nào. Thử tìm từ khóa khác như "cỏ ba lá", "nhẫn", "bạc"...
        </div>
      `;
      return;
    }

    items.slice(0, 4).forEach(p => {
      const itemEl = document.createElement('a');
      itemEl.className = 'search-creation-item';
      itemEl.href = `#/product/${p.id}`;
      itemEl.innerHTML = `
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
        <div class="search-creation-item__name">${p.name}</div>
        <div class="search-creation-item__price">${formatPrice(p.price)}</div>
      `;
      itemEl.addEventListener('click', () => {
        closeSearch();
      });
      resultsGrid.appendChild(itemEl);
    });
  }

  // Render initial featured products
  renderSearchResults(products.slice(0, 4));

  // Live input listening
  inputEl.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) {
      resultsTitle.textContent = 'Sản phẩm gợi ý hôm nay';
      renderSearchResults(products.slice(0, 4));
    } else {
      const matched = searchProducts(val);
      resultsTitle.textContent = `Kết quả tìm kiếm (${matched.length})`;
      renderSearchResults(matched);
    }
  });

  // Enter key press navigation
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value.trim();
      if (val) {
        closeSearch();
        navigate(`/search/${encodeURIComponent(val)}`);
      }
    }
  });

  requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    inputEl.focus();
  });

  function closeSearch() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      overlay.remove();
      drawer.remove();
    }, 400);
  }

  overlay.addEventListener('click', closeSearch);
  drawer.querySelector('.search-drawer__close').addEventListener('click', closeSearch);

  drawer.querySelectorAll('.search-col__list a').forEach(link => {
    link.addEventListener('click', () => {
      closeSearch();
    });
  });
}
