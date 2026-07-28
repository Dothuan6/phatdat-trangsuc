// ============================================================
// FILTER PANEL COMPONENT — Slide-out filter sidebar
// ============================================================

import { createAccordion } from './accordion.js';
import { collections as collectionNames } from '../data/products.js';

export function createFilterPanel(onApply = null) {
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
    <span class="filter-panel__title">Filter</span>
    <button class="filter-panel__close" aria-label="Close filters">✕</button>
  `;

  // Body with accordion filters
  const body = document.createElement('div');
  body.className = 'filter-panel__body';

  // Collections accordion
  const collectionsContent = collectionNames.map(c => `
    <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer; font-size: 14px; color: #6B6B6B;">
      <input type="checkbox" value="${c}" class="filter-checkbox" data-filter="collection" style="width: 16px; height: 16px;">
      ${c}
    </label>
  `).join('');
  body.appendChild(createAccordion('COLLECTIONS', collectionsContent));

  // Materials accordion
  const materialsContent = ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum'].map(m => `
    <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer; font-size: 14px; color: #6B6B6B;">
      <input type="checkbox" value="${m}" class="filter-checkbox" data-filter="material" style="width: 16px; height: 16px;">
      ${m}
    </label>
  `).join('');
  body.appendChild(createAccordion('MATERIALS', materialsContent));

  // Stones accordion
  const stonesContent = ['Mother-of-pearl', 'Diamond', 'Onyx', 'Turquoise', 'Carnelian'].map(s => `
    <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer; font-size: 14px; color: #6B6B6B;">
      <input type="checkbox" value="${s}" class="filter-checkbox" data-filter="stone" style="width: 16px; height: 16px;">
      ${s}
    </label>
  `).join('');
  body.appendChild(createAccordion('STONES', stonesContent));

  // Price Range
  const priceContent = `
    <div class="price-range">
      <div class="price-range__slider">
        <div class="price-range__track" style="left: 0; right: 0;"></div>
        <div class="price-range__handle" style="left: 0;"></div>
        <div class="price-range__handle" style="left: 100%;"></div>
      </div>
      <div class="price-range__values">
        <span>₫ 22,600,000</span>
        <span>₫ 555,500,000</span>
      </div>
    </div>
  `;
  body.appendChild(createAccordion('PRICE RANGE', priceContent, true));

  // Footer
  const footer = document.createElement('div');
  footer.className = 'filter-panel__footer';
  footer.innerHTML = `
    <button class="filter-panel__reset">Reset Filters</button>
    <button class="btn btn--sm" id="filter-apply">Display 18 Result(s)</button>
  `;

  panel.appendChild(header);
  panel.appendChild(body);
  panel.appendChild(footer);

  // Close handlers
  function closePanel() {
    overlay.classList.remove('is-open');
    panel.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function openPanel() {
    overlay.classList.add('is-open');
    panel.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  overlay.addEventListener('click', closePanel);
  header.querySelector('.filter-panel__close').addEventListener('click', closePanel);

  // Reset
  footer.querySelector('.filter-panel__reset').addEventListener('click', () => {
    panel.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
  });

  // Apply
  footer.querySelector('#filter-apply').addEventListener('click', () => {
    closePanel();
    if (onApply) onApply();
  });

  return { overlay, panel, open: openPanel, close: closePanel };
}
