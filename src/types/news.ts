// News System Type Definitions

export enum NewsCategory {
  GENERAL = 'general',
  ACADEMIC = 'academic',
  EVENTS = 'events',
  ACHIEVEMENTS = 'achievements',
  SCHOLARSHIPS = 'scholarships',
  CAMPUS_LIFE = 'campus_life',
  TECHNOLOGY = 'technology',
  ANNOUNCEMENTS = 'announcements',
}

export interface MediaFile {
  url: string;
  type: 'image' | 'video';
  public_id?: string;
  resource_type?: string;
}

export interface NewsBase {
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  author_name: string;
  featured_image?: string;
  media_files?: MediaFile[];
  is_published: boolean;
  is_featured: boolean;
  tags?: string;
  meta_description?: string;
}

export interface NewsCreate extends NewsBase {}

export interface NewsUpdate extends Partial<NewsBase> {}

export interface NewsResponse extends NewsBase {
  news_id: number;
  slug: string;
  author_id?: number;
  author_type?: string;
  published_at?: string;
  views_count: number;
  created_at: string;
  updated_at?: string;
}

export interface NewsListParams {
  skip?: number;
  limit?: number;
  category?: NewsCategory;
  featured_only?: boolean;
  published_only?: boolean;
}

export interface NewsSearchParams {
  q: string;
  skip?: number;
  limit?: number;
}

// Helper function to parse tags
export function parseNewsTags(tags?: string): string[] {
  if (!tags) return [];
  return tags.split(',').map(tag => tag.trim()).filter(Boolean);
}

// Helper function to format tags for API
export function formatNewsTags(tags: string[]): string {
  return tags.join(', ');
}

// Helper function to extract Cloudinary public ID from URL
export function extractCloudinaryPublicId(url: string): string {
  if (!url.includes('cloudinary')) return url;
  const parts = url.split('/upload/');
  return parts[1] || url;
}
