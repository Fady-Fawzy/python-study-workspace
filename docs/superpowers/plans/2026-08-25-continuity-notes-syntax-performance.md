# Study continuity, notes, syntax links, and performance Implementation Plan

> **For agentic workers:** Execute this plan inline in the current worktree. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve resume flow, personal note management, syntax navigation, and mobile/performance behavior without changing educational content or Practice.

**Architecture:** Extend the existing local `StudyStateV1` with an optional sanitized note-timestamp map, add a focused syntax-link component, and load non-dashboard route views lazily. Reuse the existing reading-position store, hash router, design tokens, and CSS breakpoints.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS custom properties, localStorage.

**Spec:** `docs/superpowers/specs/2026-08-25-continuity-notes-syntax-performance-design.md`

## Global Constraints

- Practice, Summary content, Quick Review prose, and lesson source Markdown remain unchanged.
- The app remains static, GitHub Pages compatible, offline-friendly, and free of runtime AI/Python execution.
- Existing localStorage and backup data must continue loading safely.
- Code and syntax identifiers remain LTR; surrounding UI stays English and mobile-first.
- No new dependency is permitted unless the current implementation cannot satisfy the requirement.

---

### Task 1: Resume metadata and Continue Studying cue

**Files:**
- Modify: `src/types/state.ts`
- Modify: `src/lib/storage.ts`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/StudyDashboard.tsx`
- Test: `src/views/StudyDashboard.test.tsx`
- Test: `src/views/LessonView.test.tsx`

**Interfaces:**
- Add optional `lessonNoteUpdatedAt?: Record<string, string>` in Task 2 only; this task must not depend on it.
- Reuse `readReadingPosition(lessonId)` from `src/lib/readingPosition.ts`.

- [ ] **Step 1: Write the failing dashboard test**

Add a test state with `lastOpenedLessonId: '074'` and mock `readReadingPosition` to return a positive value. Assert the resume card contains “Resume Lesson”, “Saved reading position”, and the correct lesson title. Add a no-last-lesson case asserting “Start Lesson”.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm run test:run -- src/views/StudyDashboard.test.tsx`

Expected: FAIL because the current card always renders “Open Lesson” and has no saved-position cue.

- [ ] **Step 3: Implement the smallest resume cue**

Read the last lesson’s reading position, choose `Resume Lesson` only for a valid persisted last lesson, and render a short status line without changing the navigation callback.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `npm run test:run -- src/views/StudyDashboard.test.tsx src/views/LessonView.test.tsx`

Expected: all focused tests pass.

- [ ] **Step 5: Add the mobile CSS contract**

Keep the resume card’s action full-width below the card content at the existing narrow breakpoint and assert it in `src/styles/index.test.ts`.

- [ ] **Step 6: Run the CSS and dashboard tests**

Run: `npm run test:run -- src/views/StudyDashboard.test.tsx src/styles/index.test.ts`

Expected: PASS.

### Task 2: Notes 2.0 data and UI

**Files:**
- Modify: `src/types/state.ts`
- Modify: `src/lib/storage.ts`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/NotesView.tsx`
- Modify: `src/styles/index.css`
- Test: `src/views/NotesView.test.tsx`
- Test: `src/components/lesson/LessonNotes.test.tsx`

**Interfaces:**
- `StudyStateV1.lessonNoteUpdatedAt?: Record<string, string>` stores ISO timestamps by lesson id.
- `NotesView` keeps the existing `onNavigate` and `onUpdateState` callbacks.

- [ ] **Step 1: Write failing note timestamp/filter tests**

Add tests proving a category select filters notes, a multi-word query uses AND semantics, newest sorting follows `lessonNoteUpdatedAt`, and deleting a note removes its timestamp.

- [ ] **Step 2: Run the focused notes tests and confirm RED**

Run: `npm run test:run -- src/views/NotesView.test.tsx`

Expected: FAIL because the current view has no category control, no timestamp ordering, and deletion only removes `lessonNotes`.

- [ ] **Step 3: Add backward-compatible state sanitization**

Implement a sanitizer that accepts only non-empty lesson ids with valid ISO-like strings, defaults to `{}`, and preserves all old backups without the field.

- [ ] **Step 4: Timestamp note saves and deletes**

Update `LessonView.handleSaveNote` to write `new Date().toISOString()` for the lesson, and remove the timestamp when a note is deleted from `NotesView`.

- [ ] **Step 5: Add Notes 2.0 filtering and sorting**

Add category and sort controls, AND-match trimmed search terms across metadata and note text, calculate total characters/results, and expose the active result count through live text.

- [ ] **Step 6: Add mobile layout rules**

Make the notes toolbar wrap into one-column controls below 600px; keep inputs/buttons at least the existing touch target and prevent long note text from widening the page.

- [ ] **Step 7: Run focused tests and confirm GREEN**

Run: `npm run test:run -- src/views/NotesView.test.tsx src/components/lesson/LessonNotes.test.tsx src/lib/storage.test.ts`

Expected: PASS.

### Task 3: Syntax Cross-Links

**Files:**
- Create: `src/components/lesson/LessonSyntaxLinks.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/styles/index.css`
- Test: `src/views/LessonView.test.tsx`
- Test: `src/components/lesson/QuickReviewContent.test.tsx`

**Interfaces:**
- `LessonSyntaxLinksProps = { sections: SyntaxSection[]; onNavigate: (path: string) => void }`.
- Each link calls `onNavigate('/reference?section=' + section.id)`.

- [ ] **Step 1: Write the failing cross-link test**

Render a lesson with two matching `SyntaxSection` objects and assert the related-reference nav exposes both titles and sends the correct route when clicked.

- [ ] **Step 2: Run the focused lesson test and confirm RED**

Run: `npm run test:run -- src/views/LessonView.test.tsx`

Expected: FAIL because no related syntax navigation region exists.

- [ ] **Step 3: Implement the semantic link component**

Render a compact `nav aria-label="Related syntax reference"` with real buttons or links, section numbers, titles, and categories. Keep the code labels LTR.

- [ ] **Step 4: Mount it after the mode panel**

Pass the already-matched syntax sections from `LessonView`; render it only when at least one section exists.

- [ ] **Step 5: Style for desktop and phone widths**

Use a wrapping list, minimum touch targets, and internal text wrapping without changing the reading content hierarchy.

- [ ] **Step 6: Run focused tests and confirm GREEN**

Run: `npm run test:run -- src/views/LessonView.test.tsx src/components/lesson/QuickReviewContent.test.tsx`

Expected: PASS.

### Task 4: Route code-splitting and mobile rendering polish

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`
- Test: `src/App.test.tsx` (create if route fallback coverage is needed)

**Interfaces:**
- Route views loaded with `React.lazy(() => import(...))` and rendered under an accessible `Suspense` fallback.
- Existing route props and navigation callbacks remain unchanged.

- [ ] **Step 1: Write the failing loading/accessibility test**

Add a test for the exported loading surface or static contract asserting that a route fallback has `role="status"` and a readable label before the lazy component resolves.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm run test:run -- src/App.test.tsx`

Expected: FAIL because the app has no lazy-route loading surface.

- [ ] **Step 3: Add lazy route imports and Suspense**

Lazy-load `SyntaxReferenceView`, `BookmarksView`, `NotesView`, and `LessonView`; keep the dashboard eagerly available. Add a small fallback that does not shift the page horizontally.

- [ ] **Step 4: Add CSS containment contracts**

Add `overflow-x: clip`/`min-inline-size: 0` only at shell boundaries, `content-visibility: auto` to long independent cards/lists, and intrinsic sizes to avoid layout jumps. Do not alter code/table internal scrolling.

- [ ] **Step 5: Run focused tests and inspect build chunking**

Run: `npm run test:run -- src/styles/index.test.ts src/App.test.tsx` and `npm run build`.

Expected: PASS and multiple route chunks in `dist/assets` with no new page-level overflow contract failures.

### Task 5: Full verification and handoff

**Files:**
- Review: all changed files and `git diff`

- [ ] **Step 1: Run the full local gates**

Run: `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build`, and `git diff --check`.

- [ ] **Step 2: Review scope freeze**

Confirm no changes to `elzero_python_lessons_20_to_74.md`, `python_syntax_reference_elzero_20_74.md`, `src/content/detailed/**`, or `src/content/practice/**`.

- [ ] **Step 3: Inspect mobile production output**

Serve the build with `npm run preview`, check representative dashboard/notes/lesson/reference routes at 320px, 390px, and 768px, and confirm internal code scrolling remains intact.

- [ ] **Step 4: Commit and publish**

Commit with `feat: improve study continuity and reference navigation`, update `main` without force push, inspect GitHub Actions, and verify the live Pages URL.
