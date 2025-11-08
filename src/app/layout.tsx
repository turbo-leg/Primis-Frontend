import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { combinedDescription, combinedKeywords } from '@/lib/metadata'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://primis-educare.com'),
  title: {
    default: 'Primis EduCare - College Prep Platform',
    template: '%s | Primis EduCare'
  },
  description: combinedDescription,
  keywords: combinedKeywords,
  authors: [{ name: 'Turbileg Uurtsaikh' }],
  creator: 'Turbileg Uurtsaikh',
  publisher: 'Primis EduCare',
  applicationName: 'Primis EduCare',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  
  // Open Graph metadata for rich social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['mn_MN'],
    url: '/',
    siteName: 'Primis EduCare',
    title: 'Primis EduCare - College Prep Platform',
    description: 'Empowering students to achieve academic excellence through personalized learning, expert guidance, and comprehensive college preparation. Connect with teachers, track progress, and unlock your full potential.',
    images: [
      {
        url: '/og-image.png',
        width: 512,
        height: 512,
        alt: 'Primis EduCare - College Preparation Platform',
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Primis EduCare - College Prep Platform',
    description: 'Empowering students to achieve academic excellence through personalized learning, expert guidance, and comprehensive college preparation.',
    images: ['/og-image.png'],
    creator: '@primiseducare',
  },
  
  // Icons and manifest
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  
  // App-specific metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Primis EduCare',
  },
  
  // Verification for search engines
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  // Additional metadata
  category: 'education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}