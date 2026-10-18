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

  // Skip third-party APIs like Supabase REST calls from SW caching
  if (reqUrl.hostname.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && reqUrl.origin === self.location.origin) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return networkRes;
      })
      .catch(() => caches.match(event.request).then((cachedRes) => cachedRes || caches.match('./index.html')))
  );
});
