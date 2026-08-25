# UI/UX & Mobile Polish Implementation Plan

> **Recovery contract:** Resume from the first unchecked task, inspect the latest commit and ledger entry, then run that task's focused verification before changing code. Use a fresh implementer agent followed by an independent spec/code-quality reviewer for every task. Record fixes, re-review, verification, and commit SHA before advancing.

**Goal:** Turn the existing static Python study application into a calm, modern, mobile-first study workspace while preserving all approved educational content and existing persistence/navigation behavior.

**Source of truth:** `origin/main` at `f3386d385e364c805144027f1902d1eaae46084d` was audited on 2026-08-25. No newer remote commits or pre-existing `codex/ui-ux-mobile-polish` branch existed.

**Branch/worktree:** `codex/ui-ux-mobile-polish` in `/workspace/scratch/813889999c1a/python-study-workspace-uiux`, created from `origin/main`.

**Architecture:** Keep React 19, TypeScript, Vite, existing state/content parsers, Lucide, CSS tokens, and static GitHub Pages deployment. Improve the current components and move only reusable/responsive styling into the existing CSS system. Do not introduce a UI framework, backend, Python runtime, AI runtime, or unnecessary network dependency.

**Quality workflow:** Behavior changes begin with focused failing tests where practical. Bugs are reduced to a reproducible failing test before correction. Each task follows implement → spec/code review → fix → re-review → verify → commit → ledger update. Final work includes a broad whole-branch review, clean install, all quality gates, content-freeze diff checks, responsive/theme QA, CI/Pages verification, and live-site verification.

## Non-negotiable constraints

- Do not change `elzero_python_lessons_20_to_74.md`, `python_syntax_reference_elzero_20_74.md`, or `src/content/detailed/**`.
- Do not rewrite Summary or Quick Review educational content; presentation-only changes are allowed.
- Preserve notes/autosave, completion, bookmarks, recents, preferred lesson mode, theme persistence, Ctrl/Cmd+K search, backup/restore, hash routing, syntax highlighting, copy, TOC, and previous/next navigation.
- At 320px, the document must not scroll horizontally. Code/table surfaces may scroll internally. Fix sizing with `min-width: 0`, wrapping, logical properties, and constrained internal overflow—never blanket root `overflow-x: hidden`.
- Important mobile controls target approximately 44×44 CSS px.
- Arabic remains RTL/auto; Python/code/identifiers remain isolated LTR.
- Support safe-area insets on fixed/sticky mobile surfaces and respect reduced motion.
- Validate both light and dark themes at 320, 375, 430, 768, 1024, and 1440 widths on representative routes.

## Baseline observations

- The project is already feature-complete and has no need for a rebuild.
- Most presentation is component-local inline styling; responsive reuse is limited.
- Root layout currently masks overflow using `overflow-x: hidden` on `html`, `body`, `#root`, and shell wrappers.
- Several high-frequency controls are 34–40px, below the intended mobile touch area.
- Drawer, TOC sheet, search, and backup overlays need stronger dialog/focus/body-lock semantics.
- Existing tests focus on parsers/storage/search and only lightly cover interactive components.
- Production browser inspection was attempted, but the cloud browser denied access to the GitHub Pages URL; final verification must record either successful browser evidence or the exact environment blocker without inventing results.

---

### Task 1: Baseline, content-freeze guardrails, and responsive foundations

**Files:** `src/styles/tokens.css`, `src/styles/index.css`, focused test/helper files if needed.

- [x] Record clean baseline results for `npm ci`, typecheck, lint, tests, and build.
- [x] Record content-freeze hashes/diffs for the two root Markdown sources and `src/content/detailed/**`.
- [x] Add/refine spacing, typography, touch-target, safe-area, focus, surface, and breakpoint tokens.
- [x] Remove blanket root overflow masking and establish real `min-width: 0`/max-width/internal-scroll protections.
- [x] Add reusable primitives for icon buttons, page headers, toolbars, cards/rows, dialogs, and responsive stacks without over-refactoring.
- [x] Verify global bidi, focus-visible, reduced motion, code/table internal overflow, and both theme palettes.

### Task 2: App shell, header, sidebar, and mobile drawer

**Files:** `src/components/layout/*`, `src/components/shared/ThemeToggle.tsx`, related CSS/tests.

- [x] Add failing interaction tests for drawer open/close, Escape, backdrop, focus return/trap, active navigation, and selection close.
- [x] Make the mobile header prioritize menu, compact brand/context, search, and essential actions with 44px targets.
- [x] Keep desktop header efficient and move secondary mobile actions into the existing drawer.
- [x] Improve sidebar density, scrolling, category/lesson hierarchy, active/completed/bookmarked/focus states.
- [x] Upgrade the existing mobile drawer with dialog semantics, labelled structure, focus management, body scroll lock, safe areas, active states, and 44px rows.
- [x] Re-run focused tests and responsive contract checks.

### Task 3: Study dashboard and discovery flow

**Files:** `src/views/StudyDashboard.tsx`, related CSS/tests.

- [x] Add focused tests for resume target, empty/recent/bookmarked states, and progress semantics.
- [x] Make Continue Studying the immediate primary action and keep progress compact and meaningful.
- [x] Make recent lessons and bookmarks easy to resume on small screens.
- [x] Improve topic discovery with readable, non-cramped rows/cards and 44px lesson targets.
- [x] Verify long titles, empty states, 320px layout contracts, and theme-token use; browser evidence remains in Task 9.

### Task 4: Lesson header, mode switch, and core reading surfaces

**Files:** `src/views/LessonView.tsx`, `src/components/lesson/LessonHeader.tsx`, `LessonContent.tsx`, `DetailedLessonContent.tsx`, `QuickReviewContent.tsx`, `src/components/code/CodeBlock.tsx`, related CSS/tests.

- [x] Add failing behavior tests for preferred mode, bookmark/completion actions, copy feedback, result labels, and relevant bidi/accessibility contracts.
- [x] Compress lesson-header hierarchy on phones without obscuring lesson/category/title/actions.
- [x] Make Detailed Study / Quick Review a clear, accessible, 320px-safe tab-like switch while preserving stored preference.
- [x] Improve long-form measure, rhythm, headings, lists, callouts, tables, inline identifiers, and Quick Review presentation without changing educational content.
- [x] Make code/result blocks LTR, touch-scrollable, internally constrained, labelled, and copy-friendly with a 44px action.
- [x] Verify representative long code, tables, Arabic/English/Python combinations, and all result semantics with focused DOM tests; viewport evidence remains in Task 9.

### Task 5: Desktop/mobile TOC, notes, and lesson pagination

**Files:** `src/components/lesson/TableOfContents.tsx`, `LessonNotes.tsx`, `LessonPagination.tsx`, `LessonView.tsx`, related CSS/tests.

- [x] Add failing tests for TOC open/close, active item, selection scroll/close, Escape/focus return, and mixed-direction labels.
- [x] Preserve the useful sticky desktop TOC and improve scan/focus/active states.
- [x] Turn the existing mobile TOC into an accessible safe-area-aware contents sheet with correct closing behavior.
- [x] Improve notes focus, comfortable height, autosave feedback semantics, mobile stability, timeout cleanup, and restored-note synchronization.
- [x] Make completion and previous/next navigation clear, title-aware, 44px+, and vertically stackable at narrow widths.

### Task 6: Syntax Reference

**Files:** `src/views/SyntaxReferenceView.tsx`, related CSS/tests.

- [x] Add focused tests for category/search filtering, section anchoring, bookmark behavior, and empty results.
- [x] Improve header, sticky/scannable filter controls, category navigation, section hierarchy, code presentation, and mobile wrapping.
- [x] Preserve every syntax section and its meaning byte-for-byte in the frozen source.
- [x] Verify long categories/titles, mixed-direction content, internal code/table overflow, and theme-token use.

### Task 7: Bookmarks and Notes views

**Files:** `src/views/BookmarksView.tsx`, `src/views/NotesView.tsx`, `src/components/shared/EmptyState.tsx`, related CSS/tests.

- [x] Add focused tests for tabs/filtering, navigation, remove/delete actions, empty states, long content, and tab keyboard behavior.
- [x] Replace non-semantic clickable containers with buttons/links where appropriate.
- [x] Improve compact mobile rows/cards, wrapping, action grouping, empty states, and return-to-study paths.
- [x] Preserve destructive confirmations and persisted state behavior.

### Task 8: Search, backup/restore, and overlay accessibility

**Files:** `src/components/search/SearchModal.tsx`, `src/components/backup/BackupModal.tsx`, `src/components/layout/AppShell.tsx`, related CSS/tests.

- [x] Add failing interaction tests for Ctrl/Cmd+K, input focus, Escape, selection, result scrolling, dialog labelling, focus return/trap, and body lock.
- [x] Make search comfortable with mobile software keyboards/dynamic viewport height, 44px result targets, long-title wrapping, and an obvious close action.
- [x] Make backup/restore responsive, session-safe, sanitized, and accessible while preserving import/export semantics.
- [x] Consolidate reusable overlay behavior where it materially reduces bugs and keep overlays mutually exclusive.

### Task 9: Accessibility, bidi, responsive regression, and whole-branch review

**Files:** scoped fixes and tests only.

- [x] Run an independent whole-branch spec/code-quality review.
- [x] Audit semantics, labels, heading order, focus-visible, keyboard operation, contrast, reduced motion, touch targets, safe areas, and body-lock cleanup.
- [x] Attempt document `scrollWidth` vs `clientWidth` audit at 320, 375, 430, 768, 1024, and 1440; exact browser geometry remained environment-blocked (cloud Pages access denied and no local browser executable), so responsive contracts were covered by focused DOM/CSS review and tests instead.
- [x] Attempt representative dark/light route audit; exact interactive browser evidence remained environment-blocked, with theme-token/contrast behavior covered by static review and regression tests.
- [x] Re-review fixes and record code/static evidence plus browser limitations.

### Task 10: Final verification, publish, CI/Pages, and production QA

**Files:** only verified release fixes; ledger updates.

- [x] Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build`, and `git diff --check`.
- [x] Review complete `origin/main...HEAD` diff and confirm no unrelated changes.
- [x] Confirm frozen-content diffs are empty and Summary/Quick Review educational content is unchanged.
- [x] Push `codex/ui-ux-mobile-polish` without force, inspect remote branch/CI, and fix reproducible failures.
- [x] Integrate into latest `main` without history rewrite, push, inspect GitHub Actions and Pages deployment.
- [x] Verify the deployed live endpoint and asset hashes; exact interactive route/theme/viewport evidence remained environment-blocked and is recorded above.
- [x] Mark every ledger task complete with final commit SHAs and verification results.

---

## Execution ledger

| Task | Status | Implementer | Review | Commit | Verification / recovery note |
|---|---|---|---|---|---|
| 1. Foundations | Complete | `task1_foundations_impl` | Approved after fix by `task1_foundations_review` | `1fa3226`, `810527a` | Baseline: `npm ci`, typecheck, lint, 68/68 tests, build pass; frozen aggregate SHA-256 `39fe2f2456499285b3fa2e81485f92073a942d8f7f5c91ff33a8565c895544f0`; content diffs empty; only existing Vite chunk warning. |
| 2. Shell/navigation | Complete | `task2_shell_nav_impl` | Approved after fix by `task2_shell_nav_review` | `4e0300e`, `e3d7253` | TDD red 4/4 → focused 5/5; full 73/73; typecheck/lint/build/diff-check pass. Active late lessons auto-expand/scroll into view; focus trap/return and mobile backup transition covered. |
| 3. Dashboard | Complete | `task3_dashboard_impl` | Approved by `task3_dashboard_review` | `6112b01` | TDD red 6/6 → focused 6/6; full 79/79; typecheck/lint/build/diff-check pass. Browser viewport evidence deferred to Task 9 because local/cloud access was blocked. |
| 4. Lesson core | Complete | `task4_lesson_core_impl` | Approved by `task4_lesson_core_review` | `e9f055c` | TDD focused red → 9/9; full 86/86; typecheck/lint/build/diff-check pass. Frozen/Quick Review educational content unchanged; browser geometry deferred to Task 9. |
| 5. TOC/notes/pagination | Complete | `task5_toc_notes_pagination_impl` | Approved after fix by `task5_toc_notes_pagination_review` | `bedc9f6`, `d1cc9ce` | TDD red 10/12 → focused green (17 reviewer assertions); full 101/101; direct typecheck/lint/Vite build/diff-check pass. Restored-note race, comprehensive TOC bidi isolation, and reduced-motion scroll fixed. |
| 6. Syntax Reference | Complete | `task6_syntax_reference_impl` | Approved by `task6_syntax_reference_review` | `fddabdf` | TDD red 5/5 → focused green; full 106/106; typecheck/lint/build/diff-check pass. All syntax content frozen and section rendering preserved. |
| 7. Bookmarks/Notes views | Complete | `task7_saved_views_impl` | Approved after fix by `task7_saved_views_review` | `2fea194`, `0473708` | TDD red 12/12 → focused 14/14; full 120/120; typecheck/lint/build/diff-check pass. Valid mobile search labelling, 16px input, and tab keyboard coverage added. |
| 8. Search/backup overlays | Complete | `task8_search_backup_impl` | Approved after fix by `task8_search_backup_review` | `b2e77e4`, `fe513a1` | TDD red 14 failures → focused reviewer 46/46; full 150/150; typecheck/lint/build/diff-check pass. Backup arrays rejected without overwrite; overlay/session races and ARIA structure fixed. |
| 9. Whole-branch QA | Complete with recorded browser limitation | `task9_branch_fixes_impl` | Approved after fix by `task9_whole_branch_review` | `7b31d26` | Review found 7 issues; all fixed/re-reviewed. Focused 34/34; full 155/155; typecheck/lint/build/diff-check pass. Exact viewport/theme/scrollWidth evidence blocked: cloud Pages access denied and no local browser executable. |
| 10. Publish/production | Complete | Primary session | CI and Pages green | feature `7b646e7`; main `9cf0e3a`; PR #1 | Feature pushed without force; CI run 1 passed; squash merged to `main`; Pages run 5 passed; live JS/CSS asset hashes and HTTP 200 responses match the production build. |

## Final evidence checklist

- [x] `git diff origin/main -- elzero_python_lessons_20_to_74.md`
- [x] `git diff origin/main -- python_syntax_reference_elzero_20_74.md`
- [x] `git diff origin/main -- src/content/detailed`
- [x] Summary source unchanged
- [x] Quick Review educational source/meaning unchanged
- [x] `npm ci`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test:run`
- [x] `npm run build`
- [x] `git diff --check`
- [x] responsive/theme code and test evidence; exact browser viewport evidence blocker recorded
- [x] feature branch pushed
- [x] `main` integrated/pushed
- [x] CI green
- [x] Pages green
- [x] live endpoint and production assets verified
