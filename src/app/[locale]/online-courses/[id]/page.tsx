'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import ProtectedVideoPlayer from '@/components/ProtectedVideoPlayer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  BookOpen,
  Award,
  Eye,
  ArrowLeft,
  ArrowRight,
  BarChart3
} from 'lucide-react'

interface OnlineCourse {
  online_course_id: number
  course_id: number
  total_lessons: number
  estimated_duration_hours: number
  difficulty_level: string
  completion_certificate: boolean
  passing_score_percentage: number
}

interface OnlineLesson {
  lesson_id: number
  title: string
  description: string
  lesson_order: number
  video_duration_minutes: number
  content_type: string
  is_preview: boolean
  text_content: string
}

interface StudentProgress {
  progress_id: number
  lessons_completed: number
  total_time_spent_minutes: number
  completion_percentage: number
  current_lesson_id: number
  status: string
  certificate_issued: boolean
  final_score: number
}

interface LessonProgress {
  lesson_progress_id: number
  lesson_id: number
  status: string
  progress_percentage: number
  time_spent_minutes: number
  last_position_seconds: number
  quiz_score: number
  completed_at: string
}

export default function OnlineCourseViewerPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const { user } = useAuthStore()
  const courseId = parseInt(params.id as string)
  
  const [onlineCourse, setOnlineCourse] = useState<OnlineCourse | null>(null)
  const [lessons, setLessons] = useState<OnlineLesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<OnlineLesson | null>(null)
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null)
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      
      // Fetch online course details
      const courseData = await apiClient.get(`/api/v1/online-courses/${courseId}`)
      setOnlineCourse(courseData)
      
      // Fetch lessons
      const lessonsData = await apiClient.get(`/api/v1/online-courses/${courseId}/lessons`)
      setLessons(lessonsData)
      
      // Fetch student progress
      if (user && 'student_id' in user) {
        const progressData = await apiClient.get(`/api/v1/online-courses/student/${user.student_id}/progress/${courseId}`)
        setStudentProgress(progressData)
        
        // Set current lesson if not completed
        if (progressData.current_lesson_id) {
          const currentLessonData = lessonsData.find((l: OnlineLesson) => l.lesson_id === progressData.current_lesson_id)
          setCurrentLesson(currentLessonData || lessonsData[0])
        } else {
          setCurrentLesson(lessonsData[0])
        }
      }
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const getLessonStatus = (lesson: OnlineLesson) => {
    const progress = lessonProgress.find(p => p.lesson_id === lesson.lesson_id)
    if (!progress) return 'not_started'
    return progress.status
  }

  const isLessonAccessible = (lesson: OnlineLesson) => {
    // Preview lessons are always accessible
    if (lesson.is_preview) return true
    
    // Check if student is enrolled and paid
    // This would typically be checked on the backend
    return true // For now, assume accessible
  }

  const startLesson = (lesson: OnlineLesson) => {
    if (!isLessonAccessible(lesson)) {
      setError('You need to enroll and pay for this course to access this lesson')
      return
    }
    
    setCurrentLesson(lesson)
    if (lesson.content_type === 'video') {
      setShowVideoPlayer(true)
    }
  }

  const onProgressUpdate = (progress: number, timeSpent: number) => {
    // Update local progress state
    if (studentProgress) {
      setStudentProgress(prev => prev ? {
        ...prev,
        total_time_spent_minutes: prev.total_time_spent_minutes + Math.floor(timeSpent / 60)
      } : null)
    }
  }

  const onLessonComplete = () => {
    // Refresh progress data
    fetchCourseData()
  }

  const getNextLesson = () => {
    if (!currentLesson || !lessons.length) return null
    const currentIndex = lessons.findIndex(l => l.lesson_id === currentLesson.lesson_id)
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  }

  const getPreviousLesson = () => {
    if (!currentLesson || !lessons.length) return null
    const currentIndex = lessons.findIndex(l => l.lesson_id === currentLesson.lesson_id)
    return currentIndex > 0 ? lessons[currentIndex - 1] : null
  }

  const getDifficultyBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
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

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Online Course</h1>
            {onlineCourse && (
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getDifficultyBadgeColor(onlineCourse.difficulty_level)}>
                  {onlineCourse.difficulty_level}
                </Badge>
                <span className="text-gray-600">
                  {onlineCourse.total_lessons} lessons • {onlineCourse.estimated_duration_hours}h total
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {studentProgress ? (
                  <div className="space-y-4">
                    {/* Progress Circle */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2.51 * studentProgress.completion_percentage} 251`}
                            className="text-blue-600"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">
                            {Math.round(studentProgress.completion_percentage)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lessons Completed:</span>
                        <span className="font-medium">{studentProgress.lessons_completed}/{onlineCourse?.total_lessons}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Spent:</span>
                        <span className="font-medium">{Math.floor(studentProgress.total_time_spent_minutes / 60)}h {studentProgress.total_time_spent_minutes % 60}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={studentProgress.status === 'completed' ? 'default' : 'outline'}>
                          {studentProgress.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Certificate */}
                    {studentProgress.certificate_issued && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Award className="h-4 w-4" />
                          <span className="text-sm font-medium">Certificate Earned!</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Start learning to see your progress</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentLesson && showVideoPlayer && currentLesson.content_type === 'video' ? (
              <div className="space-y-6">
                {/* Video Player */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{currentLesson.title}</CardTitle>
                        <CardDescription>{currentLesson.description}</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowVideoPlayer(false)}
                      >
                        Show Lessons
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProtectedVideoPlayer
                      lessonId={currentLesson.lesson_id}
                      onProgressUpdate={onProgressUpdate}
                      onComplete={onLessonComplete}
                    />
                  </CardContent>
                </Card>

                {/* Lesson Navigation */}
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const prevLesson = getPreviousLesson()
                      if (prevLesson) startLesson(prevLesson)
                    }}
                    disabled={!getPreviousLesson()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      const nextLesson = getNextLesson()
                      if (nextLesson) startLesson(nextLesson)
                    }}
                    disabled={!getNextLesson()}
                  >
                    Next Lesson
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Lessons List */
              <Card>
                <CardHeader>
                  <CardTitle>Course Lessons</CardTitle>
                  <CardDescription>Choose a lesson to start learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessons.map((lesson) => {
                      const status = getLessonStatus(lesson)
                      const isAccessible = isLessonAccessible(lesson)
                      
                      return (
                        <div
                          key={lesson.lesson_id}
                          className={`p-4 border rounded-lg transition-all ${
                            isAccessible 
                              ? 'hover:bg-gray-50 cursor-pointer' 
                              : 'opacity-60 cursor-not-allowed'
                          } ${
                            currentLesson?.lesson_id === lesson.lesson_id
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                          onClick={() => isAccessible && startLesson(lesson)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold">
                                {lesson.lesson_order}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                                  {getStatusIcon(status)}
                                  {lesson.is_preview && (
                                    <Badge variant="outline" className="text-xs">
                                      <Eye className="h-3 w-3 mr-1" />
                                      Preview
                                    </Badge>
                                  )}
                                  {!isAccessible && (
                                    <Lock className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{lesson.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {lesson.video_duration_minutes && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  {lesson.video_duration_minutes}min
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                {lesson.content_type === 'video' && <Play className="h-4 w-4" />}
                                {lesson.content_type === 'text' && <BookOpen className="h-4 w-4" />}
                                <span className="capitalize">{lesson.content_type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}