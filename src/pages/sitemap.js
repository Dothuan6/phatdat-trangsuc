// ============================================================
// SITEMAP PAGE
// ============================================================

import { hjCollections } from '../data/collections.js';
import { infoPages } from './info.js';

export function renderSitemap(container) {
  const page = document.createElement('div');
  page.className = 'page-sitemap container section';
  page.innerHTML = `
    <h1 class="section-heading">Sơ Đồ Trang Web</h1>
    <div class="sitemap-grid">
      <div><h2>Trang chính</h2><ul>
        <li><a href="#/">Trang chủ</a></li>
        <li><a href="#/about">Về chúng tôi</a></li>
        <li><a href="#/stores">Cửa hàng</a></li>
        <li><a href="#/contact">Liên hệ</a></li>
        <li><a href="#/wishlist">Yêu thích</a></li>
      </ul></div>
      <div><h2>Trang sức</h2><ul>
        <li><a href="#/jewelry">Tất cả trang sức</a></li>
        <li><a href="#/jewelry/necklaces">Dây chuyền & Mặt dây chuyền</a></li>
        <li><a href="#/jewelry/rings">Nhẫn</a></li>
        <li><a href="#/jewelry/bracelets">Vòng tay</a></li>
        <li><a href="#/jewelry/earrings">Hoa tai</a></li>
      </ul></div>
      <div><h2>Bộ sưu tập</h2><ul>
        <li><a href="#/high-jewelry">Tất cả bộ sưu tập</a></li>
        ${hjCollections.map(c => `<li><a href="#/collections/${c.id}">${c.name}</a></li>`).join('')}
      </ul></div>
      <div><h2>Dịch vụ & Pháp lý</h2><ul>
        ${Object.entries(infoPages).map(([slug, p]) => `<li><a href="#/info/${slug}">${p.title}</a></li>`).join('')}
        <li><a href="#/legal/privacy-policy">Chính sách bảo mật</a></li>
        <li><a href="#/legal/terms-of-use">Điều khoản sử dụng</a></li>
      </ul></div>
    </div>
  `;
  container.appendChild(page);
}
