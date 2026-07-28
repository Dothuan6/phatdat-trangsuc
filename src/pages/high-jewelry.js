// ============================================================
// HIGH JEWELRY PAGE
// ============================================================

import { hjCollections, hjFeatures } from '../data/collections.js';

export function renderHighJewelry(container) {
  const page = document.createElement('div');
  page.className = 'page-high-jewelry';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'hj-hero';
  hero.innerHTML = `
    <div class="hj-hero__bg">
      <div style="width:100%;height:100%;"></div>
    </div>
    <div class="hj-hero__decoration" style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); width: 45%; max-width: 500px; z-index: 2; pointer-events: none; mix-blend-mode: multiply;">
      <img src="/images/products/bracelet-2.png" style="width: 100%; height: auto; object-fit: contain; mix-blend-mode: multiply; filter: contrast(1.5) brightness(1.1);">
    </div>
    <div class="hj-hero__content" style="text-align: left;">
      <h1 class="hj-hero__title" style="font-style: normal; font-size: 2.8rem; margin-bottom: 20px; line-height: 1.15; text-align: left; white-space: nowrap;">A graphic aesthetic in<br>tribute<br>to the golden bead</h1>
      <p class="hj-hero__subtitle" style="font-size: 1rem; margin-bottom: 32px; color: var(--color-text-primary); text-align: left; max-width: 450px; line-height: 1.5;">The Perlée collection combines pure lines and<br>refined craftsmanship</p>
      <a href="#/jewelry" class="link-underline" style="font-size: 11px; letter-spacing: 0.1em; display: inline-block;">COMPOSE YOUR SET</a>
    </div>
  `;
  page.appendChild(hero);

  // ── Collections Grid ──
  const collectionsSection = document.createElement('section');
  collectionsSection.className = 'hj-collections container';

  const collectionsGrid = document.createElement('div');
  collectionsGrid.className = 'grid-3';

  hjCollections.forEach(collection => {
    const card = document.createElement('a');
    card.className = 'hj-collection-card';
    card.href = '#/jewelry';
    card.innerHTML = `
      <div style="width:100%;height:100%;background: ${collection.color}; display: flex; align-items: center; justify-content: center;">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <path d="M60 20 C30 20, 10 50, 10 80 C10 110, 35 140, 60 155 C85 140, 110 110, 110 80 C110 50, 90 20, 60 20Z" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
          <circle cx="60" cy="80" r="15" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none"/>
          <path d="M45 80 L60 65 L75 80 L60 95Z" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" fill="none"/>
        </svg>
      </div>
      <div class="hj-collection-card__overlay"></div>
      <span class="hj-collection-card__name">${collection.name}</span>
    `;
    collectionsGrid.appendChild(card);
  });

  collectionsSection.appendChild(collectionsGrid);
  page.appendChild(collectionsSection);

  // ── Feature Sections ──
  hjFeatures.forEach((feature, idx) => {
    const section = document.createElement('section');
    section.className = `hj-feature ${idx % 2 !== 0 ? 'hj-feature--reverse' : ''}`;

    const bgColors = ['#D4CFC4', '#B8C4D8'];
    const bgColor = bgColors[idx % bgColors.length];

    section.innerHTML = `
      <div class="hj-feature__image">
        <div style="width:100%;height:100%;min-height:500px;background: ${bgColor}; display: flex; align-items: center; justify-content: center;">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" opacity="0.3">
            <circle cx="100" cy="100" r="60" stroke="#2B2B2B" stroke-width="0.5"/>
            <circle cx="100" cy="100" r="40" stroke="#2B2B2B" stroke-width="0.5"/>
            <circle cx="100" cy="100" r="20" stroke="#2B2B2B" stroke-width="0.5"/>
            <path d="M60 100 L100 60 L140 100 L100 140Z" stroke="#2B2B2B" stroke-width="0.5" fill="none"/>
          </svg>
        </div>
      </div>
      <div class="hj-feature__content">
        <h2 class="hj-feature__name">${feature.title}</h2>
        <p class="hj-feature__desc">${feature.description}</p>
        <a href="${feature.ctaLink}" class="link-underline">${feature.cta.toUpperCase()}</a>
      </div>
    `;
    page.appendChild(section);
  });

  // ── Enchanting Gifts ──
  const giftsSection = document.createElement('section');
  giftsSection.className = 'hj-gifts container';
  giftsSection.innerHTML = `
    <h2>Enchanting gifts</h2>
    <div class="hj-gifts__image" style="margin-top: 32px;">
      <div style="width:100%;height:500px;background: linear-gradient(135deg, #A8B09A 0%, #C4CEB8 50%, #D8DAE8 100%); display: flex; align-items: center; justify-content: center; border-radius: 0;">
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" opacity="0.3">
          <rect x="50" y="40" width="200" height="120" rx="60" stroke="#2B2B2B" stroke-width="1" fill="none"/>
          <circle cx="90" cy="60" r="10" fill="#C5A467" opacity="0.5"/>
          <circle cx="210" cy="60" r="10" fill="#C5A467" opacity="0.5"/>
          <circle cx="150" cy="55" r="8" fill="#8B6B4A" opacity="0.5"/>
          <path d="M80 100 Q150 70 220 100" stroke="#C5A467" stroke-width="0.5" fill="none"/>
        </svg>
      </div>
    </div>
    <div style="text-align: center; margin-top: 32px;">
      <a href="#/jewelry" class="link-underline">DISCOVER OUR GIFT SELECTION</a>
    </div>
  `;
  page.appendChild(giftsSection);

  container.appendChild(page);
}
