import { PUSHER_CONFIG, NOTIFICATION_TYPES, NotificationType } from './pusherConfig';
import localNotificationService from './localNotificationService';

class NotificationService {
  private client: any = null;
  private isInitialized = false;
  private isSubscribed = false;
  private useLocalOnly = false;

  // Initialize notification service (Pusher Beams with local fallback)
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Try to initialize local service first
      await localNotificationService.initialize();

      // Try to import Pusher dynamically to avoid SSR issues
      try {
        const PusherPushNotifications = await import('@pusher/push-notifications-web');
        
        this.client = new PusherPushNotifications.default.Client({
          instanceId: PUSHER_CONFIG.instanceId,
        });

        await this.client.start();
      } catch (pusherError) {
        console.warn('Pusher Beams not available, using local notifications only:', pusherError);
        this.useLocalOnly = true;
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      this.useLocalOnly = true;
      this.isInitialized = true;
      return true;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await localNotificationService.requestPermission();
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

      const localSubscribed = await localNotificationService.subscribe(userId);
      
      if (!this.useLocalOnly && this.client) {
        try {
          // Subscribe to Pusher channels
          await this.client.addDeviceInterest(`user-${userId}`);
          await this.client.addDeviceInterest('general');
        } catch (pusherError) {
          console.warn('Failed to subscribe to Pusher channels:', pusherError);
        }
      }

      this.isSubscribed = localSubscribed;
      return localSubscribed;
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      return false;
    }
  }

  // Unsubscribe from notifications
  async unsubscribe(userId: string): Promise<boolean> {
    try {
      if (!this.isInitialized) return true;

      const localUnsubscribed = await localNotificationService.unsubscribe(userId);
      
      if (!this.useLocalOnly && this.client) {
        try {
          // Unsubscribe from Pusher channels
          await this.client.removeDeviceInterest(`user-${userId}`);
          await this.client.removeDeviceInterest('general');
        } catch (pusherError) {
          console.warn('Failed to unsubscribe from Pusher channels:', pusherError);
        }
      }

      this.isSubscribed = !localUnsubscribed;
      return localUnsubscribed;
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
      return await localNotificationService.sendLocalNotification(title, body, type, data);
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  // Check if notifications are supported and enabled
  isSupported(): boolean {
    return localNotificationService.isSupported();
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return localNotificationService.getPermissionStatus();
  }

  // Check if user is subscribed
  isUserSubscribed(): boolean {
    return this.isSubscribed;
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    try {
      if (this.client && typeof this.client.stop === 'function') {
        await this.client.stop();
      }
      this.client = null;
      this.isInitialized = false;
      this.isSubscribed = false;
      await localNotificationService.cleanup();
    } catch (error) {
      console.error('Failed to cleanup notification service:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
