// ============================================================
// HEADER COMPONENT — Site header with navigation
// ============================================================

import { navigate } from '../router.js';
import { t, currentLang, toggleLang } from '../i18n.js';

const SVG_ICONS = {
  hamburger: `<div class="hamburger-icon"><span></span><span></span><span></span></div>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
  location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  account: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

export function createHeader() {
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
          <span>${t('nav.search')}</span>
        </button>
      </div>
      <div class="header-center">
        <a href="#/" class="brand-logo" id="brand-logo">
          <img src="/images/logo.png" alt="Phat Dat Jewelry" style="height: 50px; width: auto; object-fit: contain;">
        </a>
      </div>
      <div class="header-right">
        <button class="header-region hide-mobile" id="lang-toggle" aria-label="Toggle language">
          <span style="${currentLang === 'vi' ? 'font-weight: 600;' : 'opacity: 0.5;'}">VN</span>
          <span style="margin: 0 4px;">|</span>
          <span style="${currentLang === 'en' ? 'font-weight: 600;' : 'opacity: 0.5;'}">EN</span>
        </button>
        <button class="header-icon hide-mobile" aria-label="Store locator">
          ${SVG_ICONS.location}
        </button>
        <button class="header-icon" id="contact-toggle" aria-label="Contact us">
          ${SVG_ICONS.phone}
        </button>
        <button class="header-icon" aria-label="Account">
          ${SVG_ICONS.account}
        </button>
      </div>
    </div>
  `;

  // Scroll behavior
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 10) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
    lastScrollY = scrollY;
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

  return header;
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
      <button class="nav-drawer__close" aria-label="Close menu">✕</button>
    </div>
    <div class="nav-drawer__items">
      <a class="nav-item" href="#/high-jewelry">
        <span>${t('nav.highJewelry')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry">
        <span>${t('nav.jewelry')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/necklaces">
        <span>${t('nav.necklaces')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/rings">
        <span>${t('nav.rings')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/bracelets">
        <span>${t('nav.bracelets')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/earrings">
        <span>${t('nav.earrings')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/contact">
        <span>${t('nav.contactUs')}</span>
        <span class="nav-item__chevron">›</span>
      </a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.classList.add('no-scroll');

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
  });

  // Close handlers
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

  // Close on nav item click
  drawer.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      closeDrawer();
    });
  });
}

// ── Search Drawer ──

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
        <input type="text" class="search-drawer__input" placeholder="${t('common.searchPlaceholder')}">
        <button class="search-drawer__close" aria-label="Close search">✕</button>
      </div>
      <div class="search-drawer__content">
        <div class="search-col">
          <h4 class="search-col__title">${t('common.categories')}</h4>
          <ul class="search-col__list">
            <li><a href="#/jewelry/necklaces">${t('nav.necklaces')}</a></li>
            <li><a href="#/jewelry/bracelets">${t('nav.bracelets')}</a></li>
            <li><a href="#/jewelry/rings">${t('nav.rings')}</a></li>
            <li><a href="#/jewelry/earrings">${t('nav.earrings')}</a></li>
          </ul>
        </div>
        <div class="search-col">
          <h4 class="search-col__title">${t('common.collections')}</h4>
          <ul class="search-col__list">
            <li><a href="#/jewelry">Alhambra®</a></li>
            <li><a href="#/jewelry">Perlée®</a></li>
            <li><a href="#/jewelry">Frivole®</a></li>
            <li><a href="#/jewelry">Fauna</a></li>
          </ul>
        </div>
        <div class="search-col search-col--wide">
          <h4 class="search-col__title">${t('common.creations')}</h4>
          <div class="search-creations-grid">
            <a href="#/product/vintage-alhambra-pendant" class="search-creation-item" onclick="document.querySelector('.search-drawer__close').click()">
              <img src="/images/products/necklace-2.png" alt="Vintage Alhambra pendant">
              <div class="search-creation-item__name">Vintage Alhambra pendant</div>
              <div class="search-creation-item__price">₫ 96,500,000</div>
            </a>
            <a href="#/product/perlee-signature-bracelet" class="search-creation-item" onclick="document.querySelector('.search-drawer__close').click()">
              <img src="/images/products/bracelet-1.png" alt="Perlée signature bracelet">
              <div class="search-creation-item__name">Perlée signature bracelet, medium model</div>
              <div class="search-creation-item__price">₫ 215,000,000</div>
            </a>
            <a href="#/product/perlee-signature-ring" class="search-creation-item" onclick="document.querySelector('.search-drawer__close').click()">
              <img src="/images/products/ring-1.png" alt="Perlée signature ring">
              <div class="search-creation-item__name">Perlée signature ring</div>
              <div class="search-creation-item__price">From ₫ 82,000,000</div>
            </a>
            <a href="#/product/vintage-alhambra-bracelet" class="search-creation-item" onclick="document.querySelector('.search-drawer__close').click()">
              <img src="/images/products/bracelet-4.png" alt="Vintage Alhambra bracelet">
              <div class="search-creation-item__name">Vintage Alhambra bracelet, 5 motifs</div>
              <div class="search-creation-item__price">₫ 118,000,000</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.classList.add('no-scroll');

  requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.querySelector('.search-drawer__input').focus();
  });

  // Close handlers
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
}
