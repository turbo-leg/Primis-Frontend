# Primis EduCare Branding Assets

This directory contains all branding and SEO assets for the Primis EduCare platform.

## Files Overview

### Logos & Icons
- **`logo.svg`** - Main vector logo (scalable, recommended for most uses)
- **`logo-192.png`** - PNG logo for PWA and smaller displays (192x192)
- **`logo-512.png`** - PNG logo for PWA and larger displays (512x512)
- **`apple-touch-icon.png`** - Apple devices home screen icon (180x180)
- **`favicon.ico`** - Browser favicon

### Open Graph & Social Media
- **`og-image.svg`** - Open Graph image for social media sharing (1200x630)
  - Used when sharing on Facebook, LinkedIn, Twitter, etc.
  - Displays rich preview with logo, title, and features

### PWA & Web App
- **`manifest.json`** - Web App Manifest for Progressive Web App functionality
  - Defines app name, icons, theme colors, shortcuts
  - Enables "Add to Home Screen" on mobile devices
  - Includes notification permissions and service worker configuration

### SEO & Search Engines
- **`robots.txt`** - Crawler instructions for search engines
- **`sitemap.xml`** - Site structure for search engine indexing

### Service Workers & Notifications
- **`sw.js`** - Basic service worker for offline functionality
- **`sw-enhanced.js`** - Enhanced service worker with notification support
- **`notification-sound-README.md`** - Documentation for notification sounds

### Testing & Development
- **`websocket-test.html`** - WebSocket connection testing page

## Branding Guidelines

### Colors
- **Primary Blue**: `#3B82F6` (theme-color)
- **Navy Blue**: `#1E3A8A` (primary brand color)
- **White**: `#FFFFFF` (background)

### Logo Usage
- Use the SVG logo (`logo.svg`) for web displays when possible (scalable, crisp)
- Use PNG versions for PWA icons and social media
- Maintain adequate spacing around the logo
- Preferred variants: light on dark background, or dark on light background

### Typography
- **Primary Font**: Playfair Display (serif) - for "PRIMIS"
- **Secondary Font**: Sans-serif - for taglines and body text
- Letter spacing: Wide tracking for elegant, professional look

## SEO Optimization

The platform is optimized for Google search with:
- ✅ Comprehensive meta tags in `layout.tsx`
- ✅ Open Graph tags for rich social sharing
- ✅ Twitter Card metadata
- ✅ Structured icons and manifest
- ✅ Robots.txt and sitemap.xml
- ✅ Semantic HTML and accessibility features
- ✅ Mobile-responsive PWA configuration

## Google Search Console Setup

To complete the Google search optimization:

1. **Verify ownership** in Google Search Console
2. **Add the verification meta tag** to `src/app/layout.tsx` (replace placeholder)
3. **Submit sitemap.xml** at: `https://your-domain.com/sitemap.xml`
4. **Monitor** search performance and Core Web Vitals

## Converting SVG to PNG

For production deployment, convert the SVG logos to actual PNG files:

```bash
# Using ImageMagick or similar tools:
convert logo.svg -resize 192x192 logo-192.png
convert logo.svg -resize 512x512 logo-512.png
convert logo.svg -resize 180x180 apple-touch-icon.png

# Or use online converters:
# - cloudconvert.com
# - convertio.co
# - svgtopng.com
```

## Notes

- All icon files reference in manifest.json are using placeholder PNG files
- For production, replace with properly sized PNG images
- The SVG files will work in modern browsers as fallbacks
- Consider using `sharp` or similar libraries for automated image optimization

## Support

For questions or issues with branding assets, contact the Primis EduCare development team.
