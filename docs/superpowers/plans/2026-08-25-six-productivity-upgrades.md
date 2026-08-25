# Six Productivity Upgrades — Implementation Plan

> Execute in this worktree without subagents. Every behavior change follows red test → smallest implementation → focused verification → full verification.

**Goal:** Ship six small, maintainable improvements to the existing static study workspace while preserving lesson content and Practice Mode.

**Architecture:** Reuse React components, existing CSS tokens, `StudyStateV1`, `SearchModal`, and the current service worker. Add only two small local modules (`studyActivity` and theme metadata helper) plus an optional command prop and an offline status component.

## Task 1 — Dashboard activity and streak

Files: create `src/lib/studyActivity.ts`, test it, update `LessonView.tsx`, `StudyDashboard.tsx`, dashboard CSS/tests.

1. Add failing tests for deduplicated day recording, seven-day activity, current streak, malformed storage recovery, and dashboard rendering.
2. Run focused tests and confirm the expected failures.
3. Implement a versioned, browser-safe activity store and record activity only when a lesson opens.
4. Render compact activity metrics without changing existing progress/summary cards.
5. Run activity/dashboard tests.

## Task 2 — Search & command palette

Files: update `SearchModal.tsx`, `AppShell.tsx`, `Header.tsx`, search modal tests and styles.

1. Add failing tests for empty-query commands, command activation, and command filtering.
2. Implement optional `commands` props and route/theme/backup actions from `AppShell`.
3. Keep search result keyboard selection and labels stable.
4. Run focused modal/shell tests.

## Task 3 — Keyboard accessibility

Files: update `AppShell.tsx`, `src/styles/index.css`, shell tests.

1. Add failing tests for skip link, main landmark focus, and shortcut metadata.
2. Implement skip link and route-focus behavior without stealing focus from dialogs.
3. Add `aria-keyshortcuts` and theme-aware focus styling where missing.
4. Run shell/accessibility tests.

## Task 4 — Offline/PWA polish

Files: update `public/sw.js`, `src/lib/pwa.ts`, create `OfflineStatus.tsx` and test, wire into `AppShell`/CSS.

1. Add failing tests for offline/online status and worker update message contract.
2. Bump cache version and handle `SKIP_WAITING`; preserve network-first navigation.
3. Render a small offline status only while offline, with live-region semantics.
4. Run PWA/status tests.

## Task 5 — Light-theme polish

Files: create/test `src/lib/theme.ts`, update `App.tsx`, `index.html`, `tokens.css`, `index.css`.

1. Add failing tests for theme-color metadata selection and system fallback.
2. Implement centralized theme application and update browser chrome metadata.
3. Add selection and high-contrast light-theme token refinements using existing variables.
4. Run theme/style tests.

## Task 6 — Search inside explanations

Files: update `src/lib/searchIndex.ts`, `detailedContent.ts` only if needed, search tests.

1. Add failing tests for structured explanation/output indexing and multi-term matching.
2. Build a normalized searchable document from enriched lesson blocks and metadata.
3. Preserve current ranking/URLs and verify syntax/lesson regression tests.
4. Run focused search tests.

## Final verification and release

1. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build`, and `git diff --check`.
2. Review `git diff --stat` and every changed file; confirm Practice/Summary/content sources are untouched.
3. Commit as `feat: add six study workspace productivity upgrades`.
4. Push to `main` without force-pushing, inspect CI/Pages, and report live verification or any external browser blocker with evidence.
