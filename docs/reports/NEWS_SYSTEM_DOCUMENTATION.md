# News System with Cloudinary Integration

A complete news management system with slideshow carousel, media gallery support, and Cloudinary integration for photos and videos.

## Features

### 1. **News Carousel (Homepage)**
- Auto-rotating slideshow of featured news articles
- Displays up to 5 featured news items
- Image or video support via Cloudinary
- Manual navigation with arrows and dots
- Auto-pause on user interaction (resumes after 10s)
- Responsive design for all screen sizes
- Dark mode support

### 2. **News Listing Page** (`/news`)
- Grid view of all published news articles
- Category filtering (8 categories available)
- Search functionality
- Responsive card layout with images
- View counts and metadata display
- SEO-friendly URLs using slugs

### 3. **News Detail Page** (`/news/[slug]`)
- Full article view with rich content
- Media gallery with multiple photos/videos
- Thumbnail navigation for media
- Related articles section
- Social sharing capability
- View tracking
- Tags display
- Author and publication date info

### 4. **Backend API**
- Complete CRUD operations
- Admin-only content management
- SEO-optimized with meta descriptions
- Category-based organization
- Featured news marking
- Draft/publish workflow
- View counting
- Search functionality

## Database Schema

### News Table
```sql
- news_id (Primary Key)
- title (String, 255)
- slug (Unique, 300) - SEO-friendly URL
- summary (Text) - Short preview
- content (Text) - Full article content
- category (Enum) - 8 categories
- author_name (String, 100)
- author_id (Integer) - Optional link to admin/teacher
- author_type (String, 20) - 'admin' or 'teacher'
- featured_image (String, 500) - Main Cloudinary URL
- media_files (JSON) - Array of media objects
- is_published (Boolean)
- is_featured (Boolean) - Show in homepage carousel
- published_at (DateTime)
- views_count (Integer)
- tags (String, 500) - Comma-separated
- meta_description (String, 160) - SEO
- created_at (DateTime)
- updated_at (DateTime)
```

### Media Files JSON Structure
```json
{
  "url": "https://res.cloudinary.com/...",
  "type": "image" | "video",
  "public_id": "optional_cloudinary_id",
  "resource_type": "optional_resource_type"
}
```

## API Endpoints

### Public Endpoints
```
GET  /api/v1/news/                    - Get all news (with filters)
GET  /api/v1/news/featured            - Get featured news (homepage)
GET  /api/v1/news/category/{category} - Get by category
GET  /api/v1/news/slug/{slug}         - Get by slug (SEO-friendly)
GET  /api/v1/news/{id}                - Get by ID
GET  /api/v1/news/search/query?q=     - Search news
```

### Admin Endpoints (Auth Required)
```
POST   /api/v1/news/      - Create news article
PUT    /api/v1/news/{id}  - Update news article
DELETE /api/v1/news/{id}  - Delete news article
```

## Setup Instructions

### 1. Run Database Migration
```bash
cd backend
alembic upgrade head
```

### 2. Configure Cloudinary
Ensure you have Cloudinary credentials in your environment:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Upload Media to Cloudinary
Use the Cloudinary dashboard or API to upload images/videos. Copy the URLs or public IDs.

### 4. Create News Article (Admin)
**Example Request:**
```json
POST /api/v1/news/
Authorization: Bearer {admin_token}

{
  "title": "New Science Lab Opening",
  "summary": "State-of-the-art facilities now available for students",
  "content": "We are excited to announce the opening of our new science laboratory...",
  "category": "announcements",
  "author_name": "Dr. Smith",
  "featured_image": "https://res.cloudinary.com/demo/image/upload/v1234/lab.jpg",
  "media_files": [
    {
      "url": "https://res.cloudinary.com/demo/image/upload/v1234/lab1.jpg",
      "type": "image",
      "public_id": "lab1"
    },
    {
      "url": "https://res.cloudinary.com/demo/video/upload/v1234/lab_tour.mp4",
      "type": "video",
      "public_id": "lab_tour"
    }
  ],
  "is_published": true,
  "is_featured": true,
  "tags": "science, laboratory, facilities",
  "meta_description": "Check out our new state-of-the-art science laboratory"
}
```

## Categories

1. **general** - General announcements
2. **academic** - Academic-related news
3. **events** - School events and activities
4. **achievements** - Student/school achievements
5. **scholarships** - Scholarship opportunities
6. **campus_life** - Campus life updates
7. **technology** - Technology-related news
8. **announcements** - Official announcements

## Component Usage

### NewsCarousel (Homepage)
```tsx
import NewsCarousel from '@/components/NewsCarousel';

// In your page component
<NewsCarousel autoPlayInterval={6000} />
```

### News Listing Page
Already created at `/[locale]/news/page.tsx`

### News Detail Page
Already created at `/[locale]/news/[slug]/page.tsx`

## Styling

The components use:
- **Tailwind CSS** for styling
- **next-cloudinary** for optimized image/video rendering
- **Lucide React** for icons
- **shadcn/ui** components (Button, Card)
- Dark mode support throughout
- Responsive design for mobile, tablet, and desktop

## Translations

Add translations in `messages/en.json` and other language files:
```json
{
  "news": {
    "featuredTitle": "Latest News & Updates",
    "readMore": "Read Full Article",
    "viewAll": "View All News",
    // ... more translations
  }
}
```

## Best Practices

1. **Images**: Upload to Cloudinary in appropriate sizes (recommend 1920x1080 for featured images)
2. **Videos**: Keep videos under 50MB for best performance
3. **Content**: Write engaging summaries (10-500 chars) for the preview
4. **SEO**: Use meta_description and relevant tags
5. **Featured News**: Limit to 5 featured articles at a time
6. **Categories**: Choose appropriate categories for better organization
7. **Publishing**: Use draft mode (is_published: false) before final review

## Admin Dashboard Integration

To integrate with your admin dashboard, create a news management page with:
- Form for creating/editing articles
- Cloudinary upload widget integration
- Media file array management
- Category and tags selection
- Draft/publish toggle
- Featured article checkbox

## Troubleshooting

### Migration Issues
```bash
# Check current migration status
alembic current

# If needed, run specific migration
alembic upgrade add_media_files_news
```

### Cloudinary Images Not Loading
- Verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set
- Check that URLs are properly formatted
- Ensure images are publicly accessible in Cloudinary

### News Not Appearing in Carousel
- Verify `is_featured: true` and `is_published: true`
- Check that `published_at` is set
- Ensure at least one news article exists

## Future Enhancements

- [ ] Add comments system
- [ ] Newsletter integration
- [ ] Admin dashboard for news management
- [ ] Rich text editor for content
- [ ] Image optimization presets
- [ ] Multi-language news support
- [ ] News scheduling (publish at specific time)
- [ ] Analytics dashboard for view tracking
