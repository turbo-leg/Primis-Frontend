'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import PrimisLogo from '@/components/PrimisLogo'
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { getDashboardPath } from '@/utils/auth'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()
  const t = useTranslations()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const userType = await login(data.email, data.password)
      toast.success('Login successful!')
      
      // Redirect based on user type using helper function
      const redirectPath = getDashboardPath(userType)
      router.push(redirectPath)
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-primis-navy dark:bg-primis-navy-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <PrimisLogo variant="light" size="md" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-white mb-4 px-4">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed px-4">
              {t('auth.loginSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="bg-gray-50 dark:bg-primis-navy-light py-12 sm:py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">

          {/* Login Form */}
          <Card className="shadow-xl border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center dark:text-white">{t('auth.signIn')}</CardTitle>
              <CardDescription className="text-center dark:text-gray-300">
                {t('auth.loginDescription')}
              </CardDescription>
            </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.email')}
                    className="pl-10 dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                    {...register('email')}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    className="pl-10 pr-10 dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-white/20 text-blue-600 focus:ring-blue-500 dark:bg-primis-navy/50"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('auth.rememberMe')}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('common.loading')}</span>
                  </div>
                ) : (
                  t('auth.signIn')
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-primis-navy text-gray-500 dark:text-gray-300">{t('auth.dontHaveAccount')}</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link href="/register">
                <Button variant="outline" className="w-full dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                  {t('auth.createAccount')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            ← {t('nav.backToHome')}
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}