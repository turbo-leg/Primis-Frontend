'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Navigation } from '@/components/navigation';
import PrimisLogo from '@/components/PrimisLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollAnimation from '@/components/ScrollAnimation';
import { BookOpen, Users, Award, Globe, GraduationCap, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-primis-navy dark:bg-primis-navy-dark text-white py-24 sm:py-32 md:py-40 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 opacity-20">
            {/* Placeholder for user to replace */}
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            <span className="text-white text-xl">Add background: /public/images/about-hero-bg.jpg</span>
            </div>
            {/* Uncomment when image is added:
            <Image
            src="/images/about-hero-bg.jpg"
            alt="About Hero Background"
            fill
            className="object-cover"
            priority
            />
            */}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <div className="mb-6 sm:mb-8">
                <PrimisLogo variant="light" size="lg" showTagline={false} />
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.3}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white mb-4 sm:mb-6 px-4">
                {t('home.about.title')}
              </h1>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.5}>
              <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed px-4">
                {t('home.hero.title')}
              </p>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-gray-50 dark:bg-primis-navy-light py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slide-right">
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                {/* Placeholder for user to replace */}
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  <span className="text-lg">Add image: /public/images/mission.jpg</span>
                </div>
                {/* Uncomment when image is added:
                <Image 
                  src="/images/mission.jpg" 
                  alt="Our Mission" 
                  fill 
                  className="object-cover"
                />
                */}
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-left">
              <Card className="border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl font-serif font-light text-primis-navy dark:text-white mb-4">
                    {t('home.about.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 leading-relaxed font-light">
                    {t('home.about.description')}
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white dark:bg-primis-navy py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <ScrollAnimation animation="fade-up">
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-primis-navy dark:text-white mb-3 sm:mb-4 px-4">
                {t('home.services.title')}
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.2}>
              <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 font-light px-4">
                {t('home.features.subtitle')}
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <Card className="text-center border-0 bg-gray-50 dark:bg-primis-navy-light dark:border dark:border-white/10 hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-6">
                  <div className="bg-primis-navy/5 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="h-8 w-8 text-primis-navy dark:text-white" />
                  </div>
                  <CardTitle className="text-xl font-serif text-primis-navy dark:text-white">
                    {t('home.services.scholarship.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 dark:text-white/60 font-light leading-relaxed">
                    {t('home.services.scholarship.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.2}>
              <Card className="text-center border-0 bg-gray-50 dark:bg-primis-navy-light dark:border dark:border-white/10 hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-6">
                  <div className="bg-primis-navy/5 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-8 w-8 text-primis-navy dark:text-white" />
                  </div>
                  <CardTitle className="text-xl font-serif text-primis-navy dark:text-white">
                    {t('home.services.curriculum.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 dark:text-white/60 font-light leading-relaxed">
                    {t('home.services.curriculum.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.3}>
              <Card className="text-center border-0 bg-gray-50 dark:bg-primis-navy-light dark:border dark:border-white/10 hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-6">
                  <div className="bg-primis-navy/5 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-primis-navy dark:text-white" />
                  </div>
                  <CardTitle className="text-xl font-serif text-primis-navy dark:text-white">
                    {t('home.programs.corporate.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 dark:text-white/60 font-light leading-relaxed">
                    {t('home.programs.corporate.subtitle')}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="relative bg-primis-navy dark:bg-primis-navy-dark py-24 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 opacity-10">
            {/* Placeholder for user to replace */}
            <div className="w-full h-full bg-gray-500 flex items-center justify-center">
            <span className="text-white text-xl">Add background: /public/images/achievements-bg.jpg</span>
            </div>
            {/* Uncomment when image is added:
            <Image
            src="/images/achievements-bg.jpg"
            alt="Achievements Background"
            fill
            className="object-cover"
            />
            */}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollAnimation animation="fade-up">
              <h2 className="text-4xl font-serif font-light text-white mb-4">
                {t('news.categories.achievements')}
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.2}>
              <p className="text-lg text-white/70 font-light">
                {t('home.stats.title')}
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <ScrollAnimation animation="scale-up" delay={0.1}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-5xl font-serif text-white mb-3">2,300+</div>
                <div className="text-white/60 font-light">{t('home.stats.activeStudents')}</div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="scale-up" delay={0.2}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-5xl font-serif text-white mb-3">$150K-$460K</div>
                <div className="text-white/60 font-light">{t('news.categories.scholarships')}</div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Universities Section */}
      <div className="bg-white dark:bg-primis-navy py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollAnimation animation="fade-up">
              <h2 className="text-4xl font-serif font-light text-primis-navy dark:text-white mb-4">
                {t('home.programs.collegePrep.universitiesTitle')}
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.2}>
              <p className="text-lg text-gray-600 dark:text-white/70 font-light">
                {t('home.services.scholarship.title')}
              </p>
            </ScrollAnimation>
          </div>

          <ScrollAnimation animation="fade-up" delay={0.3}>
            <Card className="max-w-4xl mx-auto border-0 bg-gray-50 dark:bg-primis-navy-light dark:border dark:border-white/10 shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.values(t.raw('home.programs.collegePrep.universities')).map((university: any) => (
                    <div key={university} className="flex items-center space-x-3 p-3 bg-white dark:bg-primis-navy/50 rounded-lg">
                      <div className="w-2 h-2 bg-primis-navy dark:bg-white rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-white/70 font-light">{university}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primis-navy dark:bg-primis-navy-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <PrimisLogo variant="light" size="sm" showTagline={true} />
            </div>
            <p className="text-white/70 mb-4 font-light">
              Excellence in College Preparation
            </p>
            <p className="text-sm text-white/50 font-light">
              © 2025 PRIMIS EDUCARE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
