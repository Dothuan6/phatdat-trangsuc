// ============================================================
// STORES PAGE — Cửa hàng & bản đồ
// ============================================================

import { siteInfo } from '../data/site-info.js';

export function renderStores(container) {
  const page = document.createElement('div');
  page.className = 'page-stores';
  page.innerHTML = `
    <section class="info-hero">
      <img src="./images/gallery/g9.jpg" alt="Cửa hàng Phát Đạt Jewelry">
      <h1>Cửa Hàng Phát Đạt Jewelry</h1>
    </section>
    <div class="info-body" style="max-width: 1000px;">
      <div class="contact-cards">
        <a class="contact-card" href="${siteInfo.mapsLink}" target="_blank" rel="noopener">
          <h3>Địa chỉ</h3><p>${siteInfo.address}</p>
        </a>
        <a class="contact-card" href="${siteInfo.phoneHref}">
          <h3>Điện thoại</h3><p>${siteInfo.phoneDisplay}</p>
        </a>
        <div class="contact-card">
          <h3>Giờ làm việc</h3><p>${siteInfo.hours}</p>
        </div>
      </div>
      <iframe class="map-embed" src="${siteInfo.mapsEmbed}" loading="lazy" title="Bản đồ cửa hàng" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="text-center" style="margin-top: 24px;">
        <a href="${siteInfo.mapsLink}" target="_blank" rel="noopener" class="btn">CHỈ ĐƯỜNG GOOGLE MAPS</a>
      </div>
    </div>
  `;
  container.appendChild(page);
}
