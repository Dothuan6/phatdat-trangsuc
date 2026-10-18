// ============================================================
// PRODUCT CARD COMPONENT — Phát Đạt Jewelry
// ============================================================

import { formatPrice } from '../data/products.js';
import { t } from '../i18n.js';
import {
  isWishlisted,
  toggleWishlist,
  isCompared,
  toggleCompareProduct
} from '../data/wishlist-store.js';
import { showToast, openQuickViewModal } from './feedback-modal.js';

function getProductBadge(product) {
  const hotIds = ['pd-01', 'pd-02', 'pd-06', 'pd-09', 'pd-14'];
  const newIds = ['pd-04', 'pd-08', 'pd-12', 'pd-17', 'pd-19'];
  if (hotIds.includes(product.id) || (product.reviewsCount && product.reviewsCount >= 28)) {
    return { text: '🔥 Bán chạy', bg: '#FFF3E0', color: '#B45309', border: '#FCD34D' };
  }
  if (newIds.includes(product.id)) {
    return { text: '✨ Mẫu mới', bg: '#EBF4F3', color: '#1E5D57', border: '#A7D7D2' };
  }
  if (product.price <= 199000) {
    return { text: '🎁 Quà tặng Hot', bg: '#FDF2F8', color: '#9D174D', border: '#FBCFE8' };
  }
  return null;
}

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
  const inCompare = isCompared(product.id);
  const badge = getProductBadge(product);
  const primaryImg = (product.images && product.images[0]) || './images/products/Daychuyen4.3-removebg-preview.png';
  const secondaryImg = product.images && product.images.length > 1 ? product.images[1] : null;

  card.innerHTML = `
    <div class="product-card__image" style="position: relative; overflow: hidden;">
      ${badge ? `
        <span class="product-card__badge" style="
          position: absolute;
          bottom: 10px;
          left: 10px;
          z-index: 2;
          background: ${badge.bg};
          color: ${badge.color};
          border: 1px solid ${badge.border};
          border-radius: 12px;
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 8px;
          pointer-events: none;
        ">${badge.text}</span>
      ` : ''}

      <button type="button" class="product-card__compare" style="
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 2;
        background: ${inCompare ? 'var(--color-brand-primary)' : 'rgba(255,255,255,0.9)'};
        color: ${inCompare ? '#ffffff' : 'var(--color-text-secondary)'};
        border: 1px solid ${inCompare ? 'var(--color-brand-primary)' : 'var(--color-border)'};
        border-radius: 14px;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      " title="Thêm vào so sánh">${inCompare ? '✓ Đang so sánh' : '⚖️ So sánh'}</button>

      <button type="button" class="product-card__wishlist" style="position: absolute; top: 10px; right: 10px; z-index: 2; background: rgba(255,255,255,0.85); border-radius: 50%; border: none; cursor: pointer; color: ${heartColor}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; padding: 5px;" aria-label="Wishlist">
        <svg viewBox="0 0 24 24" fill="${heartFill}" stroke="currentColor" stroke-width="1.6" width="18" height="18">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>

      <button type="button" class="product-card__quickview" style="
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 2;
        background: rgba(20, 63, 59, 0.88);
        color: #ffffff;
        border: none;
        border-radius: 14px;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        cursor: pointer;
        transition: all 0.2s ease;
      " title="Xem nhanh thông tin & tư vấn">👁️ Xem nhanh</button>

      <img class="product-card__img-el" src="${primaryImg}" alt="${product.name}" loading="lazy"
           onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23F5F5F0%22 width=%22400%22 height=%22400%22/%3E%3Cpath d=%22M200 100 L180 160 L140 160 L172 195 L160 250 L200 220 L240 250 L228 195 L260 160 L220 160Z%22 fill=%22none%22 stroke=%22%23C5A467%22 stroke-width=%222%22/%3E%3Ctext x=%22200%22 y=%22320%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22 font-family=%22serif%22%3E${product.name}%3C/text%3E%3C/svg%3E';">
    </div>
    <h3 class="product-card__name">${product.name}</h3>
    <p class="product-card__materials">${product.materials}</p>
    <p class="product-card__price">${formatPrice(product.price, product.currency)}</p>
    ${variationsHtml}
  `;

  // Hover secondary image swap
  if (secondaryImg) {
    const imgEl = card.querySelector('.product-card__img-el');
    card.addEventListener('mouseenter', () => {
      imgEl.src = secondaryImg;
    });
    card.addEventListener('mouseleave', () => {
      imgEl.src = primaryImg;
    });
  }

  // Quick View button
  const quickViewBtn = card.querySelector('.product-card__quickview');
  quickViewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickViewModal(product);
  });

  // Wishlist button
  const wishlistBtn = card.querySelector('.product-card__wishlist');
  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowLiked = toggleWishlist(product.id);
    wishlistBtn.style.color = isNowLiked ? '#D4380D' : 'currentColor';
    wishlistBtn.querySelector('svg').setAttribute('fill', isNowLiked ? 'currentColor' : 'none');
    showToast(
      isNowLiked ? `Đã thêm "${product.name}" vào danh sách yêu thích!` : `Đã xóa "${product.name}" khỏi danh sách yêu thích`,
      isNowLiked ? 'success' : 'info',
      2500
    );
  });

  // Compare button
  const compareBtn = card.querySelector('.product-card__compare');
  compareBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = toggleCompareProduct(product.id);
    if (res.limitReached) {
      showToast('Chỉ có thể so sánh tối đa 3 mẫu trang sức cùng lúc!', 'warning', 2800);
      return;
    }
    compareBtn.textContent = res.added ? '✓ Đang so sánh' : '⚖️ So sánh';
    compareBtn.style.background = res.added ? 'var(--color-brand-primary)' : 'rgba(255,255,255,0.9)';
    compareBtn.style.color = res.added ? '#ffffff' : 'var(--color-text-secondary)';
    compareBtn.style.borderColor = res.added ? 'var(--color-brand-primary)' : 'var(--color-border)';
    showToast(
      res.added ? `Đã thêm "${product.name}" vào bảng so sánh (${res.list.length}/3)!` : `Đã bỏ "${product.name}" khỏi bảng so sánh`,
      res.added ? 'success' : 'info',
      2200
    );
  });

  return card;
}

