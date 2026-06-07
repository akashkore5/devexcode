import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import dailyTerms from '../data/daily_terms.json';
import microDevTips from '../data/micro_dev_tips.json';
import techBattles from '../data/tech_battles.json';
import topics10min from '../data/10min_topics.json';

const BASE_URL = 'https://devexcode.com';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/interview`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/leetcode`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/leetcode/leetcode150`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/leetcode/leetcode75`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/leetcode/sql50`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/leetcode/top100liked`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/system-design`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/daily-term`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
  { url: `${BASE_URL}/micro-dev-tips`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
  { url: `${BASE_URL}/tech-battles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/learn10`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/community/notes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE_URL}/potd`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.75 },
  { url: `${BASE_URL}/gfg`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/databases`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/learning-paths`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
  { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/interview/mcq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/interview/mock`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/interview/tests`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/interview/tips`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
];

function getBlogSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), 'dailyblogtips');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''));
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const dailyTermUrls: MetadataRoute.Sitemap = dailyTerms
    .filter((t) => t.date <= now.toISOString().split('T')[0])
    .map((t) => ({
      url: `${BASE_URL}/daily-term/${t.date}`,
      lastModified: new Date(t.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const microDevTipUrls: MetadataRoute.Sitemap = (microDevTips as Array<{ id: number | string }>).map((t) => ({
    url: `${BASE_URL}/micro-dev-tips/${t.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  const techBattleUrls: MetadataRoute.Sitemap = (techBattles as Array<{ id: number | string }>).map((b) => ({
    url: `${BASE_URL}/tech-battles/${b.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  const learn10Urls: MetadataRoute.Sitemap = (topics10min as Array<{ id: number | string }>).map((t) => ({
    url: `${BASE_URL}/learn10/${t.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const blogSlugs = getBlogSlugs();
  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/micro-dev-tips/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [
    ...STATIC_PAGES,
    ...dailyTermUrls,
    ...microDevTipUrls,
    ...techBattleUrls,
    ...learn10Urls,
    ...blogUrls,
  ];
}
