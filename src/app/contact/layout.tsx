import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact DevExCode - Get in Touch',
  description: 'Contact the DevExCode (DevEx Code) team for support, partnerships, feedback, or bug reports. We respond within 24 hours.',
  keywords: [
    'contact devexcode', 'devexcode support', 'devex code contact',
    'developer support', 'tech interview prep support',
  ],
  alternates: { canonical: 'https://devexcode.com/contact' },
  openGraph: {
    title: 'Contact DevExCode - Get in Touch',
    description: 'Reach out to the DevExCode team. Support, partnerships, or feedback — we\'re here to help.',
    url: 'https://devexcode.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
