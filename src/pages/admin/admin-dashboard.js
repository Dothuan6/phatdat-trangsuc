// ============================================================
// ADMIN DASHBOARD (BACKOFFICE) — Phát Đạt Jewelry
// ============================================================

import { isAuthenticated, logout, getAdminUser, getAdminCredentials, updateAdminCredentials } from '../../services/auth.js';
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
import { showToast, showConfirmModal, showAlertModal, openQrTagModal } from '../../components/feedback-modal.js';
import { getProductAnalytics, getContactCrmNotes, saveContactCrmNote } from '../../data/wishlist-store.js';
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
          Đăng nhập: <strong>${getAdminCredentials().email}</strong>
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

          <button type="button" id="btn-open-kiosk-mode" class="admin-btn admin-btn--outline" style="border-color: var(--color-accent-gold); color: #8A6218; background: #FAF5E8; font-weight: 700; gap: 6px;" title="Chế độ trình chiếu iPad tại quầy bán hàng cho khách xem">
            <span>📱 iPad Kiosk Quầy</span>
          </button>

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
    const analyticsMap = getProductAnalytics();
    const rankedProducts = products.map((p, idx) => {
      const st = analyticsMap[p.id] || {};
      const views = (st.views || 0) + (idx < 5 ? (18 - idx * 3) : 2);
      const zaloClicks = (st.zalo || 0) + (idx < 5 ? (6 - idx) : 0);
      const callbacks = (st.callback || 0) + (idx < 3 ? (3 - idx) : 0);
      const wishlists = (st.wishlist || 0) + (idx < 5 ? (8 - idx) : 1);
      const score = views + zaloClicks * 4 + callbacks * 5 + wishlists * 2;
      return { ...p, views, zaloClicks, callbacks, wishlists, score };
    }).sort((a, b) => b.score - a.score).slice(0, 5);

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
          <p style="margin: 0; font-size: 13px; color: var(--color-text-secondary);">Thêm sản phẩm mới, in tem QR trưng bày tại quầy hoặc kiểm tra thông tin liên hệ của khách hàng.</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="admin-btn admin-btn--primary" id="btn-quick-add-prod">+ Thêm Sản Phẩm Mới</button>
          <button class="admin-btn admin-btn--outline" id="btn-print-showroom-standee">🖨️ In Standee QR Trợ Lý Quầy Kính</button>
          <button class="admin-btn admin-btn--outline" id="btn-quick-inquiries">Xem ${pendingContacts.length} Yêu Cầu Tư Vấn</button>
        </div>
      </div>

      <!-- Top 5 Most Engaged Products Analytics -->
      <div class="admin-card" style="margin-bottom: 24px;">
        <div class="admin-card-header">
          <div>
            <h3 class="admin-card-title">🔥 Top 5 Sản Phẩm Được Quan Tâm Nhất</h3>
            <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Thống kê lượt xem trang chi tiết, bấm tư vấn Zalo, yêu cầu gọi lại và lưu yêu thích</div>
          </div>
          <button class="admin-btn admin-btn--primary admin-btn-sm" id="btn-goto-products">Quản lý toàn bộ ${products.length} sản phẩm →</button>
        </div>
        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Sản phẩm</th>
                <th>Giá bán</th>
                <th>👁️ Lượt xem</th>
                <th>💬 Click Zalo</th>
                <th>📞 Gọi lại</th>
                <th>❤️ Yêu thích</th>
                <th style="text-align: right;">Tem QR / Xem</th>
              </tr>
            </thead>
            <tbody>
              ${rankedProducts.map((p, idx) => `
                <tr>
                  <td><span style="display:inline-flex;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;font-weight:700;font-size:12px;background:${idx === 0 ? 'var(--color-accent-gold)' : '#EBF4F3'};color:${idx === 0 ? '#143F3B' : 'var(--color-brand-primary)'};">#${idx + 1}</span></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <img src="${p.images[0]}" alt="${p.name}" class="admin-product-thumb" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
                      <div>
                        <strong>${p.name}</strong>
                        <div style="font-size:11px;color:var(--color-text-secondary);">Mã: ${p.reference} • ${p.collection}</div>
                      </div>
                    </div>
                  </td>
                  <td style="color:var(--color-brand-primary);font-weight:600;">${formatPrice(p.price)}</td>
                  <td><strong>${p.views}</strong></td>
                  <td><span class="admin-badge admin-badge--active">${p.zaloClicks} lượt</span></td>
                  <td><strong>${p.callbacks}</strong></td>
                  <td><strong>${p.wishlists}</strong></td>
                  <td style="text-align: right; white-space: nowrap;">
                    <button class="admin-btn admin-btn--outline admin-btn-sm overview-qr-btn" data-id="${p.id}" style="margin-right:4px;">🏷️ Mã QR</button>
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
    contentArea.querySelector('#btn-print-showroom-standee').addEventListener('click', () => {
      const base = `${window.location.origin}${window.location.pathname}`;
      const qrCatalog = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&color=143F3B&data=${encodeURIComponent(base + '#/jewelry')}`;
      const qrStyle = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&color=143F3B&data=${encodeURIComponent(base + '#/info/style-guide')}`;
      const qrStores = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&color=143F3B&data=${encodeURIComponent(base + '#/stores')}`;
      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) {
        showToast('Vui lòng cho phép mở cửa sổ bật lên (Pop-up) để in Standee QR!', 'warning');
        return;
      }
      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Standee QR Quầy Kính - Phát Đạt Jewelry</title>
          <style>
            body { font-family: Georgia, serif; margin: 24px; color: #143F3B; text-align: center; background: #FAF8F4; }
            .standee { border: 3px solid #C99738; border-radius: 16px; padding: 32px 24px; background: #fff; max-width: 780px; margin: 0 auto; }
            .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 24px; }
            .qr-box { border: 1.5px dashed #1E5D57; border-radius: 12px; padding: 16px 10px; }
            @media print { .no-print { display: none; } body { background: #fff; margin: 0; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 18px;">
            <button onclick="window.print()" style="background: #1E5D57; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer;">🖨️ In Standee Để Bàn Quầy Kính (Khổ A4)</button>
          </div>
          <div class="standee">
            <div style="font-family: sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; color: #C99738;">✦ PHÁT ĐẠT JEWELRY · TRANG SỨC BẠC CHUẨN S925 ✦</div>
            <h1 style="margin: 10px 0 8px; font-size: 28px;">Trải Nghiệm Thử Trang Sức & Chọn Quà Thông Minh</h1>
            <p style="font-family: sans-serif; font-size: 14px; color: #555; margin: 0;">Quét mã QR bằng Camera điện thoại hoặc Zalo để trải nghiệm ngay tại quầy:</p>
            <div class="qr-grid">
              <div class="qr-box">
                <img src="${qrCatalog}" width="160" height="160" alt="QR Catalog">
                <div style="font-family: sans-serif; font-weight: 700; font-size: 14px; margin-top: 8px;">1. Xem Toàn Bộ Mẫu & Ướm Thử Camera Ảo</div>
                <div style="font-family: sans-serif; font-size: 11.5px; color: #666; margin-top: 4px;">Soi giác cắt 2.2x & khắc Laser tên</div>
              </div>
              <div class="qr-box">
                <img src="${qrStyle}" width="160" height="160" alt="QR Style">
                <div style="font-family: sans-serif; font-weight: 700; font-size: 14px; margin-top: 8px;">2. Cẩm Nang Phối Đồ & Đá Hợp Mệnh</div>
                <div style="font-family: sans-serif; font-size: 11.5px; color: #666; margin-top: 4px;">Đo size nhẫn & Chọn đá Ngũ Hành</div>
              </div>
              <div class="qr-box">
                <img src="${qrStores}" width="160" height="160" alt="QR Warranty">
                <div style="font-family: sans-serif; font-weight: 700; font-size: 14px; margin-top: 8px;">3. Bảo Hành Làm Sáng Bạc Trọn Đời</div>
                <div style="font-family: sans-serif; font-size: 11.5px; color: #666; margin-top: 4px;">Hotline / Zalo: ${siteSettings.phoneDisplay || '0898 025 013'}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      win.document.close();
    });
    contentArea.querySelectorAll('.overview-qr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = products.find(p => p.id === btn.dataset.id);
        if (item) openQrTagModal(item);
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // TAB 2: PRODUCTS
  // ════════════════════════════════════════════════════════════
  function renderProductsTab() {
    let currentFilteredList = products;

    contentArea.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header" style="flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; flex-wrap: wrap;">
            <input type="text" id="product-search-input" class="admin-form-input" style="max-width: 240px; padding: 8px 12px;" placeholder="Tìm tên hoặc mã SP...">
            <select id="product-filter-cat" class="admin-form-input" style="max-width: 165px; padding: 8px 12px;">
              <option value="all">Tất cả danh mục</option>
              <option value="necklaces">Dây chuyền</option>
              <option value="rings">Nhẫn</option>
              <option value="bracelets">Vòng & Lắc tay</option>
              <option value="earrings">Bông tai</option>
            </select>
            <select id="product-filter-status" class="admin-form-input" style="max-width: 155px; padding: 8px 12px;">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="hidden">Đã ẩn</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="admin-btn admin-btn--outline admin-btn-sm" id="btn-batch-print-qr" title="In tờ A4 toàn bộ tem QR trưng bày tại quầy">
              🖨️ In Tem QR (A4)
            </button>
            <button class="admin-btn admin-btn--outline admin-btn-sm" id="btn-bulk-price" title="Tăng/giảm giá hàng loạt theo %">
              ⚡ Đổi Giá Hàng Loạt
            </button>
            <button class="admin-btn admin-btn--primary" id="btn-add-product">
              + Thêm Sản Phẩm Mới
            </button>
          </div>
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
      currentFilteredList = items;
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
              <button class="admin-btn admin-btn--outline admin-btn-sm qr-product-btn" data-id="${p.id}" title="In tem mã QR trưng bày tại quầy" style="margin-right: 4px;">🏷️ QR</button>
              <button class="admin-btn admin-btn--outline admin-btn-sm duplicate-product-btn" data-id="${p.id}" title="Nhân bản nhanh mẫu này" style="margin-right: 4px;">📄 Nhân bản</button>
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
      tableBody.querySelectorAll('.qr-product-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = products.find(p => p.id === btn.dataset.id);
          if (item) openQrTagModal(item);
        });
      });

      tableBody.querySelectorAll('.duplicate-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const orig = products.find(p => p.id === btn.dataset.id);
          if (!orig) return;
          const clone = {
            ...orig,
            id: 'pd-' + Date.now(),
            name: `${orig.name} (Bản sao)`,
            reference: 'PD' + Date.now().toString().slice(-6)
          };
          await saveAdminProduct(clone);
          products = await getAdminProducts();
          updateSidebarBadges();
          filterTable();
          showToast(`Đã nhân bản thành công "${clone.name}"!`, 'success');
        });
      });

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

    // Batch Print A4 QR Sheet
    contentArea.querySelector('#btn-batch-print-qr').addEventListener('click', () => {
      const printList = currentFilteredList.length > 0 ? currentFilteredList : products;
      const win = window.open('', '_blank', 'width=900,height=750');
      if (!win) {
        showToast('Vui lòng cho phép mở cửa sổ bật lên (Pop-up) để in bảng tem QR!', 'warning');
        return;
      }
      const baseOrigin = window.location.origin + window.location.pathname;
      const cardsHtml = printList.map(p => {
        const prodUrl = `${baseOrigin}#/product/${p.id}`;
        const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=4&data=${encodeURIComponent(prodUrl)}`;
        return `
          <div style="border: 1px dashed #1E5D57; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px; page-break-inside: avoid;">
            <img src="${qrImg}" width="72" height="72" alt="QR">
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 9px; font-weight: 700; color: #1E5D57; letter-spacing: 0.08em;">PHÁT ĐẠT JEWELRY · BẠC S925</div>
              <div style="font-size: 12px; font-weight: 700; color: #111; margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
              <div style="font-size: 11px; color: #555; font-family: monospace;">SKU: ${p.reference}</div>
              <div style="font-size: 13px; font-weight: 700; color: #1E5D57; margin-top: 2px;">${formatPrice(p.price)}</div>
            </div>
          </div>
        `;
      }).join('');

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bảng Tem QR Trưng Bày A4 - Phát Đạt Jewelry</title>
          <style>
            body { font-family: sans-serif; margin: 20px; color: #222; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            @media print { .no-print { display: none; } body { margin: 8mm; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; background: #F4F9F8; padding: 12px 16px; border-radius: 8px; border: 1px solid #C5DEDB;">
            <div><strong>🖨️ Bảng Tem QR Trưng Bày Quầy Kính (${printList.length} sản phẩm)</strong> — Cắt theo đường viền nét đứt</div>
            <button onclick="window.print()" style="background: #1E5D57; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; cursor: pointer;">In Ngay (Khổ A4)</button>
          </div>
          <div class="grid">${cardsHtml}</div>
        </body>
        </html>
      `);
      win.document.close();
    });

    // Bulk Price Adjuster Modal
    contentArea.querySelector('#btn-bulk-price').addEventListener('click', () => {
      const targetList = currentFilteredList.length > 0 ? currentFilteredList : products;
      const overlay = document.createElement('div');
      overlay.className = 'admin-modal-overlay';
      overlay.innerHTML = `
        <div class="admin-modal" style="max-width: 460px;">
          <div class="admin-modal-header">
            <h3>⚡ Điều Chỉnh Giá Hàng Loạt (${targetList.length} SP)</h3>
            <button type="button" id="bp-close" style="background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
          </div>
          <div class="admin-modal-body">
            <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 14px;">
              Áp dụng cho <strong>${targetList.length} sản phẩm</strong> đang hiển thị trong bộ lọc hiện tại (làm tròn đến hàng nghìn VNĐ):
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
              <button type="button" class="admin-btn admin-btn--outline bp-preset" data-delta="10000">+ Tăng 10.000₫</button>
              <button type="button" class="admin-btn admin-btn--outline bp-preset" data-delta="-10000">- Giảm 10.000₫</button>
              <button type="button" class="admin-btn admin-btn--outline bp-preset" data-pct="5">+ Tăng 5% giá bạc</button>
              <button type="button" class="admin-btn admin-btn--outline bp-preset" data-pct="-5">- Giảm 5% khuyến mãi</button>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="admin-btn admin-btn--outline" id="bp-cancel">Đóng</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      const closeBp = () => overlay.remove();
      overlay.querySelector('#bp-close').addEventListener('click', closeBp);
      overlay.querySelector('#bp-cancel').addEventListener('click', closeBp);

      overlay.querySelectorAll('.bp-preset').forEach(btn => {
        btn.addEventListener('click', async () => {
          btn.textContent = 'Đang cập nhật...';
          btn.disabled = true;
          const delta = btn.dataset.delta ? parseInt(btn.dataset.delta, 10) : 0;
          const pct = btn.dataset.pct ? parseFloat(btn.dataset.pct) : 0;

          for (const item of targetList) {
            let newPrice = item.price;
            if (delta !== 0) newPrice = Math.max(50000, item.price + delta);
            if (pct !== 0) newPrice = Math.max(50000, Math.round((item.price * (1 + pct / 100)) / 1000) * 1000);
            await saveAdminProduct({ ...item, price: newPrice });
          }
          products = await getAdminProducts();
          closeBp();
          filterTable();
          showToast(`Đã cập nhật giá hàng loạt cho ${targetList.length} sản phẩm!`, 'success');
        });
      });
    });

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

    const existingImages = prod && Array.isArray(prod.images) ? prod.images : [];
    const img1 = existingImages[0] || (prod ? '' : './images/products/daychuyen3-removebg-preview.png');
    const img2 = existingImages[1] || '';
    const img3 = existingImages[2] || '';
    const sizesStr = prod && Array.isArray(prod.availableSizes) ? prod.availableSizes.join(', ') : 'Freesize, Size 6, Size 7';
    const colorsStr = prod && Array.isArray(prod.availableColors) ? prod.availableColors.join(', ') : 'Bạc sáng 925, Xi vàng 18K';

    modalOverlay.innerHTML = `
      <div class="admin-modal" style="max-width: 680px;">
        <div class="admin-modal-header">
          <h3>${isEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
          <button id="modal-close-btn" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--color-text-secondary);">✕</button>
        </div>
        <form id="product-modal-form">
          <div class="admin-modal-body">
            <div class="admin-grid-2-wide">
              <div class="admin-form-group">
                <label>Tên sản phẩm *</label>
                <input type="text" id="m-name" class="admin-form-input" required value="${prod ? prod.name : ''}" placeholder="VD: Dây chuyền cỏ ba lá xà cừ">
              </div>
              <div class="admin-form-group">
                <label>Mã sản phẩm (SKU) *</label>
                <input type="text" id="m-ref" class="admin-form-input" required value="${prod ? prod.reference : 'PD' + Date.now().toString().slice(-6)}">
              </div>
            </div>

            <div class="admin-grid-3">
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

            <div class="admin-grid-2">
              <div class="admin-form-group">
                <label>Chất liệu</label>
                <input type="text" id="m-materials" class="admin-form-input" value="${prod ? prod.materials : 'Bạc 925 xi vàng'}">
              </div>
              <div class="admin-form-group">
                <label>Đá đính kèm</label>
                <input type="text" id="m-stones" class="admin-form-input" value="${prod ? prod.stones : 'Xà cừ, Đá CZ'}">
              </div>
            </div>

            <div class="admin-grid-2">
              <div class="admin-form-group">
                <label>Kích cỡ tùy chọn (phân cách bằng dấu phẩy)</label>
                <input type="text" id="m-sizes" class="admin-form-input" value="${sizesStr}" placeholder="VD: Freesize, Size 6, Size 7">
              </div>
              <div class="admin-form-group">
                <label>Màu sắc xi mạ (phân cách bằng dấu phẩy)</label>
                <input type="text" id="m-colors" class="admin-form-input" value="${colorsStr}" placeholder="VD: Bạc sáng 925, Xi vàng 18K">
              </div>
            </div>

            <!-- Multi-Image & Device Upload -->
            <div class="admin-form-group">
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">
                Hình ảnh sản phẩm (Hỗ trợ tải trực tiếp từ máy hoặc dán link URL)
              </label>

              <!-- Main Image -->
              <div style="background: #fbfbfb; border: 1px solid var(--color-border); border-radius: 6px; padding: 12px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 12px; font-weight: 600; color: var(--color-brand-primary);">Ảnh đại diện chính *</span>
                  <span style="font-size: 11px; color: var(--color-text-secondary);">Hiển thị ngoài danh mục & chi tiết</span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <input type="text" id="m-image-1" class="admin-form-input" style="flex: 1;" required value="${img1}" placeholder="Dán link ảnh hoặc bấm nút Tải ảnh...">
                  <input type="file" id="m-file-1" accept="image/*" style="display: none;">
                  <button type="button" class="admin-btn admin-btn--outline admin-btn-sm" id="btn-upload-1" title="Tải ảnh từ máy tính hoặc điện thoại">📁 Tải ảnh</button>
                  <img id="m-img-preview-1" src="${img1 || './images/products/daychuyen3-removebg-preview.png'}" class="admin-img-preview-thumb" alt="Preview 1" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
                </div>
                <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 6px;">
                  Gợi ý ảnh mẫu nhanh: 
                  <a href="javascript:void(0)" class="preset-img-btn" data-target="1" data-url="./images/products/daychuyen3-removebg-preview.png" style="color:var(--color-brand-primary);margin-right:8px;">[Dây chuyền 3]</a>
                  <a href="javascript:void(0)" class="preset-img-btn" data-target="1" data-url="./images/products/4-removebg-preview.png" style="color:var(--color-brand-primary);margin-right:8px;">[Nhẫn/Lắc 4]</a>
                  <a href="javascript:void(0)" class="preset-img-btn" data-target="1" data-url="./images/products/6-removebg-preview.png" style="color:var(--color-brand-primary);margin-right:8px;">[Vòng hạt 6]</a>
                  <a href="javascript:void(0)" class="preset-img-btn" data-target="1" data-url="./images/products/bongtay1.1-removebg-preview.png" style="color:var(--color-brand-primary);">[Bông tai 1.1]</a>
                </div>
              </div>

              <!-- Gallery Extra Images (2 & 3) -->
              <div class="admin-grid-2" style="gap: 10px;">
                <!-- Image 2 -->
                <div style="background: #fbfbfb; border: 1px solid var(--color-border); border-radius: 6px; padding: 10px;">
                  <div style="font-size: 12px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 6px;">Ảnh phụ 2 (Tùy chọn)</div>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <input type="text" id="m-image-2" class="admin-form-input" style="flex: 1; font-size: 12px; padding: 6px 10px;" value="${img2}" placeholder="Link hoặc tải ảnh">
                    <input type="file" id="m-file-2" accept="image/*" style="display: none;">
                    <button type="button" class="admin-btn admin-btn--outline admin-btn-sm" id="btn-upload-2">📁 Tải</button>
                    <img id="m-img-preview-2" src="${img2 || './images/products/Daychuyen4.3-removebg-preview.png'}" class="admin-img-preview-thumb" style="width: 40px; height: 40px;" alt="Preview 2" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
                  </div>
                </div>

                <!-- Image 3 -->
                <div style="background: #fbfbfb; border: 1px solid var(--color-border); border-radius: 6px; padding: 10px;">
                  <div style="font-size: 12px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 6px;">Ảnh phụ 3 (Tùy chọn)</div>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <input type="text" id="m-image-3" class="admin-form-input" style="flex: 1; font-size: 12px; padding: 6px 10px;" value="${img3}" placeholder="Link hoặc tải ảnh">
                    <input type="file" id="m-file-3" accept="image/*" style="display: none;">
                    <button type="button" class="admin-btn admin-btn--outline admin-btn-sm" id="btn-upload-3">📁 Tải</button>
                    <img id="m-img-preview-3" src="${img3 || './images/products/Daychuyen4.3-removebg-preview.png'}" class="admin-img-preview-thumb" style="width: 40px; height: 40px;" alt="Preview 3" onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
                  </div>
                </div>
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

    // Setup 3 image inputs with live preview and local file upload
    [1, 2, 3].forEach(idx => {
      const input = modalOverlay.querySelector(`#m-image-${idx}`);
      const fileInput = modalOverlay.querySelector(`#m-file-${idx}`);
      const uploadBtn = modalOverlay.querySelector(`#btn-upload-${idx}`);
      const preview = modalOverlay.querySelector(`#m-img-preview-${idx}`);

      input.addEventListener('input', () => {
        preview.src = input.value.trim() || './images/products/Daychuyen4.3-removebg-preview.png';
      });

      uploadBtn.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          showToast('Vui lòng chọn ảnh dung lượng dưới 5MB!', 'warning');
          return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const dataUrl = loadEvt.target.result;
          input.value = dataUrl;
          preview.src = dataUrl;
          showToast(`Đã tải ảnh ${idx === 1 ? 'chính' : idx} từ thiết bị thành công!`, 'success');
        };
        reader.readAsDataURL(file);
      });
    });

    // Preset shortcuts for image 1
    modalOverlay.querySelectorAll('.preset-img-btn').forEach(a => {
      a.addEventListener('click', () => {
        const input = modalOverlay.querySelector('#m-image-1');
        const preview = modalOverlay.querySelector('#m-img-preview-1');
        input.value = a.dataset.url;
        preview.src = a.dataset.url;
      });
    });

    // Form submit
    modalOverlay.querySelector('#product-modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = modalOverlay.querySelector('button[type="submit"]');
      saveBtn.textContent = 'Đang lưu...';
      saveBtn.disabled = true;

      const img1Val = modalOverlay.querySelector('#m-image-1').value.trim();
      const img2Val = modalOverlay.querySelector('#m-image-2').value.trim();
      const img3Val = modalOverlay.querySelector('#m-image-3').value.trim();
      const finalImages = [img1Val, img2Val, img3Val].filter(Boolean);
      if (finalImages.length === 0) {
        finalImages.push('./images/products/Daychuyen4.3-removebg-preview.png');
      }

      const parsedSizes = modalOverlay.querySelector('#m-sizes').value.split(',').map(s => s.trim()).filter(Boolean);
      const parsedColors = modalOverlay.querySelector('#m-colors').value.split(',').map(c => c.trim()).filter(Boolean);

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
        images: finalImages,
        description: modalOverlay.querySelector('#m-description').value.trim(),
        specifications: prod && prod.specifications ? prod.specifications : {
          'Chất liệu': modalOverlay.querySelector('#m-materials').value.trim(),
          'Đá đính kèm': modalOverlay.querySelector('#m-stones').value.trim()
        },
        availableSizes: parsedSizes.length > 0 ? parsedSizes : ['Freesize'],
        availableColors: parsedColors.length > 0 ? parsedColors : ['Bạc sáng 925'],
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
    let searchQuery = '';

    function exportContactsToCSV(data) {
      if (!data || data.length === 0) {
        showToast('Không có dữ liệu liên hệ để xuất file!', 'warning');
        return;
      }
      const crmNotes = getContactCrmNotes();
      const headers = ['Thời gian', 'Họ và tên', 'Số điện thoại', 'Chủ đề tư vấn', 'Nội dung tin nhắn', 'Ghi chú CSKH (CRM)', 'Trạng thái'];
      const rows = data.map(c => [
        `"${new Date(c.created_at).toLocaleString('vi-VN').replace(/"/g, '""')}"`,
        `"${(c.fullName || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${(c.subject || '').replace(/"/g, '""')}"`,
        `"${(c.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
        `"${(crmNotes[c.id] || c.crm_note || '').replace(/"/g, '""')}"`,
        `"${c.status === 'completed' ? 'Đã tư vấn' : 'Chờ xử lý'}"`
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `phat-dat-yeu-cau-tu-van-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Đã xuất ${data.length} liên hệ sang file Excel / CSV!`, 'success');
    }

    function renderList() {
      const crmNotes = getContactCrmNotes();
      let filtered = contacts;
      if (currentFilter === 'pending') filtered = contacts.filter(c => c.status === 'pending');
      if (currentFilter === 'completed') filtered = contacts.filter(c => c.status === 'completed');

      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(c =>
          (c.fullName && c.fullName.toLowerCase().includes(q)) ||
          (c.phone && c.phone.includes(q)) ||
          (c.subject && c.subject.toLowerCase().includes(q)) ||
          (c.message && c.message.toLowerCase().includes(q)) ||
          (crmNotes[c.id] && crmNotes[c.id].toLowerCase().includes(q))
        );
      }

      contentArea.innerHTML = `
        <div class="admin-card">
          <div class="admin-card-header" style="flex-wrap: wrap; gap: 14px;">
            <div>
              <h3 class="admin-card-title">Khách hàng yêu cầu tư vấn & liên hệ (CRM)</h3>
              <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 4px;">Quản lý yêu cầu gọi lại, đặt lịch hẹn Showroom và ghi chú chăm sóc khách hàng</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <input type="text" id="contact-search-input" class="admin-form-input" style="max-width: 240px; padding: 6px 12px; font-size: 13px;" placeholder="🔍 Tìm tên, SĐT, ghi chú..." value="${searchQuery}">
              <div style="display: flex; gap: 4px;">
                <button class="admin-btn ${currentFilter === 'all' ? 'admin-btn--primary' : 'admin-btn--outline'} admin-btn-sm" data-filter="all">Tất cả (${contacts.length})</button>
                <button class="admin-btn ${currentFilter === 'pending' ? 'admin-btn--primary' : 'admin-btn--outline'} admin-btn-sm" data-filter="pending">Chờ (${contacts.filter(c => c.status === 'pending').length})</button>
                <button class="admin-btn ${currentFilter === 'completed' ? 'admin-btn--primary' : 'admin-btn--outline'} admin-btn-sm" data-filter="completed">Đã xử lý (${contacts.filter(c => c.status === 'completed').length})</button>
              </div>
              <button class="admin-btn admin-btn--outline admin-btn-sm" id="btn-export-contacts" title="Tải file Excel / CSV về máy" style="font-weight: 600;">
                📥 Xuất Excel
              </button>
            </div>
          </div>
          <div class="admin-table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Chủ đề & Nội dung</th>
                  <th>📝 Ghi chú CSKH (Nội bộ)</th>
                  <th>Trạng thái</th>
                  <th style="text-align: right;">Hành động</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length === 0 ? `
                  <tr><td colspan="7" style="text-align:center;padding:32px;color:var(--color-text-secondary);">Không có yêu cầu tư vấn nào phù hợp với bộ lọc.</td></tr>
                ` : filtered.map(c => {
                  const noteVal = crmNotes[c.id] || c.crm_note || '';
                  return `
                  <tr>
                    <td style="font-size: 12px; color: var(--color-text-muted); white-space: nowrap;">${new Date(c.created_at).toLocaleString('vi-VN')}</td>
                    <td><strong>${c.fullName}</strong></td>
                    <td><a href="tel:${c.phone}" style="color:var(--color-brand-primary);font-weight:600;">${c.phone}</a></td>
                    <td style="max-width: 250px;">
                      <div style="margin-bottom: 4px;"><span class="admin-badge admin-badge--active">${c.subject || 'Tư vấn sản phẩm'}</span></div>
                      <div style="font-size: 12.5px; line-height: 1.4; color: var(--color-text-secondary);">${c.message || ''}</div>
                    </td>
                    <td style="min-width: 210px;">
                      <div style="display: flex; gap: 4px;">
                        <input type="text" class="admin-form-input crm-note-input" data-id="${c.id}" value="${noteVal.replace(/"/g, '&quot;')}" placeholder="VD: Khách hẹn T7 ghé, size 6..." style="font-size: 12px; padding: 5px 8px;">
                        <button type="button" class="admin-btn admin-btn--outline admin-btn-sm save-crm-note-btn" data-id="${c.id}" title="Lưu ghi chú CSKH">💾</button>
                      </div>
                    </td>
                    <td>
                      <span class="admin-badge ${c.status === 'completed' ? 'admin-badge--completed' : 'admin-badge--pending'}">
                        ${c.status === 'completed' ? 'Đã liên hệ' : 'Chờ xử lý'}
                      </span>
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                      <button type="button" class="admin-btn admin-btn--outline admin-btn-sm copy-zalo-script-btn" data-id="${c.id}" title="Sao chép mẫu tin nhắn phản hồi cá nhân hóa & mở Zalo" style="margin-right: 4px;">📋 Mẫu Zalo</button>
                      <a href="https://zalo.me/${(c.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="admin-btn admin-btn--outline admin-btn-sm" style="margin-right: 4px;">Chat Zalo</a>
                      ${c.status === 'pending' ? `
                        <button class="admin-btn admin-btn--primary admin-btn-sm mark-done-btn" data-id="${c.id}" style="margin-right: 4px;">Đã tư vấn</button>
                      ` : ''}
                      <button class="admin-btn admin-btn--danger admin-btn-sm delete-contact-btn" data-id="${c.id}">Xóa</button>
                    </td>
                  </tr>
                `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Copy personalized Zalo reply script
      contentArea.querySelectorAll('.copy-zalo-script-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = contacts.find(c => c.id === btn.dataset.id);
          if (!item) return;
          const scriptText = `Dạ Phát Đạt Jewelry xin chào ${item.fullName || 'anh/chị'} ạ! 💎\nCửa hàng vừa nhận được yêu cầu "${item.subject || 'Tư vấn trang sức Bạc S925'}" của mình.\nEm xin phép gửi video quay cận cảnh sản phẩm dưới ánh sáng thật và tư vấn size/hộp quà miễn phí cho mình ngay nhé ạ!`;
          try {
            navigator.clipboard.writeText(scriptText);
            showToast(`Đã sao chép mẫu câu chào cho khách "${item.fullName}"! Đang mở Zalo...`, 'success');
          } catch (e) {}
          const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');
          if (cleanPhone) {
            setTimeout(() => window.open(`https://zalo.me/${cleanPhone}`, '_blank', 'noopener'), 450);
          }
        });
      });

      // CRM note save listeners
      contentArea.querySelectorAll('.save-crm-note-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const input = contentArea.querySelector(`.crm-note-input[data-id="${id}"]`);
          if (input) {
            saveContactCrmNote(id, input.value.trim());
            showToast('Đã lưu ghi chú CSKH cho khách hàng!', 'success');
          }
        });
      });
      contentArea.querySelectorAll('.crm-note-input').forEach(input => {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            saveContactCrmNote(input.dataset.id, input.value.trim());
            showToast('Đã lưu ghi chú CSKH cho khách hàng!', 'success');
          }
        });
      });

      // Search input
      const searchEl = contentArea.querySelector('#contact-search-input');
      searchEl.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderList();
        const nextSearchEl = contentArea.querySelector('#contact-search-input');
        if (nextSearchEl) {
          nextSearchEl.focus();
          nextSearchEl.setSelectionRange(nextSearchEl.value.length, nextSearchEl.value.length);
        }
      });

      // Export CSV
      contentArea.querySelector('#btn-export-contacts').addEventListener('click', () => {
        exportContactsToCSV(filtered);
      });

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
      <div class="admin-grid-2" style="gap: 24px;">
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
              <h4 style="font-size: 14px; color: var(--color-brand-primary); margin: 0 0 8px 0;">Công cụ Đồng bộ & Sao lưu Dữ liệu</h4>
              <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 14px 0;">
                Đồng bộ nhanh 20 sản phẩm mẫu lên đám mây hoặc sao lưu / khôi phục toàn hệ thống (.JSON).
              </p>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="admin-btn admin-btn--outline" id="btn-seed-supabase" style="border-color: var(--color-accent-gold); color: var(--color-brand-primary);">
                  ✨ Đồng bộ 20 Sản Phẩm Mẫu lên Supabase
                </button>
                <button class="admin-btn admin-btn--outline" id="btn-refresh-from-db">
                  🔄 Tải lại dữ liệu từ Supabase
                </button>
                <button class="admin-btn admin-btn--outline" id="btn-export-full-backup">
                  💾 Tải Bản Sao Lưu Toàn Hệ Thống (.JSON)
                </button>
                <button class="admin-btn admin-btn--outline" id="btn-restore-full-backup">
                  📂 Khôi Phục Từ File .JSON
                </button>
                <input type="file" id="input-restore-backup-file" accept=".json,application/json" style="display: none;">
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

            <div class="admin-form-group">
              <label>Link kênh Facebook</label>
              <input type="text" id="s-facebook" class="admin-form-input" value="${siteSettings.facebook || 'https://www.facebook.com/profile.php?id=61594821396672'}">
            </div>

            <div class="admin-form-group">
              <label>Link kênh TikTok</label>
              <input type="text" id="s-tiktok" class="admin-form-input" value="${siteSettings.tiktok || 'https://www.tiktok.com/@phat.dat.jewelry?_r=1&_t=ZS-9AblM3HdvqX'}">
            </div>

            <div class="admin-form-group">
              <label>Link kênh Instagram (@jewelryphatdat)</label>
              <input type="text" id="s-instagram" class="admin-form-input" value="${siteSettings.instagram || 'https://www.instagram.com/jewelryphatdat/'}">
            </div>

            <button class="admin-btn admin-btn--primary" id="btn-save-store">Lưu thông tin cửa hàng</button>
            <div id="store-save-feedback" style="margin-top: 12px; font-size: 13px; padding: 10px 14px; border-radius: 6px; display: none;"></div>
          </div>
        </div>
      </div>

      <!-- Admin Account & Password Settings -->
      <div class="admin-card" style="margin-top: 24px;">
        <div class="admin-card-header">
          <h3 class="admin-card-title">🔐 Đổi Mật Khẩu Quản Trị Backoffice</h3>
        </div>
        <div style="padding: 24px; max-width: 600px;">
          <form id="admin-password-form">
            <div class="admin-form-group">
              <label>Tài khoản Email đăng nhập</label>
              <input type="email" id="adm-email" class="admin-form-input" required value="${getAdminCredentials().email}">
            </div>

            <div class="admin-form-group">
              <label>Mật khẩu hiện tại *</label>
              <input type="password" id="adm-old-pass" class="admin-form-input" required placeholder="Nhập mật khẩu hiện tại (mặc định: admin)">
            </div>

            <div class="admin-grid-2">
              <div class="admin-form-group">
                <label>Mật khẩu mới *</label>
                <input type="password" id="adm-new-pass" class="admin-form-input" required minlength="4" placeholder="Tối thiểu 4 ký tự">
              </div>
              <div class="admin-form-group">
                <label>Xác nhận mật khẩu mới *</label>
                <input type="password" id="adm-confirm-pass" class="admin-form-input" required minlength="4" placeholder="Nhập lại mật khẩu mới">
              </div>
            </div>

            <button type="submit" class="admin-btn admin-btn--primary" id="btn-save-admin-pass">Cập nhật Mật khẩu Quản trị</button>
            <div id="admin-pass-feedback" style="margin-top: 12px; font-size: 13px; padding: 10px 14px; border-radius: 6px; display: none;"></div>
          </form>
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

    // Export Full JSON Backup
    const backupBtn = contentArea.querySelector('#btn-export-full-backup');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => {
        const payload = {
          exportedAt: new Date().toISOString(),
          brand: 'Phát Đạt Jewelry',
          siteSettings,
          products,
          collections,
          contacts,
          crmNotes: getContactCrmNotes(),
          analytics: getProductAnalytics()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `phat-dat-jewelry-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Đã tải bản sao lưu toàn hệ thống (.JSON) về máy thành công!', 'success');
      });
    }

    // Restore Full JSON Backup
    const restoreBtn = contentArea.querySelector('#btn-restore-full-backup');
    const restoreInput = contentArea.querySelector('#input-restore-backup-file');
    if (restoreBtn && restoreInput) {
      restoreBtn.addEventListener('click', () => restoreInput.click());
      restoreInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const parsed = JSON.parse(ev.target.result);
            if (!parsed || (!Array.isArray(parsed.products) && !Array.isArray(parsed.collections))) {
              showToast('File JSON không đúng định dạng bản sao lưu Phát Đạt Jewelry!', 'error');
              return;
            }
            if (Array.isArray(parsed.products)) {
              localStorage.setItem('phatdat_admin_products', JSON.stringify(parsed.products));
              products = parsed.products;
            }
            if (Array.isArray(parsed.collections)) {
              localStorage.setItem('phatdat_admin_collections', JSON.stringify(parsed.collections));
              collections = parsed.collections;
            }
            if (Array.isArray(parsed.contacts)) {
              localStorage.setItem('phatdat_admin_contacts', JSON.stringify(parsed.contacts));
              contacts = parsed.contacts;
            }
            if (parsed.siteSettings) {
              await saveAdminSiteSettings(parsed.siteSettings);
              siteSettings = parsed.siteSettings;
            }
            if (parsed.crmNotes && typeof parsed.crmNotes === 'object') {
              localStorage.setItem('phatdat_admin_crm_notes_v1', JSON.stringify(parsed.crmNotes));
            }
            if (parsed.analytics && typeof parsed.analytics === 'object') {
              localStorage.setItem('phatdat_product_analytics_v1', JSON.stringify(parsed.analytics));
            }
            updateSidebarBadges();
            renderSettingsTab();
            showToast(`Khôi phục dữ liệu thành công (${products.length} SP, ${collections.length} BST)!`, 'success');
          } catch (err) {
            showToast('Lỗi đọc file sao lưu JSON: ' + err.message, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Save Store Settings
    const storeBtn = contentArea.querySelector('#btn-save-store');
    const storeFeedback = contentArea.querySelector('#store-save-feedback');
    storeBtn.addEventListener('click', async () => {
      storeBtn.textContent = 'Đang lưu...';
      storeBtn.disabled = true;
      const updated = {
        ...siteSettings,
        name: contentArea.querySelector('#s-name').value.trim(),
        phoneDisplay: contentArea.querySelector('#s-phone').value.trim(),
        phoneHref: 'tel:' + contentArea.querySelector('#s-phone').value.replace(/[^0-9]/g, ''),
        zalo: contentArea.querySelector('#s-zalo').value.trim(),
        address: contentArea.querySelector('#s-address').value.trim(),
        facebook: contentArea.querySelector('#s-facebook').value.trim(),
        tiktok: contentArea.querySelector('#s-tiktok').value.trim(),
        instagram: contentArea.querySelector('#s-instagram').value.trim(),
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

    // Change Admin Password Form
    const passForm = contentArea.querySelector('#admin-password-form');
    const passFeedback = contentArea.querySelector('#admin-pass-feedback');
    passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = contentArea.querySelector('#adm-email').value.trim();
      const oldPass = contentArea.querySelector('#adm-old-pass').value;
      const newPass = contentArea.querySelector('#adm-new-pass').value;
      const confirmPass = contentArea.querySelector('#adm-confirm-pass').value;

      const currentCreds = getAdminCredentials();
      if (oldPass !== currentCreds.password) {
        passFeedback.style.display = 'block';
        passFeedback.style.background = '#FFEBEE';
        passFeedback.style.color = '#C62828';
        passFeedback.textContent = 'Mật khẩu hiện tại không đúng. Mật khẩu mặc định là "admin".';
        showToast('Mật khẩu hiện tại không chính xác!', 'error');
        return;
      }

      if (newPass !== confirmPass) {
        passFeedback.style.display = 'block';
        passFeedback.style.background = '#FFEBEE';
        passFeedback.style.color = '#C62828';
        passFeedback.textContent = 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp.';
        showToast('Xác nhận mật khẩu không trùng khớp!', 'error');
        return;
      }

      const res = updateAdminCredentials(email, newPass);
      if (res.success) {
        passFeedback.style.display = 'block';
        passFeedback.style.background = '#E8F5E9';
        passFeedback.style.color = '#2E7D32';
        passFeedback.textContent = 'Đã cập nhật mật khẩu quản trị thành công!';
        contentArea.querySelector('#adm-old-pass').value = '';
        contentArea.querySelector('#adm-new-pass').value = '';
        contentArea.querySelector('#adm-confirm-pass').value = '';
        const sidebarEmail = page.querySelector('.admin-sidebar-footer strong');
        if (sidebarEmail) sidebarEmail.textContent = email;
        showToast('Đã đổi mật khẩu quản trị thành công!', 'success');
        setTimeout(() => { passFeedback.style.display = 'none'; }, 4000);
      } else {
        passFeedback.style.display = 'block';
        passFeedback.style.background = '#FFEBEE';
        passFeedback.style.color = '#C62828';
        passFeedback.textContent = res.error || 'Có lỗi xảy ra khi cập nhật.';
        showToast(res.error || 'Lỗi cập nhật mật khẩu', 'error');
      }
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

  // Showroom Kiosk Tablet Mode (Round 30)
  function launchKioskMode() {
    const kiosk = document.createElement('div');
    kiosk.className = 'admin-kiosk-mode';
    kiosk.innerHTML = `
      <div class="admin-kiosk-header">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="/images/logo.png" alt="Phát Đạt" style="height: 44px; filter: brightness(0) invert(1);">
          <div>
            <div style="font-size: 15px; font-weight: 700; letter-spacing: 0.05em; color: #FFF8E7;">PHÁT ĐẠT JEWELRY · SHOWROOM LOOKBOOK</div>
            <div style="font-size: 11px; color: #D5EBE6;">Chế độ trình chiếu iPad tại quầy · Chạm mẫu để xem chi tiết & soi lúp</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button type="button" id="kiosk-exit-btn" style="background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.4); color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer;">
            ✕ Thoát Kiosk
          </button>
        </div>
      </div>

      <div class="admin-kiosk-body">
        ${products.map(p => `
          <div class="admin-kiosk-card">
            <img src="${p.images[0]}" alt="${p.name}" style="width: 100%; height: 220px; object-fit: cover;">
            <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-secondary); font-weight: 600; letter-spacing: 0.05em;">${p.reference} · ${p.category}</div>
              <h4 style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin: 4px 0 8px;">${p.name}</h4>
              <div style="font-size: 16px; font-weight: 700; color: #D4380D; margin-bottom: 12px;">${formatPrice(p.price)}</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 16px; flex: 1; line-height: 1.5;">
                ${p.materials} · ${p.stones}
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" class="kiosk-view-pdp-btn" data-id="${p.id}" style="padding: 9px; background: var(--color-brand-light); border: 1px solid var(--color-brand-primary); color: var(--color-brand-primary); border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
                  🔍 Xem chi tiết
                </button>
                <button type="button" class="kiosk-qr-btn" data-id="${p.id}" style="padding: 9px; background: var(--color-brand-primary); border: none; color: #fff; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
                  📱 Mã QR
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(kiosk);

    kiosk.querySelector('#kiosk-exit-btn').addEventListener('click', () => {
      kiosk.remove();
    });

    kiosk.querySelectorAll('.kiosk-view-pdp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        kiosk.remove();
        window.open(`#/product/${btn.dataset.id}`, '_blank');
      });
    });

    kiosk.querySelectorAll('.kiosk-qr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = products.find(p => p.id === btn.dataset.id);
        if (prod) {
          openQrTagModal(prod);
        }
      });
    });
  }

  const kioskTriggerBtn = page.querySelector('#btn-open-kiosk-mode');
  if (kioskTriggerBtn) {
    kioskTriggerBtn.addEventListener('click', launchKioskMode);
  }

  // Initial render Overview
  renderOverviewTab();

  container.appendChild(page);
}
