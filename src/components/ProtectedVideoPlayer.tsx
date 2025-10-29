'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'
import { AlertCircle, Play, Pause, Volume2, VolumeX, Maximize, Lock, Shield } from 'lucide-react'

interface ProtectedVideoPlayerProps {
  lessonId: number
  onProgressUpdate?: (progress: number, timeSpent: number) => void
  onComplete?: () => void
}

export default function ProtectedVideoPlayer({ 
  lessonId, 
  onProgressUpdate, 
  onComplete 
}: ProtectedVideoPlayerProps) {
  const { user } = useAuthStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [watermarkText, setWatermarkText] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0)
  
  // Anti-screen recording protection
  const [deviceFingerprint, setDeviceFingerprint] = useState('')
  
  // Generate device fingerprint
  useEffect(() => {
    const generateFingerprint = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillText('Device fingerprint', 2, 2)
      }
      
      const fingerprint = btoa(JSON.stringify({
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${screen.width}x${screen.height}`,
        canvas: canvas.toDataURL(),
        timestamp: Date.now()
      }))
      
      setDeviceFingerprint(fingerprint)
    }
    
    generateFingerprint()
  }, [])

  // Initialize video session
  useEffect(() => {
    if (!deviceFingerprint || !user) return
    
    const initializeSession = async () => {
      try {
        setLoading(true)
        const response = await apiClient.post('/api/v1/online-courses/video-session', {
          lesson_id: lessonId,
          device_fingerprint: deviceFingerprint
        })
        
        setSessionToken(response.session_token)
        setVideoUrl(response.video_url)
        setWatermarkText(response.watermark_text || `Student: ${user.name}`)
        setError(null)
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load video')
      } finally {
        setLoading(false)
      }
    }
    
    initializeSession()
  }, [lessonId, deviceFingerprint, user])

  // Send heartbeat every 30 seconds
  useEffect(() => {
    if (!sessionToken) return
    
    const heartbeatInterval = setInterval(async () => {
      try {
        await apiClient.post(`/api/v1/online-courses/heartbeat/${sessionToken}`)
      } catch (err) {
        console.error('Heartbeat failed:', err)
      }
    }, 30000)
    
    return () => clearInterval(heartbeatInterval)
  }, [sessionToken])

  // Update progress every 10 seconds
  useEffect(() => {
    if (!videoRef.current || !sessionToken) return
    
    const progressInterval = setInterval(() => {
      const video = videoRef.current
      if (!video || video.paused) return
      
      const progress = (video.currentTime / video.duration) * 100
      const timeSpent = Math.floor(video.currentTime - lastProgressUpdate)
      
      if (timeSpent >= 10) { // Only update if 10+ seconds have passed
        updateProgress(progress, timeSpent, video.currentTime)
        setLastProgressUpdate(video.currentTime)
      }
    }, 10000)
    
    return () => clearInterval(progressInterval)
  }, [sessionToken, lastProgressUpdate])

  // Clean up session on unmount
  useEffect(() => {
    return () => {
      if (sessionToken) {
        apiClient.delete(`/api/v1/online-courses/session/${sessionToken}`)
      }
    }
  }, [sessionToken])

  // Anti-recording protection
  useEffect(() => {
    const preventRecording = () => {
      // Disable right-click context menu
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault()
        return false
      }
      
      // Disable common recording shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.metaKey && e.altKey && e.key === 'I')
        ) {
          e.preventDefault()
          return false
        }
      }
      
      // Blur when window loses focus (potential screen recording)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          videoRef.current?.pause()
          setIsPlaying(false)
        }
      }
      
      // Detect if developer tools are open
      const detectDevTools = () => {
        const threshold = 160
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          videoRef.current?.pause()
          setIsPlaying(false)
          setError('Developer tools detected. Please close them to continue.')
        }
      }
      
      document.addEventListener('contextmenu', handleContextMenu)
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      const devToolsInterval = setInterval(detectDevTools, 1000)
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu)
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        clearInterval(devToolsInterval)
      }
    }
    
    return preventRecording()
  }, [])

  const updateProgress = async (progress: number, timeSpent: number, currentPosition: number) => {
    if (!sessionToken) return
    
    try {
      await apiClient.post('/api/v1/online-courses/update-progress', {
        lesson_id: lessonId,
        progress_percentage: progress,
        time_spent_seconds: timeSpent,
        last_position_seconds: Math.floor(currentPosition)
      })
      
      onProgressUpdate?.(progress, timeSpent)
      
      // Check if completed (90% watched)
      if (progress >= 90) {
        onComplete?.()
      }
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handleVolumeChange = () => {
    if (!videoRef.current) return
    setVolume(videoRef.current.volume)
    setIsMuted(videoRef.current.muted)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const seekTo = (percentage: number) => {
    if (!videoRef.current) return
    const time = (percentage / 100) * duration
    videoRef.current.currentTime = time
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p>Initializing secure video session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-red-800">
          <AlertCircle className="h-12 w-12" />
          <p className="text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Security Indicators */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <div className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Secure
        </div>
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Protected
        </div>
      </div>

      {/* Watermark */}
      {watermarkText && (
        <div className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm pointer-events-none">
          {watermarkText}
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl || ''}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onVolumeChange={handleVolumeChange}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        playsInline
      />

      {/* Custom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-gray-600 rounded mb-4 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const percentage = ((e.clientX - rect.left) / rect.width) * 100
          seekTo(percentage)
        }}>
          <div 
            className="absolute left-0 top-0 h-full bg-red-600 rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayPause}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMute}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value)
                  if (videoRef.current) {
                    videoRef.current.volume = newVolume
                  }
                }}
                className="w-20"
              />
            </div>
            
            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Anti-selection overlay */}
      <div className="absolute inset-0 pointer-events-none select-none" style={{
        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.01) 10px, rgba(255,255,255,0.01) 20px)'
      }} />
    </div>
  )
}