import { navigate } from '../router.js';
import { t, currentLang, toggleLang } from '../i18n.js';
import { products, formatPrice, searchProducts, categories, collections } from '../data/products.js';
import { getWishlistedProductIds, getRecentSearches, addRecentSearch } from '../data/wishlist-store.js';
import {
  openGiftFinderModal,
  openQuickViewModal,
  openFengShuiMatcherModal,
  openWarrantyLookupModal,
  openChainVisualizerModal,
  openWristSizerModal,
  openStyleQuizModal,
  openSilverRescueModal,
  openUnboxingPreviewModal
} from './feedback-modal.js';
import { getSelectedCurrency, CURRENCY_RATES } from '../data/wishlist-store.js';

const SVG_ICONS = {
  hamburger: `<div class="hamburger-icon"><span></span><span></span><span></span></div>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  wishlist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
};

export function createHeader() {
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'site-header-wrapper';

  // Top Announcement Bar (Rotating Ticker)
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
    gap: 10px;
    z-index: 801;
  `;
  const promoMessages = [
    '✨ Phát Đạt Jewelry – Bạc S925 Tinh Tế · Bảo Hành Đánh Bóng & Làm Sáng Trọn Đời · Hotline / Zalo: <strong>0898 025 013</strong>',
    '🎁 Tặng Trọn Bộ Hộp Quà Nhung + Khăn Lau Bạc + Thiệp Viết Tay Miễn Phí Cho Mọi Sản Phẩm',
    '🔮 Mới: Cố Vấn Chọn Trang Sức Theo Bản Mệnh Ngũ Hành & Đo Size Nhẫn Trực Tiếp Trên Màn Hình',
    '🚚 Giao Hàng Toàn Quốc · Quý Khách Được Đồng Kiểm Tra Hàng Trước Khi Thanh Toán'
  ];
  let promoIdx = 0;
  topBar.innerHTML = `<span id="top-promo-text" style="transition: opacity 0.3s ease;">${promoMessages[0]}</span>`;
  setInterval(() => {
    const el = topBar.querySelector('#top-promo-text');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      promoIdx = (promoIdx + 1) % promoMessages.length;
      el.innerHTML = promoMessages[promoIdx];
      el.style.opacity = '1';
    }, 280);
  }, 4500);

  const header = document.createElement('header');
  header.className = 'site-header';
  header.id = 'site-header';

  header.innerHTML = `
    <div class="header-inner">
      <div class="header-left">
        <button class="header-menu-btn" id="menu-toggle" aria-label="Open menu">
          ${SVG_ICONS.hamburger}
        </button>
        <button class="header-search-btn" aria-label="Search" title="Tìm kiếm nhanh (Phím tắt: /)">
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
        <button type="button" class="header-region hide-mobile" id="fengshui-header-btn" style="background: #FAF4E8; color: #8A6218; border: 1px solid var(--color-accent-gold); border-radius: 16px; padding: 5px 11px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Chọn trang sức hợp mệnh Ngũ Hành">
          <span>🔮 Hợp mệnh</span>
        </button>
        <button type="button" class="header-region hide-mobile" id="gift-finder-header-btn" style="background: var(--color-brand-light); color: var(--color-brand-primary); border: 1px solid var(--color-border); border-radius: 16px; padding: 5px 12px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Trợ lý chọn quà tặng">
          <span>🎁 Chọn quà</span>
        </button>
        <button type="button" class="header-region hide-mobile" id="curr-header-btn" style="background: #F4F7F6; border: 1px solid var(--color-border); border-radius: 16px; padding: 5px 9px; font-size: 11.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Đổi đơn vị tiền tệ hiển thị">
          <span>${CURRENCY_RATES[getSelectedCurrency()]?.flag || '🇻🇳'} ${getSelectedCurrency()}</span>
        </button>
        <button class="header-region hide-mobile" id="lang-toggle" aria-label="Toggle language">
          <span style="${currentLang === 'vi' ? 'font-weight: 600;' : 'opacity: 0.5;'}">VN</span>
          <span style="margin: 0 4px;">|</span>
          <span style="${currentLang === 'en' ? 'font-weight: 600;' : 'opacity: 0.5;'}">EN</span>
        </button>
        <button class="header-icon" id="wishlist-toggle" style="position: relative;" aria-label="Yêu thích" onclick="window.location.hash='#/wishlist'" title="Bộ sưu tập yêu thích">
          ${SVG_ICONS.wishlist}
          <span class="wishlist-count-badge" id="header-wishlist-badge" style="display: none;">0</span>
        </button>
        <button class="header-icon" id="contact-toggle" aria-label="Tư vấn" title="Trung tâm hỗ trợ & tư vấn nhanh">
          ${SVG_ICONS.phone}
        </button>
      </div>
    </div>
  `;

  headerWrapper.appendChild(topBar);
  headerWrapper.appendChild(header);

  // Wishlist badge updater
  const wishlistBadge = header.querySelector('#header-wishlist-badge');
  function updateHeaderWishlistBadge() {
    const count = getWishlistedProductIds().length;
    if (count > 0) {
      wishlistBadge.textContent = count;
      wishlistBadge.style.display = 'inline-flex';
      wishlistBadge.classList.add('is-bouncing');
      setTimeout(() => wishlistBadge.classList.remove('is-bouncing'), 300);
    } else {
      wishlistBadge.style.display = 'none';
    }
  }
  updateHeaderWishlistBadge();
  window.addEventListener('wishlist-updated', updateHeaderWishlistBadge);

  // Gift finder & Feng Shui buttons
  const giftBtn = header.querySelector('#gift-finder-header-btn');
  if (giftBtn) giftBtn.addEventListener('click', () => openGiftFinderModal());
  const fsBtn = header.querySelector('#fengshui-header-btn');
  if (fsBtn) fsBtn.addEventListener('click', () => openFengShuiMatcherModal());

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

  const currBtn = header.querySelector('#curr-header-btn');
  if (currBtn) {
    currBtn.addEventListener('click', () => {
      const event = new CustomEvent('toggle-contact-drawer');
      document.dispatchEvent(event);
    });
  }

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
      <a class="nav-item" href="#/info/style-guide">
        <span>📖 Cẩm nang phối đồ & Bảo quản bạc</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="javascript:void(0)" id="nav-open-fengshui">
        <span>🔮 Cố vấn chọn trang sức hợp mệnh</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="javascript:void(0)" id="nav-open-chain">
        <span>✨ Thước kéo xương quai xanh (38 – 60cm)</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="javascript:void(0)" id="nav-open-wrist">
        <span>📏 Thước đo cổ tay & size lắc</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="javascript:void(0)" id="nav-open-quiz">
        <span>🎯 Trắc nghiệm phong cách cá nhân</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="javascript:void(0)" id="nav-open-rescue">
        <span>🧼 Cấp cứu bạc xỉn màu tại nhà</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="javascript:void(0)" id="nav-open-unboxing">
        <span>🎁 Trải nghiệm mở hộp quà VIP</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="javascript:void(0)" id="nav-open-warranty">
        <span>🛡️ Tra cứu thẻ bảo hành điện tử</span>
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
        <span>Hệ thống cửa hàng & Đặt lịch hẹn</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/contact">
        <span>Liên hệ & Giải đáp nhanh (FAQ)</span>
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

  drawer.querySelector('#nav-open-fengshui').addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
    openFengShuiMatcherModal();
  });
  drawer.querySelector('#nav-open-warranty').addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
    openWarrantyLookupModal();
  });
  drawer.querySelector('#nav-open-chain').addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
    openChainVisualizerModal();
  });
  drawer.querySelector('#nav-open-wrist').addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
    openWristSizerModal();
  });
  drawer.querySelector('#nav-open-quiz').addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
    openStyleQuizModal();
  });
  drawer.querySelector('#nav-open-rescue').addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
    openSilverRescueModal();
  });
  drawer.querySelector('#nav-open-unboxing').addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
    openUnboxingPreviewModal();
  });

  drawer.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

// ── Search Drawer with Realtime Dynamic Search ──

export function openSearchDrawer() {
  const existing = document.querySelector('.search-overlay');
  if (existing) existing.remove();
  const existingDrawer = document.querySelector('.search-drawer');
  if (existingDrawer) existingDrawer.remove();

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';

  const recentTerms = getRecentSearches();
  const hotKeywords = ['Cỏ ba lá', 'Nhẫn Moissanite', 'Lắc tay xà cừ', 'Bông tai nụ', 'Dây chuyền bạc 925'];
  const allSuggestions = Array.from(new Set([...recentTerms, ...hotKeywords])).slice(0, 6);

  const drawer = document.createElement('div');
  drawer.className = 'search-drawer';
  drawer.innerHTML = `
    <div class="search-drawer__inner">
      <div class="search-drawer__top">
        ${SVG_ICONS.search}
        <input type="text" class="search-drawer__input" placeholder="Tìm nhẫn, dây chuyền cỏ ba lá, đá moissanite..." autofocus>
        <button class="search-drawer__close" aria-label="Close search">✕</button>
      </div>

      <!-- Recent & Hot Search Chips -->
      <div style="padding: 10px 0 14px 0; border-bottom: 1px solid var(--color-border-light); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 12px; color: var(--color-text-secondary); font-weight: 600;">🔥 Tìm nhanh:</span>
        ${allSuggestions.map(kw => `
          <button type="button" class="search-quick-keyword" data-kw="${kw}" style="background: #f4f7f6; border: 1px solid var(--color-border); border-radius: 16px; padding: 4px 12px; font-size: 12px; color: var(--color-brand-primary); cursor: pointer;">
            ${kw}
          </button>
        `).join('')}
        <button type="button" id="search-open-gift-quiz" style="background: #FAF4E8; border: 1px solid var(--color-accent-gold); border-radius: 16px; padding: 4px 12px; font-size: 12px; color: #8A6218; font-weight: 600; cursor: pointer;">
          🎁 Trợ lý chọn quà tặng
        </button>
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
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 class="search-col__title" id="search-results-title" style="margin: 0;">Sản phẩm gợi ý hôm nay</h4>
            <button type="button" id="search-view-all-btn" style="display: none; background: none; border: none; color: var(--color-brand-primary); font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: underline;">Xem tất cả kết quả →</button>
          </div>
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
  const viewAllBtn = drawer.querySelector('#search-view-all-btn');

  function renderSearchResults(items, queryStr = '') {
    resultsGrid.innerHTML = '';
    if (queryStr && items.length > 0) {
      viewAllBtn.style.display = 'inline-block';
      viewAllBtn.textContent = `Xem tất cả ${items.length} kết quả cho "${queryStr}" →`;
    } else {
      viewAllBtn.style.display = 'none';
    }

    if (items.length === 0) {
      resultsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px 0; color: var(--color-text-secondary); text-align: center;">
          Không tìm thấy mẫu trang sức nào cho từ khóa "<strong>${queryStr}</strong>". Thử tìm từ khóa khác như "cỏ ba lá", "nhẫn", "bạc"...
        </div>
      `;
      return;
    }

    items.slice(0, 6).forEach(p => {
      const itemEl = document.createElement('a');
      itemEl.className = 'search-creation-item';
      itemEl.href = `#/product/${p.id}`;
      itemEl.style.position = 'relative';
      itemEl.innerHTML = `
        <div style="position: relative;">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
          <button type="button" class="search-item-qv" style="position: absolute; bottom: 6px; right: 6px; background: rgba(20,63,59,0.88); color: #fff; border: none; border-radius: 10px; font-size: 10px; font-weight: 600; padding: 2px 7px; cursor: pointer;">👁️ Xem nhanh</button>
        </div>
        <div style="font-size: 10px; color: var(--color-text-secondary); margin-top: 4px;">${p.collection} · ${p.reference}</div>
        <div class="search-creation-item__name">${p.name}</div>
        <div class="search-creation-item__price">${formatPrice(p.price)}</div>
      `;
      itemEl.querySelector('.search-item-qv').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSearch();
        openQuickViewModal(p);
      });
      itemEl.addEventListener('click', () => {
        if (inputEl.value.trim()) addRecentSearch(inputEl.value.trim());
        closeSearch();
      });
      resultsGrid.appendChild(itemEl);
    });
  }

  viewAllBtn.addEventListener('click', () => {
    const val = inputEl.value.trim();
    if (val) {
      addRecentSearch(val);
      closeSearch();
      navigate(`/search/${encodeURIComponent(val)}`);
    }
  });

  // Render initial featured products
  renderSearchResults(products.slice(0, 6));

  // Quick keyword click
  drawer.querySelectorAll('.search-quick-keyword').forEach(btn => {
    btn.addEventListener('click', () => {
      const kw = btn.dataset.kw;
      inputEl.value = kw;
      addRecentSearch(kw);
      const matched = searchProducts(kw);
      resultsTitle.textContent = `Kết quả cho "${kw}" (${matched.length})`;
      renderSearchResults(matched, kw);
    });
  });

  // Gift quiz trigger in search
  drawer.querySelector('#search-open-gift-quiz').addEventListener('click', () => {
    closeSearch();
    openGiftFinderModal();
  });

  // Live input listening
  inputEl.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) {
      resultsTitle.textContent = 'Sản phẩm gợi ý hôm nay';
      renderSearchResults(products.slice(0, 6), '');
    } else {
      const matched = searchProducts(val);
      resultsTitle.textContent = `Kết quả tìm kiếm (${matched.length})`;
      renderSearchResults(matched, val);
    }
  });

  // Enter key press navigation
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value.trim();
      if (val) {
        addRecentSearch(val);
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
