'use client';

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import AuthRedirect from '@/components/AuthRedirect'
import PrimisLogo from '@/components/PrimisLogo'
import { BookOpen, Users, Calendar, BarChart, GraduationCap, Clock, Award, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  
  // Debug: Check what's being loaded
  console.log('Current locale:', locale);
  console.log('Hero title translation:', t('home.hero.title'));
  
  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      {/* Auth Redirect */}
      <AuthRedirect />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="bg-primis-navy dark:bg-primis-navy-dark text-white py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 sm:mb-8 md:mb-12">
              <PrimisLogo variant="light" size="lg" showTagline={true} />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto tracking-wide px-2 sm:px-4">
              {t('home.hero.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-2 sm:px-4">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:min-w-[200px] h-12 sm:h-11 text-base sm:text-sm bg-white text-primis-navy dark:text-primis-navy-dark hover:bg-gray-100 font-medium transition-colors"
                >
                  {t('home.hero.beginJourney')}
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full sm:min-w-[200px] h-12 sm:h-11 text-base sm:text-sm border-2 border-white text-white hover:bg-white hover:text-primis-navy dark:hover:text-primis-navy-dark transition-colors"
                >
                  {t('home.hero.signIn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-primis-navy-light py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-primis-navy dark:text-white mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4">
              {t('home.features.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-white/70 font-light px-2 sm:px-4">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <Card className="text-center p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-serif text-primis-navy dark:text-white">
                  {t('home.features.courseManagement.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light">
                  {t('home.features.courseManagement.description')}
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-serif text-primis-navy dark:text-white">
                  {t('home.features.studentDashboard.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light">
                  {t('home.features.studentDashboard.description')}
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-serif text-primis-navy dark:text-white">
                  {t('home.features.smartCalendar.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light">
                  {t('home.features.smartCalendar.description')}
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BarChart className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-serif text-primis-navy dark:text-white">
                  {t('home.features.analytics.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light">
                  {t('home.features.analytics.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-primis-navy my-8 sm:my-12 md:my-16">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-primis-navy dark:text-white mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4">
              {t('home.stats.title')}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-white/70 font-light px-2 sm:px-4">
              {t('home.stats.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 p-3 sm:p-4 rounded-full">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif text-primis-navy dark:text-white mb-2 sm:mb-3">10,000+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-white/60 font-light">{t('home.stats.activeStudents')}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 p-3 sm:p-4 rounded-full">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif text-primis-navy dark:text-white mb-2 sm:mb-3">500+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-white/60 font-light">{t('home.stats.expertTeachers')}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 p-3 sm:p-4 rounded-full">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif text-primis-navy dark:text-white mb-2 sm:mb-3">200+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-white/60 font-light">{t('home.stats.availableCourses')}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                <div className="bg-primis-navy/5 dark:bg-white/10 p-3 sm:p-4 rounded-full">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primis-navy dark:text-white" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif text-primis-navy dark:text-white mb-2 sm:mb-3">95%</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-white/60 font-light">{t('home.stats.successRate')}</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-primis-navy dark:text-white mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4">
              {t('home.howItWorks.title')}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-white/70 font-light max-w-3xl mx-auto px-2 sm:px-4">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            <div className="text-center">
              <div className="bg-primis-navy dark:bg-white/20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-white text-2xl sm:text-3xl font-serif shadow-lg">
                1
              </div>
              <h4 className="text-xl sm:text-2xl font-serif text-primis-navy dark:text-white mb-4 sm:mb-6 px-2">
                {t('home.howItWorks.step1.title')}
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/60 leading-relaxed font-light px-2">
                {t('home.howItWorks.step1.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primis-navy dark:bg-white/20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-white text-2xl sm:text-3xl font-serif shadow-lg">
                2
              </div>
              <h4 className="text-xl sm:text-2xl font-serif text-primis-navy dark:text-white mb-4 sm:mb-6 px-2">
                {t('home.howItWorks.step2.title')}
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/60 leading-relaxed font-light px-2">
                {t('home.howItWorks.step2.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primis-navy dark:bg-white/20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-white text-2xl sm:text-3xl font-serif shadow-lg">
                3
              </div>
              <h4 className="text-xl sm:text-2xl font-serif text-primis-navy dark:text-white mb-4 sm:mb-6 px-2">
                {t('home.howItWorks.step3.title')}
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/60 leading-relaxed font-light px-2">
                {t('home.howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* User Roles Section */}
      <div className="bg-primis-navy/5 dark:bg-primis-navy-dark py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-primis-navy dark:text-white mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4">
              {t('home.roles.title')}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-white/70 font-light px-2 sm:px-4">
              {t('home.roles.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <Card className="bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10 hover:shadow-xl transition-all p-4 sm:p-6">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primis-navy dark:bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <CardTitle className="font-serif text-primis-navy dark:text-white text-lg sm:text-xl">
                  {t('home.roles.students.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light leading-relaxed">
                  {t('home.roles.students.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10 hover:shadow-xl transition-all p-4 sm:p-6">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primis-navy dark:bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <GraduationCap className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <CardTitle className="font-serif text-primis-navy dark:text-white text-lg sm:text-xl">
                  {t('home.roles.teachers.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light leading-relaxed">
                  {t('home.roles.teachers.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10 hover:shadow-xl transition-all p-4 sm:p-6">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primis-navy dark:bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BarChart className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <CardTitle className="font-serif text-primis-navy dark:text-white text-lg sm:text-xl">
                  {t('home.roles.admins.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light leading-relaxed">
                  {t('home.roles.admins.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10 hover:shadow-xl transition-all p-4 sm:p-6">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primis-navy dark:bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Clock className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <CardTitle className="font-serif text-primis-navy dark:text-white text-lg sm:text-xl">
                  {t('home.roles.parents.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-white/60 font-light leading-relaxed">
                  {t('home.roles.parents.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primis-navy dark:bg-primis-navy-dark text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 sm:mb-6">
              <PrimisLogo variant="light" size="sm" showTagline={true} />
            </div>
            <p className="text-white/70 mb-3 sm:mb-4 font-light text-sm sm:text-base px-2">
              {t('home.footer.tagline')}
            </p>
            <p className="text-xs sm:text-sm text-white/50 font-light px-2">
              {t('home.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}