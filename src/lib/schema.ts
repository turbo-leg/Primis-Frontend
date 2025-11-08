// Structured data for Google Search and SEO
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Primis EduCare',
  alternateName: 'Primis College Prep Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://primis-educare.com',
  logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://primis-educare.com'}/logo-512.png`,
  description: 'Empowering students to achieve academic excellence through personalized learning, expert guidance, and comprehensive college preparation. Connect with teachers, track progress, and unlock your full potential. | Оюутнуудад хувь хүний сургалт, мэргэжлийн удирдамж, иж бүрэн коллеж бэлтгэл хангаж, академик амжилтад хүрэхэд туслана.',
  sameAs: [
    // Add your social media profiles here
    // 'https://facebook.com/primiseducare',
    // 'https://twitter.com/primiseducare',
    // 'https://linkedin.com/company/primiseducare',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Mongolian'],
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Primis EduCare',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://primis-educare.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://primis-educare.com'}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Primis EduCare',
  operatingSystem: 'Web, iOS, Android',
  applicationCategory: 'EducationalApplication',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '150',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Empowering students to achieve academic excellence through personalized learning, expert guidance, and comprehensive college preparation. Connect with teachers, track progress, and unlock your full potential with our intuitive platform designed for student success. | Оюутнуудад хувь хүний сургалт, мэргэжлийн удирдамж, иж бүрэн коллеж бэлтгэл хангаж, академик амжилтад хүрэхэд туслана.',
  featureList: [
    'Personalized Learning Paths',
    'Expert Teacher Guidance',
    'Progress Tracking & Analytics',
    'Interactive Course Materials',
    'Real-time Communication',
    'Academic Performance Insights',
    'Flexible Study Schedules',
    'Multilingual Support (English & Mongolian)',
    'Mobile & Desktop Access',
    'Secure Student Portal',
  ],
};

// Breadcrumb schema generator
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://primis-educare.com'}${item.url}`,
  })),
});

// Course schema generator
export const generateCourseSchema = (course: {
  name: string;
  description: string;
  instructor: string;
  startDate?: string;
  endDate?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.name,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'Primis EduCare',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://primis-educare.com',
  },
  instructor: {
    '@type': 'Person',
    name: course.instructor,
  },
  ...(course.startDate && { startDate: course.startDate }),
  ...(course.endDate && { endDate: course.endDate }),
});
