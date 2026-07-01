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
      "The complete client-side storage map: how localStorage & sessionStorage work, cookies and their attributes, IndexedDB's async transactional model, capacity & lifetime trade-offs, serialization, sync-vs-async performance, cross-tab sync, and exactly which store to reach for — beginner to advanced.",
    readingTime: 17,
    explanation: [
      "**Why the browser has several stores.** A web app often needs to remember things between page loads: a chosen theme, a half-typed form, a cached list, a logged-in session. The browser gives you four distinct mechanisms — `localStorage`, `sessionStorage`, cookies, and IndexedDB — and they differ along three axes you should keep in your head at all times: **capacity** (how much fits), **lifetime** (when it's wiped), and **who reads it** (JavaScript only, or the server too). Choosing the wrong one is a common source of bugs and, worse, security holes, so the first skill is matching the store to the job.",
      "**Web Storage: the synchronous key-value pair.** `localStorage` and `sessionStorage` share one identical API — the **Web Storage API** — so learn it once. It is a synchronous string-to-string map with five methods: `setItem(key, value)`, `getItem(key)`, `removeItem(key)`, `clear()`, and `key(index)`, plus a `length` property. Both are scoped to the **origin** (scheme + host + port), so `https://app.com` cannot read `http://app.com`'s data. The *only* difference between them is lifetime, which is the next paragraph.",
      "**localStorage vs sessionStorage — the lifetime and scope split.** `localStorage` **persists indefinitely** — until the user clears site data or your code deletes it — and is **shared across every tab and window of the same origin**. `sessionStorage` lives only for the **lifetime of a single tab**: close the tab and it's gone, and a second tab gets its *own* independent copy (it is not shared). Rule of thumb: `localStorage` for durable preferences (theme, language, feature flags); `sessionStorage` for scratch data tied to one visit (a multi-step form draft, a scroll position, a one-time redirect target).",
      "**Everything is a string — serialize your objects.** Web Storage stores strings only. Write an object directly and you get the useless `\"[object Object]\"`. Always `JSON.stringify` on write and `JSON.parse` on read, and always guard the parse with a fallback because a missing key returns `null` and `JSON.parse(null)` throws in some paths: `JSON.parse(localStorage.getItem('prefs') ?? '{}')`. Remember serialization is lossy — `Date` objects become ISO strings, `undefined` and functions vanish, and `Map`/`Set` don't survive. If you need those types intact, IndexedDB (which uses the structured-clone algorithm) is the better home.",
      "**Cookies: tiny, but the server sees them.** A cookie is a small (~4 KB) key-value string that the browser **automatically attaches to every HTTP request** to the matching domain. That automatic round-trip is a *drawback* for pure client state (it bloats every request) but is exactly what you want for **authentication**: the server stamps a session cookie once and reads it on every subsequent request without any JavaScript involvement. Cookies carry attributes that control their security: **`Expires`/`Max-Age`** (lifetime — omit both for a session cookie), **`Domain`/`Path`** (scope), **`Secure`** (HTTPS-only), **`HttpOnly`** (invisible to `document.cookie`, so script — and thus XSS — cannot read it), and **`SameSite`** (`Strict`/`Lax`/`None`, the primary CSRF defense).",
      "**IndexedDB: a real database in the browser.** When you outgrow a few small strings, you reach for `IndexedDB` — a **transactional, asynchronous, object-oriented** database built into the browser. It stores structured JavaScript values (via structured clone, so `Date`, `Blob`, `ArrayBuffer`, `File`, nested objects all survive), scales to **hundreds of megabytes or more** (browsers grant a share of free disk), and supports **object stores** (like tables), **indexes** (query by non-key fields), **cursors** (iterate large result sets), and **key ranges**. Its native API is famously verbose and event-based, so almost every team wraps it with a promise-based helper such as the tiny `idb` library.",
      "**Sync vs async — the performance reason it matters.** Web Storage is **synchronous**: every `getItem`/`setItem` blocks the main thread until it completes. For a handful of tiny values that's imperceptible, but writing large JSON blobs on every keystroke can jank the UI. IndexedDB is **asynchronous** — calls return immediately and resolve later — so reading megabytes never freezes rendering. This is the core trade-off: Web Storage is simpler but blocking; IndexedDB is more work but non-blocking and built for volume.",
      "**IndexedDB's transactional model.** All reads and writes happen inside a **transaction** scoped to one or more object stores, with a mode of `readonly` or `readwrite`. A transaction gives you **atomicity** — if any operation fails the whole thing rolls back — and the database **version** drives schema changes: bump the version number and an `upgradeneeded` event fires where you create or alter object stores and indexes. This is the same open-migrate-on-version-bump discipline you'd use for a server database.",
      "**Cross-tab communication with the `storage` event.** Because `localStorage` is shared across tabs, writing to it in one tab fires a `storage` event in **every other tab** of the same origin (not the tab that made the change). This is a handy, zero-dependency way to sync state — e.g. log the user out everywhere when they log out in one tab. For richer messaging prefer the `BroadcastChannel` API, but the `storage` event is the classic trick worth knowing.",
      "**Quotas, eviction, and failure modes.** Web Storage throws a `QuotaExceededError` when you exceed its ~5–10 MB cap, so writes should be wrapped in `try/catch`. IndexedDB shares a larger, browser-managed quota you can inspect with `navigator.storage.estimate()`, and can request durability with `navigator.storage.persist()`. Under storage pressure (or in a private/incognito window) browsers may **evict** best-effort data, so never treat client storage as a source of truth — it is a cache and a convenience, and the server remains authoritative.",
      "**Security: never trust the client, never store secrets in Web Storage.** Any script running on your page — including one injected by an XSS bug or a compromised third-party dependency — can read all of `localStorage` and `sessionStorage`. That makes them the **wrong place for auth tokens, JWTs, API keys, or PII**. The safe pattern for session credentials is an `HttpOnly`, `Secure`, `SameSite` cookie that JavaScript literally cannot read. Store only non-sensitive UI state client-side, and validate anything that came from storage before you trust it.",
      "**How the four compare at a glance.**\n\n| Storage | Capacity | Persistence | Read by server? | Sync/Async | Typical use |\n| --- | --- | --- | --- | --- | --- |\n| localStorage | ~5–10 MB | Until cleared | No | Sync | Preferences, theme, feature flags |\n| sessionStorage | ~5–10 MB | Until tab closes (per-tab) | No | Sync | Form drafts, one-visit scratch data |\n| Cookies | ~4 KB | Configurable (Expires/Max-Age) | Yes (every request) | Sync | Session IDs / auth (HttpOnly+Secure) |\n| IndexedDB | Hundreds of MB+ | Until cleared/evicted | No | Async | Offline caches, large/binary datasets |",
      "**The mental model (memorise this).** Match store to job on three axes — capacity, lifetime, and who reads it. Small durable UI state → `localStorage`; small per-tab scratch → `sessionStorage`; server-read auth → an `HttpOnly` cookie; large, structured, or binary data → `IndexedDB` (async, transactional). Web Storage is synchronous string-only (serialize with JSON); IndexedDB is async and structured-clone. And the constant: client storage is a cache, never a secret vault and never the source of truth.",
    ],
    backendAnalogy:
      "Think of localStorage/sessionStorage as a tiny synchronous in-process key-value cache — a small ConcurrentHashMap<String,String> that happens to survive a restart (localStorage) or is request-scoped and thrown away (sessionStorage). IndexedDB is the browser's embedded database, the client-side equivalent of H2 or SQLite: you open it, run schema migrations on a version bump (like Flyway/Liquibase), and do all work inside transactions that are atomic and async — much like Vert.x's non-blocking JDBC client where calls return a Future instead of blocking the event loop. Cookies are the classic session id you'd manage server-side in Spring Session: stamped once, sent on every request, and read by the server — HttpOnly/Secure/SameSite are just the flags on that Set-Cookie header. The golden rule mirrors the backend one: never trust the client and never keep secrets there — the server stays the source of truth, exactly as you'd never let a client-supplied value bypass validation.",
    keyInsights: [
      "Match the store to the job on three axes: capacity (how much), lifetime (when it is wiped), and who reads it (script only vs the server too).",
      "localStorage and sessionStorage share one identical synchronous string-only API; the ONLY difference is lifetime — localStorage persists and is shared across tabs, sessionStorage is per-tab and cleared on tab close.",
      "Web Storage holds strings only: JSON.stringify on write, JSON.parse with a fallback on read; serialization is lossy (Date becomes a string, Map/Set/undefined are lost).",
      "NEVER store secrets, JWTs, API keys, or PII in Web Storage — any script (including an XSS payload) can read it. Use HttpOnly + Secure + SameSite cookies for auth.",
      "Cookies are ~4 KB and auto-sent on every request; their power is server-readability for auth, controlled by Expires/Max-Age, Secure, HttpOnly, and SameSite attributes.",
      "IndexedDB is the async, transactional, structured-clone database for large or binary data — hundreds of MB, indexes, cursors; wrap its verbose native API with the idb library.",
      "Sync (Web Storage) blocks the main thread — fine for tiny values, janky for big blobs; async (IndexedDB) never freezes the UI, which is why it scales to megabytes.",
      "The storage event fires in OTHER tabs when localStorage changes — a zero-dependency way to sync state (e.g. log out everywhere); BroadcastChannel is the richer alternative.",
      "Expect failure: Web Storage throws QuotaExceededError near ~5–10 MB, and browsers can evict client data under pressure or in private mode — treat all client storage as a cache, never the source of truth.",
      "IndexedDB schema changes happen in the upgradeneeded event triggered by bumping the database version — the same open-and-migrate discipline as a server database.",
    ],
    codeSamples: [
      {
        label: "Web Storage — the full API, objects, and safe parsing",
        language: "ts",
        code: `// The Web Storage API is identical for localStorage and sessionStorage.
// It is SYNCHRONOUS and STRING-ONLY.

localStorage.setItem('theme', 'dark');      // write a string
const theme = localStorage.getItem('theme'); // 'dark' (or null if absent)
localStorage.removeItem('theme');            // delete one key
// localStorage.clear();                     // wipe everything for this origin

// Objects MUST be serialized — writing an object stores "[object Object]".
const prefs = { theme: 'dark', lang: 'en', updatedAt: Date.now() };
localStorage.setItem('prefs', JSON.stringify(prefs));

// Always guard the parse: a missing key returns null.
function readPrefs(): Record<string, unknown> {
  try {
    return JSON.parse(localStorage.getItem('prefs') ?? '{}');
  } catch {
    return {}; // corrupted value — fall back instead of crashing
  }
}

// Writes can fail — wrap large writes so QuotaExceededError never crashes the app.
try {
  localStorage.setItem('bigCache', JSON.stringify(largePayload));
} catch (err) {
  if (err instanceof DOMException && err.name === 'QuotaExceededError') {
    console.warn('Storage full — skipping cache write');
  }
}`,
      },
      {
        label: "Cross-tab sync with the storage event",
        language: "js",
        code: `// Writing to localStorage in ONE tab fires a 'storage' event in
// every OTHER tab of the same origin (never in the tab that wrote it).

// Tab A logs out:
localStorage.setItem('auth', JSON.stringify({ loggedIn: false }));

// Every other tab reacts and syncs its UI:
window.addEventListener('storage', (e) => {
  if (e.key === 'auth') {
    const next = JSON.parse(e.newValue ?? '{}');
    console.log('auth changed in another tab ->', next.loggedIn);
    if (!next.loggedIn) redirectToLogin();
  }
});

function redirectToLogin() { /* ... */ }`,
      },
      {
        label: "Cookies with security attributes (client + server)",
        language: "js",
        code: `// Setting a NON-sensitive cookie from the client via document.cookie.
// Note: you CANNOT set HttpOnly from JS — that flag is server-only by design.
document.cookie =
  'lang=en; Max-Age=31536000; Path=/; Secure; SameSite=Lax';

// Reading is clumsy — document.cookie is one big string:
function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')[1];
}
console.log('lang cookie:', getCookie('lang'));

// AUTH cookies belong on the server. Example Set-Cookie header the
// backend sends — HttpOnly means script (and XSS) can never read it:
//   Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
      },
      {
        label: "IndexedDB via the idb wrapper — stores, indexes, transactions",
        language: "ts",
        code: `import { openDB, type DBSchema } from 'idb';

interface ExpenseDB extends DBSchema {
  expenses: {
    key: number;
    value: { id: number; amount: number; category: string; note?: string };
    indexes: { 'by-category': string };
  };
}

// Opening triggers 'upgrade' only when the version number increases —
// this is where schema migrations live (like a server DB migration).
const db = await openDB<ExpenseDB>('ExpenseDB', 1, {
  upgrade(database) {
    const store = database.createObjectStore('expenses', { keyPath: 'id' });
    store.createIndex('by-category', 'category');
  },
});

// Writes and reads are async (Promises) — they never block the main thread.
await db.put('expenses', { id: 1, amount: 120, category: 'meals' });
await db.put('expenses', { id: 2, amount: 40, category: 'transit' });

const all = await db.getAll('expenses');                       // every row
const meals = await db.getAllFromIndex('expenses', 'by-category', 'meals');

// A manual transaction spanning multiple ops is atomic (all-or-nothing):
const tx = db.transaction('expenses', 'readwrite');
await tx.store.delete(2);
await tx.done; // commit; if any op throws, the whole tx rolls back

console.log('rows:', all.length, 'meals:', meals.length);`,
      },
      {
        label: "Inspecting quota and requesting durable storage",
        language: "js",
        code: `// The Storage API reports how much you have used and been granted.
if (navigator.storage && navigator.storage.estimate) {
  const { usage, quota } = await navigator.storage.estimate();
  const pct = ((usage / quota) * 100).toFixed(1);
  console.log(\`Using \${usage} of \${quota} bytes (\${pct}%)\`);
}

// Ask the browser NOT to evict this origin's data under storage pressure.
if (navigator.storage && navigator.storage.persist) {
  const persistent = await navigator.storage.persist();
  console.log('Persistent storage granted:', persistent);
}`,
      },
    ],
    runnable: {
      title: "Web Storage: lifetimes, serialization, and the sync API",
      js: `// 1) localStorage vs sessionStorage — same API, different lifetime.
localStorage.setItem('theme', 'dark');       // persists across tabs & reloads
sessionStorage.setItem('draft', 'unsaved');  // dies when this tab closes
console.log('theme (local):', localStorage.getItem('theme'));
console.log('draft (session):', sessionStorage.getItem('draft'));

// 2) Objects must be serialized — everything is a string.
const prefs = { theme: 'dark', lang: 'en', updatedAt: 1719800000000 };
localStorage.setItem('prefs', JSON.stringify(prefs));

// Safe read with a fallback so a missing/corrupt key never crashes us.
function readPrefs() {
  try { return JSON.parse(localStorage.getItem('prefs') || '{}'); }
  catch { return {}; }
}
const loaded = readPrefs();
console.log('parsed lang:', loaded.lang);

// 3) Serialization is LOSSY — a Date round-trips as a string, not a Date.
localStorage.setItem('when', JSON.stringify({ d: new Date(0) }));
const back = JSON.parse(localStorage.getItem('when'));
console.log('typeof restored date:', typeof back.d, '->', back.d);

// 4) Clean up so re-running the demo starts fresh.
localStorage.removeItem('theme');
localStorage.removeItem('prefs');
localStorage.removeItem('when');
sessionStorage.removeItem('draft');
console.log('after cleanup, theme =', localStorage.getItem('theme'));`,
    },
    interviewQA: [
      {
        question:
          "Compare localStorage, sessionStorage, cookies, and IndexedDB — when would you use each?",
        answer:
          "localStorage and sessionStorage are ~5–10 MB synchronous string key-value stores sharing one API; localStorage persists until cleared and is shared across tabs (preferences, theme), while sessionStorage is per-tab and cleared on close (form drafts, one-visit scratch). Cookies are ~4 KB and auto-sent to the server on every request, ideal for auth session IDs as HttpOnly+Secure. IndexedDB is an async, transactional, structured-clone database holding hundreds of MB with indexes and binary support — use it for offline caches and large datasets. Match by capacity, lifetime, and whether the server needs to read it.",
      },
      {
        question: "Why shouldn't you store a JWT or auth token in localStorage?",
        answer:
          "Any JavaScript on the page can read localStorage, so a single XSS bug (or a compromised dependency) lets an attacker exfiltrate the token. localStorage also has no HttpOnly protection and is not sent automatically for the server to validate. The safer pattern is an HttpOnly, Secure, SameSite cookie that script cannot read and the server validates on each request — keeping the credential entirely out of the script's reach.",
      },
      {
        question: "How do you store and retrieve an object in Web Storage, and what are the pitfalls?",
        answer:
          "Web Storage only holds strings, so serialize on write with JSON.stringify and deserialize on read with JSON.parse — e.g. setItem('prefs', JSON.stringify(obj)) then JSON.parse(getItem('prefs') ?? '{}'). Pitfalls: writing an object directly stores the string '[object Object]'; a missing key returns null and can throw on parse, so always provide a fallback and try/catch; and serialization is lossy — Date becomes an ISO string, and undefined, functions, Map, and Set don't survive.",
      },
      {
        question: "When is IndexedDB the right tool over localStorage, and why is async important?",
        answer:
          "Use IndexedDB when you need more than a few small values: large datasets, binary blobs (Blob/ArrayBuffer), indexed or ranged queries, or offline-first caching. It is asynchronous, so reading megabytes never blocks the main thread or janks the UI, whereas localStorage is synchronous and blocks on every call. IndexedDB is also transactional and uses structured clone, preserving richer types, and scales to hundreds of MB versus localStorage's ~5–10 MB cap. Use the idb library to tame its verbose native API.",
      },
      {
        question: "What are the important cookie attributes and what does each do?",
        answer:
          "Expires/Max-Age set lifetime (omit both for a session cookie); Domain and Path scope which requests receive it; Secure restricts it to HTTPS; HttpOnly hides it from document.cookie so script and XSS cannot read it; and SameSite (Strict/Lax/None) controls whether the cookie is sent on cross-site requests, which is the primary CSRF defense. For auth you typically combine HttpOnly, Secure, and SameSite=Strict or Lax.",
      },
      {
        question: "How can two tabs of the same app stay in sync using storage?",
        answer:
          "Because localStorage is shared across tabs of the same origin, writing to it fires a 'storage' event in every OTHER tab (not the one that wrote it), carrying key, oldValue, and newValue. You can listen for it to react to changes — for example, logging the user out everywhere when they log out in one tab. For richer or higher-frequency messaging, the BroadcastChannel API is a cleaner alternative.",
      },
      {
        question: "What happens when client storage runs out or the browser is in private mode?",
        answer:
          "Web Storage throws a QuotaExceededError once you exceed roughly 5–10 MB, so writes of large data should be wrapped in try/catch. IndexedDB shares a larger, browser-managed quota you can inspect with navigator.storage.estimate() and can protect with navigator.storage.persist(). Under storage pressure or in private/incognito windows, browsers may evict best-effort data, so client storage must be treated as a cache — the server remains the source of truth.",
      },
      {
        question: "How does schema versioning work in IndexedDB?",
        answer:
          "You open a database with a name and an integer version. When you increase the version, the browser fires an upgradeneeded event where you create or modify object stores and indexes — this is the only place schema changes are allowed. It is the same open-and-migrate-on-version-bump discipline used for server databases, and it lets existing users' data migrate forward safely when you ship a new schema.",
      },
    ],
    thingsToRemember: [
      "Choose by three axes: capacity, lifetime, and who reads it (script vs server).",
      "localStorage = persists, shared across tabs; sessionStorage = per-tab, cleared on close; both sync and string-only.",
      "Serialize objects: JSON.stringify on write, JSON.parse with a fallback on read — and remember it's lossy.",
      "Never put secrets/JWTs/PII in Web Storage; use HttpOnly + Secure + SameSite cookies for auth.",
      "Cookies are ~4 KB, auto-sent to the server; attributes Expires/Max-Age, Secure, HttpOnly, SameSite control lifetime and safety.",
      "IndexedDB = async, transactional, structured-clone, hundreds of MB, indexes/cursors — use the idb wrapper.",
      "Sync blocks the main thread (fine for tiny values, janky for big blobs); async IndexedDB never freezes the UI.",
      "The storage event syncs other tabs; BroadcastChannel is the richer option.",
      "Handle QuotaExceededError and expect eviction in private mode — client storage is a cache, not the source of truth.",
      "IndexedDB schema changes only happen in upgradeneeded, triggered by bumping the version number.",
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
      {
        label: "MDN — Using HTTP cookies",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
      },
      {
        label: "MDN — Storage quotas and eviction criteria",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria",
      },
      {
        label: "web.dev — Storage for the web",
        url: "https://web.dev/articles/storage-for-the-web",
      },
      {
        label: "idb — a tiny promise-based IndexedDB wrapper",
        url: "https://github.com/jakearchibald/idb",
      },
    ],
    tags: ["storage", "localstorage", "sessionstorage", "indexeddb", "cookies", "offline", "serialization", "quota", "web-storage"],
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
