'use client';

import { useEffect, useState } from 'react';
import notificationService from '../lib/notificationService';

interface NotificationBellProps {
  userId?: string;
  className?: string;
}

export default function NotificationBell({ userId, className = '' }: NotificationBellProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported(notificationService.isSupported());
    setPermissionStatus(notificationService.getPermissionStatus());
    setIsSubscribed(notificationService.isUserSubscribed());
  }, []);

  const handleEnableNotifications = async () => {
    try {
      const granted = await notificationService.requestPermission();
      setPermissionStatus(notificationService.getPermissionStatus());
      
      if (granted && userId) {
        const subscribed = await notificationService.subscribe(userId);
        setIsSubscribed(subscribed);
        
        if (subscribed) {
          // Send a test notification
          await notificationService.sendLocalNotification(
            'Notifications Enabled!',
            'You will now receive updates about your orders, cart, and more.',
            'general'
          );
        }
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    }
  };

  const handleDisableNotifications = async () => {
    try {
      if (userId) {
        await notificationService.unsubscribe(userId);
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    }
  };


  if (!isSupported) {
    return (
      <div className={`relative ${className}`}>
        <button
          disabled
          className="p-2 text-gray-400 cursor-not-allowed"
          title="Notifications not supported in this browser"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L19.5 4.5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          isSubscribed 
            ? 'text-blue-600 hover:bg-blue-50' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
        title={isSubscribed ? 'Notifications enabled' : 'Enable notifications'}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L19.5 4.5" />
        </svg>
        
        {/* Notification indicator */}
        {isSubscribed && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </button>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Notification Settings</h3>
            
            <div className="space-y-3">
              {/* Permission status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Permission:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  permissionStatus === 'granted' ? 'bg-green-100 text-green-800' :
                  permissionStatus === 'denied' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {permissionStatus}
                </span>
              </div>

              {/* Subscription status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subscribed:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isSubscribed ? 'Yes' : 'No'}
                </span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 space-y-2">
                {!isSubscribed ? (
                  <button
                    onClick={handleEnableNotifications}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Enable Notifications
                  </button>
                ) : (
                  <button
                    onClick={handleDisableNotifications}
                    className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Disable Notifications
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
