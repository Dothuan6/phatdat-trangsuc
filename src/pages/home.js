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
    <div class="hj-hero__bg" style="background: linear-gradient(135deg, #f7f5f0 0%, #e6e1d6 100%);"></div>
    <div class="hero__decoration">
      <img src="./images/products/Daychuyen4.3-removebg-preview.png" alt="Dây chuyền Phát Đạt Jewelry">
    </div>
    <div class="hj-hero__content hero__content">
      <h1 class="hero__title">${t('home.heroTitle')}</h1>
      <p class="hero__subtitle">${t('home.heroSubtitle')}</p>
      <a href="#/jewelry" class="btn">${t('home.discover')}</a>
    </div>
  `;
  page.appendChild(hero);

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
