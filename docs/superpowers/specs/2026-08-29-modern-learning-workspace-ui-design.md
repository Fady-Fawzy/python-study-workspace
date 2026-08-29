# Modern Learning Workspace UI Design

## Goal

Transform the existing Python Study Workspace into a distinctive, focused learning product that feels editorial, technical, and purpose-built for studying Python. Preserve every current study capability and all educational content while improving hierarchy, readability, navigation, responsiveness, and visual consistency.

The approved direction is **Modern Learning Workspace** with a restrained code-editor influence. It must not resemble the common AI-product aesthetic.

## Non-goals and visual exclusions

- Do not change lesson prose, Detailed Study content, Quick Review content, Practice questions, or source Markdown.
- Do not add runtime AI, Python execution, accounts, cloud storage, or new study subsystems.
- Do not use purple-blue mesh gradients, blurred gradient orbs, glassmorphism, translucent floating cards, neon glows, oversized pill controls, excessive rounded containers, generic sparkles, chatbot imagery, or "AI assistant" visual language.
- Do not turn the workspace into a VS Code clone or make beginner-facing screens dense and tool-like.
- Do not remove PWA, offline, backup/restore, accessibility, Full View, reading progress, search, notes, bookmarks, completion, themes, or GitHub Pages support.

## Design character

The interface combines three references without copying any product:

1. **Editorial learning surface:** strong typographic hierarchy, generous reading rhythm, restrained dividers, and content-first composition.
2. **Technical notebook:** crisp mono accents, structured code/output pairs, precise labels, and compact status information.
3. **Quiet workspace:** low visual noise, clear primary action, shallow elevation, and motion used only for feedback or orientation.

Python blue is the main action and navigation color. Python yellow is a limited highlight for progress, bookmarks, or teaching emphasis. Neutral ink, slate, paper, and navy surfaces carry the interface. Cards use small-to-medium radii, visible structure, and minimal shadow; most grouping should come from spacing, rules, or tonal surfaces rather than placing everything inside a card.

## Information architecture

The current routes and data model remain intact:

- Study dashboard
- Lesson view with Detailed Study, Quick Review, and optional Practice
- Syntax Reference
- Bookmarks
- Notes
- Search command surface
- Backup and theme controls

The redesign changes presentation and component boundaries, not route semantics or stored study behavior. Existing state keys remain readable. New purely visual preferences may be added only if necessary and must have safe defaults.

## App shell and navigation

### Desktop

- Replace the permanently heavy lesson rail with a structured sidebar that supports expanded and compact states.
- Give the brand a distinctive wordmark built from typography and a small bracket/cursor motif rather than a generic rounded app badge.
- Separate primary destinations from lesson navigation. Primary navigation remains compact; lessons remain grouped by course module.
- Show module progress through a thin progress rule and fraction, not multiple badges.
- Simplify the header to page context, global search, progress, theme, and backup. Avoid duplicating navigation already available in the sidebar.
- Keep keyboard access, focus management, and `Ctrl/Cmd+K` behavior.

### Mobile

- Use a compact top bar for page identity and context actions.
- Add a four-item bottom navigation for Study, Lessons, Search, and Notes. Bookmarks and secondary utilities remain available through the lesson sheet or overflow surface.
- Present lesson navigation as an accessible bottom sheet with module grouping, progress, and the current lesson in view.
- Respect safe-area insets and maintain 44px minimum touch targets.

## Dashboard

The dashboard becomes a deliberate study landing page with four visual levels:

1. **Continue panel:** the strongest surface, containing the last lesson, reading position, a compact course indicator, and one clear Resume/Start action.
2. **Today's focus:** a horizontal editorial strip directly below the main action, not a second competing hero card.
3. **Course status:** one compact row for completed, remaining, streak, bookmarks, and notes. Avoid repeating the same percentage in multiple cards.
4. **Study trail:** recent lessons, items needing attention, and module progress presented as lists or timeline rows with restrained separators.

The dashboard must reduce repeated cards and repeated progress information. At any viewport size, Resume/Start remains the most obvious action.

## Lesson experience

- Use a document-style header with lesson number, category, title, completion, bookmark, and Full View controls arranged by priority.
- Make the mode switcher a sticky segmented rail with squared/soft-tab geometry rather than a large rounded pill.
- Keep the reading column within a comfortable measure while allowing code, comparisons, and tables to use a wider local width when useful.
- Strengthen heading rhythm and use numbered section markers where the content model supports them.
- Treat Explanation, Important, Comparison, Output, and Error as a consistent visual grammar with distinct edge marks, labels, and icons. Do not rely on color alone.
- Keep desktop TOC quiet and sticky. On mobile, show TOC through the lesson sheet without obscuring reading controls.
- Move lesson notes into a collapsible side panel on wide screens and a bottom sheet on mobile. Notes remain quickly available without permanently extending the lesson page.
- Preserve previous/next lesson actions but present them as a structured footer with destination titles and a separate completion action.
- Full View removes all global chrome and secondary study tools while retaining a clear, safe exit control.

## Code and output presentation

- Code blocks use a technical notebook frame, not decorative browser-window dots.
- The header contains the language/context label, optional filename or concept label, and Copy action.
- Python remains LTR with a readable mono font, stable line height, and internal horizontal scrolling.
- Output or Error visually attaches beneath its source code when adjacent, forming one example unit.
- Output uses a clear terminal/result label and a distinct rule; Error adds semantic iconography and accessible text rather than red tint alone.
- Line numbers appear only where they aid reference and must not be injected into every small snippet.
- Copy success is shown through icon/text replacement and an accessible live announcement, without toast spam.

## Secondary pages

### Syntax Reference

- Use an indexed notebook layout with category rail, compact search, section count, and readable reference entries.
- Improve scanning through method signatures, parameter rows, examples, and anchored headings.

### Notes

- Present notes as a searchable study notebook with a focused editor/preview relationship on desktop and a single-column flow on mobile.
- Preserve autosave, timestamps, lesson links, and existing data.

### Bookmarks

- Separate lesson bookmarks from syntax bookmarks through tabs or clear sections rather than unrelated card grids.
- Use dense, useful rows with context and direct actions.

### Search

- Retain command-palette speed but make results easier to scan through type, lesson/module context, matched text, and consistent keyboard selection.

## Design system and component boundaries

Refactor visual primitives only where the redesign needs stable reuse:

- Foundation tokens: color roles, typography, spacing, radius, borders, elevation, motion, layout, and responsive boundaries.
- Primitives: button, icon button, badge/status, segmented control, progress, surface, divider, empty state, sheet/dialog, and field.
- Navigation: workspace sidebar, module group, mobile navigation, lesson sheet, and contextual header.
- Learning surfaces: continue panel, status row, study trail row, lesson masthead, semantic content block, example unit, lesson footer, and notes panel.

Components must preserve their current public behavior where practical. Large existing views should be split only when the new component has a clear reusable or testable responsibility. Avoid unrelated application refactors.

## Responsive behavior

- Validate 320px, 375px, 430px, 768px, 1024px, 1280px, and 1440px widths.
- No document-level horizontal overflow.
- Code, output, and tables scroll internally where necessary.
- Desktop sidebar becomes compact before it disappears; mobile navigation replaces it below the shell breakpoint.
- Dashboard composition changes from editorial grid to a single ordered stream without changing information priority.
- Lesson actions remain reachable without covering content or browser safe areas.

## Motion and feedback

- Use 120–220ms transitions for hover, focus, expand/collapse, mode changes, sheets, and copy/save feedback.
- Use no ambient looping animation.
- Completion may use one restrained check transition; it must not block navigation.
- Honor `prefers-reduced-motion` across scrolling and transitions.

## Accessibility

- Preserve semantic landmarks, headings, buttons, tabs, progress elements, dialogs, focus traps, route focus restoration, and keyboard shortcuts.
- Maintain WCAG AA contrast in both themes.
- Keep visible keyboard focus that is not dependent on glow.
- All mobile sheets and navigation overlays must restore focus to their trigger.
- Status, completion, error, and bookmark states must never depend on color alone.

## Data flow and resilience

- Existing parsed lesson, syntax, practice, and study-state data continue to flow through the current route views.
- Presentation components receive derived display data and callbacks; they do not duplicate persistence logic.
- Existing localStorage state is migrated only if a new visual preference requires it. Corrupt or unavailable storage continues to fall back safely.
- Offline status and cached assets remain available. The redesign must not introduce remote runtime dependencies that break offline use.
- UI failures should degrade to readable content and existing controls rather than blank pages.

## Implementation sequence

1. Create the revised tokens and shared visual primitives while keeping current pages functional.
2. Rebuild App Shell, desktop navigation, mobile navigation, header, and overlay surfaces.
3. Recompose the Dashboard using the existing insight and activity data.
4. Redesign Lesson Header, modes, semantic content, code/output units, TOC, notes, pagination, and Full View.
5. Apply the same system to Syntax Reference, Notes, Bookmarks, Search, Backup, empty states, and offline feedback.
6. Complete responsive, theme, accessibility, motion, regression, and production deployment verification.

## Verification

- Add or update component tests for the shell, navigation states, dashboard hierarchy, mode tabs, notes surfaces, semantic blocks, code copy feedback, sheets/dialogs, and route behavior.
- Preserve all existing study-state, content parsing, practice, reading position, PWA, backup, and search tests.
- Run typecheck, ESLint, full Vitest, practice helper tests, and production build.
- Perform visual QA in dark and light themes at all target widths, including representative Dashboard, Lesson 020, Lesson 026 fallback, Syntax Reference, Notes, Bookmarks, Search, Full View, and offline state.
- Confirm GitHub Pages base-path navigation, direct hash routes, PWA assets, and deployed production rendering.

## Success criteria

- The interface is recognizably a Python learning workspace rather than a generic AI dashboard or admin template.
- The primary action and reading hierarchy are obvious within seconds.
- Dashboard duplication and card overload are materially reduced.
- Lesson reading, code examples, outputs, notes, and navigation are clearer on both phone and desktop.
- Every existing feature and all educational content continue to work.
- Dark and light themes, keyboard use, reduced motion, offline use, backup/restore, and GitHub Pages deployment remain supported.
