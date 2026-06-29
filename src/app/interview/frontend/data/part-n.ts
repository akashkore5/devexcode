import type { FrontendTopic } from "../types";

export const partN: FrontendTopic[] = [
  {
    id: "project-structure-best-practice",
    num: 48,
    title: "Project Structure (Best Practice)",
    part: "Project & Delivery",
    partId: "n",
    difficulty: "Core",
    summary: "Feature-based organization scales better than type-based folders for non-trivial apps.",
    readingTime: 5,
    explanation: [
      "As an app grows, the default \"type-based\" structure (all components in `components/`, all hooks in `hooks/`, all slices in `store/`) becomes painful: a single feature is scattered across the whole tree, and unrelated features sit next to each other. **Feature-based organization** flips this: each feature owns a folder containing its own `components/`, `hooks/`, `api/`, `store/`, and `types/`, with an `index.ts` that defines the feature's public surface.",
      "Truly cross-cutting code lives under `shared/` (generic `Button`, `Modal`, `Spinner`, utility hooks like `useToggle`/`useDebounce`, helpers like `formatCurrency`). App-wide concerns get their own top-level folders: `config/` for env, constants and routes; `styles/` for global CSS and the Tailwind config. This keeps the boundary between \"this feature\" and \"everyone\" explicit.",
      "The big win is **colocation and encapsulation**: when you work on expenses, everything you need is in `features/expenses/`, and the `index.ts` barrel controls what the rest of the app is allowed to import. This reduces accidental coupling, makes features easy to move or delete, and keeps imports shallow and predictable.",
    ],
    backendAnalogy:
      "Feature-based folders are the frontend version of organizing a Spring service by domain package (com.dice.expense.*) rather than by layer (all controllers in one package, all repositories in another). The feature's index.ts is like a package-private boundary or a module-info — it declares the public API and hides the internals.",
    keyInsights: [
      "Feature-based structure colocates components, hooks, api, store, and types per feature — type-based scatters one feature across the whole tree.",
      "Each feature's index.ts is its public contract; importing internals directly across features is a code smell.",
      "shared/ holds only genuinely generic, reusable building blocks (Button, Modal, useDebounce); config/ holds env, constants, and routes.",
    ],
    codeSamples: [
      {
        label: "Feature-based structure (recommended for Dice-scale apps)",
        language: "bash",
        code: `// Feature-based structure (recommended for Dice-scale apps)
src/
├── features/
│   ├── expenses/
│   │   ├── components/    // ExpenseCard, ExpenseList, ExpenseForm
│   │   ├── hooks/         // useExpenses, useExpenseForm
│   │   ├── api/           // expense API calls
│   │   ├── store/         // expenseSlice (Redux)
│   │   ├── types/         // Expense interface
│   │   └── index.ts       // public exports
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── context/       // AuthContext
│   └── dashboard/
├── shared/
│   ├── components/        // Button, Modal, Spinner
│   ├── hooks/             // useToggle, useDebounce
│   ├── utils/             // formatCurrency, dateHelpers
│   └── types/             // global types
├── config/                // env, constants, routes
├── styles/                // global CSS, Tailwind config
├── App.tsx
└── main.tsx`,
      },
    ],
    interviewQA: [
      {
        question: "What's the difference between type-based and feature-based folder structure, and when do you switch?",
        answer:
          "Type-based groups files by their kind (components/, hooks/, store/) and works fine for small apps. Feature-based groups by domain (features/expenses/ owning its own components, hooks, api, store, types). You switch to feature-based once a feature spans many files and multiple types — it colocates everything for that feature, limits accidental coupling, and makes the feature easy to move or delete.",
      },
      {
        question: "What belongs in shared/ versus inside a feature folder?",
        answer:
          "shared/ holds only genuinely cross-cutting, domain-agnostic code: generic UI (Button, Modal, Spinner), utility hooks (useToggle, useDebounce), and helpers (formatCurrency). If something is specific to a domain, it lives in that feature. A good test: if deleting a feature wouldn't affect the file, it's shared; otherwise it belongs to the feature.",
      },
      {
        question: "Why expose a feature through an index.ts barrel?",
        answer:
          "The barrel defines the feature's public API. Other features import only what index.ts re-exports, so internal components and helpers stay private. This enforces an explicit boundary, prevents deep cross-feature imports that create tight coupling, and lets you refactor a feature's internals without breaking the rest of the app.",
      },
    ],
    thingsToRemember: [
      "Feature-based: each feature owns its components/hooks/api/store/types plus an index.ts public barrel.",
      "shared/ = generic reusable pieces only; config/ = env, constants, routes; styles/ = global CSS + Tailwind config.",
      "Avoid deep cross-feature imports — go through the feature's index.ts.",
    ],
    references: [
      { label: "React docs — Thinking about a project's structure", url: "https://react.dev/learn/thinking-in-react" },
      { label: "Feature-Sliced Design", url: "https://feature-sliced.design" },
    ],
    tags: ["project-structure", "architecture", "feature-based", "organization"],
  },
  {
    id: "environment-configuration",
    num: 49,
    title: "Environment Configuration",
    part: "Project & Delivery",
    partId: "n",
    difficulty: "Core",
    summary: "Vite env vars use a VITE_ prefix per environment — and never hold secrets.",
    readingTime: 4,
    explanation: [
      "Vite loads environment variables from `.env` files and exposes only those prefixed with `VITE_` to client code via `import.meta.env`. You keep a file per mode — `.env.development` and `.env.production` — so the same code points at different backends (`http://localhost:8080/api` in dev, `https://api.dice.zaggle.in/api` in prod) without conditionals.",
      "The single most important rule: **never put secrets in frontend env vars**. Anything prefixed `VITE_` is inlined into the JavaScript bundle at build time, so it ships to every visitor in plain text. A `VITE_SECRET_KEY` is readable by anyone who opens DevTools. Secrets (API keys, signing secrets) must live on the backend; the frontend only ever holds public configuration like API base URLs and project IDs.",
    ],
    backendAnalogy:
      "Vite's import.meta.env is the frontend analog of Spring's @Value / application-{profile}.properties — you swap config per environment without touching code. The crucial difference: backend config files stay on the server, but anything you expose to the frontend bundle is effectively public, like committing a property file to a public repo.",
    keyInsights: [
      "Only VITE_-prefixed variables reach the client; everything else stays build-time only.",
      "VITE_ values are inlined into the bundle at build — they are NOT runtime secrets and are visible to anyone.",
      "Keep one .env file per mode (.env.development, .env.production) so the same code targets different backends.",
    ],
    codeSamples: [
      {
        label: "Vite environment variables (.env files + access)",
        language: "bash",
        code: `// .env files (Vite uses VITE_ prefix)

// .env.development
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_PROJECT_ID=dice-dev

// .env.production
VITE_API_URL=https://api.dice.zaggle.in/api
VITE_FIREBASE_PROJECT_ID=dice-prod`,
      },
      {
        label: "Accessing env vars — and what NEVER to do",
        language: "ts",
        code: `// Access in code
const apiUrl = import.meta.env.VITE_API_URL;

// NEVER put secrets in frontend env vars — they're in the bundle!
// VITE_SECRET_KEY=abc123  <- anyone can read this`,
      },
    ],
    interviewQA: [
      {
        question: "How does Vite decide which env vars are exposed to the browser?",
        answer:
          "Only variables prefixed with VITE_ are exposed via import.meta.env; everything else is available only at build/config time and is stripped from client code. This prefix is a deliberate guardrail so you don't accidentally leak server-only variables into the bundle.",
      },
      {
        question: "Why can't you store an API secret in a frontend env var?",
        answer:
          "Frontend env vars are inlined into the static JS bundle at build time, so they ship to every user and are trivially readable in DevTools or the network tab. Secrets must stay on the backend, which proxies the privileged call. The frontend should only hold public config like API base URLs and public project IDs.",
      },
      {
        question: "How do you point the same build at different environments?",
        answer:
          "Keep one .env file per mode (.env.development, .env.production) holding the same variable names with environment-specific values, and let the build mode select the right file. The code reads import.meta.env.VITE_API_URL unchanged, so there are no environment conditionals scattered through the source.",
      },
    ],
    thingsToRemember: [
      "Only VITE_-prefixed vars reach the client; access them via import.meta.env.",
      "VITE_ vars are inlined into the bundle at build time — never store secrets there.",
      "One .env file per mode lets identical code target dev vs prod backends.",
    ],
    references: [
      { label: "Vite — Env Variables and Modes", url: "https://vitejs.dev/guide/env-and-mode" },
    ],
    tags: ["vite", "environment", "configuration", "secrets", "security"],
  },
  {
    id: "build-and-deploy",
    num: 50,
    title: "Build & Deploy",
    part: "Project & Delivery",
    partId: "n",
    difficulty: "Core",
    summary: "Vite builds static assets into /dist; preview verifies the production bundle locally.",
    readingTime: 4,
    explanation: [
      "`npm run build` runs Vite's production build: it bundles, minifies, tree-shakes, and hashes assets, emitting static files into `/dist`. Because the output is plain static HTML/CSS/JS, it can be served from any static host or CDN (S3 + CloudFront, Nginx, etc.) — there's no Node server required at runtime.",
      "`npm run preview` boots a local static server over the built `/dist` so you can sanity-check the production bundle before shipping. This catches issues that only appear in a production build — env-var differences, base-path problems, or assets that work in `dev` but break once minified and hashed — without deploying to a real environment.",
    ],
    backendAnalogy:
      "npm run build is the frontend equivalent of mvn package producing a deployable artifact (a fat JAR), and /dist is that artifact. npm run preview is like running the packaged JAR locally before pushing to staging — you're testing the artifact you'll actually deploy, not the live-reload dev server.",
    keyInsights: [
      "npm run build emits hashed, minified, tree-shaken static files into /dist — deployable to any CDN/static host.",
      "npm run preview serves the production bundle locally to catch build-only issues before deploy.",
      "The build artifact is static: no runtime Node server needed, which is what makes S3/CloudFront/Nginx hosting trivial.",
    ],
    codeSamples: [
      {
        label: "Build commands",
        language: "bash",
        code: `// Build commands
npm run build      // produces /dist with static files
npm run preview    // local preview of production build`,
      },
    ],
    interviewQA: [
      {
        question: "What does npm run build actually produce, and what optimizations does Vite apply?",
        answer:
          "It produces a /dist folder of static assets — minified, tree-shaken JS/CSS with content-hashed filenames for long-term caching, plus the HTML entry. Tree-shaking drops unused exports, code-splitting separates chunks so routes load on demand, and hashing lets the CDN cache aggressively while busting on change.",
      },
      {
        question: "Why run npm run preview instead of just relying on the dev server?",
        answer:
          "The dev server uses unbundled modules and live reload, which behaves differently from a production build. preview serves the actual minified, hashed /dist output, so it surfaces build-only problems — broken base paths, missing prod env vars, or minification bugs — before you deploy.",
      },
      {
        question: "How does a static SPA build get deployed without a server?",
        answer:
          "Because /dist is just static files, you sync it to object storage or a CDN (e.g. S3 behind CloudFront) or serve it with Nginx. No Node runtime is needed; the host just returns files. The only twist is client-side routing, which requires a fallback to index.html for deep links.",
      },
    ],
    thingsToRemember: [
      "npm run build -> /dist of static, minified, hashed, tree-shaken assets.",
      "npm run preview serves that production bundle locally before deploy.",
      "Static output means any CDN or static host can serve it — no runtime Node server.",
    ],
    references: [
      { label: "Vite — Building for Production", url: "https://vitejs.dev/guide/build" },
      { label: "Vite — Deploying a Static Site", url: "https://vitejs.dev/guide/static-deploy" },
    ],
    tags: ["vite", "build", "deploy", "static-hosting", "tree-shaking"],
  },
  {
    id: "cicd-and-containerization",
    num: 51,
    title: "CI/CD & Containerization",
    part: "Project & Delivery",
    partId: "n",
    difficulty: "Advanced",
    summary: "A GitLab pipeline builds, tests, and deploys; Docker multi-stage ships a tiny Nginx image.",
    readingTime: 7,
    explanation: [
      "A typical GitLab pipeline has three sequential **stages**: `build`, `test`, and `deploy`. The build stage runs `npm ci` and `npm run build`, saving `dist/` as an artifact passed to later stages. The test stage runs lint and unit tests. The deploy stage (gated to the `main` branch via `only: [main]`) syncs `dist/` to S3 and invalidates the CloudFront cache so users get the new assets immediately.",
      "For containerized deployment, a **multi-stage Dockerfile** keeps the final image small. The first stage uses `node:20-alpine` to install dependencies and build the app; the second stage copies only the resulting `dist/` into a lightweight `nginx:alpine` image to serve. The bulky Node toolchain and `node_modules` never reach production — the runtime image contains only static files plus Nginx.",
      "**SPA routing gotcha**: CloudFront, S3, and Nginx don't know about your client-side routes. A deep link like `/expenses/42` hits the server, which has no such file and returns 404. The fix is to route all unmatched paths back to `index.html` so the client router can take over — configure a CloudFront custom error response that serves `index.html`, or add `try_files $uri /index.html` in the Nginx config.",
    ],
    backendAnalogy:
      "The GitLab stages mirror a Maven/Jenkins pipeline: build (mvn package) -> test (mvn verify) -> deploy (push artifact). The multi-stage Docker build is the same trick you'd use for a Java service — compile in a JDK image, then copy just the JAR into a slim JRE image — so build tools don't bloat the runtime image.",
    keyInsights: [
      "Pipeline stages run in order; build's dist/ artifact is handed to test and deploy stages.",
      "Gate deploys with only: [main] so feature branches build and test but never ship.",
      "Multi-stage Docker: build in node:20-alpine, then copy only dist/ into nginx:alpine — the Node toolchain never reaches production.",
      "SPA deep links 404 on static hosts unless you fall back to index.html (CloudFront error page or Nginx try_files $uri /index.html).",
    ],
    codeSamples: [
      {
        label: ".gitlab-ci.yml — build, test, deploy pipeline",
        language: "yaml",
        code: `# .gitlab-ci.yml — build, test, deploy pipeline
stages: [build, test, deploy]

build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths: [dist/]

test:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm run lint
    - npm run test -- --run

deploy:
  stage: deploy
  image: amazon/aws-cli
  script:
    - aws s3 sync dist/ s3://$S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths '/*'
  only: [main]
  environment: production`,
      },
      {
        label: "Dockerfile (multi-stage, containerized deployment)",
        language: "bash",
        code: `# Dockerfile (for containerized deployment)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80`,
      },
    ],
    interviewQA: [
      {
        question: "Walk me through the stages of a frontend CI/CD pipeline.",
        answer:
          "Build installs deps with npm ci and runs npm run build, publishing dist/ as an artifact. Test runs lint and unit tests against the code. Deploy — gated to main — syncs dist/ to S3 with --delete to remove stale files and issues a CloudFront invalidation so the CDN serves the new assets. Stages run sequentially and a failure stops the pipeline before deploy.",
      },
      {
        question: "Why use a multi-stage Dockerfile for a frontend app?",
        answer:
          "The build stage needs Node, npm, and node_modules to compile the app, but the runtime only needs the static dist/ files and a web server. A multi-stage build compiles in node:20-alpine, then copies only dist/ into a slim nginx:alpine image. The final image excludes the entire build toolchain, so it's far smaller, faster to pull, and has a smaller attack surface.",
      },
      {
        question: "Why do SPA deep links return 404 on S3/CloudFront/Nginx, and how do you fix it?",
        answer:
          "Client-side routes like /expenses/42 exist only in the JS router, not as files on the server, so a direct request or refresh hits the host, finds no matching object, and returns 404. The fix is to serve index.html for all unmatched paths — a CloudFront custom error response mapping 404/403 to index.html, or try_files $uri /index.html in Nginx — so the client router can resolve the route.",
      },
      {
        question: "What does the CloudFront invalidation in the deploy step accomplish?",
        answer:
          "S3 sync uploads the new hashed assets, but CloudFront may still serve cached copies of the HTML or other paths. create-invalidation --paths '/*' tells CloudFront to drop its cache so the next request fetches the fresh objects. Content-hashed asset filenames make this mostly about the non-hashed entry HTML.",
      },
    ],
    thingsToRemember: [
      "Stages run in order: build -> test -> deploy; pass dist/ as an artifact and gate deploy with only: [main].",
      "Multi-stage Docker: build in node:20-alpine, copy only dist/ into nginx:alpine for a tiny runtime image.",
      "Fix SPA 404s on deep links with index.html fallback (CloudFront error page or Nginx try_files $uri /index.html).",
    ],
    references: [
      { label: "GitLab — CI/CD docs", url: "https://docs.gitlab.com/ee/ci/" },
      { label: "Docker — Multi-stage builds", url: "https://docs.docker.com/build/building/multi-stage/" },
    ],
    tags: ["ci-cd", "docker", "gitlab", "deployment", "nginx"],
  },
  {
    id: "pwa-progressive-web-app",
    num: 52,
    title: "PWA (Progressive Web App)",
    part: "Project & Delivery",
    partId: "n",
    difficulty: "Advanced",
    summary: "The Vite PWA plugin wires up a manifest, service worker, and Workbox caching strategies.",
    readingTime: 6,
    explanation: [
      "A Progressive Web App adds installability and offline behavior to a regular web app via two pieces: a **web app manifest** (name, icons, theme color — what the OS uses when the app is installed to the home screen) and a **service worker** (a background script that intercepts network requests and caches responses). The `vite-plugin-pwa` generates both from config so you don't hand-write the service worker.",
      "In `vite.config.ts`, `VitePWA({ registerType: 'autoUpdate' })` registers a service worker that updates itself when a new build is deployed. The `manifest` block declares the installable metadata — name, short_name, theme_color, and an `icons` array (at minimum 192x192 and 512x512 PNGs for home-screen and splash use).",
      "Caching is configured through Workbox's `runtimeCaching`. The example matches API requests (`/\\/api\\/.*/`) with a **NetworkFirst** strategy: try the network, and fall back to the cache if offline or the request fails. A bounded cache (`cacheName: 'api-cache'`, `maxEntries: 50`) keeps storage in check. Other common strategies are CacheFirst (for hashed static assets) and StaleWhileRevalidate (serve cache, refresh in background).",
    ],
    backendAnalogy:
      "A service worker is a programmable proxy that sits in front of your network calls — conceptually like a caching reverse proxy or a Caffeine/Redis cache layer in a Spring service, but running in the browser. NetworkFirst is the equivalent of \"hit the DB, fall back to cache on failure,\" and the manifest is like the deployment descriptor that tells the host how to present the app.",
    keyInsights: [
      "A PWA needs both a manifest (installability metadata) and a service worker (request interception/caching); vite-plugin-pwa generates both.",
      "registerType: 'autoUpdate' makes the service worker refresh itself when a new build ships.",
      "NetworkFirst = try network, fall back to cache — good for API data that should be fresh but tolerate offline.",
      "Bound runtime caches (cacheName + expiration.maxEntries) so they don't grow unbounded.",
    ],
    codeSamples: [
      {
        label: "vite.config.ts — Vite PWA plugin with caching strategy",
        language: "ts",
        code: `// Service Worker registration (via Vite PWA plugin)
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Dice Expense Manager',
        short_name: 'DiceEMS',
        theme_color: '#1B4F72',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\\/api\\/.*/,
            handler: 'NetworkFirst', // try network, fallback to cache
            options: { cacheName: 'api-cache', expiration: { maxEntries: 50 } },
          },
        ],
      },
    }),
  ],
});`,
      },
    ],
    interviewQA: [
      {
        question: "What two things make a web app a PWA, and what does each do?",
        answer:
          "A web app manifest and a service worker. The manifest is a JSON file declaring name, icons, and theme color so the OS can install the app to the home screen with a proper icon and splash. The service worker is a background script that intercepts network requests, enabling offline support, caching, and push notifications. vite-plugin-pwa generates both from config.",
      },
      {
        question: "Compare NetworkFirst, CacheFirst, and StaleWhileRevalidate.",
        answer:
          "NetworkFirst tries the network and falls back to cache — best for data that should be fresh but must work offline, like API responses. CacheFirst serves from cache and only hits the network on a miss — ideal for immutable, content-hashed static assets. StaleWhileRevalidate serves the cached copy immediately while fetching an update in the background — fast UI with eventual freshness.",
      },
      {
        question: "Why bound a runtime cache, and how does the plugin keep the service worker fresh?",
        answer:
          "Without limits a runtime cache grows unbounded and can exhaust storage, so you set expiration.maxEntries (and optionally maxAgeSeconds) to evict old entries. registerType: 'autoUpdate' makes the generated service worker automatically take over when a new build is deployed, so users aren't stuck on a stale cached shell.",
      },
    ],
    thingsToRemember: [
      "PWA = manifest (installability) + service worker (caching/offline); vite-plugin-pwa generates both.",
      "Pick the strategy per resource: NetworkFirst for API data, CacheFirst for hashed assets, StaleWhileRevalidate for fast-but-fresh.",
      "registerType: 'autoUpdate' refreshes the SW on new builds; always bound caches with maxEntries.",
    ],
    references: [
      { label: "Vite PWA plugin — docs", url: "https://vite-pwa-org.netlify.app" },
      { label: "web.dev — Progressive Web Apps", url: "https://web.dev/explore/progressive-web-apps" },
    ],
    tags: ["pwa", "service-worker", "workbox", "manifest", "offline"],
  },
  {
    id: "figma-to-code",
    num: 53,
    title: "Figma-to-Code",
    part: "Project & Delivery",
    partId: "n",
    difficulty: "Core",
    summary: "A repeatable workflow: inspect the design, extract tokens, then build components top-down.",
    readingTime: 4,
    explanation: [
      "Turning a Figma design into a faithful UI is a repeatable, four-step workflow rather than pixel-pushing by eye. **(1) Inspect** the design for spacing, colors, typography, and the component hierarchy so you understand the structure before writing markup. **(2) Extract design tokens** — the color palette, the spacing scale, and the font sizes — into your Tailwind config or theme, so values come from one source of truth instead of being hardcoded.",
      "**(3) Build top-down**: lay out the page shell first, then the major sections, then the individual components — this keeps the structure correct and avoids reworking layout after the leaves are built. **(4) Use Figma's Dev Mode** to read exact CSS values (padding, font-size, color) and to export assets (icons, images), so measurements come straight from the design rather than guesswork.",
    ],
    backendAnalogy:
      "Extracting design tokens into the Tailwind theme is like centralizing magic numbers and config into a single constants/properties file instead of scattering literals through the code — one change to a token updates the whole UI, just as one config edit propagates across a service.",
    keyInsights: [
      "Extract design tokens (colors, spacing, font sizes) into the Tailwind/theme config so the UI has one source of truth.",
      "Build top-down — layout shell, then sections, then components — to avoid reworking structure later.",
      "Figma's Dev Mode gives exact CSS values and asset exports, removing guesswork from measurements.",
    ],
    codeSamples: [],
    interviewQA: [
      {
        question: "Describe your workflow for translating a Figma design into code.",
        answer:
          "First inspect the design for spacing, colors, typography, and component hierarchy. Then extract design tokens (color palette, spacing scale, font sizes) into the Tailwind config or theme so values are centralized. Build top-down — layout shell, then sections, then individual components — to keep structure right. Finally use Figma Dev Mode for exact CSS values and asset export instead of eyeballing measurements.",
      },
      {
        question: "Why extract design tokens into the theme instead of hardcoding values per component?",
        answer:
          "Tokens give the UI a single source of truth: colors, spacing, and font sizes are defined once in the Tailwind/theme config and referenced everywhere. Changing a brand color or spacing scale becomes one edit rather than a find-and-replace across components, and it keeps the implementation consistent with the design system.",
      },
      {
        question: "Why build components top-down, and what does Dev Mode add?",
        answer:
          "Building the layout shell first, then sections, then leaf components, ensures the structural decisions (grid, spacing) are settled before you invest in details, avoiding rework when a container changes. Figma Dev Mode complements this by exposing the exact CSS (padding, font-size, colors) and letting you export assets, so the build matches the design precisely.",
      },
    ],
    thingsToRemember: [
      "Workflow: inspect -> extract tokens -> build top-down -> use Dev Mode for exact values/assets.",
      "Push design tokens into the Tailwind/theme config for a single source of truth.",
      "Layout shell first, components last — structure before detail.",
    ],
    references: [
      { label: "Figma — Dev Mode", url: "https://www.figma.com/dev-mode/" },
    ],
    tags: ["figma", "design-tokens", "tailwind", "workflow", "ui"],
  },
];
