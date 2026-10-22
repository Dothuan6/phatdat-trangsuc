// ============================================================
// MAIN.JS — Application Entry Point
// ============================================================

// Import styles
import './styles/tokens.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/feedback.css';
import './styles/mobile.css';

// Import components
import { createHeader, createHeaderSpacer, openSearchDrawer } from './components/header.js';
import { createFooter } from './components/footer.js';
import { createContactDrawer } from './components/contact-drawer.js';
import { createBottomNav } from './components/bottom-nav.js';
import { createFloatingContact } from './components/floating-contact.js';
import { initCompareFloatingBar } from './components/feedback-modal.js';
import { applyComfortPrefs } from './data/wishlist-store.js';
import { initPwaInstallBanner } from './components/pwa-install-banner.js';

// Import router
import { registerRoute, initRouter } from './router.js';

// Import pages
import { renderHome } from './pages/home.js';
import { renderHighJewelry } from './pages/high-jewelry.js';
import { renderJewelry } from './pages/jewelry.js';
import { renderContact } from './pages/contact.js';
import { renderProductDetail } from './pages/product-detail.js';
import { renderLegal } from './pages/legal.js';
import { renderAbout } from './pages/about.js';
import { renderWishlist } from './pages/wishlist.js';
import { renderNotFound } from './pages/not-found.js';
import { renderInfo } from './pages/info.js';
import { renderStores } from './pages/stores.js';
import { renderSitemap } from './pages/sitemap.js';
import { renderCollection, renderSearch } from './pages/collection.js';
import { renderAdmin } from './pages/admin/admin-dashboard.js';
import { renderAdminLogin } from './pages/admin/admin-login.js';
import { initDataSync } from './services/supabase.js';

// ── Initialize Application ──
function init() {
  applyComfortPrefs();
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Header
  app.appendChild(createHeader());
  app.appendChild(createHeaderSpacer());

  // Main content area
  const main = document.createElement('main');
  main.className = 'main-content';
  main.id = 'main-content';
  app.appendChild(main);

  // Footer
  app.appendChild(createFooter());

  // Mobile Bottom Navigation Bar
  app.appendChild(createBottomNav());

  // Floating Quick Contact Hub
  const existingHub = document.getElementById('floating-contact-hub');
  if (existingHub) existingHub.remove();
  document.body.appendChild(createFloatingContact());

  // Product Comparison Floating Bar
  initCompareFloatingBar();

  // Contact Drawer (global)
  const { overlay: contactOverlay, drawer: contactDrawer } = createContactDrawer();
  document.body.appendChild(contactOverlay);
  document.body.appendChild(contactDrawer);

  // Register routes
  registerRoute('/', renderHome);
  registerRoute('/high-jewelry', renderHighJewelry);
  registerRoute('/jewelry', (container, params) => renderJewelry(container, { category: 'all' }));
  registerRoute('/jewelry/:category', (container, params) => renderJewelry(container, params));
  registerRoute('/contact', renderContact);
  registerRoute('/product/:id', renderProductDetail);
  registerRoute('/legal', (container, params) => renderLegal(container, { tab: 'privacy-policy' }));
  registerRoute('/legal/:tab', (container, params) => renderLegal(container, params));
  registerRoute('/about', renderAbout);
  registerRoute('/wishlist', renderWishlist);
  registerRoute('/404', renderNotFound);
  registerRoute('/info/:slug', renderInfo);
  registerRoute('/stores', renderStores);
  registerRoute('/sitemap', renderSitemap);
  registerRoute('/collections/:id', renderCollection);
  registerRoute('/search', (c) => renderSearch(c, { q: '' }));
  registerRoute('/search/:q', renderSearch);
  registerRoute('/admin', renderAdmin);
  registerRoute('/admin/login', renderAdminLogin);

  // Initialize router
  initRouter(main);

  // Initialize PWA Smart Install Banner
  initPwaInstallBanner();

  // Synchronize initial data in background
  initDataSync();
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for language changes to re-render
window.addEventListener('languagechange', () => {
  init();
});

// Global Keyboard Shortcuts ('/' to search, 'Escape' to close active modal/drawer)
window.addEventListener('keydown', (e) => {
  const tag = (document.activeElement && document.activeElement.tagName) || '';
  const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

  if (e.key === '/' && !isTyping && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    openSearchDrawer();
  } else if (e.key === 'Escape') {
    const activeModal = document.querySelector('.pd-callback-overlay.is-visible, .pd-modal-overlay.is-visible, .pd-lightbox-overlay.is-visible');
    if (activeModal) {
      const xBtn = activeModal.querySelector('.modal-close-x');
      if (xBtn) xBtn.click(); else activeModal.remove();
      document.body.classList.remove('no-scroll');
    }
    const sizeGuide = document.querySelector('.size-guide-overlay.is-open');
    if (sizeGuide) {
      sizeGuide.classList.remove('is-open');
    }
  }
});

// Register Progressive Web App (PWA) Service Worker for Offline Mode
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ── Mobile UX (Vòng 50): Back-to-top button ──
(function initBackToTop() {
  if (document.getElementById('pd-back-to-top')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'pd-back-to-top';
  btn.className = 'pd-back-to-top';
  btn.setAttribute('aria-label', 'Lên đầu trang');
  btn.textContent = '↑';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle('is-visible', window.scrollY > 700);
      ticking = false;
    });
  }, { passive: true });
})();

// ── Mobile UX (Vòng 42): Swipe down on bottom-sheet header to close ──
(function initSheetSwipeClose() {
  let startY = 0;
  let card = null;
  document.addEventListener('touchstart', (e) => {
    const header = e.target.closest && e.target.closest('.pd-callback-header');
    if (!header || window.innerWidth > 640) { card = null; return; }
    card = header.closest('.pd-callback-card');
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (!card) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) card.style.setProperty('transform', `translateY(${dy}px)`, 'important');
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!card) return;
    const dy = (e.changedTouches[0] && e.changedTouches[0].clientY - startY) || 0;
    const overlay = card.closest('.pd-callback-overlay');
    if (dy > 90 && overlay) {
      const closeBtn = overlay.querySelector('.modal-close-x, .pd-callback-close, [aria-label="Close"], [aria-label="Đóng"]');
      if (closeBtn) closeBtn.click(); else overlay.remove();
    } else {
      card.style.removeProperty('transform');
    }
    card = null;
  });
})();
