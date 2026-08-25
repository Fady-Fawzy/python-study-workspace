# Study continuity, notes, syntax links, and performance design

## Scope

Implement the requested upgrades 1, 3, 5, and 6 for the existing static Python study workspace:

1. Continue Studying
2. Notes 2.0
3. Syntax Cross-Links
4. Performance and mobile polish

Practice, Summary content, Quick Review prose, and educational lesson source content remain out of scope.

## Goals

- Make the dashboard resume action communicate what will be resumed, including the persisted lesson and reading checkpoint.
- Make personal notes easier to find and manage without introducing a backend or changing the existing autosave model.
- Let learners move from a lesson to every syntax-reference section attached to that lesson with one tap.
- Reduce initial route cost and protect long reading surfaces on narrow screens without changing the visual design system.

## Architecture

The existing `StudyStateV1` remains the single persisted state object. New note timestamps are optional, sanitized fields so old localStorage and backups remain valid. Reading positions continue to use the existing lesson-scoped localStorage store. A small `LessonSyntaxLinks` presentation component receives already-parsed syntax sections and routes through the existing hash router.

Route views are loaded with React `lazy`/`Suspense`; content parsing and the global search index remain static and source-driven. CSS containment is limited to long, independent surfaces so code blocks and anchor scrolling keep their current behavior.

## Behavior details

### Continue Studying

- If `lastOpenedLessonId` is valid, the dashboard labels the primary action “Resume Lesson” and shows the lesson number/title/category.
- If `readReadingPosition(lastOpenedLessonId)` is greater than zero, show a compact “Saved reading position” cue.
- If no valid last lesson exists, fall back to the first lesson and label the action “Start Lesson”.
- Existing route navigation and reading-position restoration remain unchanged.

### Notes 2.0

- Persist `lessonNoteUpdatedAt: Record<string, string>` as an optional state field.
- Lesson note autosave writes the note and its ISO timestamp together; deleting a note removes its timestamp.
- Notes search uses AND matching across lesson id, title, category, and note text.
- A category filter and newest/oldest sort are available on the notes page.
- The page reports total notes, total characters, active filter result count, and a human-readable last-updated label where a valid timestamp exists.
- Existing delete confirmation, open-lesson action, empty states, and autosave status remain intact.

### Syntax Cross-Links

- Add a compact, semantic `nav` after the lesson mode panel when matching syntax sections exist.
- Each link displays the section number, title, and category and navigates to `/reference?section=<id>`.
- Keep the existing Quick Review reference action; the new links complement it and do not add explanatory prose.

### Performance and mobile

- Lazy-load route views that are not needed for the initial dashboard render and show an accessible, lightweight loading surface.
- Add long-surface rendering hints only to independent lists/cards (`content-visibility: auto` with intrinsic size).
- Add inline-size containment/overflow protection at app-shell boundaries while preserving internal horizontal scrolling for code, tables, and outputs.
- Reuse existing tokens and breakpoints; no new dependency or visual redesign.

## Compatibility and safety

- Keep `StudyStateV1.version` at `1`; optional fields are backward-compatible and sanitized on load/import.
- Do not change `elzero_python_lessons_20_to_74.md`, `python_syntax_reference_elzero_20_74.md`, `src/content/detailed/**`, or `src/content/practice/**`.
- Do not introduce network APIs, runtime Python, AI calls, or server-side behavior.
- All new interactive controls use semantic buttons/links and accessible names.

## Verification

- Add unit/integration tests for resume cues, note timestamps/filtering/sorting, syntax-link destinations, lazy fallback presence, and CSS contracts.
- Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build`, and `git diff --check`.
