// ============================================================
// WISHLIST PAGE — Tư vấn trọn bộ, Chia sẻ link & Sản phẩm vừa xem
// ============================================================

import {
  getWishlistedProductIds,
  mergeSharedWishlist,
  getRecentlyViewedProductIds
} from '../data/wishlist-store.js';
import { getProductById, formatPrice } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { showToast, openQuickCallbackModal, openGiftFinderModal } from '../components/feedback-modal.js';
import { siteInfo } from '../data/site-info.js';
import { t } from '../i18n.js';

export function renderWishlist(container) {
  let isUnmounted = false;

  // Check if URL has shared wishlist IDs (e.g. #/wishlist?ids=pd-01,pd-02)
  const hash = window.location.hash || '';
  if (hash.includes('?ids=')) {
    const queryStr = hash.split('?')[1] || '';
    const params = new URLSearchParams(queryStr);
    const idsParam = params.get('ids');
    if (idsParam) {
      const sharedIds = idsParam.split(',').map(s => s.trim()).filter(Boolean);
      if (sharedIds.length > 0) {
        mergeSharedWishlist(sharedIds);
        setTimeout(() => {
          showToast(`Đã tải ${sharedIds.length} mẫu trang sức từ danh sách chia sẻ!`, 'success', 3500);
        }, 200);
      }
    }
  }

  function renderInner() {
    container.innerHTML = '';

    const page = document.createElement('div');
    page.className = 'page-wishlist container section';

    const title = document.createElement('h1');
    title.className = 'page-title';
    title.style.textAlign = 'center';
    title.style.marginBottom = '16px';
    title.style.color = 'var(--color-brand-primary)';
    title.textContent = t('nav.wishlist') || 'Bộ Sưu Tập Yêu Thích';
    page.appendChild(title);

    const productIds = getWishlistedProductIds();
    const products = productIds.map(id => getProductById(id)).filter(Boolean);

    if (products.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.style.textAlign = 'center';
      emptyState.style.padding = '40px 20px';
      emptyState.style.background = '#fafaf8';
      emptyState.style.borderRadius = '10px';
      emptyState.style.border = '1px solid var(--color-border-light)';
      emptyState.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 12px;">💎</div>
        <h3 style="font-family: var(--font-display); color: var(--color-brand-primary); margin-bottom: 8px;">Danh sách yêu thích của bạn đang trống</h3>
        <p style="margin-bottom: 24px; color: var(--color-text-secondary); font-size: 14px;">Hãy thả tim các mẫu trang sức bạn ưng ý để so sánh hoặc gửi tư vấn trọn bộ qua Zalo nhé!</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="#/jewelry" class="btn" style="background: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">KHÁM PHÁ TRANG SỨC</a>
          <button type="button" id="wl-empty-gift-btn" class="btn" style="background: #FAF4E8; color: #8A6218; border-color: var(--color-accent-gold); font-weight: 600;">🎁 TRỢ LÝ CHỌN QUÀ TẶNG</button>
        </div>
      `;
      page.appendChild(emptyState);
      emptyState.querySelector('#wl-empty-gift-btn')?.addEventListener('click', () => openGiftFinderModal());
    } else {
      const totalAmount = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

      // Multi-Item Action & Consultation Bar
      const actionBar = document.createElement('div');
      actionBar.style.cssText = `
        background: linear-gradient(135deg, #f4f9f8 0%, #faf6ee 100%);
        border: 1px solid var(--color-border);
        border-radius: 10px;
        padding: 18px 22px;
        margin-bottom: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
      `;
      actionBar.innerHTML = `
        <div>
          <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary);">
            Bạn đã chọn ${products.length} mẫu trang sức yêu thích
          </div>
          <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 4px;">
            Tổng giá trị tham khảo: <strong style="color: var(--color-brand-primary); font-size: 16px;">${formatPrice(totalAmount)}</strong> (Miễn phí hộp quà & làm sáng trọn đời)
          </div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button type="button" id="wl-share-list-btn" style="background: #ffffff; color: var(--color-text-primary); border: 1px solid var(--color-border); border-radius: 6px; padding: 10px 14px; font-size: 13px; font-weight: 600; cursor: pointer;">
            🔗 Chia sẻ danh sách (Gửi người thương)
          </button>
          <button type="button" id="wl-callback-all-btn" style="background: var(--color-accent-gold); color: #143F3B; border: none; border-radius: 6px; padding: 10px 16px; font-size: 13px; font-weight: 700; cursor: pointer;">
            📞 Yêu cầu gọi lại tư vấn trọn bộ
          </button>
          <button type="button" id="wl-zalo-all-btn" style="background: #0068FF; color: #ffffff; border: none; border-radius: 6px; padding: 10px 16px; font-size: 13px; font-weight: 700; cursor: pointer;">
            💬 Nhắn Zalo tư vấn (${products.length} mẫu)
          </button>
        </div>
      `;
      page.appendChild(actionBar);

      // Share Wishlist Handler
      actionBar.querySelector('#wl-share-list-btn').addEventListener('click', async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#/wishlist?ids=${products.map(p => p.id).join(',')}`;
        const shareText = `💖 Danh sách ${products.length} mẫu trang sức Bạc 925 yêu thích tại Phát Đạt Jewelry:\n` +
          products.map((p, i) => `${i + 1}. ${p.name} (${formatPrice(p.price)})`).join('\n') +
          `\n👉 Xem tại: ${shareUrl}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Bộ sưu tập yêu thích | Phát Đạt Jewelry',
              text: shareText,
              url: shareUrl
            });
            return;
          } catch (e) {}
        }

        try {
          await navigator.clipboard.writeText(shareText);
          showToast('Đã sao chép link bộ sưu tập yêu thích! Hãy gửi cho bạn bè hoặc người thương nhé.', 'success', 4000);
        } catch (e) {}
      });

      // Callback All Handler
      actionBar.querySelector('#wl-callback-all-btn').addEventListener('click', () => {
        openQuickCallbackModal(products[0], { productsList: products });
      });

      // Zalo All Handler
      actionBar.querySelector('#wl-zalo-all-btn').addEventListener('click', () => {
        const lines = products.map((p, idx) => `${idx + 1}. ${p.name} (Mã: ${p.reference}) - ${formatPrice(p.price)}`).join('\n');
        const msg = `[Phát Đạt Jewelry] Tôi muốn tư vấn bộ ${products.length} sản phẩm yêu thích:\n${lines}\n- Tổng tham khảo: ${formatPrice(totalAmount)}`;
        try {
          navigator.clipboard.writeText(msg);
          showToast(`Đã sao chép danh sách ${products.length} sản phẩm! Đang mở Zalo tư vấn...`, 'success', 4000);
        } catch (e) {}
        setTimeout(() => {
          window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
        }, 500);
      });

      const grid = document.createElement('div');
      grid.className = 'jewelry-grid';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
      grid.style.gap = '24px';

      products.forEach(product => {
        grid.appendChild(createProductCard(product));
      });

      page.appendChild(grid);
    }

    // Recently Viewed Products on Wishlist Page
    const recentIds = getRecentlyViewedProductIds().filter(id => !productIds.includes(id));
    const recentItems = recentIds.map(id => getProductById(id)).filter(Boolean).slice(0, 4);
    if (recentItems.length > 0) {
      const recentSec = document.createElement('div');
      recentSec.style.cssText = 'margin-top: 56px; border-top: 1px solid var(--color-border-light); padding-top: 32px;';
      recentSec.innerHTML = `
        <h2 style="font-family: var(--font-display); font-size: 20px; color: var(--color-brand-primary); margin-bottom: 20px; text-align: center;">
          Sản Phẩm Bạn Vừa Xem Gần Đây
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px;" id="wl-recent-grid"></div>
      `;
      const rGrid = recentSec.querySelector('#wl-recent-grid');
      recentItems.forEach(p => rGrid.appendChild(createProductCard(p)));
      page.appendChild(recentSec);
    }

    container.appendChild(page);
  }

  renderInner();

  const onWishlistUpdate = () => {
    if (!isUnmounted) {
      renderInner();
    }
  };
  window.addEventListener('wishlist-updated', onWishlistUpdate);

  return () => {
    isUnmounted = true;
    window.removeEventListener('wishlist-updated', onWishlistUpdate);
  };
}
