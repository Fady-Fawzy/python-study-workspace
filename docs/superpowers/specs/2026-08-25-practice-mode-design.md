# Practice Mode Design

## Goal

Add a professional, mobile-first Practice Mode for lessons 020–025 that teaches through repository-owned questions, immediate explanations, and saved progress while keeping the GitHub Pages application static, offline-friendly, and safe.

## Scope

Practice Mode is initially available for lessons 020–025 only. Lessons 026–074 keep their existing Detailed Study and Quick Review behavior; they do not become blank or acquire a partial practice interface.

The site UI remains English, matching the current application language. The question bank uses the existing repository-owned lesson examples and verified Python semantics. The existing Summary source and Quick Review content are not modified.

## Security and Gemini Boundary

The browser must never receive a Gemini API key. A static GitHub Pages bundle cannot protect a key, so no `VITE_*` Gemini key, fetch call, secret, or generated response is shipped to production.

Gemini is an optional local authoring aid only. A Node script may read `GEMINI_API_KEY` from the process environment, send a constrained prompt for draft question suggestions, validate the response shape, and write a reviewable draft outside the production content path. The final question bank is manually reviewed and committed as static content. The feature remains fully usable without Gemini, without a network connection, and without executing Python in the browser.

## User Experience

Lessons with practice content expose a third accessible tab named `Practice` beside `Detailed Study` and `Quick Review`. The tab uses the existing tablist keyboard behavior and is omitted for lessons without practice content.

The Practice panel contains:

- a compact header with lesson title, question position, and score;
- a progress bar with an accessible label;
- one question at a time, with a clear question type label;
- answer choices as real keyboard-focusable buttons;
- disabled answer controls after submission so a score cannot be changed accidentally;
- an immediate Correct/Not quite status with the stored explanation;
- Next, Previous, Restart, and Finish controls where applicable;
- a completion summary with score, percentage, and a retry action.

On small screens, the panel uses a single column, comfortable tap targets, and no page-level horizontal overflow. Code and output are rendered LTR with monospace styling; explanatory copy is English and follows the existing semantic content patterns. Light and dark themes reuse the existing design tokens.

## Content Model

Practice content is repository-owned and separated from presentation. Each lesson file exports a `PracticeLesson` object through a central map. A question has:

- stable `id` scoped to its lesson;
- `type`: `multiple-choice`, `predict-output`, or `behavior`;
- prompt text;
- optional Python code snippet and expected output text;
- two or more answer choices for choice questions;
- the correct choice/value;
- a concise explanation of what happened and why.

The initial six lesson banks should cover the lesson's core operators/data-structure behavior rather than random trivia. Deterministic outputs are stored in the content and verified against Python semantics during authoring; the browser never evaluates Python.

## State and Persistence

Extend the existing sanitized study state with an optional `practiceProgress` record keyed by lesson ID. Each record stores the current question index, selected answers, score, and whether the run is complete. Existing state fields, the storage key, and backup import/export remain backward compatible: old backups load with an empty practice record, and malformed practice entries are discarded by the sanitizer.

The preferred lesson mode remains `detailed` or `quickReview`; Practice is an opt-in per-lesson tab and must not change the existing preference semantics for lessons that do not have a practice bank.

## Data Flow

```text
src/content/practice/*
        ↓
validated PracticeLesson map
        ↓
App / LessonView selects bank by lesson ID
        ↓
PracticeContent renders one question
        ↓
onUpdateState persists sanitized progress
```

The optional Gemini authoring script is outside this runtime flow:

```text
GEMINI_API_KEY (local environment only)
        ↓
authoring script → draft JSON
        ↓
manual review + semantic validation
        ↓
committed static practice content
```

## Error and Fallback Behavior

- If a lesson has no practice bank, do not render the Practice tab.
- If persisted progress references an unknown question or invalid answer, reset only that lesson's practice progress; preserve all other study state.
- If the local Gemini authoring call fails, the script exits with a useful error and does not alter committed content.
- Content validation tests fail on duplicate IDs, missing explanations, empty choices, invalid correct answers, or lesson mismatch.

## Testing Requirements

Use TDD for runtime behavior. Add focused tests before implementation for:

1. practice content validation and mapping for 020–025;
2. tab visibility and fallback behavior for a lesson with/without practice;
3. selecting an answer, showing the explanation, moving between questions, and completing/restarting a run;
4. practice progress sanitization, old-state migration, and backup round-trip;
5. preservation of Quick Review and existing mode preference behavior.

Run the complete project gates before publishing: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:run`, and `npm run build`.

## Non-Goals

- no runtime Gemini API integration;
- no backend, authentication, database, or subscription system;
- no Pyodide/WebAssembly/Python execution in the browser;
- no Practice content for lesson 026 or later in this iteration;
- no changes to the original Markdown source or Summary section.
