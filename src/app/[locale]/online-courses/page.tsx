'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Clock, 
  Users, 
  Star,
  Search,
  Filter,
  PlayCircle,
  BookOpen,
  Award,
  Eye,
  CheckCircle,
  BarChart3
} from 'lucide-react'

interface Course {
  course_id: number
  course_name: string
  description: string
  teacher_name: string
  department_name: string
  credits: number
  max_students: number
  enrolled_students: number
}

interface OnlineCourse {
  online_course_id: number
  course_id: number
  total_lessons: number
  estimated_duration_hours: number
  difficulty_level: string
  completion_certificate: boolean
  passing_score_percentage: number
  course: Course
}

interface StudentProgress {
  progress_id: number
  lessons_completed: number
  total_time_spent_minutes: number
  completion_percentage: number
  status: string
  certificate_issued: boolean
  final_score: number
}

interface OnlineCourseWithProgress extends OnlineCourse {
  progress?: StudentProgress
  is_enrolled: boolean
  is_preview_available: boolean
}

export default function OnlineCoursesPage() {
  const t = useTranslations()
  const { user } = useAuthStore()
  
  const [onlineCourses, setOnlineCourses] = useState<OnlineCourseWithProgress[]>([])
  const [filteredCourses, setFilteredCourses] = useState<OnlineCourseWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOnlineCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [onlineCourses, searchTerm, difficultyFilter, statusFilter])

  const fetchOnlineCourses = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get('/api/v1/online-courses')
      
      // Fetch progress for each course if user is a student
      if (user && 'student_id' in user) {
        const coursesWithProgress = await Promise.all(
          data.map(async (course: OnlineCourse) => {
            try {
              const progressData = await apiClient.get(
                `/api/v1/online-courses/student/${user.student_id}/progress/${course.online_course_id}`
              )
              return {
                ...course,
                progress: progressData,
                is_enrolled: true,
                is_preview_available: true
              }
            } catch (error) {
              // No progress means not enrolled or no progress yet
              return {
                ...course,
                is_enrolled: false,
                is_preview_available: true
              }
            }
          })
        )
        setOnlineCourses(coursesWithProgress)
      } else {
        // For non-students, just show courses without progress
        const coursesWithoutProgress = data.map((course: OnlineCourse) => ({
          ...course,
          is_enrolled: false,
          is_preview_available: true
        }))
        setOnlineCourses(coursesWithoutProgress)
      }
      
    } catch (error) {
      console.error('Failed to fetch online courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = onlineCourses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(course => course.difficulty_level === difficultyFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'enrolled') {
        filtered = filtered.filter(course => course.is_enrolled)
      } else if (statusFilter === 'completed') {
        filtered = filtered.filter(course => course.progress?.status === 'completed')
      } else if (statusFilter === 'in_progress') {
        filtered = filtered.filter(course => course.progress?.status === 'in_progress')
      } else if (statusFilter === 'not_started') {
        filtered = filtered.filter(course => !course.progress || course.progress.status === 'not_started')
      }
    }

    setFilteredCourses(filtered)
  }

  const getDifficultyBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
    }
  }

  const getStatusBadge = (course: OnlineCourseWithProgress) => {
    if (!course.progress) {
      return (
        <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
          {t('onlineCourses.filters.notStarted')}
        </Badge>
      )
    }

    switch (course.progress.status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('onlineCourses.filters.completed')}
          </Badge>
        )
      case 'in_progress':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
            <BarChart3 className="h-3 w-3 mr-1" />
            {t('onlineCourses.filters.inProgress')}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
            {t('onlineCourses.filters.notStarted')}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('onlineCourses.pageTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('onlineCourses.pageSubtitle')}</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('onlineCourses.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40 bg-white dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder={t('onlineCourses.filters.difficulty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('onlineCourses.filters.allLevels')}</SelectItem>
                <SelectItem value="beginner">{t('onlineCourses.filters.beginner')}</SelectItem>
                <SelectItem value="intermediate">{t('onlineCourses.filters.intermediate')}</SelectItem>
                <SelectItem value="advanced">{t('onlineCourses.filters.advanced')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder={t('onlineCourses.filters.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('onlineCourses.filters.allCourses')}</SelectItem>
                <SelectItem value="enrolled">{t('onlineCourses.filters.enrolled')}</SelectItem>
                <SelectItem value="in_progress">{t('onlineCourses.filters.inProgress')}</SelectItem>
                <SelectItem value="completed">{t('onlineCourses.filters.completed')}</SelectItem>
                <SelectItem value="not_started">{t('onlineCourses.filters.notStarted')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        {user && 'student_id' in user && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('onlineCourses.stats.totalCourses')}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {onlineCourses.filter(c => c.is_enrolled).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('onlineCourses.stats.inProgress')}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {onlineCourses.filter(c => c.progress?.status === 'in_progress').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('onlineCourses.stats.completed')}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {onlineCourses.filter(c => c.progress?.status === 'completed').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('onlineCourses.stats.certificates')}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {onlineCourses.filter(c => c.progress?.certificate_issued).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.online_course_id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 dark:text-white">
                      {course.course?.course_name || `Online Course ${course.online_course_id}`}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2 dark:text-gray-400">
                      {course.course?.description || t('onlineCourses.card.noDescription')}
                    </CardDescription>
                  </div>
                  {course.progress && (
                    <div className="ml-2">
                      {getStatusBadge(course)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getDifficultyBadgeColor(course.difficulty_level)}>
                    {t(`onlineCourses.filters.${course.difficulty_level}`)}
                  </Badge>
                  {course.completion_certificate && (
                    <Badge variant="outline" className="text-purple-600 dark:text-purple-400 dark:border-purple-800">
                      <Award className="h-3 w-3 mr-1" />
                      {t('onlineCourses.card.certificate')}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Course Info */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>{t('onlineCourses.card.instructor')}:</span>
                      <span className="font-medium dark:text-gray-300">{course.course?.teacher_name || t('onlineCourses.card.unknown')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('onlineCourses.card.department')}:</span>
                      <span className="font-medium dark:text-gray-300">{course.course?.department_name || t('onlineCourses.card.unknown')}</span>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      <span>{course.total_lessons} {t('onlineCourses.card.lessons')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.estimated_duration_hours}{t('onlineCourses.card.hours')} {t('onlineCourses.card.totalDuration')}</span>
                    </div>
                  </div>

                  {/* Progress Bar (if enrolled) */}
                  {course.progress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('onlineCourses.card.progress')}</span>
                        <span className="font-medium dark:text-gray-300">{Math.round(course.progress.completion_percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress.completion_percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {course.is_enrolled ? (
                      <Link href={`/online-courses/${course.online_course_id}`} className="flex-1">
                        <Button className="w-full">
                          {course.progress?.status === 'completed' ? t('onlineCourses.card.reviewCourse') : t('onlineCourses.card.continueLearning')}
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex gap-2 w-full">
                        {course.is_preview_available && (
                          <Link href={`/online-courses/${course.online_course_id}`} className="flex-1">
                            <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                              <Eye className="h-4 w-4 mr-2" />
                              {t('onlineCourses.card.preview')}
                            </Button>
                          </Link>
                        )}
                        <Button variant="default" className="flex-1">
                          {t('onlineCourses.card.enrollNow')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || difficultyFilter !== 'all' || statusFilter !== 'all' 
                ? t('onlineCourses.empty.noMatchesTitle')
                : t('onlineCourses.empty.noCoursesTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || difficultyFilter !== 'all' || statusFilter !== 'all' 
                ? t('onlineCourses.empty.noMatchesDescription')
                : t('onlineCourses.empty.noCoursesDescription')}
            </p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}