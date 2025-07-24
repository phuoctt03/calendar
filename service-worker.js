const CACHE_NAME = 'calendar-cache-v2'; // đổi tên để force update
const urlsToCache = [
  '/calendar/',
  '/calendar/index.html',
  '/calendar/manifest.json',
  '/calendar/icons/icon-512.png',
  '/calendar/icons/icon-192.png'
];

// Caching các file cần thiết khi cài đặt
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // kích hoạt ngay sau khi cài xong
});

// Xóa các cache cũ không còn dùng nữa
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // kiểm soát tất cả tab ngay
});

// Fetch: lấy từ cache trước, nếu không có thì fetch và update cache
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      const fetchPromise = fetch(event.request).then(function (networkResponse) {
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => cachedResponse); // fallback khi mất mạng

      return cachedResponse || fetchPromise;
    })
  );
});
