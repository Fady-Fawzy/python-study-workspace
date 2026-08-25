# Dashboard Progress and Offline PWA Implementation Plan

> **For agentic workers:** This plan is executed inline in the current session because the user requested direct implementation and no subagents.

**Goal:** Make the study home more useful for tracking progress and make the static GitHub Pages app resilient to repeat visits without a network connection.

**Architecture:** Extend the existing `StudyDashboard` from the already-persisted `StudyStateV1` without changing the Summary, lesson content, or Quick Review. Add a small production-only service-worker registration helper plus repository-owned `manifest.webmanifest`, icon, and cache-first/network-fallback service worker under `public/`.

**Tech Stack:** React 19, TypeScript, Vite 6, Vitest, browser Service Worker and Cache Storage APIs.

## Global Constraints

- Keep GitHub Pages static and base-path safe at `/python-study-workspace/`.
- Do not add a backend, API, runtime AI, Python runtime, or heavy dependency.
- Preserve existing routes, notes, bookmarks, backup/restore, Detailed Study, Quick Review, and Summary source.
- Keep the UI English, responsive from 320px upward, and compatible with dark/light themes.
- Follow TDD: each new runtime behavior gets a failing test before implementation.

### Task 1: Dashboard study overview

**Files:**
- Modify: `src/views/StudyDashboard.tsx`
- Modify: `src/styles/index.css`
- Test: `src/views/StudyDashboard.test.tsx`

- [ ] Add a failing test for the four course-relative overview metrics and the next incomplete lesson action.
- [ ] Run the focused dashboard test and confirm the expected failure.
- [ ] Render metrics from sanitized `StudyStateV1`: completed, remaining, bookmarks, and notes.
- [ ] Add the next incomplete lesson as a secondary resume action while preserving the existing saved-lesson behavior.
- [ ] Add theme-aware, compact responsive styles and assert the focused tests pass.

### Task 2: PWA metadata and service-worker registration

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/icon.svg`
- Create: `public/sw.js`
- Create: `src/lib/pwa.ts`
- Modify: `src/main.tsx`
- Modify: `index.html`
- Test: `src/lib/__tests__/pwa.test.ts`

- [ ] Add a failing registration test covering production-only registration and the GitHub Pages base path.
- [ ] Run the focused PWA test and confirm it fails because the registration helper is absent.
- [ ] Implement registration on `load`, leaving development and unsupported browsers unchanged.
- [ ] Add a manifest, theme metadata, and a simple repository-owned icon.
- [ ] Implement a versioned service worker that precaches the app shell, caches same-origin assets as they load, uses network-first navigation with cached fallback, and removes old cache versions during activation.
- [ ] Run focused PWA tests and the complete verification suite.

### Task 3: Production verification

**Files:**
- Review: all changed files and `git diff`

- [ ] Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:run`, and `npm run build`.
- [ ] Confirm the generated `dist/` includes the manifest, icon, and service worker without committing generated output.
- [ ] Verify the deployed Dashboard and PWA metadata on the live GitHub Pages URL after Actions completes.
- [ ] Commit with a focused message and publish to `main` without force-pushing.
