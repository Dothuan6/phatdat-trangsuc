// ============================================================
// WISHLIST PAGE
// ============================================================

import { getWishlistedProductIds } from '../data/wishlist-store.js';
import { getProductById } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { t } from '../i18n.js';

export function renderWishlist(container, params = {}) {
  let isUnmounted = false;

  function renderInner() {
    container.innerHTML = '';
    
    const page = document.createElement('div');
    page.className = 'page-wishlist container section';

    const title = document.createElement('h1');
    title.className = 'page-title';
    title.style.textAlign = 'center';
    title.style.marginBottom = '48px';
    title.textContent = t('nav.wishlist') || 'Wishlist';
    page.appendChild(title);

    const productIds = getWishlistedProductIds();
    const products = productIds.map(id => getProductById(id)).filter(Boolean);

    if (products.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.style.textAlign = 'center';
      emptyState.style.padding = '48px 0';
      emptyState.innerHTML = `
        <p style="margin-bottom: 24px; color: var(--color-text-secondary);">${t('wishlist.empty') || 'Your wishlist is empty.'}</p>
        <a href="#/jewelry" class="btn">${t('pdp.backToJewelry') || 'DISCOVER JEWELRY'}</a>
      `;
      page.appendChild(emptyState);
    } else {
      const grid = document.createElement('div');
      grid.className = 'jewelry-grid';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
      grid.style.gap = '24px';

      products.forEach(product => {
        grid.appendChild(createProductCard(product));
      });

      page.appendChild(grid);
    }

    container.appendChild(page);
  }

  // Initial render
  renderInner();

  // Listen for updates
  const onWishlistUpdate = () => {
    if (!isUnmounted) {
      renderInner();
    }
  };
  window.addEventListener('wishlist-updated', onWishlistUpdate);

  // Cleanup on route change
  return () => {
    isUnmounted = true;
    window.removeEventListener('wishlist-updated', onWishlistUpdate);
  };
}
