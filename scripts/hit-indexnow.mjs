#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const HOST = 'devexcode.com';
const KEY = '98e7557a0e66e3d1cd38d43f2a3efaa0';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const BASE_URL = `https://${HOST}`;

function getAllUrls() {
  const urls = new Set();

  // Static Hubs and flagship routes
  const staticPages = [
    '', '/about', '/interview', '/interview/mcq', '/interview/mock', '/interview/tests',
    '/interview/tips', '/interview/ready/java', '/interview/frontend', '/leetcode',
    '/leetcode/leetcode150', '/leetcode/leetcode75', '/leetcode/sql50', '/leetcode/top100liked',
    '/system-design', '/system-design/flows', '/daily-term', '/micro-dev-tips', '/tech-battles',
    '/learn10', '/community', '/community/notes', '/potd', '/gfg', '/databases',
    '/learning', '/learning-paths', '/learning/java', '/learning/react', '/practice/dsa',
    '/practice/java', '/db-design', '/services', '/contact', '/terms', '/privacy'
  ];
  for (const p of staticPages) {
    urls.add(`${BASE_URL}${p}`);
  }

  // Helper to load JSON safely
  function loadJson(relPath, fallback = []) {
    try {
      const full = path.join(ROOT_DIR, relPath);
      if (fs.existsSync(full)) {
        return JSON.parse(fs.readFileSync(full, 'utf8'));
      }
    } catch (e) {
      console.warn(`Warning loading ${relPath}:`, e.message);
    }
    return fallback;
  }

  // 1. LeetCode Problems
  const problems = loadJson('src/data/problems.json');
  for (const p of problems) {
    const slug = `${p.id}-${(p.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    urls.add(`${BASE_URL}/leetcode/${slug}`);
  }

  // 2. System Design Questions
  const sdQuestions = loadJson('src/data/system_design_questions.json');
  for (const q of sdQuestions) {
    const slug = `${q.id}-${(q.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    urls.add(`${BASE_URL}/system-design/${slug}`);
  }

  // 3. System Design Flows
  const flows = ['deployment', 'auth', 'scaling', 'cache', 'balancer', 'dns', 'payment'];
  for (const f of flows) {
    urls.add(`${BASE_URL}/system-design/flows/${f}`);
  }

  // 4. GeeksforGeeks Problems
  const gfg = loadJson('src/data/gfgproblems.json');
  for (const p of gfg) {
    if (p.id) urls.add(`${BASE_URL}/gfg/${p.id}`);
  }

  // 5. Database Topics
  const dbData = loadJson('src/data/database_topics.json', {});
  for (const t of dbData.topics || []) {
    if (t.id) urls.add(`${BASE_URL}/databases/${t.id}`);
    for (const sub of t.subtopics || []) {
      if (sub.id) urls.add(`${BASE_URL}/databases/${sub.id}`);
    }
  }

  // 6. Tech Battles
  const battles = loadJson('src/data/tech_battles.json');
  for (const b of battles) {
    if (b.id) urls.add(`${BASE_URL}/tech-battles/${b.id}`);
  }

  // 7. 10-Minute Rapid Learn Topics
  const topics10 = loadJson('src/data/10min_topics.json');
  for (const t of topics10) {
    if (t.id) urls.add(`${BASE_URL}/learn10/${t.id}`);
  }

  // 8. Daily Terms
  const dailyTerms = loadJson('src/data/daily_terms.json');
  for (const t of dailyTerms) {
    if (t.date) urls.add(`${BASE_URL}/daily-term/${t.date}`);
  }

  // 9. Micro Dev Tips
  const tips = loadJson('src/data/micro_dev_tips.json');
  for (const t of tips) {
    if (t.id) urls.add(`${BASE_URL}/micro-dev-tips/${t.id}`);
  }

  // 10. Java Learning Track
  const javaData = loadJson('src/data/java_topics.json', {});
  for (const t of javaData.topics || []) {
    if (t.id) urls.add(`${BASE_URL}/learning/java/${t.id}`);
    for (const sub of t.subtopics || []) {
      if (sub.id) urls.add(`${BASE_URL}/learning/java/${sub.id}`);
    }
  }

  // 11. React Learning Track
  const reactData = loadJson('src/data/react_topics.json', {});
  for (const t of reactData.topics || []) {
    if (t.id) urls.add(`${BASE_URL}/learning/react/${t.id}`);
    for (const sub of t.subtopics || []) {
      if (sub.id) urls.add(`${BASE_URL}/learning/react/${sub.id}`);
    }
  }

  return Array.from(urls);
}

async function submitChunk(endpoint, endpointName, chunk, chunkIndex, totalChunks) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: chunk
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'DevExCode-IndexNow/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log(`[${endpointName}] Chunk ${chunkIndex}/${totalChunks} (${chunk.length} URLs): HTTP ${response.status} ${response.statusText}`);
    if (response.status === 200 || response.status === 202) {
      return true;
    } else {
      const text = await response.text();
      console.log(`   Response details: ${text.slice(0, 300)}`);
      return false;
    }
  } catch (err) {
    console.error(`[${endpointName}] Error submitting chunk ${chunkIndex}:`, err.message);
    return false;
  }
}

async function pingSitemaps() {
  const sitemapUrl = encodeURIComponent(`https://${HOST}/sitemap.xml`);
  const pingUrls = [
    { name: 'Bing Sitemap Ping', url: `https://www.bing.com/ping?sitemap=${sitemapUrl}` }
  ];

  for (const p of pingUrls) {
    try {
      const res = await fetch(p.url);
      console.log(`[${p.name}]: HTTP ${res.status} ${res.statusText}`);
    } catch (e) {
      console.log(`[${p.name}] Ping failed: ${e.message}`);
    }
  }
}

async function main() {
  console.log(`====================================================`);
  console.log(`DEVEXCODE INDEXNOW INSTANT SEARCH ENGINE INDEXING`);
  console.log(`====================================================`);
  console.log(`🌐 Host: https://${HOST}`);
  console.log(`🔑 Key: ${KEY}`);
  console.log(`📍 Key Verification URL: ${KEY_LOCATION}\n`);

  const allUrls = getAllUrls();
  console.log(`📊 Catalog Inventory: Found ${allUrls.length} unique landing page URLs to index!\n`);

  if (allUrls.length === 0) {
    console.error('❌ No URLs found.');
    process.exit(1);
  }

  // Chunk into batches of 3,000 URLs (IndexNow accepts up to 10,000 per request)
  const CHUNK_SIZE = 3000;
  const chunks = [];
  for (let i = 0; i < allUrls.length; i += CHUNK_SIZE) {
    chunks.push(allUrls.slice(i, i + CHUNK_SIZE));
  }

  const endpoints = [
    { name: 'IndexNow Global (api.indexnow.org)', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Microsoft Bing (bing.com)', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex (yandex.com)', url: 'https://yandex.com/indexnow' }
  ];

  for (const ep of endpoints) {
    console.log(`\n📡 Submitting ${allUrls.length} URLs across ${chunks.length} chunks to ${ep.name}...`);
    for (let i = 0; i < chunks.length; i++) {
      await submitChunk(ep.url, ep.name, chunks[i], i + 1, chunks.length);
    }
  }

  console.log('\n📡 Pinging search engine sitemap listeners...');
  await pingSitemaps();

  console.log('\n✅ DevExCode IndexNow submission sequence complete!');
}

main();
