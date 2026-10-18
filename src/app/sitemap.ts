import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import dailyTerms from '@/data/daily_terms.json';
import microDevTips from '@/data/micro_dev_tips.json';
import techBattles from '@/data/tech_battles.json';
import topics10min from '@/data/10min_topics.json';
import problems from '@/data/problems.json';
import systemDesignQuestions from '@/data/system_design_questions.json';
import gfgProblems from '@/data/gfgproblems.json';
import databaseTopics from '@/data/database_topics.json';
import javaTopics from '@/data/java_topics.json';
import reactTopics from '@/data/react_topics.json';
import { getAllTopicIds } from './interview/frontend/data';

const BASE_URL = 'https://devexcode.com';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date('2024-10-01'), changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE_URL}/about`, lastModified: new Date('2024-10-01'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/interview`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/interview/mcq`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/interview/mock`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/interview/tests`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/interview/tips`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/interview/ready/java`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/interview/frontend`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/leetcode`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/leetcode/leetcode150`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.85 },
  { url: `${BASE_URL}/leetcode/leetcode75`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.85 },
  { url: `${BASE_URL}/leetcode/sql50`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/leetcode/top100liked`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.85 },
  { url: `${BASE_URL}/system-design`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/system-design/flows`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/daily-term`, lastModified: new Date('2024-10-01'), changeFrequency: 'daily', priority: 0.85 },
  { url: `${BASE_URL}/micro-dev-tips`, lastModified: new Date('2024-10-01'), changeFrequency: 'daily', priority: 0.85 },
  { url: `${BASE_URL}/tech-battles`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/learn10`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/community`, lastModified: new Date('2024-10-01'), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/community/notes`, lastModified: new Date('2024-10-01'), changeFrequency: 'daily', priority: 0.65 },
  { url: `${BASE_URL}/potd`, lastModified: new Date('2024-10-01'), changeFrequency: 'daily', priority: 0.75 },
  { url: `${BASE_URL}/gfg`, lastModified: new Date('2024-10-01'), changeFrequency: 'daily', priority: 0.75 },
  { url: `${BASE_URL}/databases`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/learning-paths`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.75 },
  { url: `${BASE_URL}/learning/java`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.75 },
  { url: `${BASE_URL}/learning/react`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.75 },
  { url: `${BASE_URL}/practice/dsa`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.75 },
  { url: `${BASE_URL}/practice/java`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.75 },
  { url: `${BASE_URL}/db-design`, lastModified: new Date('2024-10-01'), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/services`, lastModified: new Date('2024-10-01'), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/contact`, lastModified: new Date('2024-10-01'), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/terms`, lastModified: new Date('2024-10-01'), changeFrequency: 'yearly', priority: 0.3 },
  { url: `${BASE_URL}/privacy`, lastModified: new Date('2024-10-01'), changeFrequency: 'yearly', priority: 0.3 },
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

function getJavaInterviewSlugs(): Array<{ category: string; slug: string }> {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/interview-prep/java');
    if (!fs.existsSync(contentDir)) return [];
    const categories = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    const results: Array<{ category: string; slug: string }> = [];
    for (const cat of categories) {
      const catDir = path.join(contentDir, cat);
      const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        results.push({ category: cat, slug: file.replace('.md', '') });
      }
    }
    return results;
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const defaultDate = new Date('2024-10-01');

  // LeetCode problems (3,555 solutions)
  const leetcodeUrls: MetadataRoute.Sitemap = problems.map((p) => {
    const slug = `${p.id}-${p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    return {
      url: `${BASE_URL}/leetcode/${slug}`,
      lastModified: defaultDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  // System Design questions (182 guides)
  const systemDesignUrls: MetadataRoute.Sitemap = systemDesignQuestions.map((q) => {
    const slug = `${q.id}-${q.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    return {
      url: `${BASE_URL}/system-design/${slug}`,
      lastModified: defaultDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  // System Design Flows
  const flowIds = ['deployment', 'auth', 'scaling', 'cache', 'balancer', 'dns', 'payment'];
  const flowUrls: MetadataRoute.Sitemap = flowIds.map((flowId) => ({
    url: `${BASE_URL}/system-design/flows/${flowId}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // GFG problems (1,147 solutions)
  const gfgUrls: MetadataRoute.Sitemap = (gfgProblems as Array<{ id: string }>).map((p) => ({
    url: `${BASE_URL}/gfg/${p.id}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Frontend Interview Handbook topics (60 topics)
  const frontendTopicIds = getAllTopicIds();
  const frontendUrls: MetadataRoute.Sitemap = frontendTopicIds.map((topicId) => ({
    url: `${BASE_URL}/interview/frontend/${topicId}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Database topics & subtopics (95 guides)
  const databaseUrls: MetadataRoute.Sitemap = [];
  databaseTopics.topics.forEach((t) => {
    databaseUrls.push({
      url: `${BASE_URL}/databases/${t.id}`,
      lastModified: defaultDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
    (t.subtopics || []).forEach((sub) => {
      databaseUrls.push({
        url: `${BASE_URL}/databases/${sub.id}`,
        lastModified: defaultDate,
        changeFrequency: 'monthly',
        priority: 0.65,
      });
    });
  });

  // Tech Battles (415 battles)
  const techBattleUrls: MetadataRoute.Sitemap = (techBattles as Array<{ id: number | string }>).map((b) => ({
    url: `${BASE_URL}/tech-battles/${b.id}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  // Learn in 10 minutes topics
  const learn10Urls: MetadataRoute.Sitemap = (topics10min as Array<{ id: number | string }>).map((t) => ({
    url: `${BASE_URL}/learn10/${t.id}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Daily Terms
  const dailyTermUrls: MetadataRoute.Sitemap = dailyTerms
    .filter((t) => t.date <= now.toISOString().split('T')[0])
    .map((t) => ({
      url: `${BASE_URL}/daily-term/${t.date}`,
      lastModified: new Date(t.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // Micro Dev Tips
  const microDevTipUrls: MetadataRoute.Sitemap = (microDevTips as Array<{ id: number | string }>).map((t) => ({
    url: `${BASE_URL}/micro-dev-tips/${t.id}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  const blogSlugs = getBlogSlugs();
  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/micro-dev-tips/${slug}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  // Java Interview Prep guides
  const javaQuestions = getJavaInterviewSlugs();
  const javaInterviewUrls: MetadataRoute.Sitemap = javaQuestions.map((q) => ({
    url: `${BASE_URL}/interview/ready/java/${q.category}/${q.slug}`,
    lastModified: defaultDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Java Learning path topics
  const javaLearningUrls: MetadataRoute.Sitemap = [];
  javaTopics.topics.forEach((t) => {
    javaLearningUrls.push({
      url: `${BASE_URL}/learning/java/${t.id}`,
      lastModified: defaultDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    });
    (t.subtopics || []).forEach((sub) => {
      javaLearningUrls.push({
        url: `${BASE_URL}/learning/java/${sub.id}`,
        lastModified: defaultDate,
        changeFrequency: 'monthly',
        priority: 0.65,
      });
    });
  });

  // React Learning path topics
  const reactLearningUrls: MetadataRoute.Sitemap = [];
  reactTopics.topics.forEach((t) => {
    reactLearningUrls.push({
      url: `${BASE_URL}/learning/react/${t.id}`,
      lastModified: defaultDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    });
    (t.subtopics || []).forEach((sub) => {
      reactLearningUrls.push({
        url: `${BASE_URL}/learning/react/${sub.id}`,
        lastModified: defaultDate,
        changeFrequency: 'monthly',
        priority: 0.65,
      });
    });
  });

  // Combine and deduplicate by URL
  const allEntries = [
    ...STATIC_PAGES,
    ...leetcodeUrls,
    ...systemDesignUrls,
    ...flowUrls,
    ...gfgUrls,
    ...frontendUrls,
    ...databaseUrls,
    ...techBattleUrls,
    ...learn10Urls,
    ...dailyTermUrls,
    ...microDevTipUrls,
    ...blogUrls,
    ...javaInterviewUrls,
    ...javaLearningUrls,
    ...reactLearningUrls,
  ];

  const seenUrls = new Set<string>();
  const uniqueEntries: MetadataRoute.Sitemap = [];

  for (const entry of allEntries) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueEntries.push(entry);
    }
  }

  return uniqueEntries;
}
