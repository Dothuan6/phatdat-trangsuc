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
  toggleProductActive,
  syncAllProductsToSupabase,
  getAdminCollections,
  saveAdminCollection,
  deleteAdminCollection,
  getAdminContacts,
  updateContactStatus,
  deleteAdminContact,
  getAdminSiteSettings,
  saveAdminSiteSettings
} from '../../services/supabase.js';
import { formatPrice } from '../../data/products.js';
import { navigate } from '../../router.js';
import { showToast, showConfirmModal, showAlertModal } from '../../components/feedback-modal.js';
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
  let activeTab = 'overview';

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

  function updateSidebarBadges() {
    page.querySelector('#sidebar-products-count').textContent = products.length;
    page.querySelector('#sidebar-collections-count').textContent = collections.length;
    page.querySelector('#sidebar-contacts-count').textContent = contacts.filter(c => c.status === 'pending').length;
  }

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
            <h4>Supabase Project</h4>
            <div class="admin-stat-number" style="font-size: 15px; margin-top: 4px;">${SUPABASE_PROJECT_ID}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 8px; padding: 18px 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div>
          <h4 style="margin: 0 0 4px 0; font-size: 15px; color: var(--color-brand-primary);">Thao tác nhanh Backoffice</h4>
          <p style="margin: 0; font-size: 13px; color: var(--color-text-secondary);">Thêm sản phẩm mới, cập nhật kho hoặc kiểm tra thông tin liên hệ của khách hàng.</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="admin-btn admin-btn--primary" id="btn-quick-add-prod">+ Thêm Sản Phẩm Mới</button>
          <button class="admin-btn admin-btn--outline" id="btn-quick-inquiries">Xem ${pendingContacts.length} Yêu Cầu Tư Vấn</button>
        </div>
      </div>

      <!-- Recent Products Preview -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">Mẫu trang sức nổi bật trong hệ thống</h3>
          <button class="admin-btn admin-btn--primary admin-btn-sm" id="btn-goto-products">Quản lý toàn bộ ${products.length} sản phẩm →</button>
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
                <th>Trạng thái</th>
                <th style="text-align: right;">Xem</th>
              </tr>
            </thead>
            <tbody>
              ${products.slice(0, 6).map(p => `
                <tr>
                  <td><img src="${p.images[0]}" alt="${p.name}" class="admin-product-thumb" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'"></td>
                  <td><strong>${p.name}</strong></td>
                  <td><code style="background:#eef2f3;padding:2px 6px;border-radius:3px;">${p.reference}</code></td>
                  <td>${p.collection}</td>
                  <td style="color:var(--color-brand-primary);font-weight:600;">${formatPrice(p.price)}</td>
                  <td>
                    <span class="admin-badge ${p.is_active !== false ? 'admin-badge--active' : 'admin-badge--inactive'}">
                      ${p.is_active !== false ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <a href="#/product/${p.id}" target="_blank" class="admin-btn admin-btn--outline admin-btn-sm">Xem PDP ↗</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    contentArea.querySelector('#btn-goto-products').addEventListener('click', () => switchTab('products'));
    contentArea.querySelector('#btn-quick-add-prod').addEventListener('click', () => {
      switchTab('products');
      setTimeout(() => openProductModal(), 100);
    });
    contentArea.querySelector('#btn-quick-inquiries').addEventListener('click', () => switchTab('contacts'));
  }

  // ════════════════════════════════════════════════════════════
  // TAB 2: PRODUCTS
  // ════════════════════════════════════════════════════════════
  function renderProductsTab() {
    contentArea.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div style="display: flex; align-items: center; gap: 14px; flex: 1; flex-wrap: wrap;">
            <input type="text" id="product-search-input" class="admin-form-input" style="max-width: 280px; padding: 8px 12px;" placeholder="Tìm tên hoặc mã SP...">
            <select id="product-filter-cat" class="admin-form-input" style="max-width: 180px; padding: 8px 12px;">
              <option value="all">Tất cả danh mục</option>
              <option value="necklaces">Dây chuyền</option>
              <option value="rings">Nhẫn</option>
              <option value="bracelets">Vòng & Lắc tay</option>
              <option value="earrings">Bông tai</option>
            </select>
            <select id="product-filter-status" class="admin-form-input" style="max-width: 160px; padding: 8px 12px;">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="hidden">Đã ẩn</option>
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
                <th style="width: 50px;">Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Mã SP</th>
                <th>Danh mục</th>
                <th>Bộ sưu tập</th>
                <th>Giá</th>
                <th>Trạng thái</th>
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
    const filterStatus = contentArea.querySelector('#product-filter-status');

    function renderProductRows(items) {
      if (items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--color-text-secondary);">Không tìm thấy sản phẩm nào phù hợp.</td></tr>`;
        return;
      }
      tableBody.innerHTML = items.map(p => {
        const isActive = p.is_active !== false;
        return `
          <tr style="${isActive ? '' : 'opacity: 0.7; background: #fafafa;'}">
            <td><img src="${p.images[0]}" class="admin-product-thumb" alt="${p.name}" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'"></td>
            <td>
              <div style="font-weight:600;color:var(--color-text-primary);">${p.name}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);">${p.materials} ${p.stones ? '• ' + p.stones : ''}</div>
            </td>
            <td><code style="background:#eef2f3;padding:2px 6px;border-radius:3px;font-size:12px;">${p.reference}</code></td>
            <td>${p.category}</td>
            <td><span class="admin-badge admin-badge--active">${p.collection}</span></td>
            <td style="font-weight:700;color:var(--color-brand-primary);">${formatPrice(p.price)}</td>
            <td>
              <span class="admin-badge ${isActive ? 'admin-badge--active' : 'admin-badge--inactive'}">
                ${isActive ? 'Đang hiện' : 'Đã ẩn'}
              </span>
            </td>
            <td style="text-align: right; white-space: nowrap;">
              <button class="admin-btn admin-btn--outline admin-btn-sm toggle-active-btn" data-id="${p.id}" data-active="${isActive ? 'true' : 'false'}" title="${isActive ? 'Ẩn sản phẩm khỏi website' : 'Hiện sản phẩm lên website'}">
                ${isActive ? 'Ẩn' : 'Hiện'}
              </button>
              <button class="admin-btn admin-btn--outline admin-btn-sm edit-product-btn" data-id="${p.id}" style="margin: 0 4px;">Sửa</button>
              <button class="admin-btn admin-btn--danger admin-btn-sm delete-product-btn" data-id="${p.id}">Xóa</button>
            </td>
          </tr>
        `;
      }).join('');

      // Attach row action listeners
      tableBody.querySelectorAll('.toggle-active-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const currentActive = btn.dataset.active === 'true';
          const newActive = !currentActive;
          const item = products.find(p => p.id === btn.dataset.id);
          await toggleProductActive(btn.dataset.id, newActive);
          products = await getAdminProducts();
          filterTable();
          showToast(
            newActive ? `Đã hiển thị "${item ? item.name : 'sản phẩm'}" trên website!` : `Đã ẩn "${item ? item.name : 'sản phẩm'}" khỏi website!`,
            newActive ? 'success' : 'info'
          );
        });
      });

      tableBody.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = products.find(p => p.id === btn.dataset.id);
          if (item) openProductModal(item);
        });
      });

      tableBody.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const item = products.find(p => p.id === btn.dataset.id);
          const name = item ? item.name : 'sản phẩm này';
          const confirmed = await showConfirmModal({
            title: 'Xác nhận xóa sản phẩm',
            message: `Bạn có chắc chắn muốn xóa "${name}"? Sản phẩm này sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu Supabase và không thể khôi phục.`,
            confirmText: 'Xóa vĩnh viễn',
            cancelText: 'Hủy bỏ',
            type: 'danger'
          });

          if (confirmed) {
            await deleteAdminProduct(btn.dataset.id);
            products = await getAdminProducts();
            updateSidebarBadges();
            filterTable();
            showToast(`Đã xóa sản phẩm "${name}" thành công!`, 'success');
          }
        });
      });
    }

    function filterTable() {
      const q = searchInput.value.toLowerCase().trim();
      const cat = filterCat.value;
      const st = filterStatus.value;
      let res = products;

      if (cat !== 'all') res = res.filter(p => p.category === cat);
      if (st === 'active') res = res.filter(p => p.is_active !== false);
      if (st === 'hidden') res = res.filter(p => p.is_active === false);
      if (q) {
        res = res.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.reference && p.reference.toLowerCase().includes(q)) ||
          (p.collection && p.collection.toLowerCase().includes(q))
        );
      }
      renderProductRows(res);
    }

    searchInput.addEventListener('input', filterTable);
    filterCat.addEventListener('change', filterTable);
    filterStatus.addEventListener('change', filterTable);
    contentArea.querySelector('#btn-add-product').addEventListener('click', () => openProductModal());

    renderProductRows(products);
  }

  // ── Product Modal (Add / Edit) ──
  function openProductModal(prod = null) {
    const isEdit = !!prod;
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'admin-modal-overlay';

    const defaultImg = prod && prod.images && prod.images[0]
      ? prod.images[0]
      : './images/products/daychuyen3-removebg-preview.png';

    modalOverlay.innerHTML = `
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3>${isEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
          <button id="modal-close-btn" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--color-text-secondary);">✕</button>
        </div>
        <form id="product-modal-form">
          <div class="admin-modal-body">
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px;">
              <div class="admin-form-group">
                <label>Tên sản phẩm *</label>
                <input type="text" id="m-name" class="admin-form-input" required value="${prod ? prod.name : ''}" placeholder="VD: Dây chuyền cỏ ba lá xà cừ">
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
                <input type="number" id="m-price" class="admin-form-input" required value="${prod ? prod.price : 249000}" step="1000">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="admin-form-group">
                <label>Chất liệu</label>
                <input type="text" id="m-materials" class="admin-form-input" value="${prod ? prod.materials : 'Bạc 925 xi vàng'}">
              </div>
              <div class="admin-form-group">
                <label>Đá đính kèm</label>
                <input type="text" id="m-stones" class="admin-form-input" value="${prod ? prod.stones : 'Xà cừ, Đá CZ'}">
              </div>
            </div>

            <div class="admin-form-group">
              <label>Link ảnh sản phẩm chính</label>
              <div style="display: flex; gap: 12px; align-items: center;">
                <input type="text" id="m-image" class="admin-form-input" style="flex: 1;" required value="${defaultImg}">
                <img id="m-img-preview" src="${defaultImg}" class="admin-img-preview-thumb" alt="Preview" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
              </div>
              <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 6px;">
                Gợi ý ảnh mẫu: 
                <a href="javascript:void(0)" class="preset-img-btn" data-url="./images/products/daychuyen3-removebg-preview.png" style="color:var(--color-brand-primary);margin-right:8px;">[Dây chuyền 3]</a>
                <a href="javascript:void(0)" class="preset-img-btn" data-url="./images/products/4-removebg-preview.png" style="color:var(--color-brand-primary);margin-right:8px;">[Nhẫn/Lắc cỏ 4]</a>
                <a href="javascript:void(0)" class="preset-img-btn" data-url="./images/products/6-removebg-preview.png" style="color:var(--color-brand-primary);margin-right:8px;">[Vòng hạt 6]</a>
                <a href="javascript:void(0)" class="preset-img-btn" data-url="./images/products/bongtay1.1-removebg-preview.png" style="color:var(--color-brand-primary);">[Bông tai 1.1]</a>
              </div>
            </div>

            <div class="admin-form-group">
              <label>Mô tả chi tiết sản phẩm</label>
              <textarea id="m-description" class="admin-form-input" rows="3">${prod ? prod.description : 'Trang sức bạc 925 cao cấp chế tác tinh xảo, quà tặng may mắn cho nàng.'}</textarea>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px; padding: 10px 14px; background: #f8faf9; border-radius: 6px;">
              <input type="checkbox" id="m-active" ${!prod || prod.is_active !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--color-brand-primary); cursor: pointer;">
              <label for="m-active" style="margin: 0; font-size: 13px; font-weight: 600; cursor: pointer;">Hiển thị công khai sản phẩm trên website</label>
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

    // Live preview input listener
    const imgInput = modalOverlay.querySelector('#m-image');
    const imgPreview = modalOverlay.querySelector('#m-img-preview');
    imgInput.addEventListener('input', () => {
      imgPreview.src = imgInput.value.trim() || './images/products/Daychuyen4.3-removebg-preview.png';
    });

    // Preset button click
    modalOverlay.querySelectorAll('.preset-img-btn').forEach(a => {
      a.addEventListener('click', () => {
        imgInput.value = a.dataset.url;
        imgPreview.src = a.dataset.url;
      });
    });

    // Form submit
    modalOverlay.querySelector('#product-modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = modalOverlay.querySelector('button[type="submit"]');
      saveBtn.textContent = 'Đang lưu...';
      saveBtn.disabled = true;

      const updatedItem = {
        id: prod ? prod.id : 'pd-' + Date.now(),
        name: modalOverlay.querySelector('#m-name').value.trim(),
        reference: modalOverlay.querySelector('#m-ref').value.trim(),
        category: modalOverlay.querySelector('#m-category').value,
        collection: modalOverlay.querySelector('#m-collection').value,
        price: parseInt(modalOverlay.querySelector('#m-price').value, 10),
        currency: '₫',
        materials: modalOverlay.querySelector('#m-materials').value.trim(),
        stones: modalOverlay.querySelector('#m-stones').value.trim(),
        images: [modalOverlay.querySelector('#m-image').value.trim()],
        description: modalOverlay.querySelector('#m-description').value.trim(),
        specifications: prod && prod.specifications ? prod.specifications : {
          'Chất liệu': modalOverlay.querySelector('#m-materials').value.trim(),
          'Đá đính kèm': modalOverlay.querySelector('#m-stones').value.trim()
        },
        availableSizes: prod && prod.availableSizes ? prod.availableSizes : ['Freesize'],
        availableColors: prod && prod.availableColors ? prod.availableColors : ['Bạc sáng 925', 'Xi vàng 18K'],
        is_active: modalOverlay.querySelector('#m-active').checked,
        isActive: modalOverlay.querySelector('#m-active').checked,
        rating: prod ? prod.rating : 4.9,
        reviewsCount: prod ? prod.reviewsCount : 20
      };

      await saveAdminProduct(updatedItem);
      products = await getAdminProducts();
      updateSidebarBadges();
      closeModal();
      renderProductsTab();
      showToast(
        isEdit ? `Đã cập nhật sản phẩm "${updatedItem.name}" thành công!` : `Đã thêm sản phẩm mới "${updatedItem.name}" thành công!`,
        'success'
      );
    });
  }

  // ════════════════════════════════════════════════════════════
  // TAB 3: COLLECTIONS
  // ════════════════════════════════════════════════════════════
  function renderCollectionsTab() {
    contentArea.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h3 class="admin-card-title">Danh sách Bộ Sưu Tập Phát Đạt Jewelry</h3>
            <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 4px;">Quản lý các dòng sản phẩm đặc trưng của thương hiệu</div>
          </div>
          <button class="admin-btn admin-btn--primary" id="btn-add-col">+ Thêm Bộ Sưu Tập</button>
        </div>
        <div style="padding: 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${collections.map(c => `
            <div style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04); display: flex; flex-direction: column;">
              <img src="${c.image}" alt="${c.name}" style="width: 100%; height: 160px; object-fit: cover;" onerror="this.src='./images/gallery/g15.jpg'">
              <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h4 style="font-size: 16px; margin: 0; color: var(--color-brand-primary);">${c.name}</h4>
                    <span style="font-size: 11px; background: ${c.color || '#1E5D57'}; color: #fff; padding: 2px 8px; border-radius: 4px;">Màu chủ đạo</span>
                  </div>
                  <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin: 0 0 12px 0;">${c.description || 'Bộ sưu tập trang sức tinh tuyển từ Phát Đạt.'}</p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 12px; margin-top: 12px;">
                  <a href="#/collections/${c.id}" target="_blank" class="admin-btn admin-btn--outline admin-btn-sm">Xem BST ↗</a>
                  <div style="display: flex; gap: 6px;">
                    <button class="admin-btn admin-btn--outline admin-btn-sm edit-col-btn" data-id="${c.id}">Sửa</button>
                    <button class="admin-btn admin-btn--danger admin-btn-sm delete-col-btn" data-id="${c.id}">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    contentArea.querySelector('#btn-add-col').addEventListener('click', () => openCollectionModal());

    contentArea.querySelectorAll('.edit-col-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = collections.find(c => c.id === btn.dataset.id);
        if (item) openCollectionModal(item);
      });
    });

    contentArea.querySelectorAll('.delete-col-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const item = collections.find(c => c.id === btn.dataset.id);
        const name = item ? item.name : 'bộ sưu tập này';
        const confirmed = await showConfirmModal({
          title: 'Xóa bộ sưu tập?',
          message: `Bạn có chắc chắn muốn xóa bộ sưu tập "${name}" không? Lưu ý: Các sản phẩm thuộc BST này sẽ không bị xóa.`,
          confirmText: 'Xóa bộ sưu tập',
          cancelText: 'Hủy bỏ',
          type: 'danger'
        });

        if (confirmed) {
          await deleteAdminCollection(btn.dataset.id);
          collections = await getAdminCollections();
          updateSidebarBadges();
          renderCollectionsTab();
          showToast(`Đã xóa bộ sưu tập "${name}" thành công!`, 'success');
        }
      });
    });
  }

  // Collection Modal
  function openCollectionModal(col = null) {
    const isEdit = !!col;
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'admin-modal-overlay';

    const defaultImg = col ? col.image : './images/gallery/g16.jpg';
    let selectedColor = col ? (col.color || '#1E5D57') : '#1E5D57';

    modalOverlay.innerHTML = `
      <div class="admin-modal" style="max-width: 520px;">
        <div class="admin-modal-header">
          <h3>${isEdit ? 'Chỉnh Sửa Bộ Sưu Tập' : 'Thêm Bộ Sưu Tập Mới'}</h3>
          <button id="col-close-btn" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--color-text-secondary);">✕</button>
        </div>
        <form id="col-modal-form">
          <div class="admin-modal-body">
            <div class="admin-form-group">
              <label>Tên bộ sưu tập *</label>
              <input type="text" id="col-name" class="admin-form-input" required value="${col ? col.name : ''}" placeholder="VD: Hoa Xinh, Ánh Sao...">
            </div>

            <div class="admin-form-group">
              <label>Mô tả ngắn</label>
              <textarea id="col-desc" class="admin-form-input" rows="3" placeholder="Thông điệp hoặc ý nghĩa của bộ sưu tập...">${col ? col.description : ''}</textarea>
            </div>

            <div class="admin-form-group">
              <label>Link ảnh đại diện BST</label>
              <div style="display: flex; gap: 12px; align-items: center;">
                <input type="text" id="col-image" class="admin-form-input" required value="${defaultImg}">
                <img id="col-img-preview" src="${defaultImg}" class="admin-img-preview-thumb" alt="Preview">
              </div>
            </div>

            <div class="admin-form-group">
              <label>Màu sắc chủ đạo nhận diện</label>
              <div class="admin-color-swatches" id="col-swatches">
                <div class="admin-color-swatch ${selectedColor === '#1E5D57' ? 'is-selected' : ''}" data-color="#1E5D57" style="background: #1E5D57;" title="Xanh Ngọc Lục Bảo"></div>
                <div class="admin-color-swatch ${selectedColor === '#C99738' ? 'is-selected' : ''}" data-color="#C99738" style="background: #C99738;" title="Vàng Hoàng Gia"></div>
                <div class="admin-color-swatch ${selectedColor === '#1B2A4A' ? 'is-selected' : ''}" data-color="#1B2A4A" style="background: #1B2A4A;" title="Xanh Đêm"></div>
                <div class="admin-color-swatch ${selectedColor === '#8C1D40' ? 'is-selected' : ''}" data-color="#8C1D40" style="background: #8C1D40;" title="Đỏ Ruby"></div>
                <div class="admin-color-swatch ${selectedColor === '#2C3E50' ? 'is-selected' : ''}" data-color="#2C3E50" style="background: #2C3E50;" title="Xám Đen"></div>
              </div>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="admin-btn admin-btn--outline" id="col-cancel">Hủy</button>
            <button type="submit" class="admin-btn admin-btn--primary">Lưu Bộ Sưu Tập</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeModal = () => modalOverlay.remove();
    modalOverlay.querySelector('#col-close-btn').addEventListener('click', closeModal);
    modalOverlay.querySelector('#col-cancel').addEventListener('click', closeModal);

    const imgInput = modalOverlay.querySelector('#col-image');
    const imgPreview = modalOverlay.querySelector('#col-img-preview');
    imgInput.addEventListener('input', () => {
      imgPreview.src = imgInput.value.trim() || './images/gallery/g15.jpg';
    });

    modalOverlay.querySelectorAll('.admin-color-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        modalOverlay.querySelectorAll('.admin-color-swatch').forEach(s => s.classList.remove('is-selected'));
        sw.classList.add('is-selected');
        selectedColor = sw.dataset.color;
      });
    });

    modalOverlay.querySelector('#col-modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = modalOverlay.querySelector('#col-name').value.trim();
      const updated = {
        id: col ? col.id : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        description: modalOverlay.querySelector('#col-desc').value.trim(),
        image: imgInput.value.trim(),
        color: selectedColor
      };

      await saveAdminCollection(updated);
      collections = await getAdminCollections();
      updateSidebarBadges();
      closeModal();
      renderCollectionsTab();
      showToast(
        isEdit ? `Đã cập nhật BST "${updated.name}" thành công!` : `Đã tạo bộ sưu tập mới "${updated.name}"!`,
        'success'
      );
    });
  }

  // ════════════════════════════════════════════════════════════
  // TAB 4: CONTACTS & INQUIRIES
  // ════════════════════════════════════════════════════════════
  function renderContactsTab() {
    let currentFilter = 'all';

    function renderList() {
      let filtered = contacts;
      if (currentFilter === 'pending') filtered = contacts.filter(c => c.status === 'pending');
      if (currentFilter === 'completed') filtered = contacts.filter(c => c.status === 'completed');

      contentArea.innerHTML = `
        <div class="admin-card">
          <div class="admin-card-header">
            <div>
              <h3 class="admin-card-title">Khách hàng yêu cầu tư vấn & liên hệ</h3>
              <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 4px;">Các câu hỏi từ form liên hệ và nút tư vấn trên website</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="admin-btn ${currentFilter === 'all' ? 'admin-btn--primary' : 'admin-btn--outline'} admin-btn-sm" data-filter="all">Tất cả (${contacts.length})</button>
              <button class="admin-btn ${currentFilter === 'pending' ? 'admin-btn--primary' : 'admin-btn--outline'} admin-btn-sm" data-filter="pending">Chờ xử lý (${contacts.filter(c => c.status === 'pending').length})</button>
              <button class="admin-btn ${currentFilter === 'completed' ? 'admin-btn--primary' : 'admin-btn--outline'} admin-btn-sm" data-filter="completed">Đã tư vấn (${contacts.filter(c => c.status === 'completed').length})</button>
            </div>
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
                ${filtered.length === 0 ? `
                  <tr><td colspan="7" style="text-align:center;padding:32px;color:var(--color-text-secondary);">Không có yêu cầu tư vấn nào trong mục này.</td></tr>
                ` : filtered.map(c => `
                  <tr>
                    <td style="font-size: 12px; color: var(--color-text-muted); white-space: nowrap;">${new Date(c.created_at).toLocaleString('vi-VN')}</td>
                    <td><strong>${c.fullName}</strong></td>
                    <td><a href="tel:${c.phone}" style="color:var(--color-brand-primary);font-weight:600;">${c.phone}</a></td>
                    <td><span class="admin-badge admin-badge--active">${c.subject || 'Tư vấn sản phẩm'}</span></td>
                    <td style="max-width: 260px; font-size: 13px; line-height: 1.4;">${c.message || ''}</td>
                    <td>
                      <span class="admin-badge ${c.status === 'completed' ? 'admin-badge--completed' : 'admin-badge--pending'}">
                        ${c.status === 'completed' ? 'Đã liên hệ' : 'Chờ xử lý'}
                      </span>
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                      <a href="https://zalo.me/${(c.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="admin-btn admin-btn--outline admin-btn-sm" style="margin-right: 4px;">Chat Zalo</a>
                      ${c.status === 'pending' ? `
                        <button class="admin-btn admin-btn--primary admin-btn-sm mark-done-btn" data-id="${c.id}" style="margin-right: 4px;">Đã tư vấn</button>
                      ` : ''}
                      <button class="admin-btn admin-btn--danger admin-btn-sm delete-contact-btn" data-id="${c.id}">Xóa</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Filter tabs
      contentArea.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          currentFilter = btn.dataset.filter;
          renderList();
        });
      });

      // Mark done listeners
      contentArea.querySelectorAll('.mark-done-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          await updateContactStatus(btn.dataset.id, 'completed');
          contacts = await getAdminContacts();
          updateSidebarBadges();
          renderList();
          showToast('Đã đánh dấu là "Đã liên hệ tư vấn" thành công!', 'success');
        });
      });

      // Delete listeners
      contentArea.querySelectorAll('.delete-contact-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const item = contacts.find(c => c.id === btn.dataset.id);
          const name = item ? item.fullName : 'yêu cầu này';
          const confirmed = await showConfirmModal({
            title: 'Xóa yêu cầu tư vấn?',
            message: `Bạn có chắc chắn muốn xóa yêu cầu tư vấn của khách hàng "${name}" không?`,
            confirmText: 'Xác nhận xóa',
            cancelText: 'Hủy bỏ',
            type: 'danger'
          });

          if (confirmed) {
            await deleteAdminContact(btn.dataset.id);
            contacts = await getAdminContacts();
            updateSidebarBadges();
            renderList();
            showToast('Đã xóa yêu cầu tư vấn thành công!', 'success');
          }
        });
      });
    }

    renderList();
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
              <textarea id="input-anon-key" class="admin-form-input" rows="3" placeholder="Dán anon key (eyJhbGciOi...)">${currentKey}</textarea>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 6px;">
                Dùng kết nối API công khai (RLS) cho website và quản trị.
              </div>
            </div>

            <div id="connection-test-feedback" style="margin-bottom: 16px; font-size: 13px; padding: 10px 14px; border-radius: 6px; display: none;"></div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
              <button class="admin-btn admin-btn--primary" id="btn-save-key">Lưu & Kiểm tra kết nối</button>
              <a href="https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new" target="_blank" class="admin-btn admin-btn--outline">Mở SQL Editor Supabase ↗</a>
            </div>

            <!-- Database Sync & Seeding Tools -->
            <div style="border-top: 1px solid #eef2f3; padding-top: 20px;">
              <h4 style="font-size: 14px; color: var(--color-brand-primary); margin: 0 0 8px 0;">Công cụ Đồng bộ Dữ liệu</h4>
              <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 14px 0;">
                Đồng bộ nhanh 20 sản phẩm mẫu và các bộ sưu tập gốc lên Supabase để lưu trữ trên đám mây.
              </p>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="admin-btn admin-btn--outline" id="btn-seed-supabase" style="border-color: var(--color-accent-gold); color: var(--color-brand-primary);">
                  ✨ Đồng bộ 20 Sản Phẩm Mẫu lên Supabase
                </button>
                <button class="admin-btn admin-btn--outline" id="btn-refresh-from-db">
                  🔄 Tải lại dữ liệu từ Supabase
                </button>
              </div>
              <div id="seed-feedback" style="margin-top: 12px; font-size: 13px; padding: 10px 14px; border-radius: 6px; display: none;"></div>
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
              <label>Số Hotline hiển thị</label>
              <input type="text" id="s-phone" class="admin-form-input" value="${siteSettings.phoneDisplay || '0898 025 013'}">
            </div>

            <div class="admin-form-group">
              <label>Link Zalo Chat tư vấn</label>
              <input type="text" id="s-zalo" class="admin-form-input" value="${siteSettings.zalo || 'https://zalo.me/0898025013'}">
            </div>

            <div class="admin-form-group">
              <label>Địa chỉ cửa hàng</label>
              <input type="text" id="s-address" class="admin-form-input" value="${siteSettings.address || 'C3B, 96, Ấp 3B, Tân Vĩnh Lộc, TP. Hồ Chí Minh, Việt Nam'}">
            </div>

            <button class="admin-btn admin-btn--primary" id="btn-save-store">Lưu thông tin cửa hàng</button>
            <div id="store-save-feedback" style="margin-top: 12px; font-size: 13px; padding: 10px 14px; border-radius: 6px; display: none;"></div>
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
        showToast(res.message, 'success');
      } else {
        feedback.style.background = '#FFEBEE';
        feedback.style.color = '#C62828';
        feedback.textContent = 'Lỗi kết nối: ' + res.message;
        page.querySelector('#admin-db-status-pill').className = 'admin-db-status admin-db-status--offline';
        page.querySelector('#admin-db-status-text').textContent = 'Chế độ Lưu Cục Bộ (Offline)';
        showToast('Lỗi kết nối Supabase: ' + res.message, 'error');
      }
      saveBtn.textContent = 'Lưu & Kiểm tra kết nối';
      saveBtn.disabled = false;
    });

    // Seed to Supabase
    const seedBtn = contentArea.querySelector('#btn-seed-supabase');
    const seedFeedback = contentArea.querySelector('#seed-feedback');
    seedBtn.addEventListener('click', async () => {
      seedBtn.textContent = 'Đang đồng bộ lên Supabase...';
      seedBtn.disabled = true;
      try {
        const res = await syncAllProductsToSupabase();
        seedFeedback.style.display = 'block';
        seedFeedback.style.background = '#E8F5E9';
        seedFeedback.style.color = '#2E7D32';
        seedFeedback.textContent = `Đồng bộ thành công! Đã lưu ${res.productsCount} sản phẩm và ${res.collectionsCount} bộ sưu tập lên Supabase.`;
        products = await getAdminProducts();
        collections = await getAdminCollections();
        updateSidebarBadges();
        showToast(`Đồng bộ thành công ${res.productsCount} sản phẩm lên Supabase!`, 'success');
      } catch (err) {
        seedFeedback.style.display = 'block';
        seedFeedback.style.background = '#FFEBEE';
        seedFeedback.style.color = '#C62828';
        seedFeedback.textContent = 'Lỗi đồng bộ: ' + err.message;
        showToast('Lỗi đồng bộ: ' + err.message, 'error');
      }
      seedBtn.textContent = '✨ Đồng bộ 20 Sản Phẩm Mẫu lên Supabase';
      seedBtn.disabled = false;
    });

    // Refresh from DB
    const refreshBtn = contentArea.querySelector('#btn-refresh-from-db');
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = 'Đang tải...';
      refreshBtn.disabled = true;
      try {
        products = await getAdminProducts();
        collections = await getAdminCollections();
        contacts = await getAdminContacts();
        siteSettings = await getAdminSiteSettings();
        updateSidebarBadges();
        showToast(`Đã làm mới dữ liệu thành công từ Supabase: ${products.length} sản phẩm.`, 'success');
      } catch (e) {
        showToast('Lỗi làm mới: ' + e.message, 'error');
      }
      refreshBtn.textContent = '🔄 Tải lại dữ liệu từ Supabase';
      refreshBtn.disabled = false;
    });

    // Save Store Settings
    const storeBtn = contentArea.querySelector('#btn-save-store');
    const storeFeedback = contentArea.querySelector('#store-save-feedback');
    storeBtn.addEventListener('click', async () => {
      storeBtn.textContent = 'Đang lưu...';
      storeBtn.disabled = true;
      const updated = {
        name: contentArea.querySelector('#s-name').value.trim(),
        phoneDisplay: contentArea.querySelector('#s-phone').value.trim(),
        phoneHref: 'tel:' + contentArea.querySelector('#s-phone').value.replace(/[^0-9]/g, ''),
        zalo: contentArea.querySelector('#s-zalo').value.trim(),
        address: contentArea.querySelector('#s-address').value.trim(),
      };
      await saveAdminSiteSettings(updated);
      siteSettings = updated;
      storeFeedback.style.display = 'block';
      storeFeedback.style.background = '#E8F5E9';
      storeFeedback.style.color = '#2E7D32';
      storeFeedback.textContent = 'Đã cập nhật thông tin cửa hàng thành công lên Supabase!';
      storeBtn.textContent = 'Lưu thông tin cửa hàng';
      storeBtn.disabled = false;
      showToast('Đã lưu thông tin cửa hàng thành công!', 'success');
      setTimeout(() => { storeFeedback.style.display = 'none'; }, 4000);
    });
  }

  // Sidebar navigation click
  page.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Logout click with confirm modal
  page.querySelector('#admin-logout-trigger').addEventListener('click', async () => {
    const confirmed = await showConfirmModal({
      title: 'Đăng xuất khỏi Backoffice?',
      message: 'Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc quản trị Phát Đạt Jewelry không?',
      confirmText: 'Đăng xuất',
      cancelText: 'Ở lại',
      type: 'warning'
    });
    if (confirmed) {
      logout();
      showToast('Đã đăng xuất thành công!', 'info');
      navigate('/admin/login');
    }
  });

  // Initial render Overview
  renderOverviewTab();

  container.appendChild(page);
}
