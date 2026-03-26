import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from '@/components/AppLayout';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevExCode - Your Ultimate Guide to Acing Tech Interviews',
  description: 'Master coding interviews with expertly crafted Leetcode solutions, system design guides, daily tech challenges, and a vibrant developer community.',
  keywords: 'leetcode, system design, TechBit, QuickLearn, Micro Dev Tips, Tech Battles, POTD, coding, algorithms, interview prep, programming, daily terms, community, career services',
  authors: [{ name: 'DevExCode Team' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: 'https://devexcode.com',
    title: 'DevExCode - Your Ultimate Guide to Acing Tech Interviews',
    description: 'Master coding interviews with expertly crafted Leetcode solutions, system design guides, daily tech challenges, and a vibrant developer community.',
    siteName: 'DevExCode',
    images: [{
      url: 'https://devexcode.com/og-image.jpg',
      alt: 'DevExCode Coding and System Design Prep',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevExCode - Your Ultimate Guide to Acing Tech Interviews',
    description: 'Master coding interviews with expertly crafted Leetcode solutions, system design guides, daily tech challenges, and a vibrant developer community.',
    images: ['https://devexcode.com/twitter-image.jpg'],
    creator: '@devexcode',
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
