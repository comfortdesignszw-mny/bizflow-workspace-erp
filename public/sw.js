// BizFlow ERP Service Worker - Offline-First Caching Engine
const CACHE_NAME = 'bizflow-erp-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/manifest.js',
  '/icon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline application shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Failed to cache some assets during install:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[Service Worker] Removing deprecated cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass API routes from cache unless offline
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        // Return offline JSON response when network fails
        return new Response(
          JSON.stringify({
            offline: true,
            message: 'Network offline. Using client-side local database as source of truth.'
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          }
        );
      })
    );
    return;
  }

  // Stale-while-revalidate for application assets and documents
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is for page navigation, fallback to root/index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
