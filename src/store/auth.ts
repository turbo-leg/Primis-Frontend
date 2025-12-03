import { create } from 'zustand'
import { persist, PersistStorage } from 'zustand/middleware'
import { AuthToken, UserType, Student, Teacher, Admin } from '@/types'
import { apiClient } from '@/lib/api'

interface UserPermissions {
  notificationsEnabled: boolean
  cookiesEnabled: boolean
  analyticsEnabled: boolean
  timestamp: number
}

interface AuthState {
  user: Student | Teacher | Admin | null
  userType: UserType | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: UserPermissions | null
  login: (email: string, password: string) => Promise<UserType>
  logout: () => void
  register: (data: any, userType?: UserType) => Promise<void>
  setUser: (user: any, userType: UserType, token: string) => void
  setPermissions: (permissions: UserPermissions) => void
  clearAuth: () => void
}

// Custom storage to handle JSON parse errors gracefully
const customStorage: PersistStorage<AuthState> = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    try {
      return JSON.parse(str)
    } catch (err) {
      console.error('Error parsing auth storage, clearing it:', err)
      localStorage.removeItem(name)
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value))
    } catch (err) {
      console.error('Error writing auth storage:', err)
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userType: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const authData = await apiClient.login({ email, password })
          
          // Store token in localStorage
          localStorage.setItem('access_token', authData.access_token)
          
          // Get user details
          const userData = await apiClient.getCurrentUser()
          
          const userType = authData.user_type as UserType
          
          set({
            user: userData.user,
            userType,
            token: authData.access_token,
            isAuthenticated: true,
            isLoading: false
          })

          // Return user type for redirection
          return userType
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: any, userType: UserType = 'student') => {
        set({ isLoading: true })
        try {
          await apiClient.register(data, userType)
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      setUser: (user: any, userType: UserType, token: string) => {
        localStorage.setItem('access_token', token)
        set({
          user,
          userType,
          token,
          isAuthenticated: true
        })
      },

      setPermissions: (permissions: UserPermissions) => {
        set({ permissions })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_data')
        // Don't remove user_permissions on logout so they persist across sessions
        set({
          user: null,
          userType: null,
          token: null,
          isAuthenticated: false,
          permissions: null
        })
      },

      clearAuth: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_data')
        // Don't remove user_permissions on clearAuth
        set({
          user: null,
          userType: null,
          token: null,
          isAuthenticated: false,
          permissions: null
        })
      }
    }),
    {
      name: 'auth-storage',
      storage: customStorage,
      partialize: (state) => ({
        user: state.user,
        userType: state.userType,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      })
    }
  )
)