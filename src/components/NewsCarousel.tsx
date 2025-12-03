'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import 'next-cloudinary/dist/cld-video-player.css';

interface MediaFile {
  url: string;
  type: 'image' | 'video';
  public_id?: string;
  resource_type?: string;
}

interface NewsItem {
  news_id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  author_name: string;
  featured_image?: string;
  media_files?: MediaFile[];
  published_at: string;
  views_count: number;
}

interface NewsCarouselProps {
  autoPlayInterval?: number;
}

export default function NewsCarousel({ autoPlayInterval = 5000 }: NewsCarouselProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  useEffect(() => {
    if (!isPaused && news.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isPaused, news.length, autoPlayInterval]);

  const fetchFeaturedNews = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://primis-full-stack.onrender.com'}/api/v1/news/featured?limit=5`
      );
      
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching featured news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-primis-navy-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-primis-navy rounded w-1/4 mx-auto mb-8"></div>
            <div className="bg-white dark:bg-primis-navy rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!news.length) {
    return null;
  }

  const currentNews = news[currentIndex];
  const displayImage = currentNews.featured_image || currentNews.media_files?.[0]?.url;

  return (
    <section className="bg-gray-50 dark:bg-primis-navy-light py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-primis-navy dark:text-white mb-2 sm:mb-3">
            {t('news.featuredTitle') || 'Latest News'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 font-light">
            {t('news.featuredSubtitle') || 'Stay updated with our latest announcements and events'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-white dark:bg-primis-navy rounded-lg shadow-xl overflow-hidden">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image/Video Section */}
            <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-900">
              {displayImage && (
                <>
                  {currentNews.media_files?.[0]?.type === 'video' ? (
                    <div className="w-full h-full">
                      <CldVideoPlayer
                        width="1920"
                        height="1080"
                        src={currentNews.media_files[0].public_id || displayImage}
                        colors={{
                          accent: '#0F172A',
                          base: '#000000',
                          text: '#FFFFFF'
                        }}
                      />
                    </div>
                  ) : (
                    <CldImage
                      src={currentNews.featured_image?.includes('cloudinary') 
                        ? currentNews.featured_image.split('/upload/')[1] 
                        : displayImage}
                      alt={currentNews.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </>
              )}
              
              {/* Navigation Arrows */}
              {news.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-primis-navy/80 hover:bg-white dark:hover:bg-primis-navy p-2 rounded-full transition-all"
                    aria-label="Previous news"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primis-navy dark:text-white" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-primis-navy/80 hover:bg-white dark:hover:bg-primis-navy p-2 rounded-full transition-all"
                    aria-label="Next news"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primis-navy dark:text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Text Content Section */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primis-navy/10 dark:bg-white/10 text-primis-navy dark:text-white rounded-full">
                    {currentNews.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-primis-navy dark:text-white mb-4 line-clamp-2">
                  {currentNews.title}
                </h3>

                {/* Summary */}
                <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 mb-6 line-clamp-3 font-light">
                  {currentNews.summary}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-white/50 mb-6">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{currentNews.author_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(currentNews.published_at).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Read More Button */}
              <div>
                <Link href={`/${locale}/news/${currentNews.slug}`}>
                  <Button 
                    className="w-full sm:w-auto bg-primis-navy dark:bg-white text-white dark:text-primis-navy hover:bg-primis-navy/90 dark:hover:bg-white/90"
                  >
                    {t('news.readMore') || 'Read Full Article'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          {news.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 lg:left-1/4">
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primis-navy dark:bg-white w-8'
                      : 'bg-gray-400 dark:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All News Link */}
        <div className="text-center mt-8">
          <Link 
            href={`/${locale}/news`}
            className="text-primis-navy dark:text-white hover:underline font-medium text-sm sm:text-base"
          >
            {t('news.viewAll') || 'View All News →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
