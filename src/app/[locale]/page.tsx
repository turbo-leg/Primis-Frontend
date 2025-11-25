'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import AuthRedirect from '@/components/AuthRedirect'
import PrimisLogo from '@/components/PrimisLogo'
import NewsCarousel from '@/components/NewsCarousel'
import ScrollAnimation from '@/components/ScrollAnimation'
import VideoShowcase from '@/components/VideoShowcase'
import TechHero from '@/components/TechHero'
import CollegePrepSection from '@/components/CollegePrepSection'
import { BookOpen, Users, Calendar, BarChart, GraduationCap, Clock, Award, TrendingUp } from 'lucide-react'



export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  
  const promoVideos = [
    {
      id: '1',
      src: '/videos/river-tower.mp4',
      title: t('home.videoShowcase.videos.riverTower')
    },
    {
      id: '2',
      src: '/videos/winter-prep.mp4',
      title: t('home.videoShowcase.videos.winterPrep')
    },
    {
      id: '3',
      src: '/videos/career-guidance.mp4',
      title: t('home.videoShowcase.videos.careerGuidance')
    },
    {
      id: '4',
      src: '/videos/student-testimonial-erdene.mp4',
      title: t('home.videoShowcase.videos.studentTestimonial')
    }
  ];

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
      <TechHero />

      {/* About Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-primis-navy overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slide-right">
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/about-us.jpg" 
                  alt="About Primis" 
                  fill 
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="slide-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-primis-navy dark:text-white mb-6">
                  {t('home.about.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-white/80 leading-relaxed">
                  {t('home.about.description')}
                </p>
                <div className="mt-8">
                  <Link href="/about">
                    <Button variant="outline" className="border-primis-navy text-primis-navy hover:bg-primis-navy hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primis-navy">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="bg-gray-50 dark:bg-primis-navy-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollAnimation animation="fade-up">
              <h2 className="text-3xl md:text-4xl font-serif text-primis-navy dark:text-white mb-4">
                {t('home.services.title')}
              </h2>
            </ScrollAnimation>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <Card className="h-full hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy">
                <CardHeader>
                  <div className="bg-primis-navy/5 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="h-8 w-8 text-primis-navy dark:text-white" />
                  </div>
                  <CardTitle className="text-xl text-center font-serif text-primis-navy dark:text-white">
                    {t('home.services.scholarship.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 dark:text-white/60">
                    {t('home.services.scholarship.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.2}>
              <Card className="h-full hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy">
                <CardHeader>
                  <div className="bg-primis-navy/5 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-8 w-8 text-primis-navy dark:text-white" />
                  </div>
                  <CardTitle className="text-xl text-center font-serif text-primis-navy dark:text-white">
                    {t('home.services.curriculum.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 dark:text-white/60">
                    {t('home.services.curriculum.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.3}>
              <Card className="h-full hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy">
                <CardHeader>
                  <div className="bg-primis-navy/5 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-primis-navy dark:text-white" />
                  </div>
                  <CardTitle className="text-xl text-center font-serif text-primis-navy dark:text-white">
                    {t('home.services.teachers.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 dark:text-white/60">
                    {t('home.services.teachers.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>

        {/* College Prep Section */}
        <CollegePrepSection />

      {/* Corporate Training Section */}
      <section className="py-16 bg-gray-50 dark:bg-primis-navy-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <ScrollAnimation animation="fade-up">
              <h3 className="text-3xl font-serif text-primis-navy dark:text-white mb-4">
                {t('home.programs.corporate.title')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-white/70">
                {t('home.programs.corporate.subtitle')}
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <ScrollAnimation animation="slide-right">
               <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/corporate-training.jpg" 
                  alt="Corporate Training" 
                  fill 
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>

            {/* Content Side */}
            <div className="space-y-8">
              <ScrollAnimation animation="slide-left" delay={0.1}>
                <Card className="h-full border-l-4 border-l-primis-gold">
                  <CardHeader>
                    <CardTitle>{t('home.programs.corporate.clientsTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2">
                      {Object.values(t.raw('home.programs.corporate.clients')).map((client: any, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primis-gold rounded-full" />
                          {client}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollAnimation>

              <ScrollAnimation animation="slide-left" delay={0.2}>
                <Card className="h-full border-l-4 border-l-primis-navy">
                  <CardHeader>
                    <CardTitle>{t('home.programs.corporate.benefitsTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Object.values(t.raw('home.programs.corporate.benefits')).map((benefit: any, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primis-navy rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-primis-navy">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <ScrollAnimation animation="fade-up">
              <h3 className="text-3xl font-serif text-primis-navy dark:text-white">
                {t('home.team.title')}
              </h3>
            </ScrollAnimation>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.values(t.raw('home.team.members')).map((member: any, i) => (
              <ScrollAnimation key={i} animation="fade-up" delay={i * 0.1}>
                <Card className="text-center hover:shadow-lg transition-all overflow-hidden group">
                  <div className="relative w-full aspect-square bg-gray-100 dark:bg-white/5">
                    <Image 
                      src={`/images/${member.image}`}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="pt-6">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50 dark:bg-primis-navy-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollAnimation animation="fade-up">
              <h3 className="text-3xl font-serif text-primis-navy dark:text-white">
                {t('home.process.title')}
              </h3>
            </ScrollAnimation>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(t.raw('home.process.steps')).map((step: any, i) => (
              <ScrollAnimation key={i} animation="fade-up" delay={i * 0.1}>
                <Card className="h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primis-gold" />
                  <CardHeader>
                    <div className="text-4xl font-serif text-primis-navy/10 dark:text-white/10 absolute top-4 right-4">
                      {i + 1}
                    </div>
                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70">{step.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* HSK Section */}
      <section className="py-16 bg-white dark:bg-primis-navy">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <ScrollAnimation animation="fade-up">
              <h3 className="text-3xl font-serif text-primis-navy dark:text-white mb-4">
                {t('home.hsk.title')}
              </h3>
              <p className="max-w-3xl mx-auto text-gray-600 dark:text-white/70">
                {t('home.hsk.description')}
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(t.raw('home.hsk.levels')).map((level: any, i) => (
              <ScrollAnimation key={i} animation="fade-up" delay={i * 0.1}>
                <Card className="h-full border-t-4 border-t-primis-navy">
                  <CardHeader>
                    <CardTitle className="text-lg">{level.level}</CardTitle>
                    <CardDescription>
                      {level.duration} • {level.hours}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-white/70">{level.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-primis-navy-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollAnimation animation="slide-right">
              <Card className="h-full border-2 border-primis-navy">
                <CardHeader className="text-center bg-primis-navy text-white py-8">
                  <CardTitle className="text-2xl">{t('home.pricing.businessChinese.title')}</CardTitle>
                  <CardDescription className="text-white/80 mt-2">{t('home.pricing.businessChinese.note')}</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    {Object.values(t.raw('home.pricing.businessChinese.prices')).map((price: any, i) => (
                      <div key={i} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">{price.students} students</span>
                        <span className="text-xl font-bold text-primis-navy dark:text-white">{price.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-left">
              <Card className="h-full border-2 border-primis-navy">
                <CardHeader className="text-center bg-primis-navy text-white py-8">
                  <CardTitle className="text-2xl">{t('home.pricing.businessEnglish.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    {Object.values(t.raw('home.pricing.businessEnglish.prices')).map((price: any, i) => (
                      <div key={i} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">{price.students} students</span>
                        <span className="text-xl font-bold text-primis-navy dark:text-white">{price.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <ScrollAnimation animation="fade-up">
        <VideoShowcase 
          videos={promoVideos}
          title={t('home.videoShowcase.title')}
          subtitle={t('home.videoShowcase.subtitle')}
        />
      </ScrollAnimation>

      {/* User Roles Section */}
      <div className="bg-primis-navy/5 dark:bg-primis-navy-dark py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <ScrollAnimation animation="fade-up">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-primis-navy dark:text-white mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4">
                {t('home.roles.title')}
              </h3>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.2}>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-white/70 font-light px-2 sm:px-4">
                {t('home.roles.subtitle')}
              </p>
            </ScrollAnimation>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <Card className="bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10 hover:shadow-xl transition-all p-4 sm:p-6 h-full">
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
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.2}>
              <Card className="bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10 hover:shadow-xl transition-all p-4 sm:p-6 h-full">
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
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={0.3}>
              <Card className="bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10 hover:shadow-xl transition-all p-4 sm:p-6 h-full">
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
            </ScrollAnimation>
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

            {/* Location Info */}
            <div className="mb-8 text-white/80">
              <h4 className="font-serif text-lg mb-2">{t('home.location.title')}</h4>
              <p>{t('home.location.address')}</p>
              <p className="text-sm text-white/60">{t('home.location.rooms')}</p>
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