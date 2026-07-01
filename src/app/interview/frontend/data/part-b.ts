import type { FrontendTopic } from "../types";

export const partB: FrontendTopic[] = [
  {
    id: "styling-concepts-and-approaches",
    num: 6,
    title: "Styling Concepts & Approaches",
    part: "Styling",
    partId: "b",
    difficulty: "Foundational",
    summary:
      "The full styling landscape — plain CSS, CSS Modules, utility-first (Tailwind), CSS-in-JS (Emotion/Styled), and component libraries (MUI) — with the mechanics, build-time vs runtime cost, scoping strategies, and the decision framework for choosing one (or several) per project.",
    readingTime: 16,
    explanation: [
      "**Why the choice even matters.** Every styling approach ultimately produces the same thing the browser understands: CSS rules attached to elements. What differs is *where the work happens* (build time vs runtime), *how styles are scoped* (global, per-file, per-component, or per-element), *how dynamic* the styles can be (static text vs computed from props), and *what it costs* (bundle size, runtime CPU, developer velocity). Picking a strategy is really picking a set of trade-offs along those axes — so the goal isn't to find the 'best' one, it's to match the axes to your project's constraints.",
      "**The scoping problem (the root of everything).** CSS is global by default: a `.card` rule written in one file applies to *every* `.card` on the page, and the cascade means the last-loaded rule can silently override a component you never touched. In small projects this is fine; at scale it produces collisions, specificity wars, and the dreaded `!important` escalation. Almost every 'modern' styling approach exists to solve this one problem — they just solve it differently: naming conventions (BEM), build-time renaming (CSS Modules), atomic classes (Tailwind), or runtime hashing (CSS-in-JS).",
      "**Family 1 — plain CSS and CSS Modules.** Plain CSS means authoring `.css` files with real selectors; it is standards-based, has zero runtime cost, and has the best tooling on earth, but it is globally scoped so you manage collisions by convention (methodologies like **BEM**: `.card__title--active`). **CSS Modules** fix scoping at *build time*: you import a `styles.module.css` file and get back a JS object whose keys map to uniquely-mangled class names (`.card` becomes something like `Card_card_a1b2c`), so two components can both define `.card` with no conflict. Still zero runtime cost, still real CSS — just automatically namespaced.",
      "**Family 2 — utility-first (Tailwind).** Instead of writing rules, you *compose* tiny single-purpose classes directly in markup: `class=\"px-4 py-2 rounded bg-blue-700 text-white\"`. Styling lives next to the element, there are no class names to invent, and a compiler ships only the utilities you actually use, so bundles stay small. The design system is encoded as tokens in a config file, which keeps the whole product visually consistent. The cost is verbose markup and a vocabulary to learn — but scoping is a non-issue because a utility class does exactly one thing everywhere.",
      "**Family 3 — CSS-in-JS (Emotion, Styled Components).** You write CSS *inside JavaScript*, colocated with the component, and the library generates a unique scoped class name (usually a hash) at runtime. The killer feature is that styles can be *computed from props and state* — `border-color: ${props => props.active ? 'blue' : 'grey'}` — so a component's appearance is a pure function of its inputs. The cost is a runtime library in the bundle, per-render style computation, and extra work to make server-side rendering emit critical CSS. Modern 'zero-runtime' variants (Linaria, vanilla-extract) extract this to static CSS at build time to reclaim the performance.",
      "**Family 4 — component libraries (MUI, Chakra, Ant Design).** These ship *pre-built, pre-styled, accessible* components (buttons, dialogs, data grids) plus a theming system, so you assemble UIs instead of styling primitives. They dramatically accelerate product work and bake in accessibility and design consistency for free. The trade-offs are an opinionated API, real effort when you need to customise beyond the theme, and a larger baseline bundle. They fit product teams shipping conventional UIs far better than highly bespoke, performance-critical, or brand-heavy designs.",
      "**Build time vs runtime — the axis that decides performance.** CSS, CSS Modules, Tailwind, and zero-runtime CSS-in-JS all resolve to static `.css` files during the build, so the browser does nothing extra — the styles are just there. Classic CSS-in-JS resolves styles *while the app runs*, which means shipping a styling engine and recomputing styles on renders. On performance-sensitive pages (large lists, low-end devices, tight Core Web Vitals budgets) this difference is measurable, which is why the ecosystem has trended back toward build-time extraction.",
      "**Dynamic styling — the axis where CSS-in-JS wins.** If a style must change based on a *runtime* value (a computed theme color, a percentage-based progress bar width, a chart color from data), CSS-in-JS expresses it directly. Plain CSS / Modules / Tailwind handle *discrete* states via toggling classes (`className={active ? styles.on : styles.off}`) or CSS custom properties (`style={{ '--w': pct + '%' }}`), which covers the vast majority of real cases without any runtime library. So 'I need dynamic styles' rarely *forces* CSS-in-JS — CSS variables are the underrated middle ground.",
      "**Mixing approaches is normal, not a smell.** Real codebases layer these: a component library for the app chrome, Tailwind for rapid one-off layouts, CSS Modules for a couple of complex bespoke widgets, and CSS custom properties as the shared token layer that ties them together. The pragmatic rule is to standardise on one *primary* approach for consistency, and reach for another only where its specific strength clearly pays for its cost.",
      "**Design tokens — the thing that survives every migration.** Whatever family you choose, the durable core is your **design tokens**: the finite set of colors, spacing steps, font sizes, radii, and shadows. Tailwind puts them in a config, MUI in a theme object, CSS-in-JS in a theme provider, and plain CSS in `:root` custom properties. If you express tokens as CSS variables, every approach can read them, and you can swap styling engines later without redoing your design system. Invest in the tokens first, the delivery mechanism second.",
      "**Common gotchas.** (1) Global CSS specificity wars are the number-one reason teams migrate — scope early. (2) Classic CSS-in-JS without SSR setup causes a flash of unstyled content and hydration mismatches. (3) Tailwind's purge/JIT only sees classes that appear as *complete literal strings* — dynamically concatenated class names (`` `bg-${color}-500` ``) get stripped from production. (4) Component libraries are hard to un-adopt; the deep coupling to their API is a real lock-in cost. (5) Inline `style={{}}` objects bypass the cascade and media queries entirely — fine for one computed value, wrong as a general strategy.",
      "**The mental model (memorise this).** Every approach is answering three questions — *where does the work happen (build vs runtime)?*, *how are styles scoped (global → per-element)?*, and *how dynamic must they be (static → prop-driven)?* Plain CSS/Modules and Tailwind are build-time, cheap, and static-to-toggled; CSS-in-JS is runtime, costlier, and fully dynamic; component libraries trade control for speed and accessibility. Keep your design tokens portable, pick one primary strategy, and mix only with intent.",
    ],
    backendAnalogy:
      "Think of styling strategies like choosing how a Spring service manages configuration and dependencies. Plain global CSS is a single shared `application.properties` — convenient until two modules define the same key and clobber each other. CSS Modules are Java packages: build-time namespacing so `com.billing.Card` and `com.reports.Card` never collide. Tailwind is a curated set of reusable `@Component` beans — a fixed vocabulary everyone composes, so the whole app stays consistent. CSS-in-JS is computing configuration at runtime from injected parameters — maximally flexible (styles as a function of props, like beans built from a factory method reading request state) but you pay for that work on every invocation. Component libraries (MUI) are Spring Boot starters: opinionated, batteries-included, accessible defaults that get you shipping fast, at the price of fighting the framework when your needs diverge. Design tokens are your externalised config server — the source of truth that outlives whichever framework consumes it.",
    keyInsights: [
      "There is no best styling approach — you are choosing trade-offs along three axes: build-time vs runtime work, scoping strategy, and how dynamic styles must be.",
      "CSS is global by default; nearly every modern approach exists to solve scoping, whether by convention (BEM), build-time renaming (CSS Modules), atomic classes (Tailwind), or runtime hashing (CSS-in-JS).",
      "Plain CSS and CSS Modules are standards-based with zero runtime cost; Modules add automatic per-file scoping via mangled class names.",
      "Utility-first (Tailwind) composes single-purpose classes in markup, ships only used utilities, and enforces design tokens, at the cost of verbose markup.",
      "Classic CSS-in-JS colocates styles with components and computes them from props at runtime, enabling fully dynamic styling but adding bundle size, per-render cost, and SSR complexity.",
      "CSS custom properties are the underrated middle ground: they give plain CSS and Tailwind dynamic runtime values without any CSS-in-JS library.",
      "Component libraries like MUI trade control for speed, accessibility, and consistency, but are opinionated and create real lock-in.",
      "Mixing approaches is normal and healthy when done with intent — standardise on one primary strategy and reach for others only where their strength pays off.",
      "Design tokens (colors, spacing, type scale) are the durable core; express them as CSS variables so they survive a change of styling framework.",
      "Tailwind's compiler only sees complete literal class strings — dynamically built class names get purged in production and silently break.",
    ],
    codeSamples: [
      {
        label: "The same button in four approaches (compare the ergonomics)",
        language: "tsx",
        code: `// 1) Plain CSS / CSS Modules — real CSS, scoped class name imported as an object
import styles from "./Button.module.css";
<button className={styles.primary}>Save</button>;
/* Button.module.css:  .primary { padding: 8px 16px; background: #1d4ed8; color:#fff; } */

// 2) Utility-first (Tailwind) — compose atomic classes in the markup
<button className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800">
  Save
</button>;

// 3) CSS-in-JS (Emotion styled) — styles colocated, can read props at runtime
import styled from "@emotion/styled";
const Primary = styled.button\`
  padding: 8px 16px;
  background: \${(p: { danger?: boolean }) => (p.danger ? "#dc2626" : "#1d4ed8")};
  color: #fff;
\`;
<Primary danger>Delete</Primary>;

// 4) Component library (MUI) — assemble a pre-built, accessible component
import Button from "@mui/material/Button";
<Button variant="contained" color="primary">Save</Button>;`,
      },
      {
        label: "Scoping strategies side by side",
        language: "css",
        code: `/* GLOBAL CSS — collides: any .card anywhere is affected, later rule wins */
.card { padding: 16px; }

/* BEM convention — scoping by naming discipline (no tooling) */
.expense-card__title--active { color: #1d4ed8; }

/* CSS MODULES output — bundler mangles the name so it's unique per file */
/* .card  ->  .ExpenseCard_card_a1b2c   (you never type the mangled name) */

/* TAILWIND — atomic classes: each does exactly one thing, everywhere */
/* .px-4 { padding-inline: 1rem } .bg-blue-700 { background:#1d4ed8 } ... */

/* CSS-IN-JS runtime output — a hash class generated per unique style */
/* .css-1a2b3c { padding:16px; } injected into a <style> tag at runtime */`,
      },
      {
        label: "Design tokens as CSS variables — portable across every approach",
        language: "css",
        code: `/* Define once at the root; any approach below can consume these. */
:root {
  --color-brand: #1d4ed8;
  --color-danger: #dc2626;
  --space-2: 8px;
  --space-4: 16px;
  --radius: 8px;
}

/* Plain CSS reads them directly */
.button { background: var(--color-brand); padding: var(--space-2) var(--space-4); }

/* Tailwind can map them:  theme.extend.colors.brand = 'var(--color-brand)'  */
/* CSS-in-JS reads them:   background: var(--color-brand);                    */
/* Because tokens live in CSS vars, swapping frameworks never re-does them.   */`,
      },
      {
        label: "Dynamic styling WITHOUT CSS-in-JS (custom property injection)",
        language: "tsx",
        code: `// A runtime-driven progress bar with plain CSS + a CSS variable.
// No styling library, no per-render style engine — the browser does the work.
function Progress({ percent }: { percent: number }) {
  // Pass the runtime value in as a custom property; CSS consumes it.
  return (
    <div className="track" style={{ ["--pct" as string]: percent + "%" }}>
      <div className="fill" />
    </div>
  );
}
/*  CSS:
    .track { background:#e5e7eb; border-radius:9999px; overflow:hidden; }
    .fill  { width: var(--pct); height: 8px; background: var(--color-brand); }
*/`,
      },
      {
        label: "Decision helper — pick a primary approach from constraints",
        language: "ts",
        code: `type Constraints = {
  needsPropDrivenStyles: boolean;   // styles computed from runtime values?
  perfCritical: boolean;            // tight Core Web Vitals / low-end devices?
  needsAccessibleComponentsFast: boolean;
  teamKnowsTailwind: boolean;
};

function recommendStyling(c: Constraints): string {
  if (c.needsAccessibleComponentsFast) return "Component library (MUI/Chakra) + theme tokens";
  if (c.perfCritical) return "CSS Modules or Tailwind (build-time, zero runtime)";
  if (c.needsPropDrivenStyles) return "CSS custom properties first; CSS-in-JS if truly needed";
  if (c.teamKnowsTailwind) return "Tailwind (utility-first)";
  return "CSS Modules (safe, standards-based default)";
}`,
      },
    ],
    runnable: {
      title: "Same visual result, three scoping strategies — watch the console",
      html: `<button id="plain" class="btn">Plain CSS class</button>
<button id="util" class="px-4 py-2 rounded brand text">Utility-style</button>
<div id="log" class="note">Open the console to see the resolved styles.</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; display:flex; gap:12px; flex-wrap:wrap; }

/* Design tokens (the portable core) */
:root { --brand:#1d4ed8; --brand-dark:#1e40af; }

/* "Plain CSS" component-style rule */
.btn { padding:8px 16px; border:0; border-radius:8px; background:var(--brand); color:#fff; cursor:pointer; }
.btn:hover { background:var(--brand-dark); }

/* "Utility-style" atomic classes (what Tailwind would generate) */
.px-4 { padding-left:16px; padding-right:16px; }
.py-2 { padding-top:8px; padding-bottom:8px; }
.rounded { border-radius:8px; }
.brand { background:var(--brand); }
.text  { color:#fff; border:0; cursor:pointer; }

.note { flex-basis:100%; margin-top:12px; color:#475569; font-size:13px; }`,
      js: `// Both buttons resolve to the same computed background via the shared token.
const plain = getComputedStyle(document.querySelector('#plain')).backgroundColor;
const util  = getComputedStyle(document.querySelector('#util')).backgroundColor;
console.log('Plain CSS background:', plain);
console.log('Utility-composed background:', util);
console.log('Same result:', plain === util, '(both read --brand token)');`,
    },
    interviewQA: [
      {
        question: "How would you decide between Tailwind, CSS Modules, and CSS-in-JS for a new project?",
        answer:
          "I frame it on three axes: where the work happens (build vs runtime), how styles are scoped, and how dynamic they must be. If performance is critical I stay build-time — CSS Modules or Tailwind. If the team wants velocity and consistency and knows utilities, Tailwind. If a lot of styling is genuinely prop-driven I consider CSS-in-JS, but first I check whether CSS custom properties cover it, because they usually do without a runtime library. CSS Modules is my safe default when there's no strong pull otherwise.",
      },
      {
        question: "What problem do CSS Modules, Tailwind, and CSS-in-JS all fundamentally solve?",
        answer:
          "Scoping. CSS is global by default, so at scale you get class-name collisions, specificity wars, and !important escalation. CSS Modules solve it by renaming classes uniquely at build time, Tailwind by using atomic classes that each do exactly one thing everywhere, and CSS-in-JS by generating a unique hashed class per component at runtime. They're different answers to the same collision problem.",
      },
      {
        question: "What are the real runtime costs of classic CSS-in-JS?",
        answer:
          "You ship a styling engine in the JS bundle, styles are computed during render rather than being static, and server-side rendering needs extra setup to extract critical CSS or you get a flash of unstyled content and hydration mismatches. On performance-sensitive pages this is measurable, which is why zero-runtime variants like Linaria and vanilla-extract extract the CSS at build time to get the ergonomics without the runtime cost.",
      },
      {
        question: "Do you always need CSS-in-JS for dynamic styles?",
        answer:
          "No. Discrete states are handled by toggling classes, and continuous runtime values are handled by CSS custom properties — you pass the value in via style={{ '--w': pct + '%' }} and the CSS consumes var(--w). That covers most real cases with zero runtime library. I reach for CSS-in-JS only when styling logic is genuinely complex and tightly coupled to component state.",
      },
      {
        question: "When is a component library like MUI the right call, and what's the cost?",
        answer:
          "It's right when you need to ship conventional, accessible UI fast with a consistent design system and don't want to rebuild dialogs, data grids, and date pickers. The costs are an opinionated API, real effort to customise beyond the theme, a larger baseline bundle, and lock-in — the deep coupling to its API makes it hard to remove later. Great for product teams, less so for highly bespoke or brand-heavy designs.",
      },
      {
        question: "Why do teams often mix multiple styling approaches, and is that a problem?",
        answer:
          "Because different parts of an app have different needs — a component library for chrome, Tailwind for quick layouts, CSS Modules for a couple of complex widgets. It's not inherently a problem if done with intent: standardise on one primary approach for consistency and reach for others only where their specific strength clearly pays for its cost. The glue that keeps it coherent is shared design tokens.",
      },
      {
        question: "What are design tokens and why do they matter across all approaches?",
        answer:
          "Tokens are the finite set of design decisions — colors, spacing steps, type scale, radii, shadows — that every component draws from. They matter because they're the durable core: Tailwind puts them in config, MUI in a theme, CSS-in-JS in a provider, plain CSS in :root variables. If you express them as CSS custom properties, every approach can read them and you can swap the styling engine later without redoing your design system.",
      },
    ],
    thingsToRemember: [
      "No best approach — choose trade-offs on three axes: build vs runtime, scoping, and how dynamic styles must be.",
      "Global CSS is the root problem; every modern approach is a different way to scope.",
      "Plain CSS / CSS Modules = zero runtime cost; Modules add per-file build-time scoping.",
      "Tailwind = atomic classes composed in markup, tiny bundles, enforced tokens, verbose markup.",
      "Classic CSS-in-JS = runtime engine, prop-driven styles, bundle + render cost + SSR setup.",
      "CSS custom properties give dynamic runtime values without any CSS-in-JS library.",
      "Component libraries (MUI) = speed + accessibility + consistency, but opinionated and lock-in.",
      "Mixing is fine with intent: one primary approach, others only where they clearly pay off.",
      "Keep design tokens portable (CSS variables) so they survive a framework change.",
      "Tailwind only sees complete literal class strings — never build class names by concatenation.",
    ],
    references: [
      { label: "MDN — CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { label: "MDN — Using CSS custom properties (variables)", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" },
      { label: "Tailwind CSS — Official docs", url: "https://tailwindcss.com/docs" },
      { label: "Emotion — Official docs", url: "https://emotion.sh/docs/introduction" },
      { label: "MUI — Material UI docs", url: "https://mui.com/material-ui/getting-started/" },
      { label: "web.dev — Learn CSS", url: "https://web.dev/learn/css" },
    ],
    tags: ["css", "styling", "tailwind", "css-in-js", "css-modules", "design-tokens", "component-libraries", "architecture"],
  },
  {
    id: "tailwind-css",
    num: 7,
    title: "Tailwind CSS",
    part: "Styling",
    partId: "b",
    difficulty: "Core",
    summary:
      "Utility-first styling from first principles — why atomic classes exist, how the JIT compiler produces tiny bundles, the config-driven token system, responsive and state modifiers, dark mode, extraction with @apply and components, and the gotchas that bite in production.",
    readingTime: 18,
    explanation: [
      "**What 'utility-first' actually means.** Traditional CSS gives each component a semantic class (`.card`, `.btn-primary`) and you write rules for it in a stylesheet. Tailwind inverts this: it provides thousands of tiny **single-purpose (atomic) classes** — `p-4` sets padding, `flex` sets `display:flex`, `text-center` sets `text-align:center` — and you *compose* them directly in markup. You almost never write custom CSS; you assemble the styling from a fixed vocabulary. The mental shift is from 'name a thing, then style the name' to 'describe the styling inline from a design-system palette.'",
      "**Why atomic classes solve the scaling problems of CSS.** Because each utility does exactly one thing and means the same thing everywhere, there are no naming decisions, no scoping collisions, and no specificity wars — every utility has the same low specificity. Crucially, the CSS stops growing: adding a hundred new components reuses the same handful of utilities rather than adding a hundred new rules. This is why large Tailwind projects have small, flat stylesheets while large hand-written CSS codebases tend to grow forever and accumulate dead rules nobody dares delete.",
      "**The JIT compiler and why bundles stay tiny.** Tailwind could theoretically generate millions of utility combinations, so it doesn't ship them all. The **Just-In-Time compiler** scans your source files (templates, JSX, etc.), finds the class names you actually use as literal strings, and generates *only those* rules into the output CSS. Unused utilities never exist in production. This means the shipped CSS size is proportional to the *distinct* utilities you use — typically a few kilobytes — not to Tailwind's full capability, and arbitrary values like `w-[137px]` are generated on demand.",
      "**The config file is your design system.** `tailwind.config.js` defines the **theme** — the finite scales of colors, spacing, font sizes, breakpoints, radii, and shadows that all utilities draw from. `p-4` isn't 'some padding'; it's specifically `1rem` because the spacing scale says so. Centralising these tokens is what makes a Tailwind product visually coherent: everyone picks from the same palette, so spacing and color stay on-system automatically. You extend rather than replace defaults via `theme.extend`, which adds brand tokens (`colors.brand`) while keeping Tailwind's sensible base scales.",
      "**Modifiers: responsive, state, and beyond.** Utilities take **prefixes** that scope *when* they apply. Responsive prefixes are mobile-first min-width breakpoints: an unprefixed utility applies at all sizes, `md:` applies from the medium breakpoint up, `lg:` from large up. So `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` is a responsive grid written inline. State prefixes cover interaction and structure: `hover:`, `focus:`, `active:`, `disabled:`, `focus-visible:`, `first:`, `last:`, `odd:`, and the group/peer variants (`group-hover:`) that let a parent's state style a child. Modifiers stack: `md:hover:bg-blue-800`.",
      "**Mobile-first is a deliberate constraint.** Tailwind's breakpoints are min-width, so you style the smallest screen with unprefixed utilities and *layer on* changes for larger screens with prefixes. This nudges you toward designing mobile-up, which is almost always the right default. A common beginner mistake is trying to use `md:` to mean 'only on medium' — it actually means 'medium and above,' so you scope the base case first and override upward.",
      "**Dark mode and theming.** Tailwind's `dark:` variant applies utilities when dark mode is active — `bg-white dark:bg-slate-900`. You configure whether dark mode follows the OS (`media` strategy) or a class you toggle on `<html>` (`class` strategy, better for a user preference switch). Combined with CSS custom properties in the theme, this gives full theming without leaving markup. Arbitrary properties and CSS variables (`bg-[var(--brand)]`) bridge Tailwind to a design-token layer shared with the rest of the app.",
      "**Extraction: @apply, component classes, and the DRY question.** Repeating a long utility list across many buttons is the classic complaint. Three answers: (1) extract a **component in your framework** (`<Button>`), which is the preferred fix because it colocates markup and styling and reuses through composition; (2) use **`@apply`** in a CSS file to fold utilities into a semantic class (`.btn { @apply px-4 py-2 rounded bg-blue-700; }`) — handy but use sparingly, since overusing it recreates the exact global-CSS problems Tailwind removed; (3) plugins for cross-cutting concerns. Prefer component extraction over `@apply`.",
      "**The `cn`/clsx pattern for conditional classes.** In components you build class strings conditionally, and the safe way is a helper that merges class lists — `clsx` for conditionals and `tailwind-merge` to resolve conflicts (so a later `px-6` beats an earlier `px-4`). Never build utility names by string concatenation (`` `bg-${color}-500` ``): the JIT scanner only detects *complete literal* class strings, so concatenated names get purged from production and silently vanish. Use full class names in a lookup map instead.",
      "**Where the layers live: base, components, utilities.** Tailwind organises generated CSS into three layers via `@layer` — `base` (resets and element defaults), `components` (your extracted component classes), and `utilities` (the atomic classes). Layer order controls the cascade, so your utilities correctly override component defaults, and your components override base. Understanding layers explains why a utility placed in markup reliably wins over a component class.",
      "**Common gotchas.** (1) Dynamically constructed class names get purged — always write complete literals. (2) Long class lists hurt readability; extract components early. (3) `@apply` overuse resurrects global CSS problems. (4) Specificity conflicts when mixing with other CSS — use `tailwind-merge`. (5) Content configuration must include every file that contains classes, or the JIT won't see them and they'll be missing in prod. (6) Arbitrary values (`top-[117px]`) are an escape hatch, not a habit — too many defeats the design-system consistency that is the whole point.",
      "**The mental model (memorise this).** Tailwind = compose a fixed vocabulary of atomic classes in markup; the JIT compiler ships only the ones you literally write, so bundles stay tiny; the config is your design system and the source of every value; modifiers (`md:`, `hover:`, `dark:`) express responsiveness, state, and theming inline, mobile-first; extract repetition into framework components, not `@apply`; and never build class names dynamically.",
    ],
    backendAnalogy:
      "Tailwind is like building services from a curated library of small, well-tested utility functions instead of writing bespoke logic each time. The atomic classes are those reusable helpers — each does one thing, is used everywhere, and never conflicts, exactly like pure static utility methods. `tailwind.config.js` is your central `application.yml` / constants module: the single source of truth for the values (spacing scale, palette) every 'call site' references, so the whole system stays consistent. The JIT compiler is tree-shaking / dead-code elimination at the CSS layer — only the code paths you actually invoke make it into the artifact, so the binary stays small no matter how large the library. `@apply` is like extracting a private helper method to avoid repetition — useful in moderation, but if you wrap everything you're back to the tangled bespoke code you were trying to avoid. And building class names by string concatenation is the equivalent of reflection-based lookups the tree-shaker can't see: the optimiser strips what it can't prove is used, and it breaks in production.",
    keyInsights: [
      "Utility-first inverts CSS: instead of naming a component and styling the name, you compose single-purpose atomic classes directly in markup from a fixed design-system vocabulary.",
      "Atomic classes eliminate naming decisions, scoping collisions, and specificity wars, and the stylesheet stops growing because new components reuse the same utilities.",
      "The JIT compiler scans source for literal class names and generates only those rules, so production CSS is proportional to the distinct utilities you use — usually a few kilobytes.",
      "tailwind.config.js defines the theme — the finite scales of colors, spacing, type, and breakpoints — which is what makes a Tailwind product visually consistent; extend, don't replace, defaults.",
      "Modifiers scope when a utility applies: responsive prefixes (md:, lg:) are mobile-first min-width, state prefixes (hover:, focus:, disabled:) cover interaction, and they stack (md:hover:).",
      "dark: applies utilities in dark mode; the class strategy (toggle a class on <html>) is best for a user-controlled theme switch.",
      "Prefer extracting a framework component over @apply for repetition; overusing @apply resurrects the global-CSS problems Tailwind removed.",
      "Never build class names by concatenation — the JIT scanner only detects complete literal strings, so dynamic names get purged and silently break in production.",
      "Use clsx for conditional classes and tailwind-merge to resolve conflicting utilities predictably.",
      "Arbitrary values (w-[137px], bg-[var(--brand)]) are an escape hatch — occasional use is fine, but too many defeats the design-system consistency that is the point.",
    ],
    codeSamples: [
      {
        label: "Utilities, responsive + state modifiers, dark mode",
        language: "html",
        code: `<!-- A button: base styles, hover/focus state, dark-mode variant -->
<button class="px-4 py-2 rounded-md bg-blue-700 text-white
               hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-300
               disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400
               transition duration-150">
  Submit Expense
</button>

<!-- Responsive grid: 1 col on mobile, 2 from md up, 3 from lg up (mobile-first) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">Card 1</div>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">Card 2</div>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">Card 3</div>
</div>

<!-- group/peer: parent hover styles a child -->
<a href="#" class="group block p-4 rounded hover:bg-slate-100">
  <span class="text-slate-500 group-hover:text-blue-700">Reveal on hover</span>
</a>`,
      },
      {
        label: "tailwind.config.js — extend the theme with brand tokens",
        language: "js",
        code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  // content MUST list every file with classes, or the JIT won't emit them
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  darkMode: "class", // toggle a .dark class on <html> for a user preference switch
  theme: {
    extend: {
      // Add brand colors WITHOUT losing Tailwind's default palette
      colors: {
        brand: { 500: "#1B4F72", 600: "#154360" },
      },
      // Bridge to a shared design-token layer via CSS variables
      backgroundColor: { token: "var(--color-brand)" },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [],
};`,
      },
      {
        label: "Component extraction vs @apply (prefer the component)",
        language: "tsx",
        code: `// PREFERRED: extract a framework component — colocated, composable, typed.
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function Button({ variant = "primary", className, ...props }:
  { variant?: "primary" | "danger"; className?: string } & React.ComponentProps<"button">) {
  return (
    <button
      className={twMerge(clsx(
        "px-4 py-2 rounded-md font-medium text-white",
        variant === "primary" && "bg-blue-700 hover:bg-blue-800",
        variant === "danger" && "bg-red-600 hover:bg-red-700",
        className, // callers can override; twMerge resolves conflicts
      ))}
      {...props}
    />
  );
}

/* ALTERNATIVE (use sparingly): @apply in a CSS file
   .btn { @apply px-4 py-2 rounded-md font-medium text-white bg-blue-700; }
   Overusing @apply recreates the global-CSS problems Tailwind removed. */`,
      },
      {
        label: "The dynamic-class trap — and the correct fix",
        language: "tsx",
        code: `// WRONG: the JIT scanner cannot see this — it gets purged in production.
function BadBadge({ color }: { color: "red" | "green" }) {
  return <span className={\`bg-\${color}-500\`}>x</span>; // vanishes in prod!
}

// RIGHT: map to COMPLETE literal class strings the scanner can detect.
const BADGE: Record<"red" | "green", string> = {
  red: "bg-red-500",
  green: "bg-green-500",
};
function GoodBadge({ color }: { color: "red" | "green" }) {
  return <span className={BADGE[color]}>x</span>; // full literals — safe
}`,
      },
      {
        label: "Directives & layers in your entry CSS",
        language: "css",
        code: `/* app.css — Tailwind injects generated rules into three ordered layers */
@tailwind base;        /* resets + sensible element defaults */
@tailwind components;   /* your extracted component classes live here */
@tailwind utilities;    /* atomic utilities — win the cascade over components */

/* Add your own tokens/base styles into the right layer */
@layer base {
  :root { --color-brand: #1B4F72; }
  body { @apply text-slate-800 dark:text-slate-100; }
}`,
      },
    ],
    runnable: {
      title: "What the JIT generates: Tailwind utilities as their plain-CSS equivalents",
      html: `<button class="btn">px-4 py-2 rounded bg-blue-700 text-white</button>
<div class="grid">
  <div class="card">1</div><div class="card">2</div><div class="card">3</div>
</div>
<p id="out" class="note"></p>`,
      css: `/* Hand-written equivalents of the Tailwind utilities used above.
   Tailwind's JIT would emit exactly these rules for these classes. */
body { font-family: system-ui, sans-serif; padding: 20px; }

/* .px-4 .py-2 .rounded-md .bg-blue-700 .text-white .hover:bg-blue-800 */
.btn {
  padding-left: 1rem; padding-right: 1rem;   /* px-4 */
  padding-top: .5rem; padding-bottom: .5rem;  /* py-2 */
  border-radius: .375rem;                     /* rounded-md */
  background: #1d4ed8;                        /* bg-blue-700 */
  color: #fff;                                /* text-white */
  border: 0; cursor: pointer;
}
.btn:hover { background: #1e40af; }           /* hover:bg-blue-800 */

/* .grid .grid-cols-1 md:grid-cols-3 .gap-4  (simplified to 3 cols) */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 16px; }
.card { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.1); border-radius: .5rem; padding: 1rem; text-align:center; }
.note { color:#475569; font-size:13px; margin-top:12px; }`,
      js: `// Read back the computed styles to prove the utility -> CSS mapping.
const btn = document.querySelector('.btn');
const cs = getComputedStyle(btn);
console.log('bg-blue-700  ->', cs.backgroundColor);
console.log('px-4 (left)  ->', cs.paddingLeft);
console.log('rounded-md   ->', cs.borderRadius);
document.querySelector('#out').textContent =
  'Each Tailwind utility maps to one tiny CSS rule; the JIT ships only the ones you use.';`,
    },
    interviewQA: [
      {
        question: "How does Tailwind keep production CSS tiny despite offering thousands of utilities?",
        answer:
          "The Just-In-Time compiler scans your source files for class names that appear as literal strings and generates only those rules into the output. Unused utilities never exist in production, so the shipped CSS is proportional to the distinct utilities you actually use — typically a few kilobytes — rather than to Tailwind's full capability. Arbitrary values are generated on demand too.",
      },
      {
        question: "What does tailwind.config.js do and why is theme.extend preferred over theme?",
        answer:
          "It defines the theme — the finite scales of colors, spacing, type, breakpoints, radii — that every utility draws from, which is what makes a product visually consistent. Setting theme directly replaces Tailwind's defaults, so you lose the whole base scale; theme.extend adds your brand tokens on top while keeping the sensible defaults, which is almost always what you want.",
      },
      {
        question: "Explain how responsive and state modifiers work.",
        answer:
          "Prefixes scope when a utility applies. Responsive prefixes are mobile-first min-width breakpoints — an unprefixed utility applies everywhere, md: applies from the medium breakpoint up, lg: from large up — so grid-cols-1 md:grid-cols-2 lg:grid-cols-3 is a responsive grid inline. State prefixes like hover:, focus:, disabled: apply on interaction or structure, and modifiers stack, e.g. md:hover:bg-blue-800.",
      },
      {
        question: "Why does building class names dynamically break in production?",
        answer:
          "The JIT scanner only detects complete literal class strings in your source. If you write `bg-${color}-500`, the full class name never appears literally, so Tailwind doesn't generate it and it's purged from the production build — the style silently disappears. The fix is a lookup map of complete literal class names, so the scanner can see every possible class.",
      },
      {
        question: "When would you use @apply versus extracting a component?",
        answer:
          "Prefer extracting a framework component like <Button>, because it colocates markup and styling and reuses through composition. @apply folds utilities into a semantic CSS class and is handy for a small number of cases, but overusing it recreates the global-CSS problems — naming, scoping, growing stylesheets — that Tailwind was meant to remove. Use it sparingly.",
      },
      {
        question: "How do you handle conditional and conflicting classes in components?",
        answer:
          "Use clsx (or a cn helper) to assemble classes conditionally, and tailwind-merge to resolve conflicts so a later utility beats an earlier one — for example a caller passing px-6 should override a default px-4. This keeps conditional styling readable and predictable, and lets components accept a className prop for safe overrides.",
      },
      {
        question: "What are the downsides of utility-first, and how do you mitigate them?",
        answer:
          "Markup gets verbose and there's a class vocabulary to learn. Mitigations: extract repeated patterns into components, use editor plugins for autocomplete and class sorting, keep arbitrary values rare so the design system stays consistent, and make sure the content config lists every file so nothing is purged. The payoff is tiny bundles, no scoping wars, and enforced design tokens.",
      },
    ],
    thingsToRemember: [
      "Utility-first: compose atomic classes in markup instead of writing custom CSS.",
      "JIT scans source for literal class names and ships only those — tiny production bundles.",
      "tailwind.config.js is your design system; use theme.extend to add tokens without losing defaults.",
      "Responsive prefixes (md:, lg:) are mobile-first min-width; state prefixes (hover:, focus:, disabled:) stack.",
      "dark: for dark mode; the class strategy suits a user-controlled theme toggle.",
      "Prefer extracting a component over @apply; overusing @apply resurrects global-CSS problems.",
      "Never concatenate class names — the scanner needs complete literals or they get purged.",
      "Use clsx for conditionals and tailwind-merge for conflicting utilities.",
      "content config must include every file with classes, or utilities go missing in prod.",
      "Arbitrary values are an escape hatch — keep them rare to preserve design-system consistency.",
    ],
    references: [
      { label: "Tailwind CSS — Official docs", url: "https://tailwindcss.com/docs" },
      { label: "Tailwind CSS — Utility-first fundamentals", url: "https://tailwindcss.com/docs/utility-first" },
      { label: "Tailwind CSS — Responsive design", url: "https://tailwindcss.com/docs/responsive-design" },
      { label: "Tailwind CSS — Dark mode", url: "https://tailwindcss.com/docs/dark-mode" },
      { label: "Tailwind Play — Online playground", url: "https://play.tailwindcss.com" },
      { label: "MDN — CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    ],
    tags: ["tailwind", "css", "utility-first", "design-tokens", "jit", "responsive", "dark-mode"],
  },
  {
    id: "css-in-js-css-modules-emotion",
    num: 8,
    title: "CSS-in-JS / CSS Modules (Emotion)",
    part: "Styling",
    partId: "b",
    difficulty: "Core",
    summary:
      "How CSS Modules scope class names at build time with zero runtime cost, and how Emotion generates scoped, prop-driven styles at runtime — the styled and css APIs, theming, SSR extraction, the flash-of-unstyled-content trap, zero-runtime alternatives, and when to pick each.",
    readingTime: 17,
    explanation: [
      "**Two tools, one shared job.** Both CSS Modules and Emotion solve CSS's global-scope problem, but at opposite ends of the build-vs-runtime axis. **CSS Modules** rename your class names uniquely at *build time* and leave you with plain, static CSS — zero runtime cost. **Emotion** generates scoped class names at *runtime* (or build time in its extracted modes) and lets styles be computed from props and theme. Many real codebases use both: Modules for the static bulk, Emotion for the genuinely dynamic pieces.",
      "**CSS Modules — how the scoping works.** You author a normal stylesheet named `Something.module.css` and `import styles from './Something.module.css'`. The bundler rewrites every local class name to a globally-unique mangled name (`.card` becomes something like `ExpenseCard_card_a1b2c`) and hands you back a JS object mapping the original name to the mangled one. You reference `styles.card` in `className`, so two components can each define `.card` with no collision. It's still just CSS — the same performance, the same tooling — only automatically namespaced per file.",
      "**CSS Modules — composition and globals.** Modules add a `composes` keyword to inherit declarations from another local (or imported) class, which is a lightweight alternative to preprocessor mixins. When you genuinely need an unscoped selector — a third-party class, a body reset — you opt out with `:global(.selector)`. Everything else stays local by default, which is the point: local-first scoping with an explicit escape hatch, rather than global-first with manual discipline.",
      "**Emotion — the two APIs.** Emotion offers two main ways to write styles. The **`styled` API** creates a component from a tag with attached styles: `const Card = styled.div\\`...\\`` — the styles can interpolate functions of props (`\\${p => p.active ? 'blue' : 'grey'}`), so the same component renders differently based on state. The **`css` prop API** attaches a computed style object or template directly to any element: `<p css={dynamicStyle(hasError)}>` — no wrapper component needed. `styled` suits reusable design-system primitives; the `css` prop suits one-off, local styling.",
      "**Emotion — how it generates and injects styles.** At runtime Emotion serializes your style into a string, hashes it to produce a stable, unique class name (`css-1a2b3c`), and injects the corresponding rule into a `<style>` tag in the document head, deduping identical styles across components. Because the class name is derived from the *content* of the styles, two elements with identical styles share one class — a nice automatic dedupe — while prop-driven variations produce distinct classes as needed.",
      "**Theming and design tokens.** Emotion ships a `ThemeProvider` that puts a theme object into React context; styled/css functions then receive `theme` as an argument (`\\${p => p.theme.colors.brand}`). This centralises tokens and enables runtime theme switching (light/dark, white-label brands) by swapping the provided object. It's the CSS-in-JS answer to the same design-token layer Tailwind keeps in config — colocated with components and reactive to context.",
      "**The runtime cost, honestly.** Classic CSS-in-JS pays three costs CSS Modules don't: a styling engine in the JS bundle, style *serialization and injection during render* (work on every relevant render), and the need to extract critical CSS on the server. On heavy, frequently-rerendering trees (large virtualized lists) this shows up in profiles. It's not disqualifying for most apps, but it's the reason performance-sensitive teams reach for CSS Modules or zero-runtime tools instead.",
      "**Server-side rendering and the FOUC trap.** On the server, Emotion must collect the styles used while rendering and inline them into the HTML `<head>`; frameworks like Next.js need explicit integration for this. Get it wrong and the browser shows a **flash of unstyled content** (FOUC) before the client injects styles, plus possible hydration mismatches if server and client class names diverge. CSS Modules sidestep this entirely because their output is a static `.css` file the browser loads normally — no runtime injection, no FOUC.",
      "**Zero-runtime CSS-in-JS.** To keep the ergonomics (colocation, `styled` syntax, theming) but drop the runtime cost, tools like **Linaria** and **vanilla-extract** move the extraction to *build time*: you write CSS-in-JS, and they emit static `.css` plus class-name constants, with dynamic bits handled via CSS custom properties. This is increasingly the recommended path in performance-conscious and RSC-heavy stacks, and it's why many teams that once used Styled Components have migrated.",
      "**How to choose between them.** Use **CSS Modules** for the default, static bulk of an app: zero runtime cost, standards-based, trivial SSR, great tooling. Reach for **Emotion (or another runtime CSS-in-JS)** when styling is genuinely prop-driven and tightly coupled to complex component state, or when you want a themed design-system with runtime theme switching. When performance matters but you like the CSS-in-JS authoring model, prefer a zero-runtime tool. And remember CSS custom properties can give Modules most of the 'dynamic' behavior without any runtime library.",
      "**Common gotchas.** (1) Emotion without SSR setup causes FOUC and hydration mismatches — wire up the server integration. (2) Defining `styled` components *inside* a render function recreates them every render, breaking memoization and hurting performance — define them at module scope. (3) Interpolating props into styles that change often generates many unique classes; prefer CSS variables for high-frequency values. (4) CSS Modules class names are mangled, so you can't target them from external global CSS — use `:global` deliberately. (5) Overusing the `css` prop for everything can scatter styles and hurt readability; reserve `styled` for reusable primitives.",
      "**The mental model (memorise this).** CSS Modules = build-time renaming to unique class names, static CSS, zero runtime, trivial SSR — your default for static styles. Emotion = runtime (or build-time-extracted) scoped classes computed from props and theme — reach for it when styling must react to state, accept the runtime and SSR cost, define styled components at module scope, and lean on CSS variables for hot-path dynamic values.",
    ],
    backendAnalogy:
      "CSS Modules are like Java packages plus the compiler: at build time the class name `card` gets fully-qualified into a unique symbol (`ExpenseCard_card_a1b2c`) so two modules can both declare `card` with zero collision — namespacing resolved once, statically, no runtime lookup. Emotion is like building configuration at runtime from injected parameters: a factory bean that reads request-scoped state and produces a tailored result each call — maximally flexible (styles as a function of props and a themed context, exactly like a bean assembled from a ThemeProvider) but you pay serialization/injection cost on the hot path, and you must arrange for it to work correctly during server rendering (SSR extraction is like pre-warming a cache so the first response is fully populated instead of blank). Zero-runtime CSS-in-JS (Linaria/vanilla-extract) is annotation processing / build-time code generation: you write the expressive high-level form, and the toolchain emits the static, cheap artifact ahead of time so nothing extra runs in production.",
    keyInsights: [
      "CSS Modules and Emotion both solve CSS's global-scope problem but sit at opposite ends of the build-vs-runtime axis.",
      "CSS Modules rename class names uniquely at build time and yield static CSS with zero runtime cost; importing a .module.css gives you an object of mangled, collision-proof names.",
      "CSS Modules are local-scoped by default with explicit escape hatches: :global for unscoped selectors and composes to inherit declarations from another class.",
      "Emotion's styled API creates prop-aware components; the css prop attaches a computed style directly to an element — styled for reusable primitives, css prop for one-offs.",
      "Emotion hashes each unique style into a stable class name and injects it into a style tag at runtime, deduping identical styles automatically.",
      "Emotion's ThemeProvider puts tokens in context so styles can read theme and switch themes at runtime — the CSS-in-JS design-token layer.",
      "Classic CSS-in-JS costs a runtime engine, per-render style injection, and SSR extraction; CSS Modules avoid all three because their output is a static stylesheet.",
      "Without SSR setup Emotion causes a flash of unstyled content and hydration mismatches; CSS Modules sidestep this entirely.",
      "Zero-runtime tools like Linaria and vanilla-extract keep the CSS-in-JS authoring model but extract static CSS at build time, reclaiming the performance.",
      "Never define styled components inside a render function — it recreates them every render; define at module scope, and use CSS variables for high-frequency dynamic values.",
    ],
    codeSamples: [
      {
        label: "CSS Modules: scoped classes, composes, and :global",
        language: "css",
        code: `/* ExpenseCard.module.css — authored as normal CSS, scoped at build time */
.base {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.card {
  composes: base;              /* inherit declarations from .base (like a mixin) */
  transition: box-shadow .2s;
}
.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
/* Opt OUT of scoping for a genuinely global selector (use deliberately) */
:global(.no-print) { display: none; }
/* At build time .card becomes e.g. ExpenseCard_card_a1b2c — unique per file */`,
      },
      {
        label: "CSS Modules: consuming the mangled class map",
        language: "tsx",
        code: `// The import is a JS object mapping local names -> unique mangled names.
import styles from "./ExpenseCard.module.css";

function ExpenseCard({ title }: { title: string }) {
  // styles.card === "ExpenseCard_card_a1b2c" (scoped, collision-proof)
  return <div className={styles.card}>{title}</div>;
}

// Combining classes conditionally: build the string yourself or use clsx.
import clsx from "clsx";
function Row({ active }: { active: boolean }) {
  return <div className={clsx(styles.card, active && styles.active)} />;
}`,
      },
      {
        label: "Emotion: prop-driven styles with the styled API",
        language: "tsx",
        code: `// Define styled components at MODULE scope — never inside render.
import styled from "@emotion/styled";

// Styles are a function of props: the component renders differently by state.
const Card = styled.div<{ active?: boolean }>\`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid \${(p) => (p.active ? "#1B4F72" : "#ddd")};
  background: \${(p) => (p.active ? "#EBF5FB" : "white")};
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
\`;

// Usage — the appearance is a pure function of the active prop.
function Item({ selected }: { selected: boolean }) {
  return <Card active={selected}>Lunch — Rs.120</Card>;
}`,
      },
      {
        label: "Emotion: the css prop + ThemeProvider tokens",
        language: "tsx",
        code: `/** @jsxImportSource @emotion/react */
import { css, ThemeProvider } from "@emotion/react";

const theme = { colors: { ok: "green", error: "red", brand: "#1B4F72" } };

// A computed style factory — one-off styling without a wrapper component.
const status = (isError: boolean) =>
  css\`
    color: \${isError ? "red" : "green"};
    font-weight: bold;
  \`;

function App({ hasError }: { hasError: boolean }) {
  return (
    <ThemeProvider theme={theme}>
      {/* css prop reads the computed style; styled/css fns also receive theme */}
      <p css={status(hasError)}>Status message</p>
    </ThemeProvider>
  );
}`,
      },
      {
        label: "Hot-path dynamic values: prefer CSS variables over prop interpolation",
        language: "tsx",
        code: `import styled from "@emotion/styled";

// ANTI-PATTERN: interpolating a frequently-changing value generates a new
// hashed class on every distinct value — many classes, more injection work.
const BadBar = styled.div<{ pct: number }>\`
  width: \${(p) => p.pct}%;
\`;

// BETTER: keep ONE static class; pass the changing value via a CSS variable.
const Bar = styled.div\`
  width: var(--pct);
  height: 8px;
  background: #1B4F72;
\`;
function Progress({ percent }: { percent: number }) {
  return <Bar style={{ ["--pct" as string]: percent + "%" }} />;
}`,
      },
    ],
    runnable: {
      title: "What Emotion produces: the plain-CSS output of scoped, prop-driven styles",
      html: `<div class="card">Inactive card</div>
<div class="card is-active">Active card (prop-driven)</div>
<div class="track"><div class="fill"></div></div>
<p id="out" class="note"></p>`,
      css: `/* Emotion at runtime would inject hashed classes like .css-1a2b3c.
   These hand-written rules show the equivalent CSS it generates. */
body { font-family: system-ui, sans-serif; padding: 20px; }

/* styled.div with active prop -> two generated variants (here: base + modifier) */
.card {
  padding: 16px; border-radius: 8px; border: 1px solid #ddd;
  background: #fff; transition: all .2s; margin-bottom: 12px;
}
.card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.1); }
.card.is-active { border-color: #1B4F72; background: #EBF5FB; } /* prop=true */

/* Hot-path value via a CSS variable — one static class, dynamic width */
.track { --pct: 60%; background:#e5e7eb; border-radius:9999px; overflow:hidden; }
.fill  { width: var(--pct); height: 8px; background: #1B4F72; }
.note  { color:#475569; font-size:13px; margin-top:12px; }`,
      js: `// Show that the active variant resolves to different computed styles,
// just as Emotion's prop-driven class would.
const active = document.querySelector('.card.is-active');
const cs = getComputedStyle(active);
console.log('active border color ->', cs.borderColor);
console.log('active background   ->', cs.backgroundColor);
const fillW = getComputedStyle(document.querySelector('.fill')).width;
console.log('progress fill width (from --pct var) ->', fillW);
document.querySelector('#out').textContent =
  'Emotion hashes each unique style into a class and injects it; a CSS var keeps hot-path values in one class.';`,
    },
    interviewQA: [
      {
        question: "What is the fundamental difference between CSS Modules and Emotion?",
        answer:
          "They sit at opposite ends of the build-vs-runtime axis. CSS Modules rename class names uniquely at build time and produce static, plain CSS with zero runtime cost — you author real CSS and import a map of mangled names. Emotion writes CSS in JavaScript and generates scoped class names at runtime, which enables prop-driven dynamic styles and theming, at the cost of a runtime engine, per-render injection, and SSR complexity.",
      },
      {
        question: "How do CSS Modules prevent class-name collisions?",
        answer:
          "At build time the bundler rewrites each local class name to a globally-unique mangled name — .card might become ExpenseCard_card_a1b2c — and exposes a JS object mapping the original name to the mangled one. You reference styles.card in className, so every component gets its own scoped names and two components can both define .card with no conflict. It's still plain CSS, just automatically namespaced per file.",
      },
      {
        question: "Explain Emotion's styled API versus the css prop.",
        answer:
          "The styled API creates a component with attached styles that can interpolate functions of props, so the same component renders differently by state — good for reusable design-system primitives. The css prop attaches a computed style object or template directly to any element with no wrapper component — good for one-off, local styling. Both can read the theme from ThemeProvider context.",
      },
      {
        question: "Why does Emotion need special handling for server-side rendering?",
        answer:
          "Because Emotion injects styles at runtime, on the server it must collect the styles used during render and inline them into the HTML head, and frameworks like Next.js need explicit integration to do that. Without it you get a flash of unstyled content before the client injects styles, and possibly hydration mismatches if class names diverge. CSS Modules avoid this because their output is a static stylesheet the browser loads normally.",
      },
      {
        question: "When would you choose Emotion over CSS Modules?",
        answer:
          "When styling is genuinely prop-driven and tightly coupled to complex component state, or when you want a themed design system with runtime theme switching — a card whose border and background change on an active prop, or light/dark theming from context. For static styles I default to CSS Modules for the zero runtime cost and trivial SSR, and I remember CSS custom properties can cover many dynamic cases without any runtime library.",
      },
      {
        question: "What are the main performance pitfalls with CSS-in-JS and how do you avoid them?",
        answer:
          "Defining styled components inside a render function recreates them every render and breaks memoization — define them at module scope. Interpolating frequently-changing values generates a new hashed class per value, so use a CSS custom property for hot-path values instead. And be aware of the baseline runtime cost on large re-rendering trees; if performance is critical, prefer a zero-runtime tool like Linaria or vanilla-extract.",
      },
      {
        question: "What are zero-runtime CSS-in-JS tools and why do they exist?",
        answer:
          "Tools like Linaria and vanilla-extract keep the CSS-in-JS authoring model — colocation, styled-like syntax, theming — but extract the styles to static CSS and class-name constants at build time, handling dynamic bits via CSS custom properties. They exist to get the ergonomics of CSS-in-JS without the runtime engine, per-render injection, or SSR extraction cost, which is why many teams have migrated to them from classic runtime libraries.",
      },
    ],
    thingsToRemember: [
      "CSS Modules: build-time scoping, static CSS, zero runtime cost, mangled class names, trivial SSR.",
      "Modules are local by default; use :global to opt out and composes to inherit declarations.",
      "Emotion styled = prop-aware reusable components; css prop = one-off styling on an element.",
      "Emotion hashes each unique style into a class and injects it at runtime, deduping identical styles.",
      "ThemeProvider puts tokens in context, enabling runtime theme switching.",
      "CSS-in-JS costs: runtime engine, per-render injection, and SSR extraction — Modules avoid all three.",
      "No SSR setup => flash of unstyled content and hydration mismatches; wire up server integration.",
      "Define styled components at module scope, never inside render.",
      "Use CSS variables for high-frequency dynamic values to avoid class explosion.",
      "For performance with CSS-in-JS ergonomics, prefer zero-runtime tools (Linaria, vanilla-extract).",
    ],
    references: [
      { label: "Emotion — Official docs", url: "https://emotion.sh/docs/introduction" },
      { label: "Emotion — Theming", url: "https://emotion.sh/docs/theming" },
      { label: "Emotion — SSR", url: "https://emotion.sh/docs/ssr" },
      { label: "CSS Modules — GitHub", url: "https://github.com/css-modules/css-modules" },
      { label: "vanilla-extract — Zero-runtime CSS-in-JS", url: "https://vanilla-extract.style/" },
      { label: "MDN — Using CSS custom properties (variables)", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" },
    ],
    tags: ["css-modules", "emotion", "css-in-js", "scoping", "react", "ssr", "theming", "zero-runtime"],
  },
];
