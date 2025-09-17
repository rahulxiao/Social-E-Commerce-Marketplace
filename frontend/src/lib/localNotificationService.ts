import { NOTIFICATION_TYPES, NotificationType } from './pusherConfig';

class LocalNotificationService {
  private isInitialized = false;
  private isSubscribed = false;

  // Initialize local notification service
  async initialize(): Promise<boolean> {
    try {
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize local notification service:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Use browser's native notification API
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission === 'denied') {
        console.warn('Notification permission denied');
        return false;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  // Subscribe to notifications for a user
  async subscribe(userId: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      this.isSubscribed = true;
      return true;
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      return false;
    }
  }

  // Unsubscribe from notifications
  async unsubscribe(userId: string): Promise<boolean> {
    try {
      if (!this.isInitialized) return true;

      this.isSubscribed = false;
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from notifications:', error);
      return false;
    }
  }

  // Send a local notification
  async sendLocalNotification(
    title: string,
    body: string,
    type: NotificationType = NOTIFICATION_TYPES.GENERAL,
    data?: any
  ): Promise<void> {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return;
      }

      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: {
          type,
          timestamp: Date.now(),
          ...data
        },
        requireInteraction: false,
        silent: false,
      });

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Handle different notification types
        this.handleNotificationClick(type, data);
      };

    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  // Handle notification click events
  private handleNotificationClick(type: NotificationType, data?: any): void {
    switch (type) {
      case NOTIFICATION_TYPES.ORDER_UPDATE:
        if (data?.orderId) {
          window.location.href = `/buyers/orders/${data.orderId}`;
        }
        break;
      case NOTIFICATION_TYPES.CART_REMINDER:
        window.location.href = '/buyers/cart';
        break;
      case NOTIFICATION_TYPES.WISHLIST_ITEM:
        window.location.href = '/buyers/wishlist';
        break;
      case NOTIFICATION_TYPES.REVIEW_RESPONSE:
        if (data?.reviewId) {
          window.location.href = `/buyers/reviews/${data.reviewId}`;
        }
        break;
      case NOTIFICATION_TYPES.SOCIAL_ACTIVITY:
        window.location.href = '/buyers/social/feed';
        break;
      case NOTIFICATION_TYPES.PRODUCT_ALERT:
        if (data?.productId) {
          window.location.href = `/buyers/products/${data.productId}/reviews`;
        }
        break;
      default:
        window.location.href = '/';
    }
  }

  // Check if notifications are supported and enabled
  isSupported(): boolean {
    return 'Notification' in window;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  // Check if user is subscribed
  isUserSubscribed(): boolean {
    return this.isSubscribed;
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    try {
      this.isInitialized = false;
      this.isSubscribed = false;
    } catch (error) {
      console.error('Failed to cleanup notification service:', error);
    }
  }
}

// Export singleton instance
export const localNotificationService = new LocalNotificationService();
export default localNotificationService;
