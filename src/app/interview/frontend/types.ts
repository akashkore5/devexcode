// Shared types for the Frontend Engineering Handbook & Interview Prep.
// Derived from the BE-Team Frontend Engineering Handbook (59 topics).

export type CodeLang =
  | "html"
  | "css"
  | "js"
  | "jsx"
  | "tsx"
  | "ts"
  | "bash"
  | "json"
  | "yaml";

export interface CodeSample {
  /** Short label shown above the code block, e.g. "Semantic skeleton with an accessible form". */
  label: string;
  language: CodeLang;
  code: string;
}

/** An optional live, runnable demo rendered inside the in-browser sandbox runner. */
export interface RunnableDemo {
  title: string;
  /** Body markup (no <html>/<body> wrapper needed). */
  html?: string;
  css?: string;
  /** Plain JS executed inside the sandbox; use console.log to print to the output console. */
  js?: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface Reference {
  label: string;
  url: string;
}

export type Difficulty = "Foundational" | "Core" | "Advanced";

export interface FrontendTopic {
  /** kebab-case slug, unique across all topics. Used in the URL. */
  id: string;
  /** Original handbook topic number (1-59). */
  num: number;
  title: string;
  /** Human-readable part name, e.g. "Web Foundations". */
  part: string;
  /** Single lowercase letter part id: "a".."p". */
  partId: string;
  difficulty: Difficulty;
  /** One-line summary shown on cards and at the top of the detail page. */
  summary: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
  /** Explanation paragraphs. Inline markdown (`code`, **bold**) is allowed. */
  explanation: string[];
  /** "Backend Analogy" box content (connects to Java/Vert.x/Spring). */
  backendAnalogy?: string;
  /** "Key Insight" bullet points. */
  keyInsights: string[];
  codeSamples: CodeSample[];
  /** Optional interactive demo for the in-built runner. */
  runnable?: RunnableDemo;
  /** Interview-ready question/answer pairs. */
  interviewQA: QA[];
  /** Crisp "things to remember" bullets for last-minute revision. */
  thingsToRemember: string[];
  references: Reference[];
  tags: string[];
}

export interface Part {
  /** "a".."p" */
  id: string;
  /** Display name, e.g. "Web Foundations". */
  name: string;
  /** Short tagline for the part. */
  tagline: string;
}

export const PARTS: Part[] = [
  { id: "a", name: "Web Foundations", tagline: "How the browser turns code into pixels" },
  { id: "b", name: "Styling", tagline: "CSS strategies from utility-first to CSS-in-JS" },
  { id: "c", name: "Language", tagline: "Modern JavaScript and TypeScript" },
  { id: "d", name: "React Core", tagline: "Components, props, state, and rendering" },
  { id: "e", name: "Hooks", tagline: "State and lifecycle in function components" },
  { id: "f", name: "State & Patterns", tagline: "Context, Redux, and composition patterns" },
  { id: "g", name: "Routing & Forms", tagline: "Client-side navigation and form handling" },
  { id: "h", name: "Data Layer & Networking", tagline: "HTTP, Axios, auth, and error handling" },
  { id: "i", name: "Real-Time Communication", tagline: "WebSockets, SSE, and push" },
  { id: "j", name: "Client-Side Storage", tagline: "Web Storage, IndexedDB, and security" },
  { id: "k", name: "UI & Visualization", tagline: "Design systems, charts, and animation" },
  { id: "l", name: "Optimization & DevTools", tagline: "Performance, Web Vitals, and tooling" },
  { id: "m", name: "Quality & Testing", tagline: "Linting, testing, and i18n" },
  { id: "n", name: "Project & Delivery", tagline: "Structure, config, builds, and CI/CD" },
  { id: "o", name: "Integrations & AI", tagline: "PWA, third-party SDKs, and AI workflows" },
  { id: "p", name: "Architecture Awareness", tagline: "Next.js/SSR, micro-frontends, React Native" },
];
