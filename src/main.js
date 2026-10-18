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

// Import components
import { createHeader, createHeaderSpacer, openSearchDrawer } from './components/header.js';
import { createFooter } from './components/footer.js';
import { createContactDrawer } from './components/contact-drawer.js';
import { createBottomNav } from './components/bottom-nav.js';
import { createFloatingContact } from './components/floating-contact.js';
import { initCompareFloatingBar } from './components/feedback-modal.js';

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
      activeModal.remove();
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
