import type { Metadata } from 'next';

export const BASE_URL = 'https://devexcode.com';
export const SITE_NAME = 'DevExCode';
export const TWITTER_HANDLE = '@devexcode';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[] | string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

export function constructMetadata({
  title,
  description,
  canonicalPath = '',
  keywords,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors = ['DevExCode Team'],
  section,
}: SEOProps): Metadata {
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = canonicalPath === '' ? BASE_URL : `${BASE_URL}${cleanPath.replace(/\/$/, '')}`;
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  const normalizedKeywords = Array.isArray(keywords)
    ? keywords
    : typeof keywords === 'string'
    ? keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [
        'devexcode',
        'leetcode solutions',
        'system design',
        'coding interview',
        'software engineering',
        'algorithms',
        'data structures',
      ];

  const meta: Metadata = {
    title,
    description,
    keywords: normalizedKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: ogType,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: `${title} | DevExCode`,
        },
      ],
      ...(ogType === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [absoluteOgImage],
    },
  };

  return meta;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function constructBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const fullUrl = item.path.startsWith('http')
        ? item.path
        : `${BASE_URL}${item.path.startsWith('/') ? '' : '/'}${item.path}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };
}

export interface TechArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  dependencies?: string;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function constructTechArticleSchema({
  title,
  description,
  url,
  datePublished = '2024-01-01T00:00:00.000Z',
  dateModified,
  authorName = 'DevExCode Team',
  dependencies,
  proficiencyLevel,
}: TechArticleSchemaProps) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: fullUrl,
    image: DEFAULT_OG_IMAGE,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    ...(dependencies && { dependencies }),
    ...(proficiencyLevel && { proficiencyLevel }),
  };
}

export function constructWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['DevEx Code', 'DevExCode.com'],
    url: BASE_URL,
    description: 'Master LeetCode solutions, system design architecture blueprints, and technical interview preparation.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/leetcode?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function constructOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/devexcode',
      'https://github.com/devexcode',
    ],
  };
}

