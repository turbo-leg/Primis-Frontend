'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

/**
 * Hook to request notification permission on app load when user is authenticated
 */
export function useNotificationPermission() {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    // Check if browser supports notifications
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('Browser does not support notifications')
      return
    }

    // If permission is already granted or denied, do nothing
    if (Notification.permission !== 'default') {
      return
    }

    // Request permission
    console.log('Requesting notification permission...')
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('✅ Notification permission granted')
        
        // Register service worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then((registration) => {
              console.log('✅ Service Worker registered:', registration)
            })
            .catch((err) => {
              console.error('❌ Service Worker registration failed:', err)
            })
        }
      } else if (permission === 'denied') {
        console.log('⚠️ Notification permission denied')
      }
    }).catch((err) => {
      console.error('❌ Error requesting notification permission:', err)
    })
  }, [isAuthenticated])
}
