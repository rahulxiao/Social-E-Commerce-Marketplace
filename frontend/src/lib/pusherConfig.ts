// Pusher Beams Configuration
export const PUSHER_CONFIG = {
  // Replace with your actual Pusher Beams instance ID
  instanceId: 'your-instance-id', // Get this from Pusher Dashboard
  
  // Service worker file path
  serviceWorkerPath: '/sw.js',
  
  // Default notification options
  defaultOptions: {
    title: 'SocialCommerce',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
  }
};

// Notification types for different events
export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: 'order_update',
  CART_REMINDER: 'cart_reminder',
  WISHLIST_ITEM: 'wishlist_item',
  REVIEW_RESPONSE: 'review_response',
  SOCIAL_ACTIVITY: 'social_activity',
  PRODUCT_ALERT: 'product_alert',
  GENERAL: 'general'
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
