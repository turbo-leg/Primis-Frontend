'use client'

import { useTranslations } from 'next-intl'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UserManagementPage() {
  const t = useTranslations()

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.admin.userManagement')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* User Management content will go here */}
            <p className="text-gray-600 dark:text-gray-400">
              User management interface is under development.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}