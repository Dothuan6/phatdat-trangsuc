// ============================================================
// ROUTER — Simple hash-based SPA router
// ============================================================

const routes = {};
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentPath() {
  return window.location.hash.slice(1) || '/';
}

let isRouterInitialized = false;
let currentHandleRoute = null;

export function initRouter(contentEl) {
  currentHandleRoute = function handleRoute() {
    const path = getCurrentPath();

    // Clean up previous page
    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup();
    }
    currentCleanup = null;

    // Clear content
    contentEl.innerHTML = '';

    // Find matching route
    let matched = false;

    // Try exact match first
    if (routes[path]) {
      currentCleanup = routes[path](contentEl, {});
      matched = true;
    } else {
      // Try parameterized routes
      for (const [pattern, handler] of Object.entries(routes)) {
        const params = matchRoute(pattern, path);
        if (params !== null) {
          currentCleanup = handler(contentEl, params);
          matched = true;
          break;
        }
      }
    }

    // Default redirect
    if (!matched) {
      navigate('/404');
      return;
    }

    // Update document title
    updatePageTitle(path);

    // Toggle admin view class on body
    if (path.startsWith('/admin')) {
      document.body.classList.add('is-admin-view');
    } else {
      document.body.classList.remove('is-admin-view');
    }

    // Scroll to top
    window.scrollTo(0, 0);
  };

  if (!isRouterInitialized) {
    window.addEventListener('hashchange', () => {
      if (currentHandleRoute) currentHandleRoute();
    });
    isRouterInitialized = true;
  }

  // Initial route
  if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
    navigate('/');
  } else {
    currentHandleRoute();
  }
}

function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
}

function updatePageTitle(path) {
  const brand = 'Phát Đạt Jewelry';
  if (path === '/' || path === '') {
    document.title = `${brand} – Trang Sức Bạc 925 Tinh Tế & Quý Phái`;
    return;
  }
  if (path.startsWith('/product/')) {
    const id = path.replace('/product/', '');
    // Try to get product from live cache if possible
    try {
      const local = localStorage.getItem('phatdat_admin_products');
      if (local) {
        const list = JSON.parse(local);
        const item = list.find(p => p.id === id);
        if (item) {
          document.title = `${item.name} – ${brand}`;
          return;
        }
      }
    } catch (e) {}
    document.title = `Chi Tiết Sản Phẩm – ${brand}`;
    return;
  }
  if (path.startsWith('/collections/')) {
    const slug = path.replace('/collections/', '');
    const formatted = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    document.title = `Bộ Sưu Tập ${formatted} – ${brand}`;
    return;
  }
  if (path === '/jewelry') {
    document.title = `Tất Cả Trang Sức Bạc 925 – ${brand}`;
    return;
  }
  if (path === '/jewelry/necklaces') {
    document.title = `Dây Chuyền & Mặt Dây Bạc 925 – ${brand}`;
    return;
  }
  if (path === '/jewelry/rings') {
    document.title = `Nhẫn Bạc 925 Thời Trang – ${brand}`;
    return;
  }
  if (path === '/jewelry/bracelets') {
    document.title = `Vòng Tay & Lắc Tay Bạc 925 – ${brand}`;
    return;
  }
  if (path === '/jewelry/earrings') {
    document.title = `Hoa Tai Bạc 925 – ${brand}`;
    return;
  }
  if (path === '/high-jewelry') {
    document.title = `Bộ Sưu Tập Cao Cấp – ${brand}`;
    return;
  }
  if (path === '/about') {
    document.title = `Câu Chuyện Thương Hiệu – ${brand}`;
    return;
  }
  if (path === '/contact') {
    document.title = `Liên Hệ & Tư Vấn Trang Sức – ${brand}`;
    return;
  }
  if (path === '/wishlist') {
    document.title = `Danh Sách Yêu Thích – ${brand}`;
    return;
  }
  if (path === '/stores') {
    document.title = `Hệ Thống Cửa Hàng – ${brand}`;
    return;
  }
  if (path.startsWith('/search')) {
    document.title = `Tìm Kiếm Trang Sức – ${brand}`;
    return;
  }
  if (path === '/admin') {
    document.title = `Hệ Thống Quản Trị Backoffice – ${brand}`;
    return;
  }
  if (path === '/admin/login') {
    document.title = `Đăng Nhập Quản Trị – ${brand} Backoffice`;
    return;
  }
  document.title = `${brand} – Trang Sức Bạc 925`;
}
