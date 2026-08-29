# Modern Learning Workspace UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This project must be executed inline; the user explicitly prohibited subagents.

**Goal:** Rebuild the Python Study Workspace presentation as a distinctive editorial learning workspace with a restrained technical-notebook character while preserving all current content, state, routes, offline behavior, and study features.

**Architecture:** Keep the current React route and persistence architecture, then replace the visual foundation and recompose existing views through focused layout components. Presentation receives existing derived data and callbacks; no educational content or persistence contract moves into UI components.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, custom CSS tokens, Lucide React, Marked, PrismJS, Vitest, Testing Library, GitHub Pages/PWA.

**Spec:** `docs/superpowers/specs/2026-08-29-modern-learning-workspace-ui-design.md`

## Global Constraints

- Preserve lesson prose, Detailed Study, Quick Review, Practice questions, and both root Markdown sources byte-for-byte.
- Preserve current routes, localStorage compatibility, PWA/offline behavior, backup/restore, Full View, notes, bookmarks, completion, reading progress, search, and GitHub Pages base paths.
- Add no runtime AI, Python execution, accounts, cloud storage, remote runtime fonts, or new production dependency.
- Use no mesh gradients, blurred orbs, glassmorphism, translucent floating cards, neon glows, oversized pill controls, decorative sparkles, chatbot imagery, or generic AI-dashboard language.
- Use Python blue as the primary action color and Python yellow only as a restrained teaching/progress accent.
- Maintain 44px touch targets, visible non-glow focus, WCAG AA contrast, reduced-motion support, and no document-level overflow from 320px through 1440px.

---

## File structure

### New files

- `src/components/layout/MobileBottomNav.tsx` — four-item mobile destination and lesson-sheet navigation.
- `src/components/layout/MobileBottomNav.test.tsx` — destination, active-state, search, and lessons-sheet contracts.
- `src/components/shared/ProgressRing.tsx` — reusable accessible SVG course progress indicator.
- `src/components/shared/ProgressRing.test.tsx` — progress normalization and accessible label tests.

### Main modified files

- `src/styles/tokens.css` — editorial/technical light and dark color, type, spacing, border, and layout roles.
- `src/styles/index.css` — shared primitives plus all responsive page/layout styling.
- `src/styles/index.test.ts` — stylesheet invariants for responsive, overflow, reduced motion, and anti-AI exclusions.
- `src/components/layout/AppShell.tsx` — composes sidebar, contextual header, bottom navigation, and overlays.
- `src/components/layout/Header.tsx` — simplified context bar and distinctive typographic brand.
- `src/components/layout/Sidebar.tsx` — module progress, primary destinations, and compact structure.
- `src/components/layout/MobileDrawer.tsx` — accessible lesson sheet content reused from the existing modal behavior.
- `src/components/layout/AppShell.test.tsx` — shell/navigation behavior and accessibility contracts.
- `src/views/StudyDashboard.tsx` and test — editorial hierarchy with one dominant continue action and non-duplicated status.
- `src/views/LessonView.tsx` and test — notes panel state and lesson workspace composition.
- `src/components/lesson/LessonHeader.tsx` and test — document masthead and sticky tab rail.
- `src/components/lesson/LessonNotes.tsx` and test — collapsible panel/sheet surface without persistence changes.
- `src/components/lesson/LessonPagination.tsx` and test — structured study footer.
- `src/components/lesson/DetailedLessonContent.tsx`, `QuickReviewContent.tsx`, `PracticeContent.tsx`, and tests — shared learning-surface hierarchy.
- `src/components/code/CodeBlock.tsx` and test — technical-notebook code frame and accessible copy feedback.
- `src/views/SyntaxReferenceView.tsx`, `NotesView.tsx`, `BookmarksView.tsx`, `SearchModal.tsx`, `BackupModal.tsx`, and tests — secondary-page visual consistency without behavior changes.

---

### Task 1: Editorial design foundation and accessible progress primitive

**Files:**
- Create: `src/components/shared/ProgressRing.tsx`
- Create: `src/components/shared/ProgressRing.test.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`

**Interfaces:**
- Consumes: numeric progress values already derived by views.
- Produces: `ProgressRing({ value, label, size? }: { value: number; label: string; size?: number })` and shared classes/tokens used by every later task.

- [ ] **Step 1: Write failing foundation tests**

```tsx
render(<ProgressRing value={140} label="Course progress" />);
expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
expect(screen.getByText('100%')).toBeInTheDocument();
```

Add stylesheet assertions for `--accent-python`, `--accent-learning`, `--line-strong`, `--surface-paper`, `@media (prefers-reduced-motion: reduce)`, `overflow-x: clip`, and the absence of `backdrop-filter`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:run -- src/components/shared/ProgressRing.test.tsx src/styles/index.test.ts`

Expected: FAIL because the component and new design roles do not exist.

- [ ] **Step 3: Implement the minimal foundation**

Create an SVG ring that clamps values to `0..100`, sets `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`, and renders a readable percentage. Replace the current palette and sizing roles with paper/ink/navy/slate surfaces, Python blue primary action, limited yellow accent, restrained radii, visible borders, and shallow shadow. Establish reusable classes for buttons, icon buttons, rules, page headings, editorial surfaces, status rows, and motion.

- [ ] **Step 4: Run focused and full foundation tests**

Run: `npm run test:run -- src/components/shared/ProgressRing.test.tsx src/styles/index.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/ProgressRing.tsx src/components/shared/ProgressRing.test.tsx src/styles/tokens.css src/styles/index.css src/styles/index.test.ts
git commit -m "feat: establish editorial learning design system"
```

### Task 2: Workspace shell, desktop navigation, and mobile bottom navigation

**Files:**
- Create: `src/components/layout/MobileBottomNav.tsx`
- Create: `src/components/layout/MobileBottomNav.test.tsx`
- Modify: `src/components/layout/AppShell.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/layout/MobileDrawer.tsx`
- Modify: `src/components/layout/AppShell.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: `currentPath`, `state`, lesson lists, `onNavigate`, `onOpenSearch`, and existing mobile drawer callbacks.
- Produces: `MobileBottomNav` with Study, Lessons, Search, and Notes controls; the Lessons control invokes `onOpenLessons` and exposes `aria-expanded`/`aria-controls`.

- [ ] **Step 1: Write failing navigation tests**

```tsx
render(<MobileBottomNav currentPath="/notes" isLessonsOpen={false} onNavigate={navigate} onOpenLessons={openLessons} onOpenSearch={openSearch} />);
expect(screen.getByRole('button', { name: 'Notes' })).toHaveAttribute('aria-current', 'page');
await user.click(screen.getByRole('button', { name: 'Lessons' }));
expect(openLessons).toHaveBeenCalledTimes(1);
```

Extend `AppShell.test.tsx` to assert a navigation landmark named `Mobile navigation`, the typographic `Python Study` brand, active destinations, lesson sheet handoff, and Full View removal of all global chrome.

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm run test:run -- src/components/layout/MobileBottomNav.test.tsx src/components/layout/AppShell.test.tsx`

Expected: FAIL because the new navigation is absent and the old header/brand contracts remain.

- [ ] **Step 3: Implement the shell composition**

Add the bottom navigation and wire it to existing drawer/search state. Recompose the sidebar into brand, primary destinations, module lesson groups, and module progress rules. Simplify the header to page context, search, course fraction, theme, and backup. Keep `Ctrl/Cmd+K`, focus restoration, overlay exclusivity, body-scroll locking, active lesson reveal, safe-area handling, and current route callbacks unchanged.

- [ ] **Step 4: Run shell tests**

Run: `npm run test:run -- src/components/layout/MobileBottomNav.test.tsx src/components/layout/AppShell.test.tsx src/components/search/SearchModal.test.tsx src/components/backup/BackupModal.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout src/styles/index.css
git commit -m "feat: rebuild workspace navigation shell"
```

### Task 3: Recompose the dashboard hierarchy

**Files:**
- Modify: `src/views/StudyDashboard.tsx`
- Modify: `src/views/StudyDashboard.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: unchanged lesson/state/activity props and existing `getDashboardInsights`, `getNextLessonRecommendation`, reading-progress, and activity helpers.
- Produces: one dominant `Continue learning` region, one `Today's focus` strip, one `Course status` definition list, and study trail/module sections without duplicated course percentages.

- [ ] **Step 1: Write failing dashboard hierarchy tests**

```tsx
expect(screen.getByRole('heading', { name: 'Continue learning' })).toBeInTheDocument();
expect(screen.getByRole('region', { name: 'Course status' })).toBeInTheDocument();
expect(screen.getAllByText(/%/)).toHaveLength(2); // ring plus saved reading progress only
expect(screen.getByRole('list', { name: 'Study trail' })).toBeInTheDocument();
```

Keep all existing navigation, empty-state, progress normalization, bookmark, attention, and streak assertions.

- [ ] **Step 2: Run dashboard tests and confirm failure**

Run: `npm run test:run -- src/views/StudyDashboard.test.tsx`

Expected: FAIL on the new regions and hierarchy.

- [ ] **Step 3: Implement the editorial dashboard**

Use `ProgressRing` in the continue panel, merge duplicate overview/progress metrics into a compact status row, render focus as a ruled strip, and convert recent/attention/bookmark content to semantic list rows. Keep every existing callback and insight source. Use section dividers and spacing rather than wrapping each item in a floating card.

- [ ] **Step 4: Run dashboard tests**

Run: `npm run test:run -- src/views/StudyDashboard.test.tsx src/lib/dashboardInsights.test.ts src/lib/nextLesson.test.ts src/lib/studyActivity.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/StudyDashboard.tsx src/views/StudyDashboard.test.tsx src/styles/index.css
git commit -m "feat: recompose study dashboard hierarchy"
```

### Task 4: Redesign lesson masthead, modes, notes, code, and footer

**Files:**
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/LessonView.test.tsx`
- Modify: `src/components/lesson/LessonHeader.tsx`
- Modify: `src/components/lesson/LessonHeader.test.tsx`
- Modify: `src/components/lesson/LessonNotes.tsx`
- Modify: `src/components/lesson/LessonNotes.test.tsx`
- Modify: `src/components/lesson/LessonPagination.tsx`
- Modify: `src/components/lesson/LessonPagination.test.tsx`
- Modify: `src/components/lesson/DetailedLessonContent.tsx`
- Modify: `src/components/lesson/QuickReviewContent.tsx`
- Modify: `src/components/lesson/PracticeContent.tsx`
- Modify: `src/components/code/CodeBlock.tsx`
- Modify: `src/components/code/CodeBlock.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: unchanged lesson/state/callback contracts.
- Produces: document masthead, sticky tab rail, `LessonNotes` disclosure surface, technical-notebook code region, attached semantic result styling, and structured previous/next footer.

- [ ] **Step 1: Write failing lesson presentation tests**

```tsx
expect(screen.getByRole('banner', { name: 'Lesson overview' })).toBeInTheDocument();
expect(screen.getByRole('tablist', { name: 'Study mode' })).toHaveClass('lesson-mode-rail');
expect(screen.getByRole('button', { name: 'Open lesson notes' })).toHaveAttribute('aria-expanded', 'false');
expect(screen.getByRole('region', { name: 'Python code example' })).toHaveAttribute('data-copy-state', 'idle');
```

Add a test that opens notes, edits, blurs, and confirms the existing debounced/flush save fires once. Preserve all current mode, completion, bookmark, Practice availability, reading position, TOC, syntax-link, and Full View tests.

- [ ] **Step 2: Run focused lesson tests and confirm failure**

Run: `npm run test:run -- src/components/lesson/LessonHeader.test.tsx src/components/lesson/LessonNotes.test.tsx src/components/code/CodeBlock.test.tsx src/views/LessonView.test.tsx`

Expected: FAIL on new accessible structure while current behavior tests describe what must remain.

- [ ] **Step 3: Implement the lesson workspace**

Recompose `LessonHeader` into a semantic masthead and tab rail. Add controlled disclosure presentation to `LessonNotes` while keeping its current save timing and prop contract. Group code headers, source, copy state, and adjacent output/error surfaces through consistent notebook classes. Restyle Detailed, Quick Review, and Practice blocks through the same learning grammar. Rebuild pagination as a document footer. Keep Full View, reading position, TOC, modes, state writes, and content strings unchanged.

- [ ] **Step 4: Run all lesson tests**

Run: `npm run test:run -- src/views/LessonView.test.tsx src/components/lesson src/components/code/CodeBlock.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/LessonView.tsx src/views/LessonView.test.tsx src/components/lesson src/components/code src/styles/index.css
git commit -m "feat: redesign the lesson reading workspace"
```

### Task 5: Unify reference, notes, bookmarks, search, backup, and feedback surfaces

**Files:**
- Modify: `src/views/SyntaxReferenceView.tsx`
- Modify: `src/views/SyntaxReferenceView.test.tsx`
- Modify: `src/views/NotesView.tsx`
- Modify: `src/views/NotesView.test.tsx`
- Modify: `src/views/BookmarksView.tsx`
- Modify: `src/views/BookmarksView.test.tsx`
- Modify: `src/components/search/SearchModal.tsx`
- Modify: `src/components/search/SearchModal.test.tsx`
- Modify: `src/components/backup/BackupModal.tsx`
- Modify: `src/components/layout/OfflineStatus.tsx`
- Modify: `src/components/shared/EmptyState.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: all current props, state callbacks, keyboard behavior, filters, and parsed content.
- Produces: consistent page mastheads, ruled result rows, notebook entries, modal/sheet surfaces, and contextual empty/offline feedback.

- [ ] **Step 1: Add failing shared-hierarchy assertions**

```tsx
expect(screen.getByRole('heading', { level: 1, name: 'Syntax reference' })).toHaveClass('page-masthead__title');
expect(screen.getByRole('search')).toHaveClass('workspace-search');
expect(screen.getByRole('tablist', { name: 'Bookmark type' })).toHaveClass('section-tabs');
```

Retain the existing keyboard selection, filters, anchoring, bookmark pressed state, autosave/delete confirmation, mixed-direction wrapping, overlay focus trap, and no-results assertions.

- [ ] **Step 2: Run secondary-page tests and confirm failure**

Run: `npm run test:run -- src/views/SyntaxReferenceView.test.tsx src/views/NotesView.test.tsx src/views/BookmarksView.test.tsx src/components/search/SearchModal.test.tsx src/components/backup/BackupModal.test.tsx`

Expected: FAIL on the new shared classes/landmarks only.

- [ ] **Step 3: Implement visual consistency**

Apply one page masthead pattern, structured filters, ruled lists, compact tabs, technical reference entries, clear destructive actions, and consistent dialog headers/footers. Do not alter content parsing, sorting, filter algorithms, bookmark state, note deletion, backup validation, or keyboard behavior.

- [ ] **Step 4: Run focused and regression tests**

Run: `npm run test:run -- src/views src/components/search src/components/backup src/components/layout/OfflineStatus.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views src/components/search src/components/backup src/components/layout/OfflineStatus.tsx src/components/shared/EmptyState.tsx src/styles/index.css
git commit -m "feat: unify supporting study surfaces"
```

### Task 6: Responsive, theme, accessibility, visual, and deployment verification

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`
- Modify: `README.md` only if user-facing navigation descriptions changed.

**Interfaces:**
- Consumes: all completed UI tasks.
- Produces: verified production-ready responsive workspace with no behavior regressions.

- [ ] **Step 1: Add final CSS contract tests**

Assert explicit media rules for `430px`, `768px`, and `1024px`, mobile bottom safe-area padding, Full View chrome removal, internal scrolling for `pre`/tables, `prefers-reduced-motion`, dark/light token presence, and no `backdrop-filter` or document-level horizontal scroll.

- [ ] **Step 2: Run the complete automated pipeline**

Run in order:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run practice:test
npm run build
```

Expected: all commands exit `0`.

- [ ] **Step 3: Run local production preview and visual QA**

Run: `npm run preview -- --host 0.0.0.0`

Inspect dark and light themes at 320, 375, 430, 768, 1024, 1280, and 1440 widths for Dashboard, Lesson 020, Lesson 026 fallback, Quick Review, Practice 020, Full View, Syntax Reference, Notes, Bookmarks, Search, Backup, and offline notice. Confirm no global overflow, no covered controls, correct safe areas, readable code/output, one dominant dashboard action, and original text/data behavior.

- [ ] **Step 4: Fix only verified defects and rerun affected plus full checks**

For each defect, first add or strengthen the closest test, reproduce the failure, apply the smallest fix, rerun the focused test, then rerun the complete pipeline from Step 2.

- [ ] **Step 5: Commit and publish**

```bash
git add src README.md
git commit -m "fix: complete responsive workspace polish"
git push origin main
```

Verify the GitHub Pages workflow completes and the deployed hash routes render under `/python-study-workspace/`.
