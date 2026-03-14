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
