'use client';

import { useTranslations } from 'next-intl';
import { Navigation } from '@/components/navigation';
import AuthRedirect from '@/components/AuthRedirect';
import VideoShowcase from '@/components/VideoShowcase';
import ScrollAnimation from '@/components/ScrollAnimation';
import { PlayCircle, HelpCircle } from 'lucide-react';

export default function TutorialsPage() {
  const t = useTranslations();

  // Placeholder videos - in a real app these would come from a CMS or config
  // Using the existing videos as placeholders for now
  const gettingStartedVideos = [
    {
      id: 'tour-1',
      src: '/videos/river-tower.mp4', // Placeholder
      title: t('tutorials.videos.websiteTour.title'),
      subtitle: t('tutorials.videos.websiteTour.description')
    },
    {
      id: 'reg-1',
      src: '/videos/winter-prep.mp4', // Placeholder
      title: t('tutorials.videos.registration.title'),
      subtitle: t('tutorials.videos.registration.description')
    },
    {
      id: 'dash-1',
      src: '/videos/career-guidance.mp4', // Placeholder
      title: t('tutorials.videos.dashboard.title'),
      subtitle: t('tutorials.videos.dashboard.description')
    }
  ];

  const studentVideos = [
    {
      id: 'enroll-1',
      src: '/videos/career-guidance.mp4', // Placeholder
      title: t('tutorials.videos.enrollment.title'),
      subtitle: t('tutorials.videos.enrollment.description')
    },
    {
      id: 'pay-1',
      src: '/videos/student-testimonial-erdene.mp4', // Placeholder
      title: t('tutorials.videos.payments.title'),
      subtitle: t('tutorials.videos.payments.description')
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <AuthRedirect />
      <Navigation />

      {/* Hero Section */}
      <div className="bg-primis-navy dark:bg-primis-navy-dark text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation animation="fade-up">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6">
              {t('tutorials.title')}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto font-light">
              {t('tutorials.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="py-12">
        <ScrollAnimation animation="fade-up">
          <VideoShowcase 
            videos={gettingStartedVideos}
            title={t('tutorials.categories.gettingStarted')}
            subtitle="Essential guides for new users"
          />
        </ScrollAnimation>
      </div>

      {/* Student Guides Section */}
      <div className="py-12 bg-gray-50 dark:bg-primis-navy-light">
        <ScrollAnimation animation="fade-up">
          <VideoShowcase 
            videos={studentVideos}
            title={t('tutorials.categories.students')}
            subtitle="Everything you need to know about your student account"
          />
        </ScrollAnimation>
      </div>

      {/* Footer Call to Action */}
      <div className="py-16 bg-white dark:bg-primis-navy">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif text-primis-navy dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-white/70 mb-8">
            Our support team is here to help you with any issues you might encounter.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primis-navy hover:bg-primis-navy-light transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
