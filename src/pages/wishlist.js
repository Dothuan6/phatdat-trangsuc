// ============================================================
// WISHLIST PAGE — Tư vấn trọn bộ, Chia sẻ link & Sản phẩm vừa xem
// ============================================================

import {
  getWishlistedProductIds,
  mergeSharedWishlist,
  getRecentlyViewedProductIds,
  getOwnedJewelryList,
  toggleOwnedJewelry,
  markJewelryPolishedToday
} from '../data/wishlist-store.js';
import { products as allCatalogProducts, getProductById, formatPrice } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { showToast, openQuickCallbackModal, openGiftFinderModal, openAnniversaryReminderModal } from '../components/feedback-modal.js';
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
          <button type="button" id="wl-moodboard-btn" style="background: #FAF4E8; color: #8A6218; border: 1px solid var(--color-accent-gold); border-radius: 6px; padding: 10px 14px; font-size: 13px; font-weight: 700; cursor: pointer;">
            🖼️ Tải Ảnh Moodboard (.PNG)
          </button>
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

      // Download Moodboard PNG Handler (Vòng 7)
      actionBar.querySelector('#wl-moodboard-btn').addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');

        // Background
        const grad = ctx.createLinearGradient(0, 0, 900, 640);
        grad.addColorStop(0, '#143F3B');
        grad.addColorStop(1, '#1E5D57');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 900, 640);

        // Border
        ctx.strokeStyle = '#C99738';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, 860, 600);

        // Header
        ctx.textAlign = 'center';
        ctx.fillStyle = '#F3D184';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('✦ BỘ SƯU TẬP TRANG SỨC YÊU THÍCH · PHÁT ĐẠT JEWELRY ✦', 450, 60);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'italic bold 26px Georgia, serif';
        ctx.fillText(`Wish-list Cá Nhân (${products.length} mẫu — Tổng: ${formatPrice(totalAmount)})`, 450, 98);

        // Product cards grid (up to 4 items)
        const showItems = products.slice(0, 4);
        const cardW = 185;
        const gap = 22;
        const startX = (900 - (showItems.length * cardW + (showItems.length - 1) * gap)) / 2;

        showItems.forEach((p, idx) => {
          const x = startX + idx * (cardW + gap);
          const y = 135;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y, cardW, 380);
          ctx.strokeStyle = '#C99738';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, cardW, 380);

          ctx.fillStyle = '#1E5D57';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(p.name.slice(0, 22), x + cardW / 2, y + 295);
          ctx.fillStyle = '#666';
          ctx.font = '11px monospace';
          ctx.fillText(`SKU: ${p.reference}`, x + cardW / 2, y + 318);
          ctx.fillStyle = '#C99738';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(formatPrice(p.price), x + cardW / 2, y + 346);
        });

        ctx.fillStyle = '#F3D184';
        ctx.font = '13px sans-serif';
        ctx.fillText('Gửi ảnh này qua Zalo (0898 025 013) để nhận video thực tế & hộp quà nhung miễn phí!', 450, 568);

        const link = document.createElement('a');
        link.download = `wishlist-moodboard-phat-dat.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Đã tải ảnh Moodboard Bộ Sưu Tập Yêu Thích (.PNG) thành công!', 'success');
      });

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

    // ── My Silver Box & Care Tracker Section (Vòng 7: Tủ Bạc & Lịch Đánh Bóng Định Kỳ) ──
    const ownedEntries = getOwnedJewelryList();
    const silverBoxSec = document.createElement('div');
    silverBoxSec.style.cssText = 'margin-top: 48px; background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 12px; padding: 24px;';
    silverBoxSec.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--color-accent-gold); text-transform: uppercase; letter-spacing: 0.1em;">💎 QUẢN LÝ & CHĂM SÓC BẠC S925 ĐỊNH KỲ</span>
          <h2 style="font-family: var(--font-display); font-size: 21px; color: var(--color-brand-primary); margin: 4px 0 0;">
            Tủ Trang Sức Bạc Của Tôi & Lịch Nhắc Đánh Bóng (${ownedEntries.length})
          </h2>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <select id="sb-quick-add-select" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--color-border); font-size: 12.5px; background: #fff;">
            <option value="">+ Thêm nhanh mẫu bạn đang sở hữu...</option>
            ${allCatalogProducts.map(p => `<option value="${p.id}">${p.name} (${p.reference})</option>`).join('')}
          </select>
          <button type="button" id="sb-open-reminder-btn" style="background: #FAF4E8; color: #8A6218; border: 1px solid var(--color-accent-gold); border-radius: 6px; padding: 8px 14px; font-size: 12.5px; font-weight: 700; cursor: pointer;">
            📅 Sổ Tay Lịch Kỷ Niệm
          </button>
        </div>
      </div>
      ${ownedEntries.length === 0 ? `
        <div style="background: #fff; border: 1px dashed var(--color-border); border-radius: 8px; padding: 18px; text-align: center; font-size: 13px; color: var(--color-text-secondary);">
          Bạn chưa lưu món trang sức nào vào <strong>Tủ Bạc Của Tôi</strong>. Hãy chọn một mẫu ở thanh chọn phía trên hoặc bấm nút <strong>"💎 Tủ Bạc"</strong> trên trang chi tiết sản phẩm để hệ thống tự động tính chu kỳ vệ sinh & đánh bóng bạc miễn phí (mỗi 90 ngày)!
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          ${ownedEntries.map(entry => {
            const p = getProductById(entry.productId);
            if (!p) return '';
            return `
              <div style="background: #fff; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <img src="${p.images[0]}" alt="${p.name}" style="width: 56px; height: 56px; object-fit: contain; border-radius: 8px; background: #fafaf8; border: 1px solid var(--color-border-light); flex-shrink: 0;">
                  <div style="min-width: 0;">
                    <a href="#/product/${p.id}" style="font-size: 13.5px; font-weight: 700; color: var(--color-brand-primary); text-decoration: none; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</a>
                    <div style="font-size: 11.5px; color: var(--color-text-secondary);">Làm sáng gần nhất: <strong>${entry.lastPolishedDate}</strong></div>
                    <div style="font-size: 11.5px; color: #059669; font-weight: 600;">✨ Lịch đánh bóng kế tiếp: ${entry.nextPolishDate}</div>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 6px; border-top: 1px dashed var(--color-border-light); padding-top: 8px;">
                  <button type="button" class="sb-polished-btn" data-id="${p.id}" style="background: #E6F4F1; color: var(--color-brand-primary); border: none; border-radius: 6px; padding: 5px 10px; font-size: 11.5px; font-weight: 600; cursor: pointer;">
                    ✓ Vừa vệ sinh hôm nay
                  </button>
                  <button type="button" class="sb-remove-btn" data-id="${p.id}" style="background: none; color: #999; border: 1px solid var(--color-border); border-radius: 6px; padding: 5px 8px; font-size: 11px; cursor: pointer;">
                    Gỡ
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
    page.appendChild(silverBoxSec);

    silverBoxSec.querySelector('#sb-open-reminder-btn').addEventListener('click', () => openAnniversaryReminderModal());
    silverBoxSec.querySelector('#sb-quick-add-select').addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;
      toggleOwnedJewelry(val);
      showToast('Đã cập nhật Tủ Trang Sức Bạc Của Tôi!', 'success');
      renderInner();
    });
    silverBoxSec.querySelectorAll('.sb-polished-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        markJewelryPolishedToday(btn.dataset.id);
        showToast('Đã cập nhật ngày vệ sinh hôm nay! Hẹn bạn 90 ngày tới ghé đánh bóng bạc miễn phí nhé.', 'success');
        renderInner();
      });
    });
    silverBoxSec.querySelectorAll('.sb-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleOwnedJewelry(btn.dataset.id);
        showToast('Đã gỡ sản phẩm khỏi Tủ Bạc Của Tôi.', 'info');
        renderInner();
      });
    });

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
