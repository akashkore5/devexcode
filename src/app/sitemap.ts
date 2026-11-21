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
import mcqTopics from '@/data/mcq_topics.json';
import { getAllTopicIds } from './interview/frontend/data';
import { hasGfgContent } from '@/lib/content-index';
import { resolveTipFile } from '@/lib/dev-tips';

const BASE_URL = 'https://www.devexcode.com';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL },
  { url: `${BASE_URL}/about` },
  { url: `${BASE_URL}/interview` },
  { url: `${BASE_URL}/interview/mcq` },
  { url: `${BASE_URL}/interview/mock` },
  { url: `${BASE_URL}/interview/tests` },
  { url: `${BASE_URL}/interview/tips` },
  { url: `${BASE_URL}/interview/ready/java` },
  { url: `${BASE_URL}/interview/frontend` },
  { url: `${BASE_URL}/leetcode` },
  { url: `${BASE_URL}/leetcode/leetcode150` },
  { url: `${BASE_URL}/leetcode/leetcode75` },
  { url: `${BASE_URL}/leetcode/sql50` },
  { url: `${BASE_URL}/leetcode/top100liked` },
  { url: `${BASE_URL}/system-design` },
  { url: `${BASE_URL}/system-design/flows` },
  { url: `${BASE_URL}/daily-term` },
  { url: `${BASE_URL}/micro-dev-tips` },
  { url: `${BASE_URL}/tech-battles` },
  { url: `${BASE_URL}/learn10` },
  { url: `${BASE_URL}/community` },
  { url: `${BASE_URL}/community/notes` },
  { url: `${BASE_URL}/potd` },
  { url: `${BASE_URL}/gfg` },
  { url: `${BASE_URL}/databases` },
  { url: `${BASE_URL}/learning` },
  { url: `${BASE_URL}/learning-paths` },
  { url: `${BASE_URL}/learning/java` },
  { url: `${BASE_URL}/learning/react` },
  { url: `${BASE_URL}/practice/dsa` },
  { url: `${BASE_URL}/practice/java` },
  { url: `${BASE_URL}/db-design` },
  { url: `${BASE_URL}/services` },
  { url: `${BASE_URL}/contact` },
  { url: `${BASE_URL}/terms` },
  { url: `${BASE_URL}/privacy` },
];

function getContentSlugs(relDir: string): Array<{ category: string; slug: string }> {
  try {
    const contentDir = path.join(process.cwd(), relDir);
    if (!fs.existsSync(contentDir)) return [];
    const categories = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const results: Array<{ category: string; slug: string }> = [];
    for (const cat of categories) {
      for (const file of fs.readdirSync(path.join(contentDir, cat))) {
        if (file.endsWith('.md')) results.push({ category: cat, slug: file.replace('.md', '') });
      }
    }
    return results;
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

  // LeetCode problems (3,555 solutions)
  const leetcodeUrls: MetadataRoute.Sitemap = problems.map((p) => {
    const slug = `${p.id}-${p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    return {
      url: `${BASE_URL}/leetcode/${slug}`,
    };
  });

  // System Design questions (182 guides)
  const systemDesignUrls: MetadataRoute.Sitemap = systemDesignQuestions.map((q) => {
    const slug = `${q.id}-${q.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    return {
      url: `${BASE_URL}/system-design/${slug}`,
    };
  });

  // System Design Flows
  const flowIds = ['deployment', 'auth', 'scaling', 'cache', 'balancer', 'dns', 'payment'];
  const flowUrls: MetadataRoute.Sitemap = flowIds.map((flowId) => ({
    url: `${BASE_URL}/system-design/flows/${flowId}`,
  }));

  // GFG problems. Only ids with a real markdown body: the catalogue lists 3,466
  // but ~2,319 have no file and 87 more are failed-generation stubs. Submitting
  // those produced soft 404s, which is a site-level quality signal.
  const gfgUrls: MetadataRoute.Sitemap = (gfgProblems as Array<{ id: string }>)
    .filter((p) => hasGfgContent(p.id))
    .map((p) => ({
      url: `${BASE_URL}/gfg/${p.id}`,
    }));

  // Frontend Interview Handbook topics (60 topics)
  const frontendTopicIds = getAllTopicIds();
  const frontendUrls: MetadataRoute.Sitemap = frontendTopicIds.map((topicId) => ({
    url: `${BASE_URL}/interview/frontend/${topicId}`,
  }));

  // Database topics & subtopics (95 guides)
  const databaseUrls: MetadataRoute.Sitemap = [];
  databaseTopics.topics.forEach((t) => {
    databaseUrls.push({
      url: `${BASE_URL}/databases/${t.id}`,
    });
    (t.subtopics || []).forEach((sub) => {
      databaseUrls.push({
        url: `${BASE_URL}/databases/${sub.id}`,
      });
    });
  });

  // Tech Battles (415 battles)
  const techBattleUrls: MetadataRoute.Sitemap = (techBattles as Array<{ id: number | string }>).map((b) => ({
    url: `${BASE_URL}/tech-battles/${b.id}`,
  }));

  // Learn in 10 minutes topics
  const learn10Urls: MetadataRoute.Sitemap = (topics10min as Array<{ id: number | string }>).map((t) => ({
    url: `${BASE_URL}/learn10/${t.id}`,
  }));

  // Daily Terms
  const dailyTermUrls: MetadataRoute.Sitemap = dailyTerms
    .filter((t) => t.date <= now.toISOString().split('T')[0])
    .map((t) => ({
      url: `${BASE_URL}/daily-term/${t.date}`,
      lastModified: new Date(t.date),
    }));

  // Micro Dev Tips. The `dev_<n>` markdown filenames are deliberately NOT listed:
  // they serve the same tips under a second URL and now 301 onto the numeric form.
  const microDevTipUrls: MetadataRoute.Sitemap = (microDevTips as Array<{ id: number | string; date?: string }>)
    .filter((t) => resolveTipFile(t.id) !== null)
    .map((t) => ({
      url: `${BASE_URL}/micro-dev-tips/${t.id}`,
      ...(t.date ? { lastModified: new Date(t.date) } : {}),
    }));

  // MCQ topic pages and Java practice exercises: both have real content and
  // real internal links, but were missing from the sitemap entirely.
  const mcqUrls: MetadataRoute.Sitemap = (mcqTopics as Array<{ slug: string }>).map((t) => ({
    url: `${BASE_URL}/mcq/${t.slug}`,
  }));

  const practiceJavaUrls: MetadataRoute.Sitemap = getContentSlugs('src/content/practice/java').map((q) => ({
    url: `${BASE_URL}/practice/java/${q.category}/${q.slug}`,
  }));

  // Java Interview Prep guides
  const javaQuestions = getJavaInterviewSlugs();
  const javaInterviewUrls: MetadataRoute.Sitemap = javaQuestions.map((q) => ({
    url: `${BASE_URL}/interview/ready/java/${q.category}/${q.slug}`,
  }));

  // Java Learning path topics
  const javaLearningUrls: MetadataRoute.Sitemap = [];
  javaTopics.topics.forEach((t) => {
    javaLearningUrls.push({
      url: `${BASE_URL}/learning/java/${t.id}`,
    });
    (t.subtopics || []).forEach((sub) => {
      javaLearningUrls.push({
        url: `${BASE_URL}/learning/java/${sub.id}`,
      });
    });
  });

  // React Learning path topics
  const reactLearningUrls: MetadataRoute.Sitemap = [];
  reactTopics.topics.forEach((t) => {
    reactLearningUrls.push({
      url: `${BASE_URL}/learning/react/${t.id}`,
    });
    (t.subtopics || []).forEach((sub) => {
      reactLearningUrls.push({
        url: `${BASE_URL}/learning/react/${sub.id}`,
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
    ...mcqUrls,
    ...practiceJavaUrls,
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
