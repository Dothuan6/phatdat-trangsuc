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

// Import components
import { createHeader, createHeaderSpacer } from './components/header.js';
import { createFooter } from './components/footer.js';
import { createContactDrawer } from './components/contact-drawer.js';

// Import router
import { registerRoute, initRouter } from './router.js';

// Import pages
import { renderHighJewelry } from './pages/high-jewelry.js';
import { renderJewelry } from './pages/jewelry.js';
import { renderContact } from './pages/contact.js';
import { renderProductDetail } from './pages/product-detail.js';

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

  // Contact Drawer (global)
  const { overlay: contactOverlay, drawer: contactDrawer } = createContactDrawer();
  document.body.appendChild(contactOverlay);
  document.body.appendChild(contactDrawer);

  // Register routes
  registerRoute('/high-jewelry', renderHighJewelry);
  registerRoute('/jewelry', (container, params) => renderJewelry(container, { category: 'all' }));
  registerRoute('/jewelry/:category', (container, params) => renderJewelry(container, params));
  registerRoute('/contact', renderContact);
  registerRoute('/product/:id', renderProductDetail);

  // Initialize router
  initRouter(main);
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
