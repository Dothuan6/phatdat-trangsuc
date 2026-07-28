// ============================================================
// JEWELRY PAGE (PLP) — Product Listing Page
// ============================================================

import { products, getProductsByCategory, categories, formatPrice } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { createFilterPanel } from '../components/filter-panel.js';
import { createBreadcrumb } from '../components/breadcrumb.js';

export function renderJewelry(container, params = {}) {
  const category = params.category || 'all';
  const page = document.createElement('div');
  page.className = 'page-jewelry';

  // Get category info
  const categoryInfo = categories.find(c => c.slug === category);
  const categoryTitle = categoryInfo ? categoryInfo.name : 'All Jewelry';
  const categoryDesc = getCategoryDescription(category);

  // Filter panel
  const { overlay: filterOverlay, panel: filterPanel, open: openFilter } = createFilterPanel();
  document.body.appendChild(filterOverlay);
  document.body.appendChild(filterPanel);

  // ── Page Header ──
  const header = document.createElement('section');
  header.className = 'plp-header container';

  const breadcrumb = createBreadcrumb('JEWELRY AND HIGH JEWELRY');
  header.appendChild(breadcrumb);

  header.innerHTML += `
    <h1 class="plp-header__title">${categoryTitle}</h1>
    <p class="plp-header__desc">${categoryDesc}</p>
  `;
  page.appendChild(header);

  // ── Filter/Sort Bar ──
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar container';
  filterBar.innerHTML = `
    <button class="filter-btn" id="open-filter-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="4" y1="6" x2="20" y2="6"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="18" x2="20" y2="18"/>
        <circle cx="8" cy="6" r="2" fill="currentColor"/>
        <circle cx="16" cy="12" r="2" fill="currentColor"/>
        <circle cx="10" cy="18" r="2" fill="currentColor"/>
      </svg>
      FILTER
    </button>
    <button class="sort-btn">
      SORT BY <span style="font-size: 10px; margin-left: 4px;">▼</span>
    </button>
  `;
  page.appendChild(filterBar);

  // Open filter handler
  filterBar.querySelector('#open-filter-btn').addEventListener('click', openFilter);

  // ── Product Grid ──
  const gridSection = document.createElement('section');
  gridSection.className = 'plp-grid container';

  const grid = document.createElement('div');
  grid.className = 'grid-3';
  grid.id = 'product-grid';

  const filteredProducts = getProductsByCategory(category);

  filteredProducts.forEach(product => {
    grid.appendChild(createProductCard(product));
  });

  gridSection.appendChild(grid);
  page.appendChild(gridSection);

  // ── Load More ──
  const loadMore = document.createElement('div');
  loadMore.className = 'load-more container';
  loadMore.innerHTML = `
    <p class="load-more__count">${filteredProducts.length} creations of ${filteredProducts.length}</p>
    <a class="link-underline" href="#" onclick="return false;">LOAD MORE</a>
  `;
  page.appendChild(loadMore);

  // ── Bottom "Our Creations" ──
  const bottomCreations = document.createElement('section');
  bottomCreations.className = 'plp-bottom-creations container';
  bottomCreations.innerHTML = `<h2>OUR CREATIONS</h2>`;

  const catGrid = document.createElement('div');
  catGrid.className = 'grid-3';

  const catColors = ['#F0EDE5', '#E8E5DD', '#EDE8F0'];
  const catSvgs = [
    `<svg width="60" height="100" viewBox="0 0 60 100"><path d="M30 5 C15 5,5 20,5 35 C5 55,20 75,30 95 C40 75,55 55,55 35 C55 20,45 5,30 5Z" stroke="#C5A467" stroke-width="1" fill="none"/></svg>`,
    `<svg width="60" height="60" viewBox="0 0 60 60"><ellipse cx="30" cy="30" rx="22" ry="25" stroke="#C5A467" stroke-width="1" fill="none"/><circle cx="30" cy="10" r="6" stroke="#C5A467" stroke-width="1" fill="none"/></svg>`,
    `<svg width="80" height="60" viewBox="0 0 80 60"><ellipse cx="40" cy="30" rx="35" ry="22" stroke="#C5A467" stroke-width="1" fill="none"/></svg>`,
  ];

  categories.filter(c => c.slug !== category).slice(0, 3).forEach((cat, idx) => {
    const card = document.createElement('a');
    card.className = 'footer-category-card';
    card.href = `#/jewelry/${cat.slug}`;
    card.innerHTML = `
      <div style="width:100%;height:100%;background: ${catColors[idx % catColors.length]}; display: flex; align-items: center; justify-content: center;">
        ${catSvgs[idx % catSvgs.length]}
      </div>
      <span class="footer-category-card__label" style="color: #2B2B2B; text-shadow: none;">${cat.name}</span>
    `;
    catGrid.appendChild(card);
  });

  bottomCreations.appendChild(catGrid);
  page.appendChild(bottomCreations);

  container.appendChild(page);

  // Cleanup
  return () => {
    filterOverlay.remove();
    filterPanel.remove();
  };
}

function getCategoryDescription(category) {
  const descriptions = {
    necklaces: 'In a dazzling range of forms and colors, necklaces drape the neck with gold, precious, fine or hard stones. Long necklaces – like the iconic Phat Dat Jewelry\' Alhambra® model created in 1968 – can be worn in multiple ways to suit every occasion.',
    rings: 'Phat Dat Jewelry rings are miniature works of art, celebrating flowers, nature and the poetry of life. Each creation reveals exceptional savoir-faire and a passion for precious stones.',
    bracelets: 'From the iconic Alhambra motif to the golden beads of Perlée, Phat Dat Jewelry bracelets adorn the wrist with grace and elegance, reflecting the Maison\'s creative universe.',
    earrings: 'Earrings by Phat Dat Jewelry illuminate the face with their radiance. From delicate studs to sculptural ear clips, each pair embodies the Maison\'s love of nature and beautiful stones.',
    all: 'Discover the world of Phat Dat Jewelry jewelry creations. From the iconic Alhambra collection to the golden beads of Perlée, each piece reflects the Maison\'s tradition of excellence and poetic creativity.',
  };
  return descriptions[category] || descriptions.all;
}
