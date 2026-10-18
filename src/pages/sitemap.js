// ============================================================
// SITEMAP PAGE — Sơ đồ trang web & Trung tâm tiện ích nhanh
// ============================================================

import { hjCollections } from '../data/collections.js';
import { infoPages } from './info.js';
import {
  openGiftFinderModal,
  openFengShuiMatcherModal,
  openWarrantyLookupModal
} from '../components/feedback-modal.js';
import { openGlobalSizeGuide } from '../components/size-guide-modal.js';

export function renderSitemap(container) {
  const page = document.createElement('div');
  page.className = 'page-sitemap container section';
  page.innerHTML = `
    <h1 class="section-heading" style="color: var(--color-brand-primary);">Sơ Đồ Trang Web & Tiện Ích Trực Tuyến</h1>
    <p style="text-align: center; color: var(--color-text-secondary); max-width: 620px; margin: -12px auto 32px; font-size: 14px;">
      Tra cứu nhanh toàn bộ danh mục trang sức Bạc S925, bộ sưu tập và các công cụ tư vấn thông minh của Phát Đạt Jewelry.
    </p>

    <!-- Interactive Quick Tools Banner -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-bottom: 36px;">
      <button type="button" id="sm-tool-ruler" style="padding: 16px; border-radius: 10px; border: 1px solid #C5DEDB; background: #F4F9F8; text-align: left; cursor: pointer;">
        <div style="font-size: 20px; margin-bottom: 6px;">📏</div>
        <div style="font-weight: 700; color: var(--color-brand-primary); font-size: 14px;">Đo Size Nhẫn Trực Tuyến</div>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Đặt nhẫn lên màn hình đo chính xác mm</div>
      </button>
      <button type="button" id="sm-tool-fengshui" style="padding: 16px; border-radius: 10px; border: 1px solid #E5C158; background: #FFF9EB; text-align: left; cursor: pointer;">
        <div style="font-size: 20px; margin-bottom: 6px;">🔮</div>
        <div style="font-weight: 700; color: #7A5411; font-size: 14px;">Chọn Đá Hợp Bản Mệnh</div>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Gợi ý theo Ngũ Hành Kim Mộc Thủy Hỏa Thổ</div>
      </button>
      <button type="button" id="sm-tool-gift" style="padding: 16px; border-radius: 10px; border: 1px solid #E5DEC9; background: #FBF9F5; text-align: left; cursor: pointer;">
        <div style="font-size: 20px; margin-bottom: 6px;">🎁</div>
        <div style="font-weight: 700; color: var(--color-brand-primary); font-size: 14px;">Trợ Lý Chọn Quà 30 Giây</div>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Tìm món quà ý nghĩa theo ngân sách</div>
      </button>
      <button type="button" id="sm-tool-warranty" style="padding: 16px; border-radius: 10px; border: 1px solid var(--color-border); background: #fff; text-align: left; cursor: pointer;">
        <div style="font-size: 20px; margin-bottom: 6px;">🛡️</div>
        <div style="font-weight: 700; color: var(--color-brand-primary); font-size: 14px;">Tra Cứu Thẻ Bảo Hành SĐT</div>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Kích hoạt làm sáng bạc miễn phí trọn đời</div>
      </button>
    </div>

    <div class="sitemap-grid">
      <div><h2>Trang chính</h2><ul>
        <li><a href="#/">Trang chủ</a></li>
        <li><a href="#/about">Về Phát Đạt Jewelry</a></li>
        <li><a href="#/stores">Cửa hàng & Đặt lịch hẹn</a></li>
        <li><a href="#/contact">Liên hệ & Gửi yêu cầu tư vấn</a></li>
        <li><a href="#/wishlist">Danh sách Yêu thích</a></li>
      </ul></div>
      <div><h2>Danh mục Trang sức</h2><ul>
        <li><a href="#/jewelry">Tất cả trang sức Bạc S925</a></li>
        <li><a href="#/jewelry/necklaces">Dây chuyền & Mặt dây chuyền</a></li>
        <li><a href="#/jewelry/rings">Nhẫn Bạc 925 & Moissanite</a></li>
        <li><a href="#/jewelry/bracelets">Lắc tay & Vòng tay</a></li>
        <li><a href="#/jewelry/earrings">Bông tai & Hoa tai</a></li>
      </ul></div>
      <div><h2>Bộ sưu tập Nổi bật</h2><ul>
        <li><a href="#/high-jewelry">Tất cả bộ sưu tập</a></li>
        ${hjCollections.map(c => `<li><a href="#/collections/${c.id}">${c.name}</a></li>`).join('')}
      </ul></div>
      <div><h2>Cẩm nang, Dịch vụ & Pháp lý</h2><ul>
        ${Object.entries(infoPages).map(([slug, p]) => `<li><a href="#/info/${slug}">${p.title}</a></li>`).join('')}
        <li><a href="#/legal/privacy-policy">Chính sách bảo mật</a></li>
        <li><a href="#/legal/terms-of-use">Điều khoản sử dụng</a></li>
        <li><a href="#/legal/silver-guarantee">Cam kết chất lượng Bạc S925</a></li>
      </ul></div>
    </div>
  `;

  page.querySelector('#sm-tool-ruler').addEventListener('click', () => openGlobalSizeGuide('ruler'));
  page.querySelector('#sm-tool-fengshui').addEventListener('click', () => openFengShuiMatcherModal());
  page.querySelector('#sm-tool-gift').addEventListener('click', () => openGiftFinderModal());
  page.querySelector('#sm-tool-warranty').addEventListener('click', () => openWarrantyLookupModal());

  container.appendChild(page);
}
