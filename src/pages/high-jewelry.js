// ============================================================
// HIGH JEWELRY PAGE — Trang sức cao cấp / Bộ sưu tập
// ============================================================

import { hjCollections, hjFeatures } from '../data/collections.js';
import { createCollectionCard } from './home.js';
import { t } from '../i18n.js';

export function renderHighJewelry(container) {
  const page = document.createElement('div');
  page.className = 'page-high-jewelry';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'hj-hero hero';
  hero.innerHTML = `
    <div class="hj-hero__bg"></div>
    <div class="hero__decoration">
      <img src="./images/products/bongtay1.1-removebg-preview.png" alt="Bông tai Phát Đạt Jewelry">
    </div>
    <div class="hj-hero__content hero__content">
      <h1 class="hero__title">${t('hero.title')}</h1>
      <p class="hero__subtitle">${t('hero.subtitle')}</p>
      <a href="#/jewelry" class="link-underline">${t('common.composeSet')}</a>
    </div>
  `;
  page.appendChild(hero);

  // ── Collections Grid ──
  const collectionsSection = document.createElement('section');
  collectionsSection.className = 'hj-collections container';
  collectionsSection.innerHTML = `<h2 class="section-heading">Tất Cả Bộ Sưu Tập</h2>`;
  const collectionsGrid = document.createElement('div');
  collectionsGrid.className = 'grid-3';
  hjCollections.forEach(c => collectionsGrid.appendChild(createCollectionCard(c)));
  collectionsSection.appendChild(collectionsGrid);
  page.appendChild(collectionsSection);

  // ── Feature Sections ──
  hjFeatures.forEach((feature, idx) => {
    const section = document.createElement('section');
    section.className = `hj-feature ${idx % 2 !== 0 ? 'hj-feature--reverse' : ''}`;
    section.innerHTML = `
      <div class="hj-feature__image">
        <img src="${feature.image}" alt="${t(`features.${feature.id}.title`)}" loading="lazy">
      </div>
      <div class="hj-feature__content">
        <h2 class="hj-feature__name">${t(`features.${feature.id}.title`)}</h2>
        <p class="hj-feature__desc">${t(`features.${feature.id}.description`)}</p>
        <a href="${feature.ctaLink}" class="link-underline">${t(`features.${feature.id}.cta`)}</a>
      </div>
    `;
    page.appendChild(section);
  });

  // ── Enchanting Gifts ──
  const giftsSection = document.createElement('section');
  giftsSection.className = 'hj-gifts container';
  giftsSection.innerHTML = `
    <h2>${t('hero.giftsTitle')}</h2>
    <div class="hj-gifts__image">
      <img src="./images/gallery/g2.jpg" alt="Quà tặng trang sức Phát Đạt Jewelry" loading="lazy">
    </div>
    <div style="text-align: center; margin-top: 32px;">
      <a href="#/info/gifting" class="link-underline">${t('common.discoverGift')}</a>
    </div>
  `;
  page.appendChild(giftsSection);

  container.appendChild(page);
}
