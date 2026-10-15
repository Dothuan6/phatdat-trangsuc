// ============================================================
// ADMIN DASHBOARD (BACKOFFICE) — Phát Đạt Jewelry
// ============================================================

import { isAuthenticated, logout, getAdminUser } from '../../services/auth.js';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  getSupabaseAnonKey,
  setSupabaseAnonKey,
  testSupabaseConnection,
  getAdminProducts,
  saveAdminProduct,
  deleteAdminProduct,
  getAdminCollections,
  saveAdminCollection,
  getAdminContacts,
  updateContactStatus,
  getAdminSiteSettings,
  saveAdminSiteSettings
} from '../../services/supabase.js';
import { formatPrice } from '../../data/products.js';
import { navigate } from '../../router.js';
import './admin.css';

export async function renderAdmin(container) {
  // Authentication Guard
  if (!isAuthenticated()) {
    navigate('/admin/login');
    return;
  }

  const page = document.createElement('div');
  page.className = 'admin-dashboard-layout';

  // Load initial data
  let products = await getAdminProducts();
  let collections = await getAdminCollections();
  let contacts = await getAdminContacts();
  let siteSettings = await getAdminSiteSettings();
  let activeTab = 'overview'; // 'overview', 'products', 'collections', 'contacts', 'settings'

  // Test connection status
  let dbStatus = await testSupabaseConnection();

  page.innerHTML = `
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header">
        <img src="/images/logo.png" alt="Phát Đạt Jewelry" class="admin-sidebar-logo">
        <div>
          <div class="admin-sidebar-brand-name">Phát Đạt</div>
          <div class="admin-sidebar-badge">Backoffice Pro</div>
        </div>
      </div>

      <nav class="admin-sidebar-menu">
        <button class="admin-nav-item is-active" data-tab="overview">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Tổng quan</span>
        </button>

        <button class="admin-nav-item" data-tab="products">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          <span>Quản lý Sản phẩm</span>
          <span class="admin-nav-item-badge" id="sidebar-products-count">${products.length}</span>
        </button>

        <button class="admin-nav-item" data-tab="collections">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>Bộ sưu tập</span>
          <span class="admin-nav-item-badge" id="sidebar-collections-count">${collections.length}</span>
        </button>

        <button class="admin-nav-item" data-tab="contacts">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>Yêu cầu tư vấn</span>
          <span class="admin-nav-item-badge" id="sidebar-contacts-count" style="background: #e74c3c; color: #fff;">${contacts.filter(c => c.status === 'pending').length}</span>
        </button>

        <button class="admin-nav-item" data-tab="settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          <span>Cài đặt & Supabase</span>
        </button>
      </nav>

      <div class="admin-sidebar-footer">
        <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">
          Đăng nhập: <strong>admin@gmail.com</strong>
        </div>
        <button id="admin-logout-trigger" class="admin-logout-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="admin-main-wrap">
      <!-- Topbar -->
      <header class="admin-topbar">
        <div class="admin-topbar-title" id="admin-page-title">
          Tổng quan hệ thống
        </div>
        <div class="admin-topbar-actions">
          <div class="admin-db-status ${dbStatus.success ? 'admin-db-status--online' : 'admin-db-status--offline'}" id="admin-db-status-pill">
            <span style="font-size: 10px;">●</span>
            <span id="admin-db-status-text">${dbStatus.success ? 'Supabase Online' : 'Chế độ Lưu Cục Bộ (Offline)'}</span>
          </div>

          <a href="#/" target="_blank" class="admin-view-site-link">
            <span>Xem Website</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </header>

      <!-- Page Body Container -->
      <main class="admin-page-body" id="admin-tab-content">
        <!-- Rendered dynamically -->
      </main>
    </div>
  `;

  const contentArea = page.querySelector('#admin-tab-content');
  const pageTitle = page.querySelector('#admin-page-title');

  // Switch Tab Handler
  function switchTab(tabName) {
    activeTab = tabName;
    page.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === tabName);
    });

    if (tabName === 'overview') {
      pageTitle.textContent = 'Tổng quan hệ thống';
      renderOverviewTab();
    } else if (tabName === 'products') {
      pageTitle.textContent = 'Quản lý Sản phẩm';
      renderProductsTab();
    } else if (tabName === 'collections') {
      pageTitle.textContent = 'Quản lý Bộ sưu tập';
      renderCollectionsTab();
    } else if (tabName === 'contacts') {
      pageTitle.textContent = 'Yêu cầu tư vấn & Khách hàng';
      renderContactsTab();
    } else if (tabName === 'settings') {
      pageTitle.textContent = 'Cấu hình Cửa hàng & Supabase Database';
      renderSettingsTab();
    }
  }

  // ════════════════════════════════════════════════════════════
  // TAB 1: OVERVIEW
  // ════════════════════════════════════════════════════════════
  function renderOverviewTab() {
    const pendingContacts = contacts.filter(c => c.status === 'pending');
    contentArea.innerHTML = `
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background: #EBF4F3; color: var(--color-brand-primary);">💍</div>
          <div class="admin-stat-info">
            <h4>Tổng sản phẩm</h4>
            <div class="admin-stat-number">${products.length}</div>
          </div>
        </div>

        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background: #FAF4E8; color: var(--color-accent-gold);">✨</div>
          <div class="admin-stat-info">
            <h4>Bộ sưu tập</h4>
            <div class="admin-stat-number">${collections.length}</div>
          </div>
        </div>

        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background: #FDEDEC; color: #E74C3C;">📩</div>
          <div class="admin-stat-info">
            <h4>Tư vấn chờ xử lý</h4>
            <div class="admin-stat-number">${pendingContacts.length}</div>
          </div>
        </div>

        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background: #E8F8F5; color: #1ABC9C;">🗄️</div>
          <div class="admin-stat-info">
            <h4>Cơ sở dữ liệu</h4>
            <div class="admin-stat-number" style="font-size: 16px; margin-top: 4px;">${SUPABASE_PROJECT_ID}</div>
          </div>
        </div>
      </div>

      <!-- Recent Products Preview -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">Mẫu trang sức nổi bật gần đây</h3>
          <button class="admin-btn admin-btn--primary admin-btn-sm" id="btn-goto-products">Quản lý toàn bộ sản phẩm →</button>
        </div>
        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Mã SP</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Chất liệu</th>
              </tr>
            </thead>
            <tbody>
              ${products.slice(0, 5).map(p => `
                <tr>
                  <td><img src="${p.images[0]}" alt="${p.name}" class="admin-product-thumb" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'"></td>
                  <td><strong>${p.name}</strong></td>
                  <td><code style="background:#eef2f3;padding:2px 6px;border-radius:3px;">${p.reference}</code></td>
                  <td>${p.collection}</td>
                  <td style="color:var(--color-brand-primary);font-weight:600;">${formatPrice(p.price)}</td>
                  <td style="color:var(--color-text-secondary);">${p.materials}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    contentArea.querySelector('#btn-goto-products').addEventListener('click', () => switchTab('products'));
  }

  // ════════════════════════════════════════════════════════════
  // TAB 2: PRODUCTS
  // ════════════════════════════════════════════════════════════
  function renderProductsTab() {
    contentArea.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
            <input type="text" id="product-search-input" class="admin-form-input" style="max-width: 280px; padding: 8px 12px;" placeholder="Tìm tên hoặc mã SP...">
            <select id="product-filter-cat" class="admin-form-input" style="max-width: 180px; padding: 8px 12px;">
              <option value="all">Tất cả danh mục</option>
              <option value="necklaces">Dây chuyền</option>
              <option value="rings">Nhẫn</option>
              <option value="bracelets">Vòng & Lắc tay</option>
              <option value="earrings">Bông tai</option>
            </select>
          </div>
          <button class="admin-btn admin-btn--primary" id="btn-add-product">
            + Thêm Sản Phẩm Mới
          </button>
        </div>

        <div class="admin-table-responsive">
          <table class="admin-table" id="products-table">
            <thead>
              <tr>
                <th style="width: 60px;">Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Mã SP</th>
                <th>Danh mục</th>
                <th>Bộ sưu tập</th>
                <th>Giá</th>
                <th>Chất liệu / Đá</th>
                <th style="text-align: right;">Thao tác</th>
              </tr>
            </thead>
            <tbody id="products-table-body">
              <!-- Rendered via function -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    const tableBody = contentArea.querySelector('#products-table-body');
    const searchInput = contentArea.querySelector('#product-search-input');
    const filterCat = contentArea.querySelector('#product-filter-cat');

    function renderProductRows(items) {
      if (items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--color-text-secondary);">Không tìm thấy sản phẩm nào.</td></tr>`;
        return;
      }
      tableBody.innerHTML = items.map(p => `
        <tr>
          <td><img src="${p.images[0]}" class="admin-product-thumb" alt="${p.name}" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'"></td>
          <td>
            <div style="font-weight:600;color:var(--color-text-primary);">${p.name}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);">${p.specifications ? Object.keys(p.specifications).length + ' thông số' : ''}</div>
          </td>
          <td><code style="background:#eef2f3;padding:2px 6px;border-radius:3px;">${p.reference}</code></td>
          <td>${p.category}</td>
          <td><span class="admin-badge admin-badge--active">${p.collection}</span></td>
          <td style="font-weight:700;color:var(--color-brand-primary);">${formatPrice(p.price)}</td>
          <td style="font-size:12px;color:var(--color-text-secondary);">
            <div>${p.materials}</div>
            ${p.stones ? `<div style="color:var(--color-accent-gold);">${p.stones}</div>` : ''}
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="admin-btn admin-btn--outline admin-btn-sm edit-product-btn" data-id="${p.id}" style="margin-right: 6px;">Sửa</button>
            <button class="admin-btn admin-btn--danger admin-btn-sm delete-product-btn" data-id="${p.id}">Xóa</button>
          </td>
        </tr>
      `).join('');

      // Attach row action listeners
      tableBody.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = products.find(p => p.id === btn.dataset.id);
          if (item) openProductModal(item);
        });
      });

      tableBody.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            await deleteAdminProduct(btn.dataset.id);
            products = await getAdminProducts();
            page.querySelector('#sidebar-products-count').textContent = products.length;
            renderProductRows(products);
          }
        });
      });
    }

    function filterTable() {
      const q = searchInput.value.toLowerCase().trim();
      const cat = filterCat.value;
      let res = products;
      if (cat !== 'all') res = res.filter(p => p.category === cat);
      if (q) res = res.filter(p => p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q));
      renderProductRows(res);
    }

    searchInput.addEventListener('input', filterTable);
    filterCat.addEventListener('change', filterTable);
    contentArea.querySelector('#btn-add-product').addEventListener('click', () => openProductModal());

    renderProductRows(products);
  }

  // ── Product Modal (Add / Edit) ──
  function openProductModal(prod = null) {
    const isEdit = !!prod;
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'admin-modal-overlay';

    modalOverlay.innerHTML = `
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3>${isEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
          <button id="modal-close-btn" style="background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
        </div>
        <form id="product-modal-form">
          <div class="admin-modal-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="admin-form-group">
                <label>Tên sản phẩm *</label>
                <input type="text" id="m-name" class="admin-form-input" required value="${prod ? prod.name : ''}">
              </div>
              <div class="admin-form-group">
                <label>Mã sản phẩm (SKU) *</label>
                <input type="text" id="m-ref" class="admin-form-input" required value="${prod ? prod.reference : 'PD' + Date.now().toString().slice(-6)}">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
              <div class="admin-form-group">
                <label>Danh mục *</label>
                <select id="m-category" class="admin-form-input" required>
                  <option value="necklaces" ${prod && prod.category === 'necklaces' ? 'selected' : ''}>Dây chuyền</option>
                  <option value="rings" ${prod && prod.category === 'rings' ? 'selected' : ''}>Nhẫn</option>
                  <option value="bracelets" ${prod && prod.category === 'bracelets' ? 'selected' : ''}>Vòng & Lắc tay</option>
                  <option value="earrings" ${prod && prod.category === 'earrings' ? 'selected' : ''}>Bông tai</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>Bộ sưu tập *</label>
                <select id="m-collection" class="admin-form-input" required>
                  ${collections.map(c => `<option value="${c.name}" ${prod && prod.collection === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="admin-form-group">
                <label>Giá bán (VNĐ) *</label>
                <input type="number" id="m-price" class="admin-form-input" required value="${prod ? prod.price : 249000}">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="admin-form-group">
                <label>Chất liệu</label>
                <input type="text" id="m-materials" class="admin-form-input" value="${prod ? prod.materials : 'Bạc 925 xi vàng'}">
              </div>
              <div class="admin-form-group">
                <label>Đá đính kèm</label>
                <input type="text" id="m-stones" class="admin-form-input" value="${prod ? prod.stones : 'Xà cừ'}">
              </div>
            </div>

            <div class="admin-form-group">
              <label>Link ảnh sản phẩm chính (URL hoặc đường dẫn)</label>
              <input type="text" id="m-image" class="admin-form-input" required value="${prod && prod.images ? prod.images[0] : './images/products/Daychuyen4.3-removebg-preview.png'}">
            </div>

            <div class="admin-form-group">
              <label>Mô tả chi tiết</label>
              <textarea id="m-description" class="admin-form-input" rows="3">${prod ? prod.description : 'Trang sức bạc 925 cao cấp chế tác tinh xảo, quà tặng may mắn cho nàng.'}</textarea>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="admin-btn admin-btn--outline" id="m-cancel">Hủy</button>
            <button type="submit" class="admin-btn admin-btn--primary">Lưu Sản Phẩm</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeModal = () => modalOverlay.remove();
    modalOverlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalOverlay.querySelector('#m-cancel').addEventListener('click', closeModal);

    modalOverlay.querySelector('#product-modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedItem = {
        id: prod ? prod.id : 'pd-' + Date.now(),
        name: modalOverlay.querySelector('#m-name').value,
        reference: modalOverlay.querySelector('#m-ref').value,
        category: modalOverlay.querySelector('#m-category').value,
        collection: modalOverlay.querySelector('#m-collection').value,
        price: parseInt(modalOverlay.querySelector('#m-price').value, 10),
        currency: '₫',
        materials: modalOverlay.querySelector('#m-materials').value,
        stones: modalOverlay.querySelector('#m-stones').value,
        images: [modalOverlay.querySelector('#m-image').value],
        description: modalOverlay.querySelector('#m-description').value,
        specifications: prod && prod.specifications ? prod.specifications : { 'Chất liệu': modalOverlay.querySelector('#m-materials').value },
        availableSizes: prod ? prod.availableSizes : ['Freesize'],
        availableColors: prod ? prod.availableColors : ['Bạc sáng 925', 'Xi vàng 18K'],
        rating: 4.9,
        reviewsCount: 20
      };

      await saveAdminProduct(updatedItem);
      products = await getAdminProducts();
      page.querySelector('#sidebar-products-count').textContent = products.length;
      closeModal();
      renderProductsTab();
    });
  }

  // ════════════════════════════════════════════════════════════
  // TAB 3: COLLECTIONS
  // ════════════════════════════════════════════════════════════
  function renderCollectionsTab() {
    contentArea.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">Danh sách Bộ Sưu Tập Phát Đạt Jewelry</h3>
          <button class="admin-btn admin-btn--primary admin-btn-sm" id="btn-add-col">+ Thêm BST</button>
        </div>
        <div style="padding: 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${collections.map(c => `
            <div style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <img src="${c.image}" alt="${c.name}" style="width: 100%; height: 160px; object-fit: cover;">
              <div style="padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <h4 style="font-size: 16px; margin: 0; color: var(--color-brand-primary);">${c.name}</h4>
                  <span style="font-size: 11px; background: ${c.color || '#1B2A4A'}; color: #fff; padding: 2px 8px; border-radius: 4px;">Màu chủ đạo</span>
                </div>
                <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin: 0 0 12px 0;">${c.description}</p>
                <div style="display: flex; justify-content: flex-end;">
                  <a href="#/collections/${c.id}" target="_blank" class="admin-btn admin-btn--outline admin-btn-sm">Xem trang BST ↗</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    contentArea.querySelector('#btn-add-col').addEventListener('click', () => {
      const name = prompt('Nhập tên bộ sưu tập mới:');
      if (name) {
        const desc = prompt('Nhập mô tả ngắn:') || '';
        const newCol = {
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          description: desc,
          image: './images/gallery/g1.jpg',
          color: '#1E5D57'
        };
        saveAdminCollection(newCol);
        collections.push(newCol);
        renderCollectionsTab();
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // TAB 4: CONTACTS & INQUIRIES
  // ════════════════════════════════════════════════════════════
  function renderContactsTab() {
    contentArea.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">Khách hàng yêu cầu tư vấn & liên hệ</h3>
          <span style="font-size: 13px; color: var(--color-text-secondary);">${contacts.length} yêu cầu</span>
        </div>
        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Chủ đề tư vấn</th>
                <th>Nội dung tin nhắn</th>
                <th>Trạng thái</th>
                <th style="text-align: right;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              ${contacts.map(c => `
                <tr>
                  <td style="font-size: 12px; color: var(--color-text-muted);">${new Date(c.created_at).toLocaleString('vi-VN')}</td>
                  <td><strong>${c.fullName}</strong></td>
                  <td><a href="tel:${c.phone}" style="color:var(--color-brand-primary);font-weight:600;">${c.phone}</a></td>
                  <td><span class="admin-badge admin-badge--active">${c.subject || 'Tư vấn sản phẩm'}</span></td>
                  <td style="max-width: 280px; font-size: 13px;">${c.message || ''}</td>
                  <td>
                    <span class="admin-badge ${c.status === 'completed' ? 'admin-badge--completed' : 'admin-badge--pending'}">
                      ${c.status === 'completed' ? 'Đã liên hệ' : 'Chờ xử lý'}
                    </span>
                  </td>
                  <td style="text-align: right; white-space: nowrap;">
                    <a href="https://zalo.me/${(c.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="admin-btn admin-btn--outline admin-btn-sm" style="margin-right: 6px;">Chat Zalo</a>
                    ${c.status === 'pending' ? `
                      <button class="admin-btn admin-btn--primary admin-btn-sm mark-done-btn" data-id="${c.id}">Đã tư vấn</button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    contentArea.querySelectorAll('.mark-done-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        await updateContactStatus(btn.dataset.id, 'completed');
        contacts = await getAdminContacts();
        page.querySelector('#sidebar-contacts-count').textContent = contacts.filter(c => c.status === 'pending').length;
        renderContactsTab();
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // TAB 5: SETTINGS & SUPABASE
  // ════════════════════════════════════════════════════════════
  function renderSettingsTab() {
    const currentKey = getSupabaseAnonKey();

    contentArea.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Supabase Connection Config -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3 class="admin-card-title">Kết nối Supabase Database</h3>
          </div>
          <div style="padding: 24px;">
            <div style="margin-bottom: 16px;">
              <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Supabase Project ID:</label>
              <input type="text" class="admin-form-input" readonly value="${SUPABASE_PROJECT_ID}" style="background: #eef2f3;">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Supabase API URL:</label>
              <input type="text" class="admin-form-input" readonly value="${SUPABASE_URL}" style="background: #eef2f3;">
            </div>

            <div class="admin-form-group">
              <label for="input-anon-key">Supabase Anon Key (Public Key):</label>
              <textarea id="input-anon-key" class="admin-form-input" rows="3" placeholder="Dán anon key (eyJhbGciOi...) từ Dashboard vào đây...">${currentKey}</textarea>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 6px;">
                Lấy tại: <a href="https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/settings/api" target="_blank" style="color: var(--color-brand-primary);">Dashboard > Project Settings > API > anon public key</a>
              </div>
            </div>

            <div id="connection-test-feedback" style="margin-bottom: 16px; font-size: 13px; padding: 10px 14px; border-radius: 6px; display: none;"></div>

            <div style="display: flex; gap: 10px;">
              <button class="admin-btn admin-btn--primary" id="btn-save-key">Lưu & Kiểm tra kết nối</button>
              <a href="https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new" target="_blank" class="admin-btn admin-btn--outline">Mở SQL Editor Supabase ↗</a>
            </div>
          </div>
        </div>

        <!-- Store Information Settings -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3 class="admin-card-title">Thông tin Cửa hàng Phát Đạt</h3>
          </div>
          <div style="padding: 24px;">
            <div class="admin-form-group">
              <label>Tên cửa hàng</label>
              <input type="text" id="s-name" class="admin-form-input" value="${siteSettings.name || 'Phát Đạt Jewelry'}">
            </div>

            <div class="admin-form-group">
              <label>Số Hotline</label>
              <input type="text" id="s-phone" class="admin-form-input" value="${siteSettings.phoneDisplay || '0898 025 013'}">
            </div>

            <div class="admin-form-group">
              <label>Link Zalo Chat</label>
              <input type="text" id="s-zalo" class="admin-form-input" value="${siteSettings.zalo || 'https://zalo.me/0898025013'}">
            </div>

            <div class="admin-form-group">
              <label>Địa chỉ cửa hàng</label>
              <input type="text" id="s-address" class="admin-form-input" value="${siteSettings.address || ''}">
            </div>

            <button class="admin-btn admin-btn--primary" id="btn-save-store">Lưu thông tin cửa hàng</button>
          </div>
        </div>
      </div>
    `;

    // Save Supabase Key
    const saveBtn = contentArea.querySelector('#btn-save-key');
    const keyInput = contentArea.querySelector('#input-anon-key');
    const feedback = contentArea.querySelector('#connection-test-feedback');

    saveBtn.addEventListener('click', async () => {
      const key = keyInput.value.trim();
      setSupabaseAnonKey(key);
      saveBtn.textContent = 'Đang kiểm tra...';
      saveBtn.disabled = true;

      const res = await testSupabaseConnection(key);
      feedback.style.display = 'block';
      if (res.success) {
        feedback.style.background = '#E8F5E9';
        feedback.style.color = '#2E7D32';
        feedback.textContent = res.message;
        page.querySelector('#admin-db-status-pill').className = 'admin-db-status admin-db-status--online';
        page.querySelector('#admin-db-status-text').textContent = 'Supabase Online';
      } else {
        feedback.style.background = '#FFEBEE';
        feedback.style.color = '#C62828';
        feedback.textContent = 'Lỗi kết nối: ' + res.message;
        page.querySelector('#admin-db-status-pill').className = 'admin-db-status admin-db-status--offline';
        page.querySelector('#admin-db-status-text').textContent = 'Chế độ Lưu Cục Bộ (Offline)';
      }
      saveBtn.textContent = 'Lưu & Kiểm tra kết nối';
      saveBtn.disabled = false;
    });

    // Save Store Settings
    contentArea.querySelector('#btn-save-store').addEventListener('click', async () => {
      const updated = {
        name: contentArea.querySelector('#s-name').value,
        phoneDisplay: contentArea.querySelector('#s-phone').value,
        phoneHref: 'tel:' + contentArea.querySelector('#s-phone').value.replace(/[^0-9]/g, ''),
        zalo: contentArea.querySelector('#s-zalo').value,
        address: contentArea.querySelector('#s-address').value,
      };
      await saveAdminSiteSettings(updated);
      alert('Đã cập nhật thông tin cửa hàng thành công!');
    });
  }

  // Sidebar navigation click
  page.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Logout click
  page.querySelector('#admin-logout-trigger').addEventListener('click', () => {
    logout();
    navigate('/admin/login');
  });

  // Initial render Overview
  renderOverviewTab();

  container.appendChild(page);
}
