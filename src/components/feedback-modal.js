// ============================================================
// FEEDBACK MODAL & TOAST NOTIFICATION SYSTEM — PHÁT ĐẠT JEWELRY
// ============================================================

import '../styles/feedback.css';
import { addCustomerContact } from '../services/supabase.js';

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
// 5. QUICK CALLBACK REQUEST MODAL (Yêu cầu gọi lại tư vấn)
// ══════════════════════════════════════════════════════════════

export function openQuickCallbackModal(product) {
  const overlay = document.createElement('div');
  overlay.className = 'pd-callback-overlay';

  const defaultImg = (product && product.images && product.images[0]) || './images/products/Daychuyen4.3-removebg-preview.png';
  const priceDisplay = product ? `${(product.price || 0).toLocaleString('vi-VN')} ₫` : '';

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
        <img src="${defaultImg}" alt="${product?.name || ''}">
        <div>
          <div style="font-weight: 600; font-size: 13px; color: var(--color-text-primary);">${product?.name || 'Trang sức Phát Đạt'}</div>
          <div style="font-size: 12px; color: var(--color-brand-primary); font-weight: 600; margin-top: 2px;">
            ${priceDisplay} <span style="color: var(--color-text-secondary); font-weight: normal; margin-left: 6px;">Mã: ${product?.reference || ''}</span>
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
            <label for="cb-note">Ghi chú yêu cầu tư vấn</label>
            <input type="text" id="cb-note" class="pd-callback-input" placeholder="VD: Cần tư vấn size tay, hoặc quà sinh nhật...">
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

  // Submit Handler
  overlay.querySelector('#pd-callback-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = overlay.querySelector('#cb-phone').value.trim();
    const name = overlay.querySelector('#cb-name').value.trim();
    const note = overlay.querySelector('#cb-note').value.trim();
    const submitBtn = overlay.querySelector('#cb-submit-btn');

    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;

    try {
      await addCustomerContact({
        fullName: name || 'Khách hàng quan tâm ' + (product?.name || 'sản phẩm'),
        phone: phone,
        subject: `Tư vấn SP: ${product?.name || ''} (${product?.reference || ''})`,
        message: `Khách yêu cầu gọi lại tư vấn mẫu: ${product?.name || ''} - Giá: ${priceDisplay}. Ghi chú: ${note || 'Không có'}`
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
// 6. CONVENIENCE SHORTCUTS
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
  callback: openQuickCallbackModal
};

