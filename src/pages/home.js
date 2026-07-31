// ============================================================
// HOME PAGE
// ============================================================

import { hjCollections } from '../data/collections.js';
import { t } from '../i18n.js';

export function renderHome(container) {
  const page = document.createElement('div');
  page.className = 'page-home';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'hj-hero'; // Reuse high jewelry styles for hero
  hero.innerHTML = `
    <div class="hj-hero__bg" style="background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);">
      <div style="width:100%;height:100%;"></div>
    </div>
    <div class="hj-hero__decoration" style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); width: 45%; max-width: 500px; z-index: 2; pointer-events: none; mix-blend-mode: multiply;">
      <img src="/images/products/necklace-1.png" style="width: 100%; height: auto; object-fit: contain; mix-blend-mode: multiply; filter: contrast(1.2) brightness(1.1);" onerror="this.onerror=null; this.style.display='none';">
    </div>
    <div class="hj-hero__content" style="text-align: left;">
      <h1 class="hj-hero__title" style="font-style: normal; font-size: 3rem; margin-bottom: 20px; line-height: 1.15; text-align: left;">${t('home.heroTitle') || 'Tuyệt tác<br>Trang sức'}</h1>
      <p class="hj-hero__subtitle" style="font-size: 1rem; margin-bottom: 32px; color: var(--color-text-primary); text-align: left; max-width: 450px; line-height: 1.5;">${t('home.heroSubtitle') || 'Khám phá thế giới lấp lánh của những bộ sưu tập trang sức tinh tế, tôn vinh vẻ đẹp vĩnh cửu.'}</p>
      <a href="#/jewelry" class="btn">${t('home.discover') || 'KHÁM PHÁ NGAY'}</a>
    </div>
  `;
  page.appendChild(hero);

  // ── Collections Grid ──
  const collectionsSection = document.createElement('section');
  collectionsSection.className = 'hj-collections container';
  
  const sectionTitle = document.createElement('h2');
  sectionTitle.style.textAlign = 'center';
  sectionTitle.style.marginBottom = '40px';
  sectionTitle.textContent = t('home.collectionsTitle') || 'Bộ Sưu Tập Nổi Bật';
  collectionsSection.appendChild(sectionTitle);

  const collectionsGrid = document.createElement('div');
  collectionsGrid.className = 'grid-3';

  // Take first 3 collections
  hjCollections.slice(0, 3).forEach(collection => {
    const card = document.createElement('a');
    card.className = 'hj-collection-card';
    card.href = '#/jewelry';
    card.innerHTML = `
      <div style="width:100%;height:100%;background: ${collection.color}; display: flex; align-items: center; justify-content: center;">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <path d="M60 20 C30 20, 10 50, 10 80 C10 110, 35 140, 60 155 C85 140, 110 110, 110 80 C110 50, 90 20, 60 20Z" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
          <circle cx="60" cy="80" r="15" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none"/>
        </svg>
      </div>
      <div class="hj-collection-card__overlay"></div>
      <span class="hj-collection-card__name">${t(`collections.${collection.id}.name`)}</span>
    `;
    collectionsGrid.appendChild(card);
  });

  collectionsSection.appendChild(collectionsGrid);
  page.appendChild(collectionsSection);

  container.appendChild(page);
}
