'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import notificationService from '../lib/notificationService';
import { NOTIFICATION_TYPES, NotificationType } from '../lib/pusherConfig';

interface NotificationContextType {
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  isSubscribed: boolean;
  requestPermission: () => Promise<boolean>;
  subscribe: (userId: string) => Promise<boolean>;
  unsubscribe: (userId: string) => Promise<boolean>;
  sendNotification: (title: string, body: string, type?: NotificationType, data?: any) => Promise<void>;
  testNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if notifications are supported (only on client side)
    if (typeof window !== 'undefined') {
      setIsSupported(notificationService.isSupported());
      setPermissionStatus(notificationService.getPermissionStatus());
      setIsSubscribed(notificationService.isUserSubscribed());
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    setPermissionStatus(notificationService.getPermissionStatus());
    return granted;
  };

  const subscribe = async (userId: string): Promise<boolean> => {
    const subscribed = await notificationService.subscribe(userId);
    setIsSubscribed(subscribed);
    return subscribed;
  };

  const unsubscribe = async (userId: string): Promise<boolean> => {
    const unsubscribed = await notificationService.unsubscribe(userId);
    setIsSubscribed(!unsubscribed);
    return unsubscribed;
  };

  const sendNotification = async (
    title: string,
    body: string,
    type: NotificationType = NOTIFICATION_TYPES.GENERAL,
    data?: any
  ): Promise<void> => {
    await notificationService.sendLocalNotification(title, body, type, data);
  };

  const testNotification = async (): Promise<void> => {
    await notificationService.sendLocalNotification(
      'Test Notification',
      'This is a test notification from SocialCommerce!',
      NOTIFICATION_TYPES.GENERAL
    );
  };

  const value: NotificationContextType = {
    isSupported,
    permissionStatus,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification,
    testNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
