// ============================================================
// FEEDBACK MODAL & TOAST NOTIFICATION SYSTEM — PHÁT ĐẠT JEWELRY
// ============================================================

import '../styles/feedback.css';
import { addCustomerContact } from '../services/supabase.js';
import {
  getCompareProductIds,
  toggleCompareProduct,
  clearCompareList,
  trackProductEvent,
  getAnniversaryReminders,
  addAnniversaryReminder,
  deleteAnniversaryReminder,
  saveStyleQuizResult,
  getStyleQuizResult,
  getUserJewelrySizes,
  saveUserJewelrySizes,
  formatConvertedPrice,
  getSelectedCurrency,
  getLovedOnesSizes,
  saveLovedOneSize,
  deleteLovedOneSize
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
        ${items.length >= 2 ? `
          <button type="button" class="pd-compare-bar__clear" id="bar-split-compare" style="background: rgba(201, 151, 56, 0.2); border-color: #C99738; color: #FFF8E7; font-weight: 600;" title="So sánh 2 mẫu song song">
            ⚡ So sánh 1:1
          </button>
        ` : ''}
        <button type="button" class="pd-compare-bar__clear" id="bar-clear-compare">Xóa</button>
        <button type="button" class="pd-compare-bar__open" id="bar-open-compare">⚖️ So sánh ngay</button>
      </div>
    `;

    bar.querySelectorAll('.pd-compare-bar__remove').forEach(btn => {
      btn.addEventListener('click', () => toggleCompareProduct(btn.dataset.id));
    });
    bar.querySelector('#bar-clear-compare').addEventListener('click', () => clearCompareList());
    bar.querySelector('#bar-open-compare').addEventListener('click', () => openCompareModal());
    const splitBtn = bar.querySelector('#bar-split-compare');
    if (splitBtn && items.length >= 2) {
      splitBtn.addEventListener('click', () => openSplitScreenCompareModal(items[0].id, items[1].id));
    }

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
            💡 Mọi khách hàng của Phát Đạt Jewelry chỉ cần đọc Số Điện Thoại tại quầy (${siteInfo.address}) đều được làm sáng trang sức bạc miễn phí trọn đời, không cần giữ hóa đơn giấy.
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
          position: relative; width: 100%; height: clamp(230px, 42vh, 360px); border-radius: 12px; overflow: hidden;
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

  const close = () => {
    stopCamera();
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    window.removeEventListener('touchend', onPointerUp);
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('.modal-close-x').addEventListener('click', close);
  overlay.querySelector('#vto-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

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
// 14. COUPLE & FRIENDSHIP RING / BRACELET BUILDER (VÒNG 1)
// ══════════════════════════════════════════════════════════════

export function openCoupleBuilderModal(initialProduct = null) {
  const pairCandidates = products.filter(p => p.category === 'rings' || p.category === 'bracelets');
  const pool = pairCandidates.length >= 2 ? pairCandidates : products.slice(0, 8);

  let item1 = (initialProduct && (initialProduct.category === 'rings' || initialProduct.category === 'bracelets'))
    ? initialProduct
    : pool[0];
  let item2 = pool.find(p => p.id !== item1.id && p.category === item1.category) || pool[1] || pool[0];

  let engrave1 = 'Minh ♥ 20.10';
  let engrave2 = 'Anh ♥ 20.10';
  let size1 = (item1.availableSizes && item1.availableSizes[0]) || 'Freesize';
  let size2 = (item2.availableSizes && item2.availableSizes[0]) || 'Freesize';

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 780px; width: 100%; max-height: 92vh; display: flex; flex-direction: column;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>💑 Xưởng Thiết Kế Nhẫn & Vòng Đôi Khắc Laser Kép</h3>
          <div style="font-size: 12px; opacity: 0.88;">Phối cặp nhẫn/vòng Bạc S925 tình nhân hoặc tri kỷ · Miễn phí khắc tên đôi & Hộp nhung đôi</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div class="pd-callback-body" style="padding: 18px 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 16px;">
          <!-- Piece 1 -->
          <div style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 10px; padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-brand-primary); text-transform: uppercase; margin-bottom: 8px;">
              💍 Món Trang Sức 1 (Bạn / Nam)
            </div>
            <select id="cb-select-1" class="pd-callback-input" style="margin-bottom: 10px; font-size: 13px;">
              ${pool.map(p => `<option value="${p.id}" ${p.id === item1.id ? 'selected' : ''}>${p.name} — ${formatPrice(p.price)}</option>`).join('')}
            </select>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <img id="cb-img-1" src="${item1.images[0]}" alt="${item1.name}" style="width: 58px; height: 58px; object-fit: contain; background: #fff; border-radius: 8px; border: 1px solid var(--color-border-light); padding: 4px;">
              <div style="flex: 1;">
                <label style="font-size: 11.5px; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">Kích cỡ món 1:</label>
                <input type="text" id="cb-size-1" value="${size1}" class="pd-callback-input" style="padding: 6px 10px; font-size: 12.5px;">
              </div>
            </div>
            <label style="font-size: 11.5px; font-weight: 600; color: var(--color-text-primary); display: block; margin-bottom: 4px;">✒️ Chữ khắc Laser lên món 1:</label>
            <input type="text" id="cb-eng-1" maxlength="18" value="${engrave1}" class="pd-callback-input" style="padding: 7px 10px; font-size: 13px;" placeholder="VD: Minh ♥ 20.10">
          </div>

          <!-- Piece 2 -->
          <div style="background: #FAF6EE; border: 1px solid #E5DEC9; border-radius: 10px; padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: #8A6218; text-transform: uppercase; margin-bottom: 8px;">
              💖 Món Trang Sức 2 (Người Thương / Tri Kỷ)
            </div>
            <select id="cb-select-2" class="pd-callback-input" style="margin-bottom: 10px; font-size: 13px;">
              ${pool.map(p => `<option value="${p.id}" ${p.id === item2.id ? 'selected' : ''}>${p.name} — ${formatPrice(p.price)}</option>`).join('')}
            </select>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <img id="cb-img-2" src="${item2.images[0]}" alt="${item2.name}" style="width: 58px; height: 58px; object-fit: contain; background: #fff; border-radius: 8px; border: 1px solid var(--color-border-light); padding: 4px;">
              <div style="flex: 1;">
                <label style="font-size: 11.5px; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">Kích cỡ món 2:</label>
                <input type="text" id="cb-size-2" value="${size2}" class="pd-callback-input" style="padding: 6px 10px; font-size: 12.5px;">
              </div>
            </div>
            <label style="font-size: 11.5px; font-weight: 600; color: var(--color-text-primary); display: block; margin-bottom: 4px;">✒️ Chữ khắc Laser lên món 2:</label>
            <input type="text" id="cb-eng-2" maxlength="18" value="${engrave2}" class="pd-callback-input" style="padding: 7px 10px; font-size: 13px;" placeholder="VD: Anh ♥ 20.10">
          </div>
        </div>

        <!-- Quick Symbol Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="font-size: 12px; color: var(--color-text-secondary);">Chèn ký hiệu đôi:</span>
            ${[' ♥ ', ' ∞ ', ' ★ ', ' 🍀 ', ' ♔ ', ' ♕ '].map(sym => `
              <button type="button" class="cb-sym-btn" data-sym="${sym}" style="border: 1px solid var(--color-border); background: #fff; border-radius: 6px; padding: 3px 9px; font-size: 12.5px; cursor: pointer;">${sym.trim()}</button>
            `).join('')}
          </div>
          <span style="font-size: 12px; color: var(--color-brand-primary); font-weight: 700;">🎁 Tặng kèm Hộp Nhung Đôi + 2 Thiệp Viết Tay</span>
        </div>

        <!-- Dual Silver Band Engraving Live Simulation -->
        <div style="background: linear-gradient(135deg, #143F3B 0%, #1E5D57 100%); border-radius: 12px; padding: 16px; color: #fff; text-align: center; border: 1px solid var(--color-accent-gold);">
          <div style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent-gold); margin-bottom: 10px; font-weight: 700;">
            ✦ Mô Phỏng Khắc Laser Trên Cặp Bạc S925 ✦
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            <div style="background: linear-gradient(135deg, #E2E5E8 0%, #F8F9FA 48%, #CFD4D8 52%, #EBEEF0 100%); border-radius: 30px; padding: 10px 16px; color: #2C3539; box-shadow: inset 0 2px 5px rgba(0,0,0,0.18); border: 1.5px solid #BDC3C7;">
              <div style="font-size: 10px; color: #667; text-transform: uppercase;">Món 1 (<span id="cb-band-name-1">${item1.name}</span>)</div>
              <div id="cb-band-text-1" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; letter-spacing: 0.06em; margin-top: 2px;">${engrave1}</div>
            </div>
            <div style="background: linear-gradient(135deg, #E2E5E8 0%, #F8F9FA 48%, #CFD4D8 52%, #EBEEF0 100%); border-radius: 30px; padding: 10px 16px; color: #2C3539; box-shadow: inset 0 2px 5px rgba(0,0,0,0.18); border: 1.5px solid #C99738;">
              <div style="font-size: 10px; color: #667; text-transform: uppercase;">Món 2 (<span id="cb-band-name-2">${item2.name}</span>)</div>
              <div id="cb-band-text-2" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; letter-spacing: 0.06em; margin-top: 2px;">${engrave2}</div>
            </div>
          </div>
          <div style="margin-top: 12px; font-size: 13.5px; display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap;">
            <span>Tổng giá trị cặp đôi: <strong id="cb-total-price" style="color: #F3D184; font-size: 17px;">${formatPrice(item1.price + item2.price)}</strong></span>
            <span style="font-size: 11.5px; background: rgba(255,255,255,0.14); padding: 2px 10px; border-radius: 12px;">✓ Miễn phí khắc Laser 2 món</span>
          </div>
        </div>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="cb-close-btn" style="flex: 0 0 auto;">Đóng</button>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="pd-dialog-btn" id="cb-callback-btn" style="background: var(--color-accent-gold); color: #143F3B; border: none; font-weight: 700;">
            📞 Đặt Làm Cặp Này (Gọi Lại)
          </button>
          <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="cb-zalo-btn">
            💬 Gửi Mẫu Cặp Đôi Qua Zalo
          </button>
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
  overlay.querySelector('#cb-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const sel1 = overlay.querySelector('#cb-select-1');
  const sel2 = overlay.querySelector('#cb-select-2');
  const eng1Input = overlay.querySelector('#cb-eng-1');
  const eng2Input = overlay.querySelector('#cb-eng-2');
  const size1Input = overlay.querySelector('#cb-size-1');
  const size2Input = overlay.querySelector('#cb-size-2');

  function refreshPreview() {
    item1 = pool.find(p => p.id === sel1.value) || pool[0];
    item2 = pool.find(p => p.id === sel2.value) || pool[0];
    engrave1 = eng1Input.value.trim() || 'Minh ♥ 20.10';
    engrave2 = eng2Input.value.trim() || 'Anh ♥ 20.10';

    overlay.querySelector('#cb-img-1').src = item1.images[0];
    overlay.querySelector('#cb-img-2').src = item2.images[0];
    overlay.querySelector('#cb-band-name-1').textContent = item1.name;
    overlay.querySelector('#cb-band-name-2').textContent = item2.name;
    overlay.querySelector('#cb-band-text-1').textContent = engrave1;
    overlay.querySelector('#cb-band-text-2').textContent = engrave2;
    overlay.querySelector('#cb-total-price').textContent = formatPrice(item1.price + item2.price);
  }

  [sel1, sel2, eng1Input, eng2Input].forEach(el => el.addEventListener('input', refreshPreview));

  overlay.querySelectorAll('.cb-sym-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sym = btn.dataset.sym;
      if ((eng1Input.value + sym).length <= 18) eng1Input.value += sym;
      if ((eng2Input.value + sym).length <= 18) eng2Input.value += sym;
      refreshPreview();
    });
  });

  overlay.querySelector('#cb-zalo-btn').addEventListener('click', () => {
    const msg = `[Phát Đạt Jewelry] Tôi muốn đặt tư vấn CẶP TRANG SỨC ĐÔI KHẮC LASER:\n1. Món 1: ${item1.name} (${item1.reference}) | Size: ${size1Input.value} | Khắc: "${engrave1}"\n2. Món 2: ${item2.name} (${item2.reference}) | Size: ${size2Input.value} | Khắc: "${engrave2}"\n- Tổng giá trị cặp: ${formatPrice(item1.price + item2.price)} (Tặng hộp nhung đôi & thiệp)`;
    try {
      navigator.clipboard.writeText(msg);
      showToast('Đã sao chép cấu hình Cặp Trang Sức Đôi! Bạn chỉ cần Dán (Paste) vào Zalo.', 'success', 4000);
    } catch (e) {}
    setTimeout(() => {
      window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
    }, 450);
  });

  overlay.querySelector('#cb-callback-btn').addEventListener('click', () => {
    close();
    openQuickCallbackModal([item1, item2], {
      selectedInfo: `Cặp đôi khắc Laser: Món 1 [${size1Input.value} - Khắc "${engrave1}"] & Món 2 [${size2Input.value} - Khắc "${engrave2}"]`,
      giftCardNote: 'Đóng gói Hộp Nhung Đôi Tình Nhân'
    });
  });
}

// ══════════════════════════════════════════════════════════════
// 15. ANNIVERSARY & GIFT REMINDER PLANNER MODAL (VÒNG 3)
// ══════════════════════════════════════════════════════════════

export function openAnniversaryReminderModal() {
  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 680px; width: 100%; max-height: 92vh; display: flex; flex-direction: column;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>📅 Sổ Tay Nhắc Lịch Kỷ Niệm & Quà Tặng Người Thương</h3>
          <div style="font-size: 12px; opacity: 0.88;">Lưu ngày sinh nhật, kỷ niệm ngày cưới/yêu & nhận gợi ý quà trang sức Bạc S925 tinh tế</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div class="pd-callback-body" style="padding: 18px 20px;">
        <!-- Add New Reminder Form -->
        <form id="ar-add-form" style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 10px; padding: 14px; margin-bottom: 18px;">
          <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
            + Thêm Ngày Kỷ Niệm / Sinh Nhật Quan Trọng
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 10px;">
            <div>
              <label style="font-size: 11.5px; font-weight: 600; display: block; margin-bottom: 3px;">Dịp kỷ niệm *</label>
              <input type="text" id="ar-title" required placeholder="VD: Sinh nhật vợ yêu, Kỷ niệm 2 năm..." class="pd-callback-input" style="padding: 7px 10px; font-size: 12.5px;">
            </div>
            <div>
              <label style="font-size: 11.5px; font-weight: 600; display: block; margin-bottom: 3px;">Người nhận quà *</label>
              <input type="text" id="ar-recipient" required placeholder="VD: Minh Thư, Mẹ yêu..." class="pd-callback-input" style="padding: 7px 10px; font-size: 12.5px;">
            </div>
            <div>
              <label style="font-size: 11.5px; font-weight: 600; display: block; margin-bottom: 3px;">Ngày diễn ra *</label>
              <input type="date" id="ar-date" required value="${new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)}" class="pd-callback-input" style="padding: 6px 10px; font-size: 12.5px;">
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <select id="ar-cat" class="pd-callback-input" style="width: auto; padding: 6px 12px; font-size: 12.5px;">
              <option value="necklaces">Gợi ý: Dây chuyền & Mặt dây</option>
              <option value="rings">Gợi ý: Nhẫn Bạc / Moissanite</option>
              <option value="bracelets">Gợi ý: Lắc tay & Vòng tay</option>
              <option value="earrings">Gợi ý: Bông tai thanh lịch</option>
            </select>
            <button type="submit" style="background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 12.5px; font-weight: 700; cursor: pointer;">
              💾 Lưu Vào Sổ Tay Kỷ Niệm
            </button>
          </div>
        </form>

        <!-- Saved Reminders List -->
        <div id="ar-list-container"></div>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="ar-close-btn">Đóng</button>
        <button type="button" class="pd-dialog-btn" id="ar-register-zalo-remind" style="background: var(--color-accent-gold); color: #143F3B; border: none; font-weight: 700;">
          🔔 Nhờ Phát Đạt Nhắc Trước 7 Ngày Qua Zalo/SĐT
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
  overlay.querySelector('#ar-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const listEl = overlay.querySelector('#ar-list-container');

  function calcDaysUntil(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = (dateStr || '').split('-');
    if (parts.length < 3) return 0;
    let target = new Date(today.getFullYear(), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    if (target < today) {
      target = new Date(today.getFullYear() + 1, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return Math.round((target - today) / 86400000);
  }

  function downloadIcsFile(rem) {
    const cleanDate = (rem.dateStr || '').replace(/-/g, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Phat Dat Jewelry//Gift Reminder//VN',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `SUMMARY:[Quà tặng Phát Đạt Jewelry] ${rem.title} - Tặng ${rem.recipient}`,
      `DESCRIPTION:Chuẩn bị quà trang sức Bạc S925 tặng ${rem.recipient} tại Phát Đạt Jewelry (Hotline/Zalo: 0898 025 013).`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lich-ky-niem-${rem.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải file lịch (.ICS)! Bạn có thể mở để thêm vào Lịch Điện Thoại / Google Calendar.', 'success');
  }

  function renderList() {
    const reminders = getAnniversaryReminders();
    if (reminders.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Chưa có lịch kỷ niệm nào. Hãy thêm ngày đặc biệt của người thương ở trên nhé!</div>`;
      return;
    }

    listEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${reminders.map(rem => {
          const daysLeft = calcDaysUntil(rem.dateStr);
          const suggestedProd = products.find(p => p.category === rem.categoryHint) || products[0];
          const badgeText = daysLeft === 0 ? '🎉 Hôm nay!' : `⏳ Còn ${daysLeft} ngày`;
          return `
            <div style="border: 1px solid var(--color-border); border-radius: 10px; padding: 12px 14px; background: #fff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div style="flex: 1; min-width: 200px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <strong style="font-size: 14px; color: var(--color-brand-primary);">${rem.title}</strong>
                  <span style="background: #FAF4E8; color: #8A6218; border: 1px solid var(--color-accent-gold); border-radius: 12px; padding: 2px 8px; font-size: 11px; font-weight: 700;">${badgeText}</span>
                </div>
                <div style="font-size: 12.5px; color: var(--color-text-secondary); margin-top: 3px;">
                  👤 Người nhận: <strong>${rem.recipient}</strong> · 📅 Ngày: ${rem.dateStr}
                </div>
                <div style="font-size: 12px; color: var(--color-brand-primary); margin-top: 4px;">
                  💎 Gợi ý quà: <a href="#/product/${suggestedProd.id}" class="ar-prod-link" style="color: var(--color-brand-primary); font-weight: 600; text-decoration: underline;">${suggestedProd.name} (${formatPrice(suggestedProd.price)})</a>
                </div>
              </div>
              <div style="display: flex; gap: 6px; align-items: center;">
                <button type="button" class="ar-ics-btn" data-id="${rem.id}" style="background: #F4F9F8; color: var(--color-brand-primary); border: 1px solid #C5DEDB; border-radius: 6px; padding: 6px 10px; font-size: 11.5px; font-weight: 600; cursor: pointer;" title="Tải vào Lịch điện thoại">
                  📲 Lưu Lịch .ICS
                </button>
                <button type="button" class="ar-del-btn" data-id="${rem.id}" style="background: #FFF1F0; color: #CF1322; border: 1px solid #FFA39E; border-radius: 6px; padding: 6px 9px; font-size: 11.5px; cursor: pointer;" title="Xóa">
                  ✕
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    listEl.querySelectorAll('.ar-prod-link').forEach(a => a.addEventListener('click', close));
    listEl.querySelectorAll('.ar-ics-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const found = reminders.find(r => r.id === btn.dataset.id);
        if (found) downloadIcsFile(found);
      });
    });
    listEl.querySelectorAll('.ar-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteAnniversaryReminder(btn.dataset.id);
        renderList();
        showToast('Đã xóa ngày kỷ niệm khỏi sổ tay.', 'info');
      });
    });
  }

  overlay.querySelector('#ar-add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = overlay.querySelector('#ar-title').value.trim();
    const recipient = overlay.querySelector('#ar-recipient').value.trim();
    const dateStr = overlay.querySelector('#ar-date').value;
    const categoryHint = overlay.querySelector('#ar-cat').value;
    if (!title || !recipient) return;

    addAnniversaryReminder({ title, recipient, dateStr, categoryHint });
    overlay.querySelector('#ar-title').value = '';
    overlay.querySelector('#ar-recipient').value = '';
    renderList();
    showToast(`Đã lưu lịch kỷ niệm "${title}" thành công!`, 'success');
  });

  overlay.querySelector('#ar-register-zalo-remind').addEventListener('click', () => {
    const reminders = getAnniversaryReminders();
    const first = reminders[0];
    close();
    openQuickCallbackModal(products[0], {
      selectedInfo: first ? `Đăng ký nhắc lịch quà tặng: ${first.title} (${first.dateStr}) cho ${first.recipient}` : 'Đăng ký nhắc lịch kỷ niệm & tư vấn quà tặng VIP'
    });
  });

  renderList();
}

// ══════════════════════════════════════════════════════════════
// 16. FACE SHAPE, NECKLINE & HAND STYLING ADVISOR (VÒNG 4)
// ══════════════════════════════════════════════════════════════

export function openFaceHandStylingModal() {
  const FACE_PROFILES = {
    round: {
      name: '😊 Khuôn Mặt Tròn Phúc Hậu',
      rule: 'Nên chọn bông tai dáng dài giọt nước, tua rua thanh mảnh hoặc dây chuyền chữ Y / mặt dây rơi nhẹ (45cm) để tạo hiệu ứng khuôn mặt thon gọn, thanh thoát hơn.',
      avoid: 'Tránh bông tai bản tròn quá to ôm sát dái tai hoặc vòng cổ choker quá sát.',
      categories: ['earrings', 'necklaces']
    },
    oval: {
      name: '✨ Khuôn Mặt Trái Xoan Cân Đối',
      rule: 'Dáng mặt lý tưởng phù hợp với hầu hết mọi kiểu trang sức! Đặc biệt tôn nét quý phái khi đeo bông tai nụ đá Moissanite, cỏ ba lá xà cừ hoặc dây chuyền 40–45cm.',
      avoid: 'Tránh bông tai quá dài vượt quá cằm làm mặt trông dài hơn.',
      categories: ['earrings', 'necklaces']
    },
    square: {
      name: '💎 Khuôn Mặt Vuông / Góc Cạnh Cá Tính',
      rule: 'Ưu tiên trang sức có đường cong mềm mại: bông tai tròn, họa tiết cánh hoa, cỏ 4 lá, giọt sương hoặc dây chuyền mặt tròn/trái tim giúp làm dịu đường nét góc cạnh.',
      avoid: 'Tránh các mẫu bông tai hình vuông sắc nhọn hoặc hình học góc cạnh.',
      categories: ['earrings', 'necklaces']
    },
    heart: {
      name: '💖 Khuôn Mặt Trái Tim / Cằm V-Line',
      rule: 'Rất hợp với bông tai dáng chùm nhẹ ở phần đuôi (giọt nước, chuông nhỏ) và dây chuyền ôm nhẹ xương quai xanh giúp cân bằng phần trán và cằm thon.',
      avoid: 'Tránh bông tai hình tam giác ngược phần trên to phần dưới nhọn.',
      categories: [' neck', 'earrings', 'necklaces']
    }
  };

  const HAND_PROFILES = {
    slender: {
      name: '🖐️ Ngón Tay Thon Dài Thanh Mảnh',
      rule: 'Phù hợp tuyệt vời với nhẫn đính đá chủ Moissanite, nhẫn kép (double-band) hoặc lắc tay chuỗi hạt ngọc / cỏ ba lá giúp bàn tay thêm đầy đặn, sang trọng.',
      categories: ['rings', 'bracelets']
    },
    petite: {
      name: '🌸 Bàn Tay Nhỏ Nhắn / Ngón Tay Ngắn',
      rule: 'Nên chọn nhẫn bản mảnh (dưới 2.5mm), mặt nhẫn hình giọt nước, trái tim hoặc đính đá tấm thanh thoát và lắc tay dây mảnh có xích phụ giúp ngón tay trông dài hơn.',
      categories: ['rings', 'bracelets']
    },
    full: {
      name: '✨ Bàn Tay Đầy Đặn / Khớp Tay Rõ',
      rule: 'Ưu tiên nhẫn Freesize hở nhẹ hoặc nhẫn mặt hoa/cỏ ba lá kích thước vừa phải và vòng tay đính charm tạo điểm nhấn thu hút ánh nhìn vào trung tâm viên đá.',
      categories: ['rings', 'bracelets']
    }
  };

  let activeMode = 'face'; // 'face' | 'hand'
  let selectedKey = 'round';

  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';
  overlay.innerHTML = `
    <div class="pd-callback-card" style="max-width: 700px; width: 100%; max-height: 92vh; display: flex; flex-direction: column;" role="dialog" aria-modal="true">
      <div class="pd-callback-header">
        <div>
          <h3>👗 Cố Vấn Chọn Trang Sức Theo Dáng Mặt & Bàn Tay</h3>
          <div style="font-size: 12px; opacity: 0.88;">Bí quyết chọn kiểu Bông tai, Dây chuyền, Nhẫn & Lắc tay tôn nét đẹp tự nhiên nhất</div>
        </div>
        <button type="button" class="modal-close-x" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div class="pd-callback-body" style="padding: 18px 20px;">
        <!-- Mode Switcher -->
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button type="button" id="fhs-tab-face" style="flex: 1; padding: 10px; border-radius: 8px; border: 2px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;">
            👩 Dáng Khuôn Mặt & Cổ Áo (Bông tai / Dây chuyền)
          </button>
          <button type="button" id="fhs-tab-hand" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 13px; font-weight: 600; cursor: pointer;">
            🖐️ Dáng Bàn Tay & Cổ Tay (Nhẫn / Lắc tay)
          </button>
        </div>

        <div id="fhs-options-bar" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 16px;"></div>
        <div id="fhs-advice-box"></div>
      </div>

      <div class="pd-callback-footer" style="justify-content: space-between;">
        <button type="button" class="pd-dialog-btn pd-dialog-btn--cancel" id="fhs-close-btn">Đóng</button>
        <button type="button" class="pd-dialog-btn pd-dialog-btn--primary" id="fhs-zalo-btn">
          💬 Nhờ Chuyên Viên Xem Ảnh & Tư Vấn Qua Zalo
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
  overlay.querySelector('#fhs-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const tabFace = overlay.querySelector('#fhs-tab-face');
  const tabHand = overlay.querySelector('#fhs-tab-hand');
  const optionsBar = overlay.querySelector('#fhs-options-bar');
  const adviceBox = overlay.querySelector('#fhs-advice-box');

  function renderAdvisor() {
    const dict = activeMode === 'face' ? FACE_PROFILES : HAND_PROFILES;
    if (!dict[selectedKey]) selectedKey = Object.keys(dict)[0];
    const current = dict[selectedKey];

    optionsBar.innerHTML = Object.entries(dict).map(([k, val]) => `
      <button type="button" class="fhs-opt-btn" data-key="${k}" style="
        padding: 10px 12px; border-radius: 8px; text-align: left; font-size: 12.5px; cursor: pointer;
        border: ${k === selectedKey ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)'};
        background: ${k === selectedKey ? '#F4F9F8' : '#fff'};
        font-weight: ${k === selectedKey ? '700' : '500'};
        color: ${k === selectedKey ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'};
      ">${val.name}</button>
    `).join('');

    optionsBar.querySelectorAll('.fhs-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedKey = btn.dataset.key;
        renderAdvisor();
      });
    });

    const recommended = products.filter(p => current.categories.includes(p.category)).slice(0, 3);

    adviceBox.innerHTML = `
      <div style="background: #FAF6EE; border: 1px solid #E5DEC9; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">
          💡 Quy Tắc Vàng Cho ${current.name}:
        </div>
        <p style="font-size: 13px; color: var(--color-text-primary); line-height: 1.6; margin: 0 0 6px;">
          ✓ <strong>Nên chọn:</strong> ${current.rule}
        </p>
        ${current.avoid ? `<p style="font-size: 12.5px; color: #8A6218; margin: 0;">• <strong>Lưu ý nhỏ:</strong> ${current.avoid}</p>` : ''}
      </div>

      <div style="font-size: 12.5px; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;">
        ✨ Các Mẫu Trang Sức Bạc S925 Tôn Dáng Nhất Cho Bạn:
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
        ${recommended.map(p => `
          <a href="#/product/${p.id}" class="fhs-prod-card" style="text-decoration: none; color: inherit; border: 1px solid var(--color-border-light); border-radius: 8px; padding: 10px; background: #fff; display: flex; align-items: center; gap: 10px;">
            <img src="${p.images[0]}" alt="${p.name}" style="width: 52px; height: 52px; object-fit: contain; border-radius: 6px; background: #fafaf8; flex-shrink: 0;">
            <div style="min-width: 0;">
              <div style="font-size: 12.5px; font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
              <div style="font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-top: 2px;">${formatPrice(p.price)}</div>
            </div>
          </a>
        `).join('')}
      </div>
    `;

    adviceBox.querySelectorAll('.fhs-prod-card').forEach(a => a.addEventListener('click', close));
  }

  tabFace.addEventListener('click', () => {
    activeMode = 'face';
    selectedKey = 'round';
    tabFace.style.background = 'var(--color-brand-primary)';
    tabFace.style.color = '#fff';
    tabHand.style.background = '#fff';
    tabHand.style.color = 'var(--color-text-primary)';
    renderAdvisor();
  });

  tabHand.addEventListener('click', () => {
    activeMode = 'hand';
    selectedKey = 'slender';
    tabHand.style.background = 'var(--color-brand-primary)';
    tabHand.style.color = '#fff';
    tabFace.style.background = '#fff';
    tabFace.style.color = 'var(--color-text-primary)';
    renderAdvisor();
  });

  overlay.querySelector('#fhs-zalo-btn').addEventListener('click', () => {
    close();
    window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
  });

  renderAdvisor();
}

// ══════════════════════════════════════════════════════════════
// 17. COLLARBONE & CHAIN LENGTH VISUALIZER (ROUND 21)
// ══════════════════════════════════════════════════════════════

export function openChainVisualizerModal(initialLength = 42) {
  let length = Math.max(38, Math.min(60, Number(initialLength) || 42));
  let neckline = 'round'; // 'round', 'vneck', 'shirt'

  const { overlay, close } = createModalBase({
    title: 'Thước Đo Độ Dài Dây Chuyền & Xương Quai Xanh',
    subtitle: 'Mô phỏng vị trí dây rơi trên cổ & xương quai xanh tương tác',
    maxWidth: '560px'
  });

  const card = overlay.querySelector('.pd-callback-card');
  const body = overlay.querySelector('.pd-callback-body');

  function getLengthInfo(cm) {
    if (cm <= 40) {
      return {
        name: 'Choker (38 - 40cm)',
        position: 'Ôm sát chân cổ',
        desc: 'Tôn vinh nét cổ thon thả kiêu kỳ. Rất đẹp khi mặc áo trễ vai, cúp ngực hoặc áo cổ thuyền.'
      };
    }
    if (cm <= 46) {
      return {
        name: 'Princess (42 - 45cm)',
        position: 'Ngang xương quai xanh (Chuẩn nhất)',
        desc: 'Chiều dài thanh lịch và phổ biến nhất ngành kim hoàn. Phù hợp 90% trang phục thường ngày & công sở.'
      };
    }
    if (cm <= 54) {
      return {
        name: 'Matinee (48 - 52cm)',
        position: 'Ngay phía trên khe ngực',
        desc: 'Tạo hiệu ứng thị giác cổ chữ V kéo dài thân người thon gọn. Rất hợp áo cổ chữ V sâu hoặc blazer sang trọng.'
      };
    }
    return {
      name: 'Opera (55 - 60cm)',
      position: 'Dài buông tự do qua ngực',
      desc: 'Mang hơi thở phóng khoáng, quý phái. Thích hợp đeo đơn độc đáo hoặc phối layer 2 tầng với dây ngắn.'
    };
  }

  function render() {
    const info = getLengthInfo(length);
    // SVG Chain control point calculation based on cm
    // 38cm -> y=98, 60cm -> y=185
    const chainBottomY = 90 + ((length - 38) / 22) * 95;
    const chainPendantY = chainBottomY + 12;

    body.innerHTML = `
      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 8px;">
          1. Chọn kiểu cổ áo thường mặc:
        </label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          <button type="button" class="neckline-btn" data-type="round" style="padding: 8px; border-radius: 6px; border: 1.5px solid ${neckline === 'round' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${neckline === 'round' ? 'var(--color-brand-light)' : '#fff'}; font-size: 12px; font-weight: 600; cursor: pointer;">
            👕 Cổ Tròn
          </button>
          <button type="button" class="neckline-btn" data-type="vneck" style="padding: 8px; border-radius: 6px; border: 1.5px solid ${neckline === 'vneck' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${neckline === 'vneck' ? 'var(--color-brand-light)' : '#fff'}; font-size: 12px; font-weight: 600; cursor: pointer;">
            👗 Cổ Chữ V
          </button>
          <button type="button" class="neckline-btn" data-type="shirt" style="padding: 8px; border-radius: 6px; border: 1.5px solid ${neckline === 'shirt' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${neckline === 'shirt' ? 'var(--color-brand-light)' : '#fff'}; font-size: 12px; font-weight: 600; cursor: pointer;">
            👔 Áo Sơ Mi
          </button>
        </div>
      </div>

      <!-- Interactive SVG Collarbone Canvas -->
      <div class="pd-chain-svg-stage">
        <svg viewBox="0 0 320 230" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Head / Chin -->
          <path d="M125 10 C125 35 195 35 195 10" stroke="#C9B8A6" stroke-width="2" stroke-linecap="round"/>
          
          <!-- Neck & Shoulders -->
          <path d="M130 25 C130 70 80 95 30 115 L30 230 L290 230 L290 115 C240 95 190 70 190 25" fill="#FAF6F0" stroke="#DFCFC0" stroke-width="1.8"/>
          
          <!-- Collarbones (Xương quai xanh) -->
          <path d="M100 95 C125 105 145 98 152 104" stroke="#D3C0AF" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M220 95 C195 105 175 98 168 104" stroke="#D3C0AF" stroke-width="2.5" stroke-linecap="round"/>

          <!-- Neckline Clothes Overlay -->
          ${neckline === 'round' ? `
            <path d="M90 98 C120 135 200 135 230 98 L290 120 L290 230 L30 230 L30 120 Z" fill="#EAF1EE" stroke="#A9C4BC" stroke-width="1.5"/>
          ` : neckline === 'vneck' ? `
            <path d="M95 90 L160 160 L225 90 L290 115 L290 230 L30 230 L30 115 Z" fill="#EBF2F0" stroke="#A9C4BC" stroke-width="1.5"/>
          ` : `
            <!-- Shirt Collar -->
            <path d="M85 85 L140 135 L160 100 L180 135 L235 85 L290 115 L290 230 L30 230 L30 115 Z" fill="#FFFFFF" stroke="#BACAC4" stroke-width="1.5"/>
            <path d="M160 135 L160 230" stroke="#BACAC4" stroke-width="1.5" stroke-dasharray="3 3"/>
          `}

          <!-- Chain Path (Dynamic Curves) -->
          <path d="M136 45 Q160 ${chainBottomY * 1.05} 184 45" stroke="#9EABA7" stroke-width="3" stroke-linecap="round"/>
          <path d="M136 45 Q160 ${chainBottomY * 1.05} 184 45" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 3"/>

          <!-- Sparkle Pendant (Mặt đá) -->
          <circle cx="160" cy="${chainBottomY + 2}" r="5.5" fill="#C99738" stroke="#FFFFFF" stroke-width="1.5"/>
          <polygon points="160,${chainBottomY - 4} 163,${chainBottomY + 2} 160,${chainBottomY + 8} 157,${chainBottomY + 2}" fill="#FFF8E7"/>
        </svg>

        <div style="position: absolute; bottom: 8px; right: 10px; background: rgba(30, 93, 87, 0.9); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 12px;">
          Chiều dài: ${length} cm
        </div>
      </div>

      <!-- Slider Control -->
      <div style="margin: 16px 0 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 12.5px; font-weight: 600; color: var(--color-text-primary);">Kéo trượt điều chỉnh chiều dài:</span>
          <span style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary);">${length} cm</span>
        </div>
        <input type="range" class="pd-range-slider" id="chain-range" min="38" max="60" value="${length}" step="1">
        <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: var(--color-text-secondary); margin-top: 4px;">
          <span>38cm (Choker)</span>
          <span>42-45cm (Quai xanh)</span>
          <span>50cm (Matinee)</span>
          <span>60cm (Opera)</span>
        </div>
      </div>

      <!-- Dynamic Info Badge -->
      <div style="background: #F4F9F8; border-left: 4px solid var(--color-accent-gold); padding: 12px 14px; border-radius: 0 8px 8px 0; font-size: 12.5px;">
        <div style="font-weight: 700; color: var(--color-brand-primary); margin-bottom: 3px;">
          ✨ Dáng dây: ${info.name}
        </div>
        <div style="color: var(--color-text-secondary); line-height: 1.5;">
          ${info.desc}
        </div>
      </div>
    `;

    // Bind slider
    const slider = body.querySelector('#chain-range');
    slider.addEventListener('input', (e) => {
      length = Number(e.target.value);
      render();
    });

    // Bind necklines
    body.querySelectorAll('.neckline-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        neckline = btn.dataset.type;
        render();
      });
    });
  }

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="chain-save-btn" style="flex: 1; padding: 11px; background: var(--color-brand-light); color: var(--color-brand-primary); border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      💾 Lưu cỡ dây ${length}cm
    </button>
    <button type="button" id="chain-zalo-btn" style="flex: 1.2; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Nhờ tư vấn mẫu dây ${length}cm
    </button>
  `;

  footer.querySelector('#chain-save-btn').addEventListener('click', () => {
    saveUserJewelrySizes({ chainCm: length });
    showToast({ message: `Đã lưu độ dài dây chuyền ${length}cm vào hồ sơ của bạn!`, type: 'success' });
    close();
  });

  footer.querySelector('#chain-zalo-btn').addEventListener('click', () => {
    close();
    const msg = encodeURIComponent(`Chào Phát Đạt Jewelry, tôi muốn được tư vấn mẫu dây chuyền bạc S925 độ dài khoảng ${length}cm.`);
    window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });

  render();
}

// ══════════════════════════════════════════════════════════════
// 18. VIRTUAL WRIST STRAP SIZER & FIT ADVISOR (ROUND 22)
// ══════════════════════════════════════════════════════════════

export function openWristSizerModal(initialWristCm = 15.5) {
  let wristCm = Number(initialWristCm) || 15.5;
  let fitPreference = 'comfortable'; // 'snug' (+0.5), 'comfortable' (+1.5), 'loose' (+2.5)

  const { overlay, close } = createModalBase({
    title: 'Thước Đo Chu Vi Cổ Tay & Size Vòng Bạc',
    subtitle: 'Đo nhanh chu vi cổ tay và chọn độ ôm vừa vặn chuẩn kim hoàn',
    maxWidth: '520px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  function render() {
    const extraOffset = fitPreference === 'snug' ? 0.5 : fitPreference === 'comfortable' ? 1.5 : 2.5;
    const finalBraceletSize = (wristCm + extraOffset).toFixed(1);

    body.innerHTML = `
      <div style="background: #FDFBF7; border: 1px solid #EFE4D0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12.5px; color: #735316;">
        💡 <strong>Mẹo hay:</strong> Hầu hết lắc tay & vòng bạc S925 Phát Đạt đều tích hợp sẵn <strong>xích phụ tăng đơ 2.5cm</strong>, cho phép quý khách tự do nới rộng hoặc thắt gọn dễ dàng.
      </div>

      <!-- Wrist Slider -->
      <div style="margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <span style="font-size: 13px; font-weight: 700; color: var(--color-text-primary);">Chu vi cổ tay sát da:</span>
          <span style="font-size: 18px; font-weight: 700; color: var(--color-brand-primary);">${wristCm} cm</span>
        </div>
        <input type="range" class="pd-range-slider" id="wrist-range" min="13.5" max="19.5" value="${wristCm}" step="0.5">
        <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: var(--color-text-secondary); margin-top: 4px;">
          <span>13.5cm (Rất nhỏ)</span>
          <span>15.5cm (Nữ chuẩn)</span>
          <span>17.5cm (Vừa)</span>
          <span>19.5cm (Cổ tay lớn)</span>
        </div>
      </div>

      <!-- Fit Preference -->
      <div style="margin-bottom: 18px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 8px;">
          Sở thích độ ôm cổ tay:
        </label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          <button type="button" class="fit-btn" data-fit="snug" style="padding: 10px 8px; border-radius: 6px; border: 1.5px solid ${fitPreference === 'snug' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${fitPreference === 'snug' ? 'var(--color-brand-light)' : '#fff'}; font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">
            <div>Ôm khít</div>
            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 400;">(+0.5cm)</div>
          </button>
          <button type="button" class="fit-btn" data-fit="comfortable" style="padding: 10px 8px; border-radius: 6px; border: 1.5px solid ${fitPreference === 'comfortable' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${fitPreference === 'comfortable' ? 'var(--color-brand-light)' : '#fff'}; font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">
            <div>Vừa vặn (Chuẩn)</div>
            <div style="font-size: 10px; color: var(--color-brand-primary); font-weight: 700;">(+1.5cm)</div>
          </button>
          <button type="button" class="fit-btn" data-fit="loose" style="padding: 10px 8px; border-radius: 6px; border: 1.5px solid ${fitPreference === 'loose' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${fitPreference === 'loose' ? 'var(--color-brand-light)' : '#fff'}; font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">
            <div>Buông lơi nhẹ</div>
            <div style="font-size: 10px; color: var(--color-text-secondary); font-weight: 400;">(+2.5cm)</div>
          </button>
        </div>
      </div>

      <!-- Result Card -->
      <div style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%); color: #fff; padding: 16px; border-radius: 10px; text-align: center;">
        <div style="font-size: 12px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.05em;">Size lắc tay đề xuất của bạn</div>
        <div style="font-size: 26px; font-weight: 700; color: #FFF; margin: 4px 0;">${finalBraceletSize} cm</div>
        <div style="font-size: 12px; color: #D5EBE6;">
          (Cổ tay ${wristCm}cm + độ ôm ${extraOffset > 0 ? '+' + extraOffset : extraOffset}cm)
        </div>
      </div>
    `;

    // Events
    body.querySelector('#wrist-range').addEventListener('input', (e) => {
      wristCm = Number(e.target.value);
      render();
    });

    body.querySelectorAll('.fit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        fitPreference = btn.dataset.fit;
        render();
      });
    });
  }

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="wrist-save-btn" style="flex: 1; padding: 11px; background: var(--color-brand-light); color: var(--color-brand-primary); border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      💾 Lưu size tay
    </button>
    <button type="button" id="wrist-zalo-btn" style="flex: 1.2; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Gửi Zalo kiểm tra mẫu sẵn có
    </button>
  `;

  footer.querySelector('#wrist-save-btn').addEventListener('click', () => {
    saveUserJewelrySizes({ wristCm });
    showToast({ message: `Đã lưu size cổ tay ${wristCm}cm!`, type: 'success' });
    close();
  });

  footer.querySelector('#wrist-zalo-btn').addEventListener('click', () => {
    close();
    const msg = encodeURIComponent(`Chào Phát Đạt, chu vi cổ tay tôi là ${wristCm}cm, nhờ tiệm tư vấn các mẫu lắc tay bạc S925 vừa vặn.`);
    window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });

  render();
}

// ══════════════════════════════════════════════════════════════
// 19. GIFT PACKAGING & UNBOXING SUITE PREVIEW (ROUND 23)
// ══════════════════════════════════════════════════════════════

export function openUnboxingPreviewModal(initialPackage = 'standard') {
  let selectedPackage = initialPackage; // 'standard', 'royal', 'couple'

  const { overlay, close } = createModalBase({
    title: 'Trải Nghiệm Mở Hộp Quà Phát Đạt',
    subtitle: 'Mỗi món trang sức gửi đi đều là một tác phẩm trao gửi trọn vẹn yêu thương',
    maxWidth: '620px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  const packages = {
    standard: {
      name: 'Gói Tiêu Chuẩn Phát Đạt',
      badge: 'Miễn phí cho mọi đơn',
      color: '#1E5D57',
      items: [
        'Hộp nhung xanh ngọc Emerald ép kim vàng logo Phát Đạt',
        'Túi xách giấy sang trọng quai lụa',
        'Khăn lau bạc chuyên dụng công nghệ Microfiber',
        'Thẻ chứng thực Bạc Ý S925 & hướng dẫn bảo quản'
      ],
      desc: 'Được đóng gói cẩn thận, chỉn chu cho bản thân hoặc bạn bè thân thiết.'
    },
    royal: {
      name: 'Gói VIP Hoàng Gia (Quà Tặng & Cầu Hôn)',
      badge: 'Bộ quà tặng cao cấp',
      color: '#C99738',
      items: [
        'Hộp nhung nắp bật có đèn LED mini rọi sáng viên đá khi mở nắp',
        'Ruy băng lụa dệt kim thắt nơ nghệ nhân',
        'Thiệp chúc mừng viết tay cao cấp đóng dấu sáp niêm phong đỏ hoàng gia',
        'Túi xách giấy ép kim dập nổi',
        'Khăn lau bạc chuyên dụng & thẻ bảo hành trọn đời'
      ],
      desc: 'Hoàn hảo cho sinh nhật, kỷ niệm, 8/3, 20/10 hoặc khoảnh khắc ngỏ lời cầu hôn bất ngờ.'
    },
    couple: {
      name: 'Gói Cặp Đôi Tình Nhân Tri Kỷ',
      badge: 'Dành riêng cho nhẫn/vòng đôi',
      color: '#B84D60',
      items: [
        'Hộp nhung đôi sang trọng chứa 2 đai nhẫn/vòng tay song hành',
        'Thẻ kỷ niệm ghi dấu ngày yêu và khắc laser đồng điệu',
        'Cặp khăn lau bạc chuyên dụng',
        'Thiệp đôi thiết kế riêng theo lời nhắn quý khách'
      ],
      desc: 'Dành riêng cho các cặp đôi lưu giữ kỷ niệm tình yêu bền chặt.'
    }
  };

  function render() {
    const cur = packages[selectedPackage];

    body.innerHTML = `
      <div class="pd-unboxing-grid" style="margin-bottom: 20px;">
        <div class="pd-unboxing-card ${selectedPackage === 'standard' ? 'is-active' : ''}" data-pkg="standard">
          <div style="font-size: 22px; margin-bottom: 6px;">🎁</div>
          <div style="font-weight: 700; font-size: 13px; color: var(--color-brand-primary);">Tiêu Chuẩn</div>
          <div style="font-size: 11px; color: #27ae60; font-weight: 600; margin-top: 2px;">Miễn phí</div>
        </div>
        <div class="pd-unboxing-card ${selectedPackage === 'royal' ? 'is-active' : ''}" data-pkg="royal">
          <div style="font-size: 22px; margin-bottom: 6px;">👑</div>
          <div style="font-weight: 700; font-size: 13px; color: #A4791E;">VIP Hoàng Gia</div>
          <div style="font-size: 11px; color: #A4791E; font-weight: 600; margin-top: 2px;">Đèn LED + Dấu Sáp</div>
        </div>
        <div class="pd-unboxing-card ${selectedPackage === 'couple' ? 'is-active' : ''}" data-pkg="couple">
          <div style="font-size: 22px; margin-bottom: 6px;">💑</div>
          <div style="font-weight: 700; font-size: 13px; color: #B84D60;">Tình Nhân Đôi</div>
          <div style="font-size: 11px; color: #B84D60; font-weight: 600; margin-top: 2px;">Hộp nhẫn cặp</div>
        </div>
      </div>

      <!-- Package Detail -->
      <div style="background: #FDFBF7; border: 1.5px solid #EEDFCA; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="margin: 0; font-size: 16px; color: ${cur.color};">${cur.name}</h4>
          <span style="background: #fff; border: 1px solid ${cur.color}; color: ${cur.color}; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
            ${cur.badge}
          </span>
        </div>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px;">${cur.desc}</p>
        
        <div style="font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 8px;">
          Bộ sản phẩm bao gồm:
        </div>
        <ul style="margin: 0; padding-left: 18px; font-size: 12.5px; color: var(--color-text-primary); line-height: 1.7;">
          ${cur.items.map(it => `<li>${it}</li>`).join('')}
        </ul>
      </div>
    `;

    body.querySelectorAll('.pd-unboxing-card').forEach(c => {
      c.addEventListener('click', () => {
        selectedPackage = c.dataset.pkg;
        render();
      });
    });
  }

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="unboxing-close-btn" style="flex: 1; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng
    </button>
    <button type="button" id="unboxing-zalo-btn" style="flex: 1.5; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Yêu cầu đóng gói này khi đặt hàng
    </button>
  `;

  footer.querySelector('#unboxing-close-btn').addEventListener('click', close);
  footer.querySelector('#unboxing-zalo-btn').addEventListener('click', () => {
    close();
    const pkgName = packages[selectedPackage].name;
    const msg = encodeURIComponent(`Chào tiệm Phát Đạt, tôi muốn được đóng gói quà tặng theo [${pkgName}] cho đơn hàng trang sức của tôi.`);
    window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });

  render();
}

// ══════════════════════════════════════════════════════════════
// 20. 3-STEP JEWELRY STYLE QUIZ & MATCH SCORE (ROUND 24)
// ══════════════════════════════════════════════════════════════

export function openStyleQuizModal() {
  let step = 1;
  const answers = {
    vibe: 'minimalist', // 'minimalist', 'glamour', 'vintage', 'bold'
    skinTone: 'cool',   // 'cool', 'warm', 'neutral'
    occasion: 'daily'   // 'daily', 'date', 'party'
  };

  const { overlay, close } = createModalBase({
    title: 'Khảo Sát Phong Cách Trang Sức Cá Nhân',
    subtitle: 'Tìm ra thần thái & set trang sức Bạc S925 sinh ra dành cho bạn trong 30s',
    maxWidth: '560px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  function render() {
    if (step === 1) {
      body.innerHTML = `
        <div style="display: flex; gap: 6px; margin-bottom: 16px;">
          <div style="flex: 1; height: 4px; background: var(--color-brand-primary); border-radius: 2px;"></div>
          <div style="flex: 1; height: 4px; background: #E2ECE8; border-radius: 2px;"></div>
          <div style="flex: 1; height: 4px; background: #E2ECE8; border-radius: 2px;"></div>
        </div>
        <h4 style="margin: 0 0 4px; font-size: 15px; color: var(--color-brand-primary);">Bước 1/3: Gu thẩm mỹ yêu thích của bạn?</h4>
        <p style="font-size: 12.5px; color: var(--color-text-secondary); margin-bottom: 14px;">Chọn phong cách thể hiện đúng cá tính bạn nhất:</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="pd-quiz-option ${answers.vibe === 'minimalist' ? 'is-selected' : ''}" data-val="minimalist">
            <span style="font-size: 22px;">🌿</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Tối giản & Thanh lịch (Minimalist)</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Đường nét thanh mảnh, đá đính tinh tế, không phô trương.</div>
            </div>
          </div>
          <div class="pd-quiz-option ${answers.vibe === 'glamour' ? 'is-selected' : ''}" data-val="glamour">
            <span style="font-size: 22px;">💎</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Lấp lánh & Kiêu kỳ (Glamour Shine)</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Mặt đá Moissanite giác cắt sắc sảo, bắt sáng rực rỡ từ mọi góc nhìn.</div>
            </div>
          </div>
          <div class="pd-quiz-option ${answers.vibe === 'vintage' ? 'is-selected' : ''}" data-val="vintage">
            <span style="font-size: 22px;">⚜️</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Cổ điển & Quý phái (Vintage Royal)</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Đính đá Xà Cừ tự nhiên, họa tiết bốn lá, vương miện hoàng gia.</div>
            </div>
          </div>
          <div class="pd-quiz-option ${answers.vibe === 'bold' ? 'is-selected' : ''}" data-val="bold">
            <span style="font-size: 22px;">⚡</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Cá tính & Hiện đại (Bold Modern)</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Mắt xích Cuban, đai nhẫn bản rộng, phối layer ấn tượng.</div>
            </div>
          </div>
        </div>
      `;
    } else if (step === 2) {
      body.innerHTML = `
        <div style="display: flex; gap: 6px; margin-bottom: 16px;">
          <div style="flex: 1; height: 4px; background: var(--color-brand-primary); border-radius: 2px;"></div>
          <div style="flex: 1; height: 4px; background: var(--color-brand-primary); border-radius: 2px;"></div>
          <div style="flex: 1; height: 4px; background: #E2ECE8; border-radius: 2px;"></div>
        </div>
        <h4 style="margin: 0 0 4px; font-size: 15px; color: var(--color-brand-primary);">Bước 2/3: Tông sắc da cổ tay của bạn?</h4>
        <p style="font-size: 12.5px; color: var(--color-text-secondary); margin-bottom: 14px;">Giúp chọn lớp xi mạ Bạch Kim Rodium hay Vàng 18K tôn da nhất:</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="pd-quiz-option ${answers.skinTone === 'cool' ? 'is-selected' : ''}" data-val="cool">
            <span style="font-size: 22px;">❄️</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Tông da lạnh (Cool Undertone)</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Gân cổ tay màu xanh dương/tím. Cực kỳ tôn da với Bạc sáng S925 & xi Bạch Kim Rodium.</div>
            </div>
          </div>
          <div class="pd-quiz-option ${answers.skinTone === 'warm' ? 'is-selected' : ''}" data-val="warm">
            <span style="font-size: 22px;">☀️</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Tông da ấm (Warm Undertone)</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Gân cổ tay màu xanh lá/olive. Rất nổi bật khi xi mạ Vàng 18K hoặc Vàng hồng.</div>
            </div>
          </div>
          <div class="pd-quiz-option ${answers.skinTone === 'neutral' ? 'is-selected' : ''}" data-val="neutral">
            <span style="font-size: 22px;">🌸</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Tông da trung tính (Neutral)</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Dễ dàng tỏa sáng với bất kỳ màu xi mạ nào của Phát Đạt.</div>
            </div>
          </div>
        </div>
      `;
    } else if (step === 3) {
      body.innerHTML = `
        <div style="display: flex; gap: 6px; margin-bottom: 16px;">
          <div style="flex: 1; height: 4px; background: var(--color-brand-primary); border-radius: 2px;"></div>
          <div style="flex: 1; height: 4px; background: var(--color-brand-primary); border-radius: 2px;"></div>
          <div style="flex: 1; height: 4px; background: var(--color-brand-primary); border-radius: 2px;"></div>
        </div>
        <h4 style="margin: 0 0 4px; font-size: 15px; color: var(--color-brand-primary);">Bước 3/3: Bạn thường đeo trang sức vào dịp nào?</h4>
        <p style="font-size: 12.5px; color: var(--color-text-secondary); margin-bottom: 14px;">Xác định kích thước mặt đá và độ thoải mái khi vận động:</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="pd-quiz-option ${answers.occasion === 'daily' ? 'is-selected' : ''}" data-val="daily">
            <span style="font-size: 22px;">💼</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Đi làm công sở & đeo hàng ngày</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Êm ái, không vướng víu bàn phím hay quần áo, độ bền cao.</div>
            </div>
          </div>
          <div class="pd-quiz-option ${answers.occasion === 'date' ? 'is-selected' : ''}" data-val="date">
            <span style="font-size: 22px;">☕</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Hẹn hò, cà phê, dạo phố cuối tuần</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Điểm nhấn duyên dáng, ngọt ngào khi chụp ảnh check-in.</div>
            </div>
          </div>
          <div class="pd-quiz-option ${answers.occasion === 'party' ? 'is-selected' : ''}" data-val="party">
            <span style="font-size: 22px;">🥂</span>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Dự tiệc cưới, sự kiện sang trọng</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Tâm điểm thu hút ánh nhìn với đá tán sắc lửa mạnh mẽ.</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Step 4: Final Result
      const personaTitles = {
        minimalist: 'Nàng Thơ Tinh Tế & Thanh Lịch',
        glamour: 'Quý Cô Lấp Lánh & Rạng Rỡ',
        vintage: 'Tiểu Thư Cổ Điển & Quý Tộc',
        bold: 'Nữ Vương Hiện Đại & Phá Cách'
      };
      const title = personaTitles[answers.vibe] || 'Quý Khách Tinh Tế';
      const platingRec = answers.skinTone === 'warm' ? 'Bạc S925 xi Vàng 18K Hoàng Kim' : 'Bạc S925 xi Bạch Kim Rodium';

      // Save result
      saveStyleQuizResult({ title, answers, date: new Date().toISOString() });

      // Pick 2 matching products
      const matched = products.slice(0, 2);

      body.innerHTML = `
        <div style="text-align: center; background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%); color: #fff; border-radius: 12px; padding: 20px 16px; margin-bottom: 16px;">
          <div style="font-size: 32px; margin-bottom: 6px;">✨</div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.85;">Hồ Sơ Phong Cách Của Bạn</div>
          <h3 style="margin: 6px 0; font-size: 19px; color: #FFF8E7;">${title}</h3>
          <div style="display: inline-block; background: rgba(201, 151, 56, 0.25); border: 1px solid #C99738; color: #FFF; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-top: 4px;">
            Độ tương thích: 98%
          </div>
        </div>

        <div style="background: #F4F9F8; border: 1px solid #C5DEDB; border-radius: 10px; padding: 14px; font-size: 12.5px; line-height: 1.6; margin-bottom: 14px;">
          <div style="font-weight: 700; color: var(--color-brand-primary); margin-bottom: 4px;">
            💡 Lời khuyên từ nghệ nhân kim hoàn:
          </div>
          <div>Lớp xi mạ phù hợp nhất: <strong>${platingRec}</strong>. Hãy ưu tiên các thiết kế có đường nét thanh thoát ôm sát để phát huy trọn vẹn nét đẹp tự nhiên.</div>
        </div>

        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 8px;">
          Mẫu trang sức sinh ra dành riêng cho bạn:
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${matched.map(p => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #fff; border: 1px solid var(--color-border); border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${p.images[0]}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px;">
                <div>
                  <div style="font-weight: 600; font-size: 13px;">${p.name}</div>
                  <div style="color: var(--color-brand-primary); font-size: 12px; font-weight: 700;">${formatPrice(p.price)}</div>
                </div>
              </div>
              <button type="button" class="view-match-pdp-btn" data-id="${p.id}" style="padding: 6px 12px; background: var(--color-brand-light); color: var(--color-brand-primary); border: 1px solid var(--color-border); border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                Xem mẫu
              </button>
            </div>
          `).join('')}
        </div>
      `;

      body.querySelectorAll('.view-match-pdp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          close();
          window.location.hash = `#/product/${btn.dataset.id}`;
        });
      });
    }

    // Bind option click
    body.querySelectorAll('.pd-quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.dataset.val;
        if (step === 1) answers.vibe = val;
        else if (step === 2) answers.skinTone = val;
        else if (step === 3) answers.occasion = val;
        render();
      });
    });

    updateFooter();
  }

  function updateFooter() {
    const footer = overlay.querySelector('.pd-callback-footer');
    if (step < 4) {
      footer.innerHTML = `
        ${step > 1 ? `
          <button type="button" id="quiz-back-btn" style="flex: 1; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
            Quay lại
          </button>
        ` : ''}
        <button type="button" id="quiz-next-btn" style="flex: 2; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
          ${step === 3 ? 'Hoàn tất & Xem kết quả ✨' : 'Tiếp tục →'}
        </button>
      `;

      const back = footer.querySelector('#quiz-back-btn');
      if (back) back.addEventListener('click', () => { step--; render(); });

      footer.querySelector('#quiz-next-btn').addEventListener('click', () => {
        step++;
        render();
      });
    } else {
      footer.innerHTML = `
        <button type="button" id="quiz-finish-btn" style="flex: 1; padding: 11px; background: var(--color-brand-light); color: var(--color-brand-primary); border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
          Đóng
        </button>
        <button type="button" id="quiz-zalo-btn" style="flex: 1.5; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
          💬 Gửi gu thẩm mỹ qua Zalo
        </button>
      `;

      footer.querySelector('#quiz-finish-btn').addEventListener('click', close);
      footer.querySelector('#quiz-zalo-btn').addEventListener('click', () => {
        close();
        const msg = encodeURIComponent(`Chào Phát Đạt Jewelry, tôi vừa làm trắc nghiệm phong cách và nhận kết quả phù hợp với gu [${answers.vibe}]. Nhờ tiệm tư vấn thêm các mẫu hợp gu này nhé!`);
        window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
      });
    }
  }

  render();
}

// ══════════════════════════════════════════════════════════════
// 21. SIDE-BY-SIDE SPLIT-SCREEN COMPARISON (ROUND 25)
// ══════════════════════════════════════════════════════════════

export function openSplitScreenCompareModal(id1, id2) {
  const p1 = getProductById(id1);
  const p2 = getProductById(id2);

  if (!p1 || !p2) {
    showToast({ message: 'Vui lòng chọn ít nhất 2 sản phẩm để so sánh cận cảnh!', type: 'warning' });
    return;
  }

  const { overlay, close } = createModalBase({
    title: 'So Sánh Cận Cảnh 1:1 Song Song',
    subtitle: 'Đối chiếu trực quan chi tiết thiết kế, đá chủ & thông số kỹ thuật',
    maxWidth: '720px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  body.innerHTML = `
    <div class="pd-split-compare-grid">
      <!-- Product 1 -->
      <div class="pd-split-compare-col">
        <img src="${p1.images[0]}" alt="${p1.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
        <div style="font-weight: 700; font-size: 15px; color: var(--color-brand-primary); margin-bottom: 4px;">${p1.name}</div>
        <div style="font-size: 16px; font-weight: 700; color: #D4380D; margin-bottom: 12px;">${formatPrice(p1.price)}</div>

        <div style="font-size: 12.5px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #edf2f0; padding-top: 10px;">
          <div><span style="color: var(--color-text-secondary);">Mã:</span> <strong>${p1.reference}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Chất liệu:</span> <strong>${p1.materials}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Loại đá:</span> <strong>${p1.stones}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Bộ sưu tập:</span> <strong>${p1.collection || 'Tiêu chuẩn'}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Đánh giá:</span> <strong>⭐ ${p1.rating}/5.0</strong> (${p1.reviewsCount} lượt)</div>
        </div>

        <button type="button" class="choose-compare-pdp-btn" data-id="${p1.id}" style="margin-top: 16px; width: 100%; padding: 10px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
          Chọn Mẫu Này →
        </button>
      </div>

      <!-- Product 2 -->
      <div class="pd-split-compare-col">
        <img src="${p2.images[0]}" alt="${p2.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
        <div style="font-weight: 700; font-size: 15px; color: var(--color-brand-primary); margin-bottom: 4px;">${p2.name}</div>
        <div style="font-size: 16px; font-weight: 700; color: #D4380D; margin-bottom: 12px;">${formatPrice(p2.price)}</div>

        <div style="font-size: 12.5px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #edf2f0; padding-top: 10px;">
          <div><span style="color: var(--color-text-secondary);">Mã:</span> <strong>${p2.reference}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Chất liệu:</span> <strong>${p2.materials}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Loại đá:</span> <strong>${p2.stones}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Bộ sưu tập:</span> <strong>${p2.collection || 'Tiêu chuẩn'}</strong></div>
          <div><span style="color: var(--color-text-secondary);">Đánh giá:</span> <strong>⭐ ${p2.rating}/5.0</strong> (${p2.reviewsCount} lượt)</div>
        </div>

        <button type="button" class="choose-compare-pdp-btn" data-id="${p2.id}" style="margin-top: 16px; width: 100%; padding: 10px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
          Chọn Mẫu Này →
        </button>
      </div>
    </div>
  `;

  body.querySelectorAll('.choose-compare-pdp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      close();
      window.location.hash = `#/product/${btn.dataset.id}`;
    });
  });

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="split-compare-close" style="width: 100%; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng bảng so sánh
    </button>
  `;
  footer.querySelector('#split-compare-close').addEventListener('click', close);
}

// ══════════════════════════════════════════════════════════════
// 22. EMERGENCY SILVER RESCUE & CARE GUIDE (ROUND 27)
// ══════════════════════════════════════════════════════════════

export function openSilverRescueModal() {
  const { overlay, close } = createModalBase({
    title: 'Cẩm Nang Cấp Cứu Bạc Xỉn Màu & Vệ Sinh Cấp Tốc',
    subtitle: 'Hiểu đúng về Bạc S925 & 3 công thức làm sáng bóng trong 3 phút tại nhà',
    maxWidth: '580px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  body.innerHTML = `
    <div style="background: #FAF5E8; border: 1px solid #EADBBA; border-radius: 10px; padding: 14px; margin-bottom: 16px; font-size: 12.5px; line-height: 1.6; color: #6D4C13;">
      <div style="font-weight: 700; margin-bottom: 4px;">🔬 Khoa học về Bạc S925:</div>
      Bạc nguyên chất có tính chất hóa học hút hợp chất Lưu huỳnh (Sulfur) có trong không khí, suối nước nóng hoặc mồ hôi muối của cơ thể để tạo thành màng Bạc Sunfua (Ag2S). <strong>Đây chính là bằng chứng xác thực Bạc thật</strong>, hoàn toàn có thể phục hồi lại 100% độ sáng bóng ban đầu!
    </div>

    <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
      3 Công thức cấp cứu bạc sáng bóng tại nhà:
    </div>

    <!-- Recipe 1 -->
    <div class="pd-rescue-step-card">
      <div class="pd-rescue-badge">1</div>
      <div style="font-size: 12.5px;">
        <div style="font-weight: 700; color: var(--color-text-primary);">Phương pháp Muối + Giấy Nhôm (Bạc sáng 99% trong 2 phút)</div>
        <div style="color: var(--color-text-secondary); margin-top: 4px; line-height: 1.5;">
          Lót một miếng giấy bạc (màng nhôm bọc thực phẩm) vào đáy bát nước sôi, cho 1 thìa muối ăn và 1 thìa baking soda. Ngâm trang sức vào chạm mặt giấy nhôm. Phản ứng điện hóa sẽ chuyển lưu huỳnh sang nhôm, bạc tự động sáng bóng trở lại.
        </div>
      </div>
    </div>

    <!-- Recipe 2 -->
    <div class="pd-rescue-step-card">
      <div class="pd-rescue-badge">2</div>
      <div style="font-size: 12.5px;">
        <div style="font-weight: 700; color: var(--color-text-primary);">Kem Đánh Răng Trắng + Bàn Chải Lông Mềm</div>
        <div style="color: var(--color-text-secondary); margin-top: 4px; line-height: 1.5;">
          Thoa một lớp mỏng kem đánh răng trắng (không hạt), để 5 phút rồi dùng bàn chải lông mềm chải nhẹ nhàng các kẽ đá, xả lại với nước ấm và lau khô bằng khăn mềm.
        </div>
      </div>
    </div>

    <!-- Recipe 3 -->
    <div class="pd-rescue-step-card">
      <div class="pd-rescue-badge">3</div>
      <div style="font-size: 12.5px;">
        <div style="font-weight: 700; color: var(--color-text-primary);">Khăn Lau Bạc Chuyên Dụng Phát Đạt (Tặng kèm mỗi đơn hàng)</div>
        <div style="color: var(--color-text-secondary); margin-top: 4px; line-height: 1.5;">
          Dùng khăn lau chuyên dụng miết nhẹ lên bề mặt bạc. Các hoạt chất nano làm sáng trong khăn sẽ tẩy sạch vết xỉn mà không làm mòn đai bạc. (Lưu ý: Không giặt khăn lau bạc).
        </div>
      </div>
    </div>

    <div style="background: #F4F9F8; border-radius: 8px; padding: 12px; margin-top: 14px; text-align: center; font-size: 12.5px;">
      💎 <strong>Đặc quyền khách hàng Phát Đạt:</strong> Quý khách luôn có thể mang trang sức đến Showroom để được hấp bóng bằng <strong>Sóng Siêu Âm Miễn Phí 100% Trọn Đời</strong>.
    </div>
  `;

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="rescue-book-btn" style="flex: 1; padding: 11px; background: var(--color-brand-light); color: var(--color-brand-primary); border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      📅 Đặt lịch làm sáng bạc tại tiệm
    </button>
    <button type="button" id="rescue-zalo-btn" style="flex: 1.2; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Gửi ảnh tình trạng bạc qua Zalo
    </button>
  `;

  footer.querySelector('#rescue-book-btn').addEventListener('click', () => {
    close();
    window.location.hash = '#/stores';
  });

  footer.querySelector('#rescue-zalo-btn').addEventListener('click', () => {
    close();
    const msg = encodeURIComponent('Chào kỹ thuật viên Phát Đạt, trang sức bạc của tôi bị xỉn màu, nhờ tiệm hướng dẫn vệ sinh hoặc tôi ghé showroom làm sáng giúp tôi nhé.');
    window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });
}

// ══════════════════════════════════════════════════════════════
// 23. INTERACTIVE 4C & DIAMOND FIRE SIMULATOR (ROUND 31)
// ══════════════════════════════════════════════════════════════

export function openDiamondFireModal() {
  let stoneCut = 'round'; // 'round', 'cushion', 'princess', 'emerald'
  let lightAmbiance = 'daylight'; // 'daylight', 'showroom', 'party'

  const { overlay, close } = createModalBase({
    title: 'Mô Phỏng Độ Lửa & Tán Sắc Đá Moissanite',
    subtitle: 'Soi hiệu ứng tán sắc ánh sáng 7 màu dưới các môi trường thực tế',
    maxWidth: '560px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  function render() {
    const ambianceStyles = {
      daylight: {
        bg: 'radial-gradient(circle, #EBF5F3 0%, #B5D2CB 100%)',
        textColor: '#1E5D57',
        label: '☀️ Ánh Sáng Tự Nhiên (5500K)',
        desc: 'Độ phản chiếu trong suốt thuần khiết, lộ rõ từng giác cắt vi mô đối xứng Hearts & Arrows.',
        fireColor: 'rgba(255,255,255,0.9)'
      },
      showroom: {
        bg: 'radial-gradient(circle, #2D271D 0%, #15120C 100%)',
        textColor: '#F3D184',
        label: '💡 Đèn Showroom Hoàng Gia (3000K)',
        desc: 'Ánh vàng ấm kích hoạt độ tán sắc lửa cầu vồng rực rỡ đặc trưng của đá Moissanite cao cấp.',
        fireColor: 'rgba(243, 209, 132, 0.95)'
      },
      party: {
        bg: 'radial-gradient(circle, #1F192E 0%, #090610 100%)',
        textColor: '#D8B4FE',
        label: '🥂 Ánh Đèn Dạ Tiệc Tối (Sparkle Night)',
        desc: 'Độ lấp lánh (Scintillation) đạt đỉnh cao khi di chuyển, bắt trọn mọi ánh nhìn từ xa.',
        fireColor: 'rgba(216, 180, 254, 0.95)'
      }
    };

    const cur = ambianceStyles[lightAmbiance];

    body.innerHTML = `
      <!-- Ambiance Selector -->
      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 8px;">
          1. Chọn môi trường ánh sáng:
        </label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
          <button type="button" class="amb-btn" data-amb="daylight" style="padding: 8px 6px; border-radius: 6px; border: 1.5px solid ${lightAmbiance === 'daylight' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${lightAmbiance === 'daylight' ? 'var(--color-brand-light)' : '#fff'}; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center;">
            ☀️ Tự Nhiên
          </button>
          <button type="button" class="amb-btn" data-amb="showroom" style="padding: 8px 6px; border-radius: 6px; border: 1.5px solid ${lightAmbiance === 'showroom' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${lightAmbiance === 'showroom' ? 'var(--color-brand-light)' : '#fff'}; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center;">
            💡 Quầy Tiệm
          </button>
          <button type="button" class="amb-btn" data-amb="party" style="padding: 8px 6px; border-radius: 6px; border: 1.5px solid ${lightAmbiance === 'party' ? 'var(--color-brand-primary)' : '#dde5e2'}; background: ${lightAmbiance === 'party' ? 'var(--color-brand-light)' : '#fff'}; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center;">
            🥂 Tiệc Tối
          </button>
        </div>
      </div>

      <!-- Fire Stage Simulation -->
      <div class="pd-diamond-fire-stage" style="background: ${cur.bg};">
        <svg viewBox="0 0 160 160" class="pd-gem-sparkle-core" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Brilliant Diamond Cut Silhouette -->
          <polygon points="45,45 115,45 140,80 80,145 20,80" fill="url(#fireGradient)" stroke="#FFFFFF" stroke-width="1.8"/>
          <polygon points="45,45 80,75 115,45" fill="rgba(255,255,255,0.7)"/>
          <polygon points="20,80 80,75 45,45" fill="rgba(200,240,255,0.4)"/>
          <polygon points="140,80 80,75 115,45" fill="rgba(255,230,200,0.4)"/>
          <polygon points="20,80 80,145 80,75" fill="rgba(240,200,255,0.5)"/>
          <polygon points="140,80 80,145 80,75" fill="rgba(200,255,240,0.5)"/>

          <!-- Sparkle Cross Star -->
          <line x1="80" y1="20" x2="80" y2="140" stroke="#FFF" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="20" y1="80" x2="140" y2="80" stroke="#FFF" stroke-width="1.5" stroke-dasharray="3 3"/>

          <defs>
            <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
              <stop offset="25%" stop-color="#70E4EF" stop-opacity="0.7"/>
              <stop offset="50%" stop-color="#FFDD55" stop-opacity="0.8"/>
              <stop offset="75%" stop-color="#FF66AA" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#AA66FF" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
        </svg>

        <div style="position: absolute; bottom: 10px; font-size: 11px; font-weight: 700; color: ${cur.textColor}; background: rgba(0,0,0,0.3); padding: 3px 10px; border-radius: 12px; backdrop-filter: blur(4px);">
          ${cur.label}
        </div>
      </div>

      <!-- Description & 4C Spec -->
      <div style="background: #FAF8F5; border: 1px solid #EEDFCA; border-radius: 8px; padding: 12px 14px; margin: 14px 0 0; font-size: 12.5px; line-height: 1.55;">
        <div style="font-weight: 700; color: #8A6218; margin-bottom: 2px;">
          💎 Chỉ số quang học đá Moissanite Phát Đạt:
        </div>
        <div style="color: var(--color-text-secondary); margin-bottom: 6px;">
          ${cur.desc}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11.5px; border-top: 1px dashed #DFC9A8; padding-top: 6px; font-weight: 600; color: var(--color-brand-primary);">
          <span>Độ cứng Mohs: <strong>9.25/10</strong></span>
          <span>Chiết suất: <strong>2.65 - 2.69</strong></span>
          <span>Giác cắt: <strong>Hearts & Arrows (57 giác)</strong></span>
        </div>
      </div>
    `;

    body.querySelectorAll('.amb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        lightAmbiance = btn.dataset.amb;
        render();
      });
    });
  }

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="fire-close-btn" style="flex: 1; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng
    </button>
    <button type="button" id="fire-zalo-btn" style="flex: 1.5; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Nhận video quay viên đá thực tế qua Zalo
    </button>
  `;

  footer.querySelector('#fire-close-btn').addEventListener('click', close);
  footer.querySelector('#fire-zalo-btn').addEventListener('click', () => {
    close();
    const msg = encodeURIComponent('Chào Phát Đạt Jewelry, tôi muốn nhận video quay thực tế độ lửa của các mẫu nhẫn/mặt dây đính đá Moissanite.');
    window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });

  render();
}

// ══════════════════════════════════════════════════════════════
// 24. RING STACKING & LAYERING STUDIO (ROUND 32)
// ══════════════════════════════════════════════════════════════

export function openRingStackingModal(initialRingId = null) {
  const ringProducts = products.filter(p => p.category === 'rings');
  let ring1 = ringProducts.find(p => p.id === initialRingId) || ringProducts[0] || products[0];
  let ring2 = ringProducts[1] || products[1];

  const { overlay, close } = createModalBase({
    title: 'Xưởng Phối Nhẫn Xếp Tầng (Ring Stacking Studio)',
    subtitle: 'Thử nghiệm phối ghép 2 mẫu nhẫn đeo chồng sành điệu trên cùng một ngón tay',
    maxWidth: '620px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  function render() {
    const totalOriginal = (ring1.price || 0) + (ring2.price || 0);
    const comboDiscount = Math.round(totalOriginal * 0.1); // -10% combo
    const finalComboPrice = totalOriginal - comboDiscount;

    body.innerHTML = `
      <div class="pd-ring-stack-stage">
        <!-- Visual Finger SVG & Stacked Rings -->
        <svg viewBox="0 0 200 180" style="width: 100%; height: 100%;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Finger Contour -->
          <path d="M70,0 C70,40 68,110 65,180 L135,180 C132,110 130,40 130,0 Z" fill="#FBF6F0" stroke="#DFCFC0" stroke-width="2"/>
          <path d="M75,35 C85,38 115,38 125,35" stroke="#EADCCF" stroke-width="2" stroke-linecap="round"/>
          <path d="M73,125 C85,128 115,128 127,125" stroke="#EADCCF" stroke-width="2" stroke-linecap="round"/>

          <!-- Ring 1 (Top / Solitaire) -->
          <rect x="63" y="65" width="74" height="14" rx="4" fill="url(#silverGradient)" stroke="#8FA09C" stroke-width="1.5"/>
          <circle cx="100" cy="62" r="8" fill="#C99738" stroke="#FFFFFF" stroke-width="1.8"/>
          <polygon points="100,56 102,62 100,68 98,62" fill="#FFFFFF"/>

          <!-- Ring 2 (Bottom / Chevron or Band) -->
          <rect x="63" y="82" width="74" height="12" rx="3" fill="url(#silverGradient)" stroke="#8FA09C" stroke-width="1.5"/>
          <!-- Small Eternity Dots -->
          <circle cx="76" cy="88" r="2" fill="#FFF"/>
          <circle cx="88" cy="88" r="2" fill="#FFF"/>
          <circle cx="100" cy="88" r="2" fill="#FFF"/>
          <circle cx="112" cy="88" r="2" fill="#FFF"/>
          <circle cx="124" cy="88" r="2" fill="#FFF"/>

          <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#CFD6D4"/>
              <stop offset="50%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#B0BCB9"/>
            </linearGradient>
          </defs>
        </svg>

        <div style="position: absolute; top: 12px; right: 12px; background: rgba(30, 93, 87, 0.9); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 14px;">
          Set Nhẫn Tầng: Đẹp & Vừa Khít
        </div>
      </div>

      <!-- Ring Pickers -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div style="background: #fff; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-brand-primary); text-transform: uppercase; margin-bottom: 6px;">💍 Nhẫn chính (Mặt nổi):</div>
          <select id="stack-ring-1" class="admin-form-input" style="font-size: 12.5px; padding: 6px 8px; width: 100%;">
            ${ringProducts.map(p => `
              <option value="${p.id}" ${p.id === ring1.id ? 'selected' : ''}>${p.name} (${formatPrice(p.price, '₫', false)})</option>
            `).join('')}
          </select>
        </div>

        <div style="background: #fff; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px;">
          <div style="font-size: 11px; font-weight: 700; color: #8A6218; text-transform: uppercase; margin-bottom: 6px;">✨ Nhẫn phụ (Đai kẹp tầng):</div>
          <select id="stack-ring-2" class="admin-form-input" style="font-size: 12.5px; padding: 6px 8px; width: 100%;">
            ${ringProducts.map(p => `
              <option value="${p.id}" ${p.id === ring2.id ? 'selected' : ''}>${p.name} (${formatPrice(p.price, '₫', false)})</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Combo Price Banner -->
      <div style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%); color: #fff; border-radius: 10px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #F3D184;">Ưu đãi Combo Nhẫn Tầng (-10%)</div>
          <div style="font-size: 20px; font-weight: 700; color: #FFF; margin-top: 2px;">
            ${formatPrice(finalComboPrice, '₫', false)}
            <span style="font-size: 13px; text-decoration: line-through; opacity: 0.7; font-weight: 400; margin-left: 6px;">${formatPrice(totalOriginal, '₫', false)}</span>
          </div>
        </div>
        <div style="background: rgba(201,151,56,0.3); border: 1px solid #C99738; padding: 4px 10px; border-radius: 16px; font-size: 11.5px; font-weight: 700; color: #FFF8E7;">
          Tiết kiệm ${formatPrice(comboDiscount, '₫', false)}
        </div>
      </div>
    `;

    body.querySelector('#stack-ring-1').addEventListener('change', (e) => {
      ring1 = ringProducts.find(p => p.id === e.target.value) || ring1;
      render();
    });

    body.querySelector('#stack-ring-2').addEventListener('change', (e) => {
      ring2 = ringProducts.find(p => p.id === e.target.value) || ring2;
      render();
    });
  }

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="stack-close-btn" style="flex: 1; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng
    </button>
    <button type="button" id="stack-zalo-btn" style="flex: 1.5; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Đặt tư vấn trọn bộ Nhẫn Tầng qua Zalo
    </button>
  `;

  footer.querySelector('#stack-close-btn').addEventListener('click', close);
  footer.querySelector('#stack-zalo-btn').addEventListener('click', () => {
    close();
    const msg = encodeURIComponent(`Chào Phát Đạt, tôi muốn được tư vấn set nhẫn tầng đôi gồm: [${ring1.name}] và [${ring2.name}].`);
    window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });

  render();
}

// ══════════════════════════════════════════════════════════════
// 25. SỔ ĐO SIZE NGƯỜI THÂN & GIA ĐÌNH (ROUND 36)
// ══════════════════════════════════════════════════════════════

export function openLovedOnesSizeModal() {
  const { overlay, close } = createModalBase({
    title: 'Sổ Đo Trang Sức Người Thân & Gia Đình',
    subtitle: 'Lưu sẵn size nhẫn, cổ tay & dây chuyền của người thương để luôn tặng quà đúng ý',
    maxWidth: '560px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  function render() {
    const list = getLovedOnesSizes();

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;">
        ${list.map(item => `
          <div class="pd-loved-ones-card">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 700; font-size: 14px; color: var(--color-brand-primary);">${item.name}</span>
                <span style="background: var(--color-brand-light); color: var(--color-brand-primary); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${item.relation}</span>
              </div>
              <div style="font-size: 12.5px; color: var(--color-text-primary); margin-top: 6px; line-height: 1.5;">
                💍 Nhẫn: <strong>${item.ringSize}</strong> · 📏 Cổ tay: <strong>${item.wristSize}</strong> · ✨ Dây: <strong>${item.chainLength}</strong>
              </div>
              ${item.note ? `<div style="font-size: 11.5px; color: var(--color-text-secondary); margin-top: 2px; font-style: italic;">📝 ${item.note}</div>` : ''}
            </div>
            <button type="button" class="del-loved-btn" data-id="${item.id}" style="background: none; border: none; color: #c0392b; font-size: 16px; cursor: pointer; padding: 4px;" title="Xóa">✕</button>
          </div>
        `).join('')}
      </div>

      <!-- Add New Member Form Toggle -->
      <div style="background: #FDFBF7; border: 1px dashed var(--color-accent-gold); border-radius: 10px; padding: 14px;">
        <h4 style="margin: 0 0 10px; font-size: 13.5px; color: #8A6218;">+ Thêm hồ sơ người thân mới:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
          <input type="text" id="lo-name" class="pd-callback-input" placeholder="Tên / Biệt danh (vd: Bạn gái)">
          <input type="text" id="lo-rel" class="pd-callback-input" placeholder="Quan hệ (vd: Người yêu)">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
          <input type="text" id="lo-ring" class="pd-callback-input" placeholder="Size nhẫn (vd: Size 6)">
          <input type="text" id="lo-wrist" class="pd-callback-input" placeholder="Cổ tay (vd: 15cm)">
          <input type="text" id="lo-chain" class="pd-callback-input" placeholder="Cỡ dây (vd: 42cm)">
        </div>
        <input type="text" id="lo-note" class="pd-callback-input" placeholder="Ghi chú sở thích (vd: Thích xi bạch kim, không thích đính nhiều đá)" style="margin-bottom: 10px;">
        <button type="button" id="lo-save-btn" style="width: 100%; padding: 9px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 12.5px; font-weight: 700; cursor: pointer;">
          Lưu Vào Sổ Đo Của Tôi
        </button>
      </div>
    `;

    body.querySelectorAll('.del-loved-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteLovedOneSize(btn.dataset.id);
        render();
      });
    });

    body.querySelector('#lo-save-btn').addEventListener('click', () => {
      const name = body.querySelector('#lo-name').value.trim();
      if (!name) {
        showToast('Vui lòng nhập tên người thân!', 'warning');
        return;
      }
      saveLovedOneSize({
        name,
        relation: body.querySelector('#lo-rel').value.trim() || 'Người thân',
        ringSize: body.querySelector('#lo-ring').value.trim() || 'Freesize',
        wristSize: body.querySelector('#lo-wrist').value.trim() || '16 cm',
        chainLength: body.querySelector('#lo-chain').value.trim() || '45 cm',
        note: body.querySelector('#lo-note').value.trim()
      });
      showToast('Đã thêm hồ sơ số đo người thân!', 'success');
      render();
    });
  }

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="loved-close-btn" style="width: 100%; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng sổ đo
    </button>
  `;
  footer.querySelector('#loved-close-btn').addEventListener('click', close);

  render();
}

// ══════════════════════════════════════════════════════════════
// 26. MEN'S CONFIDENTIAL GIFT CONCIERGE (ROUND 37)
// ══════════════════════════════════════════════════════════════

export function openMenConciergeModal() {
  const { overlay, close } = createModalBase({
    title: 'Trợ Lý Quà Tặng Kín Đáo Dành Cho Nam Giới',
    subtitle: 'Bảo mật 100% · Giúp chàng chuẩn bị món quà bất ngờ hoàn hảo nhất',
    maxWidth: '540px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  let budget = '1-2tr';
  let vibe = 'sweet'; // 'sweet', 'modern', 'luxury'
  let occasion = 'birthday';

  body.innerHTML = `
    <div style="background: #0F2A27; color: #FFF; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; font-size: 12.5px; line-height: 1.6;">
      🔒 <strong>Lời nhắn dành riêng cho phái mạnh:</strong><br>
      Đừng lo nếu bạn chưa biết size nhẫn hay người thương thích kiểu gì. Hãy chọn 3 thông tin nhanh bên dưới, chuyên viên nữ tư vấn của Phát Đạt sẽ bí mật hỗ trợ bạn chuẩn bị từ kích cỡ đến thiệp chúc mừng viết tay trọn gói.
    </div>

    <!-- Budget Selection -->
    <div style="margin-bottom: 14px;">
      <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">
        1. Khoảng ngân sách dự kiến:
      </label>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
        <button type="button" class="men-budget-btn is-active" data-val="under-1tr" style="padding: 8px 6px; border-radius: 6px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-light); color: var(--color-brand-primary); font-size: 11.5px; font-weight: 700; cursor: pointer; text-align: center;">Dưới 1 Triệu</button>
        <button type="button" class="men-budget-btn" data-val="1-2tr" style="padding: 8px 6px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">1 – 2 Triệu</button>
        <button type="button" class="men-budget-btn" data-val="above-2tr" style="padding: 8px 6px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">Trên 2 Triệu</button>
      </div>
    </div>

    <!-- Girlfriend Style -->
    <div style="margin-bottom: 14px;">
      <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">
        2. Tính cách & phong cách của nàng:
      </label>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
        <button type="button" class="men-vibe-btn is-active" data-val="sweet" style="padding: 8px 6px; border-radius: 6px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-light); color: var(--color-brand-primary); font-size: 11.5px; font-weight: 700; cursor: pointer; text-align: center;">🌸 Dịu dàng, nữ tính</button>
        <button type="button" class="men-vibe-btn" data-val="modern" style="padding: 8px 6px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">💼 Tinh tế, công sở</button>
        <button type="button" class="men-vibe-btn" data-val="luxury" style="padding: 8px 6px; border-radius: 6px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">👑 Sang trọng, kiêu sa</button>
      </div>
    </div>

    <!-- Occasion -->
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">
        3. Dịp tặng quà:
      </label>
      <select id="men-occasion-sel" class="admin-form-input" style="font-size: 13px; width: 100%;">
        <option value="Sinh nhật nàng">🎂 Sinh nhật người thương</option>
        <option value="Kỷ niệm ngày yêu / Ngày cưới">💍 Kỷ niệm ngày yêu / Ngày cưới</option>
        <option value="Cầu hôn bất ngờ">✨ Cầu hôn bất ngờ</option>
        <option value="Ngày 20/10 hoặc 8/3">🌹 Quà tặng 20/10 hoặc 8/3</option>
        <option value="Tặng bất ngờ / Làm lành">🎁 Tạo bất ngờ / Làm lành ngọt ngào</option>
      </select>
    </div>
  `;

  // Sync button toggles
  body.querySelectorAll('.men-budget-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      budget = btn.dataset.val;
      body.querySelectorAll('.men-budget-btn').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.background = '#fff';
        b.style.color = 'var(--color-text-primary)';
      });
      btn.style.borderColor = 'var(--color-brand-primary)';
      btn.style.background = 'var(--color-brand-light)';
      btn.style.color = 'var(--color-brand-primary)';
    });
  });

  body.querySelectorAll('.men-vibe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      vibe = btn.dataset.val;
      body.querySelectorAll('.men-vibe-btn').forEach(b => {
        b.style.borderColor = 'var(--color-border)';
        b.style.background = '#fff';
        b.style.color = 'var(--color-text-primary)';
      });
      btn.style.borderColor = 'var(--color-brand-primary)';
      btn.style.background = 'var(--color-brand-light)';
      btn.style.color = 'var(--color-brand-primary)';
    });
  });

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="men-close-btn" style="flex: 1; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng
    </button>
    <button type="button" id="men-send-zalo-btn" style="flex: 1.8; padding: 11px; background: #0F2A27; color: #FFF8E7; border: 1px solid #C99738; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Nhận gợi ý kín đáo qua Zalo
    </button>
  `;

  footer.querySelector('#men-close-btn').addEventListener('click', close);
  footer.querySelector('#men-send-zalo-btn').addEventListener('click', () => {
    const occ = body.querySelector('#men-occasion-sel').value;
    const msg = encodeURIComponent(`Chào chuyên viên Phát Đạt, tôi là khách hàng nam muốn nhờ tiệm tư vấn kín đáo món quà cho dịp [${occ}], ngân sách khoảng [${budget}], phong cách nàng [${vibe}]. Nhờ tiệm gợi ý 2 mẫu đẹp và hỗ trợ chuẩn bị hộp quà thiệp viết tay nhé!`);
    close();
    window.open(`${siteInfo.zalo}?text=${msg}`, '_blank', 'noopener,noreferrer');
  });
}

// ══════════════════════════════════════════════════════════════
// 27. CERTIFICATE OF AUTHENTICITY & GRA SEAL (ROUND 40)
// ══════════════════════════════════════════════════════════════

export function openCertificateModal(product = null) {
  const prod = product || products[0];
  const certId = 'PD-' + Math.floor(100000 + Math.random() * 900000);

  const { overlay, close } = createModalBase({
    title: 'Chứng Thư Kiểm Định Bạc S925 & Đá Quý',
    subtitle: 'Thẻ kiểm định chính thức bảo lưu chất lượng & nguồn gốc chế tác',
    maxWidth: '560px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  body.innerHTML = `
    <div class="pd-cert-canvas">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #C99738; padding-bottom: 12px; margin-bottom: 14px;">
        <div>
          <div style="font-family: var(--font-display); font-size: 18px; font-weight: 700; color: #1E5D57; letter-spacing: 0.05em;">PHÁT ĐẠT JEWELRY</div>
          <div style="font-size: 11px; text-transform: uppercase; color: #A4791E; font-weight: 600;">Certificate of Authenticity</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 10px; color: var(--color-text-secondary);">MÃ KIỂM ĐỊNH</div>
          <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #D4380D;">${certId}</div>
        </div>
      </div>

      <div style="display: flex; gap: 14px; margin-bottom: 16px;">
        <img src="${prod.images[0]}" alt="${prod.name}" style="width: 72px; height: 72px; object-fit: cover; border-radius: 6px; border: 1.5px solid #C99738;">
        <div style="font-size: 12.5px; line-height: 1.6;">
          <div style="font-weight: 700; color: var(--color-brand-primary); font-size: 14px;">${prod.name}</div>
          <div>Mã chuẩn: <strong>${prod.reference}</strong> · Tiêu chuẩn: <strong>Bạc Ý S925</strong></div>
          <div>Đá chủ: <strong>${prod.stones || 'Moissanite Hearts & Arrows'}</strong></div>
          <div>Lớp xi phủ: <strong>Bạch Kim Rodium 3 lớp chống xỉn</strong></div>
        </div>
      </div>

      <div style="background: #FDFBF7; border: 1px solid #EEDFCA; border-radius: 6px; padding: 10px; font-size: 11.5px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center; margin-bottom: 14px;">
        <div>
          <div style="color: var(--color-text-secondary); font-size: 10px;">ĐỘ TINH KHIẾT</div>
          <div style="font-weight: 700; color: var(--color-brand-primary);">S925 (92.5%)</div>
        </div>
        <div>
          <div style="color: var(--color-text-secondary); font-size: 10px;">ĐỘ CẮT (CUT)</div>
          <div style="font-weight: 700; color: var(--color-brand-primary);">Excellent</div>
        </div>
        <div>
          <div style="color: var(--color-text-secondary); font-size: 10px;">NƯỚC ĐÁ (COLOR)</div>
          <div style="font-weight: 700; color: var(--color-brand-primary);">D (Trắng sạch)</div>
        </div>
        <div>
          <div style="color: var(--color-text-secondary); font-size: 10px;">BẢO HÀNH</div>
          <div style="font-weight: 700; color: #27ae60;">Trọn Đời</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--color-text-secondary); border-top: 1px dashed #DFC9A8; padding-top: 10px;">
        <div>Dấu chứng nhận bảo hành làm sáng siêu âm miễn phí trọn đời</div>
        <div style="font-weight: 700; color: #C99738; letter-spacing: 0.05em;">★ GENUINE GUARANTEED ★</div>
      </div>
    </div>
  `;

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="cert-close-btn" style="flex: 1; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng chứng thư
    </button>
    <button type="button" id="cert-print-btn" style="flex: 1.2; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      🖨️ In Chứng Thư
    </button>
  `;

  footer.querySelector('#cert-close-btn').addEventListener('click', close);
  footer.querySelector('#cert-print-btn').addEventListener('click', () => {
    window.print();
  });
}

// ══════════════════════════════════════════════════════════════
// 28. PENDANT PROPORTION & BODY SCALE ESTIMATOR (ROUND 34)
// ══════════════════════════════════════════════════════════════

export function openPendantScaleModal(product = null) {
  let pendantSize = 12; // default 12mm
  if (product && product.specs && product.specs.size) {
    const num = parseFloat(product.specs.size);
    if (!isNaN(num) && num >= 5 && num <= 30) pendantSize = Math.round(num);
  }
  let bodyFrame = 'balanced'; // 'petite', 'balanced', 'tall'
  let compareItem = 'coin1k'; // 'none', 'coin1k', 'coin2k', 'coin5k', 'coffee'

  const { overlay, close } = createModalBase({
    title: 'Thước Đo Tỷ Lệ Mặt Dây & Vóc Dáng Cơ Thể',
    subtitle: 'So sánh trực quan kích thước mặt dây với đồng xu & vóc dáng người đeo',
    maxWidth: '580px'
  });

  const body = overlay.querySelector('.pd-callback-body');

  function render() {
    const pxSize = pendantSize * 3.8;

    const compareObjects = {
      none: { name: 'Không so sánh', diameter: 0, desc: '' },
      coffee: { name: 'Hạt Cà Phê (10mm)', diameter: 10, color: '#6F4E37', desc: 'Tương đương 1 hạt cà phê' },
      coin1k: { name: 'Đồng xu 1.000đ (19mm)', diameter: 19, color: '#C5A059', desc: 'Đường kính 19mm chuẩn' },
      coin2k: { name: 'Đồng xu 2.000đ (22mm)', diameter: 22, color: '#D4AF37', desc: 'Đường kính 22mm chuẩn' },
      coin5k: { name: 'Đồng xu 5.000đ (25mm)', diameter: 25, color: '#B38B34', desc: 'Đường kính 25mm chuẩn' },
    };

    const selCompare = compareObjects[compareItem];

    let advice = '';
    if (bodyFrame === 'petite') {
      if (pendantSize <= 10) {
        advice = `🌟 <strong>Rất hài hòa!</strong> Với vóc dáng thon thả (&lt; 1m58), mặt dây ${pendantSize}mm giúp phần cổ thanh thoát, nhẹ nhàng, tôn nét nữ tính tự nhiên.`;
      } else if (pendantSize <= 15) {
        advice = `✨ <strong>Nổi bật vừa vặn:</strong> Mặt dây ${pendantSize}mm tạo điểm nhấn rõ nét nhưng vẫn giữ được nét thanh mảnh khi phối với áo cổ tròn hoặc sơ mi.`;
      } else {
        advice = `💎 <strong>Điểm nhấn ấn tượng:</strong> Mặt dây ${pendantSize}mm khá nổi bật trên vóc dáng nhỏ. Rất thích hợp khi bạn đi tiệc hoặc diện trang phục tối giản để mặt dây làm tâm điểm!`;
      }
    } else if (bodyFrame === 'balanced') {
      if (pendantSize < 8) {
        advice = `🌿 <strong>Dịu dàng tối giản:</strong> Kích thước ${pendantSize}mm thích hợp cho phong cách Minimalist hằng ngày, tinh tế và kín đáo.`;
      } else if (pendantSize <= 16) {
        advice = `🌟 <strong>Tỷ lệ vàng hoàn hảo!</strong> Với vóc dáng cân đối (1m58 – 1m68), mặt dây ${pendantSize}mm đạt sự cân bằng tuyệt đối giữa sự sang trọng và nét thanh lịch.`;
      } else {
        advice = `👑 <strong>Quyền quý dạ tiệc:</strong> Mặt dây ${pendantSize}mm tạo sức hút thị giác mạnh mẽ, tôn lên nét quyến rũ quý phái.`;
      }
    } else {
      if (pendantSize < 10) {
        advice = `🌿 <strong>Hạt ngọc thanh mảnh:</strong> Mặt dây ${pendantSize}mm mang lại cảm giác nhẹ nhàng, nên mix layer 2 sợi để thêm phần phong cách.`;
      } else if (pendantSize <= 18) {
        advice = `🌟 <strong>Rất cân xứng & cuốn hút:</strong> Chiều cao &gt; 1m68 giúp tôn trọn vẻ đẹp của mặt dây ${pendantSize}mm mà không hề có cảm giác nặng nề.`;
      } else {
        advice = `👑 <strong>Tuyên ngôn phong cách:</strong> Mặt dây ${pendantSize}mm khẳng định cá tính và sự quyền lực trong mọi buổi tiệc.`;
      }
    }

    body.innerHTML = `
      <div class="pd-pendant-scale-stage">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-brand-primary); font-weight: 700; margin-bottom: 8px;">
          Mô Phỏng Thực Tế: Mặt Dây ${pendantSize}mm ${compareItem !== 'none' ? `vs ${selCompare.name}` : ''}
        </div>

        <div class="pd-pendant-svg-wrap">
          <svg viewBox="0 0 360 210" width="100%" height="210" style="display: block; margin: 0 auto;">
            <defs>
              <linearGradient id="pSkinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FDF0E6"/>
                <stop offset="60%" stop-color="#F5DAC5"/>
                <stop offset="100%" stop-color="#EAC1A5"/>
              </linearGradient>
              <radialGradient id="pGemGrad" cx="35%" cy="35%" r="70%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="40%" stop-color="#E0F7FA"/>
                <stop offset="80%" stop-color="#00BCD4"/>
                <stop offset="100%" stop-color="#006064"/>
              </radialGradient>
            </defs>

            ${bodyFrame === 'petite' ? `
              <path d="M125,0 C128,60 115,100 60,135 C30,150 15,185 15,210 L345,210 C345,185 330,150 300,135 C245,100 232,60 235,0 Z" fill="url(#pSkinGrad)" stroke="rgba(180,120,80,0.2)" stroke-width="1.5"/>
              <path d="M135,135 Q180,165 225,135" fill="none" stroke="rgba(180,120,80,0.35)" stroke-width="2" stroke-linecap="round"/>
            ` : bodyFrame === 'balanced' ? `
              <path d="M120,0 C124,65 110,105 50,140 C20,155 10,185 10,210 L350,210 C350,185 340,155 310,140 C250,105 236,65 240,0 Z" fill="url(#pSkinGrad)" stroke="rgba(180,120,80,0.2)" stroke-width="1.5"/>
              <path d="M130,140 Q180,172 230,140" fill="none" stroke="rgba(180,120,80,0.35)" stroke-width="2" stroke-linecap="round"/>
            ` : `
              <path d="M115,0 C120,70 100,110 40,145 C15,160 5,190 5,210 L355,210 C355,190 345,160 320,145 C260,110 240,70 245,0 Z" fill="url(#pSkinGrad)" stroke="rgba(180,120,80,0.2)" stroke-width="1.5"/>
              <path d="M125,145 Q180,180 235,145" fill="none" stroke="rgba(180,120,80,0.35)" stroke-width="2" stroke-linecap="round"/>
            `}

            <path d="M145,15 Q180,155 215,15" fill="none" stroke="#C99738" stroke-width="1.8" stroke-dasharray="2 1.5"/>

            <g transform="translate(180, 132)">
              <rect x="-2" y="-9" width="4" height="7" rx="1.5" fill="#C99738"/>
              <circle cx="0" cy="${pxSize / 2}" r="${pxSize / 2}" fill="url(#pGemGrad)" stroke="#C99738" stroke-width="2"/>
              <polygon points="0,${pxSize/2 - pxSize/4} ${pxSize/5},${pxSize/2} 0,${pxSize/2 + pxSize/4} -${pxSize/5},${pxSize/2}" fill="#FFFFFF" opacity="0.9"/>
              <text x="0" y="${pxSize + 14}" text-anchor="middle" font-size="11" font-weight="700" fill="#143F3B">${pendantSize}mm</text>
            </g>

            ${compareItem !== 'none' ? `
              <g transform="translate(285, 120)">
                <circle cx="0" cy="0" r="${(selCompare.diameter * 3.8) / 2}" fill="${selCompare.color}" opacity="0.85" stroke="#FFFFFF" stroke-width="1.5"/>
                <text x="0" y="3" text-anchor="middle" font-size="9.5" font-weight="700" fill="#FFFFFF">${selCompare.diameter}mm</text>
                <text x="0" y="${(selCompare.diameter * 3.8) / 2 + 13}" text-anchor="middle" font-size="10" font-weight="600" fill="#666">${compareItem === 'coffee' ? 'Hạt Cà Phê' : 'Đồng Xu'}</text>
              </g>
            ` : ''}
          </svg>
        </div>
      </div>

      <div style="background: #F8FAF9; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary);">🔍 Kích thước mặt dây:</span>
          <span style="font-size: 15px; font-weight: 800; color: #D4380D;"><span id="pendant-slider-val">${pendantSize}</span> mm</span>
        </div>
        <input type="range" id="pendant-size-slider" min="6" max="25" step="1" value="${pendantSize}" class="pd-range-slider" style="cursor: pointer;">
        <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: var(--color-text-secondary); margin-top: 6px;">
          <span>6mm (Hạt nụ)</span>
          <span>10mm (Thanh lịch)</span>
          <span>15mm (Chuẩn tiệc)</span>
          <span>25mm (Bản lớn)</span>
        </div>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">
          👤 Chọn vóc dáng của bạn để nhận cố vấn tỷ lệ:
        </label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
          <button type="button" class="pd-frame-btn ${bodyFrame === 'petite' ? 'is-active' : ''}" data-frame="petite" style="padding: 8px 6px; border-radius: 6px; border: ${bodyFrame === 'petite' ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)'}; background: ${bodyFrame === 'petite' ? 'var(--color-brand-light)' : '#fff'}; color: ${bodyFrame === 'petite' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'}; font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">
            🌸 Thon thả (&lt; 1m58)
          </button>
          <button type="button" class="pd-frame-btn ${bodyFrame === 'balanced' ? 'is-active' : ''}" data-frame="balanced" style="padding: 8px 6px; border-radius: 6px; border: ${bodyFrame === 'balanced' ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)'}; background: ${bodyFrame === 'balanced' ? 'var(--color-brand-light)' : '#fff'}; color: ${bodyFrame === 'balanced' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'}; font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">
            🌿 Cân đối (1m58–1m68)
          </button>
          <button type="button" class="pd-frame-btn ${bodyFrame === 'tall' ? 'is-active' : ''}" data-frame="tall" style="padding: 8px 6px; border-radius: 6px; border: ${bodyFrame === 'tall' ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)'}; background: ${bodyFrame === 'tall' ? 'var(--color-brand-light)' : '#fff'}; color: ${bodyFrame === 'tall' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'}; font-size: 11.5px; font-weight: 600; cursor: pointer; text-align: center;">
            👑 Cao ráo (&gt; 1m68)
          </button>
        </div>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">
          🪙 So sánh kích thước trực quan với vật thật:
        </label>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${Object.keys(compareObjects).map(k => `
            <button type="button" class="pd-coin-toggle-btn ${compareItem === k ? 'is-active' : ''}" data-item="${k}" style="padding: 6px 10px; border-radius: 6px; border: ${compareItem === k ? '1.5px solid #C99738' : '1px solid var(--color-border)'}; background: ${compareItem === k ? '#FFF8E7' : '#fff'}; color: ${compareItem === k ? '#8A6218' : 'var(--color-text-primary)'}; font-size: 11.5px; font-weight: 600; cursor: pointer;">
              ${compareObjects[k].name}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="pd-pendant-advisor-box">
        ${advice}
      </div>
    `;

    const slider = body.querySelector('#pendant-size-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        pendantSize = Number(e.target.value);
        render();
      });
    }

    body.querySelectorAll('.pd-frame-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bodyFrame = btn.dataset.frame;
        render();
      });
    });

    body.querySelectorAll('.pd-coin-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        compareItem = btn.dataset.item;
        render();
      });
    });
  }

  const footer = overlay.querySelector('.pd-callback-footer');
  footer.innerHTML = `
    <button type="button" id="pendant-close-btn" style="flex: 1; padding: 11px; background: #fff; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
      Đóng
    </button>
    <button type="button" id="pendant-zalo-btn" style="flex: 1.6; padding: 11px; background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;">
      💬 Gửi số đo để tiệm tư vấn Zalo
    </button>
  `;

  footer.querySelector('#pendant-close-btn').addEventListener('click', close);
  footer.querySelector('#pendant-zalo-btn').addEventListener('click', () => {
    const text = encodeURIComponent(`Chào Phát Đạt Jewelry, mình đang xem mặt dây chuyền kích thước khoảng ${pendantSize}mm với dáng người [${bodyFrame === 'petite' ? 'Thon thả <1m58' : bodyFrame === 'balanced' ? 'Cân đối 1m58-1m68' : 'Cao ráo >1m68'}]. Nhờ tiệm gửi ảnh mẫu thật đeo trên cổ thực tế giúp mình nhé!`);
    close();
    window.open(`${siteInfo.zalo}?text=${text}`, '_blank', 'noopener,noreferrer');
  });

  render();
}





// ══════════════════════════════════════════════════════════════
// 17. CONVENIENCE SHORTCUTS
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
  digitalGiftCard: openDigitalGiftCardModal,
  coupleBuilder: openCoupleBuilderModal,
  anniversaryReminder: openAnniversaryReminderModal,
  faceHandStyling: openFaceHandStylingModal,
  chainVisualizer: openChainVisualizerModal,
  wristSizer: openWristSizerModal,
  unboxingPreview: openUnboxingPreviewModal,
  styleQuiz: openStyleQuizModal,
  splitCompare: openSplitScreenCompareModal,
  silverRescue: openSilverRescueModal,
  diamondFire: openDiamondFireModal,
  ringStacking: openRingStackingModal,
  lovedOnesSize: openLovedOnesSizeModal,
  menConcierge: openMenConciergeModal,
  certificate: openCertificateModal,
  pendantScale: openPendantScaleModal
};





