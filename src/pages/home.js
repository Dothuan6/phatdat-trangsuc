// ============================================================
// HOME PAGE
// ============================================================

import { hjCollections } from '../data/collections.js';
import { products } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { siteInfo } from '../data/site-info.js';
import { t } from '../i18n.js';

export function renderHome(container) {
  const page = document.createElement('div');
  page.className = 'page-home';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'hj-hero hero';
  hero.innerHTML = `
    <div class="hj-hero__bg" style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%);"></div>
    <div class="hero__decoration">
      <img src="./images/products/Daychuyen4.3-removebg-preview.png" alt="Dây chuyền Phát Đạt Jewelry">
    </div>
    <div class="hj-hero__content hero__content" style="color: #ffffff;">
      <span style="font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent-gold); display: block; margin-bottom: 12px; font-weight: 600;">PHÁT ĐẠT JEWELRY</span>
      <h1 class="hero__title" style="color: #ffffff; font-family: var(--font-display);">Trang Sức Bạc 925 Tinh Tế & Quý Phái</h1>
      <p class="hero__subtitle" style="color: rgba(255,255,255,0.85); font-size: 15px; max-width: 540px; margin: 0 auto 28px;">Tuyển tập các mẫu dây chuyền cỏ ba lá, nhẫn đính đá moissanite và lắc tay xà cừ chế tác tinh xảo, giá từ 129.000₫.</p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="#/jewelry" class="btn" style="background-color: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 600;">XEM TẤT CẢ SẢN PHẨM</a>
        <a href="#/collections/co-ba-la" class="btn" style="background: transparent; border-color: #ffffff; color: #ffffff;">BST CỎ BA LÁ</a>
      </div>
    </div>
  `;
  page.appendChild(hero);

  // ── USP Commitment Strip ──
  const uspStrip = document.createElement('section');
  uspStrip.className = 'usp-strip';
  uspStrip.style.cssText = `
    background: #ffffff;
    border-bottom: 1px solid var(--color-border);
    padding: 24px 0;
  `;
  uspStrip.innerHTML = `
    <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">🛡️</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Bạc 925 Chuẩn Quốc Tế</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Sáng bóng, an toàn cho da</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">✨</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Làm Sáng Trọn Đời</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Đánh bóng & vệ sinh miễn phí</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">🎁</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Tặng Trọn Bộ Hộp Quà</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Kèm khăn lau bạc cao cấp</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">🚚</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Giao Hàng & Đồng Kiểm</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Kiểm tra hàng trước nhận</div>
        </div>
      </div>
    </div>
  `;
  page.appendChild(uspStrip);

  // ── Collections Grid ──
  const collectionsSection = document.createElement('section');
  collectionsSection.className = 'hj-collections container';
  collectionsSection.innerHTML = `<h2 class="section-heading">${t('home.collectionsTitle')}</h2>`;

  const collectionsGrid = document.createElement('div');
  collectionsGrid.className = 'grid-3';
  hjCollections.slice(0, 3).forEach(collection => {
    collectionsGrid.appendChild(createCollectionCard(collection));
  });
  collectionsSection.appendChild(collectionsGrid);
  collectionsSection.insertAdjacentHTML('beforeend',
    `<div class="text-center" style="margin-top: 32px;"><a href="#/high-jewelry" class="link-underline">XEM TẤT CẢ BỘ SƯU TẬP</a></div>`);
  page.appendChild(collectionsSection);

  // ── Featured Products ──
  const featured = document.createElement('section');
  featured.className = 'container section-pad';
  featured.innerHTML = `<h2 class="section-heading">Sản Phẩm Nổi Bật</h2>`;
  const grid = document.createElement('div');
  grid.className = 'grid-3';
  products.slice(0, 6).forEach(p => grid.appendChild(createProductCard(p)));
  featured.appendChild(grid);
  featured.insertAdjacentHTML('beforeend',
    `<div class="text-center" style="margin-top: 32px;"><a href="#/jewelry" class="btn">XEM TẤT CẢ TRANG SỨC</a></div>`);
  page.appendChild(featured);

  // ── Store strip ──
  const store = document.createElement('section');
  store.className = 'store-strip';
  store.innerHTML = `
    <div class="container store-strip__inner">
      <div class="store-strip__img"><img src="./images/gallery/g9.jpg" alt="Cửa hàng Phát Đạt Jewelry" loading="lazy"></div>
      <div class="store-strip__info">
        <h2 class="section-heading" style="text-align:left;">Ghé thăm cửa hàng</h2>
        <p><strong>Địa chỉ:</strong> ${siteInfo.address}</p>
        <p><strong>Điện thoại:</strong> <a href="${siteInfo.phoneHref}">${siteInfo.phoneDisplay}</a></p>
        <p><strong>Giờ làm việc:</strong> ${siteInfo.hours}</p>
        <div class="store-strip__actions">
          <a href="#/stores" class="btn">XEM BẢN ĐỒ</a>
          <a href="${siteInfo.phoneHref}" class="link-underline">GỌI NGAY</a>
        </div>
      </div>
    </div>
  `;
  page.appendChild(store);

  container.appendChild(page);
}

export function createCollectionCard(collection) {
  const card = document.createElement('a');
  card.className = 'hj-collection-card';
  card.href = `#/collections/${collection.id}`;
  card.innerHTML = `
    <img src="${collection.image}" alt="Bộ sưu tập ${collection.name}" loading="lazy">
    <div class="hj-collection-card__overlay"></div>
    <span class="hj-collection-card__name">${collection.name}</span>
  `;
  return card;
}
