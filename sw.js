self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/calendar')
  );
});

self.addEventListener('push', function(event) {
  const data = event.data?.json() || {};

  const title = data.title || "🌙 Lịch Âm Dương";
  const options = {
    body: data.body || "Đây là thông báo test từ Service Worker.",
    icon: '/calendar/icons/icon-512.png',
    badge: '/calendar/icons/icon-512.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
