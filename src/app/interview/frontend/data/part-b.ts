import type { FrontendTopic } from "../types";

export const partB: FrontendTopic[] = [
  {
    id: "styling-concepts-and-approaches",
    num: 6,
    title: "Styling Concepts & Approaches",
    part: "Styling",
    partId: "b",
    difficulty: "Foundational",
    summary: "The styling landscape: plain CSS/Modules, utility-first, CSS-in-JS, and component libraries — with their trade-offs.",
    readingTime: 5,
    explanation: [
      "Modern frontend offers several styling strategies, each with trade-offs. Understanding the landscape helps you pick the right tool for each project — and large codebases often use multiple approaches side by side. The four mainstream families are **plain CSS / CSS Modules**, **utility-first** (Tailwind), **CSS-in-JS** (Emotion/Styled Components), and **component libraries** (MUI).",
      "The comparison below summarizes how each works and where it shines:\n\n| Approach | How It Works | Pros | Cons |\n| --- | --- | --- | --- |\n| Plain CSS / CSS Modules | Write `.css` files; Modules scope class names per component | Standards-based; great IDE support; zero runtime cost | Manual naming; no dynamic styles based on props |\n| Utility-first (Tailwind) | Apply pre-defined classes in markup: `px-4 py-2 bg-blue-700` | Rapid prototyping; consistent design tokens; small bundles | HTML can get verbose; learning curve for class names |\n| CSS-in-JS (Emotion/Styled) | Write CSS in JavaScript; styles scoped to component | Dynamic styles from props; co-located with component logic | Runtime overhead; bundle size; SSR complexity |\n| Component libraries (MUI) | Pre-built styled components with theming | Fast development; accessible; consistent design system | Customization overhead; larger bundle; opinionated API |",
      "There is no single 'best' approach — the choice depends on team size, design-system needs, performance budget, and whether styles must react to runtime props. Standards-based CSS Modules have zero runtime cost; CSS-in-JS trades runtime overhead for dynamic, co-located styling.",
    ],
    keyInsights: [
      "Plain CSS / CSS Modules are standards-based with zero runtime cost, but can't express styles that depend on props dynamically.",
      "Utility-first (Tailwind) enforces consistent design tokens and ships small bundles, at the cost of verbose markup.",
      "CSS-in-JS co-locates styles with component logic and supports prop-driven styling, but adds runtime overhead and SSR complexity.",
      "Component libraries (MUI) accelerate development and bake in accessibility, but are opinionated and increase bundle size.",
    ],
    codeSamples: [],
    interviewQA: [
      {
        question: "What are the main CSS-in-JS trade-offs versus utility-first CSS?",
        answer:
          "CSS-in-JS lets you compute styles from runtime props and co-locate them with component logic, but it adds runtime overhead, increases bundle size, and complicates server-side rendering. Utility-first frameworks like Tailwind enforce consistent design tokens and produce tiny bundles, but make markup verbose and have a class-name learning curve.",
      },
      {
        question: "When would you reach for a component library like MUI instead of writing your own styles?",
        answer:
          "Choose a component library when you need to move fast with a consistent, accessible design system out of the box and don't want to reinvent common components. The downsides are an opinionated API, customization overhead, and a larger bundle, so it fits product teams more than highly bespoke, performance-critical UIs.",
      },
      {
        question: "Why might a single project use multiple styling approaches?",
        answer:
          "Different parts of an app have different needs: a marketing page may use utility classes for speed, a complex stateful widget may use CSS-in-JS for prop-driven styling, and legacy modules may already rely on CSS Modules. Each approach has distinct trade-offs, so mixing them pragmatically is common.",
      },
    ],
    thingsToRemember: [
      "Four families: plain CSS/Modules, utility-first (Tailwind), CSS-in-JS (Emotion/Styled), component libraries (MUI).",
      "CSS Modules = zero runtime cost; CSS-in-JS = runtime cost but dynamic, prop-driven styles.",
      "Pick per use case — there is no universally 'best' styling approach.",
    ],
    references: [
      { label: "MDN — CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { label: "Tailwind CSS — Official docs", url: "https://tailwindcss.com/docs" },
    ],
    tags: ["css", "styling", "tailwind", "css-in-js"],
  },
  {
    id: "tailwind-css",
    num: 7,
    title: "Tailwind CSS",
    part: "Styling",
    partId: "b",
    difficulty: "Core",
    summary: "Utility-first styling via pre-defined classes in markup, with a JIT compiler and config-driven design tokens.",
    readingTime: 5,
    explanation: [
      "Tailwind applies styling via **utility classes** directly in markup. Instead of writing custom CSS, you compose pre-defined classes like `px-4 py-2 bg-blue-700`. This keeps styling next to the element it affects and removes the naming burden of bespoke CSS classes.",
      "Tailwind's **JIT compiler** purges unused classes, resulting in tiny production bundles. Combined with a **config file**, it enforces consistent design tokens (colors, spacing, fonts) across the team, so the whole product stays visually coherent.",
      "Responsive modifiers (`md:`, `lg:`) and state modifiers (`hover:`, `focus:`) let you express breakpoints and interactions inline. You can extend the default theme in `tailwind.config.js` to add brand colors and other custom tokens.",
    ],
    keyInsights: [
      "Utility-first means composing pre-defined classes in markup rather than authoring custom CSS.",
      "The JIT compiler purges unused classes, so production bundles stay tiny regardless of how many utilities exist.",
      "A central config file enforces consistent design tokens (colors, spacing, fonts) across the whole team.",
      "Responsive (`md:`, `lg:`) and state (`hover:`, `focus:`) modifiers express breakpoints and interactions inline.",
    ],
    codeSamples: [
      {
        label: "Tailwind utilities, responsive modifiers, and config",
        language: "html",
        code: `<!-- A styled button -->
<button class="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 transition duration-150">
  Submit Expense
</button>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-white rounded-lg shadow p-4">Card 1</div>
  <div class="bg-white rounded-lg shadow p-4">Card 2</div>
  <div class="bg-white rounded-lg shadow p-4">Card 3</div>
</div>`,
      },
      {
        label: "tailwind.config.js — extend the default theme",
        language: "js",
        code: `// tailwind.config.js — extend default theme
module.exports = {
  theme: {
    extend: {
      colors: {
        dice: { 500: '#1B4F72', 600: '#154360' }
      }
    }
  }
}`,
      },
    ],
    interviewQA: [
      {
        question: "How does Tailwind keep production bundles small despite thousands of utilities?",
        answer:
          "Tailwind's JIT compiler scans your markup and generates only the utility classes you actually use, purging everything else. So the shipped CSS is proportional to the utilities present in your templates, not to the full set Tailwind could produce.",
      },
      {
        question: "What role does tailwind.config.js play?",
        answer:
          "It defines and extends the design tokens — colors, spacing, fonts, breakpoints — that every utility class draws from. By centralizing tokens, it enforces visual consistency across the team and lets you add brand-specific values via theme.extend without overriding Tailwind's defaults.",
      },
      {
        question: "How do you express responsive and interactive styles in Tailwind?",
        answer:
          "You prefix utilities with modifiers: responsive prefixes like md: and lg: apply at breakpoints, and state prefixes like hover: and focus: apply on interaction. For example, grid-cols-1 md:grid-cols-2 lg:grid-cols-3 builds a responsive grid entirely in markup.",
      },
    ],
    thingsToRemember: [
      "Utility-first: compose classes in markup instead of writing custom CSS.",
      "JIT compiler purges unused classes → tiny production bundles.",
      "Config file centralizes design tokens; use modifiers (md:, hover:, focus:) for responsive/state styling.",
    ],
    references: [
      { label: "Tailwind CSS — Official docs", url: "https://tailwindcss.com/docs" },
      { label: "Tailwind Play — Online playground", url: "https://play.tailwindcss.com" },
    ],
    tags: ["tailwind", "css", "utility-first", "design-tokens"],
  },
  {
    id: "css-in-js-css-modules-emotion",
    num: 8,
    title: "CSS-in-JS / CSS Modules (Emotion)",
    part: "Styling",
    partId: "b",
    difficulty: "Core",
    summary: "CSS Modules scope class names at build time (no runtime cost); Emotion generates scoped, prop-driven styles at runtime.",
    readingTime: 6,
    explanation: [
      "Many existing projects use **CSS Modules + Emotion** together. **CSS Modules** scope class names per component at build time, so there is no runtime cost. Importing a `.module.css` file gives you an object whose keys map to uniquely-mangled class names (e.g. `ExpenseCard_card_a1b2c`), preventing collisions across components.",
      "**Emotion** lets you write dynamic CSS in JavaScript, generating scoped class names at runtime. With the `styled` API you create components whose styles read from `props`, so the same component can render differently based on state. With the `css` prop API you attach a computed style object directly to an element.",
      "The practical division: CSS Modules for static, build-time-scoped styles with zero runtime overhead; Emotion when styles must change dynamically based on props or other runtime values, at the cost of some runtime work.",
    ],
    backendAnalogy:
      "CSS Modules are like Java packages — they prevent naming collisions by scoping. Emotion is like inline configuration that's computed at runtime based on input parameters.",
    keyInsights: [
      "CSS Modules scope class names per component at build time — no runtime cost.",
      "Emotion generates scoped class names at runtime and supports dynamic, prop-driven styles.",
      "A CSS Module import yields an object of mangled, collision-proof class names (e.g. `ExpenseCard_card_a1b2c`).",
      "Use CSS Modules for static styles; reach for Emotion when styling must react to props or runtime state.",
    ],
    codeSamples: [
      {
        label: "CSS Modules: scoped class names",
        language: "jsx",
        code: `/* CSS Modules: ExpenseCard.module.css */
.card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

// Import in component
import styles from './ExpenseCard.module.css';

function ExpenseCard({ title }) {
  return <div className={styles.card}>{title}</div>;
  // Rendered class: "ExpenseCard_card_a1b2c" (scoped!)
}`,
      },
      {
        label: "Emotion: dynamic CSS-in-JS with props (styled API)",
        language: "jsx",
        code: `// Emotion: styled components approach
import styled from '@emotion/styled';

const Card = styled.div\`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid \${props => props.active ? '#1B4F72' : '#ddd'};
  background: \${props => props.active ? '#EBF5FB' : 'white'};
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
\`;

// Usage — styles change based on props
<Card active={isSelected}>Lunch — ₹120</Card>`,
      },
      {
        label: "Emotion: css prop approach",
        language: "jsx",
        code: `// Emotion: css prop approach
import { css } from '@emotion/react';

const dynamicStyle = (isError) => css\`
  color: \${isError ? 'red' : 'green'};
  font-weight: bold;
\`;

<p css={dynamicStyle(hasError)}>Status message</p>`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between CSS Modules and Emotion?",
        answer:
          "CSS Modules scope class names at build time and have zero runtime cost — you author plain CSS and import a map of mangled class names. Emotion writes CSS in JavaScript and generates scoped class names at runtime, which enables prop-driven dynamic styles at the cost of runtime overhead and SSR complexity.",
      },
      {
        question: "How do CSS Modules prevent class-name collisions?",
        answer:
          "At build time the bundler rewrites each local class name to a unique mangled name (for example .card becomes ExpenseCard_card_a1b2c) and exposes a JS object mapping the original name to the mangled one. Because every component gets its own scoped names, two components can both define .card with no conflict.",
      },
      {
        question: "When would you choose Emotion over CSS Modules?",
        answer:
          "Choose Emotion when styles depend on runtime values — for example a card whose border and background change based on an active prop. Its styled and css APIs let you compute styles from props and co-locate them with component logic; CSS Modules can't express that without conditional class toggling.",
      },
    ],
    thingsToRemember: [
      "CSS Modules: build-time scoping, zero runtime cost, mangled class names.",
      "Emotion: runtime-generated scoped styles, prop-driven and dynamic.",
      "Pick CSS Modules for static styles, Emotion when styling must react to props.",
    ],
    references: [
      { label: "Emotion — Official docs", url: "https://emotion.sh/docs/introduction" },
      { label: "CSS Modules — GitHub", url: "https://github.com/css-modules/css-modules" },
    ],
    tags: ["css-modules", "emotion", "css-in-js", "scoping", "react"],
  },
];
