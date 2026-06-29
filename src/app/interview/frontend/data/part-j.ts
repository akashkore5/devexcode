import type { FrontendTopic } from "../types";

export const partJ: FrontendTopic[] = [
  {
    id: "web-storage-localstorage-sessionstorage-indexeddb",
    num: 37,
    title: "Web Storage (localStorage, sessionStorage, IndexedDB)",
    part: "Client-Side Storage",
    partId: "j",
    difficulty: "Core",
    summary:
      "Pick the right client-side store: localStorage and sessionStorage for small key-value data, IndexedDB for large offline datasets, cookies for auth.",
    readingTime: 6,
    explanation: [
      "The browser gives you several places to persist data on the client, each with a different capacity, lifetime, and intended use. **localStorage** and **sessionStorage** share the same synchronous string key-value API — the only difference is lifetime: localStorage persists until explicitly cleared, while sessionStorage is wiped when the tab closes. Both cap out around 5–10 MB and can only store strings, so objects must be serialized with `JSON.stringify` and parsed back on read.",
      "**IndexedDB** is a transactional, asynchronous, object-oriented database in the browser. It holds hundreds of megabytes (or more), supports indexes and structured queries, and can store binary data (Blobs, ArrayBuffers). Its raw API is verbose, so most teams use a thin wrapper like the `idb` library. Reach for it when you need an offline cache, large datasets, or anything beyond a handful of small values.",
      "**Cookies** are the odd one out: tiny (~4 KB) and sent on every request to the matching domain. That round-trip is a downside for client state but exactly what you want for auth — an `HttpOnly`, `Secure`, `SameSite` cookie can carry a session ID the server reads without JavaScript ever touching it.",
      "Here is how the four options compare:\n\n| Storage | Capacity | Persistence | Use Case |\n| --- | --- | --- | --- |\n| localStorage | ~5–10 MB | Persists until cleared | User preferences, theme, non-sensitive tokens |\n| sessionStorage | ~5–10 MB | Cleared on tab close | Form drafts, temporary session data |\n| IndexedDB | Hundreds of MB+ | Persists until cleared | Offline data cache, large datasets, binary files |\n| Cookies | ~4 KB | Configurable expiry | Session IDs (HttpOnly+Secure); server-read auth tokens |",
    ],
    backendAnalogy:
      "Think of localStorage/sessionStorage as a tiny in-process key-value cache (like a small ConcurrentHashMap that survives restarts), while IndexedDB is closer to an embedded database such as SQLite or H2 — transactional, indexed, and async. Cookies are like a request header you stamp on every call so the server can identify the session, the same way you'd attach a bearer token or session id server-side.",
    keyInsights: [
      "NEVER store sensitive data (passwords, API keys, PII, JWTs) in localStorage — any script on the page can read it, so an XSS bug leaks it. Prefer HttpOnly cookies for auth tokens.",
      "localStorage and sessionStorage are synchronous and string-only; serialize objects with JSON.stringify and parse on read.",
      "IndexedDB is the right choice for large offline datasets, binary files, and indexed queries — use a wrapper like idb to avoid its verbose raw API.",
      "sessionStorage is scoped to a single tab and cleared on close; localStorage is shared across tabs of the same origin and persists.",
    ],
    codeSamples: [
      {
        label: "localStorage / sessionStorage — simple key-value",
        language: "js",
        code: `// localStorage / sessionStorage — simple key-value
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme'); // 'dark'
localStorage.removeItem('theme');

// Store objects (must serialize)
const prefs = { theme: 'dark', lang: 'en' };
localStorage.setItem('prefs', JSON.stringify(prefs));
const loaded = JSON.parse(localStorage.getItem('prefs') || '{}');`,
      },
      {
        label: "IndexedDB (via idb library for cleaner API)",
        language: "ts",
        code: `// IndexedDB (via idb library for cleaner API)
import { openDB } from 'idb';

const db = await openDB('ExpenseDB', 1, {
  upgrade(db) {
    const store = db.createObjectStore('expenses', { keyPath: 'id' });
    store.createIndex('category', 'category');
  },
});

await db.put('expenses', { id: 1, amount: 120, category: 'meals' });
const all = await db.getAll('expenses');
const meals = await db.getAllFromIndex('expenses', 'category', 'meals');`,
      },
    ],
    runnable: {
      title: "localStorage round-trip with serialized objects",
      js: `// Store a primitive value
localStorage.setItem('theme', 'dark');
console.log('theme:', localStorage.getItem('theme'));

// Store an object (must serialize)
const prefs = { theme: 'dark', lang: 'en' };
localStorage.setItem('prefs', JSON.stringify(prefs));

const loaded = JSON.parse(localStorage.getItem('prefs') || '{}');
console.log('lang:', loaded.lang);

// Clean up
localStorage.removeItem('theme');
console.log('after remove:', localStorage.getItem('theme'));`,
    },
    interviewQA: [
      {
        question:
          "Compare localStorage, sessionStorage, cookies, and IndexedDB — when would you use each?",
        answer:
          "localStorage and sessionStorage are ~5–10 MB synchronous string key-value stores; localStorage persists until cleared and is shared across tabs, while sessionStorage is per-tab and cleared on close — good for preferences vs. temporary form drafts. Cookies are ~4 KB and sent to the server on every request, ideal for auth session IDs (HttpOnly+Secure). IndexedDB is an async transactional database holding hundreds of MB with indexes and binary support — use it for offline caches and large datasets.",
      },
      {
        question: "Why shouldn't you store a JWT or auth token in localStorage?",
        answer:
          "Any JavaScript running on the page can read localStorage, so a single XSS vulnerability lets an attacker exfiltrate the token. localStorage is also not sent automatically and has no HttpOnly protection. The safer pattern is an HttpOnly, Secure, SameSite cookie that JavaScript cannot read and that the server validates, removing the token from the script's reach.",
      },
      {
        question: "How do you store and retrieve an object in Web Storage?",
        answer:
          "Web Storage only holds strings, so you serialize on write with JSON.stringify and deserialize on read with JSON.parse, e.g. localStorage.setItem('prefs', JSON.stringify(obj)) then JSON.parse(localStorage.getItem('prefs') || '{}'). Forgetting to serialize stores '[object Object]', and parsing without a fallback throws on missing keys.",
      },
      {
        question: "When is IndexedDB the right tool over localStorage?",
        answer:
          "When you need more than a few small values: large datasets, binary blobs, structured/indexed queries, or offline-first caching. IndexedDB is asynchronous (non-blocking), transactional, and scales to hundreds of MB, whereas localStorage is synchronous, string-only, and capped around 5–10 MB. Use a wrapper like idb to keep the API manageable.",
      },
    ],
    thingsToRemember: [
      "localStorage = persists; sessionStorage = per-tab, cleared on close; both are sync and string-only.",
      "IndexedDB = async, transactional, hundreds of MB, indexes and binary data — use idb for a clean API.",
      "Never put secrets/JWTs in localStorage; use HttpOnly+Secure cookies for auth.",
    ],
    references: [
      {
        label: "MDN — Web Storage API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
      },
      {
        label: "MDN — IndexedDB API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
      },
    ],
    tags: ["storage", "localstorage", "indexeddb", "cookies", "offline"],
  },
  {
    id: "frontend-security-xss-csrf-csp",
    num: 38,
    title: "Frontend Security (XSS, CSRF, CSP, Input Sanitization)",
    part: "Client-Side Storage",
    partId: "j",
    difficulty: "Advanced",
    summary:
      "The UI layer is the first line of defense: escape output, sanitize HTML with DOMPurify, lock down resources with CSP, and protect requests with CSRF tokens and SameSite cookies.",
    readingTime: 7,
    explanation: [
      "Frontend engineers are the first line of defense against common web attacks. You don't need to be a security specialist, but you must prevent the vulnerabilities that originate in the UI layer — most of them come down to never trusting input and never injecting untrusted strings into the page.",
      "**XSS (Cross-Site Scripting)** is the headline threat: an attacker injects a malicious script into your page so it runs in the victim's browser with their privileges. React escapes JSX by default, so `{userInput}` renders as text, not markup. The danger zone is `dangerouslySetInnerHTML` — only use it on HTML you have sanitized first with a library like DOMPurify.",
      "**CSRF (Cross-Site Request Forgery)** tricks an authenticated user into firing an unwanted request to your server (the browser auto-attaches their cookies). Defend with anti-CSRF tokens, the `SameSite` cookie attribute, and verifying the `Origin` header on the server. **Clickjacking** overlays an invisible iframe over your page; block it with `X-Frame-Options: DENY` or `frame-ancestors` in CSP. **Open redirects** abuse your URLs to bounce users to malicious sites — always validate and whitelist redirect targets.",
      "Here are the core attacks and their fixes:\n\n| Attack | What It Is | Prevention |\n| --- | --- | --- |\n| XSS (Cross-Site Scripting) | Attacker injects malicious scripts into your page | React escapes JSX by default; never use dangerouslySetInnerHTML; sanitize user input with DOMPurify |\n| CSRF (Cross-Site Request Forgery) | Attacker tricks user into making unwanted requests | Use CSRF tokens; SameSite cookie attribute; verify Origin header on server |\n| Clickjacking | Attacker overlays invisible iframe over your page | X-Frame-Options: DENY header; frame-ancestors in CSP |\n| Open Redirect | Attacker uses your URL to redirect to malicious site | Validate redirect URLs; whitelist allowed domains |\n\nA **Content Security Policy (CSP)** is your defense-in-depth backstop: an HTTP header (or meta tag) that whitelists exactly which origins the browser may load scripts, styles, images, and connections from, so even an injected script is blocked from executing or phoning home.",
    ],
    backendAnalogy:
      "Input sanitization on the frontend is the same discipline as parameterized queries and bean validation on the backend — never concatenate untrusted input into something that gets interpreted (HTML in the browser, SQL in the database). CSP is like a firewall allowlist or an outbound egress policy: explicitly enumerate the origins you trust and deny everything else. CSRF tokens mirror the synchronizer-token pattern you'd enforce server-side.",
    keyInsights: [
      "React auto-escapes JSX, so {userInput} is safe by default; the risk appears the moment you reach for dangerouslySetInnerHTML.",
      "Never inject raw user HTML — run it through DOMPurify.sanitize() first, then pass the cleaned string.",
      "Defend CSRF with SameSite cookies + anti-CSRF tokens + server-side Origin verification; defend clickjacking with frame-ancestors / X-Frame-Options.",
      "CSP is defense-in-depth: a whitelist of allowed resource origins that stops injected scripts from running or exfiltrating data.",
    ],
    codeSamples: [
      {
        label: "Content Security Policy (CSP) via meta tag",
        language: "html",
        code: `<!-- Content Security Policy (CSP) - set via HTTP header or meta tag -->
<!-- Restricts what resources the browser can load -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
" />`,
      },
      {
        label: "DOMPurify — sanitize user-generated HTML",
        language: "tsx",
        code: `// DOMPurify — sanitize user-generated HTML
import DOMPurify from 'dompurify';

function UserComment({ htmlContent }: { htmlContent: string }) {
  // NEVER do this with raw user input
  // <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

  // Sanitize first
  const clean = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// React auto-escapes by default — this is SAFE
function Safe({ userInput }: { userInput: string }) {
  return <p>{userInput}</p>; // <script> tags rendered as text, not executed
}`,
      },
    ],
    interviewQA: [
      {
        question:
          "What is XSS, what are its main types, and how do you prevent it in a React app?",
        answer:
          "XSS (Cross-Site Scripting) is when an attacker injects a script that runs in the victim's browser. The main types are stored (persisted in your DB and served to every visitor), reflected (echoed back from a request, e.g. a search query), and DOM-based (the injection happens entirely client-side via unsafe DOM APIs). React mitigates it by escaping JSX by default, so {userInput} renders as text. Prevention: avoid dangerouslySetInnerHTML, and when you must render HTML, sanitize it with DOMPurify; also set a strong CSP as a backstop.",
      },
      {
        question: "What is CSRF and how does the SameSite cookie attribute help?",
        answer:
          "CSRF (Cross-Site Request Forgery) tricks a logged-in user into sending an unwanted authenticated request, because the browser automatically attaches their cookies to requests targeting your domain. The SameSite cookie attribute tells the browser not to send the cookie on cross-site requests (Lax blocks most cross-site sends, Strict blocks all), which neutralizes the classic attack. Combine it with anti-CSRF tokens and server-side Origin/Referer verification for defense in depth.",
      },
      {
        question: "What does a Content Security Policy do and why is it useful?",
        answer:
          "A CSP is an HTTP header (or meta tag) that whitelists the origins the browser is allowed to load resources from — scripts, styles, images, connections — and can block framing with frame-ancestors. It's defense-in-depth: even if an XSS bug slips through, the browser refuses to execute scripts from disallowed origins or send data to unapproved endpoints, sharply limiting the damage.",
      },
      {
        question: "Why is dangerouslySetInnerHTML dangerous, and when is it acceptable?",
        answer:
          "It bypasses React's automatic escaping and injects a raw HTML string directly into the DOM, so any markup or script in untrusted input executes — a direct XSS vector. It's acceptable only when the HTML comes from a trusted source or has been sanitized first with a library like DOMPurify, which strips scripts and dangerous attributes before you pass the cleaned string.",
      },
    ],
    thingsToRemember: [
      "XSS: React escapes JSX by default; never inject raw user HTML — sanitize with DOMPurify before dangerouslySetInnerHTML.",
      "CSRF: SameSite cookies + anti-CSRF tokens + server-side Origin verification.",
      "CSP is a resource allowlist (defense-in-depth); frame-ancestors / X-Frame-Options stop clickjacking, and redirect URLs must be whitelisted.",
    ],
    references: [
      {
        label: "OWASP — XSS Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
      },
      {
        label: "MDN — Content Security Policy",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
      },
    ],
    tags: ["security", "xss", "csrf", "csp", "sanitization"],
  },
];
