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
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import PrimisLogo from '@/components/PrimisLogo'
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, User, Phone, Calendar } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  parentEmail: z.string().email('Please enter a valid parent email address').optional(),
  parentPhone: z.string().optional(),
  userType: z.enum(['student', 'teacher'], {
    required_error: 'Please select a user type',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // If student, parent email and phone are required
  if (data.userType === 'student') {
    return data.parentEmail && data.parentPhone;
  }
  return true;
}, {
  message: "Parent email and phone are required for students",
  path: ["parentEmail"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState<'student' | 'teacher' | null>(null)
  const router = useRouter()
  const { register: registerUser } = useAuthStore()
  const t = useTranslations()

  const userTypes = [
    {
      value: 'student' as const,
      label: t('auth.student'),
      description: t('auth.studentDescription'),
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      value: 'teacher' as const,
      label: t('auth.teacher'),
      description: t('auth.teacherDescription'),
      color: 'bg-green-100 text-green-800 border-green-200',
    },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      // Convert camelCase to snake_case for backend
      const registerData: any = {
        name: data.name,
        email: data.email,
        password: data.password,
      }
      
      // Add optional phone
      if (data.phone) {
        registerData.phone = data.phone
      }
      
      // Add parent contact info for students
      if (data.userType === 'student' && data.parentEmail && data.parentPhone) {
        registerData.parent_email = data.parentEmail
        registerData.parent_phone = data.parentPhone
      }
      
      console.log('Sending registration data:', registerData)
      await registerUser(registerData)
      toast.success('Registration successful! Please log in to continue.')
      router.push('/login')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.detail || error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeSelect = (userType: 'student' | 'teacher') => {
    setSelectedUserType(userType)
    setValue('userType', userType)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-primis-navy dark:bg-primis-navy-dark text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 sm:mb-6">
              <PrimisLogo variant="light" size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-white mb-3 sm:mb-4 px-2 sm:px-4">
              {t('auth.registerTitle')}
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed px-2 sm:px-4">
              {t('auth.registerSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="bg-gray-50 dark:bg-primis-navy-light py-8 sm:py-12 md:py-16">
        <div className="max-w-lg mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          {/* Registration Form */}
          <Card className="shadow-xl border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10 mx-2 sm:mx-0">
            <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 sm:pt-8">
              <CardTitle className="text-xl sm:text-2xl text-center dark:text-white">{t('auth.createAccount')}</CardTitle>
              <CardDescription className="text-center dark:text-gray-300 text-sm sm:text-base">
                {t('auth.registerDescription')}
              </CardDescription>
            </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('auth.selectRole')}</label>
                <div className="grid grid-cols-1 gap-3">
                  {userTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all touch-manipulation ${
                        selectedUserType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                          : 'border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30'
                      }`}
                      onClick={() => handleUserTypeSelect(type.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium dark:text-white text-sm sm:text-base">{type.label}</span>
                            <Badge variant="outline" className={`${type.color} text-xs`}>
                              {type.label}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 pr-2">{type.description}</p>
                        </div>
                        <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0 ${
                          selectedUserType === type.value
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                            : 'border-gray-300 dark:border-white/20'
                        }`}>
                          {selectedUserType === type.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.userType && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.userType.message}</span>
                  </div>
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('auth.firstName')} {t('auth.lastName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={`${t('auth.firstName')} ${t('auth.lastName')}`}
                    className="pl-10 h-12 sm:h-10 text-base sm:text-sm dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                    {...register('name')}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.name.message}</span>
                  </div>
                )}
              </div>

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
                    className="pl-10 h-12 sm:h-10 text-base sm:text-sm dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
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

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('auth.phone')} ({t('common.optional')})
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('auth.phone')}
                    className="pl-10 h-12 sm:h-10 text-base sm:text-sm dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                    {...register('phone')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Parent Contact Fields - Only for Students */}
              {selectedUserType === 'student' && (
                <>
                  <div className="pt-4 border-t border-gray-200 dark:border-white/20">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('auth.parentContact')}</h3>
                  </div>

                  {/* Parent Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="parentEmail" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t('auth.parentEmail')} <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                      <Input
                        id="parentEmail"
                        type="email"
                        placeholder={t('auth.parentEmail')}
                        className="pl-10 h-12 sm:h-10 text-base sm:text-sm dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                        {...register('parentEmail')}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.parentEmail && (
                      <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.parentEmail.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Parent Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="parentPhone" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t('auth.parentPhone')} <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                      <Input
                        id="parentPhone"
                        type="tel"
                        placeholder={t('auth.parentPhone')}
                        className="pl-10 h-12 sm:h-10 text-base sm:text-sm dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                        {...register('parentPhone')}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.parentPhone && (
                      <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.parentPhone.message}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

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
                    className="pl-10 pr-10 h-12 sm:h-10 text-base sm:text-sm dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white p-1"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('auth.confirmPassword')}
                    className="pl-10 pr-10 h-12 sm:h-10 text-base sm:text-sm dark:bg-primis-navy/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                    {...register('confirmPassword')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white p-1"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.confirmPassword.message}</span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="rounded border-gray-300 dark:border-white/20 text-blue-600 focus:ring-blue-500 dark:bg-primis-navy/50 mt-1 w-4 h-4 flex-shrink-0"
                />
                <label className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('auth.agreeTo')} {' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    {t('auth.termsOfService')}
                  </Link>{' '}
                  {t('common.and')}{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    {t('auth.privacyPolicy')}
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 sm:h-10 text-base sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('auth.creatingAccount')}</span>
                  </div>
                ) : (
                  t('auth.register')
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-primis-navy text-gray-500 dark:text-gray-300">{t('auth.alreadyHaveAccount')}</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link href="/login">
                <Button variant="outline" className="w-full h-12 sm:h-10 text-base sm:text-sm dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                  {t('auth.signInInstead')}
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