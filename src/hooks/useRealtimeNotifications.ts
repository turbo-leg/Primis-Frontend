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
  
  const { user } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  
  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 3000 // 3 seconds

  const handleNotification = useCallback((notification: RealtimeNotification) => {
    console.log('📨 Real-time notification received:', notification)
    
    // Invalidate queries to refresh notification list
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    queryClient.invalidateQueries({ queryKey: ['notificationCount'] })
    
    // Show toast notification
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
    if (!user?.id || !enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      // Get WebSocket URL from environment or use default
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsHost = process.env.NEXT_PUBLIC_WS_URL || 
                     process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:/, wsProtocol) ||
                     `${wsProtocol}//${window.location.host}/api`
      
      const wsUrl = `${wsHost}/notifications/ws/${user.id}`
      
      console.log('🔌 Connecting to WebSocket:', wsUrl)
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const notification: RealtimeNotification = JSON.parse(event.data)
          handleNotification(notification)
        } catch (err) {
          console.error('❌ Failed to parse notification:', err)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setConnectionError('Connection error')
      }

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        setIsConnected(false)
        wsRef.current = null

        // Attempt to reconnect
        if (enabled && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++
          console.log(`🔄 Reconnecting... (Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, RECONNECT_DELAY * reconnectAttemptsRef.current)
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setConnectionError('Connection failed. Please refresh the page.')
        }
      }
    } catch (err) {
      console.error('❌ Failed to connect to WebSocket:', err)
      setConnectionError('Failed to establish connection')
    }
  }, [user?.id, enabled, handleNotification])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      console.log('🔌 Disconnecting WebSocket')
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
    setConnectionError(null)
    reconnectAttemptsRef.current = 0
  }, [])

  // Connect/disconnect based on user and enabled status
  useEffect(() => {
    if (enabled && user?.id) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, user?.id, connect, disconnect])

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
