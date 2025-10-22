'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import { 
  Users, 
  BookOpen, 
  BarChart3,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { user } = useAuthStore()

  const adminModules = [
    {
      title: 'User Management',
      icon: Users,
      description: 'Manage users, roles, and permissions',
      link: '/dashboard/admin/users'
    },
    {
      title: 'Courses',
      icon: BookOpen,
      description: 'Manage courses and curricula',
      link: '/courses'
    },
    {
      title: 'Reports',
      icon: BarChart3,
      description: 'View analytics and generate reports',
      link: '/dashboard/admin/reports'
    },
    {
      title: 'Settings',
      icon: Settings,
      description: 'Configure system settings',
      link: '/dashboard/settings'
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminModules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.link} href={module.link}>
              <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Icon className="h-8 w-8" />
                  <h3 className="font-medium">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}