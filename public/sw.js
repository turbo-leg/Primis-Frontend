/**
 * Service Worker for handling push notifications
 */

// Handle push messages from backend
self.addEventListener('push', function(event) {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  // Parse push event data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
        // Ensure title and body are always strings
        title: data.title || notificationData.title,
        body: data.body || notificationData.body
      };
    } catch (e) {
      // If data is not JSON, use it as the body
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || '/logo.png',
      badge: notificationData.badge || '/badge.png',
      tag: notificationData.tag || 'notification',
      requireInteraction: notificationData.requireInteraction || false,
      actions: notificationData.actions,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: notificationData.id || 1,
        url: notificationData.url
      }
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Check if there's already a window open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
});

// Handle messages from the main thread
self.addEventListener('message', function(event) {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Handle service worker installation
self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
  self.skipWaiting();
});
