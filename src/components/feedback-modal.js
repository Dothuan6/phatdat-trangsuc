// ============================================================
// FEEDBACK MODAL & TOAST NOTIFICATION SYSTEM — PHÁT ĐẠT JEWELRY
// ============================================================

import '../styles/feedback.css';
import { addCustomerContact } from '../services/supabase.js';
import {
  getCompareProductIds,
  toggleCompareProduct,
  clearCompareList,
  trackProductEvent
} from '../data/wishlist-store.js';
import { products, getProductById, formatPrice } from '../data/products.js';
import { siteInfo } from '../data/site-info.js';

// SVG Icons
const ICONS = {
  success: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,
  error: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  `,
  warning: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  `,
  info: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `,
  close: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `,
  trash: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `
};

// ══════════════════════════════════════════════════════════════
// 1. TOAST NOTIFICATION
// ══════════════════════════════════════════════════════════════

let toastContainer = null;

function getToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'pd-toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Hiển thị Toast thông báo
 * @param {string|Object} options - Message string hoặc options object
 * @param {string} [type='info'] - 'success' | 'error' | 'warning' | 'info'
 * @param {number} [duration=3500] - Thời gian hiển thị (ms)
 */
export function showToast(options, type = 'info', duration = 3500) {
  let message = '';
  let title = '';
  let toastType = type;
  let toastDuration = duration;

  if (typeof options === 'string') {
    message = options;
  } else if (typeof options === 'object' && options !== null) {
    message = options.message || '';
    title = options.title || '';
    toastType = options.type || 'info';
    toastDuration = options.duration !== undefined ? options.duration : 3500;
  }

  const container = getToastContainer();

  const toast = document.createElement('div');
  toast.className = `pd-toast pd-toast--${toastType}`;
  toast.role = 'status';

  const defaultTitles = {
    success: 'Thành công',
    error: 'Đã có lỗi xảy ra',
    warning: 'Lưu ý',
    info: 'Thông báo'
  };

  const displayTitle = title || (message.length > 50 ? defaultTitles[toastType] : '');

  toast.innerHTML = `
    <div class="pd-toast-icon">
      ${ICONS[toastType] || ICONS.info}
    </div>
    <div class="pd-toast-content">
      ${displayTitle ? `<div class="pd-toast-title">${displayTitle}</div>` : ''}
      <div class="pd-toast-message">${message}</div>
    </div>
    <button type="button" class="pd-toast-close" aria-label="Đóng">
      ${ICONS.close}
    </button>
    <div class="pd-toast-progress" style="animation-duration: ${toastDuration}ms;"></div>
  `;

  container.appendChild(toast);

  // Trigger entrance transition
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  let dismissTimeout = null;

  const removeToast = () => {
    if (dismissTimeout) clearTimeout(dismissTimeout);
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    setTimeout(() => {
      toast.remove();
    }, 350);
  };

  // Close button click
  toast.querySelector('.pd-toast-close').addEventListener('click', removeToast);

  // Auto dismiss
  dismissTimeout = setTimeout(removeToast, toastDuration);

  // Pause on hover
  toast.addEventListener('mouseenter', () => {
    if (dismissTimeout) clearTimeout(dismissTimeout);
    const prog = toast.querySelector('.pd-toast-progress');
    if (prog) prog.style.animationPlayState = 'paused';
  });

  toast.addEventListener('mouseleave', () => {
    const prog = toast.querySelector('.pd-toast-progress');
    if (prog) prog.style.animationPlayState = 'running';
    dismissTimeout = setTimeout(removeToast, 1500);
  });

  return { close: removeToast };
}

// ══════════════════════════════════════════════════════════════
// 2. CONFIRM MODAL (Thay thế window.confirm)
// ══════════════════════════════════════════════════════════════

/**
 * Hiển thị Hộp thoại Xác nhận đẹp mắt (Promise-based)
 * @param {Object} options
 * @param {string} options.title - Tiêu đề xác nhận
 * @param {string} options.message - Nội dung giải thích
 * @param {string} [options.confirmText='Xác nhận'] - Nhãn nút xác nhận
 * @param {string} [options.cancelText='Hủy bỏ'] - Nhãn nút hủy
 * @param {string} [options.type='danger'] - 'danger' | 'warning' | 'primary' | 'success'
 * @returns {Promise<boolean>} - Trả về true nếu đồng ý, false nếu hủy
 */
export function showConfirmModal({
  title = 'Xác nhận hành động',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  type = 'danger',
  icon = null
} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'pd-dialog-overlay';

    let iconHtml = icon;
    if (!iconHtml) {
      if (type === 'danger') iconHtml = ICONS.trash;
      else if (type === 'warning') iconHtml = ICONS.warning;
      else if (type === 'success') iconHtml = ICONS.success;
      else iconHtml = ICONS.info;
    }

    overlay.innerHTML = `
      <div class="pd-dialog-card" role="dialog" aria-modal="true">
        <div class="pd-dialog-bar pd-dialog-bar--${type}"></div>
        <div class="pd-dialog-body">
          <div class="pd-dialog-icon-wrap pd-dialog-icon-wrap--${type}">
            ${iconHtml}
          </div>
          <h3 class="pd-dialog-title">${title}</h3>
          <p class="pd-dialog-message">${message}</p>
        </div>
        <div class="pd-dialog-footer">
          <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="pd-modal-cancel">
            ${cancelText}
          </button>
          <button type="button" class="pd-dialog-btn pd-dialog-btn--${type}" id="pd-modal-confirm">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
      const confirmBtn = overlay.querySelector('#pd-modal-confirm');
      if (confirmBtn) confirmBtn.focus();
    });

    const closeDialog = (result) => {
      overlay.classList.remove('is-visible');
      setTimeout(() => {
        overlay.remove();
        document.removeEventListener('keydown', handleKey);
        resolve(result);
      }, 250);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') closeDialog(false);
    };

    document.addEventListener('keydown', handleKey);

    overlay.querySelector('#pd-modal-cancel').addEventListener('click', () => closeDialog(false));
    overlay.querySelector('#pd-modal-confirm').addEventListener('click', () => closeDialog(true));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDialog(false);
    });
  });
}

// ══════════════════════════════════════════════════════════════
// 3. ALERT MODAL (Thay thế window.alert)
// ══════════════════════════════════════════════════════════════

/**
 * Hiển thị Hộp thoại Thông báo đẹp mắt (Promise-based)
 * @param {Object} options
 * @param {string} options.title - Tiêu đề
 * @param {string} options.message - Nội dung
 * @param {string} [options.buttonText='Đã hiểu'] - Nhãn nút đóng
 * @param {string} [options.type='info'] - 'info' | 'success' | 'warning' | 'error'
 * @returns {Promise<void>}
 */
export function showAlertModal({
  title = 'Thông báo',
  message = '',
  buttonText = 'Đã hiểu',
  type = 'info'
} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'pd-dialog-overlay';

    let iconHtml = ICONS[type] || ICONS.info;

    overlay.innerHTML = `
      <div class="pd-dialog-card" role="dialog" aria-modal="true">
        <div class="pd-dialog-bar pd-dialog-bar--${type}"></div>
        <div class="pd-dialog-body">
          <div class="pd-dialog-icon-wrap pd-dialog-icon-wrap--${type}">
            ${iconHtml}
          </div>
          <h3 class="pd-dialog-title">${title}</h3>
          <p class="pd-dialog-message">${message}</p>
        </div>
        <div class="pd-dialog-footer">
          <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="pd-modal-ok">
            ${buttonText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
      const okBtn = overlay.querySelector('#pd-modal-ok');
      if (okBtn) okBtn.focus();
    });

    const closeDialog = () => {
      overlay.classList.remove('is-visible');
      setTimeout(() => {
        overlay.remove();
        document.removeEventListener('keydown', handleKey);
        resolve();
      }, 250);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') closeDialog();
    };

    document.addEventListener('keydown', handleKey);
    overlay.querySelector('#pd-modal-ok').addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDialog();
    });
  });
}

// ══════════════════════════════════════════════════════════════
// 4. IMAGE LIGHTBOX MODAL (Phóng to ảnh cận cảnh)
// ══════════════════════════════════════════════════════════════

export function openLightboxModal(images = [], initialIndex = 0) {
  if (!images || images.length === 0) return;

  const validImages = Array.isArray(images) ? images : [images];
  let currentIndex = Math.max(0, Math.min(initialIndex, validImages.length - 1));

  const overlay = document.createElement('div');
  overlay.className = 'pd-lightbox-overlay';

  overlay.innerHTML = `
    <div class="pd-lightbox-container">
      <button type="button" class="pd-lightbox-close" aria-label="Đóng">✕</button>
      ${validImages.length > 1 ? `
        <button type="button" class="pd-lightbox-nav pd-lightbox-nav--prev" aria-label="Ảnh trước">‹</button>
        <button type="button" class="pd-lightbox-nav pd-lightbox-nav--next" aria-label="Ảnh tiếp theo">›</button>
      ` : ''}
      <img src="${validImages[currentIndex]}" alt="Phóng to ảnh trang sức" class="pd-lightbox-img">
      ${validImages.length > 1 ? `
        <div class="pd-lightbox-counter">${currentIndex + 1} / ${validImages.length}</div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });

  const imgEl = overlay.querySelector('.pd-lightbox-img');
  const counterEl = overlay.querySelector('.pd-lightbox-counter');

  const updateImage = () => {
    imgEl.src = validImages[currentIndex];
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${validImages.length}`;
  };

  const next = () => {
    currentIndex = (currentIndex + 1) % validImages.length;
    updateImage();
  };

  const prev = () => {
    currentIndex = (currentIndex - 1 + validImages.length) % validImages.length;
    updateImage();
  };

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => {
      overlay.remove();
      document.removeEventListener('keydown', handleKey);
    }, 250);
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') close();
    if (validImages.length > 1) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
  };

  document.addEventListener('keydown', handleKey);

  overlay.querySelector('.pd-lightbox-close').addEventListener('click', close);

  const prevBtn = overlay.querySelector('.pd-lightbox-nav--prev');
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

  const nextBtn = overlay.querySelector('.pd-lightbox-nav--next');
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('pd-lightbox-container')) close();
  });
}

// ══════════════════════════════════════════════════════════════
// 5. QUICK CALLBACK REQUEST MODAL (Hỗ trợ 1 SP hoặc trọn bộ Wishlist + Thiệp quà tặng)
// ══════════════════════════════════════════════════════════════

export function openQuickCallbackModal(product, options = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';

  const isMulti = Array.isArray(options.productsList) && options.productsList.length > 0;
  const listItems = isMulti ? options.productsList : (product ? [product] : []);
  const firstProd = listItems[0] || product;
  const defaultImg = (firstProd && firstProd.images && firstProd.images[0]) || './images/products/Daychuyen4.3-removebg-preview.png';
  const totalAmount = listItems.reduce((sum, p) => sum + (Number(p?.price) || 0), 0);
  const priceDisplay = totalAmount > 0 ? `${totalAmount.toLocaleString('vi-VN')} ₫` : '';
  const initialGiftNote = options.giftCardNote || '';

  const previewTitle = isMulti
    ? `Tư vấn bộ ${listItems.length} mẫu trang sức yêu thích`
    : (firstProd?.name || 'Trang sức Phát Đạt');
  const previewSub = isMulti
    ? `Tổng tham khảo: ${priceDisplay} (${listItems.map(p => p.reference).join(', ')})`
    : `${priceDisplay} <span style="color: var(--color-text-secondary); font-weight: normal; margin-left: 6px;">Mã: ${firstProd?.reference || ''}</span>`;

  overlay.innerHTML = `
    <div class="pd-callback-card" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>Yêu Cầu Gọi Lại Tư Vấn</h3>
          <div style="font-size: 12px; opacity: 0.85; margin-top: 2px;">Phát Đạt Jewelry sẽ liên hệ lại trong vòng 15 phút</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div class="pd-callback-product-preview">
        <img src="${defaultImg}" alt="${previewTitle}">
        <div>
          <div style="font-weight: 600; font-size: 13px; color: var(--color-text-primary);">${previewTitle}</div>
          <div style="font-size: 12px; color: var(--color-brand-primary); font-weight: 600; margin-top: 2px;">
            ${previewSub}
          </div>
        </div>
      </div>

      <form id="pd-callback-form">
        <div class="pd-callback-body">
          <div class="pd-callback-group">
            <label for="cb-phone">Số điện thoại của bạn *</label>
            <input type="tel" id="cb-phone" class="pd-callback-input" required placeholder="VD: 0912 345 678" pattern="[0-9\\s]{9,13}" autofocus>
          </div>

          <div class="pd-callback-group">
            <label for="cb-name">Họ và tên của bạn</label>
            <input type="text" id="cb-name" class="pd-callback-input" placeholder="VD: Thu Hà">
          </div>

          <div class="pd-callback-group">
            <label for="cb-note">Ghi chú tư vấn (Size tay, màu xi mạ...)</label>
            <input type="text" id="cb-note" class="pd-callback-input" value="${options.selectedInfo || ''}" placeholder="VD: Cần tư vấn size tay, hoặc giao hàng gấp...">
          </div>

          <div class="pd-callback-group" style="background: #FAF6EE; border: 1px dashed var(--color-accent-gold); border-radius: 6px; padding: 10px 12px; margin-bottom: 4px;">
            <label for="cb-gift-card" style="color: #8A6218; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span>🎁 Viết thiệp quà tặng miễn phí (Tùy chọn)</span>
            </label>
            <input type="text" id="cb-gift-card" class="pd-callback-input" style="background: #fff; font-size: 13px; padding: 8px 10px;" value="${initialGiftNote}" placeholder="Nhập lời chúc để tiệm viết thiệp tay kèm hộp nhung...">
          </div>
        </div>

        <div class="pd-callback-footer">
          <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="cb-cancel-btn">Hủy bỏ</button>
          <button type="submit" class="pd-dialog-btn pd-dialog-btn--primary" id="cb-submit-btn">Gửi Yêu Cầu Tư Vấn</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
    const phoneInput = overlay.querySelector('#cb-phone');
    if (phoneInput) phoneInput.focus();
  });

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#cb-cancel-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('#pd-callback-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = overlay.querySelector('#cb-phone').value.trim();
    const name = overlay.querySelector('#cb-name').value.trim();
    const note = overlay.querySelector('#cb-note').value.trim();
    const giftCard = overlay.querySelector('#cb-gift-card').value.trim();
    const submitBtn = overlay.querySelector('#cb-submit-btn');

    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;

    listItems.forEach(p => {
      if (p?.id) trackProductEvent(p.id, 'callback');
    });

    const subjectText = isMulti
      ? `Tư vấn trọn bộ Wishlist (${listItems.length} mẫu)`
      : `Tư vấn SP: ${firstProd?.name || ''} (${firstProd?.reference || ''})`;

    const itemsSummary = isMulti
      ? listItems.map(p => `${p.name} (${p.reference} - ${formatPrice(p.price)})`).join('; ')
      : `${firstProd?.name || ''} - Giá: ${priceDisplay}`;

    const giftSummary = giftCard ? ` | 🎁 Lời chúc thiệp quà tặng: "${giftCard}"` : '';

    try {
      await addCustomerContact({
        fullName: name || 'Khách hàng quan tâm ' + (firstProd?.name || 'trang sức'),
        phone: phone,
        subject: subjectText,
        message: `Khách yêu cầu gọi lại tư vấn: ${itemsSummary}. Ghi chú: ${note || 'Không có'}${giftSummary}`
      });

      close();
      showToast(
        `Đã gửi yêu cầu tư vấn thành công! Nhân viên Phát Đạt sẽ liên hệ lại qua số ${phone} sớm nhất.`,
        'success',
        4500
      );
    } catch (err) {
      submitBtn.textContent = 'Gửi Yêu Cầu Tư Vấn';
      submitBtn.disabled = false;
      showToast('Có lỗi xảy ra, vui lòng thử lại sau hoặc gọi hotline.', 'error');
    }
  });
}

// ══════════════════════════════════════════════════════════════
// 6. SOCIAL SHARE & QR CODE SHOWROOM TAG MODAL
// ══════════════════════════════════════════════════════════════

export async function shareProductLink(product) {
  const shareUrl = `${window.location.origin}${window.location.pathname}#/product/${product.id}`;
  const shareTitle = `${product.name} | Phát Đạt Jewelry`;
  const shareText = `✨ Xem mẫu trang sức Bạc 925 "${product.name}" (Mã: ${product.reference}) - Giá: ${formatPrice(product.price)} tại Phát Đạt Jewelry:`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      showToast('Cảm ơn bạn đã chia sẻ sản phẩm!', 'success', 2500);
      return;
    } catch (err) {
      // User cancelled or fallback to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    showToast('Đã sao chép link & thông tin sản phẩm! Bạn có thể dán gửi cho bạn bè qua Zalo/Messenger.', 'success', 3800);
  } catch (e) {
    showToast('Link sản phẩm: ' + shareUrl, 'info', 4000);
  }
}

export function openQrTagModal(product) {
  if (!product) return;
  const prodUrl = `${window.location.origin}${window.location.pathname}#/product/${product.id}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=143F3B&data=${encodeURIComponent(prodUrl)}`;

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 400px; text-align: center;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>Thẻ Giá & Mã QR Showroom</h3>
          <div style="font-size: 12px; opacity: 0.85;">Quét mã để xem chi tiết & bảo hành trên điện thoại</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 24px;" id="qr-printable-area">
        <div style="border: 2px solid var(--color-brand-primary); border-radius: 10px; padding: 20px 16px; background: #fff; position: relative;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.14em; color: var(--color-accent-gold); text-transform: uppercase; margin-bottom: 4px;">
            PHÁT ĐẠT JEWELRY · BẠC 925
          </div>
          <div style="font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">
            ${product.name}
          </div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 12px;">
            Mã SP: <strong>${product.reference}</strong> · ${product.materials}
          </div>

          <div style="display: inline-block; padding: 10px; border: 1px solid var(--color-border-light); border-radius: 8px; background: #fff; margin-bottom: 12px;">
            <img src="${qrApiUrl}" alt="QR ${product.reference}" style="width: 170px; height: 170px; display: block; margin: 0 auto;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display:none; width:170px; height:170px; align-items:center; justify-content:center; flex-direction:column; background:#f8faf9; color:var(--color-brand-primary); font-size:12px; padding:12px;">
              <strong>MÃ: ${product.reference}</strong>
              <span style="margin-top:6px; word-break:break-all; font-size:10px;">${prodUrl}</span>
            </div>
          </div>

          <div style="font-size: 22px; font-weight: 700; color: var(--color-brand-primary); margin-top: 4px;">
            ${formatPrice(product.price)}
          </div>
          <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
            Bảo hành làm sáng miễn phí trọn đời · Hotline: ${siteInfo.phoneDisplay}
          </div>
        </div>
      </div>

      <div class="pd-callback-footer" style="justify-content: center;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="qr-copy-btn">🔗 Copy Link SP</button>
        <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="qr-print-btn">🖨️ In Thẻ QR</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  overlay.querySelector('#qr-copy-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(prodUrl);
      showToast('Đã sao chép đường dẫn sản phẩm!', 'success');
    } catch (e) {}
  });

  overlay.querySelector('#qr-print-btn').addEventListener('click', () => {
    const content = overlay.querySelector('#qr-printable-area').innerHTML;
    const win = window.open('', '_blank', 'width=480,height=620');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Thẻ QR - ${product.reference} - ${product.name}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 24px; color: #1A2423; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${content}
            <script>setTimeout(() => { window.print(); }, 500);</script>
          </body>
        </html>
      `);
      win.document.close();
    }
  });
}

// ══════════════════════════════════════════════════════════════
// 7. SIDE-BY-SIDE PRODUCT COMPARISON MODAL & FLOATING BAR
// ══════════════════════════════════════════════════════════════

export function openCompareModal() {
  const ids = getCompareProductIds();
  const items = ids.map(id => getProductById(id)).filter(Boolean);

  if (items.length === 0) {
    showToast('Chưa có sản phẩm nào trong danh sách so sánh!', 'info');
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 900px; width: 100%; max-height: 90vh; display: flex; flex-direction: column;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>So Sánh Chi Tiết Trang Sức (${items.length}/3)</h3>
          <div style="font-size: 12px; opacity: 0.85;">Đối chiếu chất liệu, đá đính kèm, kích thước và mức giá</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 20px; overflow-x: auto; overflow-y: auto; flex: 1;">
        <table style="width: 100%; border-collapse: collapse; min-width: 540px; font-size: 13px; text-align: center;">
          <thead>
            <tr>
              <th style="width: 130px; text-align: left; padding: 12px; border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary);">Tiêu chí</th>
              ${items.map(p => `
                <th style="padding: 12px; border-bottom: 1px solid var(--color-border); vertical-align: top; width: ${Math.floor(80 / items.length)}%;">
                  <div style="position: relative; display: inline-block;">
                    <img src="${p.images[0]}" alt="${p.name}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 6px; border: 1px solid var(--color-border-light); margin-bottom: 8px;">
                  </div>
                  <div style="font-weight: 700; color: var(--color-brand-primary); font-size: 14px; margin-bottom: 4px;">
                    <a href="#/product/${p.id}" class="compare-prod-link" style="color: inherit; text-decoration: none;">${p.name}</a>
                  </div>
                  <button type="button" class="remove-compare-item" data-id="${p.id}" style="background: none; border: none; color: #c0392b; font-size: 11px; cursor: pointer; text-decoration: underline;">Bỏ khỏi so sánh</button>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr style="background: #f9fbfb;">
              <td style="text-align: left; padding: 10px 12px; font-weight: 600;">Giá bán</td>
              ${items.map(p => `<td style="padding: 10px 12px; font-size: 16px; font-weight: 700; color: var(--color-brand-primary);">${formatPrice(p.price)}</td>`).join('')}
            </tr>
            <tr>
              <td style="text-align: left; padding: 10px 12px; font-weight: 600;">Mã SKU</td>
              ${items.map(p => `<td style="padding: 10px 12px; font-family: monospace;">${p.reference}</td>`).join('')}
            </tr>
            <tr style="background: #f9fbfb;">
              <td style="text-align: left; padding: 10px 12px; font-weight: 600;">Bộ sưu tập</td>
              ${items.map(p => `<td style="padding: 10px 12px;">${p.collection}</td>`).join('')}
            </tr>
            <tr>
              <td style="text-align: left; padding: 10px 12px; font-weight: 600;">Chất liệu</td>
              ${items.map(p => `<td style="padding: 10px 12px;">${p.materials}</td>`).join('')}
            </tr>
            <tr style="background: #f9fbfb;">
              <td style="text-align: left; padding: 10px 12px; font-weight: 600;">Đá đính kèm</td>
              ${items.map(p => `<td style="padding: 10px 12px;">${p.stones || 'Bạc trơn bóng'}</td>`).join('')}
            </tr>
            <tr>
              <td style="text-align: left; padding: 10px 12px; font-weight: 600;">Kích cỡ hỗ trợ</td>
              ${items.map(p => `<td style="padding: 10px 12px;">${(p.availableSizes || ['Freesize']).join(', ')}</td>`).join('')}
            </tr>
            <tr style="background: #f9fbfb;">
              <td style="text-align: left; padding: 10px 12px; font-weight: 600;">Đánh giá</td>
              ${items.map(p => `<td style="padding: 10px 12px; color: #f39c12; font-weight: 600;">★ ${p.rating || 4.9} (${p.reviewsCount || 20} nhận xét)</td>`).join('')}
            </tr>
            <tr>
              <td style="text-align: left; padding: 12px; font-weight: 600;">Tư vấn mẫu này</td>
              ${items.map(p => `
                <td style="padding: 12px;">
                  <div style="display: flex; flex-direction: column; gap: 6px; align-items: center;">
                    <button type="button" class="pd-dialog-btn pd-dialog-btn--primary compare-callback-btn" data-id="${p.id}" style="width: 100%; max-width: 160px; padding: 8px 10px; font-size: 12px;">
                      📞 Yêu cầu gọi lại
                    </button>
                    <a href="#/product/${p.id}" class="compare-prod-link" style="font-size: 12px; color: var(--color-brand-primary); font-weight: 600; text-decoration: underline;">Xem chi tiết →</a>
                  </div>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="compare-clear-all">Xóa tất cả</button>
        <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="compare-close-btn">Đóng bảng so sánh</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#compare-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  overlay.querySelectorAll('.compare-prod-link').forEach(a => {
    a.addEventListener('click', close);
  });

  overlay.querySelector('#compare-clear-all').addEventListener('click', () => {
    clearCompareList();
    close();
    showToast('Đã xóa danh sách so sánh!', 'info');
  });

  overlay.querySelectorAll('.remove-compare-item').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleCompareProduct(btn.dataset.id);
      close();
      if (getCompareProductIds().length > 0) {
        openCompareModal();
      }
    });
  });

  overlay.querySelectorAll('.compare-callback-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prod = getProductById(btn.dataset.id);
      close();
      if (prod) openQuickCallbackModal(prod);
    });
  });
}

export function initCompareFloatingBar() {
  let bar = document.getElementById('pd-compare-floating-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'pd-compare-floating-bar';
    bar.className = 'pd-compare-bar';
    document.body.appendChild(bar);
  }

  function renderBar() {
    // Hide on admin pages
    if (window.location.hash.startsWith('#/admin')) {
      bar.style.display = 'none';
      return;
    }

    const ids = getCompareProductIds();
    const items = ids.map(id => getProductById(id)).filter(Boolean);
    if (items.length === 0) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';
    bar.innerHTML = `
      <div class="pd-compare-bar__items">
        ${items.map(p => `
          <div class="pd-compare-bar__thumb" title="${p.name}">
            <img src="${p.images[0]}" alt="${p.name}">
            <button type="button" class="pd-compare-bar__remove" data-id="${p.id}" aria-label="Xóa">✕</button>
          </div>
        `).join('')}
        <span class="pd-compare-bar__label">So sánh (${items.length}/3 mẫu)</span>
      </div>
      <div class="pd-compare-bar__actions">
        <button type="button" class="pd-compare-bar__clear" id="bar-clear-compare">Xóa</button>
        <button type="button" class="pd-compare-bar__open" id="bar-open-compare">⚖️ So sánh ngay</button>
      </div>
    `;

    bar.querySelectorAll('.pd-compare-bar__remove').forEach(btn => {
      btn.addEventListener('click', () => toggleCompareProduct(btn.dataset.id));
    });
    bar.querySelector('#bar-clear-compare').addEventListener('click', () => clearCompareList());
    bar.querySelector('#bar-open-compare').addEventListener('click', () => openCompareModal());
  }

  window.addEventListener('compare-updated', renderBar);
  window.addEventListener('hashchange', renderBar);
  renderBar();
}

// ══════════════════════════════════════════════════════════════
// 8. GIFT FINDER QUIZ MODAL (Trình Chọn Quà Tặng 3 Bước)
// ══════════════════════════════════════════════════════════════

export function openGiftFinderModal() {
  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';

  let state = {
    recipient: 'Người thương / Bạn gái',
    style: 'all',
    budget: 'all'
  };

  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 620px; width: 100%; max-height: 92vh; overflow-y: auto;" role="dialog" aria-modal="true">
      <div class="pd-callback-header" style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%);">
        <div>
          <h3>🎁 Trợ Lý Chọn Quà Tặng Trang Sức</h3>
          <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">Tìm món trang sức Bạc 925 ý nghĩa nhất chỉ trong 30 giây</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 20px 24px;" id="gift-quiz-body">
        <!-- Step 1 -->
        <div style="margin-bottom: 18px;">
          <label style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); display: block; margin-bottom: 8px;">
            1. Bạn đang tìm quà tặng cho ai?
          </label>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;" id="quiz-recipient-group">
            <button type="button" class="gift-quiz-pill is-selected" data-val="Người thương / Bạn gái">💖 Người thương / Bạn gái</button>
            <button type="button" class="gift-quiz-pill" data-val="Mẹ / Chị gái">🌸 Mẹ / Chị gái kính yêu</button>
            <button type="button" class="gift-quiz-pill" data-val="Bạn thân">✨ Bạn thân kỷ niệm</button>
            <button type="button" class="gift-quiz-pill" data-val="Tự thưởng bản thân">👑 Tự thưởng bản thân</button>
          </div>
        </div>

        <!-- Step 2 -->
        <div style="margin-bottom: 18px;">
          <label style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); display: block; margin-bottom: 8px;">
            2. Phong cách trang sức người nhận yêu thích?
          </label>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;" id="quiz-style-group">
            <button type="button" class="gift-quiz-pill is-selected" data-val="all">🌟 Tất cả phong cách nổi bật</button>
            <button type="button" class="gift-quiz-pill" data-val="Cỏ Ba Lá">🍀 Cỏ Ba Lá may mắn</button>
            <button type="button" class="gift-quiz-pill" data-val="Ánh Sao">💎 Đá Moissanite lấp lánh</button>
            <button type="button" class="gift-quiz-pill" data-val="Hoa Xinh">🌷 Hoa Xinh & Ngọc trai</button>
          </div>
        </div>

        <!-- Step 3 -->
        <div style="margin-bottom: 20px;">
          <label style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); display: block; margin-bottom: 8px;">
            3. Ngân sách quà tặng dự kiến?
          </label>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;" id="quiz-budget-group">
            <button type="button" class="gift-quiz-pill is-selected" data-val="all">Mọi mức giá</button>
            <button type="button" class="gift-quiz-pill" data-val="under200">Dưới 200.000₫</button>
            <button type="button" class="gift-quiz-pill" data-val="over200">200.000₫ – 400.000₫</button>
          </div>
        </div>

        <!-- Recommendations Result -->
        <div style="border-top: 1px solid var(--color-border); padding-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 14px; font-weight: 700; color: var(--color-brand-primary);" id="quiz-result-heading">Gợi ý hoàn hảo nhất:</span>
            <span style="font-size: 11px; color: #8A6218; background: #FAF4E8; padding: 3px 8px; border-radius: 12px; font-weight: 600;">🎁 Tặng kèm hộp nhung & thiệp viết tay</span>
          </div>
          <div id="quiz-recommendations-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;"></div>
        </div>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="quiz-close-btn">Đóng</button>
        <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="quiz-consult-btn">💬 Nhắn Zalo Tư Vấn Chọn Quà</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#quiz-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  function updateRecommendations() {
    let matched = [...products];
    if (state.style !== 'all') {
      matched = matched.filter(p => p.collection === state.style);
    }
    if (state.budget === 'under200') {
      matched = matched.filter(p => p.price <= 200000);
    } else if (state.budget === 'over200') {
      matched = matched.filter(p => p.price > 200000);
    }
    if (matched.length === 0) matched = products.slice(0, 4);

    const top4 = matched.slice(0, 4);
    const grid = overlay.querySelector('#quiz-recommendations-grid');
    overlay.querySelector('#quiz-result-heading').textContent = `Gợi ý quà tặng cho ${state.recipient} (${matched.length} mẫu):`;

    grid.innerHTML = top4.map((p, idx) => `
      <div style="border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; display: flex; gap: 10px; align-items: center; background: #fff;">
        <img src="${p.images[0]}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
        <div style="overflow: hidden; flex: 1;">
          <div style="font-size: 10px; color: var(--color-brand-primary); font-weight: 700;">★ ${99 - idx}% Phù hợp</div>
          <a href="#/product/${p.id}" class="quiz-prod-link" style="font-size: 13px; font-weight: 600; color: var(--color-text-primary); text-decoration: none; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</a>
          <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-top: 2px;">${formatPrice(p.price)}</div>
          <button type="button" class="quiz-pick-callback" data-id="${p.id}" style="margin-top: 4px; background: var(--color-brand-light); color: var(--color-brand-primary); border: none; border-radius: 4px; padding: 3px 8px; font-size: 11px; font-weight: 600; cursor: pointer;">Đặt kèm thiệp →</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.quiz-prod-link').forEach(a => a.addEventListener('click', close));
    grid.querySelectorAll('.quiz-pick-callback').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = getProductById(btn.dataset.id);
        close();
        if (prod) {
          openQuickCallbackModal(prod, {
            giftCardNote: `Quà tặng ${state.recipient} - Nhờ shop gói hộp quà và kèm thiệp viết tay.`
          });
        }
      });
    });
  }

  function setupPillGroup(groupId, stateKey) {
    const container = overlay.querySelector(groupId);
    container.querySelectorAll('.gift-quiz-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.gift-quiz-pill').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        state[stateKey] = btn.dataset.val;
        updateRecommendations();
      });
    });
  }

  setupPillGroup('#quiz-recipient-group', 'recipient');
  setupPillGroup('#quiz-style-group', 'style');
  setupPillGroup('#quiz-budget-group', 'budget');
  updateRecommendations();

  overlay.querySelector('#quiz-consult-btn').addEventListener('click', () => {
    const msg = `[Phát Đạt Jewelry] Nhờ shop tư vấn chọn quà tặng:\n- Người nhận: ${state.recipient}\n- Phong cách: ${state.style === 'all' ? 'Tất cả' : state.style}\n- Ngân sách: ${state.budget === 'under200' ? 'Dưới 200k' : state.budget === 'over200' ? '200k - 400k' : 'Linh hoạt'}`;
    try {
      navigator.clipboard.writeText(msg);
      showToast('Đã sao chép tiêu chí quà tặng! Đang mở Zalo tư vấn...', 'success', 3500);
    } catch (e) {}
    setTimeout(() => {
      window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
    }, 500);
  });
}

// ══════════════════════════════════════════════════════════════
// 9. PRODUCT QUICK VIEW MODAL (XEM NHANH TRÊN THẺ SẢN PHẨM)
// ══════════════════════════════════════════════════════════════

export function openQuickViewModal(product) {
  if (!product) return;
  trackProductEvent(product.id, 'view');

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['./images/products/Daychuyen4.3-removebg-preview.png'];
  const sizes = Array.isArray(product.availableSizes) && product.availableSizes.length > 0
    ? product.availableSizes
    : ['Freesize'];
  const colors = Array.isArray(product.availableColors) && product.availableColors.length > 0
    ? product.availableColors
    : ['Bạc sáng 925'];

  let selectedSize = sizes[0];
  let selectedColor = colors[0];

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 760px; width: 100%; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>👁️ Xem Nhanh Sản Phẩm</h3>
          <div style="font-size: 12px; opacity: 0.85;">Bộ sưu tập ${product.collection} · Mã: ${product.reference}</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 22px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; align-items: start;">
        <!-- Left: Image Preview & Thumbnails -->
        <div>
          <div style="background: #FBF9F5; border: 1px solid var(--color-border-light); border-radius: 10px; overflow: hidden; height: 280px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <img id="qv-main-img" src="${images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain; transition: opacity 0.2s ease;" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
          </div>
          ${images.length > 1 ? `
            <div style="display: flex; gap: 8px; justify-content: center;">
              ${images.map((img, i) => `
                <button type="button" class="qv-thumb-btn" data-src="${img}" style="width: 54px; height: 54px; border-radius: 6px; overflow: hidden; border: 2px solid ${i === 0 ? 'var(--color-brand-primary)' : 'var(--color-border)'}; padding: 0; background: #fff; cursor: pointer;">
                  <img src="${img}" alt="Thumb ${i + 1}" style="width: 100%; height: 100%; object-fit: cover;">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Right: Product Info & Quick Variant Selection -->
        <div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 6px;">
            <span style="color: #f39c12;">★★★★★</span>
            <strong>${product.rating || 4.9}</strong>
            <span style="color: var(--color-text-secondary);">(${product.reviewsCount || 20} đánh giá)</span>
            <span style="background: var(--color-brand-light); color: var(--color-brand-primary); padding: 2px 8px; border-radius: 12px; font-weight: 600; font-size: 11px;">Còn hàng</span>
          </div>

          <h2 style="font-family: var(--font-display); font-size: 21px; color: var(--color-brand-primary); margin: 0 0 8px;">${product.name}</h2>

          <div style="font-size: 23px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 12px;">
            ${formatPrice(product.price)}
            <span style="font-size: 12px; font-weight: 400; color: var(--color-text-secondary);"> (Tặng hộp quà & khăn lau bạc)</span>
          </div>

          <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.55; margin: 0 0 14px;">
            ${product.description}
          </p>

          <div style="background: #F8FAF9; border-radius: 8px; padding: 10px 12px; font-size: 12.5px; margin-bottom: 14px; display: grid; gap: 4px;">
            <div>• <strong>Chất liệu:</strong> ${product.materials}</div>
            ${product.stones ? `<div>• <strong>Đá đính kèm:</strong> ${product.stones}</div>` : ''}
            <div>• <strong>Bảo hành:</strong> Đánh bóng & làm sáng miễn phí trọn đời</div>
          </div>

          <!-- Size Selector -->
          <div style="margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">KÍCH CỠ / CHIỀU DÀI:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;" id="qv-size-group">
              ${sizes.map((s, idx) => `
                <button type="button" class="gift-quiz-pill ${idx === 0 ? 'is-selected' : ''}" data-val="${s}" style="padding: 5px 10px; font-size: 12px;">${s}</button>
              `).join('')}
            </div>
          </div>

          <!-- Color Selector -->
          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">MÀU XI MẠ:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;" id="qv-color-group">
              ${colors.map((c, idx) => `
                <button type="button" class="gift-quiz-pill ${idx === 0 ? 'is-selected' : ''}" data-val="${c}" style="padding: 5px 10px; font-size: 12px;">${c}</button>
              `).join('')}
            </div>
          </div>

          <!-- Actions -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <button type="button" id="qv-zalo-btn" style="background: #0068FF; color: #fff; border: none; border-radius: 6px; padding: 11px 12px; font-size: 12.5px; font-weight: 700; cursor: pointer;">
              💬 Tư Vấn Zalo Ngay
            </button>
            <button type="button" id="qv-callback-btn" style="background: var(--color-accent-gold); color: #143F3B; border: none; border-radius: 6px; padding: 11px 12px; font-size: 12.5px; font-weight: 700; cursor: pointer;">
              📞 Yêu Cầu Gọi Lại
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            <button type="button" id="qv-vto-btn" style="background: #F4F9F8; color: var(--color-brand-primary); border: 1px solid #C5DEDB; border-radius: 6px; padding: 8px 10px; font-size: 12px; font-weight: 700; cursor: pointer;">
              📹 Ướm Thử Camera
            </button>
            <button type="button" id="qv-dgc-btn" style="background: #FAF6EE; color: #8A6218; border: 1px solid var(--color-accent-gold); border-radius: 6px; padding: 8px 10px; font-size: 12px; font-weight: 700; cursor: pointer;">
              🖼️ Tạo Thiệp Ảnh (.PNG)
            </button>
          </div>

          <a href="#/product/${product.id}" id="qv-full-link" style="display: block; text-align: center; font-size: 13px; font-weight: 600; color: var(--color-brand-primary); text-decoration: underline; padding: 4px 0;">
            Xem chi tiết đầy đủ, thông số & đánh giá →
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('#qv-full-link').addEventListener('click', close);
  overlay.querySelector('#qv-vto-btn').addEventListener('click', () => {
    close();
    openVirtualTryOnModal(product);
  });
  overlay.querySelector('#qv-dgc-btn').addEventListener('click', () => {
    close();
    openDigitalGiftCardModal(product);
  });

  // Thumbnail switcher
  const mainImg = overlay.querySelector('#qv-main-img');
  overlay.querySelectorAll('.qv-thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      mainImg.src = btn.dataset.src;
      overlay.querySelectorAll('.qv-thumb-btn').forEach(b => {
        b.style.borderColor = b === btn ? 'var(--color-brand-primary)' : 'var(--color-border)';
      });
    });
  });

  // Pill selectors
  overlay.querySelectorAll('#qv-size-group .gift-quiz-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#qv-size-group .gift-quiz-pill').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedSize = btn.dataset.val;
    });
  });
  overlay.querySelectorAll('#qv-color-group .gift-quiz-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#qv-color-group .gift-quiz-pill').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedColor = btn.dataset.val;
    });
  });

  // Zalo button
  overlay.querySelector('#qv-zalo-btn').addEventListener('click', () => {
    trackProductEvent(product.id, 'zalo');
    const prodUrl = `${window.location.origin}${window.location.pathname}#/product/${product.id}`;
    const text = `[Phát Đạt Jewelry] Tôi muốn tư vấn mẫu:\n- Tên SP: ${product.name} (${product.reference})\n- Giá: ${formatPrice(product.price)}\n- Phiên bản: ${selectedSize} | ${selectedColor}\n- Link: ${prodUrl}`;
    try {
      navigator.clipboard.writeText(text);
      showToast('Đã sao chép thông tin sản phẩm! Đang mở Zalo...', 'success', 3000);
    } catch (e) {}
    setTimeout(() => {
      window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
    }, 400);
  });

  // Callback button
  overlay.querySelector('#qv-callback-btn').addEventListener('click', () => {
    close();
    openQuickCallbackModal(product, { size: selectedSize, color: selectedColor });
  });
}

// ══════════════════════════════════════════════════════════════
// 10. FENG SHUI & BIRTHSTONE MATCHER MODAL (CHỌN ĐÁ HỢP MỆNH & THÁNG SINH)
// ══════════════════════════════════════════════════════════════

const FENG_SHUI_ELEMENTS = [
  {
    key: 'kim',
    name: 'Mệnh Kim',
    icon: '🪙',
    colors: 'Trắng ánh kim, Vàng kim, Xà cừ trắng, Đá Moissanite trắng',
    meaning: 'Tương hợp sắc trắng tinh khiết của Bạc S925, đá Moissanite và mặt xà cừ trắng giúp thu hút tài lộc, may mắn và sự minh mẫn.',
    matchFilter: (p) => p.materials.includes('Bạc') || (p.stones && (p.stones.includes('Moissanite') || p.stones.includes('Xà cừ') || p.stones.includes('CZ')))
  },
  {
    key: 'moc',
    name: 'Mệnh Mộc',
    icon: '🍀',
    colors: 'Xanh ngọc lục bảo, Đá đen huyền bí, Hoạ tiết Cỏ Ba Lá & Hoa lá',
    meaning: 'Biểu trưng cho sức sống sinh sôi. Các thiết kế Cỏ Ba Lá may mắn, đá tối màu hoặc ánh xanh giúp cân bằng năng lượng và bình an.',
    matchFilter: (p) => p.collection === 'Cỏ Ba Lá' || p.collection === 'Hoa Xinh' || p.name.toLowerCase().includes('cỏ')
  },
  {
    key: 'thuy',
    name: 'Mệnh Thủy',
    icon: '💧',
    colors: 'Bạc trắng sáng, Ngọc trai nước ngọt, Đá Moissanite ánh sao, Đá đen',
    meaning: 'Kim sinh Thủy — đeo trang sức Bạc S925 nguyên bản, ngọc trai hoặc đá lấp lánh giúp công việc hanh thông, tình duyên thuận lợi.',
    matchFilter: (p) => p.collection === 'Hạt Ngọc' || p.collection === 'Ánh Sao' || (p.stones && p.stones.includes('Ngọc trai'))
  },
  {
    key: 'hoa',
    name: 'Mệnh Hỏa',
    icon: '🔥',
    colors: 'Vàng hồng, Xi vàng 18K ấm áp, Hoạ tiết Cỏ 4 Lá & Hoa mặt trời',
    meaning: 'Mộc sinh Hỏa — các mẫu trang sức hình Cỏ Ba Lá, Hoa Xinh hoặc phủ xi vàng 18K ấm áp tôn lên sự rạng rỡ, nhiệt huyết và quyến rũ.',
    matchFilter: (p) => p.collection === 'Hoa Xinh' || p.collection === 'Cỏ Ba Lá' || (p.materials && p.materials.includes('vàng'))
  },
  {
    key: 'tho',
    name: 'Mệnh Thổ',
    icon: '👑',
    colors: 'Vàng Hoàng Gia 18K, Đá Moissanite, Ngọc trai ánh kem ấm',
    meaning: 'Hỏa sinh Thổ — sắc vàng 18K sang trọng kết hợp đá quý lấp lánh mang lại sự vững chãi, thịnh vượng và quý nhân phù trợ.',
    matchFilter: (p) => (p.materials && p.materials.includes('vàng')) || p.collection === 'Ánh Sao'
  }
];

export function openFengShuiMatcherModal() {
  let selectedKey = 'kim';

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 680px; width: 100%; max-height: 92vh; display: flex; flex-direction: column;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>🔮 Cố Vấn Chọn Trang Sức Hợp Mệnh & Phong Thủy</h3>
          <div style="font-size: 12px; opacity: 0.85;">Khám phá màu đá, chất liệu Bạc 925 & biểu tượng may mắn hợp bản mệnh của bạn</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 20px; overflow-y: auto; flex: 1;">
        <label style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); display: block; margin-bottom: 10px;">
          Chọn Bản Mệnh Ngũ Hành (hoặc Mệnh người nhận quà):
        </label>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 18px;" id="fs-element-tabs">
          ${FENG_SHUI_ELEMENTS.map((el, idx) => `
            <button type="button" class="gift-quiz-pill ${idx === 0 ? 'is-selected' : ''}" data-key="${el.key}" style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; font-size: 12px;">
              <span style="font-size: 20px;">${el.icon}</span>
              <span>${el.name}</span>
            </button>
          `).join('')}
        </div>

        <div id="fs-advice-box" style="background: #FBF9F5; border: 1px solid #E5DEC9; border-radius: 10px; padding: 14px 16px; margin-bottom: 18px;"></div>

        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
          ✨ Các mẫu trang sức mang năng lượng may mắn phù hợp nhất:
        </div>
        <div id="fs-products-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;"></div>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="fs-close-btn">Đóng</button>
        <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="fs-zalo-btn">💬 Nhắn Zalo Tư Vấn Theo Năm Sinh</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#fs-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  function renderElementSelection() {
    const elObj = FENG_SHUI_ELEMENTS.find(e => e.key === selectedKey) || FENG_SHUI_ELEMENTS[0];
    overlay.querySelector('#fs-advice-box').innerHTML = `
      <div style="font-weight: 700; font-size: 14px; color: var(--color-brand-primary); margin-bottom: 4px;">
        ${elObj.icon} Lời khuyên Phong Thủy cho ${elObj.name}
      </div>
      <div style="font-size: 12.5px; color: #8A6218; font-weight: 600; margin-bottom: 6px;">
        • Màu sắc & Đá tương hợp: ${elObj.colors}
      </div>
      <div style="font-size: 12.5px; color: var(--color-text-secondary); line-height: 1.55;">
        ${elObj.meaning}
      </div>
    `;

    let matched = products.filter(elObj.matchFilter);
    if (matched.length < 4) matched = [...matched, ...products].slice(0, 4);
    else matched = matched.slice(0, 4);

    const grid = overlay.querySelector('#fs-products-grid');
    grid.innerHTML = matched.map(p => `
      <div style="border: 1px solid var(--color-border); border-radius: 8px; padding: 10px; display: flex; gap: 10px; align-items: center; background: #fff;">
        <img src="${p.images[0]}" alt="${p.name}" style="width: 58px; height: 58px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
        <div style="overflow: hidden; flex: 1;">
          <div style="font-size: 10px; color: var(--color-brand-primary); font-weight: 700;">🍀 Hợp ${elObj.name}</div>
          <a href="#/product/${p.id}" class="fs-prod-link" style="font-size: 13px; font-weight: 600; color: var(--color-text-primary); text-decoration: none; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</a>
          <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-top: 2px;">${formatPrice(p.price)}</div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.fs-prod-link').forEach(a => a.addEventListener('click', close));
  }

  overlay.querySelectorAll('#fs-element-tabs .gift-quiz-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#fs-element-tabs .gift-quiz-pill').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedKey = btn.dataset.key;
      renderElementSelection();
    });
  });

  overlay.querySelector('#fs-zalo-btn').addEventListener('click', () => {
    const elObj = FENG_SHUI_ELEMENTS.find(e => e.key === selectedKey) || FENG_SHUI_ELEMENTS[0];
    const msg = `[Phát Đạt Jewelry] Nhờ shop tư vấn mẫu trang sức Bạc 925 hợp ${elObj.name} (${elObj.colors}).`;
    try {
      navigator.clipboard.writeText(msg);
      showToast(`Đã sao chép yêu cầu tư vấn ${elObj.name}! Đang mở Zalo...`, 'success', 3000);
    } catch (e) {}
    setTimeout(() => {
      window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
    }, 450);
  });

  renderElementSelection();
}

// ══════════════════════════════════════════════════════════════
// 11. DIGITAL WARRANTY & PHONE LOOKUP MODAL (TRA CỨU BẢO HÀNH SĐT)
// ══════════════════════════════════════════════════════════════

export function openWarrantyLookupModal(initialPhone = '') {
  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 520px; width: 100%;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>🛡️ Tra Cứu Thẻ Bảo Hành & Lịch Hẹn</h3>
          <div style="font-size: 12px; opacity: 0.85;">Bảo hành đánh bóng & làm sáng Bạc S925 miễn phí trọn đời</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 22px;">
        <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 14px; line-height: 1.5;">
          Nhập số điện thoại bạn đã đăng ký tư vấn hoặc mua hàng tại Phát Đạt Jewelry để kiểm tra trạng thái Thẻ Bảo Hành Điện Tử:
        </p>
        <form id="warranty-lookup-form" style="display: flex; gap: 8px; margin-bottom: 18px;">
          <input type="tel" id="wl-phone-input" required placeholder="Nhập SĐT của bạn (VD: 0909123456)..." value="${initialPhone}" style="flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px;">
          <button type="submit" style="background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; padding: 0 18px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap;">
            🔍 Tra Cứu
          </button>
        </form>

        <div id="warranty-result-area">
          <div style="background: #F8FAF9; border: 1px dashed var(--color-border); border-radius: 8px; padding: 16px; text-align: center; font-size: 12.5px; color: var(--color-text-secondary);">
            💡 Mọi khách hàng của Phát Đạt Jewelry chỉ cần đọc Số Điện Thoại tại quầy (709 Trần Xuân Soạn, Q.7) đều được làm sáng trang sức bạc miễn phí trọn đời, không cần giữ hóa đơn giấy.
          </div>
        </div>
      </div>

      <div class="pd-callback-footer">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="wl-close-btn">Đóng</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#wl-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const form = overlay.querySelector('#warranty-lookup-form');
  const resultArea = overlay.querySelector('#warranty-result-area');

  function runLookup(phoneStr) {
    const clean = (phoneStr || '').replace(/[^0-9]/g, '');
    if (clean.length < 9 || clean.length > 11) {
      showToast('Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số)!', 'warning');
      return;
    }
    const cardCode = 'PD-VIP-' + clean.slice(-4);
    const todayStr = new Date().toLocaleDateString('vi-VN');

    resultArea.innerHTML = `
      <div style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%); color: #ffffff; border-radius: 12px; padding: 18px 20px; border: 1px solid var(--color-accent-gold); box-shadow: 0 8px 20px rgba(20,63,59,0.18);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 10.5px; letter-spacing: 0.14em; color: var(--color-accent-gold); font-weight: 700; text-transform: uppercase;">THẺ BẢO HÀNH ĐIỆN TỬ · PHÁT ĐẠT JEWELRY</span>
          <span style="background: rgba(46, 204, 113, 0.22); color: #68F7A6; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px;">● Đang Hiệu Lực</span>
        </div>
        <div style="font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 4px;">
          MÃ THẺ: ${cardCode}
        </div>
        <div style="font-size: 13px; opacity: 0.9; margin-bottom: 12px;">
          Số điện thoại đăng ký: <strong>${clean}</strong> · Tra cứu ngày: ${todayStr}
        </div>
        <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; font-size: 12px; line-height: 1.6;">
          <div>✓ <strong>Quyền lợi 1:</strong> Đánh bóng & siêu âm làm sáng Bạc S925 miễn phí trọn đời (Không giới hạn số lần).</div>
          <div>✓ <strong>Quyền lợi 2:</strong> Miễn phí gắn đá CZ tấm & chỉnh size nhẫn cơ bản trong 12 tháng.</div>
          <div>✓ <strong>Quyền lợi 3:</strong> Ưu đãi giảm 10% phí xi mạ lại Vàng 18K / Bạch kim.</div>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <a href="#/stores" id="wl-book-store" style="color: var(--color-accent-gold); font-size: 12px; font-weight: 700; text-decoration: underline;">📅 Đặt lịch mang bạc ghé đánh bóng →</a>
          <a href="${siteInfo.zalo}" target="_blank" rel="noopener" style="color: #ffffff; font-size: 12px; text-decoration: underline;">💬 Hỗ trợ Zalo</a>
        </div>
      </div>
    `;
    const bookLink = resultArea.querySelector('#wl-book-store');
    if (bookLink) bookLink.addEventListener('click', close);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runLookup(overlay.querySelector('#wl-phone-input').value);
  });

  if (initialPhone) {
    runLookup(initialPhone);
  }
}

// ══════════════════════════════════════════════════════════════
// 12. VIRTUAL TRY-ON STUDIO (WEBRTC CAMERA + PHOTO + SILHOUETTE)
// ══════════════════════════════════════════════════════════════

export function openVirtualTryOnModal(product) {
  if (!product) return;

  let activeStream = null;
  let isMirrored = true;
  let jScale = 1.0;
  let jRotate = 0;
  let posX = 50; // percentage
  let posY = 58; // percentage
  let currentMode = 'silhouette'; // 'camera' | 'photo' | 'silhouette'
  let uploadedDataUrl = '';

  const imgSrc = (product.images && product.images[0]) || './images/products/Daychuyen4.3-removebg-preview.png';
  const catLabel = product.category === 'rings' ? 'Ngón tay / Bàn tay'
    : (product.category === 'earrings' ? 'Khuôn mặt / Vành tai'
    : (product.category === 'bracelets' ? 'Cổ tay' : 'Cổ & Xương quai xanh'));

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 720px; width: 100%; max-height: 92vh; display: flex; flex-direction: column;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>📷 Phòng Ướm Thử Trang Sức Ảo (Virtual Try-On)</h3>
          <div style="font-size: 12px; opacity: 0.88;">Ướm thử mẫu "${product.name}" bằng Camera thật, ảnh cá nhân hoặc ma-nơ-canh</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 18px 20px; overflow-y: auto; flex: 1;">
        <!-- Mode Switcher Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" id="vto-mode-camera" style="padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer;">
              📹 Bật Camera Thật
            </button>
            <button type="button" id="vto-mode-upload" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">
              📁 Tải Ảnh Của Bạn
            </button>
            <input type="file" id="vto-file-input" accept="image/*" style="display: none;">
            <button type="button" id="vto-mode-silhouette" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #FAF8F4; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">
              👤 Nền Mẫu (${catLabel})
            </button>
          </div>
          <button type="button" id="vto-mirror-btn" style="padding: 6px 10px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; font-size: 12px; cursor: pointer;" title="Lật gương Camera">
            ↔ Lật gương
          </button>
        </div>

        <!-- Try-On Interactive Stage -->
        <div id="vto-stage" style="
          position: relative; width: 100%; height: 370px; border-radius: 12px; overflow: hidden;
          background: radial-gradient(circle at 50% 35%, #F7DFC6 0%, #DFB995 65%, #C49870 100%);
          border: 1px solid var(--color-border); user-select: none; touch-action: none;
          display: flex; align-items: center; justify-content: center;
        ">
          <!-- Live WebRTC Video -->
          <video id="vto-video" autoplay playsinline muted style="display: none; width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);"></video>

          <!-- Uploaded Photo Backdrop -->
          <img id="vto-uploaded-img" alt="Ảnh ướm thử" style="display: none; width: 100%; height: 100%; object-fit: cover;">

          <!-- Default Stylized Neckline / Hand Silhouette SVG -->
          <div id="vto-silhouette-art" style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
            <svg viewBox="0 0 400 360" width="100%" height="100%" style="max-width: 440px; opacity: 0.85;">
              <defs>
                <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#FCECE3"/>
                  <stop offset="50%" stop-color="#F1CFB6"/>
                  <stop offset="100%" stop-color="#DDA982"/>
                </linearGradient>
              </defs>
              <!-- Stylized graceful neck & collarbone silhouette -->
              <path d="M145,20 C148,85 135,130 70,165 C30,185 15,230 15,350 L385,350 C385,230 370,185 330,165 C265,130 252,85 255,20 Z" fill="url(#skinGrad)" stroke="rgba(160,110,75,0.35)" stroke-width="2"/>
              <path d="M120,175 Q200,210 280,175" fill="none" stroke="rgba(160,110,75,0.4)" stroke-width="2" stroke-dasharray="4 4"/>
              <path d="M165,190 Q200,275 235,190" fill="none" stroke="rgba(201,151,56,0.55)" stroke-width="1.5"/>
            </svg>
            <div style="position: absolute; top: 10px; left: 12px; background: rgba(20,63,59,0.78); color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 11px;">
              💡 Kéo thả món trang sức đến vị trí bạn muốn ướm thử
            </div>
          </div>

          <!-- Draggable Jewelry Overlay -->
          <div id="vto-jewelry-item" style="
            position: absolute; left: 50%; top: 58%; transform: translate(-50%, -50%) scale(1) rotate(0deg);
            cursor: grab; z-index: 10; padding: 8px; border: 1.5px dashed rgba(201,151,56,0.75);
            border-radius: 10px; background: radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%);
            transition: box-shadow 0.15s ease;
          " title="Kéo để di chuyển vị trí trang sức">
            <img id="vto-jewelry-img" src="${imgSrc}" alt="${product.name}" crossorigin="anonymous" style="
              width: 150px; height: 150px; object-fit: contain; pointer-events: none;
              filter: drop-shadow(0 8px 16px rgba(0,0,0,0.28));
            " onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
          </div>
        </div>

        <!-- Adjustment Sliders -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-top: 14px; background: #F8FAF9; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--color-border-light);">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
              <span>🔍 Kích thước trang sức:</span>
              <span id="vto-scale-val">100%</span>
            </div>
            <input type="range" id="vto-scale-range" min="0.4" max="2.2" step="0.05" value="1" style="width: 100%; accent-color: var(--color-brand-primary); cursor: pointer;">
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
              <span>🔄 Xoay góc nghiêng:</span>
              <span id="vto-rot-val">0°</span>
            </div>
            <input type="range" id="vto-rot-range" min="-45" max="45" step="1" value="0" style="width: 100%; accent-color: var(--color-brand-primary); cursor: pointer;">
          </div>
        </div>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="vto-close-btn">Đóng</button>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="pd-dialog-btn" id="vto-snapshot-btn" style="background: var(--color-accent-gold); color: #143F3B; border: none; font-weight: 700;">
            📸 Chụp & Lưu Ảnh Ướm Thử
          </button>
          <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="vto-consult-btn">
            💬 Nhắn Zalo Tư Vấn Mẫu Này
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const videoEl = overlay.querySelector('#vto-video');
  const uploadedImgEl = overlay.querySelector('#vto-uploaded-img');
  const silhouetteEl = overlay.querySelector('#vto-silhouette-art');
  const jewelryEl = overlay.querySelector('#vto-jewelry-item');
  const jewelryImgEl = overlay.querySelector('#vto-jewelry-img');
  const stageEl = overlay.querySelector('#vto-stage');

  function stopCamera() {
    if (activeStream) {
      activeStream.getTracks().forEach(t => t.stop());
      activeStream = null;
    }
  }

  const close = () => {
    stopCamera();
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#vto-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  function updateTransform() {
    jewelryEl.style.left = `${posX}%`;
    jewelryEl.style.top = `${posY}%`;
    jewelryEl.style.transform = `translate(-50%, -50%) scale(${jScale}) rotate(${jRotate}deg)`;
  }

  // Drag & Drop support (Mouse + Touch)
  let dragging = false;
  const onPointerDown = (e) => {
    dragging = true;
    jewelryEl.style.cursor = 'grabbing';
    jewelryEl.style.borderColor = '#C99738';
    e.preventDefault();
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const rect = stageEl.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    posX = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    posY = Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100));
    updateTransform();
  };
  const onPointerUp = () => {
    dragging = false;
    jewelryEl.style.cursor = 'grab';
  };

  jewelryEl.addEventListener('mousedown', onPointerDown);
  jewelryEl.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);

  // Sliders
  const scaleRange = overlay.querySelector('#vto-scale-range');
  const scaleVal = overlay.querySelector('#vto-scale-val');
  scaleRange.addEventListener('input', () => {
    jScale = parseFloat(scaleRange.value);
    scaleVal.textContent = `${Math.round(jScale * 100)}%`;
    updateTransform();
  });

  const rotRange = overlay.querySelector('#vto-rot-range');
  const rotVal = overlay.querySelector('#vto-rot-val');
  rotRange.addEventListener('input', () => {
    jRotate = parseInt(rotRange.value, 10);
    rotVal.textContent = `${jRotate}°`;
    updateTransform();
  });

  // Camera Mode
  overlay.querySelector('#vto-mode-camera').addEventListener('click', async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Trình duyệt của bạn không hỗ trợ mở Camera trực tiếp. Bạn có thể bấm "Tải Ảnh Của Bạn" nhé!', 'warning');
      return;
    }
    try {
      stopCamera();
      activeStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      videoEl.srcObject = activeStream;
      videoEl.style.display = 'block';
      uploadedImgEl.style.display = 'none';
      silhouetteEl.style.display = 'none';
      currentMode = 'camera';
      showToast('Đã bật Camera ướm thử! Hãy di chuyển món trang sức khớp với vị trí của bạn.', 'success');
    } catch (err) {
      showToast('Không thể truy cập Camera (có thể bạn chưa cấp quyền). Hãy thử tải ảnh cá nhân lên nhé!', 'info');
    }
  });

  // Mirror Toggle
  overlay.querySelector('#vto-mirror-btn').addEventListener('click', () => {
    isMirrored = !isMirrored;
    videoEl.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
  });

  // Upload Photo Mode
  const fileInput = overlay.querySelector('#vto-file-input');
  overlay.querySelector('#vto-mode-upload').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      stopCamera();
      uploadedDataUrl = ev.target.result;
      uploadedImgEl.src = uploadedDataUrl;
      uploadedImgEl.style.display = 'block';
      videoEl.style.display = 'none';
      silhouetteEl.style.display = 'none';
      currentMode = 'photo';
      showToast('Đã tải ảnh của bạn! Kéo thả và phóng to trang sức để ướm thử.', 'success');
    };
    reader.readAsDataURL(file);
  });

  // Silhouette Mode
  overlay.querySelector('#vto-mode-silhouette').addEventListener('click', () => {
    stopCamera();
    videoEl.style.display = 'none';
    uploadedImgEl.style.display = 'none';
    silhouetteEl.style.display = 'flex';
    currentMode = 'silhouette';
  });

  // Snapshot Download via HTML5 Canvas
  overlay.querySelector('#vto-snapshot-btn').addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // 1. Draw background
    if (currentMode === 'camera' && videoEl.readyState >= 2) {
      ctx.save();
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else if (currentMode === 'photo' && uploadedImgEl.complete) {
      ctx.drawImage(uploadedImgEl, 0, 0, canvas.width, canvas.height);
    } else {
      const grad = ctx.createRadialGradient(400, 220, 40, 400, 300, 460);
      grad.addColorStop(0, '#FCECE3');
      grad.addColorStop(0.6, '#E2BA91');
      grad.addColorStop(1, '#C49870');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw jewelry item at current relative position
    if (jewelryImgEl.complete) {
      const targetX = (posX / 100) * canvas.width;
      const targetY = (posY / 100) * canvas.height;
      const drawSize = 210 * jScale;
      ctx.save();
      ctx.translate(targetX, targetY);
      ctx.rotate((jRotate * Math.PI) / 180);
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.drawImage(jewelryImgEl, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      ctx.restore();
    }

    // 3. Draw watermark footer bar
    ctx.fillStyle = 'rgba(20, 63, 59, 0.88)';
    ctx.fillRect(0, canvas.height - 54, canvas.width, 54);
    ctx.fillStyle = '#F3D184';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(`PHÁT ĐẠT JEWELRY — ${product.name} (${formatPrice(product.price)})`, 20, canvas.height - 22);

    const link = document.createElement('a');
    link.download = `uom-thu-${product.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Đã lưu ảnh ướm thử trang sức về máy thành công!', 'success');
  });

  overlay.querySelector('#vto-consult-btn').addEventListener('click', () => {
    close();
    window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
  });
}

// ══════════════════════════════════════════════════════════════
// 13. DOWNLOADABLE LUXURY GIFT CARD IMAGE GENERATOR (CANVAS PNG)
// ══════════════════════════════════════════════════════════════

export function openDigitalGiftCardModal(product, options = {}) {
  if (!product) return;

  const themes = [
    {
      id: 'emerald',
      name: '💚 Ngọc Lục Bảo Hoàng Gia',
      bg1: '#143F3B',
      bg2: '#1E5D57',
      border: '#C99738',
      textMain: '#FFFFFF',
      textAccent: '#F3D184',
      cardBox: 'rgba(255,255,255,0.08)'
    },
    {
      id: 'ivory',
      name: '🤍 Kem Tuyết Thanh Lịch',
      bg1: '#FDFBF7',
      bg2: '#F4EFE6',
      border: '#C99738',
      textMain: '#1E3A37',
      textAccent: '#9A6F1A',
      cardBox: 'rgba(30,93,87,0.06)'
    },
    {
      id: 'ruby',
      name: '🧧 Đỏ Gấm May Mắn',
      bg1: '#5E1124',
      bg2: '#8C1D40',
      border: '#F3D184',
      textMain: '#FFFFFF',
      textAccent: '#F3D184',
      cardBox: 'rgba(255,255,255,0.09)'
    }
  ];

  let selectedTheme = themes[0];
  const initialNote = options.giftCardNote || 'Chúc người thương luôn rạng rỡ, bình an và ngập tràn hạnh phúc!';
  const initialEngraving = options.engravingText || '';

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 780px; width: 100%; max-height: 92vh; display: flex; flex-direction: column;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>🖼️ Tạo & Tải Thiệp Quà Tặng Kỹ Thuật Số (PNG)</h3>
          <div style="font-size: 12px; opacity: 0.88;">Thiết kế tấm thiệp sang trọng kèm hình ảnh trang sức để gửi tặng qua Zalo / Messenger</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="padding: 20px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 20px; align-items: start;">
        <!-- Form Controls -->
        <div>
          <div style="margin-bottom: 12px;">
            <label style="font-size: 12.5px; font-weight: 700; display: block; margin-bottom: 6px; color: var(--color-text-primary);">🎨 Chọn chủ đề màu thiệp:</label>
            <div style="display: flex; flex-direction: column; gap: 6px;" id="dgc-theme-list">
              ${themes.map((th, idx) => `
                <button type="button" class="dgc-theme-btn" data-id="${th.id}" style="padding: 8px 12px; border-radius: 8px; border: ${idx === 0 ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)'}; background: #fff; text-align: left; font-size: 12.5px; font-weight: ${idx === 0 ? '700' : '500'}; cursor: pointer;">
                  ${th.name}
                </button>
              `).join('')}
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <label style="font-size: 12.5px; font-weight: 600; display: block; margin-bottom: 4px;">Gửi tặng đến (Tên người nhận):</label>
            <input type="text" id="dgc-to-input" value="Người thương" maxlength="32" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px;">
          </div>

          <div style="margin-bottom: 10px;">
            <label style="font-size: 12.5px; font-weight: 600; display: block; margin-bottom: 4px;">Lời chúc trên thiệp:</label>
            <textarea id="dgc-msg-input" rows="3" maxlength="160" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px;">${initialNote}</textarea>
          </div>

          <div style="margin-bottom: 10px;">
            <label style="font-size: 12.5px; font-weight: 600; display: block; margin-bottom: 4px;">Người gửi / Chữ ký:</label>
            <input type="text" id="dgc-from-input" value="Yêu thương gửi trao ♥" maxlength="32" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px;">
          </div>
        </div>

        <!-- Live Canvas Preview -->
        <div style="text-align: center;">
          <div style="font-size: 11.5px; color: var(--color-text-secondary); margin-bottom: 6px; font-weight: 600;">Xem trước thiệp quà tặng (Chuẩn tỷ lệ gửi Zalo HD):</div>
          <canvas id="dgc-canvas" width="600" height="750" style="width: 100%; max-width: 310px; height: auto; border-radius: 12px; box-shadow: 0 12px 28px rgba(0,0,0,0.18); border: 1px solid var(--color-border);"></canvas>
        </div>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="dgc-close-btn">Đóng</button>
        <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="dgc-download-btn" style="background: var(--color-accent-gold); color: #143F3B; font-weight: 700;">
          📥 Tải Ảnh Thiệp Về Máy (.PNG)
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const close = () => {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#dgc-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const canvas = overlay.querySelector('#dgc-canvas');
  const ctx = canvas.getContext('2d');
  const toInput = overlay.querySelector('#dgc-to-input');
  const msgInput = overlay.querySelector('#dgc-msg-input');
  const fromInput = overlay.querySelector('#dgc-from-input');

  const prodImg = new Image();
  prodImg.crossOrigin = 'anonymous';
  prodImg.src = (product.images && product.images[0]) || './images/products/Daychuyen4.3-removebg-preview.png';
  prodImg.onload = () => drawCard();
  prodImg.onerror = () => drawCard();

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line.trim(), x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line.trim(), x, curY);
    return curY;
  }

  function drawCard() {
    const W = canvas.width;
    const H = canvas.height;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, selectedTheme.bg1);
    grad.addColorStop(1, selectedTheme.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Double Luxury Gold Border
    ctx.strokeStyle = selectedTheme.border;
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, W - 56, H - 56);

    // Header Brand Title
    ctx.textAlign = 'center';
    ctx.fillStyle = selectedTheme.textAccent;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('✦ PHÁT ĐẠT JEWELRY · TRANG SỨC BẠC S925 ✦', W / 2, 68);

    ctx.fillStyle = selectedTheme.textMain;
    ctx.font = 'italic bold 28px Georgia, serif';
    ctx.fillText(`Gửi tặng: ${toInput.value.trim() || 'Người thương'}`, W / 2, 112);

    // Product Showcase Circle / Frame
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, 260, 110, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = selectedTheme.border;
    ctx.stroke();
    ctx.clip();
    if (prodImg.complete && prodImg.naturalWidth > 0) {
      ctx.drawImage(prodImg, W / 2 - 95, 260 - 95, 190, 190);
    }
    ctx.restore();

    // Product Name & Info
    ctx.fillStyle = selectedTheme.textAccent;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(product.name, W / 2, 405);

    ctx.fillStyle = selectedTheme.textMain;
    ctx.font = '13px sans-serif';
    ctx.fillText(`Chất liệu: ${product.materials || 'Bạc Ý S925'}${initialEngraving ? ` • Khắc: "${initialEngraving}"` : ''}`, W / 2, 430);

    // Message Box
    ctx.fillStyle = selectedTheme.cardBox;
    ctx.fillRect(56, 455, W - 112, 165);
    ctx.strokeStyle = selectedTheme.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(56, 455, W - 112, 165);

    ctx.fillStyle = selectedTheme.textMain;
    ctx.font = 'italic 18px Georgia, serif';
    wrapText(ctx, `"${msgInput.value.trim() || initialNote}"`, W / 2, 502, W - 150, 28);

    // Sender signature
    ctx.fillStyle = selectedTheme.textAccent;
    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillText(`— ${fromInput.value.trim() || 'Yêu thương gửi trao ♥'} —`, W / 2, 660);

    // Footer Warranty Note
    ctx.fillStyle = selectedTheme.textMain;
    ctx.globalAlpha = 0.78;
    ctx.font = '12px sans-serif';
    ctx.fillText('Bảo hành làm sáng Bạc S925 miễn phí trọn đời tại Phát Đạt Jewelry • Hotline: 0898 025 013', W / 2, 704);
    ctx.globalAlpha = 1.0;
  }

  overlay.querySelectorAll('.dgc-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTheme = themes.find(t => t.id === btn.dataset.id) || themes[0];
      overlay.querySelectorAll('.dgc-theme-btn').forEach(b => {
        b.style.border = '1px solid var(--color-border)';
        b.style.fontWeight = '500';
      });
      btn.style.border = '2px solid var(--color-brand-primary)';
      btn.style.fontWeight = '700';
      drawCard();
    });
  });

  [toInput, msgInput, fromInput].forEach(el => el.addEventListener('input', drawCard));
  drawCard();

  overlay.querySelector('#dgc-download-btn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `thiep-qua-tang-phat-dat-${product.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Đã tải ảnh Thiệp Quà Tặng (.PNG) về máy! Bạn có thể gửi ngay qua Zalo/Messenger.', 'success', 4000);
  });
}

// ══════════════════════════════════════════════════════════════
// 14. CONVENIENCE SHORTCUTS
// ══════════════════════════════════════════════════════════════

export const toast = {
  success: (msg, title, duration) => showToast({ message: msg, title, type: 'success', duration }),
  error: (msg, title, duration) => showToast({ message: msg, title, type: 'error', duration }),
  info: (msg, title, duration) => showToast({ message: msg, title, type: 'info', duration }),
  warning: (msg, title, duration) => showToast({ message: msg, title, type: 'warning', duration }),
};

export const modal = {
  confirm: showConfirmModal,
  alert: showAlertModal,
  lightbox: openLightboxModal,
  callback: openQuickCallbackModal,
  qrTag: openQrTagModal,
  compare: openCompareModal,
  giftFinder: openGiftFinderModal,
  quickView: openQuickViewModal,
  fengShui: openFengShuiMatcherModal,
  warranty: openWarrantyLookupModal,
  virtualTryOn: openVirtualTryOnModal,
  digitalGiftCard: openDigitalGiftCardModal
};




