// ============================================================
// HIGH JEWELRY PAGE — Trang sức cao cấp / Bộ sưu tập
// ============================================================

import { hjCollections, hjFeatures } from '../data/collections.js';
import { createCollectionCard } from './home.js';
import { t } from '../i18n.js';
import { openGiftFinderModal } from '../components/feedback-modal.js';

export function renderHighJewelry(container) {
  const page = document.createElement('div');
  page.className = 'page-high-jewelry';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'hj-hero hero';
  hero.innerHTML = `
    <div class="hj-hero__bg" style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%);"></div>
    <div class="hero__decoration">
      <img src="./images/products/bongtay1.1-removebg-preview.png" alt="Bông tai Phát Đạt Jewelry">
    </div>
    <div class="hj-hero__content hero__content" style="color: #ffffff;">
      <span style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent-gold); display: block; margin-bottom: 10px; font-weight: 700;">BỘ SƯU TẬP ĐẶC TRƯNG</span>
      <h1 class="hero__title" style="color: #ffffff; font-family: var(--font-display);">Tuyển Tập Chế Tác Bạc S925 Phát Đạt</h1>
      <p class="hero__subtitle" style="color: rgba(255,255,255,0.85); max-width: 540px; margin: 0 auto 24px;">Mỗi bộ sưu tập là một câu chuyện về sự may mắn, vẻ đẹp thanh lịch và nghệ thuật chế tác đá Moissanite & xà cừ tinh xảo.</p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="#/jewelry" class="btn" style="background-color: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 700;">XEM TOÀN BỘ SẢN PHẨM</a>
        <button type="button" id="hj-gift-quiz-btn" class="btn" style="background: rgba(255,255,255,0.12); border-color: #ffffff; color: #ffffff;">🎁 CHỌN QUÀ TẶNG 30S</button>
      </div>
    </div>
  `;
  page.appendChild(hero);
  hero.querySelector('#hj-gift-quiz-btn').addEventListener('click', () => openGiftFinderModal());

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
    <div style="text-align: center; margin-top: 32px; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
      <button type="button" id="hj-bottom-gift-btn" class="btn" style="background: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">🎁 TÌM QUÀ TẶNG THEO NGÂN SÁCH</button>
      <a href="#/info/gifting" class="btn">XEM NGHỆ THUẬT QUÀ TẶNG</a>
    </div>
  `;
  page.appendChild(giftsSection);
  giftsSection.querySelector('#hj-bottom-gift-btn').addEventListener('click', () => openGiftFinderModal());

  container.appendChild(page);
}

