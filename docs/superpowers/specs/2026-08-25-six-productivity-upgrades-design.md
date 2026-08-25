# Six Productivity Upgrades — Design Specification

**Date:** 2026-08-25  
**Scope:** Dashboard progress, command palette, keyboard accessibility, offline/PWA polish, light-theme polish, and search inside explanations. Practice Mode and educational lesson content are explicitly out of scope.

## Product intent

Make the existing study workspace easier to return to, navigate without a mouse, use on unreliable connections, and search as a documentation site. Preserve the current English UI, Summary, Quick Review, Detailed Study content, routes, notes, bookmarks, backup/restore, and static GitHub Pages architecture.

## Design decisions

### 1. Dashboard progress and streak

The dashboard keeps its current progress cards and gains a compact “Study activity” card with current streak, active study days in the last seven days, and a direct “Continue” action. Activity is stored in a separate versioned local-storage key so existing backup/state schema and restore behavior remain compatible. Opening a lesson records one local calendar day (deduplicated); no scroll or keystroke is recorded.

### 2. Command palette

The existing search dialog becomes a combined Search & Commands palette. With an empty query it shows keyboard-friendly quick actions for Home, Syntax Reference, Bookmarks, Notes, Backup & Restore, and Theme. Search results remain unchanged when text is entered. Commands are optional props, so the standalone modal tests and future consumers keep working.

### 3. Keyboard navigation and accessibility

Add a skip-to-content link and a focusable `main` landmark. Route changes move focus to the main landmark, while existing dialog focus trapping remains intact. Search and command controls expose `aria-keyshortcuts`, and command actions are reachable with normal Tab/Enter keyboard behavior. No visual-only interaction or mouse-only path is introduced.

### 4. Offline/PWA

Keep the service worker static and base-path safe. Bump the cache version, support an explicit `SKIP_WAITING` message, and add an in-app status indicator only when the browser is offline. The indicator is non-blocking, semantic, theme-aware, and does not claim that uncached content is available. Existing production-only registration is preserved.

### 5. Light-theme polish

Keep the current token architecture and dark code surfaces. Add theme-aware browser chrome metadata and stronger light-theme selection/focus/surface tokens. Theme application remains driven by the existing persisted preference and system-media listener; no educational content or layout redesign is involved.

### 6. Search inside explanations

Index the complete enriched lesson representation, including structured block headings, explanations, notes, comparisons, code, and expected output. Search supports all query terms (case-insensitive) and ranks exact/title matches ahead of body-only matches while preserving lesson/method/syntax result URLs and existing result labels.

## Invariants

- No runtime AI, Python runtime, backend, database, auth, or new heavy dependency.
- No changes to `src/content/practice/**`, Summary/Quick Review educational text, or original Markdown sources.
- Lessons 026–074 and all current routes continue to render.
- All new surfaces use semantic HTML, existing CSS variables, both themes, LTR isolation for code/output, and 44px touch targets where interactive.
- Fresh `npm ci`, typecheck, lint, tests, build, and diff review are required before publishing.
