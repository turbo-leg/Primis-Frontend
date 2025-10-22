'use client'

import { useTranslations } from 'next-intl'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReportsPage() {
  const t = useTranslations()

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.admin.reports')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Reports content will go here */}
            <p className="text-gray-600 dark:text-gray-400">
              Reports interface is under development.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}