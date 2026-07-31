// ============================================================
// NOT FOUND PAGE (404)
// ============================================================

import { t } from '../i18n.js';

export function renderNotFound(container) {
  const page = document.createElement('div');
  page.className = 'page-not-found container section text-center';
  page.style.minHeight = '60vh';
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  page.style.alignItems = 'center';
  page.style.justifyContent = 'center';

  page.innerHTML = `
    <h1 style="font-family: var(--font-display); font-size: 6rem; margin-bottom: 24px; color: var(--color-primary);">404</h1>
    <h2 style="font-size: 2rem; margin-bottom: 16px;">${t('notFound.title') || 'Không Tìm Thấy Trang'}</h2>
    <p style="margin-bottom: 32px; color: var(--color-text-secondary); max-width: 500px;">
      ${t('notFound.desc') || 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại, đã bị xóa, đổi tên hoặc tạm thời không truy cập được.'}
    </p>
    <a href="#/" class="btn">${t('notFound.backHome') || 'QUAY VỀ TRANG CHỦ'}</a>
  `;

  container.appendChild(page);
}
