import { useEffect, useState } from 'react'

export interface UserPermissions {
  notificationsEnabled: boolean
  cookiesEnabled: boolean
  analyticsEnabled: boolean
  timestamp: number
}

const STORAGE_KEY = 'user_permissions'

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user has already set permissions
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPermissions(JSON.parse(stored))
        setIsFirstLogin(false)
      } else {
        setIsFirstLogin(true)
      }
    } catch (error) {
      console.error('Error loading permissions:', error)
      setIsFirstLogin(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save permissions
  const savePermissions = (newPermissions: UserPermissions) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPermissions))
      setPermissions(newPermissions)
      setIsFirstLogin(false)
      
      // Apply preferences
      applyPermissions(newPermissions)
    } catch (error) {
      console.error('Error saving permissions:', error)
    }
  }

  // Apply permissions to the app
  const applyPermissions = (prefs: UserPermissions) => {
    // Cookies
    if (prefs.cookiesEnabled) {
      // Enable functional cookies
      localStorage.setItem('cookies_enabled', 'true')
    } else {
      localStorage.removeItem('cookies_enabled')
    }

    // Notifications
    if (prefs.notificationsEnabled) {
      // Request notification permission if available
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {
          // User denied, but we already have the preference recorded
        })
      }
    }

    // Analytics
    if (prefs.analyticsEnabled) {
      localStorage.setItem('analytics_enabled', 'true')
    } else {
      localStorage.removeItem('analytics_enabled')
    }
  }

  // Reset permissions (for testing)
  const resetPermissions = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('cookies_enabled')
    localStorage.removeItem('analytics_enabled')
    setPermissions(null)
    setIsFirstLogin(true)
  }

  return {
    permissions,
    isFirstLogin,
    isLoading,
    savePermissions,
    resetPermissions,
  }
}
