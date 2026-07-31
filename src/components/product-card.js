// ============================================================
// PRODUCT CARD COMPONENT
// ============================================================

import { formatPrice } from '../data/products.js';
import { t } from '../i18n.js';
import { isWishlisted, toggleWishlist } from '../data/wishlist-store.js';

export function createProductCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = `#/product/${product.id}`;
  card.id = `product-card-${product.id}`;

  const variationsHtml = product.variationCount > 0
    ? `<p class="product-card__variations">+${product.variationCount} ${t('common.variations') || 'stone variations'}</p>`
    : '';

  const isLiked = isWishlisted(product.id);
  const heartFill = isLiked ? 'currentColor' : 'none';
  const heartColor = isLiked ? '#D4380D' : 'currentColor';

  card.innerHTML = `
    <div class="product-card__image" style="position: relative;">
      <button class="product-card__wishlist" style="position: absolute; top: 12px; right: 12px; z-index: 2; background: none; border: none; cursor: pointer; color: ${heartColor}; width: 24px; height: 24px; padding: 0;" aria-label="Wishlist">
        <svg viewBox="0 0 24 24" fill="${heartFill}" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy"
           onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23F5F5F0%22 width=%22400%22 height=%22400%22/%3E%3Cpath d=%22M200 100 L180 160 L140 160 L172 195 L160 250 L200 220 L240 250 L228 195 L260 160 L220 160Z%22 fill=%22none%22 stroke=%22%23C5A467%22 stroke-width=%222%22/%3E%3Ctext x=%22200%22 y=%22320%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22 font-family=%22serif%22%3E${product.name}%3C/text%3E%3C/svg%3E';">
    </div>
    <h3 class="product-card__name">${product.name}</h3>
    <p class="product-card__materials">${product.materials}</p>
    <p class="product-card__price">${formatPrice(product.price, product.currency)}</p>
    ${variationsHtml}
  `;

  const wishlistBtn = card.querySelector('.product-card__wishlist');
  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowLiked = toggleWishlist(product.id);
    wishlistBtn.style.color = isNowLiked ? '#D4380D' : 'currentColor';
    wishlistBtn.querySelector('svg').setAttribute('fill', isNowLiked ? 'currentColor' : 'none');
  });

  return card;
}
