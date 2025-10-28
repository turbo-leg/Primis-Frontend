/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/dashboard/*',
    '/admin/*',
    '/api/*',
    '/server-sitemap-index.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/private/',
        ],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom transform function for internationalization
    const locales = ['en', 'mn']
    
    // Skip if it's already a localized path or should be excluded
    if (locales.some(locale => path.startsWith(`/${locale}/`)) || 
        config.exclude?.some(excludePath => 
          path.match(new RegExp(excludePath.replace('*', '.*'))))) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Generate sitemap entries for each locale
    return locales.map(locale => ({
      loc: `/${locale}${path === '/' ? '' : path}`,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    }))
  },
}
