'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { useTranslations, useLocale } from 'next-intl';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, Search } from 'lucide-react';

interface MediaFile {
  url: string;
  type: 'image' | 'video';
  public_id?: string;
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

const categories = [
  'all',
  'general',
  'academic',
  'events',
  'achievements',
  'scholarships',
  'campus_life',
  'technology',
  'announcements'
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategory === 'all'
        ? `${process.env.NEXT_PUBLIC_API_URL || 'https://primis-full-stack.onrender.com'}/api/v1/news/?published_only=true`
        : `${process.env.NEXT_PUBLIC_API_URL || 'https://primis-full-stack.onrender.com'}/api/v1/news/category/${selectedCategory}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchNews();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://primis-full-stack.onrender.com'}/api/v1/news/search/query?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error('Failed to search news');
      
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error searching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-primis-navy dark:text-white mb-4">
            {t('news.title') || 'News & Updates'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 font-light">
            {t('news.subtitle') || 'Stay informed with the latest news and announcements'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('news.searchPlaceholder') || 'Search news...'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-primis-navy-light text-primis-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primis-navy dark:focus:ring-white"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-primis-navy dark:bg-white text-white dark:text-primis-navy hover:bg-primis-navy/90"
            >
              {t('news.search') || 'Search'}
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 justify-center min-w-max mx-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primis-navy dark:bg-white text-white dark:text-primis-navy'
                    : 'bg-gray-100 dark:bg-primis-navy-light text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-primis-navy-dark'
                }`}
              >
                {t(`news.categories.${category}`) || category.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-primis-navy-light h-48 rounded-t-lg"></div>
                <div className="bg-white dark:bg-primis-navy p-6 rounded-b-lg">
                  <div className="h-4 bg-gray-200 dark:bg-primis-navy-light rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-primis-navy-light rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-primis-navy-light rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-white/60 text-lg">
              {t('news.noResults') || 'No news articles found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link key={item.news_id} href={`/${locale}/news/${item.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-primis-navy border-0 dark:border dark:border-white/10">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 dark:bg-primis-navy-light rounded-t-lg overflow-hidden">
                    {(item.featured_image || item.media_files?.[0]?.url) ? (
                      <CldImage
                        src={
                          item.featured_image?.includes('cloudinary')
                            ? item.featured_image.split('/upload/')[1]
                            : item.featured_image || item.media_files![0].url
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primis-navy/10 dark:bg-white/10">
                        <span className="text-4xl">📰</span>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-3 py-1 text-xs font-medium bg-white/90 dark:bg-primis-navy/90 text-primis-navy dark:text-white rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-serif text-primis-navy dark:text-white line-clamp-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-white/60 mb-4 line-clamp-2 font-light">
                      {item.summary}
                    </CardDescription>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-white/50">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="line-clamp-1">{item.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(item.published_at).toLocaleDateString(locale, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views_count}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
