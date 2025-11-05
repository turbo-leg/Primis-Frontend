'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface PushSubscriptionRequest {
  endpoint: string;
  auth_key: string;
  p256dh_key: string;
  device_type?: string;
  browser?: string;
  user_agent?: string;
}

interface NotificationPreferences {
  browser_notifications_enabled: boolean;
  push_notifications_enabled: boolean;
  assignment_notifications: boolean;
  grade_notifications: boolean;
  attendance_notifications: boolean;
  announcement_notifications: boolean;
  general_notifications: boolean;
  notification_sound_enabled: boolean;
  notification_badge_enabled: boolean;
  notification_vibration_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

interface PushSubscription {
  subscription_id: number;
  device_type?: string;
  browser?: string;
  created_at: string;
  last_used: string;
}

/**
 * Hook for managing browser push notifications
 * Handles subscription, preferences, and notification delivery
 */
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if browser supports push notifications
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      checkSubscriptionStatus();
      fetchPreferences();
    }
  }, []);

  /**
   * Register a push notification subscription with the backend
   */
  const subscribeToPushNotifications = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notification permission denied');
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Extract the subscription details
      const subscriptionJSON = pushSubscription.toJSON();
      const endpoint = pushSubscription.endpoint;
      const auth = subscriptionJSON.keys?.auth;
      const p256dh = subscriptionJSON.keys?.p256dh;

      if (!auth || !p256dh) {
        setError('Failed to get subscription keys');
        return;
      }

      // Send subscription to backend
      const response = await fetch('/api/v1/notifications/push-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          endpoint,
          auth_key: auth,
          p256dh_key: p256dh,
          device_type: 'web',
          browser: getBrowserName(),
          user_agent: navigator.userAgent,
        } as PushSubscriptionRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to register subscription with backend');
      }

      setIsSubscribed(true);
      await checkSubscriptionStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Push subscription error:', err);
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribeFromPushNotifications = useCallback(async (subscriptionId?: number) => {
    try {
      setLoading(true);
      setError(null);

      const id = subscriptionId || subscription?.subscription_id;
      if (!id) {
        setError('No subscription to remove');
        return;
      }

      // Notify backend
      const response = await fetch(`/api/v1/notifications/push-unsubscribe/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe from backend');
      }

      // Unsubscribe from service worker
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
      }

      setIsSubscribed(false);
      setSubscription(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Unsubscribe error:', err);
    } finally {
      setLoading(false);
    }
  }, [subscription?.subscription_id]);

  /**
   * Check if user is currently subscribed
   */
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/notifications/subscriptions', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      const subs = data.subscriptions || [];
      
      setIsSubscribed(subs.length > 0);
      if (subs.length > 0) {
        setSubscription(subs[0]);
      }
    } catch (err) {
      console.error('Failed to check subscription status:', err);
    }
  }, []);

  /**
   * Fetch user notification preferences
   */
  const fetchPreferences = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/notifications/preferences', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  }, []);

  /**
   * Update notification preferences
   */
  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/notifications/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error('Failed to update preferences');
        }

        setPreferences((prev) => (prev ? { ...prev, ...updates } : null));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
        console.error('Update preferences error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Set channel preferences for a notification type
   */
  const setChannelPreferences = useCallback(
    async (
      notificationType: string,
      channels: {
        send_in_app?: boolean;
        send_email?: boolean;
        send_browser?: boolean;
        send_sms?: boolean;
      }
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/notifications/channel-preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            notification_type: notificationType,
            ...channels,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to set channel preferences');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
        console.error('Set channel preferences error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get channel preferences for a notification type
   */
  const getChannelPreferences = useCallback(
    async (notificationType: string) => {
      try {
        const response = await fetch(
          `/api/v1/notifications/channel-preferences/${notificationType}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch channel preferences');
        }

        return await response.json();
      } catch (err) {
        console.error('Get channel preferences error:', err);
        return null;
      }
    },
    []
  );

  return {
    // State
    isSupported,
    isSubscribed,
    subscription,
    preferences,
    loading,
    error,

    // Methods
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    checkSubscriptionStatus,
    fetchPreferences,
    updatePreferences,
    setChannelPreferences,
    getChannelPreferences,
  };
};

/**
 * Helper function to detect browser name
 */
function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  
  return 'unknown';
}
