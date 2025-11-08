// Multilingual metadata for SEO and social sharing

export const siteMetadata = {
  en: {
    title: 'Primis EduCare - College Prep Platform',
    shortTitle: 'Primis EduCare',
    description: 'Empowering students to achieve academic excellence through personalized learning, expert guidance, and comprehensive college preparation. Connect with teachers, track progress, and unlock your full potential.',
    shortDescription: 'Empowering students to achieve academic excellence through personalized learning, expert guidance, and comprehensive college preparation.',
    keywords: [
      'college prep',
      'education platform',
      'student management',
      'course delivery',
      'personalized learning',
      'academic excellence',
      'study platform',
      'learning management system',
      'LMS',
      'online education',
      'educare',
      'primis',
      'student success',
      'teacher platform',
      'college preparation'
    ],
  },
  mn: {
    title: 'Primis EduCare - Коллеж Бэлтгэл Систем',
    shortTitle: 'Primis EduCare',
    description: 'Оюутнуудад хувь хүний сургалт, мэргэжлийн удирдамж, иж бүрэн коллеж бэлтгэл хангаж, академик амжилтад хүрэхэд туслана. Багш нартай холбогдож, ахиц дэвшлээ хянаж, бүх чадавхиа нээцгээе.',
    shortDescription: 'Оюутнуудад хувь хүний сургалт, мэргэжлийн удирдамж, иж бүрэн коллеж бэлтгэл хангаж, академик амжилтад хүрэхэд туслана.',
    keywords: [
      'коллеж бэлтгэл',
      'боловсролын систем',
      'оюутны удирдлага',
      'хувь хүний сургалт',
      'академик амжилт',
      'сургалтын платформ',
      'онлайн сургалт',
      'боловсролын технологи',
      'сургалтын удирдлагын систем',
      'примис эдукеа',
      'оюутны амжилт',
      'багшийн систем',
      'коллеж бэлтгэх'
    ],
  },
};

// Combined description for root layout (bilingual)
export const combinedDescription = `${siteMetadata.en.description} | ${siteMetadata.mn.description}`;

// Combined keywords for better multilingual SEO
export const combinedKeywords = [
  ...siteMetadata.en.keywords,
  ...siteMetadata.mn.keywords,
];
