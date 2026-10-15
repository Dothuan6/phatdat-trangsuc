// ============================================================
// FEEDBACK MODAL & TOAST NOTIFICATION SYSTEM — PHÁT ĐẠT JEWELRY
// ============================================================

import '../styles/feedback.css';

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
// 4. CONVENIENCE SHORTCUTS
// ══════════════════════════════════════════════════════════════

export const toast = {
  success: (msg, title, duration) => showToast({ message: msg, title, type: 'success', duration }),
  error: (msg, title, duration) => showToast({ message: msg, title, type: 'error', duration }),
  info: (msg, title, duration) => showToast({ message: msg, title, type: 'info', duration }),
  warning: (msg, title, duration) => showToast({ message: msg, title, type: 'warning', duration }),
};

export const modal = {
  confirm: showConfirmModal,
  alert: showAlertModal
};
