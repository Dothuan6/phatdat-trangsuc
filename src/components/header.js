// ============================================================
// HEADER COMPONENT — Site header with navigation
// ============================================================

import { navigate } from '../router.js';

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
          <span>SEARCH</span>
        </button>
      </div>
      <div class="header-center">
        <a href="#/" class="brand-logo" id="brand-logo">Van Cleef & Arpels</a>
      </div>
      <div class="header-right">
        <button class="header-region hide-mobile" aria-label="Select region">
          VN - ₫ <span style="margin-left: 4px;">›</span>
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

  // Menu toggle
  header.querySelector('#menu-toggle').addEventListener('click', () => {
    openNavDrawer();
  });

  // Contact toggle
  header.querySelector('#contact-toggle').addEventListener('click', () => {
    const event = new CustomEvent('toggle-contact-drawer');
    document.dispatchEvent(event);
  });

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
        <span>High Jewelry</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry">
        <span>Jewelry</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/necklaces">
        <span>Necklaces & Pendants</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/rings">
        <span>Rings</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/bracelets">
        <span>Bracelets</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/jewelry/earrings">
        <span>Earrings</span>
        <span class="nav-item__chevron">›</span>
      </a>
      <a class="nav-item" href="#/contact">
        <span>Contact Us</span>
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
