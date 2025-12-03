'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Navigation } from '@/components/navigation';
import PrimisLogo from '@/components/PrimisLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Eye, 
  Search, 
  Newspaper,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Globe
} from 'lucide-react';

interface NewsArticle {
  news_id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author_name: string;
  featured_image: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  views_count: number;
  tags: string | null;
  created_at: string;
}

const categoryIcons: Record<string, any> = {
  general: Newspaper,
  academic: BookOpen,
  events: Calendar,
  achievements: Award,
  scholarships: TrendingUp,
  campus_life: Users,
  technology: Globe,
  announcements: GraduationCap,
};

const categoryColors: Record<string, string> = {
  general: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  academic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  events: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  achievements: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  scholarships: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  campus_life: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  technology: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  announcements: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default function NewsPage() {
  const t = useTranslations();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchNews();
    fetchFeaturedNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news?limit=50`);
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedNews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news/featured?limit=3`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedNews(data);
      }
    } catch (error) {
      console.error('Error fetching featured news:', error);
    }
  };

  const filteredNews = news.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const Icon = categoryIcons[category.toLowerCase()] || Newspaper;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-primis-navy dark:bg-primis-navy-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-white/90" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-white mb-4">
              Latest News & Updates
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto font-light">
              Stay informed about platform updates, educational insights, and success stories
            </p>
          </div>
        </div>
      </div>

      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <div className="bg-gray-50 dark:bg-primis-navy-light py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-light text-primis-navy dark:text-white mb-8">
              Featured Stories
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredNews.map((article) => (
                <Link key={article.news_id} href={`/news/${article.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all border-0 bg-white dark:bg-primis-navy dark:border dark:border-white/10 cursor-pointer">
                    {article.featured_image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryColors[article.category.toLowerCase()]}>
                          <CategoryIcon category={article.category} />
                          <span className="ml-1">{article.category}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-serif text-primis-navy dark:text-white line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-white/60 line-clamp-3 mb-4">
                        {article.summary}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-white/40">
                        <span>{formatDate(article.published_at)}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{article.views_count}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-primis-navy py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-primis-navy-light border-gray-300 dark:border-white/10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="dark:border-white/10"
              >
                All
              </Button>
              {Object.keys(categoryIcons).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="dark:border-white/10"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primis-navy dark:border-white"></div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-white/20" />
              <p className="text-gray-600 dark:text-white/60">No news articles found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <Link key={article.news_id} href={`/news/${article.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all border-0 bg-gray-50 dark:bg-primis-navy-light dark:border dark:border-white/10 cursor-pointer">
                    {article.featured_image && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryColors[article.category.toLowerCase()]}>
                          <CategoryIcon category={article.category} />
                          <span className="ml-1 text-xs">{article.category}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-serif text-primis-navy dark:text-white line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-gray-600 dark:text-white/60 line-clamp-2 mb-4">
                        {article.summary}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/40">
                        <span>{formatDate(article.published_at)}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{article.views_count}</span>
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
