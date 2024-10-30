const CACHE_NAME = 'image-cache';

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/Images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // 캐시에 있으면 반환
          }
          return fetch(event.request).then((response) => {
            cache.put(event.request, response.clone()); // 캐시에 저장
            return response;
          });
        });
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
