import type { FrontendTopic } from "../types";

export const partO: FrontendTopic[] = [
  {
    id: "third-party-integrations-sentry-mixpanel-firebase",
    num: 54,
    title: "Third-party Integrations (Sentry, Mixpanel, Firebase)",
    part: "Integrations & AI",
    partId: "o",
    difficulty: "Core",
    summary:
      "Wire in error monitoring (Sentry) and product analytics (Mixpanel) so you can see crashes and user behaviour in production.",
    readingTime: 5,
    explanation: [
      "Production apps are blind without observability tooling. **Sentry** captures uncaught exceptions, unhandled promise rejections, and performance traces, then groups them into actionable issues with stack traces and source maps. You initialize it once at the app entry point, wrap your tree in a `Sentry.ErrorBoundary` to catch render-time crashes, and call `Sentry.captureException(error)` to manually report errors you catch yourself.",
      "**Mixpanel** answers a different question: not 'what broke?' but 'what are users doing?'. You `track` named events with properties (the amount and category of an expense, the source), `identify` the logged-in user so events tie to a person, and set people properties (name, plan) for segmentation. Together, Sentry tells you about failures and Mixpanel tells you about behaviour.",
      "A few operational notes apply to both SDKs. Configuration like the Sentry DSN and Mixpanel token comes from environment variables (`import.meta.env.VITE_*` in a Vite app) so each environment points at the right project. Sentry's `tracesSampleRate` controls how many transactions are recorded for performance monitoring — 0.1 means 10%, which keeps cost and volume in check. Upload source maps at build time so the minified stack traces Sentry receives map back to your original code.",
      "| Tool | What it answers | Core API |\n| --- | --- | --- |\n| Sentry | What broke, and where in the code | `init`, `ErrorBoundary`, `captureException` |\n| Mixpanel | What users did, and who they are | `init`, `track`, `identify`, `people.set` |",
    ],
    backendAnalogy:
      "Sentry is the frontend equivalent of a server-side error aggregator like a logging/APM stack (think Sentry or an ELK pipeline you already pipe Java stack traces into) — it groups exceptions and gives you stack traces. Mixpanel is closer to product/event telemetry: structured business events you emit deliberately, like publishing domain events to a message bus for downstream analytics rather than raw application logs.",
    keyInsights: [
      "Sentry catches and groups errors with stack traces; Mixpanel records named product events with properties — they are complementary, not interchangeable.",
      "Use `tracesSampleRate` to sample performance transactions (e.g. 0.1 = 10%) so you control data volume and cost.",
      "Upload source maps at build time so minified production stack traces resolve back to readable source.",
      "Store the Sentry DSN and Mixpanel token in environment variables, scoped per environment, never hardcoded.",
    ],
    codeSamples: [
      {
        label: "Sentry — error monitoring",
        language: "tsx",
        code: `// Sentry — error monitoring
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1, // 10% of transactions
});

// Wrap your app
<Sentry.ErrorBoundary fallback={<ErrorPage />}>
  <App />
</Sentry.ErrorBoundary>

// Manual error reporting
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}`,
      },
      {
        label: "Mixpanel — product analytics",
        language: "ts",
        code: `// Mixpanel — product analytics
import mixpanel from 'mixpanel-browser';

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN);

// Track events
mixpanel.track('Expense Submitted', {
  amount: 250,
  category: 'travel',
  source: 'mobile',
});

mixpanel.identify(user.id);
mixpanel.people.set({ name: user.name, plan: 'enterprise' });`,
      },
    ],
    interviewQA: [
      {
        question:
          "How does Sentry give you readable stack traces from minified production code?",
        answer:
          "By uploading source maps generated at build time. The browser only ships minified, bundled JavaScript, so a raw production stack trace points at meaningless line/column numbers. Sentry stores the source maps for each release and uses them to translate the minified frames back to your original files and line numbers. The key is associating the maps with the correct release so the symbolication matches the deployed bundle; you typically keep source maps private (uploaded to Sentry) rather than serving them publicly.",
      },
      {
        question:
          "How do you structure analytics event tracking so the data stays useful?",
        answer:
          "Define a small, named set of events that describe user intent ('Expense Submitted') rather than firing on every click, and attach a consistent set of typed properties (amount, category, source). Call `identify` once a user logs in so events attribute to a person, and use `people.set` for stable traits like plan or name for segmentation. Centralize tracking behind a thin wrapper so event names and property shapes are defined in one place — that prevents typo'd event names and makes it easy to add consent gating or strip PII before sending.",
      },
      {
        question:
          "Why wrap the app in Sentry.ErrorBoundary in addition to calling captureException?",
        answer:
          "They cover different failure modes. `captureException` is for errors you catch yourself in try/catch or promise handlers. `Sentry.ErrorBoundary` catches errors thrown during React rendering — which would otherwise unmount the whole tree and show a blank screen — letting you both report the error and render a fallback UI. You want both: the boundary for render-time crashes and manual capture for handled async/business errors.",
      },
    ],
    thingsToRemember: [
      "Sentry = errors/crashes with stack traces; Mixpanel = product behaviour events. Use both.",
      "Upload source maps per release so minified production traces become readable.",
      "Sample performance traces (tracesSampleRate) and keep DSN/token in env vars per environment.",
    ],
    references: [
      {
        label: "Sentry — React SDK",
        url: "https://docs.sentry.io/platforms/javascript/guides/react/",
      },
      {
        label: "Mixpanel — JavaScript SDK",
        url: "https://developer.mixpanel.com/docs/javascript",
      },
    ],
    tags: ["sentry", "mixpanel", "monitoring", "analytics", "integrations"],
  },
  {
    id: "ai-assisted-development",
    num: 55,
    title: "AI-Assisted Development",
    part: "Integrations & AI",
    partId: "o",
    difficulty: "Core",
    summary:
      "Use AI coding tools (Cursor, Claude Code, Copilot) to accelerate how you build — with clear prompts and disciplined review.",
    readingTime: 4,
    explanation: [
      "AI touches your work in two distinct ways. The first is **how you build**: tools like Cursor, Claude Code, and Copilot that generate, refactor, and explain code as you work. (The second — features you build into the app — is a separate topic.) These assistants are most effective when you treat them as a fast, tireless pair programmer that still needs precise direction and careful review.",
      "The quality of the output is bounded by the quality of the prompt and the surrounding context. Good prompts are specific and scoped: 'Write RTL tests for this ExpenseForm component', 'Convert this JS file to TypeScript with proper interfaces', 'Extract this repeated JSX into a reusable component', 'Explain what this useEffect does and identify any bugs'. Each gives the model a concrete, verifiable task tied to code it can see.",
      "The non-negotiable discipline is review. AI-generated code can be subtly wrong — plausible APIs that don't exist, missing edge cases, or security issues — so you own every line you commit. Read it as if a junior engineer wrote it: run the tests, check the types, and verify behaviour before merging. The productivity win comes from the model doing the typing and boilerplate, not from skipping engineering judgement.",
    ],
    backendAnalogy:
      "Treat an AI coding assistant like a very fast junior engineer on the team: it can scaffold a service, write boilerplate DTOs, or draft tests quickly, but you still code-review the PR, run the build, and own correctness. You wouldn't merge a junior's Spring controller without reading it — same rule applies to generated code.",
    keyInsights: [
      "Specific, scoped prompts that reference visible code ('write RTL tests for this component') outperform vague ones.",
      "You own every committed line: review AI output for hallucinated APIs, missing edge cases, and security issues.",
      "The win is offloading typing and boilerplate, not offloading engineering judgement — tests and types still gate merges.",
      "Distinguish AI that accelerates how you build from AI features you ship to users; this topic is the former.",
    ],
    codeSamples: [
      {
        label: "Good prompts for AI coding assistants",
        language: "tsx",
        code: `// Good prompts for AI coding assistants:
// "Write RTL tests for this ExpenseForm component"
// "Convert this JS file to TypeScript with proper interfaces"
// "Extract this repeated JSX into a reusable component"
// "Explain what this useEffect does and identify any bugs"`,
      },
    ],
    interviewQA: [
      {
        question:
          "What are the trade-offs of using AI coding assistants, and how do you mitigate the downsides?",
        answer:
          "The upside is speed: assistants like Claude Code, Cursor, or Copilot draft boilerplate, tests, and refactors far faster than typing by hand, and they can explain unfamiliar code. The risks are hallucinated APIs, plausible-but-wrong logic, missing edge cases, and accidentally introducing security issues or copied licensed code. I mitigate this by giving specific, scoped prompts; keeping changes small and reviewable; running the type checker and tests on the output; and reading every generated line as carefully as a teammate's PR. The model does the typing — I keep the judgement.",
      },
      {
        question:
          "What makes a good prompt to an AI coding assistant versus a poor one?",
        answer:
          "A good prompt is specific, scoped to code the tool can see, and has a verifiable outcome — for example 'Write React Testing Library tests for this ExpenseForm covering the validation cases' or 'Convert this file to TypeScript with proper interfaces'. A poor prompt is vague ('make this better') or so broad the model has to guess at intent. Anchoring the request to a concrete artifact and a clear success criterion lets you immediately check whether the output is correct.",
      },
    ],
    thingsToRemember: [
      "Specific, scoped prompts beat vague ones — reference the actual code and a verifiable outcome.",
      "Always review generated code: run tests, check types, watch for hallucinated APIs and security bugs.",
      "AI accelerates building; it does not remove your ownership of correctness.",
    ],
    references: [
      {
        label: "Anthropic — API & prompting docs",
        url: "https://docs.anthropic.com",
      },
    ],
    tags: ["ai", "tooling", "productivity", "code-review", "developer-experience"],
  },
  {
    id: "ai-feature-integration",
    num: 56,
    title: "AI Feature Integration",
    part: "Integrations & AI",
    partId: "o",
    difficulty: "Advanced",
    summary:
      "Build AI features into the app — categorizers, chatbots, summarizers — always routing LLM calls through your backend.",
    readingTime: 6,
    explanation: [
      "The second way AI touches your work is the **features you build into the app**: chatbots, summarizers, smart categorization. From the frontend's perspective these are normal data interactions — you send some text to an endpoint and render the result — but with two twists: the call must never expose a provider key, and responses are often best streamed token by token.",
      "A simple feature like an expense categorizer is just a POST to your own backend with the text to classify; the backend calls the LLM and returns a category. The frontend never touches the model or its key directly. This keeps the secret server-side and lets the backend apply guardrails (rate limits, prompt construction, input validation, content filtering) in one trusted place.",
      "Chatbot-style features feel much faster when you **stream** the response instead of waiting for the full answer. The frontend reads the response body as a stream via the Streams API: get a reader from `response.body`, decode each chunk with a `TextDecoder`, and append it to state as tokens arrive. The UI updates incrementally — `setResponse(prev => prev + chunk)` — so the user sees text appear progressively, the same experience as a typing assistant.",
      "The security pattern is the headline rule: **never call an LLM provider directly from the browser with a secret key**, because anything in the bundle is public. Route every AI call through your backend, which holds the key and enforces guardrails. This is true whichever provider you use — for example, calling Anthropic's Claude (such as `claude-opus-4-8`) belongs on the server, with the frontend talking only to your own `/api/ai/*` endpoints.",
    ],
    backendAnalogy:
      "This is the classic backend-for-frontend / API gateway pattern. Just as you'd never let a browser hit your payment provider with the secret API key directly — you proxy through a server that holds the credential and validates the request — LLM calls go through your backend. The streaming response maps to server-sent events or a chunked HTTP response your Java/Vert.x layer would forward from the model.",
    keyInsights: [
      "Never expose an LLM provider key in the browser — proxy all AI calls through your backend, which holds the key and applies guardrails.",
      "For an AI feature, the frontend just POSTs text to your own endpoint and renders the result; the model lives behind the backend.",
      "Stream chatbot-style responses with the Streams API (reader + TextDecoder) and append chunks to state so text appears progressively.",
      "Backend ownership of the call enables rate limiting, input validation, prompt construction, and content filtering in one trusted place.",
    ],
    codeSamples: [
      {
        label: "Building an AI feature: expense categorizer",
        language: "ts",
        code: `// Building an AI feature: expense categorizer
async function categorizeExpense(description: string): Promise<string> {
  // ALWAYS proxy through your backend — never expose API keys
  const response = await api.post('/api/ai/categorize', {
    description,
  });
  return response.data.category; // 'meals' | 'travel' | 'other'
}`,
      },
      {
        label: "Streaming AI responses (for chatbot-like features)",
        language: "ts",
        code: `// Streaming AI responses (for chatbot-like features)
async function streamAIResponse(
  question: string,
  onChunk: (text: string) => void
) {
  const response = await fetch('/api/ai/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}`,
      },
      {
        label: "Usage in component (append tokens as they arrive)",
        language: "tsx",
        code: `// Usage in component
function AIChatPanel() {
  const [response, setResponse] = useState('');

  const ask = async (question: string) => {
    setResponse('');
    await streamAIResponse(question, (chunk) => {
      setResponse(prev => prev + chunk); // append as tokens arrive
    });
  };

  return <div className="whitespace-pre-wrap">{response}</div>;
}`,
      },
    ],
    interviewQA: [
      {
        question:
          "How do you integrate an LLM API into a frontend feature like a categorizer or chatbot?",
        answer:
          "From the frontend, you treat it as a normal request to your own backend: POST the input text to an endpoint like /api/ai/categorize and render the returned result. The backend is what actually calls the model (for example Anthropic's Claude, claude-opus-4-8) using the secret key it holds. This keeps the key off the client, and it lets the backend build the prompt, validate input, rate-limit, and filter output. The frontend stays thin — it never imports a provider SDK or knows the model name.",
      },
      {
        question:
          "Why must API keys for an LLM provider stay server-side, and what's the risk of calling the provider from the browser?",
        answer:
          "Anything shipped to the browser is public — the JS bundle, including any embedded key, can be read by anyone via devtools or the network tab. A leaked LLM key lets attackers run up your bill and bypass your guardrails. So you never put the secret in client code or call the provider directly from the browser. Instead the browser calls your own backend, which holds the key in a server-side environment variable and enforces auth, rate limits, and validation before forwarding to the model.",
      },
      {
        question:
          "How do you stream an AI response to the UI so text appears progressively?",
        answer:
          "Use the Streams API on the fetch response. Instead of awaiting response.json(), you get a reader from response.body, then loop calling reader.read(); each chunk is decoded with a TextDecoder and appended to state with setResponse(prev => prev + chunk). Because React re-renders on each append, the user sees tokens arrive incrementally, just like a typing assistant — far better perceived latency than waiting for the full answer. The backend forwards the model's streamed output (e.g. server-sent events or chunked transfer) to keep the key server-side.",
      },
      {
        question:
          "What guardrails should live in the backend AI proxy rather than the frontend?",
        answer:
          "Everything security- and cost-sensitive: holding the secret key, authenticating the user, rate limiting and quota enforcement, constructing and constraining the prompt, validating and sanitizing input, and filtering or moderating output. The frontend can do lightweight UX validation, but it can't be trusted as a security boundary because users control it. Centralizing guardrails in the proxy means one trusted place enforces them regardless of which client calls in.",
      },
    ],
    thingsToRemember: [
      "Golden rule: never call an LLM provider from the browser with a secret key — proxy through your backend.",
      "An AI feature on the frontend is just a POST to your own /api/ai/* endpoint that returns the result.",
      "Stream responses with response.body.getReader() + TextDecoder, appending chunks to state for progressive output.",
    ],
    references: [
      {
        label: "Anthropic — API & prompting docs",
        url: "https://docs.anthropic.com",
      },
      {
        label: "MDN — Streams API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Streams_API",
      },
    ],
    tags: ["ai", "llm", "streaming", "security", "backend-for-frontend"],
  },
];
