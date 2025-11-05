/**
 * Enhanced Service Worker for Real-Time Notifications
 * Supports Desktop and Mobile notifications with priority levels
 * Version: 2.0 - Enhanced for Desktop & Mobile
 */

console.log('[SW] Service Worker initializing...')

// ==================== CONSTANTS ====================

const NOTIFICATION_DEFAULTS = {
  icon: '/logo.png',
  badge: '/badge.png',
  requireInteraction: false,
}

const PRIORITY_SETTINGS = {
  urgent: {
    tag: 'notification-urgent',
    requireInteraction: true,
    sound: true,
    vibrate: [200, 100, 200],
  },
  high: {
    tag: 'notification-high',
    requireInteraction: true,
    sound: true,
    vibrate: [100, 50, 100],
  },
  medium: {
    tag: 'notification-medium',
    requireInteraction: false,
    sound: false,
    vibrate: [50],
  },
  low: {
    tag: 'notification-low',
    requireInteraction: false,
    sound: false,
    vibrate: [],
  },
}

// ==================== PUSH EVENT HANDLER ====================

/**
 * Handle push messages from backend
 * Supports both push messages and real-time WebSocket notifications
 */
self.addEventListener('push', function(event) {
  console.log('[SW] Push notification received:', event)
  
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: NOTIFICATION_DEFAULTS.icon,
    badge: NOTIFICATION_DEFAULTS.badge,
    tag: 'notification',
    requireInteraction: NOTIFICATION_DEFAULTS.requireInteraction,
    priority: 'medium',
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  }

  // Parse push event data if available
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        ...notificationData,
        ...data,
        // Ensure title and body are always strings
        title: data.title || notificationData.title,
        body: data.body || notificationData.body
      }
    } catch (e) {
      // If data is not JSON, use it as the body
      notificationData.body = event.data.text()
    }
  }

  // Get priority-specific settings
  const prioritySettings = PRIORITY_SETTINGS[notificationData.priority] || PRIORITY_SETTINGS.medium

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || NOTIFICATION_DEFAULTS.icon,
      badge: notificationData.badge || NOTIFICATION_DEFAULTS.badge,
      tag: prioritySettings.tag || `notification-${Date.now()}`,
      requireInteraction: prioritySettings.requireInteraction,
      actions: notificationData.actions,
      vibrate: prioritySettings.vibrate,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: notificationData.id || Date.now(),
        url: notificationData.url,
        priority: notificationData.priority,
        type: notificationData.type
      }
    })
  )
})

// ==================== NOTIFICATION CLICK HANDLER ====================

/**
 * Handle notification clicks and actions
 */
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event.notification.tag, 'Action:', event.action)
  
  event.notification.close()

  // Handle action button clicks
  if (event.action === 'dismiss') {
    console.log('[SW] Notification dismissed by user')
    return
  }

  // Default action or 'open' action - navigate to URL
  const urlToOpen = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Check if there's already a window open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        const clientUrl = new URL(client.url)
        const targetUrl = new URL(urlToOpen, self.location.origin)
        
        // If same path, just focus existing window
        if (clientUrl.pathname === targetUrl.pathname) {
          console.log('[SW] Focusing existing window:', clientUrl)
          return client.focus()
        }
      }

      // If not, open a new window
      console.log('[SW] Opening new window with URL:', urlToOpen)
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// ==================== NOTIFICATION CLOSE HANDLER ====================

/**
 * Handle notification close events
 */
self.addEventListener('notificationclose', function(event) {
  console.log('[SW] Notification closed:', event.notification.tag)
  
  // Could send analytics here
  // e.g., track that user dismissed notification without opening
})

// ==================== MESSAGE FROM MAIN THREAD ====================

/**
 * Handle messages from the main thread (client)
 * Supports: SHOW_NOTIFICATION, SKIP_WAITING, UPDATE_BADGE, etc.
 */
self.addEventListener('message', function(event) {
  console.log('[SW] Message received from client:', event.data.type)
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data
    
    const finalOptions = {
      ...NOTIFICATION_DEFAULTS,
      ...options,
      tag: options.tag || `notification-${Date.now()}`
    }

    // Apply priority settings if provided
    const priority = options.priority || 'medium'
    const prioritySettings = PRIORITY_SETTINGS[priority]
    if (prioritySettings) {
      finalOptions.requireInteraction = prioritySettings.requireInteraction
      finalOptions.vibrate = prioritySettings.vibrate
    }

    self.registration.showNotification(title, finalOptions)
    console.log('[SW] Notification shown via message:', title)
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING received, updating service worker')
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'UPDATE_BADGE') {
    // Note: Badge API is not widely supported yet
    console.log('[SW] UPDATE_BADGE:', event.data.count)
    // Future: navigator.setAppBadge(event.data.count)
  }

  if (event.data && event.data.type === 'CLEAR_BADGE') {
    console.log('[SW] CLEAR_BADGE')
    // Future: navigator.clearAppBadge()
  }
})

// ==================== SERVICE WORKER ACTIVATION ====================

/**
 * Handle service worker activation
 * Cleans up old caches and takes control of all clients
 */
self.addEventListener('activate', function(event) {
  console.log('[SW] Service Worker activated')
  event.waitUntil(
    (async () => {
      // Take control of all clients
      const clients_result = await self.clients.claim()
      console.log('[SW] Claimed all clients:', clients_result)
      
      // Clean up old caches if needed
      const cacheNames = await caches.keys()
      const outdatedCaches = cacheNames.filter(name => 
        name !== 'v1' // Keep current cache version
      )
      
      return Promise.all(
        outdatedCaches.map(name => {
          console.log('[SW] Deleting old cache:', name)
          return caches.delete(name)
        })
      )
    })()
  )
})

// ==================== SERVICE WORKER INSTALLATION ====================

/**
 * Handle service worker installation
 * Skips waiting if a new version is available
 */
self.addEventListener('install', function(event) {
  console.log('[SW] Service Worker installing')
  self.skipWaiting()
})

// ==================== FETCH EVENT HANDLER (Optional) ====================

/**
 * Handle fetch events for cache strategy (if needed)
 */
self.addEventListener('fetch', function(event) {
  // For now, just pass through to network
  // Can add caching strategy later if needed
  // console.log('[SW] Fetch:', event.request.url)
})

console.log('[SW] Service Worker setup complete')
