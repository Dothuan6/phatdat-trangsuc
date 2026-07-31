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
