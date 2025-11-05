/**
 * Notification Permissions Utility
 * Handles requesting and managing notification permissions across browsers
 * Supports Desktop and Mobile platforms
 */

export type NotificationPermission = 'granted' | 'denied' | 'default'

export interface NotificationPermissionState {
  permission: NotificationPermission
  supported: boolean
  serviceWorkerReady: boolean
  requestAllowed: boolean
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

/**
 * Check if browser supports service workers
 */
export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator
}

/**
 * Check if browser supports the Badge API (for notification count badge)
 */
export function isBadgeAPISupported(): boolean {
  return typeof window !== 'undefined' && 'setAppBadge' in navigator
}

/**
 * Check if browser supports the Vibration API (for mobile)
 */
export function isVibrationSupported(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator
}

/**
 * Get current notification permission state
 */
export function getNotificationPermissionState(): NotificationPermissionState {
  return {
    permission: (Notification?.permission as NotificationPermission) || 'default',
    supported: isNotificationSupported(),
    serviceWorkerReady: typeof window !== 'undefined' && !!navigator.serviceWorker?.controller,
    requestAllowed: true, // Can be set to false if user dismisses multiple times
  }
}

/**
 * Request notification permission
 * Returns the permission state or null if not supported
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!isNotificationSupported()) {
    console.warn('[Notifications] Notifications not supported in this browser')
    return null
  }

  // If already granted, return immediately
  if (Notification.permission === 'granted') {
    console.log('[Notifications] Permission already granted')
    return 'granted'
  }

  // If already denied, don't ask again
  if (Notification.permission === 'denied') {
    console.warn('[Notifications] Permission denied by user')
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    console.log('[Notifications] Permission request result:', permission)
    return permission as NotificationPermission
  } catch (error) {
    console.error('[Notifications] Error requesting permission:', error)
    return null
  }
}

/**
 * Register service worker if not already registered
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    console.warn('[ServiceWorker] Service workers not supported')
    return null
  }

  try {
    // Check if already registered
    const registrations = await navigator.serviceWorker.getRegistrations()
    if (registrations.length > 0) {
      console.log('[ServiceWorker] Already registered:', registrations[0])
      return registrations[0]
    }

    // Register new service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none', // Always check for updates
    })

    console.log('[ServiceWorker] Registered successfully:', registration)

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      console.log('[ServiceWorker] Update found, reloading...')
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is ready
            console.log('[ServiceWorker] New version available')
            // Could show "Update available" message to user
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error('[ServiceWorker] Registration failed:', error)
    return null
  }
}

/**
 * Send message to service worker
 */
export async function sendMessageToServiceWorker(message: any): Promise<void> {
  if (!navigator.serviceWorker?.controller) {
    console.warn('[ServiceWorker] No active service worker')
    return
  }

  try {
    navigator.serviceWorker.controller.postMessage(message)
    console.log('[ServiceWorker] Message sent:', message.type)
  } catch (error) {
    console.error('[ServiceWorker] Failed to send message:', error)
  }
}

/**
 * Update app badge (notification count)
 * Only works if Badge API is supported
 */
export async function updateAppBadge(count: number): Promise<boolean> {
  if (!isBadgeAPISupported()) {
    return false
  }

  try {
    if (count > 0) {
      await navigator.setAppBadge(count)
    } else {
      await navigator.clearAppBadge()
    }
    return true
  } catch (error) {
    console.error('[Badge] Failed to update badge:', error)
    return false
  }
}

/**
 * Detect if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || navigator.vendor || ''
  
  // Mobile user agents patterns
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
  ]

  return mobilePatterns.some(pattern => pattern.test(userAgent))
}

/**
 * Get device type: 'mobile' | 'tablet' | 'desktop'
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/ipad|android(?!.*mobile)|kindle/.test(userAgent)) {
    return 'tablet'
  }
  
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(userAgent)) {
    return 'mobile'
  }

  return 'desktop'
}

/**
 * Get network connection type and effective type
 * Useful for adapting notification frequency
 */
export function getNetworkInfo(): {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | null
  downlink: number | null
  rtt: number | null
  saveData: boolean
} {
  if (typeof window === 'undefined') {
    return { effectiveType: null, downlink: null, rtt: null, saveData: false }
  }

  const connection = (navigator as any).connection
  
  return {
    effectiveType: connection?.effectiveType || null,
    downlink: connection?.downlink || null,
    rtt: connection?.rtt || null,
    saveData: connection?.saveData || false,
  }
}

/**
 * Request vibration feedback (mobile)
 */
export function vibrate(pattern: number | number[]): boolean {
  if (!isVibrationSupported()) {
    return false
  }

  try {
    navigator.vibrate(pattern)
    return true
  } catch (error) {
    console.error('[Vibration] Failed to vibrate:', error)
    return false
  }
}

/**
 * Get browser information for debugging
 */
export function getBrowserInfo(): {
  userAgent: string
  deviceType: string
  isMobile: boolean
  platform: string
  language: string
} {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      deviceType: 'unknown',
      isMobile: false,
      platform: '',
      language: '',
    }
  }

  return {
    userAgent: navigator.userAgent,
    deviceType: getDeviceType(),
    isMobile: isMobileDevice(),
    platform: navigator.platform,
    language: navigator.language,
  }
}

/**
 * Log notification capabilities for debugging
 */
export function logNotificationCapabilities(): void {
  console.group('[Notifications] Capabilities')
  console.log('Notifications supported:', isNotificationSupported())
  console.log('Service Workers supported:', isServiceWorkerSupported())
  console.log('Badge API supported:', isBadgeAPISupported())
  console.log('Vibration API supported:', isVibrationSupported())
  console.log('Device type:', getDeviceType())
  console.log('Permission state:', getNotificationPermissionState())
  console.log('Network:', getNetworkInfo())
  console.log('Browser:', getBrowserInfo())
  console.groupEnd()
}
