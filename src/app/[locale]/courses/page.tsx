'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { 
  BookOpen, 
  Calendar, 
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  Globe,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

// Define the Course interface locally to ensure it matches the API response
interface Course {
  course_id: number
  title: string
  description: string
  start_time: string
  end_time: string
  price: number
  max_students: number
  is_online: boolean
  location: string
  status: string
  enrolled_count?: number
  teacher_ids?: number[]
}

export default function CoursesPage() {
  const t = useTranslations()
  const locale = useLocale()
  const { user, userType } = useAuthStore()
  const router = useRouter()
  
  // State
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'online' | 'in-person'>('all')

  // Fetch courses function
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Debug log to check which URL is being used
      console.log('[CoursesPage] Fetching courses using baseURL:', apiClient.getBaseUrl())
      
      // Pass status='active' to filter on the server side
      const data = await apiClient.getCourses({ status: 'active' })
      setCourses(data)
    } catch (err: any) {
      console.error('Failed to fetch courses:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Unknown error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch enrolled courses (only for students)
  const fetchEnrolledCourses = useCallback(async () => {
    if (userType !== 'student') return

    try {
      const enrollments = await apiClient.get('/api/v1/courses/my-courses')
      const enrolledIds = new Set<number>(enrollments.map((e: any) => e.course_id))
      setEnrolledCourseIds(enrolledIds)
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err)
      // Don't block the main UI for this, just log it
    }
  }, [userType])

  // Initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }
      fetchCourses()
      fetchEnrolledCourses()
    }
    
    checkAuth()
  }, [router, fetchCourses, fetchEnrolledCourses])

  const handleEnroll = async (courseId: number) => {
    if (userType !== 'student') {
      // Use a toast or better UI in real app, but alert is okay for now if consistent
      alert(t('courses.errors.studentsOnly'))
      return
    }

    try {
      setEnrollingCourseId(courseId)
      await apiClient.post(`/api/v1/courses/${courseId}/enroll`)
      
      // Update local state
      const newEnrolledIds = new Set(enrolledCourseIds)
      newEnrolledIds.add(courseId)
      setEnrolledCourseIds(newEnrolledIds)
      
      // Refresh course list to update counts
      await fetchCourses()
      
      alert(t('courses.success.enrolled'))
    } catch (err: any) {
      console.error('Failed to enroll:', err)
      const msg = err.response?.data?.detail || t('courses.errors.enrollFailed')
      alert(msg)
    } finally {
      setEnrollingCourseId(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(locale, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    } catch (e) {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('mn-MN', {
        style: 'currency',
        currency: 'MNT'
      }).format(amount)
    } catch (e) {
      return `${amount} MNT`
    }
  }

  const filteredCourses = courses.filter(course => {
    if (filter === 'online') return course.is_online
    if (filter === 'in-person') return !course.is_online
    return true
  })

  const isCourseFull = (course: Course) => {
    return (course.enrolled_count || 0) >= course.max_students
  }

  // Loading State
  if (loading && courses.length === 0) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-500">{t('common.loading') || 'Loading courses...'}</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('courses.title')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              {t('courses.subtitle')}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCourses} 
            disabled={loading}
            className="self-start sm:self-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh') || 'Refresh'}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Courses</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error}</p>
              <div className="text-xs opacity-70 font-mono bg-black/10 p-2 rounded">
                API URL: {process.env.NEXT_PUBLIC_API_URL || 'Default (Render)'}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchCourses} 
                className="w-fit mt-2 border-red-200 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            {t('courses.filters.all')}
          </Button>
          <Button
            variant={filter === 'online' ? 'default' : 'outline'}
            onClick={() => setFilter('online')}
          >
            <Globe className="h-4 w-4 mr-2" />
            {t('courses.filters.online')}
          </Button>
          <Button
            variant={filter === 'in-person' ? 'default' : 'outline'}
            onClick={() => setFilter('in-person')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {t('courses.filters.inPerson')}
          </Button>
        </div>

        {/* Courses Grid */}
        {!loading && filteredCourses.length === 0 && !error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('courses.empty.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('courses.empty.subtitle')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.course_id)
              const isFull = isCourseFull(course)
              const canEnroll = userType === 'student' && !isEnrolled && !isFull

              return (
                <Card key={course.course_id} className="flex flex-col transition-all hover:shadow-md">
                  <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-primis-navy-light/50" onClick={() => router.push(`/courses/${course.course_id}`)}>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={course.is_online ? 'default' : 'secondary'}>
                        {course.is_online ? (
                          <>
                            <Globe className="h-3 w-3 mr-1" />
                            {t('courses.badges.online')}
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3 w-3 mr-1" />
                            {t('courses.badges.inPerson')}
                          </>
                        )}
                      </Badge>
                      {isEnrolled && (
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('courses.badges.enrolled')}
                        </Badge>
                      )}
                      {isFull && !isEnrolled && (
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700">
                          {t('courses.badges.full')}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl dark:text-white">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 dark:text-gray-300">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 mb-4 flex-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                        <span>
                          {formatDate(course.start_time)} - {formatDate(course.end_time)}
                        </span>
                      </div>
                      
                      {!course.is_online && course.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                          <span>{course.location}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                        <span>
                          {course.enrolled_count || 0} / {course.max_students} {t('courses.labels.students')}
                        </span>
                      </div>

                      <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                        <span>{formatCurrency(course.price)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => router.push(`/courses/${course.course_id}`)}
                        variant="outline"
                        className="w-full"
                      >
                        {t('courses.buttons.viewDetails')}
                      </Button>
                      
                      {userType === 'student' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEnroll(course.course_id)
                          }}
                          disabled={!canEnroll || enrollingCourseId === course.course_id}
                          className="w-full"
                          variant={isEnrolled ? 'outline' : 'default'}
                        >
                          {enrollingCourseId === course.course_id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {t('courses.buttons.enrolling')}
                            </>
                          ) : isEnrolled ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t('courses.badges.enrolled')}
                            </>
                          ) : isFull ? (
                            t('courses.buttons.courseFull')
                          ) : (
                            t('courses.buttons.enrollNow')
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
