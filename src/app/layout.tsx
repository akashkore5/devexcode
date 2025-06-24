import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from '@/components/AppLayout';

export const metadata: Metadata = {
  title: 'DevExCode - Coding & System Design Prep',
  description: 'Master coding interviews with expertly crafted Leetcode solutions, system design guides, TechBit daily terms, QuickLearn lessons, Micro Dev Tips, and Tech Battles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
