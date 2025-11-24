# News System - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Run Database Migration
```bash
cd backend
alembic upgrade head
```

### Step 2: Configure Cloudinary (Frontend)
Add to your `.env.local` in `Primis-Frontend`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Step 3: Setup Cloudinary Upload Preset
1. Go to Cloudinary Dashboard → Settings → Upload
2. Create an upload preset named `news_uploads`
3. Set it as **unsigned** for easier frontend uploads
4. Configure folder: `news/`

### Step 4: Start the Services
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd Primis-Frontend
npm run dev
```

### Step 5: Test It Out
1. Visit `http://localhost:3000` - You'll see the news carousel (empty initially)
2. Visit `http://localhost:3000/news` - News listing page
3. Create a test article via API or admin page

## 📝 Create Your First News Article

### Option A: Via API (Postman/curl)
```bash
curl -X POST http://localhost:8000/api/v1/news/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Welcome to Our News System!",
    "summary": "This is our brand new news and updates system with photo and video support.",
    "content": "We are excited to introduce our new news system! This platform allows us to share important updates, events, achievements, and more with our community. Stay tuned for more exciting news!",
    "category": "announcements",
    "author_name": "Admin Team",
    "featured_image": "YOUR_CLOUDINARY_IMAGE_URL",
    "is_published": true,
    "is_featured": true,
    "tags": "announcement, news, update"
  }'
```

### Option B: Via Admin Page
1. Login as admin
2. Visit `/admin/news/create`
3. Fill in the form
4. Upload images via Cloudinary widget
5. Click "Create Article"

## 🎨 Cloudinary Tips

### Quick Image Upload
1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Upload your images
3. Click on image → Copy URL
4. Use in `featured_image` field

### For Multiple Media
```json
"media_files": [
  {
    "url": "https://res.cloudinary.com/.../image1.jpg",
    "type": "image"
  },
  {
    "url": "https://res.cloudinary.com/.../video1.mp4",
    "type": "video"
  }
]
```

## ✅ Verification Checklist

- [ ] Database migration completed successfully
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Cloudinary environment variable set
- [ ] Can access `/news` page without errors
- [ ] Homepage shows news carousel section
- [ ] Can create news article (via API or admin)
- [ ] Featured news appears in homepage carousel
- [ ] Can click on news to view full article
- [ ] Images load from Cloudinary

## 🐛 Troubleshooting

### "News carousel is empty"
- Make sure you have at least one article with `is_featured: true` and `is_published: true`
- Check backend logs for API errors
- Verify `published_at` is set (automatically set when publishing)

### "Images not loading"
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Check that Cloudinary URLs are publicly accessible
- Try using the full URL instead of public_id

### "Migration failed"
```bash
# Check migration status
alembic current

# Check pending migrations
alembic history

# If stuck, you can try:
alembic stamp head
alembic upgrade head
```

### "Cannot create news (403 Forbidden)"
- Ensure you're logged in as admin
- Check that your token is valid
- Verify the Authorization header is correct

## 📱 Test on Mobile
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update CORS settings in backend if needed
3. Visit `http://YOUR_IP:3000` from mobile device

## 🎯 Next Steps

1. **Create Sample Content**: Add 3-5 news articles with different categories
2. **Test Categories**: Try filtering by different categories on `/news` page
3. **Test Search**: Use the search bar to find articles
4. **Test Media Gallery**: Create an article with multiple images/videos
5. **Mobile Testing**: Check responsiveness on different devices

## 📚 Need Help?

- Check `NEWS_SYSTEM_DOCUMENTATION.md` for detailed documentation
- Review API endpoints at `http://localhost:8000/docs`
- Check browser console for frontend errors
- Check terminal for backend errors

## 🎉 Success!

If you can see the news carousel on the homepage and navigate to individual articles, you're all set! Start creating engaging content for your platform.
