// ============================================================
// PRODUCT CARD COMPONENT
// ============================================================

import { formatPrice } from '../data/products.js';

export function createProductCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = `#/product/${product.id}`;
  card.id = `product-card-${product.id}`;

  const variationsHtml = product.variationCount > 0
    ? `<p class="product-card__variations">+${product.variationCount} stone variations</p>`
    : '';

  card.innerHTML = `
    <div class="product-card__image">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy"
           onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23F5F5F0%22 width=%22400%22 height=%22400%22/%3E%3Cpath d=%22M200 100 L180 160 L140 160 L172 195 L160 250 L200 220 L240 250 L228 195 L260 160 L220 160Z%22 fill=%22none%22 stroke=%22%23C5A467%22 stroke-width=%222%22/%3E%3Ctext x=%22200%22 y=%22320%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22 font-family=%22serif%22%3E${product.name}%3C/text%3E%3C/svg%3E';">
    </div>
    <h3 class="product-card__name">${product.name}</h3>
    <p class="product-card__materials">${product.materials}</p>
    <p class="product-card__price">${formatPrice(product.price, product.currency)}</p>
    ${variationsHtml}
  `;

  return card;
}
