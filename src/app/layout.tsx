import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from '../components/AppLayout';
import { Outfit } from 'next/font/google';
import { Viewport } from 'next';
import Script from 'next/script';

const outfit = Outfit({ subsets: ['latin'] });

const BASE_URL = 'https://devexcode.com';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DevExCode',
  alternateName: ['DevEx Code', 'DevEx', 'Dev Ex Code', 'Devex Code'],
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
  sameAs: ['https://twitter.com/devexcode'],
  description: 'DevExCode is the leading platform for developer experience, coding interview prep, system design guides, and daily tech education.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@devexcode.com',
    contactType: 'customer support',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DevExCode',
  alternateName: 'DevEx Code',
  url: BASE_URL,
  description: 'Master coding interviews with expertly crafted Leetcode solutions, system design guides, daily tech challenges, and a vibrant developer community.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/leetcode?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | DevExCode',
    default: 'DevExCode - Developer Experience & Coding Interview Prep Platform',
  },
  description: 'DevExCode (DevEx Code) — master coding interviews with expertly crafted Leetcode solutions, system design guides, daily tech challenges, micro dev tips, and a vibrant developer community. The #1 DevEx platform.',
  keywords: [
    'devexcode', 'devex code', 'devex', 'dev ex', 'dev ex code', 'devexcode.com',
    'leetcode solutions', 'system design', 'coding interview prep', 'developer experience',
    'micro dev tips', 'tech battles', 'daily tech term', 'interview preparation',
    'POTD', 'programming challenges', 'algorithms', 'data structures',
    'software engineering', 'FAANG interview', 'system design interview',
    'coding practice', 'tech education', 'developer community',
  ],
  authors: [{ name: 'DevExCode Team', url: BASE_URL }],
  creator: 'DevExCode',
  publisher: 'DevExCode',
  category: 'Technology Education',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'mask-icon', url: '/icon.svg', color: '#4f46e5' }],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'DevExCode',
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: 'DevExCode - Developer Experience & Coding Interview Prep',
    description: 'DevExCode (DevEx Code) — the #1 platform for coding interview prep, system design, daily tech terms, and developer experience.',
    siteName: 'DevExCode',
    locale: 'en_US',
    images: [{
      url: `${BASE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'DevExCode - Developer Experience & Coding Interview Prep Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@devexcode',
    creator: '@devexcode',
    title: 'DevExCode - Developer Experience & Coding Interview Prep',
    description: 'DevExCode (DevEx Code) — master Leetcode, system design, and dev tips. The #1 DevEx platform for engineers.',
    images: [`${BASE_URL}/twitter-image.jpg`],
  },
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
