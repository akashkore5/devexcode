import type { FrontendTopic } from "../types";

export const partI: FrontendTopic[] = [
  {
    id: "sqlite-client-side",
    num: 32,
    title: "SQLite (Client-Side)",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Advanced",
    summary:
      "Run a real, full-featured SQL database inside the browser tab with sql.js (SQLite compiled to WebAssembly): joins, indexes, transactions and prepared statements on the client, plus durable persistence via IndexedDB or the Origin Private File System for genuinely offline-first apps.",
    readingTime: 16,
    explanation: [
      "**What client-side SQLite actually is.** For a long time the browser only offered key-value storage (`localStorage`), a clunky deprecated SQL API (WebSQL), and an object store (IndexedDB). None of them gives you *relational* querying. Client-side SQLite fixes that by taking the real, battle-tested SQLite C engine, compiling it to **WebAssembly**, and running it inside the page. The most popular build is **sql.js**; there is also the official **`@sqlite.org/sqlite-wasm`** distribution. Either way you get the exact same SQL dialect that ships on billions of phones — running in a tab.",
      "**Why you would want a database in the browser.** Three scenarios dominate. (1) **Offline-first apps** — a field-service or note-taking app that must work with no network and sync later. (2) **Rich local querying** — dashboards that need `JOIN`, `GROUP BY`, window functions, and multi-column sorting over thousands of local rows, which are miserable to hand-code against IndexedDB. (3) **Shipping a read-only dataset** — a documentation search index or a pricing table you download once as a `.sqlite` file and query instantly on the client, saving round-trips.",
      "**Initializing the WASM module.** sql.js is asynchronous to start because it must fetch and compile the `.wasm` binary. You call `initSqlJs({ locateFile })`, where `locateFile` tells it where the `sql-wasm.wasm` file is hosted (a CDN or your own `/public` path). The returned `SQL` object is the module; `new SQL.Database()` creates a fresh in-memory database, and `new SQL.Database(bytes)` restores one from a `Uint8Array` of a previously saved SQLite file.",
      "**Running SQL: `run`, `exec`, and prepared statements.** `db.run(sql, params)` executes a statement that returns nothing (DDL, `INSERT`, `UPDATE`, `DELETE`). `db.exec(sql, params)` runs one or more statements and returns an array of result sets, each with `columns` and `values` arrays. For repeated queries, `db.prepare(sql)` gives you a reusable **statement object** you `bind`, `step`, and `getAsObject` over — the fastest and cleanest path for loops. Because it is real SQLite you get transactions (`BEGIN`/`COMMIT`), indexes, foreign keys, and even `EXPLAIN QUERY PLAN`.",
      "**Always parameterize — never concatenate.** The `?` placeholders with a values array are not just about SQL injection (though they defend against it exactly like a server prepared statement); they also handle quoting, escaping, and type coercion for you. String-building queries (`'... WHERE name = \"' + input + '\"'`) is a bug factory even on the client, where a malicious value could still corrupt or exfiltrate the user's own local data. Treat client SQL with the same discipline as server SQL.",
      "**The persistence problem.** This is the number-one gotcha: **a sql.js `Database` lives entirely in memory**, so it evaporates on reload. Persistence is *your* job. The classic pattern is `db.export()`, which serializes the whole database to a `Uint8Array` (the bytes of a real `.sqlite` file), and then writing those bytes into **IndexedDB** under a fixed key. On startup you read the bytes back and pass them to `new SQL.Database(bytes)`. Because serializing the entire DB on every keystroke is wasteful, you **debounce** the export (e.g. save at most once per second, or on `visibilitychange`).",
      "**The Origin Private File System (OPFS) — the modern answer.** Re-serializing the whole database is fine for small data but painful past a few megabytes. The **Origin Private File System** gives a page a private, high-performance, sandboxed file area. The official SQLite WASM build ships an **OPFS VFS** that writes pages directly to a real file, so the database is durable *incrementally* — no full export needed — and can be far larger. OPFS synchronous access handles require running inside a **Web Worker**, which is also where you want a heavy DB anyway to keep the main thread responsive.",
      "**Run it off the main thread.** SQL over thousands of rows, and especially the WASM compile step, can jank your UI if done on the main thread. The production shape is: put sql.js/sqlite-wasm inside a **Web Worker**, post query messages to it, and post results back. Libraries such as **absurd-sql** and the official OPFS worker pattern formalize this. Your React components then talk to a thin async client rather than the engine directly.",
      "**sql.js vs IndexedDB — the real trade-off.** IndexedDB is built in (no download), asynchronous, and great for key-value or single-object-store lookups by index. sql.js/sqlite-wasm adds a **sizable WASM payload** (hundreds of KB) but gives you the full relational model. Rule of thumb: reach for SQLite when your data is relational and your queries are genuinely complex (joins, aggregates, ad-hoc reporting); stick with IndexedDB for simple caches and blob storage. They are not mutually exclusive — SQLite frequently *persists into* IndexedDB.",
      "**Security and quota realities.** Everything here lives in the user's browser, scoped to your origin and subject to storage **quotas** and eviction under storage pressure (call `navigator.storage.persist()` to request durability). Never store secrets you would not want the user to read — it is their machine and their DevTools. Treat the client DB as a **cache and offline buffer**, with the server remaining the source of truth you reconcile against when back online.",
      "**Syncing back to the server.** Offline-first means eventual consistency. Common strategies: keep an **outbox** table of pending mutations that you flush when connectivity returns; stamp rows with `updated_at` and use **last-write-wins** or version vectors; or adopt CRDT-based sync. The client SQLite database is the local authority while offline, then you replay the outbox and pull server changes on reconnect.",
      "**The mental model (memorise this).** Client-side SQLite is the real SQLite engine compiled to WebAssembly, running in a tab (ideally in a Worker): it gives you true relational SQL with parameterized queries, but it is in-memory by default so you must persist it yourself — export bytes to IndexedDB for small data, or use the OPFS VFS for large, incrementally-durable storage — while the server stays the source of truth you sync against.",
    ],
    backendAnalogy:
      "This is literally the same SQLite engine you would embed in a JVM app via `sqlite-jdbc` or use as an in-memory H2 database in a Spring integration test — just compiled to WebAssembly and running in the browser instead of on the server. The `?` placeholders are a `PreparedStatement`: parameters are bound out-of-band, so injection and quoting are handled by the driver, not by you. The in-memory-by-default behaviour mirrors an H2 `jdbc:h2:mem:` database that you snapshot to disk with `SCRIPT TO`; exporting bytes to IndexedDB is your `mysqldump`/backup step. Running the engine in a Web Worker is the frontend version of keeping blocking JDBC off the Vert.x event loop by pushing it onto a worker/`executeBlocking` pool — same instinct, same reason: never block the single thread that keeps the UI (or the event loop) responsive.",
    keyInsights: [
      "sql.js and @sqlite.org/sqlite-wasm are the real SQLite C engine compiled to WebAssembly, giving you true relational SQL (joins, aggregates, indexes, transactions) in the browser.",
      "Initialization is async because the .wasm binary must be fetched and compiled; locateFile points the loader at the hosted binary.",
      "db.run executes statements that return nothing; db.exec returns result sets; db.prepare gives reusable prepared statements for loops.",
      "Always use parameterized queries with the ? placeholder and a values array, never string concatenation, even on the client.",
      "A sql.js Database is in-memory by default and is lost on reload; persistence is your responsibility.",
      "The classic persistence pattern is db.export() to a Uint8Array, stored in IndexedDB under a fixed key, and restored via new SQL.Database(bytes) on startup.",
      "The Origin Private File System (OPFS) VFS makes the database incrementally durable without full re-export and supports much larger databases.",
      "Run the engine inside a Web Worker to keep heavy queries and the WASM compile step off the main thread; OPFS sync access handles require a Worker anyway.",
      "Choose SQLite over IndexedDB when data is relational and queries are complex; IndexedDB is lighter and built in for simple key-value caching.",
      "The client database is a cache and offline buffer subject to storage quotas and eviction; the server remains the source of truth you sync against.",
    ],
    codeSamples: [
      {
        label: "sql.js — initialize, create tables, parameterized CRUD",
        language: "ts",
        code: `// sql.js — full SQLite engine in the browser via WebAssembly
import initSqlJs, { type Database } from 'sql.js';

async function initDB(): Promise<Database> {
  // Async: the .wasm binary must be fetched + compiled first.
  const SQL = await initSqlJs({
    // Point the loader at the hosted sql-wasm.wasm file (CDN or /public).
    locateFile: (file) => \`https://sql.js.org/dist/\${file}\`,
  });

  const db = new SQL.Database(); // fresh in-memory database

  // DDL: real SQLite — indexes, constraints, defaults all supported.
  db.run(\`
    CREATE TABLE IF NOT EXISTS expenses (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      amount     REAL    NOT NULL,
      category   TEXT    NOT NULL,
      created_at TEXT    DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_expenses_cat ON expenses(category);
  \`);

  // INSERT — ALWAYS parameterized (? placeholders + values array).
  db.run('INSERT INTO expenses (amount, category) VALUES (?, ?)', [120, 'meals']);
  db.run('INSERT INTO expenses (amount, category) VALUES (?, ?)', [40, 'transit']);

  // Relational query with aggregation — the reason to use SQLite over IndexedDB.
  const rows = db.exec(
    'SELECT category, SUM(amount) AS total FROM expenses GROUP BY category ORDER BY total DESC'
  );
  console.log(rows[0]?.columns); // ['category', 'total']
  console.log(rows[0]?.values);  // [['meals', 120], ['transit', 40]]

  return db;
}`,
      },
      {
        label: "Prepared statements — the fast path for loops",
        language: "ts",
        code: `// Reuse one compiled statement across many rows.
function insertMany(db: import('sql.js').Database, items: { amount: number; category: string }[]) {
  db.run('BEGIN TRANSACTION');            // batch = one durable, atomic write
  const stmt = db.prepare('INSERT INTO expenses (amount, category) VALUES (?, ?)');
  try {
    for (const it of items) {
      stmt.bind([it.amount, it.category]); // rebind params each iteration
      stmt.step();                         // execute
      stmt.reset();                        // ready for next bind
    }
    db.run('COMMIT');
  } catch (e) {
    db.run('ROLLBACK');
    throw e;
  } finally {
    stmt.free();                           // release the compiled statement
  }
}

// Read back as objects (nicer than columns/values arrays).
function recentExpenses(db: import('sql.js').Database, limit: number) {
  const stmt = db.prepare('SELECT * FROM expenses ORDER BY created_at DESC LIMIT ?');
  stmt.bind([limit]);
  const out: Record<string, unknown>[] = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}`,
      },
      {
        label: "Persist to IndexedDB — export bytes, restore on startup",
        language: "ts",
        code: `// A sql.js DB is in-memory only. Persist by exporting the raw .sqlite bytes.
const DB_KEY = 'app-db-v1';

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('sqlite-store', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('files');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Debounced save: never serialize the whole DB on every keystroke.
let saveTimer: ReturnType<typeof setTimeout> | undefined;
export function scheduleSave(db: import('sql.js').Database) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const bytes = db.export();                 // Uint8Array = full .sqlite file
    const conn = await idb();
    const tx = conn.transaction('files', 'readwrite');
    tx.objectStore('files').put(bytes, DB_KEY);
  }, 1000);
}

// On startup: read bytes back and rehydrate, or start empty.
export async function loadBytes(): Promise<Uint8Array | undefined> {
  const conn = await idb();
  return new Promise((resolve) => {
    const req = conn.transaction('files').objectStore('files').get(DB_KEY);
    req.onsuccess = () => resolve(req.result as Uint8Array | undefined);
    req.onerror = () => resolve(undefined);
  });
}
// const db = bytes ? new SQL.Database(bytes) : new SQL.Database();`,
      },
      {
        label: "Official SQLite WASM with the OPFS VFS (durable, in a Worker)",
        language: "ts",
        code: `// worker.ts — heavy DB work off the main thread, incrementally durable via OPFS.
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

async function start() {
  const sqlite3 = await sqlite3InitModule();

  // OPFS-backed database: writes go straight to a real sandboxed file,
  // so it survives reloads WITHOUT any manual export step.
  if ('opfs' in sqlite3) {
    const db = new sqlite3.oo1.OpfsDb('/app.sqlite3');
    db.exec('CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY, body TEXT)');
    db.exec({ sql: 'INSERT INTO notes(body) VALUES (?)', bind: ['persists across reloads'] });
    const rows: unknown[] = [];
    db.exec({ sql: 'SELECT * FROM notes', rowMode: 'object', resultRows: rows });
    postMessage({ type: 'rows', rows });
  } else {
    // Fallback: transient in-memory DB (persist via export/IndexedDB instead).
    postMessage({ type: 'no-opfs' });
  }
}
start();

// Note: OPFS synchronous access handles REQUIRE running inside a Web Worker,
// and the page must be cross-origin isolated (COOP/COEP headers) for some builds.`,
      },
    ],
    runnable: {
      title: "Simulate a tiny in-memory 'SQL' store with parameterized queries",
      html: `<h3>Client-side relational store (concept demo)</h3>
<button id="seed">Seed rows</button>
<button id="query">GROUP BY category</button>
<pre id="out" style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;min-height:60px;"></pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
button { margin-right: 8px; padding: 8px 14px; border: 0; border-radius: 8px; background:#4f46e5; color:#fff; cursor:pointer; }`,
      js: `// This mimics what sql.js gives you (real sql.js needs a WASM fetch).
// Key ideas illustrated: an in-memory table + PARAMETERIZED access.
const table = []; // pretend this is CREATE TABLE expenses(...)

function run(row) {                     // like db.run('INSERT ... VALUES (?, ?)', [...])
  table.push({ id: table.length + 1, ...row });
}
// Parameterized "query": params passed separately, never string-concatenated.
function groupByCategory() {            // like SELECT category, SUM(amount) ... GROUP BY
  const totals = {};
  for (const r of table) totals[r.category] = (totals[r.category] || 0) + r.amount;
  return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

const out = document.getElementById('out');
document.getElementById('seed').onclick = () => {
  table.length = 0;
  run({ amount: 120, category: 'meals' });
  run({ amount: 40, category: 'transit' });
  run({ amount: 80, category: 'meals' });
  out.textContent = 'Rows inserted: ' + table.length;
  console.log('table', table);
};
document.getElementById('query').onclick = () => {
  const rows = groupByCategory();
  out.textContent = 'category | total\\n' + rows.map(r => r[0] + ' | ' + r[1]).join('\\n');
  console.log('GROUP BY result', rows);
};`,
    },
    interviewQA: [
      {
        question: "When would you choose client-side SQLite over IndexedDB?",
        answer:
          "When your data is relational and your queries are complex — joins, aggregations, GROUP BY, window functions, multi-column sorting. IndexedDB is an object store and forces you to hand-roll those operations in JavaScript, whereas sql.js lets you express them declaratively in SQL and lean on real indexes and a query planner. The cost is a sizable WASM payload, so for simple key-value or blob caching IndexedDB is lighter and built in. They also compose: SQLite frequently persists its bytes into IndexedDB.",
      },
      {
        question: "How do you persist a sql.js database across reloads?",
        answer:
          "The default Database lives in memory, so you call db.export() to get a Uint8Array of the raw SQLite file, then store those bytes in IndexedDB under a fixed key. On startup you read the bytes back and pass them to new SQL.Database(bytes) to restore state. You debounce the export so you are not serializing the whole database on every write. For larger data, use the official sqlite-wasm OPFS VFS, which writes pages to a real sandboxed file and is durable incrementally with no export step.",
      },
      {
        question: "Why should you run the SQLite WASM engine in a Web Worker?",
        answer:
          "Two reasons. First, the WASM compile step and heavy queries over thousands of rows can block the main thread and jank the UI; a Worker keeps them off it. Second, the OPFS synchronous access handles that give the best persistence performance are only available inside a Worker. So the production shape is: engine in a Worker, components post query messages and receive results back through a thin async client.",
      },
      {
        question: "Do parameterized queries matter on the client, since there is no server?",
        answer:
          "Yes. The ? placeholders defend against SQL injection exactly like a server prepared statement, but even setting injection aside they handle quoting, escaping and type coercion correctly. A user-supplied value with quotes or special characters will break or corrupt a concatenated query. And the data is the user's own — a malformed query can still trash their local state. Treat client SQL with the same discipline as server SQL.",
      },
      {
        question: "What are the storage and durability caveats of a browser SQLite database?",
        answer:
          "It is scoped to your origin and subject to browser storage quotas and eviction under storage pressure, so it can be cleared. You can request durability with navigator.storage.persist(). It is fully readable by the user in DevTools, so never store secrets there. Treat it as a cache and offline buffer, keep the server as the source of truth, and sync via an outbox of pending mutations plus updated_at timestamps or CRDTs on reconnect.",
      },
      {
        question: "What is the difference between db.run, db.exec, and db.prepare in sql.js?",
        answer:
          "db.run executes a statement and returns nothing — use it for DDL and for INSERT/UPDATE/DELETE. db.exec runs one or more statements and returns an array of result sets, each with columns and values arrays — convenient for one-off reads. db.prepare compiles a statement once and returns a reusable statement object you bind, step and reset over, which is the fastest and cleanest option inside loops and batch inserts.",
      },
    ],
    thingsToRemember: [
      "Client-side SQLite = the real SQLite C engine compiled to WebAssembly (sql.js or @sqlite.org/sqlite-wasm).",
      "Initialization is async; locateFile tells the loader where sql-wasm.wasm lives.",
      "run = no result; exec = result sets; prepare = reusable statement for loops/batches.",
      "Always parameterize with ? and a values array — never concatenate, even on the client.",
      "A sql.js DB is in-memory by default and lost on reload; persistence is your job.",
      "Persist small data via db.export() to a Uint8Array stored in IndexedDB (debounced); restore with new SQL.Database(bytes).",
      "For large data use the OPFS VFS — incrementally durable, no full export, requires a Web Worker.",
      "Run the engine in a Web Worker to keep the WASM compile and heavy queries off the main thread.",
      "Prefer SQLite for relational/complex queries; IndexedDB for simple key-value/blob caching.",
      "It is a cache/offline buffer under storage quotas — the server stays the source of truth; sync via an outbox.",
    ],
    references: [
      { label: "sql.js — GitHub & docs", url: "https://github.com/sql-js/sql.js" },
      { label: "SQLite — WebAssembly (WASM) docs", url: "https://sqlite.org/wasm/doc/trunk/index.md" },
      { label: "MDN — IndexedDB API", url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" },
      { label: "MDN — Origin Private File System", url: "https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system" },
      { label: "web.dev — Deep-dive into OPFS", url: "https://web.dev/articles/origin-private-file-system" },
      { label: "MDN — StorageManager.persist()", url: "https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist" },
    ],
    tags: ["sqlite", "wasm", "webassembly", "offline", "storage", "sql.js", "opfs", "indexeddb", "web-worker"],
  },
  {
    id: "firebase-firestore-realtime-database",
    num: 33,
    title: "Firebase DB (Firestore / Realtime Database)",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Core",
    summary:
      "Cloud-hosted NoSQL from Google with built-in real-time synchronization: CRUD plus live onSnapshot listeners, declarative queries, server-enforced security rules, and transparent offline persistence — a backend-as-a-service that removes the transport, auth and reconnection plumbing.",
    readingTime: 15,
    explanation: [
      "**What Firebase gives you.** Firebase is a backend-as-a-service. Its two databases — **Cloud Firestore** (the modern default) and the older **Realtime Database (RTDB)** — are cloud-hosted NoSQL stores with **real-time synchronization** baked in. You do not run a server, open sockets, or manage reconnection; you import the SDK, initialize your app config, and read/write data with helper functions. The database itself pushes changes to every connected client.",
      "**Firestore's data model.** Firestore stores **documents** (JSON-like maps with typed fields) inside **collections**. Documents can contain **subcollections**, forming a hierarchy. There are no rows or tables and no server-side JOINs — you model for your reads, often denormalizing. A document is addressed by a path like `collection/docId/subcollection/docId`. This document/collection shape is what enables Firestore's rich, indexed querying, which RTDB (a single big JSON tree) lacks.",
      "**The modular SDK.** Modern Firebase (v9+) is **tree-shakeable and functional**: instead of `db.collection('x').where(...)`, you import only the functions you use — `initializeApp`, `getFirestore`, `collection`, `doc`, `addDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`, `query`, `where`, `orderBy`, `limit`, and `onSnapshot`. This keeps your bundle small because unused features are dropped by the bundler.",
      "**The defining feature: real-time listeners.** Instead of polling, you subscribe to a document or query with **`onSnapshot`**. The callback fires **immediately** with the current data and **again on every subsequent change** — inserts, updates, and deletes to matching documents — keeping your local UI in perfect sync with the server automatically. This push model is the whole reason to reach for Firebase over a plain REST API.",
      "**Reading the snapshot correctly.** The snapshot passed to your callback has `.docs` (each with `.id` and `.data()`), plus `.metadata.hasPendingWrites` (true while a local write is not yet acknowledged by the server) and `.docChanges()` (the exact added/modified/removed deltas, useful for animating lists). You typically map `snapshot.docs` into your state, merging the document id with its data.",
      "**You MUST unsubscribe.** `onSnapshot` returns an **unsubscribe function**. In React you return it from `useEffect` so the listener is torn down when the component unmounts or when the query dependencies change. Forgetting this leaks listeners, causes duplicate updates and stale UI, and keeps consuming reads against your billing quota. This is the single most common Firebase bug in React apps.",
      "**Writes: add, set, update, delete.** `addDoc(collection, data)` creates a document with an auto-generated id. `setDoc(doc(db, 'c', id), data)` writes at a known id (with `{ merge: true }` to patch instead of overwrite). `updateDoc(doc(...), partial)` patches specific fields. `deleteDoc(doc(...))` removes it. For counters and arrays use **field transforms**: `increment(1)`, `arrayUnion(x)`, `arrayRemove(x)`, and `serverTimestamp()` for a trustworthy server-side time.",
      "**Querying and its constraints.** You compose queries declaratively: `query(collection(db, 'expenses'), where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(20))`. Firestore is fast because **every query is index-backed** — but compound queries require **composite indexes**, and the SDK will throw an error with a one-click link to create the missing index. Firestore forbids inefficient queries by design: no `OR` across different fields historically (now limited `or()` support), no full-text search (use Algolia/Typesense), and range filters on only one field.",
      "**Security rules run on the server.** Because the client talks straight to the database, **Firestore Security Rules** are your real authorization layer — they are enforced server-side and cannot be bypassed by a tampered client. Rules are declarative: you `match` document paths and `allow read/write` conditioned on `request.auth.uid`, the incoming data, and the existing document. Never trust the client; validate shape and ownership in rules, not just in your UI. This is the mental shift from a traditional backend where your controllers guard access.",
      "**Offline persistence for free.** Firestore caches data locally and **queues writes while offline**, then syncs when connectivity returns — `onSnapshot` even fires against the local cache first, so the app feels instant and works on a plane. You enable it with persistent local cache settings (IndexedDB-backed). `hasPendingWrites` lets you show an 'unsynced' indicator. RTDB has similar offline support. This is transparent offline-first with almost no code.",
      "**Firestore vs Realtime Database.** RTDB is one giant JSON tree optimized for **very low-latency, simple state sync** — presence, typing indicators, live cursors, simple counters — and bills by bandwidth and connections. Firestore is a **document/collection model** with richer indexed queries, better horizontal scaling, stronger consistency, and per-operation billing. Default to Firestore for structured app data; drop to RTDB (or use both) only when you need the absolute lowest-latency simple sync or presence. Cost, indexing needs, and query shape drive the choice.",
      "**Costs and pitfalls to name in interviews.** Firestore bills per **document read/write/delete**, so a listener over a large collection or a chatty component can rack up reads fast — scope queries with `where`/`limit`, and cache. Watch for unbounded listeners, the missing-composite-index error, denormalization drift (the same data copied in several places going stale), and the lack of native full-text search. Model data around the queries you actually run.",
      "**The mental model (memorise this).** Firebase is a cloud NoSQL database you talk to directly from the client: onSnapshot gives you push-based real-time updates (always return its unsubscribe), writes are one-line add/set/update/delete with server-side field transforms, queries are declarative but index-backed and constrained, offline persistence and reconnection are handled for you, and — because there is no server in between — Security Rules enforced on the server are your real authorization layer.",
    ],
    backendAnalogy:
      "A Firestore real-time listener is the managed equivalent of subscribing to a database change stream — Postgres `LISTEN/NOTIFY`, a Debezium/CDC feed, or a Kafka topic of change events — except Firebase owns the WebSocket transport, auth token refresh, and reconnection so you never write that plumbing. `addDoc`/`updateDoc`/`deleteDoc` map onto your Spring `JpaRepository` save/delete methods, and `serverTimestamp()` is `@CreationTimestamp` filled by the DB rather than a spoofable client clock. The big conceptual shift is authorization: with Spring you guard access in `@PreAuthorize` and service methods on a server you control, but with Firebase the client hits the database directly, so **Security Rules are your controller-layer authorization** — declarative, server-enforced, and impossible to bypass from a tampered client. Offline persistence with a write queue is exactly the outbox pattern you would build with Vert.x/Kafka for at-least-once delivery, here provided out of the box.",
    keyInsights: [
      "Firebase is a backend-as-a-service; Firestore and the Realtime Database are cloud-hosted NoSQL stores with real-time sync built in.",
      "Firestore models data as documents inside collections (with subcollections); there are no tables or server-side JOINs, so you model for your reads and often denormalize.",
      "The modular v9+ SDK is tree-shakeable and functional — you import only the helpers you use, keeping bundles small.",
      "onSnapshot is push-based: the callback fires on first load and again on every matching change, so you never poll.",
      "onSnapshot returns an unsubscribe function that you MUST call (return it from useEffect) or you leak listeners and burn read quota.",
      "Writes are one-liners: addDoc (auto id), setDoc (known id, merge to patch), updateDoc (patch fields), deleteDoc; use increment/arrayUnion/serverTimestamp field transforms.",
      "Queries are declarative (query + where + orderBy + limit) but every query is index-backed; compound queries need composite indexes and there is no native full-text search.",
      "Security Rules run on the server and are your real authorization layer — the client talks directly to the DB, so never trust it.",
      "Firestore caches data and queues writes offline, syncing on reconnect; hasPendingWrites signals unsynced local writes.",
      "Firestore = structured docs, rich queries, per-operation billing; RTDB = one JSON tree, lowest-latency simple sync/presence, bandwidth billing.",
    ],
    codeSamples: [
      {
        label: "Firestore setup + real-time listener in a React hook",
        language: "ts",
        code: `import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, where, orderBy, limit, doc, updateDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ...rest of config
});
const db = getFirestore(app);

type Expense = { id: string; userId: string; amount: number; category: string };

function useExpenses(userId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Declarative query — index-backed. Compound where+orderBy needs a composite index.
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50),
    );

    // Push-based: fires immediately, then on EVERY matching change.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense),
      );
      if (snapshot.metadata.hasPendingWrites) {
        console.log('local write not yet acknowledged by the server');
      }
    });

    return unsubscribe; // CRITICAL cleanup — tear the listener down on unmount / userId change
  }, [userId]);

  return expenses;
}`,
      },
      {
        label: "CRUD writes and field transforms",
        language: "ts",
        code: `import {
  collection, addDoc, setDoc, updateDoc, deleteDoc, doc,
  increment, arrayUnion, serverTimestamp,
} from 'firebase/firestore';

// CREATE with an auto-generated id
async function addExpense(userId: string, amount: number, category: string) {
  const ref = await addDoc(collection(db, 'expenses'), {
    userId, amount, category,
    createdAt: serverTimestamp(), // trustworthy server clock, not the device clock
    tags: [],
  });
  return ref.id;
}

// SET at a known id (merge: true patches instead of overwriting the whole doc)
const upsertProfile = (uid: string, data: Record<string, unknown>) =>
  setDoc(doc(db, 'profiles', uid), data, { merge: true });

// UPDATE specific fields, including atomic field transforms
const approve = (id: string) =>
  updateDoc(doc(db, 'expenses', id), {
    status: 'approved',
    reviewCount: increment(1),       // atomic server-side counter
    tags: arrayUnion('reviewed'),    // atomic array add (no read-modify-write race)
  });

// DELETE
const removeExpense = (id: string) => deleteDoc(doc(db, 'expenses', id));`,
      },
      {
        label: "Firestore Security Rules — authorization on the server",
        language: "js",
        code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users may only read/write their OWN expenses.
    match /expenses/{expenseId} {
      // Read only your own documents.
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      // Create: must be signed in, own the doc, and send a valid shape.
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.amount is number
                    && request.resource.data.amount > 0;

      // Update/delete only your own; forbid changing the owner.
      allow update, delete: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == resource.data.userId;
    }
  }
}
// These run on Google's servers and CANNOT be bypassed by a tampered client.`,
      },
      {
        label: "Enable offline persistence (IndexedDB-backed cache)",
        language: "ts",
        code: `import { initializeApp } from 'firebase/app';
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
} from 'firebase/firestore';

const app = initializeApp({ /* config */ });

// Persistent cache: data is cached in IndexedDB and writes are queued while offline,
// then flushed on reconnect. Multi-tab manager keeps several tabs consistent.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// onSnapshot now serves cached data first (instant + offline), then server updates.
// snapshot.metadata.fromCache tells you whether data came from the local cache.
export { db };`,
      },
    ],
    interviewQA: [
      {
        question: "How do Firestore real-time listeners work, and why are they better than polling?",
        answer:
          "You subscribe to a document or query with onSnapshot. Firestore keeps a persistent connection open and pushes the initial snapshot plus a new snapshot whenever any matching document changes. It is push-based, so you get sub-second updates without burning requests on polling, and only the deltas travel over the wire. Polling wastes bandwidth, adds latency equal to the poll interval, scales poorly, and still misses changes between polls.",
      },
      {
        question: "What must you do with the value onSnapshot returns, and why?",
        answer:
          "onSnapshot returns an unsubscribe function. You must call it when you are done — in React, return it from useEffect so the listener detaches on unmount or when the query dependencies change. Forgetting this leaks listeners, produces duplicate updates and stale UI, and keeps consuming document reads against your billing quota. It is the most common Firebase-in-React bug.",
      },
      {
        question: "Where does authorization live in a Firebase app, and why there?",
        answer:
          "In Security Rules, which run on Google's servers. Because the client SDK talks directly to the database with no backend of yours in between, client-side checks can be bypassed by a tampered client. Rules match document paths and allow read/write based on request.auth.uid, the incoming request.resource.data, and the existing resource.data. You validate ownership and data shape there — the UI checks are only for UX, not security.",
      },
      {
        question: "Firestore vs Realtime Database — when would you pick each?",
        answer:
          "Realtime Database is a single JSON tree optimized for very low-latency simple state sync — presence, typing indicators, live cursors, simple counters — and bills by bandwidth and connections. Firestore is a document/collection model with rich indexed queries, better scaling, stronger consistency, and per-operation billing. Default to Firestore for structured application data; use RTDB (or both) only when you need the absolute lowest-latency simple sync or presence.",
      },
      {
        question: "What are the main querying constraints and cost pitfalls in Firestore?",
        answer:
          "Every query must be index-backed, so compound where+orderBy queries need composite indexes (the SDK throws an error with a link to create them). There is no native full-text search — you offload to Algolia or Typesense — and range filters are limited to one field. Firestore bills per document read/write/delete, so unbounded listeners over large collections are expensive; scope queries with where and limit, cache aggressively, and watch for denormalized copies drifting out of sync.",
      },
      {
        question: "How does Firestore offline support work?",
        answer:
          "With persistent local cache enabled, Firestore caches read data in IndexedDB and queues writes while offline. onSnapshot serves the cached data first, so the UI is instant and works with no network, then reconciles with the server on reconnect. snapshot.metadata.fromCache and hasPendingWrites let you show a source or 'unsynced' indicator. It is effectively transparent offline-first with almost no extra code.",
      },
    ],
    thingsToRemember: [
      "Firebase = backend-as-a-service; Firestore (docs/collections) and RTDB (one JSON tree) are NoSQL with real-time sync.",
      "Use the modular v9+ SDK — import only the helpers you use for small bundles.",
      "onSnapshot = push-based real-time; it fires on first load and on every matching change.",
      "Always return the unsubscribe function from useEffect to avoid leaked listeners and wasted reads.",
      "Writes: addDoc (auto id) / setDoc (known id, merge to patch) / updateDoc / deleteDoc.",
      "Use serverTimestamp(), increment(), arrayUnion()/arrayRemove() for trustworthy, atomic server-side updates.",
      "Queries are index-backed; compound queries need composite indexes and there is no native full-text search.",
      "Security Rules run on the server and are your real authorization layer — never trust the client.",
      "Persistent local cache queues writes offline and syncs on reconnect; check hasPendingWrites / fromCache.",
      "Firestore bills per read/write/delete — scope with where/limit and cache to control cost.",
    ],
    references: [
      { label: "Firebase — Cloud Firestore docs", url: "https://firebase.google.com/docs/firestore" },
      { label: "Firebase — Get realtime updates (onSnapshot)", url: "https://firebase.google.com/docs/firestore/query-data/listen" },
      { label: "Firebase — Security Rules", url: "https://firebase.google.com/docs/firestore/security/get-started" },
      { label: "Firebase — Enable offline data", url: "https://firebase.google.com/docs/firestore/manage-data/enable-offline" },
      { label: "Firebase — Choose a database (Firestore vs RTDB)", url: "https://firebase.google.com/docs/database/rtdb-vs-firestore" },
      { label: "web.dev — Firebase Performance & best practices", url: "https://firebase.google.com/docs/firestore/best-practices" },
    ],
    tags: ["firebase", "firestore", "realtime-database", "realtime", "nosql", "listeners", "security-rules", "offline", "onsnapshot"],
  },
  {
    id: "push-notifications",
    num: 34,
    title: "Push Notifications",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Advanced",
    summary:
      "Server-to-device messages delivered through a service worker and the browser's push service — the only real-time channel that reaches users when your app is closed — built on the Push API, the Notifications API, VAPID authentication, and an explicit permission grant.",
    readingTime: 16,
    explanation: [
      "**Why push is different.** WebSockets and SSE live inside an open page — close the tab and the connection dies. **Push Notifications** are the one real-time technology that reaches a user **even when your app is closed or backgrounded**, because delivery is handled not by your page but by a **service worker** the browser wakes on demand. That makes push the tool for re-engagement: alerts, reminders, chat messages, breaking news, order updates.",
      "**The four players.** (1) Your **web app** asks for permission and subscribes. (2) The **service worker** — a background script with no DOM — receives pushes and shows notifications. (3) The **push service** is run by the browser vendor (Google's FCM endpoints for Chrome, Mozilla's autopush for Firefox, Apple's for Safari); it holds the persistent connection to the device. (4) Your **application (backend) server** stores subscriptions and sends the actual messages. The browser abstracts the push service behind a single standard API, so you code against the spec, not the vendor.",
      "**Step 1 — register a service worker.** Push requires a service worker and HTTPS (localhost is exempt for dev). You register it once: `navigator.serviceWorker.register('/sw.js')`. The returned registration is what you subscribe through. The service worker persists after the page closes, which is exactly why it can handle background pushes.",
      "**Step 2 — request permission (a user gesture, once).** You call `Notification.requestPermission()`, which shows the browser's permission prompt and resolves to `'granted'`, `'denied'`, or `'default'`. **Ask in context** — after the user does something that implies they want alerts — not on page load. A denial is often permanent for the origin, so a mistimed prompt burns your only chance. Always check `Notification.permission` first and degrade gracefully.",
      "**Step 3 — subscribe with a VAPID key.** With permission granted you call `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`. **VAPID** (Voluntary Application Server Identification) is the mechanism that authenticates *your server* to the push service: you generate a public/private key pair once, the browser embeds your **public** key in the subscription, and your server signs each push with the **private** key. `userVisibleOnly: true` is a browser requirement — you must show a visible notification for each push (no silent tracking).",
      "**Step 4 — send the subscription to your backend.** `subscribe()` returns a **PushSubscription** object containing an `endpoint` URL (unique to that device and push service) plus `keys` (`p256dh` and `auth`) used to **encrypt** the payload. You POST this JSON to your server and persist it, typically keyed by user. This subscription is the durable address your backend fires messages at — think of it as a per-device webhook URL.",
      "**Step 5 — the server pushes.** Your backend uses the **Web Push protocol** (via a library like `web-push` in Node, or an equivalent) to send an **encrypted** payload to the subscription's endpoint, signed with your VAPID private key. Payloads must be encrypted end-to-end with the subscription's keys, so the push service relays without reading them. The push service then wakes the device's browser and hands off the message to your service worker.",
      "**Step 6 — the service worker shows the notification.** In the service worker you listen for the `'push'` event, parse the payload, and call `self.registration.showNotification(title, options)` — with `body`, `icon`, `badge`, `actions`, `data`, and `tag` (to collapse duplicates). Because `userVisibleOnly` is enforced, you must display something. You also handle `'notificationclick'` to focus or open the relevant page, and `'notificationclose'` for analytics.",
      "**Foreground vs background.** Push always routes through the service worker. If you *also* use a higher-level SDK like **Firebase Cloud Messaging (FCM)**, it distinguishes the two: when your page is in the **foreground**, FCM's `onMessage` fires so you can show a custom in-app toast; when the app is **backgrounded or closed**, the service worker's push handler shows an OS-level notification. FCM sits on top of the same standard Push API and adds token management, topics, and cross-platform delivery.",
      "**Push API vs Notifications API — don't conflate them.** The **Notifications API** (`new Notification(...)`, `showNotification`) just *displays* a notification and works without any server. The **Push API** is the *transport* that lets a server deliver a message to the service worker while the app is closed. Real push = Push API (delivery) + Notifications API (display). You can show a notification without push, but you cannot push without a service worker.",
      "**Lifecycle, expiry, and cleanup.** Subscriptions can **expire or be rotated** by the push service; the `'pushsubscriptionchange'` event lets you resubscribe and update your backend. When a send fails with a `404`/`410` from the endpoint, that subscription is dead — delete it server-side to stop wasting sends. Let users unsubscribe (`subscription.unsubscribe()`), and honor it by removing the record. Stale subscriptions are the main source of silent delivery failures.",
      "**Platform caveats to name.** iOS/Safari only supports web push for apps **added to the Home Screen** (installed PWAs) and only from relatively recent versions. Permission UX, notification styling, and action support vary by browser and OS. Never rely on push for critical, must-arrive delivery — it is best-effort, and users can revoke permission at any time. Design a fallback (in-app inbox, email) for anything important.",
      "**The mental model (memorise this).** Push is server-to-device delivery that works when the app is closed because a service worker, not your page, receives it: register a service worker, request permission in context, subscribe with your VAPID public key to get a PushSubscription (a per-device encrypted endpoint), store it on your backend, and have the server send VAPID-signed encrypted payloads over the Web Push protocol to the push service, which wakes the service worker to showNotification — foreground messages can be intercepted for in-app UI, everything is best-effort, and dead subscriptions must be pruned.",
    ],
    backendAnalogy:
      "A PushSubscription is a durable, per-device **webhook URL** your backend stores: you persist the endpoint, then fire messages at it, and the push service (the broker — FCM/autopush/APNs) fans them out to the right device. VAPID is **mTLS/JWT for that webhook**: you hold a private key and sign every request so the broker knows the sender is really you, exactly like signing service-to-service calls. Payload encryption with the subscription's p256dh/auth keys is end-to-end encryption through an untrusted relay — the broker forwards bytes it cannot read. The service worker is a **background message consumer/daemon** that the OS wakes independently of any user session, the direct analogue of a Kafka consumer or a Vert.x verticle that runs whether or not anyone is watching. And pruning subscriptions on a 410 Gone response is the same dead-letter cleanup you do when a downstream endpoint stops accepting deliveries.",
    keyInsights: [
      "Push is the only real-time channel that reaches users when the app is closed, because a service worker (not your page) handles delivery.",
      "Four players: your web app (subscribes), the service worker (receives/displays), the browser's push service (transport), and your backend (stores subscriptions and sends).",
      "It requires a service worker and HTTPS, plus an explicit permission grant via Notification.requestPermission() — ask in context, not on load, since denial is often permanent.",
      "You subscribe with pushManager.subscribe using your VAPID public key; userVisibleOnly: true forces you to show a visible notification per push.",
      "The PushSubscription has an endpoint URL plus p256dh/auth keys; you POST it to your backend, which uses it as a per-device address.",
      "The server sends VAPID-signed, end-to-end-encrypted payloads over the Web Push protocol; the push service relays without reading them.",
      "The service worker handles the 'push' event and calls showNotification, and handles 'notificationclick' to open/focus the app.",
      "The Push API is the transport (delivery to the service worker); the Notifications API just displays a notification — real push needs both.",
      "FCM sits on top of the standard Push API and splits foreground (onMessage, custom in-app UI) from background (service worker shows an OS notification).",
      "Subscriptions expire or rotate (pushsubscriptionchange); prune dead ones on 404/410, let users unsubscribe, and treat delivery as best-effort.",
    ],
    codeSamples: [
      {
        label: "Client — register SW, request permission in context, subscribe with VAPID",
        language: "ts",
        code: `// Convert a base64url VAPID public key to the Uint8Array the API expects.
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export async function enablePush(): Promise<void> {
  // 1) Feature-detect and require a secure context.
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  // 2) Register the service worker (persists after the page closes).
  const reg = await navigator.serviceWorker.register('/sw.js');

  // 3) Request permission — call this from a user gesture, IN CONTEXT.
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return; // 'denied' is often permanent — degrade gracefully

  // 4) Subscribe. userVisibleOnly is required: every push must show a notification.
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // 5) Send the subscription (endpoint + keys) to your backend to store.
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription), // { endpoint, keys: { p256dh, auth } }
  });
}`,
      },
      {
        label: "Service worker (sw.js) — receive push, show + handle notification",
        language: "js",
        code: `// sw.js — runs in the background with NO DOM; the browser wakes it for pushes.

// The 'push' event fires when a message arrives, even if no tab is open.
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  // userVisibleOnly is enforced: we MUST show a visible notification.
  const promise = self.registration.showNotification(data.title || 'Update', {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge.png',
    tag: data.tag,                 // same tag collapses duplicate notifications
    data: { url: data.url || '/' },
    actions: [{ action: 'open', title: 'View' }],
  });
  // waitUntil keeps the worker alive until the notification is shown.
  event.waitUntil(promise);
});

// Focus an existing tab or open a new one when the user taps the notification.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    }),
  );
});

// Subscriptions can rotate — resubscribe and tell the backend.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(/* re-subscribe via pushManager and POST the new subscription */ Promise.resolve());
});`,
      },
      {
        label: "Backend — send a VAPID-signed, encrypted push (Node web-push)",
        language: "js",
        code: `// Node backend using the 'web-push' library.
const webpush = require('web-push');

// Generate the VAPID key pair ONCE (webpush.generateVAPIDKeys()) and store it.
webpush.setVapidDetails(
  'mailto:alerts@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY, // signs each push so the push service trusts you
);

async function sendPush(subscription, message) {
  try {
    // Payload is end-to-end encrypted using the subscription's p256dh/auth keys;
    // the push service relays it without being able to read it.
    await webpush.sendNotification(subscription, JSON.stringify(message));
  } catch (err) {
    // 404/410 = the subscription is dead. Prune it so we stop wasting sends.
    if (err.statusCode === 404 || err.statusCode === 410) {
      await deleteSubscriptionFromDb(subscription.endpoint);
    } else {
      throw err;
    }
  }
}

// sendPush(stored, { title: 'Expense approved', body: '#4821 was approved', url: '/expenses/4821' });`,
      },
      {
        label: "Firebase Cloud Messaging — foreground vs background split",
        language: "ts",
        code: `// FCM sits on top of the standard Push API and manages tokens for you.
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const messaging = getMessaging(app);

export async function registerFcm() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  // getToken returns a device token (backed by a push subscription + VAPID key).
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });
  // Store the token on your backend to target this device later.
  await fetch('/api/fcm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
}

// FOREGROUND: app tab is open -> show your OWN in-app UI (custom toast).
onMessage(messaging, (payload) => {
  console.log('foreground message', payload.notification?.title);
  // showInAppToast(payload.notification);
});
// BACKGROUND/closed: firebase-messaging-sw.js service worker shows the OS notification.`,
      },
    ],
    interviewQA: [
      {
        question: "Walk through the full web push notification flow.",
        answer:
          "1) Register a service worker over HTTPS. 2) Request notification permission in context with Notification.requestPermission(). 3) On grant, call pushManager.subscribe with userVisibleOnly and your VAPID public key to get a PushSubscription (endpoint + p256dh/auth keys), and POST it to your backend. 4) Your server later uses the Web Push protocol to send a VAPID-signed, encrypted payload to that endpoint. 5) The browser's push service wakes the service worker, which fires the push event and calls showNotification. 6) notificationclick opens or focuses the relevant page.",
      },
      {
        question: "Why can push notifications reach a user when no tab is open, unlike WebSockets or SSE?",
        answer:
          "WebSocket and SSE connections live inside a page, so closing the tab closes the connection. Push relies on the service worker plus the browser's push service, which run independently of any page. The browser maintains a persistent connection to the push service, and when a message arrives it wakes the service worker to handle it — so delivery does not depend on your app being open.",
      },
      {
        question: "What is VAPID and what problem does it solve?",
        answer:
          "VAPID (Voluntary Application Server Identification) authenticates your application server to the push service. You generate a public/private key pair once; the public key is embedded in the subscription, and your server signs each push request with the private key. This lets the push service verify the sender is really you, prevents anonymous abuse of endpoints, and lets vendors contact you. It is essentially a signed JWT identifying your server on every send.",
      },
      {
        question: "What is the difference between the Push API and the Notifications API?",
        answer:
          "The Notifications API just displays a notification — new Notification() or showNotification — and needs no server. The Push API is the transport that lets your server deliver a message to the service worker while the app is closed. Real push notifications combine both: the Push API delivers to the service worker, which then uses the Notifications API to display. You can show a local notification without push, but you cannot push without a service worker.",
      },
      {
        question: "How do you handle expired or dead subscriptions?",
        answer:
          "Subscriptions can expire or be rotated by the push service, which fires a pushsubscriptionchange event in the service worker — you resubscribe and update your backend. When a send fails with 404 or 410 Gone from the endpoint, the subscription is dead, so you delete it server-side to stop wasting sends. You also honor user unsubscribes by removing the record. Pruning stale subscriptions is the main defense against silent delivery failures.",
      },
      {
        question: "What are the key limitations and best practices for web push?",
        answer:
          "Delivery is best-effort, not guaranteed, and users can revoke permission anytime, so never use it as the only channel for critical messages — provide a fallback like an in-app inbox or email. Ask for permission in context, never on page load, because denial is often permanent. userVisibleOnly forces a visible notification per push (no silent tracking). iOS/Safari only supports web push for installed PWAs added to the Home Screen, and support and styling vary across browsers.",
      },
    ],
    thingsToRemember: [
      "Push reaches users when the app is closed because a service worker, not your page, receives the message.",
      "Requires a service worker + HTTPS + an explicit permission grant; ask in context because denial is often permanent.",
      "Subscribe with pushManager.subscribe using userVisibleOnly: true and your VAPID public key.",
      "The PushSubscription (endpoint + p256dh/auth keys) is a per-device address you POST to and store on your backend.",
      "The server sends VAPID-signed, end-to-end-encrypted payloads over the Web Push protocol.",
      "The service worker handles the 'push' event -> showNotification, and 'notificationclick' -> focus/open a tab.",
      "Push API = transport (delivery to the SW); Notifications API = display. Real push needs both.",
      "FCM layers on top: foreground -> onMessage (custom in-app UI); background -> service worker shows an OS notification.",
      "Prune dead subscriptions on 404/410, handle pushsubscriptionchange, and let users unsubscribe.",
      "Delivery is best-effort; iOS needs an installed PWA — always have a fallback for critical messages.",
    ],
    references: [
      { label: "MDN — Push API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Push_API" },
      { label: "MDN — Notifications API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" },
      { label: "MDN — Using the Push API (guide)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices" },
      { label: "web.dev — Push notifications overview", url: "https://web.dev/articles/push-notifications-overview" },
      { label: "web.dev — The Web Push Protocol", url: "https://web.dev/articles/push-notifications-web-push-protocol" },
      { label: "Firebase — Cloud Messaging (FCM)", url: "https://firebase.google.com/docs/cloud-messaging" },
    ],
    tags: ["push", "notifications", "push-api", "service-worker", "vapid", "fcm", "web-push", "real-time", "pwa"],
  },
  {
    id: "websockets",
    num: 35,
    title: "WebSockets",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Core",
    summary:
      "A persistent, full-duplex connection over a single TCP socket upgraded from HTTP: both sides can send framed messages any time with minimal overhead — the right tool for chat, collaboration, live dashboards and gaming — plus the reconnection, heartbeat and horizontal-scaling concerns you must design for.",
    readingTime: 17,
    explanation: [
      "**What a WebSocket is.** A WebSocket is a **persistent, full-duplex** (bidirectional) connection between browser and server over a **single TCP socket**. Once established, either side can send a message at any moment with only a few bytes of framing overhead — no new HTTP request, no repeated headers, no polling. That low-latency, both-directions capability is what makes it the right choice for **chat, real-time collaboration (cursors, docs), live dashboards, trading, and multiplayer games**.",
      "**The upgrade handshake.** A WebSocket connection *starts* as an ordinary HTTP request. The client sends `GET` with `Upgrade: websocket`, `Connection: Upgrade`, and a random `Sec-WebSocket-Key`. If the server agrees, it replies **HTTP 101 Switching Protocols** with a `Sec-WebSocket-Accept` header (a hash of the key). After that single handshake the same TCP connection is 'upgraded' and speaks the WebSocket wire protocol instead of HTTP. The URL scheme is **`ws://`** (or **`wss://`** over TLS — always use `wss` in production).",
      "**Frames, not requests.** After the handshake, data travels in lightweight **frames** carrying either **text** (UTF-8, typically JSON) or **binary** (`ArrayBuffer`/`Blob`) payloads. There are also **control frames**: `ping`/`pong` for keepalive and `close` for a clean shutdown. Framing overhead is a couple of bytes versus the hundreds of bytes of HTTP headers per message — which is why WebSockets crush polling for high-frequency updates.",
      "**The native browser API.** The built-in `WebSocket` object is event-driven: `onopen` (connected, safe to send), `onmessage` (a frame arrived — inspect `event.data`), `onerror`, and `onclose` (with a `code` and `reason`). You send with `socket.send(...)` and close with `socket.close(code, reason)`. `readyState` (`CONNECTING`/`OPEN`/`CLOSING`/`CLOSED`) tells you whether it is safe to send; sending before `OPEN` throws.",
      "**The hard part: reconnection.** A raw WebSocket does **nothing** on network failure — it just fires `onclose`. Production code must detect the close and reconnect with **exponential backoff and jitter** (so a server restart doesn't cause a thundering-herd reconnect storm), then **re-authenticate and re-subscribe**, and **re-fetch state missed while disconnected**. Never reconnect in a tight loop. This reconnection + resync logic is non-trivial, which is exactly why libraries exist.",
      "**Heartbeats and dead connections.** TCP can go 'half-open' — the connection looks alive but packets no longer flow (laptop sleeps, NAT timeout, mobile handoff). You detect this with **heartbeats**: periodic `ping`/`pong` (or app-level messages) with a timeout; if a `pong` doesn't arrive in time, you consider the socket dead and reconnect. Servers also use ping/pong to reap zombie connections and free resources.",
      "**Authentication.** WebSockets can't send custom headers from the browser (no `Authorization` header on the handshake in the native API), so you authenticate by: passing a token as a **query param** or **cookie** on the handshake, or sending an **auth message as the first frame** right after `onopen` and letting the server reject unauthenticated sockets. Tokens can expire mid-connection, so plan for re-auth or short-lived tokens with refresh.",
      "**Socket.IO — the batteries-included option.** **Socket.IO** wraps WebSockets with the plumbing most apps need: **automatic reconnection** with backoff, **transport fallback** to HTTP long-polling when WebSockets are blocked, **rooms** (server-side groups for targeted broadcast), **acknowledgements** (callback on delivery), **namespaces**, and an **event-based API** (`socket.on('name', ...)`, `socket.emit('name', payload)`). Note it is **not** raw WebSocket-compatible — a Socket.IO client must talk to a Socket.IO server. Native `WebSocket` is leaner; Socket.IO is faster to ship a robust app with.",
      "**Using it in React — clean up your listeners.** Register handlers inside `useEffect` and **always remove them** in the cleanup (`socket.off(...)` for Socket.IO, or `removeEventListener`/nulling handlers for native). Because a module-level socket persists across renders, re-running the effect without cleanup **stacks duplicate handlers**, so one event fires your callback multiple times — duplicated state and repeated toasts. One shared connection per app (often via context) is better than one per component.",
      "**Scaling WebSockets horizontally.** This is a favorite interview topic. Connections are **stateful and sticky to one server**, so with multiple instances a message published on server A must reach clients connected to server B. You solve it with a **pub/sub backplane** — Redis pub/sub, a message broker (Kafka/NATS), or Socket.IO's Redis adapter — so any node can broadcast to any client. You also need **sticky sessions / consistent hashing** at the load balancer (especially with Socket.IO's polling fallback), and you must plan for connection limits and graceful drain on deploy.",
      "**The three browser real-time technologies — choose deliberately.** WebSockets are one of three, and picking correctly is the interview payoff:",
      [
        "| Technology | Direction | Connection | Auto-reconnect | Best For |",
        "| --- | --- | --- | --- | --- |",
        "| WebSocket | Bidirectional | Persistent TCP (ws/wss) | No (DIY) | Chat, collaboration, live dashboards, gaming |",
        "| SSE (EventSource) | Server -> Client only | Persistent HTTP | Yes (built-in) | Feeds, notifications, live logs, tickers, LLM token streams |",
        "| Push Notifications | Server -> Device | Via service worker | N/A | Alerts when the app is closed/backgrounded |",
      ].join("\n"),
      "**When NOT to use WebSockets.** If data flows only server-to-client, **SSE is simpler** (plain HTTP, auto-reconnect, passes proxies). If updates are infrequent, plain requests or polling are fine. WebSockets add operational cost — stateful connections, sticky sessions, a scaling backplane, reconnection logic — so reach for them specifically when you need **frequent, low-latency, client-initiated** traffic too.",
      "**The mental model (memorise this).** A WebSocket is one persistent full-duplex TCP socket, upgraded from HTTP via a 101 handshake, over which either side sends lightweight text/binary frames at will: it is ideal for bidirectional low-latency traffic, but you own reconnection (exponential backoff + resync), heartbeats to detect dead sockets, handshake-time auth, and — at scale — a pub/sub backplane with sticky sessions; Socket.IO bundles reconnection, fallback, rooms and events on top, and in React you must remove listeners on cleanup to avoid duplicates.",
    ],
    backendAnalogy:
      "A WebSocket is the frontend counterpart to a **Vert.x event-bus** connection or a long-lived **gRPC bidirectional stream**: a single persistent channel over which either side pushes framed messages, versus HTTP's one-shot request/response. Socket.IO's **rooms and named events** are pub/sub topics, and its acknowledgements are request-reply over the stream. Authenticating on the handshake or first frame is exactly gating a stream subscription before you let data flow. The scaling story maps one-to-one: stateful sticky connections plus a **Redis/Kafka pub/sub backplane** so any node can reach any client is precisely how you cluster a Vert.x app across the distributed event bus, and heartbeats/ping-pong are the same liveness checks a service mesh or gRPC keepalive performs to reap half-open connections. Exponential backoff with jitter on reconnect is the identical resilience pattern you apply to any client of a flaky downstream.",
    keyInsights: [
      "A WebSocket is a persistent, full-duplex connection over one TCP socket; either side can send at any time with tiny framing overhead.",
      "It starts as an HTTP request and is upgraded via a 101 Switching Protocols handshake; use wss:// (TLS) in production.",
      "Data travels as text or binary frames, plus ping/pong keepalive and close control frames — far cheaper than HTTP headers per message.",
      "The native API is event-driven (onopen/onmessage/onerror/onclose); check readyState before sending or send() throws.",
      "A raw WebSocket does nothing on failure — you must reconnect with exponential backoff and jitter, then re-auth, re-subscribe, and resync missed state.",
      "Use heartbeats (ping/pong with a timeout) to detect half-open/dead connections that look alive but no longer carry data.",
      "The browser can't set an Authorization header on the handshake, so auth goes via query param/cookie or a first-frame auth message.",
      "Socket.IO adds auto-reconnection, HTTP long-polling fallback, rooms, acknowledgements, namespaces, and an event API — but is not raw-WebSocket compatible.",
      "In React, register socket.on handlers in useEffect and remove them with socket.off in cleanup to avoid duplicate handlers; share one connection per app.",
      "Scaling needs sticky sessions at the load balancer and a pub/sub backplane (Redis/Kafka) so any node can broadcast to any connected client.",
    ],
    codeSamples: [
      {
        label: "Native WebSocket API — the event-driven lifecycle",
        language: "ts",
        code: `// Always wss:// (TLS) in production. The connection upgrades from HTTP via a 101.
const socket = new WebSocket('wss://api.example.com/ws');

socket.onopen = () => {
  // Connected. Only now is it safe to send. Authenticate on the first frame.
  socket.send(JSON.stringify({ type: 'auth', token: localStorage.getItem('token') }));
};

socket.onmessage = (event) => {
  // Frames arrive here; event.data is text (JSON) or binary (ArrayBuffer/Blob).
  const msg = JSON.parse(event.data);
  console.log('received', msg.type, msg.payload);
};

socket.onerror = (err) => console.error('socket error', err);

socket.onclose = (event) => {
  // event.code / event.reason explain why. A raw socket does NOTHING to reconnect.
  console.log('closed', event.code, event.reason);
};

// Guard sends with readyState, or send() throws when not OPEN.
function safeSend(data: unknown) {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data));
}`,
      },
      {
        label: "Reconnection with exponential backoff + jitter + heartbeat",
        language: "ts",
        code: `// A small resilient wrapper — the logic Socket.IO gives you for free.
function createResilientSocket(url: string, onMessage: (m: unknown) => void) {
  let ws: WebSocket;
  let attempt = 0;
  let heartbeat: ReturnType<typeof setInterval>;

  function connect() {
    ws = new WebSocket(url);

    ws.onopen = () => {
      attempt = 0;                       // reset backoff on success
      // Heartbeat: ping periodically; if the server stops responding, the
      // next close/timeout triggers a reconnect. Detects half-open sockets.
      heartbeat = setInterval(() => safeSend({ type: 'ping' }), 25000);
      // Re-subscribe / resync any state missed while disconnected here.
    };

    ws.onmessage = (e) => onMessage(JSON.parse(e.data));

    ws.onclose = () => {
      clearInterval(heartbeat);
      // Exponential backoff capped at 30s, with jitter to avoid a thundering herd.
      const base = Math.min(1000 * 2 ** attempt, 30000);
      const delay = base / 2 + Math.random() * (base / 2);
      attempt++;
      setTimeout(connect, delay);
    };
  }

  function safeSend(data: unknown) {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
  }

  connect();
  return { send: safeSend, close: () => ws.close() };
}`,
      },
      {
        label: "Socket.IO in a React hook — events, emit, and cleanup",
        language: "tsx",
        code: `import { io, type Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

// ONE shared connection for the whole app (Socket.IO handles reconnect/backoff).
const socket: Socket = io(import.meta.env.VITE_WS_URL, {
  auth: { token: localStorage.getItem('token') }, // sent on the handshake
  transports: ['websocket'],                       // skip long-polling if not needed
});

type Notice = { id: string; text: string };

export function useNotifications() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const onApproved = (n: Notice) => setNotices((prev) => [n, ...prev]);
    const onReconnect = () => {/* re-join rooms / refetch missed state */};

    socket.on('expense:approved', onApproved);
    socket.io.on('reconnect', onReconnect);

    // CRITICAL: remove handlers on cleanup, or re-renders stack duplicates
    // and each event fires the callback multiple times.
    return () => {
      socket.off('expense:approved', onApproved);
      socket.io.off('reconnect', onReconnect);
    };
  }, []);

  // Bidirectional: the client can send too, optionally with an ack callback.
  const markRead = (id: string) =>
    socket.emit('notification:read', { id }, (ack: { ok: boolean }) => console.log(ack));

  return { notices, markRead };
}`,
      },
      {
        label: "Scaling — a Redis pub/sub backplane across server instances",
        language: "js",
        code: `// Node + ws, multiple instances behind a load balancer with sticky sessions.
// Problem: a client on server A must receive messages published on server B.
// Solution: a Redis pub/sub backplane so any node can broadcast to any client.
const { WebSocketServer } = require('ws');
const { createClient } = require('redis');

const wss = new WebSocketServer({ port: 8080 });
const pub = createClient();          // publisher
const sub = createClient();          // subscriber (must be a separate connection)

(async () => {
  await pub.connect();
  await sub.connect();

  // Any message published to the channel is fanned out to THIS node's clients.
  await sub.subscribe('broadcast', (raw) => {
    for (const client of wss.clients) {
      if (client.readyState === 1 /* OPEN */) client.send(raw);
    }
  });
})();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Publish to Redis instead of only this node's clients — reaches every instance.
    pub.publish('broadcast', data.toString());
  });
});
// Socket.IO offers @socket.io/redis-adapter which does exactly this for you.`,
      },
    ],
    interviewQA: [
      {
        question: "How does the WebSocket handshake work?",
        answer:
          "A WebSocket connection begins as a normal HTTP GET carrying Upgrade: websocket, Connection: Upgrade, and a random Sec-WebSocket-Key. If the server accepts, it responds with HTTP 101 Switching Protocols and a Sec-WebSocket-Accept header derived from the key. From that point the same TCP connection is upgraded and speaks the WebSocket frame protocol instead of HTTP. The scheme is ws:// or, over TLS, wss://, which you should always use in production.",
      },
      {
        question: "WebSocket vs SSE vs polling — when do you use each?",
        answer:
          "Use WebSockets for bidirectional, low-latency communication where the client also sends frequently — chat, collaboration, gaming. Use SSE when data flows only server-to-client — notifications, live feeds, tickers, logs, LLM token streams — because it is simpler, runs over plain HTTP, and auto-reconnects. Use polling only for infrequent updates or as a last resort, since it adds latency equal to the interval and wastes requests. Prefer the simplest option that meets the direction and frequency requirements.",
      },
      {
        question: "How does WebSocket reconnection work, and what does Socket.IO add?",
        answer:
          "A raw WebSocket simply fires onclose on failure and does nothing else — you must detect the close and reconnect yourself with exponential backoff and jitter, then re-authenticate, re-subscribe, and re-fetch any state missed while disconnected. Socket.IO automates this: it reconnects with backoff, emits a reconnect event so you can re-join rooms, and can fall back to HTTP long-polling when WebSockets are blocked. Even so, you should make handlers idempotent and resync on reconnect.",
      },
      {
        question: "How do you scale WebSockets across multiple server instances?",
        answer:
          "Connections are stateful and pinned to one server, so you need sticky sessions or consistent hashing at the load balancer, plus a pub/sub backplane — Redis pub/sub, Kafka, NATS, or Socket.IO's Redis adapter — so a message published on one node reaches clients connected to any other node. You also plan for per-instance connection limits and graceful connection drain on deploys so clients reconnect elsewhere without a stampede.",
      },
      {
        question: "Why must you clean up socket listeners in React, and how?",
        answer:
          "Because a module-level socket persists across renders, every time the effect runs it registers another handler via socket.on or addEventListener. Without removing the previous one in the cleanup, handlers stack, so a single event fires your callback multiple times — causing duplicated state updates and repeated toasts. You return a cleanup from useEffect that calls socket.off with the same handler reference (or removeEventListener), keeping exactly one handler registered.",
      },
      {
        question: "How do you detect a dead WebSocket connection, and why is it necessary?",
        answer:
          "TCP connections can go half-open — they appear connected but no longer carry data — when a device sleeps, a NAT times out, or a mobile network hands off. You detect this with heartbeats: send periodic ping frames or app-level pings and expect a pong within a timeout; if it does not arrive, treat the socket as dead and reconnect. Servers use the same ping/pong to reap zombie connections and reclaim resources.",
      },
    ],
    thingsToRemember: [
      "WebSocket = persistent, full-duplex connection over one TCP socket; either side sends any time.",
      "It upgrades from HTTP via a 101 Switching Protocols handshake; always use wss:// in production.",
      "Data is text or binary frames plus ping/pong/close control frames — far cheaper than HTTP per message.",
      "Native API is event-driven (onopen/onmessage/onerror/onclose); check readyState before send().",
      "A raw socket does not reconnect — you own exponential backoff + jitter, re-auth, re-subscribe, and resync.",
      "Use heartbeats (ping/pong with timeout) to detect half-open/dead connections.",
      "The browser can't set an Authorization header on the handshake — auth via query param, cookie, or first-frame message.",
      "Socket.IO adds auto-reconnect, long-polling fallback, rooms, acks, namespaces, and events (not raw-WS compatible).",
      "In React: register handlers in useEffect, remove them with socket.off in cleanup; share one connection app-wide.",
      "Scaling needs sticky sessions + a pub/sub backplane (Redis/Kafka) so any node can reach any client.",
    ],
    references: [
      { label: "MDN — The WebSocket API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
      { label: "MDN — Writing WebSocket client applications", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications" },
      { label: "Socket.IO — Documentation", url: "https://socket.io/docs/v4/" },
      { label: "Socket.IO — Redis adapter (scaling)", url: "https://socket.io/docs/v4/redis-adapter/" },
      { label: "RFC 6455 — The WebSocket Protocol", url: "https://datatracker.ietf.org/doc/html/rfc6455" },
      { label: "web.dev — WebSockets basics", url: "https://web.dev/articles/websockets-basics" },
    ],
    tags: ["websocket", "socket.io", "real-time", "bidirectional", "full-duplex", "reconnection", "scaling", "redis", "react"],
  },
  {
    id: "server-sent-events-sse",
    num: 36,
    title: "Server-Sent Events (SSE)",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Core",
    summary:
      "One-directional server-to-client streaming over a single long-lived HTTP connection via the native EventSource API: dead simple, auto-reconnecting with Last-Event-ID resume, proxy-friendly, and ideal for feeds, notifications, live logs, tickers and LLM token streams — with clear limits that tell you when to reach for WebSockets instead.",
    readingTime: 14,
    explanation: [
      "**What SSE is.** Server-Sent Events provide a **one-directional** stream from server to client over a **single, long-lived HTTP connection**, using the browser's built-in **`EventSource`** API. The server holds the response open and keeps writing text events as they happen; the browser dispatches each one to your handler. There is no protocol upgrade and no client-to-server channel — you only *listen*. That simplicity is the whole appeal.",
      "**The wire format is trivial.** SSE is just a `text/event-stream` HTTP response made of newline-delimited fields: `data:` (the payload, can span multiple `data:` lines), `event:` (a named event type), `id:` (an event id the browser remembers), and `retry:` (how many ms to wait before reconnecting). A blank line dispatches the event. That's the entire protocol — you could hand-write it, which is why any backend that can stream a response can do SSE.",
      "**The client API — three lines.** Create `new EventSource(url)`; handle the default stream in `onmessage` (parsing `event.data`, which is always a **string** — usually `JSON.parse` it); and handle transport failures in `onerror`. For **named events** sent with `event: foo`, you subscribe with `source.addEventListener('foo', handler)` instead of `onmessage`. `source.readyState` is `CONNECTING`/`OPEN`/`CLOSED`, and `source.close()` shuts it down.",
      "**Built-in auto-reconnect — the killer feature.** If the connection drops, **`EventSource` reconnects automatically** with no code from you. The server can tune the delay with a `retry:` field. Even better, the browser tracks the last `id:` it saw and sends it back as the **`Last-Event-ID`** request header on reconnect, so your server can **resume from where it left off** and replay missed events. WebSockets give you none of this for free — you build reconnection and resync yourself.",
      "**Why SSE passes through infrastructure so easily.** Because SSE is 'just' a long-running HTTP GET, it sails through **proxies, corporate firewalls, and load balancers** that sometimes block or mishandle the WebSocket `Upgrade`. No special routing, no sticky-session gymnastics for the transport itself, works with standard HTTP auth, cookies, and CORS. This operational simplicity is a real reason teams pick SSE for server-to-client streaming.",
      "**The HTTP/1.1 connection-limit trap.** SSE's classic gotcha: over **HTTP/1.1**, browsers cap concurrent connections per origin at ~6. Each open `EventSource` consumes one, so a few tabs (or several streams) can **starve your other requests**. **HTTP/2 (and HTTP/3) fix this** by multiplexing many streams over one connection, raising the effective limit dramatically. Serve SSE over HTTP/2 in production, and avoid opening many separate EventSource connections per page.",
      "**Text only, and one-way.** SSE carries **UTF-8 text only** — binary must be base64-encoded (bloating it ~33%), so it's a poor fit for binary-heavy data. And it is **strictly server-to-client**: the only thing the client sends is the initial request. If you need to push data *up* frequently, SSE alone can't; you either send those over separate `fetch`/POST requests or switch to WebSockets. Sending occasional commands via normal HTTP alongside an SSE stream is a perfectly common hybrid.",
      "**SSE and LLM token streaming.** A modern, very common use: **streaming AI/LLM responses token-by-token**. The server emits each chunk as an SSE `data:` event and the UI renders text as it arrives, giving that 'typing' effect. (Note: many LLM APIs use the SSE *wire format* over a `fetch` POST body rather than the native `EventSource`, precisely because EventSource can only GET and can't set an Authorization header — see the auth caveat below.) SSE's push-and-append model fits streaming completions perfectly.",
      "**Auth caveat with native EventSource.** The native `EventSource` can only issue a **GET** and **cannot set custom headers** (no `Authorization`). Options: rely on **cookies** (sent automatically, subject to CORS `withCredentials: true`), put a token in the **query string** (careful with logging), or — when you need headers — skip `EventSource` and consume the SSE stream yourself via `fetch` with `ReadableStream`. This last approach is why LLM SDKs parse SSE manually.",
      "**Using it in React — close on cleanup.** Create the `EventSource` inside `useEffect`, wire `onmessage`/`addEventListener` and `onerror`, and **`source.close()` in the cleanup** so the connection is torn down on unmount or when the URL changes. Otherwise you leak an open HTTP connection (and one of those precious per-origin slots) and may accumulate duplicate handlers. Reconnection is automatic, but *closing* is still your job.",
      "**Choosing among the three real-time technologies.** SSE sits between the heavyweight WebSocket and the app-closed Push:",
      [
        "| Technology | Direction | Connection | Auto-reconnect | Best For |",
        "| --- | --- | --- | --- | --- |",
        "| WebSocket | Bidirectional | Persistent TCP (ws/wss) | No (DIY) | Chat, collaboration, live dashboards, gaming |",
        "| SSE (EventSource) | Server -> Client only | Persistent HTTP | Yes (built-in, Last-Event-ID) | Feeds, notifications, live logs, tickers, LLM token streams |",
        "| Push Notifications | Server -> Device | Via service worker | N/A | Alerts when the app is closed/backgrounded |",
      ].join("\n"),
      "**The mental model (memorise this).** SSE is a one-way server-to-client stream over a single long-lived HTTP `text/event-stream` connection, consumed with the native EventSource: it is the simplest real-time option, auto-reconnects and resumes via Last-Event-ID for free, and passes through proxies easily — its costs are text-only payloads, no client-to-server channel, the HTTP/1.1 per-origin connection cap (fixed by HTTP/2), and native EventSource's GET-only/no-custom-headers limit; reach for it for feeds, notifications, logs, tickers and LLM streams, and switch to WebSockets only when you also need frequent client-to-server or binary traffic.",
    ],
    backendAnalogy:
      "SSE is a **long-lived, chunked HTTP response** the server keeps writing to — the direct analogue of a Spring WebFlux `Flux<ServerSentEvent>` endpoint or a Vert.x route whose handler holds the `HttpServerResponse` open and calls `write()` for each event with `Content-Type: text/event-stream`. Because it rides ordinary HTTP, it traverses proxies, load balancers, and firewalls the same way any GET does — no upgrade negotiation, unlike the WebSocket handshake — which is why it 'just works' behind infrastructure that trips up sockets. The `Last-Event-ID` resume is at-least-once/replay semantics driven by the client's cursor, the same idea as a Kafka consumer resuming from a stored offset after a restart. And the HTTP/1.1 six-connection cap is a client-side connection-pool limit — HTTP/2 multiplexing lifts it exactly like moving from one-request-per-connection to a pooled, multiplexed transport on the server side.",
    keyInsights: [
      "SSE is a one-directional server-to-client stream over a single long-lived HTTP connection, consumed with the native EventSource API.",
      "The wire format is trivial text/event-stream with data:, event:, id:, and retry: fields; a blank line dispatches an event.",
      "Client usage is minimal: new EventSource(url), onmessage (event.data is always a string, usually JSON.parse it), and onerror; named events use addEventListener.",
      "EventSource auto-reconnects for free and, via the Last-Event-ID header, lets the server resume and replay missed events.",
      "Because it is plain HTTP, SSE passes through proxies, firewalls, and load balancers more easily than a WebSocket upgrade.",
      "Over HTTP/1.1 browsers cap ~6 connections per origin, so many EventSource connections can starve other requests; HTTP/2 multiplexing fixes this.",
      "SSE carries UTF-8 text only (binary needs base64) and has no client-to-server channel beyond the initial request.",
      "It is ideal for feeds, notifications, live logs, tickers, and streaming LLM tokens token-by-token.",
      "Native EventSource can only GET and cannot set custom headers, so auth uses cookies or a query token, or you parse SSE manually via fetch + ReadableStream.",
      "In React, create the EventSource in useEffect and call source.close() in the cleanup; reconnection is automatic but closing is your job.",
    ],
    codeSamples: [
      {
        label: "EventSource — default messages, named events, errors",
        language: "ts",
        code: `// One-directional server -> client stream. Auto-reconnects on drop.
const source = new EventSource('/api/stream');

// Default (unnamed) events land here. event.data is ALWAYS a string.
source.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  console.log('message', payload);
};

// Named events sent by the server as "event: price" use addEventListener.
source.addEventListener('price', (event) => {
  const tick = JSON.parse((event as MessageEvent).data);
  console.log('price tick', tick);
});

source.onopen = () => console.log('stream open', source.readyState); // 1 = OPEN

source.onerror = () => {
  // Fired on transport errors. EventSource will auto-reconnect unless CLOSED.
  if (source.readyState === EventSource.CLOSED) console.log('stream closed for good');
  // Call source.close() here only if YOU want to stop retrying.
};`,
      },
      {
        label: "The SSE wire format (what the server actually writes)",
        language: "bash",
        code: `# A text/event-stream response is just newline-delimited fields.
# A BLANK LINE dispatches the event to the browser.

# --- default message event (goes to onmessage) ---
data: {"user":"ada","text":"hello"}

# --- named event with an id (browser remembers the id) ---
event: price
id: 42
data: {"symbol":"ACME","price":101.25}

# --- tell the client to wait 5s before reconnecting ---
retry: 5000

# --- a comment/heartbeat line (starts with ':') keeps the connection alive ---
: keep-alive ping

# On reconnect the browser sends:  Last-Event-ID: 42
# so the server can resume from event 42 and replay anything missed.`,
      },
      {
        label: "Minimal SSE server endpoint (Node)",
        language: "js",
        code: `// Any backend that can stream a response can do SSE — no library needed.
const http = require('http');

http.createServer((req, res) => {
  if (req.url !== '/api/stream') { res.writeHead(404).end(); return; }

  // The three headers that make it a stream.
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Resume support: the browser sends the last id it saw on reconnect.
  const lastId = Number(req.headers['last-event-id'] || 0);
  let id = lastId;

  const timer = setInterval(() => {
    id += 1;
    // event/id/data + a BLANK line to dispatch.
    res.write(\`event: tick\\n\`);
    res.write(\`id: \${id}\\n\`);
    res.write(\`data: \${JSON.stringify({ id, time: Date.now() })}\\n\\n\`);
  }, 1000);

  // Clean up when the client disconnects (tab closed / source.close()).
  req.on('close', () => clearInterval(timer));
}).listen(3000);`,
      },
      {
        label: "SSE in a React hook — subscribe and close on cleanup",
        language: "tsx",
        code: `import { useEffect, useState } from 'react';

function useLiveFeed<T>(url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource(url); // withCredentials: true to send cookies (auth)

    source.onopen = () => setConnected(true);
    source.onmessage = (e) => {
      const item = JSON.parse(e.data) as T;
      setItems((prev) => [item, ...prev].slice(0, 100));
    };
    source.onerror = () => setConnected(false); // it will auto-reconnect on its own

    // CRITICAL: close the stream on unmount / url change, or you leak an open
    // HTTP connection (and one of the ~6 per-origin slots under HTTP/1.1).
    return () => source.close();
  }, [url]);

  return { items, connected };
}`,
      },
    ],
    runnable: {
      title: "Parse the raw SSE wire format the way EventSource does",
      html: `<h3>SSE frame parser (mirrors what EventSource does internally)</h3>
<button id="run">Parse a stream chunk</button>
<pre id="out" style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;min-height:60px;"></pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
button { padding: 8px 14px; border: 0; border-radius: 8px; background:#4f46e5; color:#fff; cursor:pointer; }`,
      js: `// A real text/event-stream chunk: fields separated by newlines,
// a BLANK LINE ends each event. This is the whole protocol.
const rawStream = [
  'event: price',
  'id: 42',
  'data: {"symbol":"ACME","price":101.25}',
  '',                                  // <- blank line dispatches the event
  'data: {"note":"default message"}',
  '',
].join('\\n');

// Minimal parser: split into events on blank lines, then read fields.
function parseSSE(text) {
  return text.split('\\n\\n').filter(Boolean).map((block) => {
    const evt = { event: 'message', id: undefined, data: '' };
    for (const line of block.split('\\n')) {
      const idx = line.indexOf(':');
      const field = line.slice(0, idx);
      const value = line.slice(idx + 1).replace(/^ /, '');
      if (field === 'event') evt.event = value;
      else if (field === 'id') evt.id = value;
      else if (field === 'data') evt.data += (evt.data ? '\\n' : '') + value;
    }
    return evt;
  });
}

document.getElementById('run').onclick = () => {
  const events = parseSSE(rawStream);
  document.getElementById('out').textContent = JSON.stringify(events, null, 2);
  events.forEach((e) => console.log('dispatch ->', e.event, e.data));
};`,
    },
    interviewQA: [
      {
        question: "Why choose SSE over WebSockets?",
        answer:
          "When data only needs to flow server-to-client — live feeds, notifications, logs, tickers, LLM token streams — SSE is simpler: it uses the native EventSource API over plain HTTP with no protocol upgrade, it works through proxies and firewalls that may block WebSockets, it needs no sticky-session or backplane gymnastics for the transport, and it reconnects automatically with Last-Event-ID resume. WebSockets are warranted only when you also need the client to push messages frequently or you need binary payloads.",
      },
      {
        question: "How does SSE reconnection and resume differ from a raw WebSocket's?",
        answer:
          "EventSource reconnects automatically when the connection drops, after a delay the server can control via the retry field. The browser also remembers the last id it received and sends it back as the Last-Event-ID header, so the server can resume from that point and replay missed events. A raw WebSocket gives none of this — you must detect the close, implement backoff, and build your own resync, which is a big reason people reach for Socket.IO.",
      },
      {
        question: "What are the main limitations of SSE?",
        answer:
          "It is one-directional (the only client-to-server signal is the initial request), it carries UTF-8 text only so binary must be base64-encoded, and over HTTP/1.1 browsers cap concurrent connections per origin at about six, so several open streams can starve other requests. Native EventSource can also only issue a GET and cannot set custom headers like Authorization. If you need bidirectional or binary-heavy traffic, use WebSockets; the connection-limit issue is largely solved by serving over HTTP/2.",
      },
      {
        question: "How do you authenticate an SSE connection given EventSource's constraints?",
        answer:
          "Because native EventSource can only GET and cannot set an Authorization header, you rely on cookies (automatically sent, using withCredentials: true and appropriate CORS), or pass a token in the query string (mindful of it appearing in logs). When you genuinely need custom headers, you skip EventSource and consume the text/event-stream yourself via fetch with a ReadableStream, parsing the frames manually — which is exactly how many LLM streaming SDKs work.",
      },
      {
        question: "Why is SSE a good fit for streaming LLM responses?",
        answer:
          "LLM completions arrive token by token, and SSE's model is push-and-append: the server emits each chunk as a data event and the UI renders text incrementally for the typing effect, over one long-lived HTTP connection with automatic reconnection. In practice many APIs use the SSE wire format over a fetch POST body rather than the native EventSource, because EventSource is GET-only and can't send an auth header, but the streaming pattern is identical.",
      },
      {
        question: "What is the HTTP/1.1 connection-limit problem with SSE and how is it fixed?",
        answer:
          "Under HTTP/1.1 browsers limit concurrent connections to a single origin to roughly six. Each open EventSource holds one of those slots for its whole lifetime, so a user with several tabs or a page with multiple streams can exhaust the pool and block ordinary requests. HTTP/2 (and HTTP/3) multiplex many streams over one connection, so the practical limit is far higher — serve SSE over HTTP/2 in production and avoid opening many separate EventSource connections.",
      },
    ],
    thingsToRemember: [
      "SSE = one-way server -> client stream over a single long-lived HTTP text/event-stream connection via EventSource.",
      "Wire format: data:, event:, id:, retry: fields; a blank line dispatches the event.",
      "onmessage handles default events (data is a string — JSON.parse it); named events use addEventListener.",
      "EventSource auto-reconnects for free and resumes via the Last-Event-ID header — WebSockets don't.",
      "Being plain HTTP, it passes through proxies, firewalls, and load balancers easily.",
      "HTTP/1.1 caps ~6 connections per origin; many streams starve other requests — use HTTP/2.",
      "Text only (binary must be base64) and no client-to-server channel beyond the initial request.",
      "Great for feeds, notifications, logs, tickers, and streaming LLM tokens.",
      "Native EventSource is GET-only with no custom headers — auth via cookies/query token, or parse SSE via fetch + ReadableStream.",
      "In React: create EventSource in useEffect and call source.close() in the cleanup.",
    ],
    references: [
      { label: "MDN — EventSource", url: "https://developer.mozilla.org/en-US/docs/Web/API/EventSource" },
      { label: "MDN — Using server-sent events", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events" },
      { label: "MDN — Server-sent events reference", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" },
      { label: "WHATWG — Server-sent events spec", url: "https://html.spec.whatwg.org/multipage/server-sent-events.html" },
      { label: "web.dev — Streams and the Streams API", url: "https://web.dev/articles/streams" },
      { label: "MDN — Using readable streams (fetch + SSE parsing)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams" },
    ],
    tags: ["sse", "eventsource", "streaming", "real-time", "http", "text-event-stream", "auto-reconnect", "llm-streaming", "http2"],
  },
];
