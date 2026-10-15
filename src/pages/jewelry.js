import {
  products,
  categories,
  filterProducts,
  sortOptions,
  priceRanges
} from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { createFilterPanel } from '../components/filter-panel.js';
import { createBreadcrumb } from '../components/breadcrumb.js';
import { t } from '../i18n.js';

export function renderJewelry(container, params = {}) {
  const currentCategory = params.category || 'all';
  const page = document.createElement('div');
  page.className = 'page-jewelry';

  // Active filters state
  let filters = {
    category: currentCategory,
    collection: 'all',
    materials: [],
    stones: [],
    priceRange: 'all',
    sort: 'featured',
  };

  // Get category info
  const categoryInfo = categories.find(c => c.slug === currentCategory);
  const categoryTitle = categoryInfo ? categoryInfo.name : 'Tất Cả Trang Sức';
  const categoryDesc = 'Khám phá thế giới trang sức Bạc 925 tinh xảo, xi mạ vàng cao cấp và đính đá lấp lánh cho mọi khoảnh khắc.';

  // ── Page Header ──
  const header = document.createElement('section');
  header.className = 'plp-header container';

  const breadcrumb = createBreadcrumb(categoryTitle.toUpperCase());
  header.appendChild(breadcrumb);

  header.innerHTML += `
    <h1 class="plp-header__title" style="color: var(--color-brand-primary);">${categoryTitle}</h1>
    <p class="plp-header__desc">${categoryDesc}</p>
  `;
  page.appendChild(header);

  // ── Quick Category Tabs ──
  const quickTabs = document.createElement('div');
  quickTabs.className = 'quick-category-tabs container';
  quickTabs.style.cssText = 'display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px; -webkit-overflow-scrolling: touch; scrollbar-width: none;';
  
  const allTabs = [{ id: 'all', name: 'Tất cả', slug: 'all' }, ...categories];
  quickTabs.innerHTML = allTabs.map(cat => {
    const isActive = (cat.slug === currentCategory) || (cat.slug === 'all' && currentCategory === 'all');
    const href = cat.slug === 'all' ? '#/jewelry' : `#/jewelry/${cat.slug}`;
    return `
      <a href="${href}" class="quick-tab-pill ${isActive ? 'is-active' : ''}" style="
        padding: 8px 18px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        border: 1px solid ${isActive ? 'var(--color-brand-primary)' : 'var(--color-border)'};
        background-color: ${isActive ? 'var(--color-brand-primary)' : 'var(--color-bg-primary)'};
        color: ${isActive ? '#ffffff' : 'var(--color-text-primary)'};
        transition: all 0.2s ease;
      ">${cat.name}</a>
    `;
  }).join('');
  page.appendChild(quickTabs);

  // ── Filter/Sort Bar ──
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar container';
  filterBar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <button class="filter-btn" id="open-filter-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="18" x2="20" y2="18"/>
          <circle cx="8" cy="6" r="2" fill="currentColor"/>
          <circle cx="16" cy="12" r="2" fill="currentColor"/>
          <circle cx="10" cy="18" r="2" fill="currentColor"/>
        </svg>
        <span>Bộ lọc</span>
        <span class="filter-count-badge" id="filter-count-badge" style="display: none; background: var(--color-brand-primary); color: #fff; border-radius: 10px; padding: 2px 7px; font-size: 11px; margin-left: 4px;">0</span>
      </button>
      <div id="results-count-text" style="font-size: 13px; color: var(--color-text-secondary);">
        Đang hiển thị <strong style="color: var(--color-text-primary);">0</strong> sản phẩm
      </div>
    </div>
    <div class="sort-wrapper" style="position: relative;">
      <select id="sort-select" style="
        padding: 9px 32px 9px 14px;
        border: 1px solid var(--color-border);
        background: #fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235A6A68' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\") no-repeat right 10px center;
        appearance: none;
        -webkit-appearance: none;
        border-radius: 4px;
        font-size: 13px;
        color: var(--color-text-primary);
        cursor: pointer;
        font-family: var(--font-body);
      ">
        ${sortOptions.map(opt => `<option value="${opt.id}">${opt.label}</option>`).join('')}
      </select>
    </div>
  `;
  page.appendChild(filterBar);

  // ── Active Filter Tags Bar ──
  const activeChipsContainer = document.createElement('div');
  activeChipsContainer.className = 'active-filter-chips container';
  activeChipsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; margin-bottom: 20px;';
  page.appendChild(activeChipsContainer);

  // ── Product Grid ──
  const gridSection = document.createElement('section');
  gridSection.className = 'plp-grid container';

  const grid = document.createElement('div');
  grid.className = 'grid-3';
  grid.id = 'product-grid';
  gridSection.appendChild(grid);
  page.appendChild(gridSection);

  // Empty state container
  const emptyState = document.createElement('div');
  emptyState.className = 'plp-empty text-center';
  emptyState.style.cssText = 'display: none; padding: 60px 20px;';
  emptyState.innerHTML = `
    <p style="font-size: 1.1rem; color: var(--color-text-secondary); margin-bottom: 16px;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn.</p>
    <button class="btn btn--sm" id="clear-all-filters-btn" style="background-color: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">Xóa bộ lọc & xem tất cả</button>
  `;
  page.appendChild(emptyState);

  // Render products function
  function renderProducts() {
    const list = filterProducts(filters);
    grid.innerHTML = '';

    // Update count text
    const countEl = filterBar.querySelector('#results-count-text');
    if (countEl) {
      countEl.innerHTML = `Hiển thị <strong style="color: var(--color-text-primary);">${list.length}</strong> sản phẩm`;
    }

    // Render active chips
    renderChips();

    if (list.length === 0) {
      grid.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      grid.style.display = 'grid';
      emptyState.style.display = 'none';
      list.forEach(p => grid.appendChild(createProductCard(p)));
    }
  }

  // Render Filter Chips
  function renderChips() {
    activeChipsContainer.innerHTML = '';
    const activeList = [];

    if (filters.priceRange !== 'all') {
      const pr = priceRanges.find(r => r.id === filters.priceRange);
      if (pr) activeList.push({ type: 'priceRange', label: pr.label });
    }
    if (filters.collection !== 'all') {
      activeList.push({ type: 'collection', label: `BST: ${filters.collection}` });
    }
    filters.materials.forEach(m => activeList.push({ type: 'material', value: m, label: m }));
    filters.stones.forEach(s => activeList.push({ type: 'stone', value: s, label: s }));

    // Update filter count badge
    const badge = filterBar.querySelector('#filter-count-badge');
    if (badge) {
      if (activeList.length > 0) {
        badge.textContent = activeList.length;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }

    if (activeList.length === 0) return;

    activeList.forEach(item => {
      const chip = document.createElement('span');
      chip.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background-color: var(--color-brand-light);
        color: var(--color-brand-primary);
        padding: 4px 10px;
        border-radius: 14px;
        font-size: 12px;
        font-weight: 500;
      `;
      chip.innerHTML = `${item.label} <button style="background:none;border:none;cursor:pointer;color:var(--color-brand-primary);padding:0;font-size:13px;line-height:1;">✕</button>`;
      chip.querySelector('button').addEventListener('click', () => {
        if (item.type === 'priceRange') filters.priceRange = 'all';
        if (item.type === 'collection') filters.collection = 'all';
        if (item.type === 'material') filters.materials = filters.materials.filter(m => m !== item.value);
        if (item.type === 'stone') filters.stones = filters.stones.filter(s => s !== item.value);
        renderProducts();
      });
      activeChipsContainer.appendChild(chip);
    });

    const clearAll = document.createElement('button');
    clearAll.style.cssText = 'background: none; border: none; font-size: 12px; color: var(--color-text-secondary); text-decoration: underline; cursor: pointer; padding: 4px 8px;';
    clearAll.textContent = 'Xóa tất cả';
    clearAll.addEventListener('click', () => {
      resetFilters();
    });
    activeChipsContainer.appendChild(clearAll);
  }

  function resetFilters() {
    filters.priceRange = 'all';
    filters.collection = 'all';
    filters.materials = [];
    filters.stones = [];
    renderProducts();
  }

  // Filter panel integration
  const { overlay: filterOverlay, panel: filterPanel, open: openFilter } = createFilterPanel(filters, (newFilters) => {
    filters.priceRange = newFilters.priceRange;
    filters.collection = newFilters.collection;
    filters.materials = newFilters.materials;
    filters.stones = newFilters.stones;
    renderProducts();
  });

  document.body.appendChild(filterOverlay);
  document.body.appendChild(filterPanel);

  // Open filter handler
  filterBar.querySelector('#open-filter-btn').addEventListener('click', () => {
    openFilter(filters.category);
  });

  // Sort change handler
  const sortSelect = filterBar.querySelector('#sort-select');
  sortSelect.addEventListener('change', (e) => {
    filters.sort = e.target.value;
    renderProducts();
  });

  // Clear all button in empty state
  emptyState.querySelector('#clear-all-filters-btn').addEventListener('click', () => {
    resetFilters();
  });

  // Initial render
  renderProducts();

  container.appendChild(page);

  // Cleanup
  return () => {
    filterOverlay.remove();
    filterPanel.remove();
  };
}
