/**
 * Enhanced Real-Time Notifications Hook with Mobile & Desktop Support
 * Includes adaptive reconnection, mobile optimizations, and push notifications
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/components/ui/use-toast'
import {
  requestNotificationPermission,
  registerServiceWorker,
  sendMessageToServiceWorker,
  updateAppBadge,
  isMobileDevice,
  getDeviceType,
  getNetworkInfo,
  vibrate,
  isNotificationSupported,
  logNotificationCapabilities,
} from '@/utils/notificationPermissions'

interface RealtimeNotification {
  type: string
  notification_type: string
  title: string
  message: string
  priority: string
  metadata?: Record<string, any>
  timestamp: string
  id: string
}

interface UseRealtimeNotificationsOptions {
  enabled?: boolean
  showToasts?: boolean
  onNotification?: (notification: RealtimeNotification) => void
  mobile?: boolean // Force mobile mode
}

export function useEnhancedRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const { enabled = true, showToasts = true, onNotification, mobile = isMobileDevice() } = options

  const { user, userType } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'default'>('default')
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [unreadCount, setUnreadCount] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const isConnectingRef = useRef(false)
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const serviceWorkerRegistrationRef = useRef<ServiceWorkerRegistration | null>(null)

  // Adaptive timeouts based on device type and network
  const getAdaptiveSettings = useCallback(() => {
    const deviceType = getDeviceType()
    const network = getNetworkInfo()
    
    let baseReconnectDelay = mobile ? 5000 : 3000 // 5s vs 3s
    let maxReconnectAttempts = mobile ? 8 : 5
    let heartbeatInterval = mobile ? 45000 : 30000 // 45s vs 30s

    // Adjust for poor network conditions
    if (network.effectiveType === '2g' || network.effectiveType === 'slow-2g') {
      baseReconnectDelay *= 2 // Double the delay
      heartbeatInterval *= 1.5 // 1.5x longer
    }

    // Adjust for data saver mode
    if (network.saveData) {
      baseReconnectDelay *= 1.5
      heartbeatInterval *= 2
    }

    return {
      reconnectDelay: baseReconnectDelay,
      maxReconnectAttempts,
      heartbeatInterval,
      deviceType,
    }
  }, [mobile])

  // Extract user ID
  const getUserId = () => {
    if (!user) return null
    if (userType === 'student' && 'student_id' in user) return (user as any).student_id
    if (userType === 'teacher' && 'teacher_id' in user) return (user as any).teacher_id
    if (userType === 'admin' && 'admin_id' in user) return (user as any).admin_id
    return null
  }

  const userId = getUserId()

  // Handle incoming notifications
  const handleNotification = useCallback((notification: RealtimeNotification) => {
    console.log('📨 Real-time notification received:', notification)

    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    queryClient.invalidateQueries({ queryKey: ['notificationCount'] })

    // Update unread count if available
    if (notification.metadata?.unread_count) {
      setUnreadCount(notification.metadata.unread_count)
      updateAppBadge(notification.metadata.unread_count)
    }

    // Show browser notification
    if (isNotificationSupported() && notificationPermission === 'granted') {
      try {
        const browserNotificationOptions: NotificationOptions = {
          body: notification.message,
          icon: '/logo.png',
          badge: '/badge.png',
          tag: `notification-${notification.id || Date.now()}`,
          requireInteraction: notification.priority === 'urgent' || notification.priority === 'high',
          data: {
            url: notification.metadata?.url || '/dashboard',
            id: notification.id,
            type: notification.notification_type,
          },
        }

        // Mobile vibration for important notifications
        if (mobile && (notification.priority === 'urgent' || notification.priority === 'high')) {
          vibrate([200, 100, 200])
        }

        // Show through service worker if available
        if (navigator.serviceWorker?.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: notification.title,
            options: browserNotificationOptions,
          })
        } else {
          new Notification(notification.title, browserNotificationOptions)
        }
      } catch (err) {
        console.error('❌ Failed to show browser notification:', err)
      }
    }

    // Show toast notification
    if (showToasts) {
      const priorityColors = {
        urgent: 'destructive',
        high: 'default',
        medium: 'default',
        low: 'default',
      } as const

      toast({
        title: notification.title,
        description: notification.message,
        variant: priorityColors[notification.priority as keyof typeof priorityColors] || 'default',
      })
    }

    // Call custom handler
    if (onNotification) {
      onNotification(notification)
    }
  }, [queryClient, showToasts, toast, onNotification, notificationPermission, mobile])

  // Connect to WebSocket
  const connect = useCallback(() => {
    console.log('🔌 [WebSocket] Connecting...', { userId, enabled, currentState: wsRef.current?.readyState })

    if (!userId || !enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      isConnectingRef.current = false
      return
    }

    try {
      let wsUrl: string

      if (process.env.NEXT_PUBLIC_WS_URL) {
        wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/v1/notifications/ws/${userId}`
        const token = localStorage.getItem('access_token')
        if (token) {
          wsUrl += `?token=${encodeURIComponent(token)}`
        }
      } else if (process.env.NEXT_PUBLIC_API_URL) {
        const wsProtocol = process.env.NEXT_PUBLIC_API_URL.startsWith('https') ? 'wss:' : 'ws:'
        const apiHost = process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
        wsUrl = `${wsProtocol}//${apiHost}/api/v1/notifications/ws/${userId}`
        const token = localStorage.getItem('access_token')
        if (token) {
          wsUrl += `?token=${encodeURIComponent(token)}`
        }
      } else {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        wsUrl = `${wsProtocol}//${window.location.host}/api/v1/notifications/ws/${userId}`
        const token = localStorage.getItem('access_token')
        if (token) {
          wsUrl += `?token=${encodeURIComponent(token)}`
        }
      }

      console.log('🔌 [WebSocket] Connecting to:', wsUrl)
      isConnectingRef.current = true

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('✅ [WebSocket] Connected')
        isConnectingRef.current = false
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        console.log('📨 [WebSocket] Message:', event.data)

        try {
          const notification: RealtimeNotification = JSON.parse(event.data)
          
          // Skip system messages
          if (notification.type === 'ping' || notification.type === 'pong') {
            return
          }

          handleNotification(notification)
        } catch (err) {
          console.error('❌ [WebSocket] Failed to parse:', err)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ [WebSocket] Error:', error)
        setConnectionError('Connection error')
      }

      ws.onclose = () => {
        console.log('🔌 [WebSocket] Disconnected')
        setIsConnected(false)
        
        // Attempt to reconnect
        const { reconnectDelay, maxReconnectAttempts } = getAdaptiveSettings()
        
        if (reconnectAttemptsRef.current < maxReconnectAttempts && enabled) {
          reconnectAttemptsRef.current++
          console.log(`🔄 [WebSocket] Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay * reconnectAttemptsRef.current) // Exponential backoff
        } else if (!enabled) {
          console.log('🔌 [WebSocket] Reconnection disabled')
        } else {
          console.warn('❌ [WebSocket] Max reconnection attempts reached')
          setConnectionError('Failed to connect after multiple attempts')
        }
      }
    } catch (error) {
      console.error('❌ [WebSocket] Connection error:', error)
      setConnectionError('Failed to connect')
      isConnectingRef.current = false
    }
  }, [userId, enabled, handleNotification, getAdaptiveSettings])

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'heartbeat', userId }))
      } catch (error) {
        console.error('❌ [WebSocket] Failed to send heartbeat:', error)
      }
    }
  }, [userId])

  // Setup heartbeat
  useEffect(() => {
    if (!isConnected) return

    const { heartbeatInterval } = getAdaptiveSettings()
    const interval = setInterval(sendHeartbeat, heartbeatInterval)

    return () => clearInterval(interval)
  }, [isConnected, sendHeartbeat, getAdaptiveSettings])

  // Request notification permission
  useEffect(() => {
    const initNotifications = async () => {
      // Log capabilities
      logNotificationCapabilities()

      // Register service worker
      serviceWorkerRegistrationRef.current = await registerServiceWorker()

      // Request permission
      if (isNotificationSupported()) {
        const permission = await requestNotificationPermission()
        setNotificationPermission(permission as 'granted' | 'denied' | 'default' || 'default')
      }
    }

    if (typeof window !== 'undefined') {
      initNotifications()
    }
  }, [])

  // Set device type
  useEffect(() => {
    setDeviceType(getDeviceType())
  }, [])

  // Connect/disconnect
  useEffect(() => {
    if (enabled && userId) {
      connect()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current)
      }
    }
  }, [enabled, userId, connect])

  return {
    isConnected,
    connectionError,
    notificationPermission,
    deviceType,
    unreadCount,
  }
}
