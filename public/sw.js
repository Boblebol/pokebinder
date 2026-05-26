const CACHE_NAME = 'pokeclasseur-cache-v1.1.7';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/fonts/dm-sans-latin.woff2',
  '/fonts/dm-sans-latin-ext.woff2',
  '/fonts/press-start-2p-latin.woff2',
  '/fonts/press-start-2p-latin-ext.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Cache ONLY GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Cache assets from our origin or pokemon official assets CDN
  const isSelfOrigin = url.origin === self.location.origin;
  const isPokemonAssets = url.origin === 'https://assets.pokemon.com';

  if (isSelfOrigin || isPokemonAssets) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-While-Revalidate: serve cached version, update cache in background
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {/* Ignore network errors on background refresh */});

          return cachedResponse;
        }

        // Cache miss: fetch from network and store in cache
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        }).catch((err) => {
          // If offline and request is page navigation, return cached index
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          throw err;
        });
      })
    );
  }
});

// Skip waiting dynamically when instructed by the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
