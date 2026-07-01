import type { FrontendTopic } from "../types";

export const partH: FrontendTopic[] = [
  {
    id: "axios",
    num: 28,
    title: "Axios",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Core",
    summary:
      "The complete HTTP-client story: fetch vs Axios, configured instances, request/response interceptors, cancellation, retries, upload progress, and end-to-end type safety — beginner to advanced in one page.",
    readingTime: 16,
    explanation: [
      "**What is an HTTP client, and why not just use fetch?** Every SPA needs to talk to a backend over HTTP. The browser ships a built-in client, `fetch`, and there is also a hugely popular library, **Axios**. `fetch` is standard and dependency-free, but it is deliberately low-level: it does not reject on 4xx/5xx (only on network failure), you must call `res.json()` yourself, there is no built-in timeout, no interceptors, and no automatic JSON stringifying. Axios wraps all of that: it parses JSON for you, rejects on non-2xx by default, supports timeouts, interceptors, and instances. Neither is 'correct' — know both and pick per project.",
      "**Configured instances.** The first thing most apps do is create a configured **instance** with `axios.create(...)`, setting a `baseURL`, a `timeout`, and default headers in one place. Every call made through that instance inherits the configuration, so you never repeat the base URL or content type. You can create several instances — one for your own API, one for a third-party service — each with its own config and interceptors, without polluting the global `axios`.",
      "**Request interceptors.** A request interceptor runs before every outgoing call and can mutate the config. The canonical use is attaching the auth token from storage to the `Authorization` header, but it is also where you add a correlation/trace id, set a locale header, or log outgoing traffic. It must return the (possibly modified) config or a promise resolving to it.",
      "**Response interceptors.** A response interceptor runs after every response — and, crucially, after every error. The canonical use is handling `401 Unauthorized` globally by refreshing the token or redirecting to login, instead of writing that logic in every component. You register two functions: an `onFulfilled` for successful responses and an `onRejected` for errors; returning a rejected promise re-throws to the caller, while returning a value 'recovers' the call.",
      "**The error shape.** With `fetch` you inspect `res.ok` and `res.status` manually. With Axios, a rejected error carries `error.response` (the server answered with a non-2xx — you have `status`, `data`, `headers`), `error.request` (the request was sent but no response came — network down, timeout, CORS), or neither (a config/setup error). The `axios.isAxiosError(err)` type guard narrows an `unknown` catch to this shape in TypeScript so you can branch on `error.response?.status`.",
      "**Cancellation.** Long-lived or superseded requests (type-ahead search, a component that unmounts mid-flight) should be cancelled. Modern Axios and `fetch` both use the standard `AbortController`: create one, pass its `signal` into the request, and call `controller.abort()` to cancel. In React you typically abort in a `useEffect` cleanup so a stale response never overwrites fresh state. A cancelled request rejects with a distinguishable error (`axios.isCancel(err)` / an `AbortError`).",
      "**Timeouts.** A request that hangs forever is worse than one that fails fast. Axios has a built-in `timeout` (milliseconds) per request or per instance; `fetch` has none, so you emulate it with an `AbortController` and a `setTimeout` that calls `abort()`. Always set a timeout on real network calls — the mobile-network hang is the classic bug.",
      "**Retries and backoff.** Transient failures (5xx, 429, network blips) are worth retrying; deterministic ones (400, 422) are not. A retry helper loops up to N times on transient statuses, waiting an exponentially increasing delay (`base * 2^attempt`) with a little random jitter, and honors a `Retry-After` header on 429. Axios has a community plugin (`axios-retry`), but a ~15-line wrapper is often clearer and framework-agnostic.",
      "**Upload/download progress.** Axios exposes `onUploadProgress` and `onDownloadProgress` callbacks giving you `loaded`/`total` bytes — perfect for a progress bar on file uploads. `fetch` requires reading the response body as a stream to get download progress and cannot report upload progress at all, which is one practical reason teams still reach for Axios.",
      "**Type safety with TypeScript.** You parameterize the call (`api.get<Expense[]>(...)`) so the resolved `response.data` is fully typed. A thin wrapper like `() => api.get<Expense[]>('/expenses').then(r => r.data)` gives you typed functions your components and data-fetching hooks (React Query, SWR) can call directly. Keep these wrappers in one `api/` module so the rest of the app never touches raw URLs or the client library.",
      "**Where Axios fits with data-fetching libraries.** Axios is a transport; React Query / SWR are the cache and lifecycle layer. In practice Axios (or fetch) is the function you hand to `useQuery`, and the library handles caching, deduping, retries, and stale-while-revalidate. Don't reinvent caching inside interceptors — that is the query library's job.",
      "**Security note.** Interceptors that read tokens from `localStorage` are convenient but expose the token to any XSS on the page. For sensitive apps prefer an httpOnly cookie set by the backend (the browser attaches it automatically, no interceptor needed) plus CSRF protection. The auth topic covers the trade-off in depth.",
      "**The mental model (memorise this).** An HTTP client is your app's single door to the network: `create` an instance to configure that door once, use a request interceptor to stamp every outgoing letter (auth), a response interceptor to handle every reply centrally (401/refresh), an AbortController to tear up letters you no longer need, a timeout so you never wait forever, and generics so what comes back is typed all the way to the component.",
    ],
    backendAnalogy:
      "An Axios instance with interceptors is the frontend equivalent of a Spring `RestTemplate`/`WebClient` (or a Vert.x `WebClient`) with registered `ClientHttpRequestInterceptor`s: you configure the base URL, timeouts, and default headers once and reuse it. The request interceptor that attaches a Bearer token is exactly like a server-side filter adding an auth header to every outbound call; the 401 response interceptor is your centralized exception handler. `AbortController` cancellation is the client analogue of a `CompletableFuture.cancel()` / Vert.x request timeout, and the exponential-backoff retry wrapper is the same pattern you'd build with Resilience4j `Retry`. Typing `api.get<T>` is choosing a typed `ParameterizedTypeReference<T>` so the deserialized body is a real type, not `Object`.",
    keyInsights: [
      "fetch is built-in and standard but low-level: it does not reject on 4xx/5xx, has no timeout, no interceptors, and needs a manual res.json() call. Axios adds all of those.",
      "Create one configured instance (baseURL, timeout, headers) and import it everywhere — never scatter bare axios calls with full URLs across the app.",
      "Request interceptors attach the auth token and trace ids; response interceptors handle cross-cutting errors like 401 globally so components stay clean.",
      "The Axios error object has three shapes: error.response (server answered non-2xx), error.request (no response came), or a setup error. Narrow it with axios.isAxiosError.",
      "Cancel superseded or unmounted requests with a standard AbortController and its signal; abort in a React useEffect cleanup to avoid stale-state overwrites.",
      "Always set a timeout on real requests. Axios has one built in; fetch needs an AbortController plus setTimeout to emulate it.",
      "Retry only transient failures (5xx, 429, network) with exponential backoff plus jitter and Retry-After; never retry 400/422.",
      "Axios reports upload and download progress via onUploadProgress/onDownloadProgress; fetch cannot report upload progress at all.",
      "Use generics (api.get<T>) and keep thin typed wrappers in one api module so response.data is typed end to end.",
      "Reading tokens from localStorage in an interceptor is convenient but XSS-exposed; httpOnly cookies avoid the interceptor entirely at the cost of needing CSRF protection.",
    ],
    codeSamples: [
      {
        label: "fetch vs Axios — the same GET, side by side",
        language: "ts",
        code: `// --- fetch: low-level, does NOT throw on 404/500 ---
async function getUserFetch(id: number) {
  const res = await fetch(\`/api/users/\${id}\`);
  // fetch only rejects on network failure, so we must check status ourselves
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json(); // must parse the body manually
}

// --- Axios: parses JSON, rejects on non-2xx, typed ---
import axios from 'axios';

async function getUserAxios(id: number) {
  // response.data is already parsed; a 404/500 throws automatically
  const { data } = await axios.get<User>(\`/api/users/\${id}\`);
  return data;
}`,
      },
      {
        label: "Instance, interceptors, and typed API calls",
        language: "ts",
        code: `import axios from 'axios';

// Create ONE configured instance and import it everywhere
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // fail fast instead of hanging forever
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token + trace id to every call
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  config.headers['X-Trace-Id'] = crypto.randomUUID();
  return config;
});

// Response interceptor — handle 401 globally, unwrap nothing
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error); // re-throw so callers can still catch
  },
);

// Type-safe wrappers — the rest of the app calls these, never raw URLs
export const getExpenses = () =>
  api.get<Expense[]>('/expenses').then(r => r.data);
export const createExpense = (body: Omit<Expense, 'id'>) =>
  api.post<Expense>('/expenses', body).then(r => r.data);
export const deleteExpense = (id: number) =>
  api.delete(\`/expenses/\${id}\`);`,
      },
      {
        label: "Cancellation with AbortController (type-ahead search)",
        language: "ts",
        code: `import axios from 'axios';

// Pass a signal; call abort() to cancel an in-flight request
function search(query: string, signal: AbortSignal) {
  return api.get<Result[]>('/search', { params: { q: query }, signal })
    .then(r => r.data);
}

// In React: abort the previous request when the query changes / unmounts
// useEffect(() => {
//   const controller = new AbortController();
//   search(query, controller.signal)
//     .then(setResults)
//     .catch(err => { if (!axios.isCancel(err)) showError(err); });
//   return () => controller.abort(); // cleanup cancels the stale call
// }, [query]);`,
      },
      {
        label: "Retry with exponential backoff (transient failures only)",
        language: "ts",
        code: `import axios from 'axios';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function withRetry<T>(fn: () => Promise<T>, max = 3): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      const transient = status === undefined || status >= 500 || status === 429;
      if (!transient || attempt >= max) throw err; // don't retry 400/422

      // exponential backoff with jitter: 300ms, 600ms, 1200ms (+/- randomness)
      const delay = 300 * 2 ** attempt + Math.random() * 100;
      await sleep(delay);
    }
  }
}

// usage: const data = await withRetry(() => getExpenses());`,
      },
      {
        label: "Upload with progress + a fetch timeout for comparison",
        language: "ts",
        code: `// Axios reports upload progress natively
function uploadFile(file: File, onProgress: (pct: number) => void) {
  const form = new FormData();
  form.append('file', file);
  return api.post('/upload', form, {
    onUploadProgress: e => {
      if (e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
}

// fetch has no built-in timeout — emulate it with AbortController
async function fetchWithTimeout(url: string, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}`,
      },
    ],
    runnable: {
      title: "Live fetch to a public API + status handling in the console",
      html: `<button id="load">Fetch a random user</button>
<pre id="out">Click the button…</pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 12px; }
button { font-size: 16px; padding: 8px 14px; cursor: pointer; }
pre { background: #0b1020; color: #d6e2ff; padding: 12px; border-radius: 8px; white-space: pre-wrap; }`,
      js: `// Vanilla fetch demo: note fetch does NOT throw on HTTP errors,
// so we check res.ok ourselves — exactly like the Axios comparison above.
const out = document.querySelector("#out");
const btn = document.querySelector("#load");

async function load() {
  out.textContent = "Loading…";
  console.log("GET https://jsonplaceholder.typicode.com/users/1");
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    console.log("status:", res.status, "ok:", res.ok);
    if (!res.ok) throw new Error("HTTP " + res.status); // manual check
    const user = await res.json();
    out.textContent = "Name: " + user.name + "\\nEmail: " + user.email;
    console.log("parsed body:", user);
  } catch (err) {
    out.textContent = "Request failed: " + err.message;
    console.error("network/HTTP error:", err.message);
  }
}

btn.addEventListener("click", load);`,
    },
    interviewQA: [
      {
        question: "fetch vs Axios — when would you pick each?",
        answer:
          "fetch is built into every browser, so it is zero-dependency and standard — good for small apps, edge/serverless, or when you want no bundle cost. But it is low-level: it only rejects on network failure (not on 4xx/5xx), has no timeout, no interceptors, no upload progress, and you must call res.json() yourself. Axios adds automatic JSON handling, rejects on non-2xx, timeouts, interceptors, instances, cancellation, and progress callbacks — worth the ~15KB in a larger app. Know both; the interceptor + instance ergonomics are the usual reason teams choose Axios.",
      },
      {
        question: "What problem do Axios interceptors solve?",
        answer:
          "They centralize cross-cutting request/response logic. A request interceptor attaches the auth token (and trace ids) to every outgoing call so you don't repeat it; a response interceptor handles errors globally — catching a 401 to refresh the token or redirect to login, or normalizing error shapes. Without them you'd scatter the same boilerplate across every component.",
      },
      {
        question: "Why create an Axios instance instead of using the global axios?",
        answer:
          "An instance lets you set baseURL, timeout, and default headers once, so every call inherits them. You register interceptors scoped to that instance, and you can run multiple instances (your API vs a third-party service) with different configs without polluting the global axios.",
      },
      {
        question: "How do you cancel an in-flight request, and why does it matter in React?",
        answer:
          "Create an AbortController, pass its signal into the request, and call controller.abort() to cancel. In React you abort in a useEffect cleanup so that when the component unmounts or the query changes, a stale response can't overwrite fresh state or set state on an unmounted component. A cancelled request rejects distinguishably (axios.isCancel / AbortError) so you can ignore it rather than showing an error.",
      },
      {
        question: "How do you implement retry with backoff, and what should you NOT retry?",
        answer:
          "Loop up to a max attempt count, retrying only transient failures — 5xx, 429, and network errors — waiting an exponentially increasing delay (base * 2^attempt) with random jitter to avoid thundering herds, and honoring a Retry-After header on 429. Never retry deterministic client errors like 400 or 422; they will fail again and waste time.",
      },
      {
        question: "How do you get type safety on responses with Axios in TypeScript?",
        answer:
          "Pass a generic to the method: api.get<Expense[]>('/expenses'). Axios types AxiosResponse<T> so response.data is Expense[]. Wrap it as () => api.get<Expense[]>(url).then(r => r.data) to expose a cleanly typed function, and use axios.isAxiosError(err) in catch blocks to narrow unknown errors to the AxiosError shape.",
      },
      {
        question: "Why doesn't fetch report upload progress, and how does Axios?",
        answer:
          "The fetch API can read the download body as a stream to compute download progress, but it has no hook for the request (upload) body, so upload progress is impossible with plain fetch. Axios uses XMLHttpRequest under the hood in the browser, which fires progress events, so it exposes onUploadProgress and onDownloadProgress callbacks with loaded/total bytes — handy for file-upload progress bars.",
      },
    ],
    thingsToRemember: [
      "fetch: standard, no deps, low-level, does NOT throw on 4xx/5xx. Axios: interceptors, instances, timeout, cancellation, progress.",
      "axios.create gives a reusable instance with shared baseURL/timeout/headers; register interceptors on it.",
      "Request interceptor → attach token/trace id; response interceptor → handle 401/refresh globally.",
      "Error shape: error.response (non-2xx), error.request (no response), or setup error — narrow with axios.isAxiosError.",
      "Cancel with AbortController + signal; abort in useEffect cleanup to prevent stale-state writes.",
      "Always set a timeout; retry only transient failures (5xx/429/network) with exponential backoff + jitter.",
      "Generics (api.get<T>) make response.data typed; keep typed wrappers in one api/ module.",
      "Prefer httpOnly cookies over localStorage tokens for sensitive apps to reduce XSS exposure.",
    ],
    references: [
      { label: "Axios — docs (intro)", url: "https://axios-http.com/docs/intro" },
      { label: "Axios — interceptors", url: "https://axios-http.com/docs/interceptors" },
      { label: "Axios — handling errors", url: "https://axios-http.com/docs/handling_errors" },
      { label: "MDN — Using the Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
      { label: "MDN — AbortController", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController" },
      { label: "web.dev — Fetch API and streaming responses", url: "https://web.dev/articles/fetch-api-error-handling" },
    ],
    tags: ["axios", "fetch", "http", "interceptors", "cancellation", "retry", "typescript", "api"],
  },
  {
    id: "networking-fundamentals",
    num: 29,
    title: "Networking Fundamentals",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Core",
    summary:
      "The full HTTP picture for frontend engineers: request/response anatomy, methods, status codes, headers, DNS/TLS, REST, caching, and the CORS you will hit on day one — beginner to advanced in one page.",
    readingTime: 15,
    explanation: [
      "**What actually happens on a request.** When your app calls an API, the browser (1) resolves the domain to an IP via **DNS**, (2) opens a TCP connection and negotiates **TLS** if it's HTTPS, (3) sends an HTTP **request** (a method, a path, headers, and an optional body), and (4) receives an HTTP **response** (a status code, headers, and a body). Understanding this pipeline explains most 'why is my request slow / blocked / failing' questions you'll face.",
      "**HTTP methods describe intent.** GET reads (no body, safe, cacheable), POST creates (has a body, not idempotent — two POSTs make two rows), PUT replaces a whole resource (idempotent), PATCH updates some fields (partial), DELETE removes. **Idempotency** matters for retries: retrying a GET/PUT/DELETE is safe; retrying a POST can duplicate. This maps one-to-one to your Axios calls and your REST contract.",
      "**Status codes tell you what happened.** Families: 1xx informational, 2xx success (200 OK, 201 Created, 204 No Content), 3xx redirection (301/302, 304 Not Modified), 4xx client error (400 bad request, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 validation, 429 rate-limited), 5xx server error (500, 502 bad gateway, 503 unavailable, 504 timeout). The frontend treats them differently — 401 refresh/redirect to login, 403 show 'not allowed', 429 back off, 5xx retry or show an error UI.",
      "**Headers carry the metadata.** Requests send `Content-Type` (what the body is), `Accept` (what you want back), `Authorization` (credentials), and `Cookie`. Responses send `Content-Type`, `Set-Cookie`, `Cache-Control`, `ETag`, and the `Access-Control-Allow-*` CORS headers. Most 'it works in Postman but not the browser' bugs are a header/CORS difference — the browser enforces rules a raw HTTP tool does not.",
      "**Request/response bodies and content types.** JSON (`application/json`) is the default for APIs. File uploads use `multipart/form-data` via `FormData`. Old-style forms use `application/x-www-form-urlencoded`. The `Content-Type` you send must match what the server expects, and it also affects CORS (a JSON content type makes a request 'non-simple' and triggers a preflight — see below).",
      "**REST in one paragraph.** REST models your API as **resources** (nouns) addressed by URLs, manipulated with the HTTP methods (verbs): `GET /expenses` (list), `GET /expenses/42` (one), `POST /expenses` (create), `PUT/PATCH /expenses/42` (update), `DELETE /expenses/42` (remove). Statelessness means each request carries everything needed (e.g. the token) — no server-side session assumed. Good REST uses the right status codes and plural nouns, not verbs in the URL.",
      "**DNS and TLS run before every fresh connection.** DNS resolves the domain to an IP (cached, but the first lookup adds latency); TLS encrypts the channel and is why you always use HTTPS. Browsers **block mixed content** — an HTTPS page cannot load HTTP resources — so 'it works locally but breaks in prod' is often a mixed-content or certificate issue. HTTP/2 and HTTP/3 multiplex many requests over one connection, reducing the cost of many small calls.",
      "**HTTP caching — the header contract.** `Cache-Control` (e.g. `max-age=3600`, `no-cache`, `no-store`, `immutable`) tells the browser how long a response is fresh. **Conditional requests** use validators: the server sends an `ETag` (or `Last-Modified`); on the next request the browser sends `If-None-Match`, and the server replies `304 Not Modified` with no body if nothing changed — saving bandwidth. Static assets get long `max-age` + content hashing; API responses usually use short or no caching. This is separate from your app-level cache (React Query/SWR).",
      "**CORS — your day-one pain point.** The browser's **same-origin policy** blocks JavaScript from reading responses from a different **origin** (scheme + host + port must all match). Your React dev server on `localhost:5173` calling your API on `localhost:8080` are different origins, so the browser blocks the response — even though the request was sent and the server answered. The error is in the console, never in your catch's data.",
      "**How CORS actually works.** For 'simple' requests the browser adds an `Origin` header and checks the response's `Access-Control-Allow-Origin`. For 'non-simple' requests (methods like PUT/DELETE, custom headers like `Authorization`, or a JSON `Content-Type`) the browser first sends an **OPTIONS preflight** asking which origins/methods/headers are allowed; only if the server answers with matching `Access-Control-Allow-*` headers does the real request go out. To send cookies cross-origin you need `Access-Control-Allow-Credentials: true` and a specific (non-`*`) origin, plus `withCredentials` on the client.",
      "**Fixing CORS the right way.** CORS is enforced by the browser but configured on the **server** — it must return the right `Access-Control-Allow-*` headers. In development you can also point a dev proxy (Vite's `server.proxy`, Next.js rewrites) at the API so requests look same-origin. You never 'disable CORS' in the browser for production, and browser flags/extensions that do so only mask the problem locally.",
      "**The mental model (memorise this).** A request is a method + path + headers + body; a response is a status + headers + body. DNS→TLS→request→response is the pipeline. Status codes drive UX, headers carry the contract, caching is a header negotiation with ETags/304, and CORS is the browser refusing to let JS read a cross-origin response until the server opts in — a server-side fix, never a frontend one.",
    ],
    backendAnalogy:
      "You already write the other end of this contract. Mapping exceptions to HTTP responses in a Spring `@ControllerAdvice` (or a Vert.x failure handler) is exactly what the frontend reads when it branches on status codes. REST resources and verbs are your `@GetMapping`/`@PostMapping` routes. CORS is purely browser enforcement, so the fix lives where you'd configure a `CorsFilter`/`WebMvcConfigurer` in Spring or a `CorsHandler` in Vert.x — the client can't set `Access-Control-Allow-Origin` on itself. HTTP caching with ETag/If-None-Match/304 is the same conditional-GET you implement server-side with `ResponseEntity` ETags. Idempotency of PUT/DELETE vs POST is the identical concern you weigh when deciding whether a retry can double-charge.",
    keyInsights: [
      "A request = method + path + headers + body; a response = status + headers + body. DNS → TLS → request → response is the pipeline behind every call.",
      "Methods carry intent and idempotency: GET/PUT/DELETE are safe to retry; POST is not (it can duplicate). This drives your retry policy.",
      "Status codes drive UX: 401 → login/refresh, 403 → forbidden message, 404/422 → specific message, 429 → backoff, 5xx → retry/error UI.",
      "Most 'works in Postman, fails in the browser' bugs are headers or CORS — the browser enforces rules a raw HTTP tool does not.",
      "You WILL hit CORS immediately: dev server (:5173) and API (:8080) are different origins, so the browser blocks reading the response.",
      "Non-simple requests (PUT/DELETE, Authorization header, JSON Content-Type) trigger an OPTIONS preflight; the server must answer with Access-Control-Allow-* headers.",
      "Sending cookies cross-origin needs Access-Control-Allow-Credentials: true, a specific (non-*) origin, and withCredentials on the client.",
      "CORS is fixed on the SERVER (or a dev proxy), never by disabling it in the browser for production.",
      "HTTP caching is a header negotiation: Cache-Control for freshness, ETag/If-None-Match → 304 Not Modified to skip re-downloading unchanged bodies.",
      "HTTPS is non-negotiable — browsers block mixed content, so an HTTPS page can't load HTTP resources.",
    ],
    codeSamples: [
      {
        label: "Anatomy of an HTTP request and response",
        language: "bash",
        code: `# --- REQUEST: method + path + headers + optional body ---
POST /api/expenses HTTP/1.1
Host: api.example.com
Content-Type: application/json      # what the body IS
Accept: application/json           # what we want BACK
Authorization: Bearer eyJhbGci...  # credentials

{ "title": "Lunch", "amount": 12.5 }

# --- RESPONSE: status + headers + body ---
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/expenses/42         # where the new resource lives
Cache-Control: no-store
ETag: "a1b2c3"

{ "id": 42, "title": "Lunch", "amount": 12.5 }`,
      },
      {
        label: "Mapping status codes to frontend behaviour",
        language: "ts",
        code: `// Central place to turn a status code into a UX decision
function handleStatus(status: number) {
  if (status === 401) window.location.href = '/login';        // not authenticated
  else if (status === 403) showToast('You are not allowed to do that');
  else if (status === 404) showToast('Not found');
  else if (status === 422) showFieldErrors();                 // validation
  else if (status === 429) scheduleBackoffRetry();            // rate limited
  else if (status >= 500) showToast('Server error — try again'); // transient
}

// REST verbs map straight to Axios calls
api.get('/expenses');            // list
api.get('/expenses/42');         // read one
api.post('/expenses', body);     // create   -> 201 Created
api.put('/expenses/42', body);   // full update (idempotent)
api.patch('/expenses/42', body); // partial update
api.delete('/expenses/42');      // remove    -> 204 No Content`,
      },
      {
        label: "CORS: what the browser and server exchange (preflight)",
        language: "bash",
        code: `# Browser sends a PREFLIGHT before a non-simple request (PUT + Authorization)
OPTIONS /api/expenses/42 HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: authorization, content-type

# Server MUST answer with matching allow-* headers or the browser blocks it
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5173   # not * when using credentials
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: authorization, content-type
Access-Control-Allow-Credentials: true               # required to send cookies
Access-Control-Max-Age: 600                           # cache the preflight`,
      },
      {
        label: "Dev proxy so requests look same-origin (no CORS in dev)",
        language: "ts",
        code: `// vite.config.ts — proxy /api to the backend so it is same-origin in dev
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // your Spring/Vert.x API
        changeOrigin: true,
        // rewrite: p => p.replace(/^\\/api/, ''), // if the backend has no /api prefix
      },
    },
  },
};

// Now the app fetches '/api/expenses' (same origin as :5173) and the browser
// never sees a cross-origin request — no CORS headers needed in development.`,
      },
      {
        label: "HTTP caching: ETag / If-None-Match / 304",
        language: "bash",
        code: `# First response is cacheable and carries a validator
HTTP/1.1 200 OK
Cache-Control: max-age=60
ETag: "v1-abc"
{ ...data... }

# Next time the browser asks 'only send it if it changed'
GET /api/config HTTP/1.1
If-None-Match: "v1-abc"

# Nothing changed -> tiny response, no body re-downloaded
HTTP/1.1 304 Not Modified
ETag: "v1-abc"`,
      },
    ],
    runnable: {
      title: "Inspect real status codes and headers from a public API",
      html: `<button id="go">Make requests</button>
<pre id="out">Click to fire a 200 and a 404…</pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 12px; }
button { font-size: 16px; padding: 8px 14px; cursor: pointer; }
pre { background: #0b1020; color: #d6e2ff; padding: 12px; border-radius: 8px; white-space: pre-wrap; }`,
      js: `const out = document.querySelector("#out");

async function probe(url) {
  const res = await fetch(url);
  // Read a couple of response headers to show the metadata layer
  const ctype = res.headers.get("content-type");
  const line = "GET " + url + "\\n  status: " + res.status +
               " (" + res.statusText + ")  content-type: " + ctype;
  console.log(line);
  return line;
}

document.querySelector("#go").addEventListener("click", async () => {
  out.textContent = "Working…";
  const ok = await probe("https://jsonplaceholder.typicode.com/todos/1");   // 200
  const missing = await probe("https://jsonplaceholder.typicode.com/none"); // 404
  out.textContent = ok + "\\n\\n" + missing +
    "\\n\\nNote: fetch resolved BOTH — it does not throw on 404.";
});`,
    },
    interviewQA: [
      {
        question: "What is CORS and how do you fix a CORS error?",
        answer:
          "CORS (Cross-Origin Resource Sharing) is the browser's same-origin-policy enforcement: it blocks JavaScript from reading a response from a different origin (different scheme, host, or port) unless the server explicitly allows it via Access-Control-Allow-Origin. The request may still reach the server and get answered — the browser just refuses to hand the response to your code. The fix is on the server (return the right Access-Control-Allow-* headers, and handle the OPTIONS preflight for non-simple requests). In development you can also use a dev proxy so requests look same-origin. You cannot fix it from frontend code alone.",
      },
      {
        question: "What triggers a CORS preflight, and what is exchanged?",
        answer:
          "Non-simple cross-origin requests trigger a preflight: methods like PUT/DELETE/PATCH, custom headers like Authorization, or a Content-Type other than the simple set (so application/json does). The browser first sends an OPTIONS request with Access-Control-Request-Method and Access-Control-Request-Headers. The server must respond with matching Access-Control-Allow-Methods/Headers/Origin; only then does the real request go out. Access-Control-Max-Age lets the browser cache that preflight.",
      },
      {
        question: "How should the frontend react to different HTTP status codes?",
        answer:
          "2xx is success. 401 (unauthenticated) redirects to login or triggers a token refresh. 403 (forbidden) means authenticated-but-not-allowed — show a message, don't send to login. 404/422 map to specific UI messages (not found / validation). 429 is rate-limiting — back off and retry with Retry-After. 5xx are server errors — show an error state and optionally retry with backoff. The key distinction is 4xx (your request is wrong, don't blindly retry) vs 5xx (server's fault, retry may help).",
      },
      {
        question: "What is the difference between PUT and PATCH, and why does idempotency matter?",
        answer:
          "PUT replaces the entire resource with the payload (full update); PATCH applies a partial update to specific fields. Both are updates, but PATCH sends only changed fields. Idempotency matters for retries: GET, PUT, and DELETE are idempotent (repeating them yields the same state), so they're safe to retry after a timeout. POST is not idempotent — retrying can create a duplicate — so retries and 'exactly once' need care (idempotency keys).",
      },
      {
        question: "How does HTTP caching with ETags work, and how is it different from a client cache like React Query?",
        answer:
          "The server sends an ETag (or Last-Modified) with a response. On the next request the browser sends If-None-Match with that ETag; if nothing changed the server replies 304 Not Modified with no body, saving bandwidth. Cache-Control (max-age, no-store) controls freshness. That is HTTP-level caching handled by the browser. React Query/SWR is an application-level cache in JS memory that dedupes, keeps data across components, and does stale-while-revalidate — a different layer, and you often use both.",
      },
      {
        question: "Why does a request work in Postman but fail in the browser?",
        answer:
          "Because the browser enforces things a raw HTTP tool does not: the same-origin policy (CORS), mixed-content blocking (HTTPS page can't call HTTP), cookie SameSite rules, and automatic headers like Origin. Postman sends the request from a non-browser context with no origin enforcement, so it succeeds while the browser blocks reading the response. The bug is almost always a missing server-side CORS header or a cookie/credentials setting.",
      },
    ],
    thingsToRemember: [
      "Pipeline: DNS → TLS → request (method+path+headers+body) → response (status+headers+body).",
      "Methods & idempotency: GET/PUT/DELETE safe to retry; POST is not (can duplicate).",
      "Status families: 2xx success, 3xx redirect/304, 4xx client (401 login, 403 forbidden, 404, 422 validation, 429 backoff), 5xx server.",
      "CORS is browser-enforced, server-fixed: return Access-Control-Allow-* or use a dev proxy — never disable it in prod.",
      "Non-simple requests (PUT/DELETE, Authorization, JSON) trigger an OPTIONS preflight.",
      "Cross-origin cookies need Access-Control-Allow-Credentials: true + a specific origin + withCredentials.",
      "Caching: Cache-Control for freshness; ETag + If-None-Match → 304 to skip re-downloading unchanged bodies.",
      "HTTPS is mandatory — browsers block mixed content; 'works in Postman' usually means a CORS/cookie difference.",
    ],
    references: [
      { label: "MDN — HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
      { label: "MDN — CORS", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" },
      { label: "MDN — HTTP response status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" },
      { label: "MDN — HTTP caching", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" },
      { label: "MDN — HTTP request methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" },
      { label: "web.dev — HTTP caching", url: "https://web.dev/articles/http-cache" },
    ],
    tags: ["http", "cors", "networking", "status-codes", "rest", "caching", "headers", "tls", "dns"],
  },
  {
    id: "authentication-authorization",
    num: 30,
    title: "Authentication & Authorization",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Advanced",
    summary:
      "The complete auth story for the frontend: JWT vs sessions/cookies, where to store tokens safely (localStorage vs httpOnly), OAuth/OIDC, refresh-token rotation, XSS/CSRF defenses, and RBAC route guards — beginner to advanced in one page.",
    readingTime: 18,
    explanation: [
      "**Authentication vs authorization.** **Authentication** (authn) proves *who you are* — logging in, validating a token. **Authorization** (authz) decides *what you're allowed to do* — roles and permissions. You authenticate once, then authorize every action. On the client, authz shows up as route guards and conditional UI, but it is only a hint — the server must re-check every protected request.",
      "**Two models: sessions vs JWTs.** In **session-based** auth the server creates a session, stores state server-side, and hands the browser a **session-id cookie**; every request sends that cookie and the server looks up the session. In **token-based** (JWT) auth the server returns a signed **JSON Web Token** carrying claims (user id, roles, expiry); the client sends it in the `Authorization: Bearer` header and the server verifies the signature without any lookup. Sessions are stateful and trivially revocable; JWTs are stateless and scale horizontally but are hard to revoke before they expire.",
      "**What a JWT actually is.** Three base64url parts joined by dots: a **header** (algorithm), a **payload** (claims like `sub`, `role`, `exp`), and a **signature**. It is *signed, not encrypted* — anyone can read the payload, so never put secrets in it. The signature only proves it wasn't tampered with. The server trusts it because it can verify the signature with its secret/public key.",
      "**The big question: where do you store the token?** This is the most important — and most fumbled — decision. **`localStorage`** is easy (JS reads it, an interceptor attaches it) but is fully exposed to **XSS**: any injected script can steal every token. **httpOnly cookies** cannot be read by JavaScript, so XSS can't exfiltrate them, and the browser attaches them automatically — but cookies are sent on every request, which opens them to **CSRF**. In-memory (a JS variable) is XSS-resistant-ish and lost on refresh. There is no perfect option; you trade which attack you defend against.",
      "**The pragmatic recommendation.** For most apps: keep the **access token in memory** (or accept localStorage for low-risk apps) and the **refresh token in an httpOnly, Secure, SameSite cookie** set by the backend. That way XSS can't steal the long-lived refresh token, and CSRF is contained because the refresh endpoint is the only cookie-authenticated route and can carry a CSRF token. Alternatively, do a full cookie-session model (httpOnly session cookie + CSRF token) and skip client-side token handling entirely.",
      "**XSS is the token-theft threat.** Cross-Site Scripting = attacker-injected JavaScript running in your origin. If your token lives anywhere JS can read it, XSS steals it. Defenses: never `dangerouslySetInnerHTML` untrusted data, rely on React's default escaping, set a strict **Content-Security-Policy**, and prefer httpOnly cookies so the token is out of JS's reach. XSS is why 'just use localStorage' is not a safe default for sensitive apps.",
      "**CSRF is the cookie threat.** Cross-Site Request Forgery = a malicious site tricks the browser into sending your auth **cookie** on a state-changing request (the browser attaches cookies automatically). It only matters when you authenticate with cookies. Defenses: `SameSite=Lax`/`Strict` cookies (the modern baseline), a synchronizer **CSRF token** (double-submit or header), and checking the Origin/Referer. Bearer-token-in-header auth is naturally CSRF-immune because the browser doesn't auto-attach the Authorization header — which is the trade-off against XSS.",
      "**Refresh tokens and rotation.** Access tokens are kept **short-lived** (minutes) to limit damage if leaked; a **long-lived refresh token** silently obtains a new access token without re-login. **Rotation** issues a new refresh token on each use and invalidates the old one, so a stolen refresh token is detectable (reuse of an old one is a breach signal). Store refresh tokens in httpOnly cookies and rotate them.",
      "**Token refresh via a response interceptor.** The clean pattern: catch a `401`, guard with a `_retry` flag so you refresh at most once, call the refresh endpoint, store the new access token, update the failed request's `Authorization` header, and replay the original request — making expiry invisible to the app. The `_retry` flag prevents an infinite loop when the refresh itself fails, in which case you log the user out. When many requests fail at once, queue them behind a single in-flight refresh so you don't fire N refreshes.",
      "**OAuth 2.0 and OIDC.** **OAuth 2.0** is a delegation protocol ('let this app act on my behalf'); **OpenID Connect** layers identity (an **ID token**) on top for 'log in with Google/GitHub'. For SPAs the correct flow is **Authorization Code with PKCE** — the implicit flow is deprecated because it leaked tokens in the URL. The app redirects to the provider, the user consents, the provider redirects back with a short-lived code, and the app exchanges the code (plus a PKCE verifier) for tokens. You then send the ID token to *your* backend to verify and mint *your* session — never trust a provider token blindly on the client.",
      "**Authorization on the client: route guards and RBAC.** Role-Based Access Control gates routes and UI: an `AdminRoute` reads the current user, redirects to `/login` if unauthenticated and to `/unauthorized` if the role is wrong, and conditional rendering hides buttons the user can't use. This is **UX only**. Anyone can edit the JS, call the API directly, or forge a request — so the server must independently authorize every protected endpoint. Client RBAC improves experience; it is never a security boundary.",
      "**Logout and expiry.** Logout must clear the access token, tell the backend to revoke/rotate-out the refresh token (you can't 'delete' a stateless JWT, so revocation needs a server-side denylist or short expiry), and clear any auth state/caches. On expiry, the interceptor either refreshes silently or, if refresh fails, redirects to login with the intended URL preserved so the user returns where they were.",
      "**The mental model (memorise this).** Authn = who you are (session cookie or Bearer JWT); authz = what you can do (server-enforced, client-hinted). Store the long-lived secret where JS can't read it (httpOnly cookie) to beat XSS, and defend cookie auth against CSRF (SameSite + token). Keep access tokens short, refresh silently in an interceptor with rotation, use Authorization-Code-with-PKCE for OAuth, and treat client-side RBAC as UX — the backend is always the real gate.",
    ],
    backendAnalogy:
      "The Bearer-JWT-on-every-request pattern is a stateless Spring Security filter chain validating a token per request — no `HttpSession` needed, which is why it scales like your stateless REST services. Session cookies are the classic `HttpSession` + `JSESSIONID` model: revocable but requiring shared session storage (a sticky-session or Redis-backed store) to scale, exactly the trade-off you weigh server-side. Refresh-token rotation is the short-lived-access + long-lived-refresh scheme you'd implement with a token store and a reuse-detection denylist. OAuth's Authorization-Code-with-PKCE is what Spring Authorization Server / `spring-security-oauth2-client` orchestrates. And client RBAC route guards are the mirror of `@PreAuthorize(\"hasRole('ADMIN')\")` — but only the server's `@PreAuthorize` is authoritative; the frontend guard just hides the button.",
    keyInsights: [
      "Authentication proves who you are; authorization decides what you can do. Client authz is a UX hint — the server enforces it on every request.",
      "Sessions are stateful and easily revoked but need shared session storage; JWTs are stateless and scale but are hard to revoke before expiry.",
      "A JWT is signed, not encrypted — anyone can read the payload, so never put secrets in it; the signature only proves integrity.",
      "Where you store the token is the key decision: localStorage is XSS-exposed, httpOnly cookies are XSS-safe but CSRF-exposed, in-memory is safer but lost on refresh.",
      "Pragmatic default: access token in memory, refresh token in an httpOnly + Secure + SameSite cookie set by the backend.",
      "XSS steals tokens JS can read — defend with output escaping, CSP, and httpOnly cookies. CSRF abuses auto-sent cookies — defend with SameSite plus a CSRF token.",
      "Bearer-in-header auth is CSRF-immune (the browser doesn't auto-attach it) but XSS-vulnerable; cookie auth is the reverse — pick your threat.",
      "Keep access tokens short-lived; use a long-lived, rotating refresh token to renew silently, with reuse detection to spot theft.",
      "Refresh via a response interceptor with a _retry guard and a single queued in-flight refresh so a 401 storm doesn't fire N refreshes or loop forever.",
      "For OAuth in SPAs use Authorization Code with PKCE (implicit is deprecated); verify the provider token on YOUR backend and mint your own session.",
    ],
    codeSamples: [
      {
        label: "Storage trade-offs: localStorage vs httpOnly cookie",
        language: "ts",
        code: `// --- Option A: localStorage (easy, but XSS can read it) ---
localStorage.setItem('accessToken', token);
api.interceptors.request.use(c => {
  const t = localStorage.getItem('accessToken');   // <-- any injected script can too
  if (t) c.headers.Authorization = \`Bearer \${t}\`;
  return c;
});

// --- Option B: httpOnly cookie (JS CANNOT read it; XSS-safe) ---
// The BACKEND sets it on login:
//   Set-Cookie: refresh=...; HttpOnly; Secure; SameSite=Strict; Path=/auth
// The browser attaches it automatically; you just enable credentials:
const api = axios.create({ baseURL: '/api', withCredentials: true });
// No interceptor needed for the cookie — but now protect against CSRF (below).`,
      },
      {
        label: "JWT login + silent refresh via response interceptor",
        language: "ts",
        code: `import axios from 'axios';

// Access token kept in memory (not localStorage) to reduce XSS exposure
let accessToken: string | null = null;

async function login(email: string, password: string) {
  // Backend sets the refresh token as an httpOnly cookie AND returns the access token
  const { data } = await api.post('/auth/login', { email, password });
  accessToken = data.accessToken;
  return data.user;
}

api.interceptors.request.use(c => {
  if (accessToken) c.headers.Authorization = \`Bearer \${accessToken}\`;
  return c;
});

// Queue concurrent 401s behind ONE refresh so we don't fire many refreshes
let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // refresh at most once per request
      try {
        refreshing ??= axios
          .post('/auth/refresh', {}, { withCredentials: true }) // cookie carries refresh token
          .then(r => (accessToken = r.data.accessToken));
        const fresh = await refreshing;
        refreshing = null;
        original.headers.Authorization = \`Bearer \${fresh}\`;
        return api(original); // replay the original request
      } catch (e) {
        refreshing = null;
        accessToken = null;
        window.location.href = '/login'; // refresh failed -> log out
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);`,
      },
      {
        label: "OAuth 2.0 Authorization Code with PKCE (the SPA-correct flow)",
        language: "ts",
        code: `// 1) Build a PKCE challenge and redirect the user to the provider
async function startLogin() {
  const verifier = crypto.randomUUID() + crypto.randomUUID(); // random secret
  sessionStorage.setItem('pkce_verifier', verifier);

  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, ''); // base64url

  const params = new URLSearchParams({
    client_id: 'my-spa',
    redirect_uri: window.location.origin + '/callback',
    response_type: 'code',            // Authorization Code (NOT implicit)
    scope: 'openid profile email',
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  window.location.href = \`https://auth.example.com/authorize?\${params}\`;
}

// 2) On /callback, exchange the code (+ verifier) for tokens, then hand the
//    ID token to YOUR backend to verify and mint your own session.
async function handleCallback(code: string) {
  const verifier = sessionStorage.getItem('pkce_verifier')!;
  const { data } = await axios.post('https://auth.example.com/token', {
    grant_type: 'authorization_code', code, code_verifier: verifier,
    client_id: 'my-spa', redirect_uri: window.location.origin + '/callback',
  });
  await api.post('/auth/oauth', { idToken: data.id_token }); // backend verifies + sets session
}`,
      },
      {
        label: "CSRF defense (double-submit token) + RBAC route guard",
        language: "tsx",
        code: `// CSRF: when using cookie auth, echo a CSRF token in a header.
// The backend compares the header value to a token bound to the session.
api.interceptors.request.use(c => {
  const csrf = getCookie('XSRF-TOKEN');        // readable, non-httpOnly cookie
  if (csrf) c.headers['X-XSRF-TOKEN'] = csrf;  // attacker's site can't read it -> can't forge
  return c;
});

// RBAC route guard — UX ONLY; the server still authorizes every request
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;          // not authenticated
  if (user.role !== 'admin') return <Navigate to="/unauthorized" replace />; // wrong role
  return <>{children}</>;
}

// Conditional UI is also just a hint, never a security boundary:
// {user.role === 'admin' && <DeleteButton />}`,
      },
    ],
    runnable: {
      title: "Decode a JWT payload in the browser (signed, not encrypted!)",
      html: `<p>Paste a JWT (or use the sample) and decode its readable payload.</p>
<textarea id="jwt" rows="4" style="width:100%"></textarea>
<button id="decode">Decode payload</button>
<pre id="out"></pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 12px; }
button { font-size: 16px; padding: 8px 14px; cursor: pointer; margin-top: 6px; }
pre { background: #0b1020; color: #d6e2ff; padding: 12px; border-radius: 8px; white-space: pre-wrap; }`,
      js: `// A JWT is header.payload.signature (base64url). It is SIGNED, not encrypted —
// so anyone can read the payload. This demo proves it: never store secrets in a JWT.
const sample =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0IiwibmFtZSI6IkFkYSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTk5OTk5OTk5OX0." +
  "signature-not-verified-here";
const ta = document.querySelector("#jwt");
ta.value = sample;

function base64UrlDecode(part) {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(escape(atob(b64)));
}

document.querySelector("#decode").addEventListener("click", () => {
  const out = document.querySelector("#out");
  try {
    const payload = ta.value.split(".")[1];
    const json = JSON.parse(base64UrlDecode(payload));
    out.textContent = JSON.stringify(json, null, 2);
    console.log("Anyone can read this without the secret:", json);
    if (json.exp) console.log("expires:", new Date(json.exp * 1000).toISOString());
  } catch (e) {
    out.textContent = "Not a valid JWT: " + e.message;
  }
});`,
    },
    interviewQA: [
      {
        question: "What is the difference between authentication and authorization?",
        answer:
          "Authentication verifies identity — proving who the user is (login, token validation). Authorization determines what an authenticated user may do (roles, permissions). You authenticate first, then authorize each action. On the client, authorization appears as route guards and conditional UI, but it must be enforced on the server; the client version is only a UX convenience.",
      },
      {
        question: "JWT vs session-based authentication — what's the trade-off?",
        answer:
          "Sessions keep state on the server (a session-id cookie maps to server-side data), which makes revocation trivial but requires shared session storage to scale horizontally. JWTs are stateless — the signed token carries the claims and any server can verify it without a lookup, so it scales cleanly — but they're hard to revoke before expiry. That's why you pair a short-lived access JWT with a refresh token (and often a server-side denylist for revocation).",
      },
      {
        question: "Where should you store tokens in the browser, and why?",
        answer:
          "There's no perfect place — you're choosing which attack to defend against. localStorage is easy but any XSS can read it, so it's unsafe for sensitive apps. httpOnly cookies can't be read by JS (XSS-safe) but are auto-sent, exposing you to CSRF. In-memory is XSS-resistant but lost on refresh. The common recommendation is: access token in memory, refresh token in an httpOnly + Secure + SameSite cookie, so XSS can't steal the long-lived credential and CSRF is contained to the refresh endpoint with a CSRF token.",
      },
      {
        question: "Explain XSS vs CSRF and how each maps to token storage.",
        answer:
          "XSS (Cross-Site Scripting) runs attacker JS in your origin; it can read anything JS can read — so tokens in localStorage or non-httpOnly cookies get stolen. Defend with output escaping (React does this), CSP, and httpOnly cookies. CSRF (Cross-Site Request Forgery) tricks the browser into sending your auth cookie on a state-changing request; it only affects cookie-based auth. Defend with SameSite cookies and a CSRF token. Bearer-token-in-header auth is CSRF-immune (not auto-sent) but XSS-vulnerable; cookie auth is the reverse.",
      },
      {
        question: "Why use a refresh token with rotation, and how does the interceptor handle expiry?",
        answer:
          "Short-lived access tokens limit exposure if stolen; the long-lived refresh token gets a new access token without re-login. Rotation issues a new refresh token each time and invalidates the old one, so reuse of an old refresh token signals theft. The response interceptor catches a 401, sets a _retry guard to refresh at most once, queues concurrent 401s behind a single in-flight refresh, stores the new access token, updates the original request's header, and replays it — so expiry is invisible. If refresh fails, it logs out.",
      },
      {
        question: "Which OAuth flow should a SPA use, and why not implicit?",
        answer:
          "Authorization Code with PKCE. The implicit flow returned tokens directly in the redirect URL fragment, where they leaked into history, logs, and referrers, and it had no client secret to protect the exchange. PKCE lets a public client (a SPA with no secret) prove it initiated the flow via a code_verifier/code_challenge pair, so the authorization code can only be exchanged by the app that started the login. Implicit is now deprecated for this reason.",
      },
      {
        question: "Is checking the user's role in a route guard enough for security?",
        answer:
          "No. Client-side role checks (AdminRoute, conditional buttons) are purely UX — they hide UI the user shouldn't see, but anyone can edit the JS or call the API directly. The server must independently authorize every protected request. Never trust the client for authorization decisions; the frontend guard just improves the experience.",
      },
    ],
    thingsToRemember: [
      "Authn = who you are; authz = what you can do. Client authz is UX only; the backend is the real gate.",
      "Sessions: stateful, revocable, need shared storage. JWTs: stateless, scalable, hard to revoke — a signed (not encrypted) token.",
      "Token storage trade-off: localStorage = XSS-exposed; httpOnly cookie = XSS-safe but CSRF-exposed; in-memory = safer, lost on refresh.",
      "Default: access token in memory, refresh token in httpOnly + Secure + SameSite cookie.",
      "XSS steals JS-readable tokens (defend: escaping, CSP, httpOnly). CSRF abuses auto-sent cookies (defend: SameSite + CSRF token).",
      "Short access tokens + rotating refresh tokens; refresh silently in a response interceptor with a _retry guard and a single queued refresh.",
      "OAuth for SPAs: Authorization Code with PKCE (implicit is deprecated); verify provider token on your backend.",
      "RBAC route guards and conditional UI are hints — the server authorizes every protected endpoint.",
    ],
    references: [
      { label: "OWASP — Cheat Sheet: JWT for Java (token handling)", url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" },
      { label: "OWASP — Cross-Site Request Forgery Prevention", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" },
      { label: "OWASP — Cross Site Scripting Prevention", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" },
      { label: "MDN — HTTP authentication", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" },
      { label: "IETF — OAuth 2.0 for Browser-Based Apps (PKCE)", url: "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps" },
      { label: "web.dev — SameSite cookies explained", url: "https://web.dev/articles/samesite-cookies-explained" },
    ],
    tags: ["auth", "jwt", "sessions", "cookies", "oauth", "pkce", "refresh-tokens", "xss", "csrf", "rbac", "security"],
  },
  {
    id: "error-handling",
    num: 31,
    title: "Error Handling",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Core",
    summary:
      "A resilient error strategy for the whole app: network vs application errors, error boundaries for the render path, status-aware API handling, retries with backoff, graceful user feedback, and production monitoring — beginner to advanced in one page.",
    readingTime: 15,
    explanation: [
      "**Two categories, two tools.** Frontend errors split cleanly. **Rendering errors** — an exception thrown during render, in a lifecycle method, or in a child's constructor — are caught by an **Error Boundary**. **Everything else** — event handlers, async code, and data fetching — is caught by ordinary **try/catch** (or a promise `.catch`). Using the wrong tool is the #1 error-handling mistake: boundaries do NOT catch async or network errors.",
      "**Network vs application errors.** A **network error** means the request never got a response — the server is down, the connection dropped, a timeout fired, or CORS blocked it (`error.request` in Axios, no `error.response`). An **application error** means the server responded but with a failure status — 400/401/403/404/422/500 (`error.response` present with a `status`). They need different UX: network errors say 'check your connection / retrying', application errors show a specific message tied to the status.",
      "**Error boundaries — the render-path safety net.** Boundaries must be class components: they implement `static getDerivedStateFromError` to switch to a fallback UI and `componentDidCatch` to log the error (e.g. to Sentry). Wrap sections of the app so a crash in one widget shows a fallback instead of unmounting the whole tree (a blank white screen). Place several small boundaries around independent regions rather than one giant boundary at the root.",
      "**What boundaries deliberately miss.** They do not catch errors in event handlers, `setTimeout`/promise callbacks, data fetching, server-side rendering, or errors thrown in the boundary itself — none of those happen during rendering. In modern apps you often use the community `react-error-boundary` package for a hook-friendly API (`useErrorBoundary`, a `FallbackComponent`, and an `onReset`), but under the hood it's still a class.",
      "**Status-aware API handling.** For the network path, a reusable `safeApiCall`/`handleError` inspects the error with `axios.isAxiosError` and branches on `error.response?.status`: 404 → 'not found', 422 → surface field validation, 401 → refresh/redirect, 429 → back off, 5xx → 'server error, try again', and no `response` → 'network error'. Centralizing this keeps components focused on rendering rather than error plumbing.",
      "**Retries and backoff for transient errors.** Some failures are transient (5xx, 429, dropped connections) and worth retrying; deterministic ones (400, 422) are not — retrying just wastes time and can annoy the user. Retry up to a small max with **exponential backoff** (`base * 2^attempt`) plus **jitter** to avoid a thundering herd, and honor a `Retry-After` header on 429. Data libraries like React Query do this for you (`retry`, `retryDelay`), which is usually where retry logic belongs.",
      "**Graceful user feedback.** Every failure needs a human-readable outcome. Use **toasts** for transient/recoverable errors, **inline field errors** for 422 validation, a **fallback region** (from the error boundary) for a crashed widget, and a **full-page error** with a retry button for a fatal load failure. Never show a raw stack trace or a bare 'Error' — and never silently swallow an error, which hides bugs from both users and you.",
      "**Loading, empty, error, and success are four states.** A robust data component always models all four, not just success. React Query gives you `isLoading`, `isError`, `error`, and `data`; render a spinner, an error state with retry, an empty state, and the data respectively. 'It works on my machine' bugs are usually an unmodeled error or empty state.",
      "**Optimistic updates and rollback.** For snappy UX you can apply a mutation to the UI immediately and roll back if the request fails. This is powerful but error-prone: you must keep the previous state and restore it in the error handler (React Query's `onMutate`/`onError`/`onSettled` formalize this). If you can't cleanly roll back, prefer a pending state instead.",
      "**Global handlers catch what you missed.** Register `window.addEventListener('error', ...)` and `window.addEventListener('unhandledrejection', ...)` to catch stray errors and rejected promises that no local handler caught, and report them to monitoring. This is a safety net, not a substitute for local handling — but it surfaces the errors you didn't anticipate.",
      "**Monitoring in production.** Log caught errors to a service (Sentry, Datadog) from `componentDidCatch` and your global handlers, with context (user id, route, release). This is how you learn about crashes real users hit — the console is invisible in production. Attach a release/version so you can tell which deploy introduced a regression.",
      "**The mental model (memorise this).** Two paths, two tools: error boundaries wrap the render path so a crash degrades to a fallback, and try/catch handles the async/network path. Distinguish network (no response) from application (bad status) errors, branch on status for the right message, retry only transient failures with backoff, give the user a real state (loading/empty/error/success) for every fetch, and always log to monitoring so production failures aren't invisible.",
    ],
    backendAnalogy:
      "An Error Boundary is the React equivalent of a global exception handler — Spring's `@ControllerAdvice`/`@ExceptionHandler` or a Vert.x failure handler — one place to catch unhandled errors on the render path and return a safe fallback instead of a 500-equivalent white screen. The status-aware `safeApiCall` is the client mirror of mapping exceptions to HTTP responses: you branch on the status to produce the right user-facing outcome, just as your backend maps `EntityNotFoundException` → 404 and `ValidationException` → 422. Retry-with-backoff is the same Resilience4j `Retry` + `CircuitBreaker` pattern you apply to flaky downstream calls, and reporting to Sentry is your client-side equivalent of structured logging + APM. Global `unhandledrejection` handlers are the browser's version of an uncaught-exception handler / dead-letter queue for errors nothing else caught.",
    keyInsights: [
      "Two categories, two tools: error boundaries catch render-path errors; try/catch (or .catch) catches event-handler, async, and network errors — boundaries do NOT catch those.",
      "Network error = no response came (server down, timeout, CORS; error.request). Application error = server responded with a failure status (error.response). They need different UX.",
      "Error boundaries are class components using getDerivedStateFromError (fallback UI) + componentDidCatch (logging); prefer several small boundaries over one at the root.",
      "Branch on axios.isAxiosError(err) then error.response?.status: 404 not found, 422 validation, 401 refresh, 429 backoff, 5xx retry, no response = network.",
      "Retry only transient failures (5xx, 429, network) with exponential backoff + jitter and Retry-After; never retry 400/422.",
      "Model four states for every fetch — loading, empty, error, success — not just the happy path.",
      "Give real feedback: toasts for transient errors, inline errors for validation, fallback regions for crashes, full-page error+retry for fatal loads. Never swallow an error silently.",
      "Optimistic updates need explicit rollback (save previous state, restore on error) or a pending state instead.",
      "Register window 'error' and 'unhandledrejection' handlers as a global safety net that reports to monitoring.",
      "Always log caught errors to a monitoring service (Sentry) with context and release — the console is invisible in production.",
    ],
    codeSamples: [
      {
        label: "Error boundary (render path) — class component required",
        language: "tsx",
        code: `import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  // 1) Switch to a fallback UI when a child throws during render
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // 2) Side effect: log to a monitoring service
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
    // Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p>Something went wrong.</p>;
    }
    return this.props.children;
  }
}

// Wrap independent regions so one crash doesn't blank the whole app
// <ErrorBoundary fallback={<ErrorPanel />}><ExpenseWidget /></ErrorBoundary>`,
      },
      {
        label: "Distinguishing network vs application errors",
        language: "ts",
        code: `import axios from 'axios';

function describeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Application error: the server answered with a failure status
      switch (error.response.status) {
        case 401: return 'Please log in again.';
        case 403: return 'You are not allowed to do that.';
        case 404: return 'We could not find that.';
        case 422: return 'Please fix the highlighted fields.';
        case 429: return 'Too many requests — slow down.';
        default:  return error.response.status >= 500
          ? 'Server error — please try again.'
          : 'Request failed.';
      }
    }
    if (error.request) {
      // Network error: request sent, but NO response (down/timeout/CORS)
      return 'Network problem — check your connection.';
    }
  }
  return 'Something unexpected happened.'; // setup/programming error
}`,
      },
      {
        label: "Retry with backoff + a status-aware safe wrapper",
        language: "ts",
        code: `import axios from 'axios';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Retry only TRANSIENT failures with exponential backoff + jitter
async function withRetry<T>(fn: () => Promise<T>, max = 3): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await fn(); }
    catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      const transient = status === undefined || status >= 500 || status === 429;
      if (!transient || attempt >= max) throw err;      // never retry 400/422
      await sleep(300 * 2 ** attempt + Math.random() * 100);
    }
  }
}

// Run a call safely, show feedback, and return null on failure
async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await withRetry(fn);
  } catch (error) {
    toast.error(describeError(error)); // human-readable, status-aware
    // Sentry.captureException(error);
    return null;                        // caller renders an error/empty state
  }
}`,
      },
      {
        label: "Four states with React Query + global safety net",
        language: "tsx",
        code: `import { useQuery } from '@tanstack/react-query';

function Expenses() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
    retry: (count, err) =>
      axios.isAxiosError(err) && (err.response?.status ?? 500) >= 500 && count < 3,
  });

  if (isLoading) return <Spinner />;                                  // loading
  if (isError)   return <ErrorState msg={describeError(error)} onRetry={refetch} />; // error
  if (!data?.length) return <EmptyState />;                           // empty
  return <ExpenseList items={data} />;                                // success
}

// Global safety net for anything no local handler caught
window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled rejection:', e.reason);
  // Sentry.captureException(e.reason);
});
window.addEventListener('error', e => {
  console.error('Uncaught error:', e.error);
});`,
      },
    ],
    runnable: {
      title: "Retry-with-backoff over a flaky (simulated) API in the console",
      html: `<button id="run">Call flaky API (fails ~60% of the time)</button>
<pre id="out"></pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 12px; }
button { font-size: 16px; padding: 8px 14px; cursor: pointer; }
pre { background: #0b1020; color: #d6e2ff; padding: 12px; border-radius: 8px; white-space: pre-wrap; }`,
      js: `// Simulate a transient failure (like a flaky 5xx) and retry with backoff.
const out = document.querySelector("#out");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function flakyCall() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.6) reject(new Error("503 Service Unavailable"));
      else resolve({ ok: true });
    }, 200);
  });
}

async function withRetry(fn, max) {
  for (let attempt = 0; ; attempt++) {
    try {
      const result = await fn();
      console.log("success on attempt " + (attempt + 1));
      return result;
    } catch (err) {
      if (attempt >= max) { console.error("giving up:", err.message); throw err; }
      const delay = Math.round(300 * 2 ** attempt + Math.random() * 100);
      console.warn("attempt " + (attempt + 1) + " failed (" + err.message +
                   ") — retrying in " + delay + "ms");
      await sleep(delay);
    }
  }
}

document.querySelector("#run").addEventListener("click", async () => {
  out.textContent = "Calling… (watch the console)";
  try {
    await withRetry(flakyCall, 4);
    out.textContent = "Succeeded (possibly after a few retries). Check the console log.";
  } catch {
    out.textContent = "Failed after all retries. Check the console log.";
  }
});`,
    },
    interviewQA: [
      {
        question: "What does an Error Boundary catch, and what does it NOT catch?",
        answer:
          "It catches errors thrown during rendering, in lifecycle methods, and in constructors of the components below it, rendering a fallback UI instead of a blank screen. It does NOT catch errors in event handlers, asynchronous code (setTimeout, promises), data fetching, server-side rendering, or errors thrown in the boundary itself — those need try/catch or a .catch.",
      },
      {
        question: "Why must Error Boundaries be class components?",
        answer:
          "The error-boundary lifecycle methods — static getDerivedStateFromError (render a fallback) and componentDidCatch (log the error) — only exist on class components; there's no hook equivalent yet. Even in a hooks codebase the boundary itself is a class, often the community react-error-boundary package, which wraps a class to give you a hook-friendly API (FallbackComponent, useErrorBoundary, onReset).",
      },
      {
        question: "How do you distinguish a network error from an application error?",
        answer:
          "In Axios, an application error has error.response present (the server answered with a failure status like 404/500) — you branch on error.response.status. A network error has error.request present but no error.response (the request went out but nothing came back — server down, timeout, or CORS block). They deserve different UX: application errors get a specific status message, network errors get a 'check your connection / retrying' message.",
      },
      {
        question: "When do you use an Error Boundary versus try/catch?",
        answer:
          "Use an Error Boundary for synchronous rendering errors in the component tree so a crash degrades to a fallback rather than unmounting everything. Use try/catch (or promise .catch) for async and network errors — API calls, event handlers, timers — because those don't occur during rendering, so boundaries won't see them.",
      },
      {
        question: "How would you implement retry with backoff, and what should you not retry?",
        answer:
          "Loop up to a max attempt count, retrying only transient failures — 5xx, 429, and network errors — waiting an exponentially increasing delay (base * 2^attempt) with random jitter to avoid thundering herds, and honoring a Retry-After header on 429. Don't retry deterministic client errors like 400 or 422 — they'll fail again. In practice, React Query's retry/retryDelay options are where this usually lives.",
      },
      {
        question: "What are the states a data-fetching component should render, and how do you give good feedback?",
        answer:
          "Loading, empty, error, and success — not just success. Show a spinner while loading, an empty state when there's no data, an error state with a retry button on failure, and the data on success. For feedback, use toasts for transient/recoverable errors, inline field errors for 422 validation, a fallback region for a crashed widget (from an error boundary), and a full-page error+retry for a fatal load. Never show a raw stack trace or silently swallow an error.",
      },
      {
        question: "How do you catch errors that no local handler caught, and why report to monitoring?",
        answer:
          "Register window 'error' and 'unhandledrejection' listeners as a global safety net, and log from componentDidCatch in your boundaries. Report all of these to a monitoring service (Sentry/Datadog) with context — user, route, release version — because the browser console is invisible in production; monitoring is how you learn which deploy introduced a crash real users are hitting.",
      },
    ],
    thingsToRemember: [
      "Two paths, two tools: error boundaries (render path) vs try/catch (async/network). Boundaries do NOT catch async/network errors.",
      "Network error = no response (error.request); application error = failure status (error.response). Different UX for each.",
      "Boundaries are class components: getDerivedStateFromError (fallback) + componentDidCatch (log). Use several small ones.",
      "Branch on axios.isAxiosError + status: 404, 422 validation, 401 refresh, 429 backoff, 5xx retry, none = network.",
      "Retry only transient failures (5xx/429/network) with exponential backoff + jitter + Retry-After; never 400/422.",
      "Model four states per fetch: loading, empty, error, success. Never swallow an error silently.",
      "Feedback map: toast (transient), inline (validation), fallback region (crash), full-page+retry (fatal load).",
      "Global window 'error'/'unhandledrejection' handlers + Sentry logging with release context surface production crashes.",
    ],
    references: [
      { label: "React — Error boundaries (Component)", url: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary" },
      { label: "Axios — Handling errors", url: "https://axios-http.com/docs/handling_errors" },
      { label: "MDN — try...catch", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch" },
      { label: "MDN — unhandledrejection event", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event" },
      { label: "TanStack Query — retries & error handling", url: "https://tanstack.com/query/latest/docs/framework/react/guides/query-retries" },
      { label: "web.dev — resilient network requests", url: "https://web.dev/articles/fetch-api-error-handling" },
    ],
    tags: ["error-handling", "error-boundary", "retry", "resilience", "axios", "react", "monitoring", "user-feedback"],
  },
];
