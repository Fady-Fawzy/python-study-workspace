# Mobile Reading Mode 2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make lesson reading on 320–430px phones focused, navigable, overflow-safe, persistent, accessible, and theme-safe without changing lesson prose or Summary content.

**Architecture:** Keep `AppShell`/`LessonView` as the existing composition boundary. Add a small `readingPosition` persistence helper and a focused `LessonReadingControls` component, then refine existing Full View, TOC, code/output, table, and mobile CSS contracts with tokens.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite, existing CSS custom-property design tokens, browser `localStorage` and scroll APIs.

**Spec:** `docs/superpowers/specs/2026-08-25-mobile-reading-mode-2-design.md`

## Global Constraints

- Do not modify the Summary or educational lesson prose.
- Do not add runtime AI, Python execution, backend services, or heavy dependencies.
- Preserve Quick Review, notes, bookmarks, completion, routing, and lesson 026+ fallback behavior.
- Keep Python code/output LTR and internally scrollable; keep Arabic explanatory text readable.
- Use semantic controls, existing theme tokens, safe-area variables, and 44px minimum touch targets.
- Run focused tests after every red-green cycle and fresh typecheck, lint, full tests, practice tests, build, and `git diff --check` before publishing.

### Task 1: Reading-position persistence contract

**Files:**
- Create: `src/lib/readingPosition.ts`
- Test: `src/lib/readingPosition.test.ts`

**Interfaces:**
- Produces `readReadingPosition(lessonId: string): number`, `writeReadingPosition(lessonId: string, position: number): void`, and `clearReadingPosition(lessonId: string): void`.
- Stores only finite, non-negative numeric positions under `py_study_workspace_reading_positions_v1`.

- [x] **Step 1: Write the failing test** for empty storage, valid round-trip, and invalid/negative values being ignored.
- [x] **Step 2: Run `./node_modules/.bin/vitest run src/lib/readingPosition.test.ts` and verify the expected missing-module failure.**
- [x] **Step 3: Implement the smallest localStorage helper with safe JSON parsing and finite-number validation.**
- [x] **Step 4: Rerun the focused test and verify it passes.**
- [x] **Step 5: Commit `feat: persist lesson reading positions`.**

### Task 2: Jump controls component

**Files:**
- Create: `src/components/lesson/LessonReadingControls.tsx`
- Create: `src/components/lesson/LessonReadingControls.test.tsx`
- Modify: `src/views/LessonView.tsx`

**Interfaces:**
- `LessonReadingControls` accepts no lesson data; it observes the window and renders buttons named `Jump to top` and `Jump to end` when scrolling makes them useful.
- `LessonView` renders the controls once per lesson view and keeps them outside lesson prose.

- [x] **Step 1: Write a failing component test** asserting both accessible buttons, `window.scrollTo` targets, and reduced-motion behavior.
- [x] **Step 2: Run the focused test and verify the component is missing.**
- [x] **Step 3: Implement scroll-state tracking with a passive listener, requestAnimationFrame cleanup, and token-safe semantic buttons.**
- [x] **Step 4: Render it from `LessonView` and rerun focused tests.**
- [x] **Step 5: Commit `feat: add lesson reading jump controls`.**

### Task 3: Restore and save reading position

**Files:**
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/LessonView.test.tsx`

**Interfaces:**
- On lesson identity change, read the lesson position and restore it after the first paint; when no saved position exists, preserve the current top-of-lesson behavior.
- Persist a throttled position while scrolling and flush it on `pagehide` and component cleanup.

- [x] **Step 1: Add a failing LessonView test** that seeds a position, renders the lesson, and expects an automatic scroll to that position; add a second assertion that scroll activity writes the current position.
- [x] **Step 2: Run the focused test and verify the new behavior fails.**
- [x] **Step 3: Implement restore/persist effects without calling `onUpdateState` on scroll.**
- [x] **Step 4: Rerun LessonView tests and verify existing mode, TOC, Full View, Practice, and fallback tests remain green.**
- [x] **Step 5: Commit `feat: restore lesson reading positions`.**

### Task 4: Full View and mobile layout contracts

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`

**Interfaces:**
- Full View keeps only lesson-reading chrome and the compact escape button.
- Mobile Full View reserves top space and never uses a full-width fixed button.

- [x] **Step 1: Add failing CSS contract tests** for hidden global/secondary chrome, fixed compact escape control, top/bottom safe-area spacing, and mobile jump-control placement.
- [x] **Step 2: Run `./node_modules/.bin/vitest run src/styles/index.test.ts` and verify failure.**
- [x] **Step 3: Add minimal Full View, reading-control, and phone spacing rules using existing variables.**
- [x] **Step 4: Rerun the focused style tests and inspect the diff for unrelated selectors.**
- [x] **Step 5: Commit `feat: polish mobile reading surfaces`.**

### Task 5: TOC, code/output, tables, and theme-safe surfaces

**Files:**
- Modify: `src/components/lesson/TableOfContents.tsx`
- Modify: `src/components/lesson/TableOfContents.test.tsx`
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`

**Interfaces:**
- TOC trigger exposes a stable `data-open` state and the sheet keeps its existing focus trap/return behavior.
- Code/output/table containers use internal scrolling, minimum readable padding, and no page-level horizontal overflow.

- [x] **Step 1: Add failing tests** for the TOC open-state contract and CSS contracts covering LTR code/output, internal table scrolling, and dark/light token usage.
- [x] **Step 2: Run focused component/style tests and verify failure.**
- [x] **Step 3: Add the state attribute and targeted CSS refinements; do not rewrite Markdown rendering.**
- [x] **Step 4: Rerun focused tests and the existing TOC/Detailed/CodeBlock tests.**
- [x] **Step 5: Commit `feat: harden mobile lesson surfaces`.**

### Task 6: Full verification and live release

**Files:**
- Review only: all changed files, `package-lock.json` unchanged, no `dist/` or `node_modules/` additions.

- [ ] **Step 1: Run `npm ci` with the configured temporary cache if the workspace needs a clean install.**
- [ ] **Step 2: Run `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run practice:test`, `npm run build`, and `git diff --check`.**
- [ ] **Step 3: Review `git status`, `git diff --stat`, and the full diff; verify Summary/content files are untouched.**
- [ ] **Step 4: Publish the verified tree to `main` without force push and inspect the Actions workflow through deploy completion.**
- [ ] **Step 5: Verify live lessons 020, 022, 026, Full View, Quick Review, notes, bookmark/completion controls, no console errors, and no page overflow; report the commit and workflow links.**
