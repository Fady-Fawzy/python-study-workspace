# Lesson Experience 2.0 — Design Specification

**Date:** 2026-08-30  
**Status:** Approved direction (Option A)  
**Scope:** Lesson reading experience only

## Goal

Turn every lesson into a focused, resumable study workspace without changing the educational material, the Practice experience, or the site's editorial visual language.

The round must make the active study mode, current section, lesson contents, notes, and focused-reading controls available at the point of use. It must remain comfortable from 320px phones through wide desktop screens, preserve RTL/LTR behavior, and avoid familiar AI-product visual clichés.

## Non-goals

- Do not rewrite lesson, Quick Review, syntax-reference, or Practice content.
- Do not redesign Practice or change its progress model.
- Do not add a backend, account system, runtime AI, Python execution, or a heavy UI framework.
- Do not migrate reading checkpoints into `StudyStateV1` or exported backups.
- Do not replace the existing editorial design system, navigation shell, or PWA behavior.

## Experience model

### 1. Lesson masthead and study dock

The masthead remains the document cover: lesson number, category, title, completion, bookmark, and Full View.

The current mode switcher moves out of the masthead into a dedicated `LessonStudyDock` immediately below it. The dock becomes sticky while the lesson is being read and contains:

- the existing Detailed Study / Quick Review / Practice tabs;
- a compact current-section label and section count in Detailed Study;
- a section-progress indicator;
- direct Lesson contents and Notes controls;
- a compact resume cue when a meaningful checkpoint exists.

The sticky dock uses opaque paper surfaces, borders, and restrained editorial typography. It must not use gradients, glass blur, neon, floating chat bubbles, or assistant-style prompt UI. Its `scroll-margin` contract becomes the single offset used when headings are targeted.

On narrow screens, mode labels may compact while every control retains a 44px minimum target. The dock can wrap into two rows; it must never create horizontal page overflow.

### 2. One section-tracking source of truth

A lesson-level `useLessonSectionProgress` hook owns section observation for Detailed Study. It receives the lesson TOC and exposes:

- active section ID and label;
- active section index and total;
- normalized section progress;
- the current vertical position needed for checkpoint persistence.

The hook selects the last heading that has crossed the sticky reading line, with the first upcoming heading as a fallback. It updates from scroll/resize work scheduled through `requestAnimationFrame`, so the dock and TOC cannot disagree.

`TableOfContents` becomes controlled-capable through optional active-section and selection props. Existing standalone behavior remains as a fallback for tests or other consumers. In `LessonView`, both desktop and mobile TOC render from the lesson-level active section.

### 3. Exact, backward-compatible resume

Reading position storage is upgraded without deleting the existing numeric store.

The new checkpoint shape is:

```ts
interface ReadingCheckpoint {
  y: number;
  sectionId: string | null;
  sectionText: string | null;
  updatedAt: string;
}
```

It is stored in a versioned lesson-keyed localStorage record. Reads follow this order:

1. valid new checkpoint for the lesson;
2. legacy numeric reading position converted to a checkpoint-like fallback;
3. top of page.

On lesson entry, a valid stored `sectionId` is preferred and scrolled into view with `behavior: 'auto'`; the saved pixel value is the fallback if the section no longer exists. Checkpoints are written on scheduled scroll updates and flushed on pagehide/unmount. Invalid, corrupt, or unavailable localStorage must never block the lesson.

A resume cue appears only for a meaningful saved location away from the beginning. It names the saved section and offers an explicit jump back if the browser or user has already moved elsewhere. Initial automatic restoration still occurs once per lesson entry.

### 4. Notes as a study surface

The existing note editor's debounce, blur flush, unmount flush, restore replacement, save status, and character count remain intact. Presentation state is lifted out of the editor.

`LessonNotesEditor` owns note editing and persistence behavior. `LessonNotesSurface` owns visibility and responsive presentation:

- **Wide desktop (1180px and above):** a non-modal side panel in the lesson workspace. Opening it changes the grid rather than covering the prose. It has a sticky panel header and explicit close control.
- **Tablet and mobile (below 1180px):** an accessible bottom sheet with backdrop, focus trap, Escape close, focus restoration, body-scroll lock, safe-area padding, and a maximum height that leaves context visible.

The Notes control is available from the study dock in Detailed Study and Quick Review. It stays available in Full View. Opening either Notes or mobile Lesson contents closes the other transient overlay through the existing overlay event contract.

The inline collapsible notes block is removed, preventing duplicate editors and competing drafts.

### 5. Lesson contents

Desktop Lesson contents remains a reading-side navigation surface, but gains:

- controlled active-section state;
- section ordinal/progress context;
- clearer active marker and scrollable containment on shorter viewports;
- sticky positioning that accounts for the study dock.

Mobile Lesson contents remains a modal sheet and retains its current accessibility behavior. Its trigger moves into the dock so it stays reachable during long lessons. Selecting a section closes the sheet, updates the controlled section state, and scrolls using the shared dock offset and reduced-motion preference.

### 6. Full View

Full View continues to remove global navigation, bookmark/completion secondary actions, pagination, and nonessential lesson chrome. It no longer removes notes.

The focused-reading layout keeps:

- the masthead title context;
- the sticky study dock;
- current-section progress;
- Lesson contents;
- Notes;
- a persistent, unobstructive Exit Full View control.

The reading column remains centered and readable. On wide screens, an open notes panel shares the available canvas without making prose narrower than its minimum comfortable measure. On small screens, fixed controls account for safe areas and never cover headings or code controls.

### 7. Navigation finish

Previous/next lesson navigation remains at the end of the document. Its behavior does not change, but the new checkpoint lifecycle must flush the current lesson before navigation and restore the next lesson independently.

Jump-to-top and jump-to-end controls remain. Jump-to-top updates the effective section to the first item; neither control corrupts the stored checkpoint during route transitions.

## Component and data changes

| Area | Change |
|---|---|
| `LessonHeader` | Keep masthead actions/title; remove mode tabs |
| `LessonStudyDock` | New sticky mode, section, contents, notes, and resume controls |
| `useLessonSectionProgress` | New shared section tracker and heading scroll helper |
| `readingPosition` | Add versioned structured checkpoints and legacy numeric fallback |
| `TableOfContents` | Add controlled active ID and selection callback; preserve fallback behavior |
| `LessonNotesEditor` | Extract current autosave lifecycle from disclosure presentation |
| `LessonNotesSurface` | New desktop side panel / mobile bottom sheet controller |
| `LessonView` | Orchestrate dock, tracker, checkpoint, TOC, notes, and responsive layout |
| CSS | Sticky offsets, responsive study grid, sheets/panel, Full View, overflow and reduced-motion rules |

## Accessibility and interaction contracts

- Tabs keep roving `tabIndex`, arrow/Home/End keyboard behavior, `aria-selected`, and tabpanel relationships.
- Sticky controls remain in document order and do not duplicate interactive elements by breakpoint.
- Notes and contents sheets use named dialogs, modal semantics, focus trap, Escape handling, backdrop dismissal, focus restoration, and body-scroll restoration.
- Current section uses `aria-current="location"`; progress has an accessible name and numeric value.
- Status announcements for autosave remain polite and atomic.
- All icon-only controls have explicit labels, visible focus, and at least 44px targets.
- Heading navigation respects `prefers-reduced-motion` and never hides the destination behind the dock.
- Arabic copy keeps RTL/auto direction while identifiers, code, and detailed English lessons remain LTR.

## Responsive contracts

| Width | Layout |
|---|---|
| 1180px+ | reading column + desktop TOC; opening Notes adds a non-modal side panel |
| 768–1179px | centered reading column; dock stays sticky; TOC and Notes use sheets |
| 320–767px | two-row compact dock; bottom sheets; safe-area-aware fixed controls; no horizontal overflow |

The implementation must be visually checked at 320, 375, 768, 1024, 1180, and 1440px in light and dark themes, with Full View and Notes open where applicable.

## Error handling and compatibility

- A missing or stale section ID falls back to saved `y`.
- Corrupt checkpoint JSON yields a safe empty record.
- Storage write failures are ignored after retaining in-memory interaction.
- Missing `IntersectionObserver`, `ResizeObserver`, or `requestAnimationFrame` uses deterministic scroll/timeout fallbacks.
- Lessons with zero or one TOC item omit contents and section-progress controls.
- Quick Review and Practice do not write a misleading detailed-section checkpoint while active.
- Existing legacy position records remain readable and are not destructively rewritten until a valid checkpoint is saved.

## Verification strategy

Implementation follows tests-first slices:

1. checkpoint validation, legacy fallback, corruption, and clearing;
2. section-tracker active selection and reduced-motion heading navigation;
3. controlled TOC behavior while retaining sheet accessibility;
4. study dock tab keyboard behavior, current-section progress, and actions;
5. notes editor persistence plus desktop/mobile surface accessibility;
6. LessonView exact resume, mode boundaries, Full View, navigation flush, and no duplicate notes editor;
7. source-level responsive, overflow, sticky-offset, safe-area, and reduced-motion CSS assertions.

Final verification runs lint, typecheck, the complete Vitest suite, Practice regression tests, production build, GitHub Pages deployment, and live browser checks on desktop and mobile widths.

## Acceptance criteria

- The study dock stays reachable while scrolling and never covers a targeted heading.
- Dock and TOC always show the same active section in Detailed Study.
- Reopening a lesson restores the exact saved heading when possible and safely falls back to pixels.
- Notes use one editor instance and preserve all current autosave guarantees.
- Notes is a desktop side panel at 1180px+ and a fully accessible bottom sheet below it.
- Full View retains dock, contents, progress, notes, and a reliable exit.
- No page-level horizontal overflow occurs from 320–1440px.
- Existing Practice behavior, educational content, study state, backup format, PWA, themes, and navigation remain unchanged.
- All automated checks pass and the deployed Pages build is visually verified.
