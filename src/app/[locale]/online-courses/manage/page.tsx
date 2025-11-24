'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Video, 
  Clock, 
  Users, 
  Shield, 
  BookOpen,
  Edit,
  Trash2,
  Eye,
  Upload,
  Settings,
  PlayCircle
} from 'lucide-react'

interface Course {
  course_id: number
  title: string
  description: string
  price: number
  is_online: boolean
  status: string
  max_students: number
  created_at: string
}

interface OnlineCourse {
  online_course_id: number
  course_id: number
  total_lessons: number
  estimated_duration_hours: number
  difficulty_level: string
  copy_protection_enabled: boolean
  access_duration_days: number
  max_concurrent_sessions: number
  completion_certificate: boolean
  created_at: string
}

interface OnlineLesson {
  lesson_id: number
  title: string
  description: string
  lesson_order: number
  video_duration_minutes: number
  content_type: string
  is_preview: boolean
  created_at: string
}

export default function OnlineCoursesPage() {
  const t = useTranslations('onlineCourses.manage')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const { user, userType } = useAuthStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [onlineCourses, setOnlineCourses] = useState<OnlineCourse[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<OnlineLesson[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form states
  const [newOnlineCourse, setNewOnlineCourse] = useState({
    course_id: 0,
    estimated_duration_hours: 10,
    difficulty_level: 'beginner',
    allow_downloads: false,
    watermark_text: '',
    copy_protection_enabled: true,
    access_duration_days: 365,
    max_concurrent_sessions: 1,
    completion_certificate: true,
    passing_score_percentage: 70
  })

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    lesson_order: 1,
    video_url: '',
    video_duration_minutes: 0,
    content_type: 'video',
    text_content: '',
    is_preview: false,
    quiz_questions: '',
    assignment_description: '',
    downloads: ''
  })

  useEffect(() => {
    fetchCourses()
    fetchOnlineCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse.course_id)
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    try {
      const coursesData = await apiClient.get('/api/v1/courses/my-courses')
      setCourses(coursesData)
    } catch (error) {
      console.error('Error fetching courses:', error)
      showMessage('error', t('errorOccurred'))
    }
  }

  const fetchOnlineCourses = async () => {
    try {
      const onlineCoursesData = await apiClient.get('/api/v1/online-courses')
      setOnlineCourses(onlineCoursesData)
    } catch (error) {
      console.error('Error fetching online courses:', error)
    }
  }

  const fetchLessons = async (courseId: number) => {
    try {
      const onlineCourse = onlineCourses.find(oc => oc.course_id === courseId)
      if (onlineCourse) {
        const lessonsData = await apiClient.get(`/api/v1/online-courses/${onlineCourse.online_course_id}/lessons`)
        setLessons(lessonsData)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const createOnlineCourse = async () => {
    try {
      setLoading(true)
      await apiClient.post('/api/v1/online-courses/create', newOnlineCourse)
      showMessage('success', t('successCreated'))
      setShowCreateModal(false)
      fetchOnlineCourses()
      setNewOnlineCourse({
        course_id: 0,
        estimated_duration_hours: 10,
        difficulty_level: 'beginner',
        allow_downloads: false,
        watermark_text: '',
        copy_protection_enabled: true,
        access_duration_days: 365,
        max_concurrent_sessions: 1,
        completion_certificate: true,
        passing_score_percentage: 70
      })
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || t('errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  const createLesson = async () => {
    if (!selectedCourse) return
    
    try {
      setLoading(true)
      const onlineCourse = onlineCourses.find(oc => oc.course_id === selectedCourse.course_id)
      if (onlineCourse) {
        await apiClient.post(`/api/v1/online-courses/${onlineCourse.online_course_id}/lessons`, newLesson)
        showMessage('success', t('lessonCreated'))
        setShowLessonModal(false)
        fetchLessons(selectedCourse.course_id)
        setNewLesson({
          title: '',
          description: '',
          lesson_order: lessons.length + 1,
          video_url: '',
          video_duration_minutes: 0,
          content_type: 'video',
          text_content: '',
          is_preview: false,
          quiz_questions: '',
          assignment_description: '',
          downloads: ''
        })
      }
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || t('errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  const deleteOnlineCourse = async (onlineCourseId: number) => {
    if (!confirm(t('deleteConfirm'))) {
      return
    }

    try {
      setLoading(true)
      await apiClient.delete(`/api/v1/online-courses/${onlineCourseId}`)
      showMessage('success', t('successDeleted'))
      fetchOnlineCourses()
      fetchCourses()
      // Reset selected course if it was deleted
      if (selectedCourse) {
        const deletedCourse = onlineCourses.find(oc => oc.online_course_id === onlineCourseId)
        if (deletedCourse && deletedCourse.course_id === selectedCourse.course_id) {
          setSelectedCourse(null)
          setLessons([])
        }
      }
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || t('errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  const archiveOnlineCourse = async (onlineCourseId: number) => {
    if (!confirm(t('deleteConfirm'))) {
      return
    }

    try {
      setLoading(true)
      await apiClient.put(`/api/v1/online-courses/${onlineCourseId}/archive`)
      showMessage('success', t('successUpdated'))
      fetchOnlineCourses()
      fetchCourses()
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || t('errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  const deleteLesson = async (lessonId: number) => {
    if (!confirm(t('deleteConfirm'))) {
      return
    }

    try {
      setLoading(true)
      await apiClient.delete(`/api/v1/online-courses/lesson/${lessonId}`)
      showMessage('success', t('lessonDeleted'))
      if (selectedCourse) {
        fetchLessons(selectedCourse.course_id)
      }
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || t('errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'text': return <BookOpen className="h-4 w-4" />
      case 'quiz': return <Settings className="h-4 w-4" />
      default: return <PlayCircle className="h-4 w-4" />
    }
  }

  if (userType !== 'teacher' && userType !== 'admin') {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">{tCommon('accessDenied')}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{tCommon('accessDenied')}</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('subtitle')}</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
              : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <p className={message.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
              {message.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">{t('lessons')}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">{t('manageContent')}</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createCourse')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courses.map((course) => {
                    const onlineCourse = onlineCourses.find(oc => oc.course_id === course.course_id)
                    const isOnline = !!onlineCourse
                    
                    return (
                      <div
                        key={course.course_id}
                        onClick={() => setSelectedCourse(course)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedCourse?.course_id === course.course_id
                            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{course.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {isOnline ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700">
                                  <Video className="h-3 w-3 mr-1" />
                                  {tCommon('online')}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                                  {t('draft')}
                                </Badge>
                              )}
                              {onlineCourse && (
                                <Badge className={`${getDifficultyBadgeColor(onlineCourse.difficulty_level)}`}>
                                  {t(onlineCourse.difficulty_level)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Details & Lessons */}
          <div className="lg:col-span-2">
            {selectedCourse ? (
              <div className="space-y-6">
                {/* Course Info */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white">{selectedCourse.title}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">{t('title')}</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowLessonModal(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('addLesson')}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const onlineCourse = onlineCourses.find(oc => oc.course_id === selectedCourse.course_id)
                      if (!onlineCourse) {
                        return (
                          <div className="text-center py-8">
                            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-300">{t('draft')}</p>
                            <Button 
                              onClick={() => {
                                setNewOnlineCourse(prev => ({ ...prev, course_id: selectedCourse.course_id }))
                                setShowCreateModal(true)
                              }}
                              className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                              {t('createCourse')}
                            </Button>
                          </div>
                        )
                      }

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{onlineCourse.total_lessons}</div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">{t('lessons')}</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <Clock className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-900 dark:text-green-200">{onlineCourse.estimated_duration_hours}h</div>
                            <div className="text-sm text-green-700 dark:text-green-300">{t('duration')}</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">{onlineCourse.max_concurrent_sessions}</div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">{t('maxSessions')}</div>
                          </div>
                          <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                            <Shield className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-red-900 dark:text-red-200">
                              {onlineCourse.copy_protection_enabled ? t('on') : t('off')}
                            </div>
                            <div className="text-sm text-red-700 dark:text-red-300">{t('protection')}</div>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                {/* Course Management Actions */}
                {(() => {
                  const onlineCourse = onlineCourses.find(oc => oc.course_id === selectedCourse.course_id)
                  if (onlineCourse) {
                    return (
                      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white">{t('manageContent')}</CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-300">{t('subtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-3 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => archiveOnlineCourse(onlineCourse.online_course_id)}
                              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/20 dark:border-yellow-700"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              {t('archived')}
                            </Button>
                            {userType === 'admin' && (
                              <Button
                                variant="outline"
                                onClick={() => deleteOnlineCourse(onlineCourse.online_course_id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 dark:border-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('deleteCourse')}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }
                  return null
                })()}

                {/* Lessons List */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">{t('lessons')}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">{t('manageContent')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {lessons.length === 0 ? (
                      <div className="text-center py-8">
                        <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300">{t('draft')}</p>
                        <Button 
                          onClick={() => setShowLessonModal(true)}
                          className="mt-4"
                        >
                          {t('addLesson')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson.lesson_id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-semibold">
                                {lesson.lesson_order}
                              </div>
                              <div className="flex items-center gap-2">
                                {getContentTypeIcon(lesson.content_type)}
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.is_preview && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {t('preview')}
                                </Badge>
                              )}
                              {lesson.video_duration_minutes && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {lesson.video_duration_minutes}min
                                </span>
                              )}
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => deleteLesson(lesson.lesson_id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 dark:border-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">{t('manageContent')}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Online Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 text-gray-900 dark:text-white border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">{t('createCourse')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('courseTitle')}
                </label>
                <select
                  value={newOnlineCourse.course_id}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, course_id: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>{t('courseTitle')}</option>
                  {courses.filter(c => !onlineCourses.find(oc => oc.course_id === c.course_id)).map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('duration')} (hours)
                </label>
                <input
                  type="number"
                  value={newOnlineCourse.estimated_duration_hours}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, estimated_duration_hours: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('level')}
                </label>
                <select
                  value={newOnlineCourse.difficulty_level}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, difficulty_level: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">{t('beginner')}</option>
                  <option value="intermediate">{t('intermediate')}</option>
                  <option value="advanced">{t('advanced')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('watermarkText')}
                </label>
                <input
                  type="text"
                  value={newOnlineCourse.watermark_text}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, watermark_text: e.target.value }))}
                  placeholder={t('watermarkPlaceholder')}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="copy_protection"
                  checked={newOnlineCourse.copy_protection_enabled}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, copy_protection_enabled: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="copy_protection" className="text-sm text-gray-700 dark:text-gray-300">
                  {t('enableProtection')}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="completion_certificate"
                  checked={newOnlineCourse.completion_certificate}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, completion_certificate: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="completion_certificate" className="text-sm text-gray-700 dark:text-gray-300">
                  {t('issueCertificate')}
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={createOnlineCourse}
                disabled={loading || newOnlineCourse.course_id === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? tCommon('loading') : t('createCourse')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto text-gray-900 dark:text-white border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">{t('addLesson')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('courseTitle')}
                </label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('description')}
                </label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('lessonOrder')}
                  </label>
                  <input
                    type="number"
                    value={newLesson.lesson_order}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, lesson_order: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contentType')}
                  </label>
                  <select
                    value={newLesson.content_type}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, content_type: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">{t('video')}</option>
                    <option value="text">{t('textContent')}</option>
                    <option value="quiz">{t('quiz')}</option>
                    <option value="assignment">{t('assignment')}</option>
                  </select>
                </div>
              </div>

              {newLesson.content_type === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('videoUrl')}
                    </label>
                    <input
                      type="text"
                      value={newLesson.video_url}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder={t('videoUrlPlaceholder')}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('videoUrlHelp')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('duration')} (minutes)
                    </label>
                    <input
                      type="number"
                      value={newLesson.video_duration_minutes}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, video_duration_minutes: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {newLesson.content_type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('textContent')}
                  </label>
                  <textarea
                    value={newLesson.text_content}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, text_content: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_preview"
                  checked={newLesson.is_preview}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, is_preview: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="is_preview" className="text-sm text-gray-700 dark:text-gray-300">
                  {t('allowPreview')}
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowLessonModal(false)}
                variant="outline"
                className="flex-1 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={createLesson}
                disabled={loading || !newLesson.title}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? tCommon('loading') : t('addLesson')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  )
}