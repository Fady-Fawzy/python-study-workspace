# Progress 2.0 and Smart Next Lesson Design

**Date:** 2026-08-25
**Scope:** Improve reading continuity and the dashboard's next-lesson recommendation without changing educational content, Summary, Quick Review prose, or Practice Mode.

## Product intent

The workspace already remembers a pixel reading position and completed lessons. This upgrade makes that state understandable: each lesson exposes a small reading-progress meter, the dashboard shows the saved percentage for the current lesson, and the next recommendation explains why that lesson is being suggested.

## Design decisions

### Reading progress

Keep the existing pixel checkpoint store for exact scroll restoration. Add a separate, versioned localStorage store for a normalized integer percentage (`0`–`100`) so older checkpoints remain valid and the dashboard never needs to guess a lesson's document height. The progress store is browser-safe, ignores malformed values, and is intentionally independent from the main study state so scroll events do not rewrite the full backup payload.

The lesson page renders a compact semantic `progress` element labelled “Reading progress”. It updates on scroll and resize through one `requestAnimationFrame` guard, preserves code/output horizontal scrolling, and remains visible in Full View because it belongs to the reading surface.

### Smart recommendation

A pure helper receives the parsed lesson list, completed IDs, bookmark IDs, last-opened ID, and a progress reader. It chooses in this order:

1. Resume the last incomplete lesson when its saved reading progress is between 1% and 89%.
2. Continue to the next incomplete lesson after a completed/almost-finished last lesson.
3. Recommend the first incomplete bookmarked lesson when there is no active partial lesson.
4. Fall back to the first incomplete lesson, or no recommendation when the course is complete.

The dashboard preserves the existing “Open Next” action and route, but changes the supporting copy to explain `Resume where you left off`, `Continue the sequence`, `From your bookmarks`, or `Start the course`.

## Accessibility and mobile

- Use a native `progress` element with an accessible label and textual percentage.
- Keep all interactive controls at the existing touch target token.
- Use existing logical CSS tokens, no new color system or visual redesign.
- Keep page-level horizontal overflow at zero; code/output scrolling remains internal.
- Keep English UI copy and LTR lesson identifiers.

## Invariants

- Do not edit `elzero_python_lessons_20_to_74.md`, `python_syntax_reference_elzero_20_74.md`, `src/content/detailed/**`, or `src/content/practice/**`.
- Do not add runtime AI, Python execution, backend services, dependencies, or tracking.
- Preserve Notes, Bookmarks, Backup/Restore, Summary, Quick Review, Full View, and the 026–074 fallback.
- Invalid or missing localStorage data must degrade to 0% and the first valid recommendation.
