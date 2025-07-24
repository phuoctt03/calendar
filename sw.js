// Khi người dùng bấm vào thông báo
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes('/calendar') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/calendar');
      }
    })
  );
});

// Khi nhận push (nếu bạn dùng push từ server hoặc devtools)
self.addEventListener('push', function(event) {
  const data = event.data?.json() || {};

  const title = data.title || "🌙 Lịch Âm Dương";
  const options = {
    body: data.body || "Đây là thông báo test từ Service Worker.",
    icon: '/calendar/icons/icon-512.png',
    badge: '/calendar/icons/icon-512.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: 'test-notification',
    actions: [
      { action: 'open', title: 'Mở ứng dụng' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
