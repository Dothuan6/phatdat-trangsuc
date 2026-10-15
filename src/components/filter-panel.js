// ============================================================
// FILTER PANEL COMPONENT — Slide-out filter sidebar
// ============================================================

import { createAccordion } from './accordion.js';
import {
  collections as collectionNames,
  materialsList,
  stonesList,
  priceRanges,
  filterProducts
} from '../data/products.js';

export function createFilterPanel(initialFilters = {}, onApply = null) {
  let state = {
    category: initialFilters.category || 'all',
    collection: initialFilters.collection || 'all',
    materials: initialFilters.materials ? [...initialFilters.materials] : [],
    stones: initialFilters.stones ? [...initialFilters.stones] : [],
    priceRange: initialFilters.priceRange || 'all',
  };

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'filter-overlay';
  overlay.id = 'filter-overlay';

  // Panel
  const panel = document.createElement('div');
  panel.className = 'filter-panel';
  panel.id = 'filter-panel';

  // Header
  const header = document.createElement('div');
  header.className = 'filter-panel__header';
  header.innerHTML = `
    <span class="filter-panel__title">Bộ Lọc Sản Phẩm</span>
    <button class="filter-panel__close" aria-label="Đóng bộ lọc">✕</button>
  `;

  // Body with accordion filters
  const body = document.createElement('div');
  body.className = 'filter-panel__body';

  // Price Range (Radio buttons)
  const priceContent = priceRanges.map(pr => `
    <label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; font-size: 14px; color: var(--color-text-primary);">
      <input type="radio" name="filter-price" value="${pr.id}" class="filter-radio-price" ${state.priceRange === pr.id ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-brand-primary);">
      <span>${pr.label}</span>
    </label>
  `).join('');
  body.appendChild(createAccordion('MỨC GIÁ', priceContent, true));

  // Materials accordion (Checkboxes)
  const materialsContent = materialsList.map(m => `
    <label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; font-size: 14px; color: var(--color-text-primary);">
      <input type="checkbox" value="${m}" class="filter-checkbox-material" ${state.materials.includes(m) ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-brand-primary);">
      <span>${m}</span>
    </label>
  `).join('');
  body.appendChild(createAccordion('CHẤT LIỆU', materialsContent, true));

  // Stones accordion (Checkboxes)
  const stonesContent = stonesList.map(s => `
    <label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; font-size: 14px; color: var(--color-text-primary);">
      <input type="checkbox" value="${s}" class="filter-checkbox-stone" ${state.stones.includes(s) ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-brand-primary);">
      <span>${s}</span>
    </label>
  `).join('');
  body.appendChild(createAccordion('ĐÁ ĐÍNH KÈM', stonesContent, false));

  // Collections accordion
  const collectionsContent = [
    `<label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; font-size: 14px; color: var(--color-text-primary);">
      <input type="radio" name="filter-collection" value="all" class="filter-radio-collection" ${state.collection === 'all' ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-brand-primary);">
      <span>Tất cả bộ sưu tập</span>
    </label>`,
    ...collectionNames.map(c => `
      <label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; font-size: 14px; color: var(--color-text-primary);">
        <input type="radio" name="filter-collection" value="${c}" class="filter-radio-collection" ${state.collection === c ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-brand-primary);">
        <span>${c}</span>
      </label>
    `)
  ].join('');
  body.appendChild(createAccordion('BỘ SƯU TẬP', collectionsContent, false));

  // Footer
  const footer = document.createElement('div');
  footer.className = 'filter-panel__footer';
  footer.innerHTML = `
    <button class="filter-panel__reset" style="background: none; border: none; cursor: pointer; font-size: 13px; text-decoration: underline; color: var(--color-text-secondary);">Thiết lập lại</button>
    <button class="btn btn--sm" id="filter-apply" style="background-color: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">Áp dụng bộ lọc</button>
  `;

  panel.appendChild(header);
  panel.appendChild(body);
  panel.appendChild(footer);

  function getActiveFilterValues() {
    const selectedPrice = panel.querySelector('input[name="filter-price"]:checked')?.value || 'all';
    const selectedCollection = panel.querySelector('input[name="filter-collection"]:checked')?.value || 'all';
    const selectedMaterials = Array.from(panel.querySelectorAll('.filter-checkbox-material:checked')).map(cb => cb.value);
    const selectedStones = Array.from(panel.querySelectorAll('.filter-checkbox-stone:checked')).map(cb => cb.value);

    return {
      priceRange: selectedPrice,
      collection: selectedCollection,
      materials: selectedMaterials,
      stones: selectedStones,
    };
  }

  function updateCountButton() {
    const current = getActiveFilterValues();
    const count = filterProducts({
      category: state.category,
      collection: current.collection,
      materials: current.materials,
      stones: current.stones,
      priceRange: current.priceRange
    }).length;

    const applyBtn = footer.querySelector('#filter-apply');
    if (applyBtn) {
      applyBtn.textContent = `Xem ${count} sản phẩm`;
    }
  }

  // Event listeners for inputs
  panel.addEventListener('change', () => {
    updateCountButton();
  });

  // Close handlers
  function closePanel() {
    overlay.classList.remove('is-open');
    panel.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function openPanel(currentCategory = null) {
    if (currentCategory) state.category = currentCategory;
    updateCountButton();
    overlay.classList.add('is-open');
    panel.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  overlay.addEventListener('click', closePanel);
  header.querySelector('.filter-panel__close').addEventListener('click', closePanel);

  // Reset
  footer.querySelector('.filter-panel__reset').addEventListener('click', () => {
    panel.querySelectorAll('.filter-checkbox-material, .filter-checkbox-stone').forEach(cb => cb.checked = false);
    const defaultPrice = panel.querySelector('input[name="filter-price"][value="all"]');
    if (defaultPrice) defaultPrice.checked = true;
    const defaultCol = panel.querySelector('input[name="filter-collection"][value="all"]');
    if (defaultCol) defaultCol.checked = true;
    updateCountButton();
  });

  // Apply
  footer.querySelector('#filter-apply').addEventListener('click', () => {
    closePanel();
    const resultFilters = getActiveFilterValues();
    if (onApply) onApply(resultFilters);
  });

  return { overlay, panel, open: openPanel, close: closePanel };
}
