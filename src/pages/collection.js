// ============================================================
// COLLECTION & SEARCH PAGES
// ============================================================

import { getCollectionBySlug } from '../data/collections.js';
import { getProductsByCollection, searchProducts } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';

function renderGrid(list) {
  const grid = document.createElement('div');
  grid.className = 'grid-3';
  list.forEach(p => grid.appendChild(createProductCard(p)));
  return grid;
}

export function renderCollection(container, params = {}) {
  const collection = getCollectionBySlug(params.id);
  if (!collection) {
    window.location.hash = '/404';
    return;
  }
  const list = getProductsByCollection(collection.id);
  const page = document.createElement('div');
  page.className = 'page-collection';
  page.innerHTML = `
    <section class="info-hero">
      <img src="${collection.image}" alt="Bộ sưu tập ${collection.name}">
      <h1>Bộ sưu tập ${collection.name}</h1>
    </section>
    <div class="plp-header container"><p class="plp-header__desc">${collection.description}</p></div>
  `;
  const section = document.createElement('section');
  section.className = 'plp-grid container';
  section.appendChild(renderGrid(list));
  section.insertAdjacentHTML('beforeend',
    `<div class="text-center" style="margin: 40px 0;"><a href="#/high-jewelry" class="link-underline">XEM CÁC BỘ SƯU TẬP KHÁC</a></div>`);
  page.appendChild(section);
  container.appendChild(page);
}

export function renderSearch(container, params = {}) {
  const q = params.q || '';
  const list = searchProducts(q);
  const page = document.createElement('div');
  page.className = 'page-search container section';
  page.innerHTML = `
    <h1 class="section-heading">Kết quả tìm kiếm: “${q.replace(/</g, '&lt;')}”</h1>
    <p class="text-center" style="margin-bottom: 32px; color: var(--color-text-secondary);">${list.length} sản phẩm</p>
  `;
  if (list.length) {
    page.appendChild(renderGrid(list));
  } else {
    page.insertAdjacentHTML('beforeend',
      `<div class="text-center"><a href="#/jewelry" class="btn">XEM TẤT CẢ TRANG SỨC</a></div>`);
  }
  container.appendChild(page);
}
