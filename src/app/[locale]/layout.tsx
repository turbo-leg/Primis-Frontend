import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { Providers } from '../providers';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { routing } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const isMonMongolian = locale === 'mn';
  
  return {
    title: {
      default: isMonMongolian ? 'Primis EduCare - Коллеж Бэлтгэл Систем' : 'Primis EduCare - College Prep Platform',
      template: isMonMongolian ? '%s | Primis EduCare' : '%s | Primis EduCare',
    },
    description: isMonMongolian
      ? 'Оюутны удирдлага, хичээл заах, ирцийн бүртгэл, захиргааны хэрэгслүүдтэй иж бүрэн коллеж бэлтгэл систем. Бодит цагийн мэдэгдлүүд, QR кодоор ирц бүртгэх, гүйцэтгэлийн хяналт.'
      : 'A comprehensive college preparation platform with student management, course delivery, attendance tracking, and administrative tools. Real-time notifications, QR code attendance, and performance monitoring.',
    keywords: isMonMongolian
      ? [
          'коллеж бэлтгэл',
          'боловсролын систем',
          'оюутны удирдлага',
          'хичээл заах',
          'ирц бүртгэх',
          'QR код ирц',
          'боловсролын технологи',
          'сургалтын удирдлагын систем',
          'примис',
          'эдукеа'
        ]
      : [
          'college prep',
          'education platform',
          'student management',
          'course delivery',
          'attendance tracking',
          'QR code attendance',
          'education technology',
          'learning management system',
          'LMS',
          'educare',
          'primis'
        ],
    openGraph: {
      locale: isMonMongolian ? 'mn_MN' : 'en_US',
      title: isMonMongolian ? 'Primis EduCare - Коллеж Бэлтгэл Систем' : 'Primis EduCare - College Prep Platform',
      description: isMonMongolian
        ? 'Оюутны удирдлага, хичээл заах, захиргааны хэрэгслүүдтэй иж бүрэн коллеж бэлтгэл систем.'
        : 'A comprehensive college preparation platform with student management, course delivery, and administrative tools.',
      images: [
        {
          url: '/og-image.png',
          width: 512,
          height: 512,
          alt: isMonMongolian ? 'Primis EduCare Лого' : 'Primis EduCare Logo',
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Get messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
      </body>
    </html>
  );
}
