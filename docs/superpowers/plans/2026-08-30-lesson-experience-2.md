# Lesson Experience 2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sticky, section-aware, exactly resumable lesson workspace with responsive notes and improved focused reading.

**Architecture:** `LessonView` will own one section-tracking state and pass it to a new sticky `LessonStudyDock` and controlled TOCs. Reading checkpoints become structured and backward compatible, while the existing note autosave lifecycle is extracted into a single editor rendered by a responsive surface. CSS uses the established editorial tokens and switches notes from a desktop grid panel to an accessible mobile sheet at 1180px.

**Tech Stack:** React 19, TypeScript 5.7, Vitest 3, Testing Library, CSS logical properties, Vite 6, localStorage

**Spec:** `docs/superpowers/specs/2026-08-30-lesson-experience-2-design.md`

## Global Constraints

- Do not rewrite lesson, Quick Review, syntax-reference, or Practice content.
- Do not redesign Practice or change its progress model.
- Do not add a backend, account system, runtime AI, Python execution, or a heavy UI framework.
- Do not migrate reading checkpoints into `StudyStateV1` or exported backups.
- Preserve legacy numeric reading positions, current note persistence, PWA behavior, navigation, themes, RTL/LTR, and reduced-motion behavior.
- Support 320–1440px with 44px minimum touch targets and no page-level horizontal overflow.
- Use the current opaque editorial surfaces; no gradients, glass blur, neon, chat bubbles, or assistant prompt UI.

---

### Task 1: Structured reading checkpoints

**Files:**
- Modify: `src/lib/readingPosition.ts`
- Modify: `src/lib/readingPosition.test.ts`

**Interfaces:**
- Produces: `ReadingCheckpoint`, `readReadingCheckpoint(lessonId)`, `writeReadingCheckpoint(lessonId, checkpoint)`, and `clearReadingCheckpoint(lessonId)`.
- Preserves: `readReadingPosition`, `writeReadingPosition`, and `clearReadingPosition` for existing callers and tests.

- [ ] **Step 1: Write failing checkpoint and migration tests**

Add tests that assert a structured checkpoint round-trips, a legacy numeric record returns `{ y, sectionId: null, sectionText: null, updatedAt: null }`, stale/invalid fields are sanitized, corrupt JSON is ignored, and clearing removes both stores.

```ts
expect(readReadingCheckpoint('020')).toEqual({
  y: 640,
  sectionId: '020-comparisons-2',
  sectionText: 'Comparisons',
  updatedAt: '2026-08-30T10:00:00.000Z'
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/lib/readingPosition.test.ts`  
Expected: FAIL because `readReadingCheckpoint` and related exports do not exist.

- [ ] **Step 3: Implement the versioned store and compatibility wrappers**

Use `py_study_workspace_reading_checkpoints_v2`, validate finite nonnegative `y`, nonempty nullable section strings, and a parseable ISO timestamp. `readReadingPosition()` returns `readReadingCheckpoint().y`; legacy writes continue to update the legacy store, while structured writes update v2.

```ts
export interface ReadingCheckpoint {
  y: number;
  sectionId: string | null;
  sectionText: string | null;
  updatedAt: string | null;
}

export function writeReadingCheckpoint(
  lessonId: string,
  checkpoint: Omit<ReadingCheckpoint, 'updatedAt'> & { updatedAt?: string }
): void;
```

- [ ] **Step 4: Run the focused test and typecheck**

Run: `npm test -- --run src/lib/readingPosition.test.ts && npm run typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/readingPosition.ts src/lib/readingPosition.test.ts
git commit -m "feat: add exact lesson reading checkpoints"
```

### Task 2: Shared section tracking and controlled lesson contents

**Files:**
- Create: `src/hooks/useLessonSectionProgress.ts`
- Create: `src/hooks/useLessonSectionProgress.test.tsx`
- Modify: `src/components/lesson/TableOfContents.tsx`
- Modify: `src/components/lesson/TableOfContents.test.tsx`

**Interfaces:**
- Produces: `useLessonSectionProgress(items, enabled)` returning `{ activeId, activeItem, activeIndex, total, progress, scrollToSection, syncFromScroll }`.
- Produces controlled TOC props: `activeId?: string`, `onSelectItem?: (item: TocItem) => void`, `onOpenChange?: (open: boolean) => void`, and `triggerMode?: 'inline' | 'external'`.
- Consumes: `TocItem[]` and DOM headings matching item IDs.

- [ ] **Step 1: Write failing hook tests**

Create headings with controlled `getBoundingClientRect()` values. Assert the hook selects the last heading above a 112px reading line, calculates `(index + 1) / total * 100`, falls back to the first item, and scrolls with `auto` when reduced motion is enabled.

```ts
expect(result.current.activeId).toBe('second');
expect(result.current.progress).toBe(67);
```

- [ ] **Step 2: Run the hook test and verify failure**

Run: `npm test -- --run src/hooks/useLessonSectionProgress.test.tsx`  
Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement requestAnimationFrame-scheduled tracking**

Use scroll and resize listeners only when `enabled && items.length > 0`. Determine the current section from heading rectangles, provide a deterministic timeout fallback, and clean up pending work and listeners.

- [ ] **Step 4: Run hook tests and verify pass**

Run: `npm test -- --run src/hooks/useLessonSectionProgress.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Write failing controlled-TOC tests**

Assert `aria-current` follows the controlled `activeId`, selecting an item calls `onSelectItem(item)` instead of running independent observation, the external-trigger mode exposes a callable controlled sheet path, and existing standalone focus-trap/Escape/focus-restoration tests still pass.

- [ ] **Step 6: Implement controlled TOC support**

Keep the existing internal active state and observer only when `activeId` is absent. Centralize sheet close/open state, dispatch `closeTransientOverlays()` before opening, and preserve the current RTL/LTR label splitting.

- [ ] **Step 7: Run both focused suites and typecheck**

Run: `npm test -- --run src/hooks/useLessonSectionProgress.test.tsx src/components/lesson/TableOfContents.test.tsx && npm run typecheck`  
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useLessonSectionProgress.ts src/hooks/useLessonSectionProgress.test.tsx src/components/lesson/TableOfContents.tsx src/components/lesson/TableOfContents.test.tsx
git commit -m "feat: unify lesson section tracking"
```

### Task 3: Sticky study dock

**Files:**
- Create: `src/components/lesson/LessonStudyDock.tsx`
- Create: `src/components/lesson/LessonStudyDock.test.tsx`
- Modify: `src/components/lesson/LessonHeader.tsx`
- Modify: `src/components/lesson/LessonHeader.test.tsx`

**Interfaces:**
- Produces: `StudyMode = 'detailed' | 'quickReview' | 'practice'` as an exported type.
- Produces: `LessonStudyDock` props for lesson ID, mode, available Practice, section state, resume cue, contents/notes actions, and mode change.
- Consumes: `activeIndex`, `total`, and `progress` from Task 2.

- [ ] **Step 1: Write failing dock interaction tests**

Assert the dock has `role="region"` named “Study controls”, preserves tablist keyboard behavior, shows `Section 2 of 5`, renders an accessible progressbar with value 40, invokes contents/notes callbacks, and only shows resume when a meaningful checkpoint exists.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run src/components/lesson/LessonStudyDock.test.tsx`  
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `LessonStudyDock`**

Move the existing tab markup and keyboard handling from `LessonHeader`. Add compact `List`, `FileEdit`, and resume buttons with visible text, accessible names, and progress metadata. Keep Practice conditional.

- [ ] **Step 4: Simplify `LessonHeader` to masthead-only behavior**

Remove mode props and tests from `LessonHeader`; retain completion, bookmark, Full View, metadata, and title behavior unchanged.

- [ ] **Step 5: Run dock/header tests and typecheck**

Run: `npm test -- --run src/components/lesson/LessonStudyDock.test.tsx src/components/lesson/LessonHeader.test.tsx && npm run typecheck`  
Expected: PASS after call sites are temporarily adapted with the new interfaces or test stubs.

- [ ] **Step 6: Commit**

```bash
git add src/components/lesson/LessonStudyDock.tsx src/components/lesson/LessonStudyDock.test.tsx src/components/lesson/LessonHeader.tsx src/components/lesson/LessonHeader.test.tsx
git commit -m "feat: add sticky lesson study dock"
```

### Task 4: One notes editor with responsive surfaces

**Files:**
- Modify: `src/components/lesson/LessonNotes.tsx`
- Modify: `src/components/lesson/LessonNotes.test.tsx`
- Create: `src/components/lesson/LessonNotesSurface.tsx`
- Create: `src/components/lesson/LessonNotesSurface.test.tsx`

**Interfaces:**
- Produces: `LessonNotesEditor` with `{ lessonId, initialNote, onSaveNote }` and the current persistence lifecycle.
- Produces: `LessonNotesSurface` with `{ isOpen, onClose, lessonId, initialNote, onSaveNote }`.
- Uses one mounted textarea only while the surface is open; presentation changes at 1180px through CSS rather than duplicated React trees.

- [ ] **Step 1: Refactor tests around the editor contract before production changes**

Rename the tested unit to `LessonNotesEditor` and retain every debounce, blur flush, unmount flush, lesson switch, external restore, status, and character-count assertion. Add a test that the editor has no internal disclosure toggle.

- [ ] **Step 2: Run the notes test and verify failure**

Run: `npm test -- --run src/components/lesson/LessonNotes.test.tsx`  
Expected: FAIL because `LessonNotesEditor` is not exported.

- [ ] **Step 3: Extract the editor without changing persistence logic**

Keep refs, timers, event handlers, textarea labels, and status live region intact. Remove only `isOpen`, disclosure markup, and chevron behavior.

- [ ] **Step 4: Run editor tests and verify pass**

Run: `npm test -- --run src/components/lesson/LessonNotes.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Write failing surface accessibility tests**

Assert open Notes renders one named complementary region plus one dialog-capable surface, focuses Close on narrow viewport, traps Tab, closes on Escape/backdrop/overlay event, restores trigger focus through a passed `returnFocusRef`, locks/restores body overflow, and calls `onClose` once.

- [ ] **Step 6: Implement `LessonNotesSurface`**

Render one surface with `role="dialog"` below the CSS breakpoint and `role="complementary"` semantics on wide screens using a responsive `matchMedia('(min-width: 1180px)')` helper. Before opening is orchestrated, `LessonView` calls `closeTransientOverlays`; while open, the surface listens for later close events.

- [ ] **Step 7: Run both note suites and typecheck**

Run: `npm test -- --run src/components/lesson/LessonNotes.test.tsx src/components/lesson/LessonNotesSurface.test.tsx && npm run typecheck`  
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/lesson/LessonNotes.tsx src/components/lesson/LessonNotes.test.tsx src/components/lesson/LessonNotesSurface.tsx src/components/lesson/LessonNotesSurface.test.tsx
git commit -m "feat: add responsive lesson notes surface"
```

### Task 5: Orchestrate Lesson Experience 2.0

**Files:**
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/LessonView.test.tsx`

**Interfaces:**
- Consumes: checkpoint API from Task 1, section hook/TOC from Task 2, dock from Task 3, and notes surface from Task 4.
- Produces: one coordinated lesson workspace and CSS state attributes `data-notes-open` and `data-study-mode`.

- [ ] **Step 1: Replace pixel-only tests with failing exact-resume tests**

Assert a saved section calls its heading's `scrollIntoView({ behavior: 'auto', block: 'start' })`; a stale section uses `window.scrollTo({ top: y, behavior: 'auto' })`; scrolling writes active section ID/text plus y; Quick Review and Practice do not write detailed-section changes.

- [ ] **Step 2: Add failing workspace composition tests**

Assert the masthead is followed by the study dock, mobile contents is opened from the dock, exactly one Notes editor exists when open, closing preserves a flushed note, desktop TOC receives the shared active section, Full View retains dock/contents/notes, and lesson navigation flushes the checkpoint.

- [ ] **Step 3: Run LessonView tests and verify failure**

Run: `npm test -- --run src/views/LessonView.test.tsx`  
Expected: FAIL against the old pixel-only, inline-notes composition.

- [ ] **Step 4: Implement the coordinated view**

Initialize the section hook only in Detailed Study. Restore once per lesson; schedule structured checkpoint writes with active section data; keep a stable saved checkpoint for the resume cue. Lift Notes open state and trigger ref, place `LessonNotesSurface` as the optional grid panel, and route TOC selection through `scrollToSection`.

- [ ] **Step 5: Run LessonView and related regressions**

Run: `npm test -- --run src/views/LessonView.test.tsx src/components/lesson/TableOfContents.test.tsx src/components/lesson/LessonNotes.test.tsx src/components/lesson/PracticeContent.test.tsx`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/views/LessonView.tsx src/views/LessonView.test.tsx
git commit -m "feat: orchestrate lesson experience 2"
```

### Task 6: Editorial responsive styling and Full View

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/styles/index.test.ts`

**Interfaces:**
- Consumes: `.lesson-study-dock`, `.lesson-workspace`, `.lesson-notes-surface`, `.lesson-toc-*`, `data-notes-open`, and `.app-shell--full-view` from Tasks 2–5.
- Produces: `--lesson-dock-offset` and responsive layout contracts.

- [ ] **Step 1: Write failing source-level CSS contract tests**

Assert the dock is sticky with opaque background and navigation z-index; headings use `scroll-margin-block-start: var(--lesson-dock-offset)`; 1180px+ notes participate in grid layout; below 1180px notes become a fixed safe-area bottom sheet; Full View does not hide notes/dock; 700px and 320px rules prevent overflow and preserve 44px controls; reduced-motion disables dock/sheet transitions.

- [ ] **Step 2: Run the CSS test and verify failure**

Run: `npm test -- --run src/styles/index.test.ts`  
Expected: FAIL because the new selectors/contracts are absent.

- [ ] **Step 3: Implement the lesson workspace styles**

Add one editorial section near the existing lesson redesign. Replace obsolete inline-notes rules, adjust desktop TOC sticky top, give the dock wrapping mobile rows, cap sheet height, account for safe areas, maintain code overflow locally, and remove `.lesson-notes` from the Full View hidden selector.

- [ ] **Step 4: Run CSS tests, full component tests, lint, and typecheck**

Run: `npm test -- --run src/styles/index.test.ts src/views/LessonView.test.tsx && npm run lint && npm run typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/index.css src/styles/index.test.ts
git commit -m "style: finish responsive lesson workspace"
```

### Task 7: Full verification, deployment, and live QA

**Files:**
- Modify only if verification exposes a scoped defect.

**Interfaces:**
- Verifies every preceding task as one deployable static site.

- [ ] **Step 1: Run the complete automated pipeline**

Run: `npm run lint && npm run typecheck && npm run test:run && npm run practice:test && npm run build`  
Expected: all commands exit 0; Practice draft tests remain unchanged and passing.

- [ ] **Step 2: Inspect the production bundle locally**

Run `npm run dev -- --host 0.0.0.0`, then inspect lesson 020 at 320, 375, 768, 1024, 1180, and 1440px. Check light/dark, sticky dock, heading targeting, reload resume, Notes open/close/save, contents selection, Quick Review, Practice, Full View, previous/next navigation, keyboard focus, and page overflow.

- [ ] **Step 3: Fix only evidence-backed defects and rerun affected plus full checks**

Every fix starts with a reproducing test, then reruns the focused test and the complete pipeline from Step 1.

- [ ] **Step 4: Commit final verification fixes if needed**

```bash
git add <only-files-changed-for-verified-defects>
git commit -m "fix: harden lesson experience responsive behavior"
```

- [ ] **Step 5: Publish non-destructively to `main`**

Create a remote commit parented to the current remote `main`, using the local HEAD tree contents, then update `refs/heads/main` with `force: false`. Do not reset the user's local branch or force-push.

- [ ] **Step 6: Verify deployment and production**

Wait for the GitHub Pages workflow to complete successfully. Open `https://fady-fawzy.github.io/python-study-workspace/`, repeat representative desktop and mobile checks, and confirm there are no site-origin console errors.
