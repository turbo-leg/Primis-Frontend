import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { AuthToken, LoginCredentials, RegisterData, UserType } from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          hasToken: !!token,
          headers: config.headers
        })
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => {
        // Check if response is HTML (likely an error page) when we expect JSON
        if (
          response.headers['content-type']?.includes('text/html') &&
          response.config.responseType !== 'text' &&
          response.config.responseType !== 'blob'
        ) {
          console.error('[API Error] Received HTML response instead of JSON:', response.config.url)
          return Promise.reject(new Error('Received HTML response instead of JSON. The server might be down or returning an error page.'))
        }
        return response
      },
      (error) => {
        console.error('[API Error] Request failed:', error.response?.status, error.config?.url)
        if (error.response?.status === 401) {
          console.warn('[API] 401 Unauthorized - Clearing session')
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_data')
          window.location.href = '/login'
        }
        // Pass through the full error object for better error handling in components
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    // Use the Next.js proxy route instead of direct backend call
    // This helps avoid CORS issues and provides better error logging on the server
    try {
      console.log('[API] Sending login request to proxy...')
      const response = await fetch('/api/proxy/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[API] Proxy login failed:', response.status, data)
        throw { response: { data, status: response.status } };
      }

      console.log('[API] Proxy login success')
      return data;
    } catch (error: any) {
      // If the proxy fails (e.g. network error), fall back to direct call or rethrow
      if (error.response) {
        throw error; // It was a valid error response from the proxy
      }
      
      console.warn('Proxy login failed, falling back to direct API call', error);
      // Fallback to original direct call
      const response = await this.client.post('/api/v1/auth/login', credentials);
      return response.data;
    }
  }

  async register(data: RegisterData, userType: UserType = 'student'): Promise<any> {
    const endpoint = `/api/v1/auth/register/${userType}`
    const response = await this.client.post(endpoint, data)
    return response.data
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get('/api/v1/auth/me')
    return response.data
  }

  async logout(): Promise<void> {
    await this.client.post('/api/v1/auth/logout')
  }

  // Course endpoints
  async getCourses(params?: any): Promise<any> {
    const response = await this.client.get('/api/v1/courses', { params })
    return response.data
  }

  async getCourse(id: number): Promise<any> {
    const response = await this.client.get(`/api/v1/courses/${id}`)
    return response.data
  }

  async createCourse(data: any): Promise<any> {
    const response = await this.client.post('/api/v1/courses', data)
    return response.data
  }

  async updateCourse(id: number, data: any): Promise<any> {
    const response = await this.client.put(`/api/v1/courses/${id}`, data)
    return response.data
  }

  async deleteCourse(id: number): Promise<void> {
    await this.client.delete(`/api/v1/courses/${id}`)
  }

  async enrollInCourse(courseId: number): Promise<any> {
    const response = await this.client.post(`/api/v1/courses/${courseId}/enroll`)
    return response.data
  }

  async getMyCourses(): Promise<any> {
    const response = await this.client.get('/api/v1/courses/my-courses')
    return response.data
  }

  // Attendance endpoints
  async markAttendance(data: any): Promise<any> {
    const response = await this.client.post('/api/v1/attendance/mark', data)
    return response.data
  }

  async scanQRAttendance(data: any): Promise<any> {
    const response = await this.client.post('/api/v1/attendance/scan-qr', data)
    return response.data
  }

  async getCourseAttendance(courseId: number, date?: string): Promise<any> {
    const params = date ? { attendance_date: date } : {}
    const response = await this.client.get(`/api/v1/attendance/course/${courseId}`, { params })
    return response.data
  }

  async getStudentAttendance(studentId: number, courseId?: number): Promise<any> {
    const params = courseId ? { course_id: courseId } : {}
    const response = await this.client.get(`/api/v1/attendance/student/${studentId}`, { params })
    return response.data
  }

  async getAttendanceStats(studentId: number, courseId?: number): Promise<any> {
    const params = courseId ? { course_id: courseId } : {}
    const response = await this.client.get(`/api/v1/attendance/student/${studentId}/stats`, { params })
    return response.data
  }

  async getMonthlyAttendanceReport(studentId: number, year?: number, month?: number): Promise<any> {
    const params: any = {}
    if (year) params.year = year
    if (month) params.month = month
    const response = await this.client.get(`/api/v1/attendance/student/${studentId}/monthly-report`, { params })
    return response.data
  }

  async generateAttendanceQR(courseId: number, date: string): Promise<any> {
    const response = await this.client.get(`/api/v1/attendance/generate-qr/${courseId}`, {
      params: { class_date: date }
    })
    return response.data
  }

  // News endpoints
  async getAllNews(params?: { skip?: number; limit?: number; category?: string; featured_only?: boolean; published_only?: boolean }): Promise<any> {
    const response = await this.client.get('/api/v1/news/', { params })
    return response.data
  }

  async getFeaturedNews(limit: number = 5): Promise<any> {
    const response = await this.client.get('/api/v1/news/featured', { params: { limit } })
    return response.data
  }

  async getNewsByCategory(category: string, skip: number = 0, limit: number = 20): Promise<any> {
    const response = await this.client.get(`/api/v1/news/category/${category}`, { params: { skip, limit } })
    return response.data
  }

  async getNewsBySlug(slug: string): Promise<any> {
    const response = await this.client.get(`/api/v1/news/slug/${slug}`)
    return response.data
  }

  async getNewsById(newsId: number): Promise<any> {
    const response = await this.client.get(`/api/v1/news/${newsId}`)
    return response.data
  }

  async searchNews(query: string, skip: number = 0, limit: number = 20): Promise<any> {
    const response = await this.client.get('/api/v1/news/search/query', { 
      params: { q: query, skip, limit } 
    })
    return response.data
  }

  async createNews(data: any): Promise<any> {
    const response = await this.client.post('/api/v1/news/', data)
    return response.data
  }

  async updateNews(newsId: number, data: any): Promise<any> {
    const response = await this.client.put(`/api/v1/news/${newsId}`, data)
    return response.data
  }

  async deleteNews(newsId: number): Promise<void> {
    await this.client.delete(`/api/v1/news/${newsId}`)
  }

  // Generic methods
  async get(url: string, params?: any): Promise<any> {
    try {
      const response = await this.client.get(url, { params })
      return response.data
    } catch (error: any) {
      console.error(`Failed to fetch ${url}:`, error.message)
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        console.error('Backend server may not be running. Please check if the server is running at:', process.env.NEXT_PUBLIC_API_URL)
      }
      throw error
    }
  }

  async post(url: string, data?: any): Promise<any> {
    try {
      const response = await this.client.post(url, data)
      return response.data
    } catch (error: any) {
      // Pass through the full error with response data for components to handle
      throw error
    }
  }

  async put(url: string, data?: any): Promise<any> {
    const response = await this.client.put(url, data)
    return response.data
  }

  async delete(url: string): Promise<void> {
    await this.client.delete(url)
  }
}

export const apiClient = new ApiClient()