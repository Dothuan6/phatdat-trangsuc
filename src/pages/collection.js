// ============================================================
// COLLECTION & SEARCH PAGES — Có Lọc Loại Trang Sức & Sắp Xếp Giá
// ============================================================

import { getCollectionBySlug } from '../data/collections.js';
import { getProductsByCollection, searchProducts, categories } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';

function createInteractiveToolbarAndGrid(initialList) {
  const wrapper = document.createElement('div');
  let activeCategory = 'all';
  let activeSort = 'featured';

  wrapper.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid var(--color-border-light);">
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;" id="col-cat-pills">
        <button type="button" class="gift-quiz-pill is-selected" data-cat="all" style="font-size: 12.5px; padding: 6px 14px; border-radius: 18px; white-space: nowrap;">Tất cả (${initialList.length})</button>
        ${categories.map(cat => {
          const count = initialList.filter(p => p.category === cat.slug).length;
          return count > 0
            ? `<button type="button" class="gift-quiz-pill" data-cat="${cat.slug}" style="font-size: 12.5px; padding: 6px 14px; border-radius: 18px; white-space: nowrap;">${cat.name} (${count})</button>`
            : '';
        }).join('')}
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        <span id="col-visible-count" style="font-size: 13px; color: var(--color-text-secondary);">Hiển thị <strong>${initialList.length}</strong> mẫu</span>
        <select id="col-sort-select" style="padding: 7px 12px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 12.5px; background: #fff; cursor: pointer;">
          <option value="featured">Sắp xếp: Nổi bật</option>
          <option value="price-asc">Giá: Thấp đến Cao</option>
          <option value="price-desc">Giá: Cao đến Thấp</option>
        </select>
      </div>
    </div>

    <div class="grid-3" id="col-products-grid"></div>
  `;

  const gridEl = wrapper.querySelector('#col-products-grid');
  const countEl = wrapper.querySelector('#col-visible-count');
  const sortSelect = wrapper.querySelector('#col-sort-select');

  function updateGrid() {
    let filtered = [...initialList];
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (activeSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    countEl.innerHTML = `Hiển thị <strong>${filtered.length}</strong> mẫu`;
    gridEl.innerHTML = '';
    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--color-text-secondary);">
          Không có sản phẩm nào trong phân mục này.
        </div>
      `;
      return;
    }
    filtered.forEach(p => gridEl.appendChild(createProductCard(p)));
  }

  wrapper.querySelectorAll('#col-cat-pills .gift-quiz-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      wrapper.querySelectorAll('#col-cat-pills .gift-quiz-pill').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      activeCategory = btn.dataset.cat;
      updateGrid();
    });
  });

  sortSelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    updateGrid();
  });

  updateGrid();
  return wrapper;
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
  section.appendChild(createInteractiveToolbarAndGrid(list));
  section.insertAdjacentHTML('beforeend',
    `<div class="text-center" style="margin: 40px 0;"><a href="#/high-jewelry" class="link-underline">XEM CÁC BỘ SƯU TẬP KHÁC</a></div>`);
  page.appendChild(section);
  container.appendChild(page);
}

export function renderSearch(container, params = {}) {
  const q = decodeURIComponent(params.q || '');
  const list = searchProducts(q);
  const page = document.createElement('div');
  page.className = 'page-search container section';
  page.innerHTML = `
    <h1 class="section-heading">Kết quả tìm kiếm: “${q.replace(/</g, '&lt;')}”</h1>
    <p class="text-center" style="margin-bottom: 28px; color: var(--color-text-secondary);">Tìm thấy ${list.length} mẫu trang sức phù hợp</p>
  `;
  if (list.length) {
    page.appendChild(createInteractiveToolbarAndGrid(list));
  } else {
    page.insertAdjacentHTML('beforeend',
      `<div class="text-center"><a href="#/jewelry" class="btn">XEM TẤT CẢ TRANG SỨC</a></div>`);
  }
  container.appendChild(page);
}

