import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About DevExCode - Our Story & Mission',
  description: 'Learn about DevExCode (DevEx Code) — the platform built by engineers, for engineers. Discover our mission to democratize tech interview prep and developer education.',
  keywords: [
    'devexcode', 'devex code', 'devex', 'about devexcode', 'devexcode team',
    'developer education platform', 'coding interview prep', 'tech education',
    'software engineering', 'FAANG interview preparation',
  ],
  alternates: { canonical: 'https://devexcode.com/about' },
  openGraph: {
    title: 'About DevExCode - Our Story & Mission',
    description: 'DevExCode — built by engineers, for engineers. Learn about our mission to make world-class tech interview prep accessible to every developer.',
    url: 'https://devexcode.com/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
