import type { FrontendTopic } from "../types";

export const partI: FrontendTopic[] = [
  {
    id: "sqlite-client-side",
    num: 32,
    title: "SQLite (Client-Side)",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Advanced",
    summary: "Run a real SQL database in the browser with sql.js (SQLite compiled to WebAssembly) for offline-first apps.",
    readingTime: 5,
    explanation: [
      "For offline-capable apps, you can run a SQL database directly in the browser using libraries like **sql.js** (SQLite compiled to WebAssembly) or the upcoming **Origin Private File System** API. This is useful for local caching, offline-first apps, or complex client-side queries that would be awkward to express against `localStorage` or IndexedDB key-value stores.",
      "With `sql.js` you initialize the WASM module (pointing `locateFile` at the hosted `.wasm` binary), create an in-memory `Database`, and then run ordinary SQL: `CREATE TABLE`, parameterized `INSERT` statements, and `SELECT` queries. Because it is real SQLite, you get joins, aggregations, indexes, and transactions on the client.",
      "The trade-off is that the default `sql.js` database lives in memory, so you must persist it yourself (for example by exporting the database bytes and writing them to IndexedDB) if you want the data to survive a reload. The Origin Private File System API is the emerging standard for giving browser databases durable, sandboxed file storage.",
    ],
    backendAnalogy:
      "This is the same SQLite engine you might embed in a backend or mobile app, just compiled to WebAssembly and running in the browser tab instead of on a server. Parameterized queries (the `?` placeholders) protect against injection exactly like a server-side prepared statement, and the in-memory database mirrors an embedded H2/SQLite test database that you snapshot to disk.",
    keyInsights: [
      "sql.js is the full SQLite engine via WebAssembly, so you get real SQL (joins, aggregates, indexes) on the client.",
      "Always use parameterized queries (the `?` placeholders with a values array) rather than string concatenation.",
      "The database is in-memory by default; persist it explicitly (export bytes to IndexedDB) to survive reloads.",
    ],
    codeSamples: [
      {
        label: "sql.js — SQLite in the browser via WebAssembly",
        language: "ts",
        code: `// sql.js — SQLite in the browser via WebAssembly
import initSqlJs from 'sql.js';

async function initDB() {
  const SQL = await initSqlJs({
    locateFile: file => \`https://sql.js.org/dist/\${file}\`
  });
  const db = new SQL.Database();

  db.run(\`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )\`);

  // Insert
  db.run('INSERT INTO expenses (amount, category) VALUES (?, ?)', [120, 'meals']);

  // Query
  const results = db.exec('SELECT * FROM expenses WHERE amount > ?', [100]);
  console.log(results[0].values); // [[1, 120, 'meals', '2026-...']]

  return db;
}`,
      },
    ],
    interviewQA: [
      {
        question: "When would you choose client-side SQLite over IndexedDB?",
        answer:
          "When your data is relational and your queries are complex — joins, aggregations, GROUP BY, sorting across multiple fields. IndexedDB is a key-value/object store and forces you to hand-roll those operations in JavaScript, whereas sql.js lets you express them declaratively in SQL. For simple key-value caching, IndexedDB is lighter and built-in; sql.js adds a sizable WASM payload.",
      },
      {
        question: "How do you persist a sql.js database across reloads?",
        answer:
          "The default Database lives in memory, so you export it with db.export() to get a Uint8Array of the raw SQLite file, then store those bytes in IndexedDB (or the Origin Private File System). On startup you read the bytes back and pass them to new SQL.Database(bytes) to restore state. You typically debounce the export so you are not serializing on every write.",
      },
    ],
    thingsToRemember: [
      "sql.js = SQLite compiled to WebAssembly; full SQL in the browser.",
      "Parameterized queries (?, values[]) prevent injection and quoting bugs.",
      "In-memory by default — export bytes to IndexedDB/OPFS for durability.",
    ],
    references: [
      { label: "sql.js — GitHub & docs", url: "https://github.com/sql-js/sql.js" },
      { label: "MDN — Origin Private File System", url: "https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system" },
    ],
    tags: ["sqlite", "wasm", "offline", "storage", "sql.js"],
  },
  {
    id: "firebase-firestore-realtime-database",
    num: 33,
    title: "Firebase DB (Firestore / Realtime Database)",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Core",
    summary: "Cloud-hosted NoSQL with real-time listeners — CRUD plus live updates via onSnapshot.",
    readingTime: 6,
    explanation: [
      "Firebase gives you a cloud-hosted NoSQL database (**Firestore** or the older **Realtime Database**) with built-in real-time synchronization. You initialize the app with your config, get a Firestore handle with `getFirestore`, and then use the modular SDK helpers (`addDoc`, `onSnapshot`, `query`, `where`, `orderBy`, `updateDoc`, `deleteDoc`) to read and write documents.",
      "The defining feature is the **real-time listener**. Instead of polling, you subscribe to a query with `onSnapshot`; the callback fires immediately with the current data and again on every subsequent change — inserts, updates, and deletes — keeping local state in sync with the server automatically.",
      "`onSnapshot` returns an `unsubscribe` function. In React you return that function from `useEffect` so the listener is torn down when the component unmounts or the query changes, preventing memory leaks and duplicate listeners. Create, update, and delete are one-liners: `addDoc`, `updateDoc(doc(...))`, and `deleteDoc(doc(...))`.",
    ],
    backendAnalogy:
      "A Firestore real-time listener is the managed equivalent of subscribing to a database change stream (like a Postgres LISTEN/NOTIFY or a Kafka topic of CDC events) — except Firebase handles the WebSocket transport, auth, and reconnection for you. addDoc/updateDoc/deleteDoc map directly onto your repository's insert/update/delete methods.",
    keyInsights: [
      "onSnapshot is push-based: the callback fires on first load and on every change, so you never poll.",
      "Always return the unsubscribe function from useEffect to tear the listener down on unmount.",
      "Queries are composed declaratively with query(collection, where(...), orderBy(...)).",
    ],
    codeSamples: [
      {
        label: "Firebase Firestore — CRUD with real-time listeners",
        language: "ts",
        code: `// Firebase setup
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, where, orderBy, doc, updateDoc, deleteDoc
} from 'firebase/firestore';

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
});
const db = getFirestore(app);

// Create
async function addExpense(expense: Omit<Expense, 'id'>) {
  const docRef = await addDoc(collection(db, 'expenses'), {
    ...expense,
    createdAt: new Date(),
  });
  return docRef.id;
}

// Real-time listener (live updates!)
function useFirestoreExpenses(userId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    // onSnapshot — fires on every change (real-time)
    const unsubscribe = onSnapshot(q, snapshot => {
      setExpenses(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
    });

    return unsubscribe; // cleanup
  }, [userId]);

  return expenses;
}

// Update & Delete
const updateExpense = (id: string, data: Partial<Expense>) =>
  updateDoc(doc(db, 'expenses', id), data);
const removeExpense = (id: string) =>
  deleteDoc(doc(db, 'expenses', id));`,
      },
    ],
    interviewQA: [
      {
        question: "How do Firestore real-time listeners work, and why are they better than polling?",
        answer:
          "You subscribe to a query with onSnapshot. Firestore keeps a persistent connection open and pushes the initial snapshot plus a new snapshot whenever any matching document changes. This is push-based, so you get sub-second updates without burning requests on polling, and the SDK only sends the deltas. Polling, by contrast, wastes bandwidth, adds latency equal to the poll interval, and scales poorly.",
      },
      {
        question: "What must you do with the value onSnapshot returns?",
        answer:
          "onSnapshot returns an unsubscribe function. You must call it when you are done — in React, return it from useEffect so the listener is detached on unmount or when the query dependencies change. Forgetting this leaks listeners, causes duplicate updates, and continues consuming reads against your Firebase quota.",
      },
      {
        question: "Firestore vs Realtime Database — when would you pick each?",
        answer:
          "Realtime Database is a single JSON tree, optimized for simple, very low-latency state sync (presence, simple counters). Firestore is a document/collection model with richer querying (compound where/orderBy), better scaling, and structured data. Most new apps default to Firestore unless they need the absolute lowest-latency simple sync.",
      },
    ],
    thingsToRemember: [
      "onSnapshot = real-time push; it fires on first load and on every change.",
      "Return the unsubscribe function from useEffect to avoid leaked listeners.",
      "addDoc / updateDoc(doc(...)) / deleteDoc(doc(...)) are the CRUD primitives.",
    ],
    references: [
      { label: "Firebase — Firestore docs", url: "https://firebase.google.com/docs/firestore" },
    ],
    tags: ["firebase", "firestore", "realtime", "nosql", "listeners"],
  },
  {
    id: "push-notifications",
    num: 34,
    title: "Push Notifications",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Advanced",
    summary: "Server-to-device alerts delivered via a service worker — reach users even when the app is closed.",
    readingTime: 6,
    explanation: [
      "Push Notifications deliver messages from a server to a user's device even when your app's tab is closed or backgrounded. They are the one real-time technology that does not require your page to be open, because delivery is handled by a **service worker** registered with the browser's push service. This makes them ideal for alerts, reminders, and re-engagement.",
      "The typical flow uses **Firebase Cloud Messaging (FCM)**. First you request notification permission from the user with `Notification.requestPermission()`. If granted, you call `getToken` (supplying a VAPID key) to obtain a unique push token for that device, and send it to your backend to store. Your server later uses that token to push messages through FCM.",
      "When a push arrives while the app is in the **foreground**, FCM's `onMessage` callback fires so you can show an in-app toast. When the app is **backgrounded or closed**, the service worker handles the push and displays a system notification. Push is server-to-device and one-directional.",
    ],
    backendAnalogy:
      "The push token is like a durable webhook URL your backend stores per device: you persist it, then your server fires messages at FCM (the broker), which fans them out to the right device. The service worker is a background daemon the OS wakes up to handle delivery — analogous to a message consumer that runs independently of any open user session.",
    keyInsights: [
      "Push is the only real-time channel that reaches users when the app is closed, because a service worker handles delivery.",
      "You must request permission, fetch a per-device token (with a VAPID key), and send it to your backend to store.",
      "Foreground messages fire onMessage for in-app UI; backgrounded messages are shown by the service worker as OS notifications.",
    ],
    codeSamples: [
      {
        label: "Push Notifications via Firebase Cloud Messaging",
        language: "ts",
        code: `// Push Notifications (via Firebase Cloud Messaging)
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const messaging = getMessaging(app);

async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    // Send token to your backend to store
    await api.post('/users/push-token', { token });
  }
}

// Listen for foreground messages
onMessage(messaging, (payload) => {
  toast.info(payload.notification?.title);
});`,
      },
    ],
    interviewQA: [
      {
        question: "Walk through the service worker push notification flow.",
        answer:
          "1) Register a service worker and request notification permission from the user. 2) On grant, call getToken with your VAPID key to get a unique device token, and POST it to your backend. 3) Your server later sends a message to FCM (or a push service) targeting that token. 4) If the app is in the foreground, onMessage fires and you show an in-app toast; if it is backgrounded or closed, the browser wakes the service worker, which calls showNotification to display an OS-level notification.",
      },
      {
        question: "Why can push notifications reach a user when no tab is open, unlike WebSockets or SSE?",
        answer:
          "WebSocket and SSE connections live inside a page; closing the tab closes the connection. Push relies on the service worker and the browser's push service, which run independently of any page. The browser maintains the connection to the push service, and when a message arrives it wakes the service worker to handle it — so delivery does not depend on your app being open.",
      },
    ],
    thingsToRemember: [
      "Push = server-to-device, delivered via a service worker, works when the app is closed.",
      "Flow: requestPermission -> getToken(vapidKey) -> store token on backend -> server pushes via FCM.",
      "Foreground -> onMessage (in-app UI); background -> service worker shows an OS notification.",
    ],
    references: [
      { label: "Firebase — Cloud Messaging (FCM)", url: "https://firebase.google.com/docs/cloud-messaging" },
      { label: "MDN — Push API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Push_API" },
    ],
    tags: ["push", "notifications", "fcm", "service-worker", "real-time"],
  },
  {
    id: "websockets",
    num: 35,
    title: "WebSockets",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Core",
    summary: "Persistent, bidirectional TCP connection for chat, collaboration, and live dashboards — often via Socket.IO.",
    readingTime: 6,
    explanation: [
      "WebSockets provide a **bidirectional**, full-duplex connection over a single persistent TCP socket. Once the connection is upgraded from HTTP, both the client and the server can send messages at any time without the overhead of new HTTP requests. This makes WebSockets the right choice for chat, real-time collaboration, live dashboards, and multiplayer gaming.",
      "**Socket.IO** is a popular library that wraps WebSockets with conveniences: automatic reconnection, fallback transports, rooms, and an event-based API (`socket.on`, `socket.emit`). You authenticate the connection (here by passing a token in `auth`), subscribe to named server events, and emit your own events back — the bidirectional nature means the client can both receive `expense:approved` events and send `notification:read` events.",
      "Browser real-time has three main technologies, and choosing correctly is critical:",
      [
        "| Technology | Direction | Connection | Best For |",
        "| --- | --- | --- | --- |",
        "| WebSocket | Bidirectional | Persistent TCP | Chat, collaboration, live dashboards, gaming |",
        "| SSE (EventSource) | Server -> Client only | Persistent HTTP | News feeds, notifications, live logs, stock tickers |",
        "| Push Notifications | Server -> Device | Via service worker | Alerts when app is closed/backgrounded |",
      ].join("\n"),
      "In React, register listeners inside `useEffect` and **always clean them up** with `socket.off(...)` in the cleanup function so you do not accumulate duplicate handlers across re-renders.",
    ],
    backendAnalogy:
      "A WebSocket is the frontend counterpart to a Vert.x event-bus connection or a long-lived gRPC stream: a single persistent channel over which either side can push framed messages. Socket.IO's rooms and named events map onto pub/sub topics, and its auth handshake is the equivalent of authenticating a stream before subscribing.",
    keyInsights: [
      "WebSocket is bidirectional over one persistent TCP socket — both sides can send at any time.",
      "Socket.IO adds auto-reconnection, fallback transports, rooms, and an event API on top of raw WebSockets.",
      "In React, register socket.on handlers in useEffect and remove them with socket.off in the cleanup to avoid duplicates.",
    ],
    codeSamples: [
      {
        label: "WebSocket — real-time notifications with Socket.IO",
        language: "ts",
        code: `// WebSocket with Socket.IO
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_WS_URL, {
  auth: { token: localStorage.getItem('token') },
});

function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    socket.on('expense:approved', (data) => {
      setNotifications(prev => [data, ...prev]);
      toast.success(\`Expense #\${data.id} approved!\`);
    });

    socket.on('expense:rejected', (data) => {
      setNotifications(prev => [data, ...prev]);
      toast.error(\`Expense #\${data.id} rejected\`);
    });

    return () => {
      socket.off('expense:approved');
      socket.off('expense:rejected');
    };
  }, []);

  // Send message (bidirectional)
  const markRead = (id: string) => socket.emit('notification:read', { id });

  return { notifications, markRead };
}`,
      },
    ],
    interviewQA: [
      {
        question: "WebSocket vs SSE vs polling — when do you use each?",
        answer:
          "Use WebSockets when you need bidirectional, low-latency communication (chat, collaboration, gaming) where the client also sends frequent messages. Use SSE when data flows only server-to-client (notifications, live feeds, stock tickers, logs) — it is simpler, runs over plain HTTP, and auto-reconnects. Use polling only as a last resort or for infrequent updates where a persistent connection is overkill; it adds latency and wastes requests.",
      },
      {
        question: "How does WebSocket reconnection work, and what does Socket.IO add?",
        answer:
          "A raw WebSocket simply closes on network failure — you must detect the close event and reconnect with your own backoff, and re-subscribe/re-authenticate. Socket.IO handles this automatically: it reconnects with exponential backoff, re-emits a connect event so you can re-join rooms, and can fall back to HTTP long-polling when WebSockets are blocked. You should still make handlers idempotent and re-fetch any state missed while disconnected.",
      },
      {
        question: "Why must you clean up socket listeners in React?",
        answer:
          "Because the module-level socket persists across renders, every time the effect runs it calls socket.on again. Without removing the old handler in the cleanup (socket.off), you accumulate duplicate listeners, so a single event fires your callback multiple times — causing duplicated state updates and toasts. Returning a cleanup that calls socket.off keeps exactly one handler registered.",
      },
    ],
    thingsToRemember: [
      "WebSocket = bidirectional, persistent TCP; best for chat, collaboration, dashboards, gaming.",
      "Socket.IO adds auto-reconnect, transport fallback, rooms, and named events.",
      "Always socket.off in the useEffect cleanup to prevent duplicate handlers.",
    ],
    references: [
      { label: "Socket.IO — Client docs", url: "https://socket.io/docs/v4/client-api/" },
      { label: "MDN — WebSockets API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
    ],
    tags: ["websocket", "socket.io", "real-time", "bidirectional", "react"],
  },
  {
    id: "server-sent-events-sse",
    num: 36,
    title: "Server-Sent Events (SSE)",
    part: "Real-Time Communication",
    partId: "i",
    difficulty: "Core",
    summary: "One-way server-to-client streaming over plain HTTP via EventSource — with built-in auto-reconnect.",
    readingTime: 5,
    explanation: [
      "Server-Sent Events (SSE) provide a **one-directional** stream from server to client over a single persistent HTTP connection, using the browser's built-in `EventSource` API. It is simpler than WebSockets because there is no protocol upgrade and no client-to-server channel — you only listen. SSE is ideal for news feeds, notifications, live logs, and stock tickers.",
      "Usage is minimal: create `new EventSource(url)`, handle incoming messages in `onmessage` (parsing `event.data`, which is text), and handle failures in `onerror`. A major advantage of SSE over a raw WebSocket is that `EventSource` **automatically reconnects** if the connection drops, with no extra code.",
      "Choosing between the real-time technologies:",
      [
        "| Technology | Direction | Connection | Best For |",
        "| --- | --- | --- | --- |",
        "| WebSocket | Bidirectional | Persistent TCP | Chat, collaboration, live dashboards, gaming |",
        "| SSE (EventSource) | Server -> Client only | Persistent HTTP | News feeds, notifications, live logs, stock tickers |",
        "| Push Notifications | Server -> Device | Via service worker | Alerts when app is closed/backgrounded |",
      ].join("\n"),
      "As with any subscription, in React you create the `EventSource` in `useEffect` and call `source.close()` in the cleanup so the connection is torn down on unmount or when the URL changes.",
    ],
    backendAnalogy:
      "SSE is a long-lived HTTP response that the server keeps writing to — the equivalent of a streaming HTTP endpoint or a chunked text/event-stream response from a backend. Because it rides on ordinary HTTP, it passes through proxies, load balancers, and firewalls more easily than a WebSocket upgrade, much like any other GET request.",
    keyInsights: [
      "SSE is one-way (server -> client) over plain HTTP, and EventSource auto-reconnects on drop for free.",
      "It is simpler than WebSockets — no upgrade handshake and no client-to-server messaging.",
      "Best for feeds, notifications, live logs, and tickers; reach for WebSockets only when you need bidirectional traffic.",
    ],
    codeSamples: [
      {
        label: "SSE — Server-Sent Events (simpler, HTTP-based)",
        language: "ts",
        code: `// SSE — Server-Sent Events (simpler, HTTP-based)
function useSSEUpdates(url: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const source = new EventSource(url);

    source.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    source.onerror = () => source.close();

    return () => source.close();
  }, [url]);

  return data;
}`,
      },
    ],
    interviewQA: [
      {
        question: "Why choose SSE over WebSockets?",
        answer:
          "When data only needs to flow server-to-client (live feeds, notifications, logs, tickers), SSE is simpler: it uses the native EventSource API over plain HTTP with no protocol upgrade, it works through proxies and firewalls that may block WebSockets, and it reconnects automatically. WebSockets are warranted only when you also need the client to push messages frequently in real time.",
      },
      {
        question: "How does SSE reconnection differ from a raw WebSocket's?",
        answer:
          "EventSource reconnects automatically when the connection drops — the browser retries after a delay the server can control via the retry field, and it can resume from the last event using the Last-Event-ID header. A raw WebSocket gives you none of this; you must detect the close and implement reconnection and resync yourself (which is why people reach for a library like Socket.IO).",
      },
      {
        question: "What are the limitations of SSE?",
        answer:
          "It is one-directional (no client-to-server channel besides the initial request), it carries only UTF-8 text (binary needs encoding), and over HTTP/1.1 browsers limit the number of concurrent connections per origin, which can starve other requests — HTTP/2 largely fixes this via multiplexing. If you need bidirectional or binary-heavy traffic, use WebSockets.",
      },
    ],
    thingsToRemember: [
      "SSE = one-way server -> client over HTTP via EventSource, with built-in auto-reconnect.",
      "Simpler than WebSockets; great for feeds, notifications, logs, and tickers.",
      "Create EventSource in useEffect and call source.close() in the cleanup.",
    ],
    references: [
      { label: "MDN — Server-Sent Events", url: "https://developer.mozilla.org/en-US/docs/Web/API/EventSource" },
      { label: "MDN — Using server-sent events", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events" },
    ],
    tags: ["sse", "eventsource", "streaming", "real-time", "http"],
  },
];
