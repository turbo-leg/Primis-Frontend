/**
 * Real-time Notification Hook with WebSocket Support
 * Connects to the enhanced backend notification system
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/components/ui/use-toast'

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
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const { enabled = true, showToasts = true, onNotification } = options
  
  const { user, userType } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const isConnectingRef = useRef(false)
  
  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 3000 // 3 seconds

  // Extract user ID from user object based on user type
  const getUserId = () => {
    if (!user) return null
    if (userType === 'student' && 'student_id' in user) return (user as any).student_id
    if (userType === 'teacher' && 'teacher_id' in user) return (user as any).teacher_id
    if (userType === 'admin' && 'admin_id' in user) return (user as any).admin_id
    return null
  }

  const userId = getUserId()

  const handleNotification = useCallback((notification: RealtimeNotification) => {
    console.log('📨 Real-time notification received:', notification)
    
    // Invalidate queries to refresh notification list
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    queryClient.invalidateQueries({ queryKey: ['notificationCount'] })
    
    // Show browser notification (Chrome notification)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const browserNotificationOptions: NotificationOptions = {
          body: notification.message,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: `notification-${notification.id || Date.now()}`,
          requireInteraction: notification.priority === 'urgent' || notification.priority === 'high',
          data: {
            url: notification.metadata?.url || '/dashboard',
            id: notification.id,
            type: notification.notification_type
          }
        }
        
        // Add sound for urgent notifications
        if (notification.priority === 'urgent' || notification.priority === 'high') {
          // Note: Some browsers support vibration API
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
          }
        }
        
        // Show the browser notification
        if (navigator.serviceWorker?.controller) {
          // If service worker is active, use it
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: notification.title,
            options: browserNotificationOptions
          })
        } else {
          // Fallback to direct notification
          new Notification(notification.title, browserNotificationOptions)
        }
      } catch (err) {
        console.error('❌ Failed to show browser notification:', err)
      }
    }
    
    // Show toast notification (in-app)
    if (showToasts) {
      const priorityStyles = {
        urgent: { variant: 'destructive' as const, duration: 10000 },
        high: { variant: 'default' as const, duration: 7000 },
        medium: { variant: 'default' as const, duration: 5000 },
        low: { variant: 'default' as const, duration: 3000 }
      }
      
      const style = priorityStyles[notification.priority as keyof typeof priorityStyles] || priorityStyles.medium
      
      toast({
        title: notification.title,
        description: notification.message,
        ...style
      })
    }
    
    // Custom handler
    if (onNotification) {
      onNotification(notification)
    }
    
    // Play notification sound (optional)
    if (typeof window !== 'undefined' && notification.priority === 'urgent') {
      try {
        const audio = new Audio('/notification-sound.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {
          // Ignore errors (user might not have interacted with page yet)
        })
      } catch (err) {
        // Ignore audio errors
      }
    }
  }, [queryClient, showToasts, toast, onNotification])

  const connect = useCallback(() => {
    console.log('🔌 [WebSocket] Connect called - userId:', userId, 'enabled:', enabled, 'current state:', wsRef.current?.readyState)
    
    if (!userId || !enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('🔌 [WebSocket] Skipping connection:', { hasUserId: !!userId, enabled, currentState: wsRef.current?.readyState })
      isConnectingRef.current = false
      return
    }

    try {
      // Get WebSocket URL from environment or construct from API URL
      let wsUrl: string
      
      console.log('🔌 [WebSocket] Environment vars:', {
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
      })
      
      if (process.env.NEXT_PUBLIC_WS_URL) {
        // Use explicit WebSocket URL if provided
        // First try without token to test if connection works
        wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/v1/notifications/ws/${userId}`
        
        // Then add token if available
        const token = localStorage.getItem('access_token')
        if (token) {
          wsUrl += `?token=${encodeURIComponent(token)}`
        }
      } else if (process.env.NEXT_PUBLIC_API_URL) {
        // Construct WebSocket URL from API URL
        const wsProtocol = process.env.NEXT_PUBLIC_API_URL.startsWith('https') ? 'wss:' : 'ws:'
        const apiHost = process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
        wsUrl = `${wsProtocol}//${apiHost}/api/v1/notifications/ws/${userId}`
        
        const token = localStorage.getItem('access_token')
        if (token) {
          wsUrl += `?token=${encodeURIComponent(token)}`
        }
      } else {
        // Fallback to window location
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        wsUrl = `${wsProtocol}//${window.location.host}/api/v1/notifications/ws/${userId}`
        
        const token = localStorage.getItem('access_token')
        if (token) {
          wsUrl += `?token=${encodeURIComponent(token)}`
        }
      }
      
      console.log('🔌 [WebSocket] Connecting to:', wsUrl)
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('✅ [WebSocket] Connected successfully')
        isConnectingRef.current = false
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        console.log('📨 [WebSocket] Message received:', event.data)
        
        // Skip echo test messages (for debugging)
        if (event.data.startsWith('Echo:')) {
          console.log('🔄 [WebSocket] Echo response (test):', event.data)
          return
        }
        
        try {
          const notification: RealtimeNotification = JSON.parse(event.data)
          handleNotification(notification)
        } catch (err) {
          console.error('❌ [WebSocket] Failed to parse notification:', err, 'Data:', event.data)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ [WebSocket] Error:', error)
        setConnectionError('Connection error')
      }

      ws.onclose = () => {
        console.log('🔌 [WebSocket] Disconnected, readyState:', wsRef.current?.readyState)
        isConnectingRef.current = false
        setIsConnected(false)
        wsRef.current = null

        // Attempt to reconnect
        if (enabled && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++
          console.log(`🔄 [WebSocket] Reconnecting... (Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            isConnectingRef.current = true
            connect()
          }, RECONNECT_DELAY * reconnectAttemptsRef.current)
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setConnectionError('Connection failed. Please refresh the page.')
        }
      }
    } catch (err) {
      console.error('❌ Failed to connect to WebSocket:', err)
      isConnectingRef.current = false
      setConnectionError('Failed to establish connection')
    }
  }, [userId, enabled, handleNotification])

  const disconnect = useCallback(() => {
    console.log('🔌 [WebSocket] Disconnect called')
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      console.log('🔌 Closing WebSocket')
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
    setConnectionError(null)
    reconnectAttemptsRef.current = 0
    isConnectingRef.current = false
  }, [])

  // Connect/disconnect based on user and enabled status
  useEffect(() => {
    console.log('🔌 [WebSocket] useEffect triggered - userId:', userId, 'enabled:', enabled)
    
    if (enabled && userId && !isConnectingRef.current) {
      isConnectingRef.current = true
      connect()
    } else if (!enabled || !userId) {
      console.log('🔌 [WebSocket] Not connecting - enabled:', enabled, 'userId:', userId)
      disconnect()
    }

    return () => {
      // Don't disconnect on every effect cleanup - only when component unmounts
      // Check if we're actually unmounting by looking at the effect cleanup
    }
  }, [enabled, userId])

  // Send heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected || !wsRef.current) return

    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'heartbeat' }))
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(heartbeatInterval)
  }, [isConnected])

  return {
    isConnected,
    connectionError,
    reconnect: connect,
    disconnect
  }
}
