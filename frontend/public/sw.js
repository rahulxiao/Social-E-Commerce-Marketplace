// Service Worker for Pusher Beams
// This service worker handles push notifications

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  
  // Get notification data
  const notification = event.notification;
  const data = notification.data || {};
  
  // Close the notification
  notification.close();
  
  // Handle different notification types
  let url = '/';
  
  switch (data.type) {
    case 'order_update':
      if (data.orderId) {
        url = `/buyers/orders/${data.orderId}`;
      }
      break;
    case 'cart_reminder':
      url = '/buyers/cart';
      break;
    case 'wishlist_item':
      url = '/buyers/wishlist';
      break;
    case 'review_response':
      if (data.reviewId) {
        url = `/buyers/reviews/${data.reviewId}`;
      }
      break;
    case 'social_activity':
      url = '/buyers/social/feed';
      break;
    case 'product_alert':
      if (data.productId) {
        url = `/buyers/products/${data.productId}/reviews`;
      }
      break;
    default:
      url = '/';
  }
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  // Notification closed
});

// Handle push events
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    // Show notification
    const options = {
      title: data.title || 'SocialCommerce',
      body: data.body || 'You have a new notification',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: data.data || {},
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
    };
    
    event.waitUntil(
      self.registration.showNotification(options.title, options)
    );
  }
});
