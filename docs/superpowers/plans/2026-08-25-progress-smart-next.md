# Progress 2.0 and Smart Next Lesson Implementation Plan

> **For agentic workers:** Execute this plan inline in the current worktree without subagents. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make reading progress visible and make the dashboard's next lesson recommendation explain and respect the learner's current study trail.

**Architecture:** Keep exact scroll restoration in `readingPosition.ts`, add a small normalized percentage store in `readingProgress.ts`, render the progress meter through a focused lesson component, and keep recommendation ranking in a pure `nextLesson.ts` helper. The dashboard consumes those APIs without changing the main `StudyStateV1` shape.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS custom properties, localStorage.

**Spec:** `docs/superpowers/specs/2026-08-25-progress-smart-next-design.md`

## Global Constraints

- Practice, Summary content, Quick Review prose, and all educational source files remain unchanged.
- The app remains static, offline-friendly, GitHub Pages compatible, and free of runtime AI/Python execution.
- LocalStorage data is sanitized and backward compatible; invalid progress becomes 0%.
- Code/output surfaces keep their existing internal horizontal scrolling.
- No new dependency is permitted.

---

### Task 1: Normalized reading-progress store

**Files:**
- Create: `src/lib/readingProgress.ts`
- Test: `src/lib/readingProgress.test.ts`

**Interfaces:**
- `readReadingProgress(lessonId: string): number`
- `writeReadingProgress(lessonId: string, progress: number): void`
- `clearReadingProgress(lessonId: string): void`
- `calculateReadingProgress(scrollTop: number, maxScrollTop: number): number`

- [x] **Step 1: Write the failing tests** for 0–100 clamping, malformed storage, round-trip persistence, and deterministic scroll-to-percent calculation.
- [x] **Step 2: Run the focused test and confirm RED** with `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run test:run -- src/lib/readingProgress.test.ts`.
- [x] **Step 3: Implement the smallest browser-safe store** with a versioned key, finite-number validation, integer clamping, and no throwing when localStorage is unavailable.
- [x] **Step 4: Run the focused test and confirm GREEN** with the same command.

### Task 2: Pure smart recommendation

**Files:**
- Create: `src/lib/nextLesson.ts`
- Test: `src/lib/nextLesson.test.ts`

**Interfaces:**
- `getNextLessonRecommendation(lessons, completedIds, bookmarkedIds, lastOpenedLessonId, readProgress): NextLessonRecommendation`
- `NextLessonRecommendation.reason` is `'resume' | 'continue' | 'bookmark' | 'start'`.

- [x] **Step 1: Write failing tests** for partial resume, sequence continuation after completion, bookmarked fallback, first incomplete fallback, and all-complete null output.
- [x] **Step 2: Run the focused test and confirm RED** with `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run test:run -- src/lib/nextLesson.test.ts`.
- [x] **Step 3: Implement the deterministic ranking** without accessing browser APIs inside the helper.
- [x] **Step 4: Run the focused test and confirm GREEN** with the same command.

### Task 3: Lesson reading meter

**Files:**
- Create: `src/components/lesson/LessonProgressBar.tsx`
- Modify: `src/views/LessonView.tsx`
- Test: `src/components/lesson/LessonProgressBar.test.tsx`

**Interfaces:**
- `LessonProgressBarProps = { lessonId: string }`

- [x] **Step 1: Write a failing component test** for the accessible progress element and its percentage text.
- [x] **Step 2: Run the focused component test and confirm RED**.
- [x] **Step 3: Implement one rAF-guarded scroll/resize listener** that calculates, renders, and persists the normalized percentage while preserving the existing pixel checkpoint behavior.
- [x] **Step 4: Mount it directly below `LessonHeader`** so it remains part of the lesson reading surface.
- [x] **Step 5: Run LessonView and component tests** and confirm GREEN.

### Task 4: Dashboard integration and mobile styles

**Files:**
- Modify: `src/views/StudyDashboard.tsx`
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`
- Modify: `src/views/StudyDashboard.test.tsx`

- [x] **Step 1: Write failing dashboard tests** for saved percentage rendering, recommendation reason text, bookmark fallback, and sequence continuation.
- [x] **Step 2: Run the focused dashboard/style tests and confirm RED**.
- [x] **Step 3: Replace the first-incomplete-only selection with `getNextLessonRecommendation`** while keeping existing routes and button labels stable.
- [x] **Step 4: Add compact light/dark-aware progress styles** with a one-column mobile layout and no page overflow.
- [x] **Step 5: Run focused dashboard/style tests and confirm GREEN**.

### Task 5: Full verification and publish

- [x] Run fresh `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm ci`.
- [x] Run `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build`, and `git diff --check`.
- [x] Review every changed file and confirm the source/content freeze.
- [ ] Commit as `feat: add progress-aware study recommendations`.
- [ ] Publish to `main` without force push, inspect Actions, and verify the live lesson/dashboard routes.
