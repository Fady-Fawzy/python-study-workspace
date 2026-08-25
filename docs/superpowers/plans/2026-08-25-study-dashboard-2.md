# Study Dashboard 2.0 Implementation Plan

> **For agentic workers:** Execute this plan inline in the current worktree without subagents. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing dashboard into a calm, mobile-first study hub with an explicit session focus, progress-aware recent lessons, and a concise needs-attention queue.

**Architecture:** Keep the dashboard view responsible for presentation only. Add a pure `dashboardInsights.ts` selector that combines the existing `StudyStateV1`, smart-next recommendation, and sanitized reading-progress map into small display items. Extend the existing reading-progress store with a read-only map accessor; do not change the persisted study-state schema or any lesson content.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS custom properties, localStorage.

**Spec:** Approved in chat on 2026-08-25: Dashboard 2.0 with session focus, recent lessons, smart suggestions, needs-attention items, existing activity streak, and mobile-first layout.

## Global Constraints

- Summary, Quick Review, Practice, and all educational lesson content remain unchanged.
- Lessons 026–074 keep their current behavior; dashboard changes consume existing lesson metadata only.
- The app remains static, offline-friendly, GitHub Pages compatible, and free of runtime AI/Python execution.
- Reading progress is sanitized and read-only selectors never throw when localStorage is malformed or unavailable.
- Keep existing routes, navigation labels, accessible button names, and backup/state compatibility stable.
- No new dependency; no page-level horizontal overflow at narrow mobile widths.

---

### Task 1: Expose the normalized reading-progress snapshot

**Files:**
- Modify: `src/lib/readingProgress.ts`
- Test: `src/lib/readingProgress.test.ts`

**Interfaces:**
- Add `readAllReadingProgress(): Record<string, number>` returning a sanitized copy of the versioned localStorage map.

- [x] **Step 1: Write the failing test** asserting that a mixed/invalid stored map returns only finite, rounded, clamped values and does not expose mutable internal state.
- [x] **Step 2: Run the focused test and confirm RED** with `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run test:run -- src/lib/readingProgress.test.ts`.
- [x] **Step 3: Implement the smallest exported snapshot accessor** by reusing the existing parser and returning a shallow copy.
- [x] **Step 4: Run the focused test and confirm GREEN** with the same command.

### Task 2: Derive dashboard insights in a pure selector

**Files:**
- Create: `src/lib/dashboardInsights.ts`
- Test: `src/lib/dashboardInsights.test.ts`

**Interfaces:**
- `DashboardInsightItem = { lesson: Lesson; progress: number; completed: boolean; reason: 'focus' | 'recent' | 'partial' | 'bookmark' }`
- `DashboardInsights = { focus: DashboardInsightItem | null; queue: DashboardInsightItem[]; attention: DashboardInsightItem[] }`
- `getDashboardInsights(lessons, completedIds, bookmarkedIds, recentIds, recommendation, progressMap): DashboardInsights`

- [x] **Step 1: Write failing tests** for focus selection, recent queue ordering/deduplication, partial-progress attention items, bookmark attention fallback, all-complete focus, and a bounded three-item output.
- [x] **Step 2: Run the focused test and confirm RED** with `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run test:run -- src/lib/dashboardInsights.test.ts`.
- [x] **Step 3: Implement the deterministic selector** with lesson-ID filtering, progress clamping, no duplicate lesson in a section, and no browser/storage access.
- [x] **Step 4: Run the focused test and confirm GREEN** with the same command.

### Task 3: Add the Dashboard 2.0 surfaces

**Files:**
- Modify: `src/views/StudyDashboard.tsx`
- Modify: `src/views/StudyDashboard.test.tsx`

**Interfaces:**
- Reuse the selector output; keep `StudyDashboardProps` unchanged.

- [x] **Step 1: Write failing component tests** for the “Today’s focus” label and action, percentage-aware recent rows, and “Needs attention” rows that navigate to their lessons.
- [x] **Step 2: Run the focused dashboard tests and confirm RED** with `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run test:run -- src/views/StudyDashboard.test.tsx`.
- [x] **Step 3: Integrate `readAllReadingProgress()` and `getDashboardInsights()`** without changing existing Continue, Course Progress, Study Overview, bookmarks, topics, or button routes.
- [x] **Step 4: Render compact semantic sections**: one session-focus card/label, progress-aware recent rows, and an attention card with a clear empty state.
- [x] **Step 5: Run focused dashboard tests and confirm GREEN**.

### Task 4: Mobile-first visual system for the new surfaces

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`

- [x] **Step 1: Write failing style assertions** for the new classes, theme-token usage, internal wrapping, and the one-column narrow breakpoint.
- [x] **Step 2: Run the focused style test and confirm RED**.
- [x] **Step 3: Add compact light/dark-aware styles** using existing variables, minimum touch targets, readable progress tracks, and a single-column mobile layout.
- [x] **Step 4: Run focused style tests and confirm GREEN**.

### Task 5: Full verification and publish

- [x] Run fresh `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm ci`.
- [x] Run fresh typecheck, lint, all tests, production build, and `git diff --check` (the direct local binaries produced the same configured checks after `npm ci`).
- [x] Review every changed file and confirm content/Quick Review/Practice files are untouched.
- [ ] Commit as `feat: upgrade study dashboard focus and queues`.
- [ ] Publish to `main` without force push, inspect Actions, and verify dashboard plus representative lesson routes at mobile widths.
