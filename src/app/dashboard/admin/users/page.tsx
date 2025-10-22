'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'

export default function AdminUsersPage() {
  const { user } = useAuthStore()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>
      <Card className="p-6">
        <p>User management functionality coming soon...</p>
      </Card>
    </div>
  )
}