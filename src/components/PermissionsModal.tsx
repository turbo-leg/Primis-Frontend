'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Cookie, X, Check, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PermissionsModalProps {
  isOpen: boolean
  onClose: (preferences: PermissionsPreferences) => void
}

export interface PermissionsPreferences {
  notificationsEnabled: boolean
  cookiesEnabled: boolean
  analyticsEnabled: boolean
  timestamp: number
}

export function PermissionsModal({ isOpen, onClose }: PermissionsModalProps) {
  const t = useTranslations()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [cookiesEnabled, setCookiesEnabled] = useState(true)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAcceptAll = async () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onClose({
        notificationsEnabled: true,
        cookiesEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
      })
    }, 500)
  }

  const handleCustom = async () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onClose({
        notificationsEnabled,
        cookiesEnabled,
        analyticsEnabled,
        timestamp: Date.now(),
      })
    }, 500)
  }

  const handleDeclineAll = async () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onClose({
        notificationsEnabled: false,
        cookiesEnabled: false,
        analyticsEnabled: false,
        timestamp: Date.now(),
      })
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10">
        {/* Header */}
        <CardHeader className="border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl dark:text-white mb-1">
                {t('permissions.title')}
              </CardTitle>
              <CardDescription className="text-base dark:text-gray-300">
                {t('permissions.subtitle')}
              </CardDescription>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white ml-4">
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="py-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('permissions.info')}
            </p>
          </div>

          {/* Permission Items */}
          <div className="space-y-4">
            {/* Notifications */}
            <div className="border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1 p-2 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                    <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('permissions.notifications.title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('permissions.notifications.description')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                    notificationsEnabled
                      ? 'bg-purple-600 dark:bg-purple-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Cookies */}
            <div className="border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1 p-2 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
                    <Cookie className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('permissions.cookies.title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('permissions.cookies.description')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCookiesEnabled(!cookiesEnabled)}
                  className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                    cookiesEnabled
                      ? 'bg-orange-600 dark:bg-orange-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      cookiesEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Analytics */}
            <div className="border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1 p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('permissions.analytics.title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('permissions.analytics.description')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                    analyticsEnabled
                      ? 'bg-green-600 dark:bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      analyticsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex gap-6 text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-white/10">
            <a href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition">
              {t('permissions.privacy')}
            </a>
            <a href="/terms" className="hover:text-gray-900 dark:hover:text-white transition">
              {t('permissions.terms')}
            </a>
            <a href="/cookies" className="hover:text-gray-900 dark:hover:text-white transition">
              {t('permissions.cookiePolicy')}
            </a>
          </div>
        </CardContent>

        {/* Footer - Actions */}
        <div className="border-t border-gray-200 dark:border-white/10 px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-b-lg flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleDeclineAll}
            disabled={isSubmitting}
            className="dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            {t('permissions.declineAll')}
          </Button>
          <Button
            variant="outline"
            onClick={handleCustom}
            disabled={isSubmitting}
            className="dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                <span>{t('common.saving')}</span>
              </div>
            ) : (
              t('permissions.savePreferences')
            )}
          </Button>
          <Button
            onClick={handleAcceptAll}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span>{t('common.saving')}</span>
              </div>
            ) : (
              t('permissions.acceptAll')
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
