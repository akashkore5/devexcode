# DevExCode IndexNow Credentials & Instant Indexing Guide

This document maintains the official credentials and configuration for **IndexNow** instant search engine submission on `devexcode.com`.

---

## 🔑 Verification Credentials

| Property | Value |
| :--- | :--- |
| **Domain Host** | `devexcode.com` |
| **IndexNow Key** | `98e7557a0e66e3d1cd38d43f2a3efaa0` |
| **Key Length** | 32 characters (hexadecimal) |
| **Key Location File** | `public/98e7557a0e66e3d1cd38d43f2a3efaa0.txt` |
| **Public Verification URL** | `https://devexcode.com/98e7557a0e66e3d1cd38d43f2a3efaa0.txt` |
| **Environment Variable** | `INDEXNOW_KEY=98e7557a0e66e3d1cd38d43f2a3efaa0` (in `.env` & `.env.local`) |

---

## 📡 Submission Endpoints

IndexNow broadcasts to participating search engines (Microsoft Bing, Yandex, Seznam, Naver):

1. **Global IndexNow Gateway:**
   - `POST https://api.indexnow.org/indexnow`
2. **Microsoft Bing Direct Endpoint:**
   - `POST https://www.bing.com/indexnow`
3. **Yandex Direct Endpoint:**
   - `POST https://yandex.com/indexnow`

---

## 🚀 How to Run Instant Indexing

Run the automated submission script via npm:

```bash
npm run indexnow
```

### What this script does:
1. Dynamically compiles all 9,000+ unique canonical landing pages across:
   - LeetCode problem solutions (`/leetcode/*`)
   - High-Scale System Design guides (`/system-design/*`)
   - Interactive System Flows (`/system-design/flows/*`)
   - GeeksforGeeks solutions (`/gfg/*`)
   - Database architecture topics & subtopics (`/databases/*`)
   - Architectural Tech Battles (`/tech-battles/*`)
   - 10-Minute Rapid Learn topics (`/learn10/*`)
   - Daily Tech Terminology (`/daily-term/*`)
   - Micro Dev Tips (`/micro-dev-tips/*`)
   - Java Masterclass tracks (`/learning/java/*`)
   - React Architecture tracks (`/learning/react/*`)
   - Master Engineering tracks (`/learning`, `/learning-paths`, `/practice/dsa`)
   - Static hubs and legal pages (`/about`, `/terms`, `/privacy`, `/community`)
2. Chunks URLs into batches of 3,000 URLs (within IndexNow's 10,000 limit).
3. Transmits structured JSON payloads with key validation.
4. Pings search engine sitemap listeners.

---

## 🛠 Manual API Curl Example

```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "devexcode.com",
    "key": "98e7557a0e66e3d1cd38d43f2a3efaa0",
    "keyLocation": "https://devexcode.com/98e7557a0e66e3d1cd38d43f2a3efaa0.txt",
    "urlList": [
      "https://devexcode.com/",
      "https://devexcode.com/learning",
      "https://devexcode.com/leetcode",
      "https://devexcode.com/system-design"
    ]
  }'
```
