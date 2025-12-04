'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import { useTranslations, useLocale } from 'next-intl';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, User, Eye, ArrowLeft, Share2, Tag } from 'lucide-react';
import 'next-cloudinary/dist/cld-video-player.css';
import { apiClient } from '@/lib/api';

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
  content: string;
  category: string;
  author_name: string;
  featured_image?: string;
  media_files?: MediaFile[];
  published_at: string;
  views_count: number;
  tags?: string;
  created_at: string;
}

interface RelatedNewsItem {
  news_id: number;
  title: string;
  slug: string;
  summary: string;
  featured_image?: string;
  published_at: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNewsItem[]>([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    if (slug) {
      fetchNewsDetail();
    }
  }, [slug]);

  const fetchNewsDetail = async () => {
    try {
      const data = await apiClient.getNewsBySlug(slug);
      setNews(data);

      // Fetch related news
      if (data.category) {
        fetchRelatedNews(data.category, data.news_id);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedNews = async (category: string, excludeId: number) => {
    try {
      const data = await apiClient.getNewsByCategory(category, 0, 3);
      setRelatedNews(data.filter((item: RelatedNewsItem) => item.news_id !== excludeId));
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-primis-navy">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-primis-navy-light rounded w-3/4 mb-6"></div>
            <div className="h-96 bg-gray-200 dark:bg-primis-navy-light rounded mb-6"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-primis-navy-light rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-white dark:bg-primis-navy">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-serif text-primis-navy dark:text-white mb-4">
            {t('news.notFound') || 'News Article Not Found'}
          </h1>
          <Link href={`/${locale}/news`}>
            <Button className="bg-primis-navy dark:bg-white text-white dark:text-primis-navy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('news.backToNews') || 'Back to News'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const allMedia = [
    ...(news.featured_image ? [{ url: news.featured_image, type: 'image' as const }] : []),
    ...(news.media_files || [])
  ];

  const tags = news.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Link href={`/${locale}/news`} className="inline-flex items-center text-primis-navy dark:text-white hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('news.backToNews') || 'Back to News'}
        </Link>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1 text-sm font-medium bg-primis-navy/10 dark:bg-white/10 text-primis-navy dark:text-white rounded-full">
            {news.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-primis-navy dark:text-white mb-6">
          {news.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-white/60 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{news.author_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(news.published_at).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{news.views_count} {t('news.views') || 'views'}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 ml-auto hover:text-primis-navy dark:hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('news.share') || 'Share'}</span>
          </button>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 dark:bg-primis-navy-light p-6 rounded-lg mb-8">
          <p className="text-lg text-gray-700 dark:text-white/80 font-light leading-relaxed">
            {news.summary}
          </p>
        </div>

        {/* Media Gallery */}
        {allMedia.length > 0 && (
          <div className="mb-8">
            {/* Main Media Display */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ height: '500px' }}>
              {allMedia[selectedMediaIndex].type === 'video' ? (
                <CldVideoPlayer
                  width="1920"
                  height="1080"
                  src={allMedia[selectedMediaIndex].public_id || allMedia[selectedMediaIndex].url}
                  colors={{
                    accent: '#0F172A',
                    base: '#000000',
                    text: '#FFFFFF'
                  }}
                />
              ) : (
                <CldImage
                  src={
                    allMedia[selectedMediaIndex].url.includes('cloudinary')
                      ? allMedia[selectedMediaIndex].url.split('/upload/')[1]
                      : allMedia[selectedMediaIndex].url
                  }
                  alt={news.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              )}
            </div>

            {/* Thumbnail Navigation */}
            {allMedia.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMediaIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedMediaIndex
                        ? 'border-primis-navy dark:border-white'
                        : 'border-gray-300 dark:border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-white text-2xl">▶️</span>
                      </div>
                    ) : (
                      <CldImage
                        src={
                          media.url.includes('cloudinary')
                            ? media.url.split('/upload/')[1]
                            : media.url
                        }
                        alt={`Media ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-8">
          <div 
            className="text-base sm:text-lg text-gray-700 dark:text-white/80 leading-relaxed font-light whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-12 pb-8 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-600 dark:text-white/60" />
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-primis-navy-light text-gray-700 dark:text-white/70 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-primis-navy dark:text-white mb-6">
              {t('news.relatedArticles') || 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Link key={item.news_id} href={`/${locale}/news/${item.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-primis-navy-light border-0 dark:border dark:border-white/10">
                    <div className="relative h-40 bg-gray-200 dark:bg-primis-navy rounded-t-lg overflow-hidden">
                      {item.featured_image ? (
                        <CldImage
                          src={
                            item.featured_image.includes('cloudinary')
                              ? item.featured_image.split('/upload/')[1]
                              : item.featured_image
                          }
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">📰</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-serif text-primis-navy dark:text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-white/60 line-clamp-2 mb-3">
                        {item.summary}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(item.published_at).toLocaleDateString(locale, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
