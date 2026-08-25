# Mobile Reading Mode 2.0 Design

## Goal

Make lesson reading on phone screens feel like a focused programming document while preserving the current Summary, lesson content, Quick Review, bookmarks, notes, and completion behavior.

## Scope

This upgrade covers the eight approved mobile-reading improvements:

1. Full View hides navigation and non-reading chrome while keeping a compact escape control.
2. The Full View control remains tappable, safe-area aware, and never covers the lesson header.
3. Python code, output blocks, and tables remain readable with internal scrolling instead of page overflow.
4. The mobile Table of Contents remains a clear, accessible bottom sheet with a useful trigger.
5. Each lesson remembers its last reading position on the current device.
6. Floating controls provide accessible jump-to-top and jump-to-end actions.
7. Phone-specific spacing is explicitly covered for 320–430px layouts.
8. New controls and surfaces use existing theme tokens and remain readable in dark and light mode.

Lesson prose, the original Markdown source, Summary sections, and the existing Quick Review content are outside this change.

## Architecture

The current `isLessonFullView` route-local state remains the source of truth for focused reading. Full View styling continues to be expressed through `.app-shell--full-view`, with mobile overrides in the existing media-query system.

Reading positions use a small repository-owned helper backed by a separate `localStorage` key. This avoids writing the entire study state on every scroll event and keeps existing backup data compatible. `LessonView` restores the saved position after the lesson content mounts and persists throttled scroll updates plus page-hide flushes.

The jump controls live in a focused `LessonReadingControls` component. It observes scroll state, respects reduced motion, exposes explicit accessible names, and is hidden when no jump action is useful. The existing TOC component remains responsible for heading navigation and focus trapping; only its mobile surface and Full View presentation are refined.

## Interaction rules

- Full View keeps the lesson title, mode tabs, lesson content, and relevant TOC access; it hides the global header, sidebar, lesson notes, pagination, and secondary lesson actions.
- The escape button is fixed, has at least a 44px touch target, uses an automatic content width on phones, and reserves top reading space.
- Code and output preserve LTR direction and `white-space: pre`; long lines scroll inside their own block.
- Tables scroll inside their containing rich-text surface and never widen the document viewport.
- Selecting a TOC item closes the sheet, restores focus to the trigger, and uses instant scrolling when reduced motion is enabled.
- A saved reading position is ignored when it is invalid or beyond the current document; the browser clamps it to the available page.
- Jump controls use `behavior: smooth` unless `prefers-reduced-motion: reduce` is active.

## Accessibility and themes

All new controls are semantic `<button>` elements with visible focus states and descriptive labels. Output/code/table distinctions remain conveyed by labels and structure, not color alone. New surfaces use `var(--bg-*)`, `var(--text-*)`, border, accent, shadow, safe-area, and spacing tokens so both themes inherit the existing design language.

## Verification

- Unit tests cover reading-position sanitization and persistence, jump-control behavior, Full View contracts, TOC semantics, and existing lesson interactions.
- Existing typecheck, lint, full Vitest, practice tests, and production build must remain green.
- Live QA checks Full View, scroll persistence behavior, no document overflow, mode switching, notes/bookmarks/completion, and representative lesson 026 fallback.
