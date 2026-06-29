import type { FrontendTopic } from "../types";

export const partH: FrontendTopic[] = [
  {
    id: "axios",
    num: 28,
    title: "Axios",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Core",
    summary: "Configured instances, request/response interceptors, and type-safe API calls.",
    readingTime: 6,
    explanation: [
      "Axios is a promise-based HTTP client. The first thing most apps do is create a configured **instance** with `axios.create(...)`, setting a `baseURL`, a `timeout`, and default headers in one place. Every call made through that instance inherits the configuration, so you never repeat the base URL or content type.",
      "**Interceptors** are the killer feature. A request interceptor runs before every outgoing call — the canonical use is attaching the auth token from storage to the `Authorization` header. A response interceptor runs after every response (or error) — the canonical use is handling `401 Unauthorized` globally by clearing the token and redirecting to the login page, instead of writing that logic in every component.",
      "With TypeScript, you parameterize the call (`api.get<Expense[]>(...)`) so the resolved `response.data` is fully typed. A thin wrapper like `() => api.get<Expense[]>('/expenses').then(r => r.data)` gives you typed functions your components and data-fetching hooks can call directly.",
    ],
    backendAnalogy:
      "An Axios instance with interceptors is the frontend equivalent of a Spring RestTemplate/WebClient with registered ClientHttpRequestInterceptors, or a Vert.x WebClient with a shared config. The request interceptor that attaches a Bearer token is exactly like a server-side filter that adds an auth header to every outbound call; the 401 response interceptor is like a centralized exception handler.",
    keyInsights: [
      "Create one configured instance (baseURL, timeout, headers) and import it everywhere — never call the bare axios with full URLs scattered across the app.",
      "Request interceptors attach auth tokens; response interceptors handle cross-cutting errors like 401 globally so components stay clean.",
      "Use generics (api.get<T>) so response.data is typed end to end.",
    ],
    codeSamples: [
      {
        label: "Instance, interceptors, and typed API calls",
        language: "ts",
        code: `import axios from 'axios';

// Create a configured instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token to every call
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type-safe API calls
const getExpenses = () => api.get<Expense[]>('/expenses').then(r => r.data);
const createExpense = (data: Omit<Expense, 'id'>) =>
  api.post<Expense>('/expenses', data).then(r => r.data);
const deleteExpense = (id: number) => api.delete(\`/expenses/\${id}\`);`,
      },
    ],
    interviewQA: [
      {
        question: "What problem do Axios interceptors solve?",
        answer:
          "They centralize cross-cutting request/response logic. A request interceptor attaches the auth token to every outgoing call so you don't repeat it; a response interceptor handles errors globally — e.g. catching a 401 to clear the token and redirect to login, or transforming error shapes. Without them you'd scatter the same boilerplate across every component.",
      },
      {
        question: "Why create an Axios instance instead of using the global axios?",
        answer:
          "An instance lets you set baseURL, timeout, and default headers once. Every call inherits them, you can register interceptors scoped to that instance, and you can have multiple instances (e.g. one for your API, one for a third-party service) with different configs without polluting the global axios.",
      },
      {
        question: "How do you get type safety on responses with Axios in TypeScript?",
        answer:
          "Pass a generic to the method: api.get<Expense[]>('/expenses'). Axios types the AxiosResponse so response.data is Expense[]. Wrapping the call as () => api.get<Expense[]>(url).then(r => r.data) exposes a cleanly typed function to the rest of the app.",
      },
    ],
    thingsToRemember: [
      "axios.create gives a reusable instance with shared baseURL/timeout/headers.",
      "Request interceptor → attach token; response interceptor → handle 401 globally.",
      "Generics (api.get<T>) make response.data typed.",
    ],
    references: [
      { label: "Axios — docs", url: "https://axios-http.com/docs/intro" },
      { label: "MDN — Using Fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
    ],
    tags: ["axios", "http", "interceptors", "typescript", "api"],
  },
  {
    id: "networking-fundamentals",
    num: 29,
    title: "Networking Fundamentals",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Core",
    summary: "HTTP methods, status codes, DNS, TLS, and the CORS you will hit on day one.",
    readingTime: 6,
    explanation: [
      "Frontend networking rests on a handful of concepts that map directly to how your app behaves. **HTTP methods** describe intent: GET reads, POST creates, PUT/PATCH update, DELETE removes — and they map one-to-one to your Axios calls and REST contract. **Status codes** tell you what happened: 2xx success, 4xx client error, 5xx server error. The frontend treats them differently — 401 redirects to login, 403 is forbidden, 429 means back off, and 5xx usually means retry or show an error UI.",
      "The table below summarizes the core concepts and why each one matters to you as a frontend engineer:",
      "| Concept | What It Is | Frontend Impact |\n| --- | --- | --- |\n| HTTP Methods | GET (read), POST (create), PUT/PATCH (update), DELETE (remove) | Map to Axios calls; match your REST API contract |\n| Status Codes | 2xx success, 4xx client error, 5xx server error | 401 → redirect to login; 403 → forbidden; 429 → backoff; 5xx → retry/error UI |\n| DNS | Resolves domain to IP before any request | First step of every page load; affects initial performance |\n| TLS/HTTPS | Encrypts all traffic between browser and server | Always use HTTPS; mixed content is blocked by browsers |\n| CORS | Browser blocks cross-origin requests unless server allows it | Your #1 dev pain point: React on :5173 calling API on :8080 = different origins. Fix on the server with Access-Control-Allow-Origin header. |",
      "**CORS** deserves special attention because you will hit it on day one. The browser's same-origin policy blocks cross-origin requests unless the server opts in. Your React dev server on `localhost:5173` calling your API on `localhost:8080` are different origins, so the browser blocks the response. The fix lives on the **server**, which must return `Access-Control-Allow-Origin: http://localhost:5173` — or you point a dev proxy (e.g. Vite's `server.proxy`) at the API so requests appear same-origin.",
    ],
    backendAnalogy:
      "CORS is purely a browser enforcement, so the fix is always server-side — the same place you'd configure a CorsFilter in Spring or a CorsHandler in Vert.x. Status-code handling on the client mirrors how your backend's exception handlers map exceptions to HTTP responses; the frontend is just reading the other end of that contract.",
    keyInsights: [
      "Status codes drive UX: 401 → login, 403 → forbidden, 429 → backoff, 5xx → retry/error UI.",
      "You WILL hit CORS immediately — React dev server (:5173) and API (:8080) are different origins; the browser blocks the response.",
      "CORS is fixed on the server (Access-Control-Allow-Origin header) or with a dev proxy — never by 'disabling' it in the browser for production.",
      "DNS and TLS run before every request; HTTPS is non-negotiable because browsers block mixed content.",
    ],
    codeSamples: [
      {
        label: "Status-code-driven handling and a Vite dev proxy",
        language: "ts",
        code: `// Map status codes to frontend behaviour
function handleStatus(status: number) {
  if (status === 401) window.location.href = '/login'; // not authenticated
  else if (status === 403) showToast('You are not allowed to do that');
  else if (status === 429) scheduleBackoffRetry();       // too many requests
  else if (status >= 500) showToast('Server error — try again');
}

// vite.config.ts — proxy /api to the backend so it is same-origin in dev
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
};`,
      },
    ],
    interviewQA: [
      {
        question: "What is CORS and how do you fix a CORS error?",
        answer:
          "CORS (Cross-Origin Resource Sharing) is the browser's same-origin policy enforcement: it blocks reading responses from a different origin (different scheme, host, or port) unless the server explicitly allows it. The fix is on the server — return Access-Control-Allow-Origin (and for non-simple requests, handle the preflight OPTIONS with the right Allow-Methods/Allow-Headers). In development you can also use a dev proxy so requests look same-origin. You cannot fix it from the frontend code alone.",
      },
      {
        question: "How should the frontend react to different HTTP status codes?",
        answer:
          "2xx means success. 401 (unauthenticated) should redirect to login or trigger a token refresh. 403 (forbidden) means the user is authenticated but not allowed — show an 'unauthorized' message, don't redirect to login. 429 means rate-limited — back off and retry later. 5xx are server errors — show an error state and optionally retry with backoff. 4xx like 404/422 usually map to specific UI messages.",
      },
      {
        question: "What is the difference between PUT and PATCH?",
        answer:
          "PUT replaces the entire resource with the payload (full update, idempotent). PATCH applies a partial update to specific fields. Both update, but PATCH sends only the changed fields while PUT expects the complete representation.",
      },
      {
        question: "Why is a request 'preflighted' and what triggers it?",
        answer:
          "For non-simple cross-origin requests — those using methods like PUT/DELETE, custom headers, or content types other than the simple set — the browser first sends an OPTIONS preflight to ask the server which origins, methods, and headers are allowed. Only if the server responds with the matching Access-Control-Allow-* headers does the real request go out.",
      },
    ],
    thingsToRemember: [
      "Methods: GET read, POST create, PUT/PATCH update, DELETE remove.",
      "Status families: 2xx success, 4xx client, 5xx server — 401 login, 403 forbidden, 429 backoff.",
      "CORS is a server-side fix (Access-Control-Allow-Origin) or a dev proxy — different port = different origin.",
    ],
    references: [
      { label: "MDN — HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
      { label: "MDN — CORS", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" },
      { label: "MDN — HTTP response status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" },
    ],
    tags: ["http", "cors", "networking", "status-codes", "tls"],
  },
  {
    id: "authentication-authorization",
    num: 30,
    title: "Authentication & Authorization",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Advanced",
    summary: "JWT login flow, token refresh via interceptor, Google OAuth, and RBAC route guards.",
    readingTime: 8,
    explanation: [
      "**Authentication** is proving who you are; **authorization** is what you're allowed to do. A typical JWT flow is: the user logs in, the server returns an access token (and usually a refresh token), the frontend stores them and attaches the access token to every request (via the Axios request interceptor), and refreshes the access token when it expires.",
      "**Token refresh** is best handled in a response interceptor. When a request fails with 401 and hasn't already been retried (`_retry` guard), you call the refresh endpoint with the refresh token, store the new access token, update the failed request's `Authorization` header, and replay the original request. This makes expiry transparent to the rest of the app. The `_retry` flag prevents an infinite loop if the refresh itself fails.",
      "**Google OAuth** (here via Firebase) opens a popup, signs the user in, and returns an ID token. You send that token to your backend, which verifies it and issues your own session/JWT. **Authorization** on the client is enforced with route guards: an `AdminRoute` reads the current user, redirects to `/login` if unauthenticated and to `/unauthorized` if the role is wrong. Remember that client-side RBAC is a UX layer only — the server must always re-check permissions.",
    ],
    backendAnalogy:
      "The JWT-on-every-request pattern mirrors a stateless Spring Security filter chain validating a Bearer token per request — no server session needed. The refresh-token dance is the same short-lived-access + long-lived-refresh model you'd implement server-side. RBAC route guards are the client mirror of @PreAuthorize / hasRole checks, but they only hide UI — authoritative authorization still happens on the backend.",
    keyInsights: [
      "Short-lived access token + long-lived refresh token: attach the access token via the request interceptor, refresh it transparently in the response interceptor.",
      "Guard the refresh with a _retry flag so a failing refresh doesn't loop forever.",
      "OAuth: get a provider ID token on the client, then send it to your backend to verify and exchange for your own session.",
      "Client-side RBAC (route guards) is UX only — the server must enforce authorization on every protected endpoint.",
    ],
    codeSamples: [
      {
        label: "JWT flow, token refresh, Google OAuth, and RBAC",
        language: "tsx",
        code: `// JWT flow: login → store token → attach to requests → refresh
async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  // Store tokens securely
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.user;
}

// Token refresh — Axios interceptor pattern
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      const { data } = await axios.post('/auth/refresh', { refresh });
      localStorage.setItem('accessToken', data.accessToken);
      original.headers.Authorization = \`Bearer \${data.accessToken}\`;
      return api(original); // retry the failed request
    }
    return Promise.reject(error);
  }
);

// Google OAuth (Firebase)
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const googleLogin = async () => {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  const token = await result.user.getIdToken();
  // Send token to your backend for verification
};

// RBAC — role-based route protection
function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/unauthorized" />;
  return children;
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between authentication and authorization?",
        answer:
          "Authentication verifies identity — proving who the user is (login, token validation). Authorization determines what an authenticated user is permitted to do (roles, permissions). You authenticate first, then authorize each action. On the client, authorization shows as route guards and conditional UI, but it must be enforced on the server.",
      },
      {
        question: "JWT vs session-based authentication — what's the trade-off?",
        answer:
          "Sessions store state on the server (a session id in a cookie maps to server-side state), making revocation easy but requiring shared session storage to scale. JWTs are stateless — the token itself carries claims and is verified by signature, so any server can validate it without a lookup, which scales well. The downside is JWTs are hard to revoke before expiry, which is why you pair a short-lived access token with a refresh token.",
      },
      {
        question: "Why use a refresh token, and how does the interceptor pattern handle expiry?",
        answer:
          "Access tokens are kept short-lived to limit exposure if stolen. The long-lived refresh token gets a new access token without forcing re-login. The response interceptor catches a 401, sets a _retry guard so it only refreshes once, calls the refresh endpoint, stores the new access token, updates the original request's Authorization header, and replays the request — so expiry is invisible to the rest of the app.",
      },
      {
        question: "Is checking the user's role in a route guard enough for security?",
        answer:
          "No. Client-side role checks (like AdminRoute) are purely a UX convenience — they hide UI the user shouldn't see, but anyone can bypass the frontend. The server must independently authorize every protected request; never trust the client for authorization decisions.",
      },
    ],
    thingsToRemember: [
      "Login → store tokens → attach access token via request interceptor → refresh in response interceptor.",
      "Use a _retry flag on refresh to avoid infinite 401 loops.",
      "Client-side RBAC is UX only; the backend is the source of truth for authorization.",
    ],
    references: [
      { label: "Axios — docs", url: "https://axios-http.com/docs/intro" },
      { label: "MDN — HTTP authentication", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" },
      { label: "jwt.io — Introduction to JSON Web Tokens", url: "https://jwt.io/introduction" },
    ],
    tags: ["auth", "jwt", "oauth", "rbac", "security"],
  },
  {
    id: "error-handling",
    num: 31,
    title: "Error Handling",
    part: "Data Layer & Networking",
    partId: "h",
    difficulty: "Core",
    summary: "Error boundaries for rendering errors and status-aware patterns for API errors.",
    readingTime: 6,
    explanation: [
      "There are two distinct categories of error and two distinct tools. **Rendering errors** — an exception thrown during render, in a lifecycle method, or in a constructor of a child — are caught by an **Error Boundary**. Error boundaries must be class components: they implement `static getDerivedStateFromError` to render a fallback UI and `componentDidCatch` to log the error (e.g. to Sentry). You wrap sections of the app so a crash in one area shows a fallback instead of unmounting the whole tree.",
      "Error boundaries deliberately do **not** catch errors in event handlers, async code, or data fetching — those don't happen during rendering. For those you use ordinary `try/catch` (or promise `.catch`). A reusable `safeApiCall` wrapper runs the call in try/catch, and when it catches an error it inspects the status with `axios.isAxiosError`: 404 → 'Resource not found', 422 → 'Validation failed', everything else → a generic message, returning `null` on failure.",
      "Together they cover the surface: error boundaries are your safety net for the render path (so the UI degrades gracefully), and status-aware try/catch handles the network path (so you show the right message and keep the app running). Always log to a monitoring service from the boundary so you find out about production crashes.",
    ],
    backendAnalogy:
      "An Error Boundary is the React equivalent of a global exception handler (Spring's @ControllerAdvice / @ExceptionHandler or a Vert.x failure handler) — a single place to catch unhandled errors in the render path and return a safe fallback. The status-aware safeApiCall is the client-side mirror of mapping exceptions to HTTP responses: you branch on the status code to produce the right user-facing outcome.",
    keyInsights: [
      "Error boundaries (class components only) catch rendering errors via getDerivedStateFromError + componentDidCatch — they do NOT catch event-handler, async, or data-fetching errors.",
      "Use try/catch (or .catch) for async/network errors; boundaries are for the render path only.",
      "Branch on the status code (axios.isAxiosError → error.response?.status) to show specific messages: 404 not found, 422 validation, else generic.",
      "Log caught errors to a monitoring service (e.g. Sentry) from componentDidCatch so production crashes surface.",
    ],
    codeSamples: [
      {
        label: "Error boundary and API error pattern",
        language: "tsx",
        code: `// Error Boundary — catches rendering errors (class component required)
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
    // Send to Sentry: Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <p>Something went wrong.</p>;
    }
    return this.props.children;
  }
}

// Usage — wrap sections of your app
<ErrorBoundary fallback={<ErrorPage />}>
  <ExpenseDashboard />
</ErrorBoundary>

// API error handling pattern
async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) toast.error('Resource not found');
      else if (status === 422) toast.error('Validation failed');
      else toast.error('Something went wrong');
    }
    return null;
  }
}`,
      },
    ],
    interviewQA: [
      {
        question: "What does an Error Boundary catch, and what does it NOT catch?",
        answer:
          "It catches errors thrown during rendering, in lifecycle methods, and in constructors of the components below it, rendering a fallback UI instead of a blank screen. It does NOT catch errors in event handlers, asynchronous code (setTimeout, promises), server-side rendering, or errors thrown in the boundary itself — those need try/catch.",
      },
      {
        question: "Why must Error Boundaries be class components?",
        answer:
          "The error-boundary lifecycle methods — static getDerivedStateFromError (to render a fallback) and componentDidCatch (to log) — only exist on class components. There is no hook equivalent yet, so even in a hooks codebase the boundary itself is a class (often a single reusable one wrapping the app).",
      },
      {
        question: "When do you use an Error Boundary versus try/catch?",
        answer:
          "Use an Error Boundary for synchronous rendering errors in the component tree, so a crash degrades to a fallback rather than unmounting everything. Use try/catch (or promise .catch) for async and network errors — like API calls — because those don't occur during rendering and boundaries won't catch them.",
      },
      {
        question: "How would you implement retry with backoff for transient API failures?",
        answer:
          "Wrap the call in a loop that retries on transient statuses (5xx, 429, network errors) up to a max attempt count, waiting an exponentially increasing delay between tries — e.g. base * 2^attempt — ideally with jitter to avoid thundering herds, and honoring a Retry-After header on 429. Don't retry on 4xx like 400/422, which won't succeed on repeat.",
      },
    ],
    thingsToRemember: [
      "Error boundaries = class components, catch render-path errors only (getDerivedStateFromError + componentDidCatch).",
      "try/catch handles async/network errors; branch on axios.isAxiosError + status for specific messages.",
      "Always log caught errors to a monitoring service from the boundary.",
    ],
    references: [
      { label: "React — Error boundaries", url: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary" },
      { label: "Axios — Handling errors", url: "https://axios-http.com/docs/handling_errors" },
      { label: "MDN — try...catch", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch" },
    ],
    tags: ["error-handling", "error-boundary", "axios", "react", "resilience"],
  },
];
