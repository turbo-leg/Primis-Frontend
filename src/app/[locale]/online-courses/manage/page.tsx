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
  const t = useTranslations()
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
      showMessage('error', 'Failed to load courses')
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
      showMessage('success', 'Online course created successfully!')
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
      showMessage('error', error.response?.data?.detail || 'Failed to create online course')
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
        showMessage('success', 'Lesson created successfully!')
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
      showMessage('error', error.response?.data?.detail || 'Failed to create lesson')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600 mt-2">Only teachers and administrators can manage online courses.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Online Course Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your online courses with copy protection</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>Select a course to manage</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Online Course
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
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {isOnline ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <Video className="h-3 w-3 mr-1" />
                                  Online Course
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  Regular Course
                                </Badge>
                              )}
                              {onlineCourse && (
                                <Badge className={getDifficultyBadgeColor(onlineCourse.difficulty_level)}>
                                  {onlineCourse.difficulty_level}
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{selectedCourse.title}</CardTitle>
                      <CardDescription>Online Course Management</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowLessonModal(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const onlineCourse = onlineCourses.find(oc => oc.course_id === selectedCourse.course_id)
                      if (!onlineCourse) {
                        return (
                          <div className="text-center py-8">
                            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">This course is not set up for online delivery yet.</p>
                            <Button 
                              onClick={() => {
                                setNewOnlineCourse(prev => ({ ...prev, course_id: selectedCourse.course_id }))
                                setShowCreateModal(true)
                              }}
                              className="mt-4 bg-blue-600 hover:bg-blue-700"
                            >
                              Convert to Online Course
                            </Button>
                          </div>
                        )
                      }

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-900">{onlineCourse.total_lessons}</div>
                            <div className="text-sm text-blue-700">Lessons</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-900">{onlineCourse.estimated_duration_hours}h</div>
                            <div className="text-sm text-green-700">Duration</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-900">{onlineCourse.max_concurrent_sessions}</div>
                            <div className="text-sm text-purple-700">Max Sessions</div>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-red-900">
                              {onlineCourse.copy_protection_enabled ? 'ON' : 'OFF'}
                            </div>
                            <div className="text-sm text-red-700">Protection</div>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                {/* Lessons List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Lessons</CardTitle>
                    <CardDescription>Manage your course content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {lessons.length === 0 ? (
                      <div className="text-center py-8">
                        <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No lessons created yet.</p>
                        <Button 
                          onClick={() => setShowLessonModal(true)}
                          className="mt-4"
                        >
                          Create First Lesson
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson.lesson_id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                                {lesson.lesson_order}
                              </div>
                              <div className="flex items-center gap-2">
                                {getContentTypeIcon(lesson.content_type)}
                                <div>
                                  <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                                  <p className="text-sm text-gray-600">{lesson.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.is_preview && (
                                <Badge variant="outline" className="text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Badge>
                              )}
                              {lesson.video_duration_minutes && (
                                <span className="text-sm text-gray-500">
                                  {lesson.video_duration_minutes}min
                                </span>
                              )}
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
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
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a course to manage its online content</p>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Create Online Course</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Course
                </label>
                <select
                  value={newOnlineCourse.course_id}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, course_id: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value={0}>Select a course</option>
                  {courses.filter(c => !onlineCourses.find(oc => oc.course_id === c.course_id)).map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration (hours)
                </label>
                <input
                  type="number"
                  value={newOnlineCourse.estimated_duration_hours}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, estimated_duration_hours: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={newOnlineCourse.difficulty_level}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, difficulty_level: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Watermark Text (Optional)
                </label>
                <input
                  type="text"
                  value={newOnlineCourse.watermark_text}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, watermark_text: e.target.value }))}
                  placeholder="Custom watermark text"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="copy_protection"
                  checked={newOnlineCourse.copy_protection_enabled}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, copy_protection_enabled: e.target.checked }))}
                />
                <label htmlFor="copy_protection" className="text-sm text-gray-700">
                  Enable copy protection (recommended)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="completion_certificate"
                  checked={newOnlineCourse.completion_certificate}
                  onChange={(e) => setNewOnlineCourse(prev => ({ ...prev, completion_certificate: e.target.checked }))}
                />
                <label htmlFor="completion_certificate" className="text-sm text-gray-700">
                  Issue completion certificate
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={createOnlineCourse}
                disabled={loading || newOnlineCourse.course_id === 0}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Lesson</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Order
                  </label>
                  <input
                    type="number"
                    value={newLesson.lesson_order}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, lesson_order: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    value={newLesson.content_type}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, content_type: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="video">Video</option>
                    <option value="text">Text Content</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
              </div>

              {newLesson.content_type === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL (Google Drive Share Link)
                    </label>
                    <input
                      type="text"
                      value={newLesson.video_url}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Share your video on Google Drive and paste the share link here
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={newLesson.video_duration_minutes}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, video_duration_minutes: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </>
              )}

              {newLesson.content_type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Content
                  </label>
                  <textarea
                    value={newLesson.text_content}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, text_content: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_preview"
                  checked={newLesson.is_preview}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, is_preview: e.target.checked }))}
                />
                <label htmlFor="is_preview" className="text-sm text-gray-700">
                  Allow preview without enrollment
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowLessonModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={createLesson}
                disabled={loading || !newLesson.title}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Lesson'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  )
}