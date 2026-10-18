// ============================================================
// SERVICE WORKER (PWA & OFFLINE CACHE) — Phát Đạt Jewelry
// ============================================================

const CACHE_NAME = 'phatdat-jewelry-pwa-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Network-first with Cache fallback for seamless offline browsing
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);

  // Only handle same-origin requests and skip Vite dev server internals
  if (reqUrl.origin !== self.location.origin) return;
  if (reqUrl.pathname.startsWith('/@') || reqUrl.pathname.startsWith('/node_modules/')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return networkRes;
      })
      .catch(() =>
        caches.match(event.request).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('', { status: 408, statusText: 'Offline' });
        })
      )
  );
});

