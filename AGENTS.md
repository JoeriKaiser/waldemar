# AGENTS.md

This file provides guidance when working with code in this repository.

## Project Overview

Waldemar is a personal portfolio site for Joeri (Waldemar), built with Astro 5 in server output mode. It uses MDX content collections for project pages, TailwindCSS 4 for styling, GSAP for animations, and ships minimal client-side JavaScript.

## Commands

- **Dev server:** `bun run dev`
- **Build:** `bun run build` (runs `astro check` then `astro build`)
- **Preview build:** `bun run preview`
- **Production start:** `bun run start:prod` (runs `node ./dist/server/entry.mjs`)
- **Lint:** `bun run lint`
- **Format check:** `bun run format:check`
- **Full check (CI):** `bun run check` (lint + format check)
- **Auto-fix:** `bun run fix` (lint fix + format)

## Architecture

**Framework:** Astro 5 with Node.js adapter in standalone server mode. No frontend framework — interactivity uses vanilla JS in inline `<script>` tags with `astro:page-load` event listeners.

**Content:** Astro Content Collections with Zod schemas defined in `src/content/config.ts`. Projects are MDX files in `src/content/project/`. Pages collection in `src/content/pages/`.

**Routing:** File-based — `src/pages/index.astro` (home), `src/pages/about.astro`, `src/pages/[slug].astro` (dynamic pages from MDX), `src/pages/project/[slug].astro` (dedicated project detail pages). Uses Astro's ClientRouter for SPA-like view transitions.

**Styling:** TailwindCSS 4 integrated via Vite plugin. Design tokens (fluid spacing with `clamp()`, color palette with `--accent: #8483c8`, typography scale) defined in `src/styles/tokens.css`. Global styles split across `tailwind.css`, `theme.css`, `tokens.css`, and `layer.css`.

**Animations:** GSAP handles complex animations (hero section particles, magnetic buttons, tilt effects). View transitions use custom animation pairs (`fadeInUp`, `fadeOutUp`, etc.) defined in `src/utils/viewTransitions.ts`. Respects `prefers-reduced-motion`.

**View Transitions:**

- **Morph Effect:** Snappy 0.35s SVG clip-path transition via `src/components/ViewTransitionMorph.astro` — bursts outward from center when navigating forward, contracts inward for back navigation.
- **Directional Navigation:** `src/utils/navigationDirection.ts` tracks history to detect forward vs back navigation, triggering appropriate reverse animations.
- **Project Transitions:** `src/utils/projectTransitions.ts` defines snappy 0.35s directional transitions for project detail pages. Timeline previews link to `/project/{slug}` with shared element morphing for titles and hero images.
- **Clickable Projects:** `src/components/ProjectTimeline/Preview.astro` wraps each project in a link with `transition:name` attributes for seamless morph between timeline and detail pages.

**Layouts:** `src/layouts/BaseLayout.astro` wraps all pages. `src/layouts/MdxLayout.astro` wraps project detail pages.

## Code Style

- TypeScript strict mode (extends Astro's strict preset)
- ESLint: no `console.log` (warn/error allowed), no `debugger`, strict equality, curly braces required on all blocks, unused vars prefixed with `_`
- Prettier: 80 char width (100 for `.astro` files), double quotes, semicolons, ES5 trailing commas
- Conventional commit messages (`feat:`, `chore:`, `refactor:`, etc.)

## Global Types

`src/env.d.ts` extends the `Window` interface with `__PROJECTS` array, used by the command palette component for dynamic project search.

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

### Constraints

1. **Version Control** - NEVER commit or push code. User handles all git operations.
