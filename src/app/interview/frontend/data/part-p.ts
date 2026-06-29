import type { FrontendTopic } from "../types";

export const partP: FrontendTopic[] = [
  {
    id: "nextjs-ssr-and-ssg",
    num: 57,
    title: "Next.js / SSR & SSG",
    part: "Architecture Awareness",
    partId: "p",
    difficulty: "Advanced",
    summary:
      "A React meta-framework adding SSR, SSG, ISR, and file-based routing to solve SEO and initial load.",
    readingTime: 6,
    explanation: [
      "Next.js is a React meta-framework that adds server-side rendering (SSR), static site generation (SSG), and file-based routing. It solves two problems SPAs struggle with: **SEO** (search engines need HTML on first load) and **initial load performance** (the server sends rendered HTML instead of an empty shell + JS bundle).",
      "The framework supports several rendering modes, each generating HTML at a different point in the lifecycle:",
      "| Rendering Mode | When HTML Is Generated | Best For |\n| --- | --- | --- |\n| CSR (Client-Side) | In the browser after JS loads | Dashboards, internal tools (your current apps) |\n| SSR (Server-Side) | On each request on the server | Dynamic content that needs SEO (e-commerce, news) |\n| SSG (Static Site Gen) | At build time | Marketing pages, docs, blogs (content rarely changes) |\n| ISR (Incremental Static) | At build time + revalidates periodically | Product pages, catalogs (semi-dynamic) |",
      "When to consider Next.js: if your app needs SEO, fast initial load for public-facing pages, or you're building a content-heavy site. For internal tools and dashboards (like Dice EMS), a Vite SPA is simpler and sufficient.",
    ],
    keyInsights: [
      "SSR and SSG both ship server-rendered HTML so crawlers and the first paint don't wait on a JS bundle; the difference is whether HTML is built per-request (SSR) or once at build time (SSG).",
      "ISR is the middle ground: static HTML served from cache, regenerated in the background on a revalidation interval so semi-dynamic content stays fresh without per-request cost.",
      "For internal dashboards a plain Vite SPA (CSR) is usually simpler and enough; reach for Next.js when SEO or public-facing first-load speed actually matters.",
    ],
    codeSamples: [],
    interviewQA: [
      {
        question: "Compare SSR, SSG, ISR, and CSR — when would you pick each?",
        answer:
          "CSR renders in the browser after the JS bundle loads — fine for authenticated dashboards and internal tools where SEO is irrelevant. SSR renders HTML on the server for every request — best for dynamic, personalized content that still needs SEO (e-commerce, news). SSG renders HTML once at build time and serves it from a CDN — ideal for content that rarely changes (marketing, docs, blogs). ISR is SSG plus background regeneration on a revalidation interval — good for semi-dynamic content like product catalogs where you want static speed but periodic freshness.",
      },
      {
        question: "What is hydration and why does it matter for SSR/SSG?",
        answer:
          "With SSR/SSG the server sends fully rendered HTML so the user sees content immediately, but that HTML is inert. Hydration is the client-side step where React attaches event handlers and reconciles its component tree with the existing markup to make it interactive. The cost is that the JS bundle still has to download and run, and a mismatch between server and client output causes hydration errors, so the HTML you see fast is not interactive until hydration completes.",
      },
      {
        question: "At a high level, what changed with the Next.js App Router and React Server Components?",
        answer:
          "The App Router introduces React Server Components, which render on the server and never ship their JS to the client, reducing bundle size and letting components fetch data directly without an API round-trip. Components are server-rendered by default; you opt into client interactivity with a 'use client' boundary. This blurs the old per-page SSR/SSG distinction — rendering and data fetching become per-component concerns rather than a single page-level mode.",
      },
      {
        question: "Why might you NOT use Next.js for an internal dashboard?",
        answer:
          "Internal tools sit behind auth, so SEO is irrelevant, and users tolerate a brief client-side load. Next.js adds a server runtime, build complexity, and rendering decisions you don't need there. A Vite SPA with client-side rendering is simpler to build, deploy, and reason about for that use case.",
      },
    ],
    thingsToRemember: [
      "CSR = browser, SSR = per request, SSG = build time, ISR = build time + periodic revalidate.",
      "Next.js earns its complexity when SEO or public first-load performance matters; otherwise a Vite SPA is simpler.",
      "Server-rendered HTML still needs hydration before it becomes interactive.",
    ],
    references: [
      { label: "Next.js — docs", url: "https://nextjs.org/docs" },
      {
        label: "BE-Team Frontend Engineering Handbook — Part P",
        url: "https://nextjs.org/docs/app/building-your-application/rendering",
      },
    ],
    tags: ["nextjs", "ssr", "ssg", "rendering", "seo"],
  },
  {
    id: "micro-frontend-architecture",
    num: 58,
    title: "Micro-Frontend Architecture",
    part: "Architecture Awareness",
    partId: "p",
    difficulty: "Advanced",
    summary:
      "The microservices pattern applied to the UI: independent teams own and deploy independent modules.",
    readingTime: 5,
    explanation: [
      "Micro-frontends apply the **microservices pattern** to the frontend: independent teams own independent UI modules that compose into one application. This is relevant for a multi-module platform (AP, CN, PO, Expense, etc.) where different teams could independently deploy their modules.",
      "Key technologies: **Webpack Module Federation** (share code between separate builds at runtime), **Single-SPA** (orchestration framework), and **Web Components** (native browser encapsulation).",
      "The trade-offs: greater team autonomy and independent deployments, but complexity in shared state, consistent UX, and routing coordination.",
    ],
    keyInsights: [
      "Module Federation lets separately built and deployed bundles import each other's code at runtime, which is what makes independent deploys possible.",
      "The win is organizational — team autonomy and independent release cadence — not technical performance.",
      "The hidden costs are shared state, consistent UX/design, dependency duplication, and routing coordination across modules.",
    ],
    codeSamples: [],
    interviewQA: [
      {
        question: "What are the main approaches to integrating micro-frontends and their tradeoffs?",
        answer:
          "Build-time integration (publishing each module as an npm package) is simplest but couples releases — you must rebuild the container to ship a change. Runtime integration via iframes gives strong isolation but poor UX and hard cross-frame communication. Runtime integration via JavaScript (Module Federation or Single-SPA) loads modules dynamically into one page, giving real independent deploys and shared runtime, at the cost of coordinating dependencies and shared state. Web Components offer native encapsulation as the integration unit. The tradeoff axis is isolation versus shared UX and deploy independence versus coupling.",
      },
      {
        question: "What problem does Webpack Module Federation solve?",
        answer:
          "It lets separately built and deployed applications expose and consume modules from each other at runtime, rather than bundling everything together at build time. A host app can load a remote's component on demand, and shared dependencies (like React) can be deduplicated so they aren't downloaded twice. This is the mechanism that enables teams to deploy their micro-frontend independently while still composing into one running app.",
      },
      {
        question: "When are micro-frontends worth the complexity, and when are they not?",
        answer:
          "They pay off when multiple teams need to own and deploy distinct parts of a large product independently, where coordinating a single monolithic frontend release becomes a bottleneck. They are usually not worth it for a small team or a single cohesive app — you take on shared-state, routing, design-consistency, and bundle-duplication complexity for autonomy you don't need. The decision is organizational scale first, technical second.",
      },
    ],
    thingsToRemember: [
      "Micro-frontends are microservices for the UI: independent teams, independent deploys, composed into one app.",
      "Module Federation = runtime code sharing; Single-SPA = orchestration; Web Components = native encapsulation.",
      "Buy autonomy and independent deploys; pay with shared-state, UX-consistency, and routing complexity.",
    ],
    references: [
      {
        label: "Module Federation — Webpack docs",
        url: "https://webpack.js.org/concepts/module-federation/",
      },
      {
        label: "BE-Team Frontend Engineering Handbook — Part P",
        url: "https://single-spa.js.org/",
      },
    ],
    tags: ["micro-frontend", "module-federation", "single-spa", "architecture"],
  },
  {
    id: "react-native-cross-platform",
    num: 59,
    title: "React Native / Cross-Platform",
    part: "Architecture Awareness",
    partId: "p",
    difficulty: "Advanced",
    summary:
      "Build iOS + Android apps with React: same patterns, native rendering targets instead of the DOM.",
    readingTime: 5,
    explanation: [
      "React Native lets you build mobile apps (iOS + Android) using React. Your React knowledge transfers: components, hooks, state, and most libraries work the same. The key difference is the **rendering target**: instead of DOM elements (`<div>`, `<p>`), you use native components (`<View>`, `<Text>`, `<ScrollView>`).",
      "**Expo** simplifies React Native development by handling native build configuration, providing pre-built APIs (camera, notifications, file system), and enabling over-the-air updates. If a team ships a mobile app, React Native + Expo is the natural path from existing React web skills.",
    ],
    keyInsights: [
      "Your React mental model transfers directly — components, hooks, state, props — only the primitives change.",
      "There is no DOM: use <View>, <Text>, <ScrollView> and StyleSheet objects instead of div/p and CSS files.",
      "Expo removes most native toolchain friction and adds device APIs plus over-the-air updates.",
    ],
    codeSamples: [
      {
        label: "React Native: same React patterns, native rendering",
        language: "tsx",
        code: `// React Native looks very similar to React
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function ExpenseCard({ title, amount }: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>₹{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 8, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' },
  amount: { fontSize: 20, color: '#1B4F72' },
});`,
      },
    ],
    interviewQA: [
      {
        question: "How much code can you actually share between a React web app and React Native?",
        answer:
          "Your logic layer shares cleanly — hooks, state management, API/data-fetching code, validation, and most pure utility libraries are platform-agnostic. What does not share is the rendering layer: web uses DOM elements and CSS, while React Native uses native primitives (View, Text, ScrollView) and StyleSheet objects. So you typically share business logic and component behavior but write platform-specific presentational components, sometimes splitting files by .native.tsx / .web.tsx extension.",
      },
      {
        question: "What is the key difference between React and React Native for a React developer?",
        answer:
          "The programming model is the same — components, props, state, hooks, and the reconciler all behave as you expect. The difference is the rendering target. Instead of emitting DOM nodes like div and p styled with CSS, React Native maps components to actual native UI widgets via View, Text, and ScrollView, styled through StyleSheet objects. There is no DOM and no CSS cascade, so layout uses a Flexbox subset and styles are plain JS objects.",
      },
      {
        question: "What does Expo add on top of React Native?",
        answer:
          "Expo handles the native build configuration so you can develop without touching Xcode or Android Studio for most cases, ships pre-built APIs for device features like camera, notifications, and file system, and enables over-the-air updates so you can push JS changes without going through the app stores. For a React web team moving to mobile it is the lowest-friction starting point.",
      },
    ],
    thingsToRemember: [
      "React Native = React patterns with native rendering; no DOM, no CSS — use View/Text and StyleSheet.",
      "Logic and hooks port across web and native; presentational components usually don't.",
      "Expo manages native config, device APIs, and over-the-air updates.",
    ],
    references: [
      { label: "React Native — docs", url: "https://reactnative.dev" },
      { label: "Expo — docs", url: "https://docs.expo.dev" },
    ],
    tags: ["react-native", "cross-platform", "mobile", "expo"],
  },
];
