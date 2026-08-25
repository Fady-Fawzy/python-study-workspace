# Practice Mode Implementation Plan

> **For agentic workers:** This plan is executed inline in the current session because the user requested direct implementation and no subagents.

**Goal:** Add a professional, static, mobile-first Practice Mode for lessons 020–025 with verified questions, immediate explanations, persisted progress, and no exposed Gemini credentials.

**Architecture:** Keep practice content in a typed repository-owned content layer under `src/content/practice/`, validate it through a central map, and render it through a focused `PracticeContent` component selected by `LessonView`. Extend the existing sanitized `StudyStateV1` with optional per-lesson practice progress and preserve old state/backup compatibility. Provide an optional local-only Gemini authoring script that reads `GEMINI_API_KEY` from the environment and writes drafts outside the production bundle; runtime behavior never calls Gemini or executes Python.

**Tech Stack:** React 19, TypeScript, Vite 6, Vitest, Testing Library, localStorage, Node `fetch` for the optional authoring script.

**Spec:** `docs/superpowers/specs/2026-08-25-practice-mode-design.md`

## Global Constraints

- Practice is available only for lessons 020–025 in this iteration; lessons 026–074 keep the existing two modes and Detailed fallback.
- The browser must not contain or request a Gemini API key; Gemini is local authoring-only through `GEMINI_API_KEY`.
- Do not add a backend, database, authentication, Pyodide, WebAssembly Python, or runtime Python execution.
- Preserve the original Markdown source, Summary, Quick Review content, routes, bookmarks, notes, Full View, dashboard, and backup behavior.
- Keep UI copy English, support dark/light themes, and prevent page-level horizontal overflow from 320px through desktop widths.
- Every production behavior change follows TDD: write a focused failing test, run it to observe the expected failure, implement the smallest change, then run it green.

### Task 1: Define and validate practice content types

**Files:**
- Modify: `src/types/content.ts`
- Create: `src/types/practice.ts`
- Create: `src/content/practice/020.ts`
- Create: `src/content/practice/021.ts`
- Create: `src/content/practice/022.ts`
- Create: `src/content/practice/023.ts`
- Create: `src/content/practice/024.ts`
- Create: `src/content/practice/025.ts`
- Create: `src/content/practice/index.ts`
- Create: `src/lib/practiceContent.ts`
- Test: `src/lib/__tests__/practiceContent.test.ts`

**Interfaces:**
- `PracticeQuestion`: stable `id`, `type`, `prompt`, optional `code`, optional `output`, `choices`, `correctAnswer`, and `explanation`.
- `PracticeLesson`: `id`, `number`, `title`, and a non-empty `questions` array.
- `PracticeLessonMap`: `Record<string, PracticeLesson>`.
- `parsePracticeLessons(sources)` returns a validated `PracticeLessonMap` and throws descriptive errors for duplicate/mismatched IDs, invalid answer indexes, missing explanations, or too few choices.
- `selectPracticeLesson(lessonId, map)` returns a lesson or `undefined`.

- [ ] **Step 1: Write the failing content contract test**

  Assert that the six IDs are exactly `020` through `025`, each title/questions list is non-empty, every question has a supported type and explanation, choice questions have at least two choices with a valid correct answer, and lesson IDs map to the correct titles. Assert that 026 is absent.

- [ ] **Step 2: Run the focused test to verify the expected failure**

  Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm test -- src/lib/__tests__/practiceContent.test.ts --run`.
  Expected: FAIL because the practice content module and map do not exist.

- [ ] **Step 3: Implement the typed model, validator, and central map**

  Define the interfaces, export six lesson objects from separate files, and make the parser validate the complete map without requiring Markdown or runtime generation.

- [ ] **Step 4: Add verified question banks for lessons 020–025**

  Include multiple-choice, predict-output, and behavior questions based only on repository lesson examples. Store deterministic output and explanations such as precedence, list mutability, append/extend nesting, sort returning `None`, remove/pop, tuple immutability, and one-item tuple commas.

- [ ] **Step 5: Run the focused test to verify it passes**

  Run the same focused command and confirm all content contract assertions pass.

- [ ] **Step 6: Commit the content layer**

  Run `git add src/types/content.ts src/types/practice.ts src/content/practice src/lib/practiceContent.ts src/lib/__tests__/practiceContent.test.ts && git commit -m "feat: add verified practice question banks"`.

### Task 2: Persist and sanitize practice progress

**Files:**
- Modify: `src/types/state.ts`
- Modify: `src/lib/storage.ts`
- Test: `src/lib/__tests__/storage.test.ts`
- Test: `src/lib/__tests__/backup.test.ts`

**Interfaces:**
- `PracticeProgress`: `questionIndex`, `answers: Record<string, number>`, `score`, `completed`.
- `StudyStateV1.practiceProgress?: Record<string, PracticeProgress>`.
- `sanitizePracticeProgress(value)` removes malformed lesson records, invalid indexes, non-integer answers, and non-boolean completion flags while preserving unrelated state.

- [ ] **Step 1: Write failing storage tests**

  Add tests proving old state without `practiceProgress` loads with `{}`, malformed progress is removed without resetting bookmarks/notes, and backup import/export round-trips valid progress.

- [ ] **Step 2: Run focused storage and backup tests to verify failure**

  Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm test -- src/lib/__tests__/storage.test.ts src/lib/__tests__/backup.test.ts --run`.
  Expected: FAIL because the state type and sanitizer do not expose practice progress.

- [ ] **Step 3: Implement the optional state field and sanitizer**

  Keep `version: 1` and the existing storage key for backward compatibility. Initialize new state with an empty record, sanitize each lesson record defensively, and make backup types include the same state shape.

- [ ] **Step 4: Run focused tests to verify green**

  Re-run the storage and backup command and confirm the new assertions plus all existing assertions pass.

- [ ] **Step 5: Commit persistence**

  Run `git add src/types/state.ts src/lib/storage.ts src/lib/__tests__/storage.test.ts src/lib/__tests__/backup.test.ts && git commit -m "feat: persist practice progress safely"`.

### Task 3: Build the Practice content renderer

**Files:**
- Create: `src/components/lesson/PracticeContent.tsx`
- Test: `src/components/lesson/PracticeContent.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Props: `lesson: PracticeLesson`, `progress?: PracticeProgress`, `onProgressChange: (progress: PracticeProgress) => void`.
- Emits a sanitized progress snapshot after answer, navigation, restart, and completion actions.

- [ ] **Step 1: Write failing component tests**

  Assert that the first question displays position/score/progress, selecting a choice reveals Correct or Not quite plus the stored explanation, Next advances, Finish shows a completion summary, and Restart clears answers/score. Use real `userEvent` interactions and a small in-test lesson fixture.

- [ ] **Step 2: Run the focused test and verify the expected failure**

  Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm test -- src/components/lesson/PracticeContent.test.tsx --run`.
  Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the minimal accessible renderer**

  Render the question as semantic headings/paragraphs/code/output, answer choices as buttons, a progress bar with `aria-valuenow`, and explicit status/explanation text. Disable answer buttons after selection and keep all code/output containers LTR.

- [ ] **Step 4: Add responsive theme-aware styles**

  Reuse existing CSS tokens and code block conventions. Keep controls at comfortable tap sizes, stack the panel on narrow screens, allow only internal code scrolling, and visually distinguish question, result, explanation, and completion states without relying only on color.

- [ ] **Step 5: Run focused tests to verify green**

  Re-run the component test and confirm all interaction assertions pass.

- [ ] **Step 6: Commit renderer**

  Run `git add src/components/lesson/PracticeContent.tsx src/components/lesson/PracticeContent.test.tsx src/styles/index.css && git commit -m "feat: add accessible practice renderer"`.

### Task 4: Integrate the Practice tab without changing existing modes

**Files:**
- Modify: `src/components/lesson/LessonHeader.tsx`
- Modify: `src/components/lesson/LessonHeader.test.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/LessonView.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `LessonHeader` receives `hasPractice` and accepts `activeMode: 'detailed' | 'quickReview' | 'practice'`.
- `LessonView` selects a practice bank by lesson ID, keeps Practice hidden when no bank exists, and persists progress through `onUpdateState`.

- [ ] **Step 1: Write failing integration tests**

  Assert lesson 020 exposes a Practice tab, lesson 026 does not, choosing Practice renders the question panel and updates `practiceProgress`, and the existing Quick Review tab still switches and remains concise.

- [ ] **Step 2: Run focused LessonHeader/LessonView tests to verify failure**

  Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm test -- src/components/lesson/LessonHeader.test.tsx src/views/LessonView.test.tsx --run`.
  Expected: FAIL because the new tab and props do not exist.

- [ ] **Step 3: Extend the tablist keyboard behavior safely**

  Build the mode list dynamically from `hasPractice`, keep arrow/Home/End navigation valid, use `Practice` labels/IDs, and preserve the existing detailed/quickReview preference behavior.

- [ ] **Step 4: Wire `PracticeContent` and persisted progress**

  Pass the selected lesson bank and the lesson's progress record, update only that lesson's record through `onUpdateState`, and leave Detailed fallback behavior unchanged for all lessons without enriched content or practice content.

- [ ] **Step 5: Run focused integration tests to verify green**

  Re-run the focused command and confirm mode switching, fallback, persistence, and Quick Review assertions pass.

- [ ] **Step 6: Commit integration**

  Run `git add src/components/lesson/LessonHeader.tsx src/components/lesson/LessonHeader.test.tsx src/views/LessonView.tsx src/views/LessonView.test.tsx src/App.tsx && git commit -m "feat: integrate practice mode into lessons"`.

### Task 5: Add optional local Gemini authoring support

**Files:**
- Create: `scripts/generate-practice-draft.mjs`
- Modify: `package.json`
- Create: `scripts/README.md`
- Test: `scripts/generate-practice-draft.test.mjs` or a pure validation test under `src/lib/__tests__/practiceDraft.test.ts`

**Interfaces:**
- Command: `GEMINI_API_KEY=... npm run practice:draft -- 020`.
- The script exits non-zero if the key is absent, the API responds unsuccessfully, or the response is not valid JSON matching the draft schema.
- The script writes only to an ignored/local `tmp/practice-drafts/` path and never modifies `src/content/practice/` automatically.

- [ ] **Step 1: Write failing validation tests**

  Test the pure response validator with one valid draft and invalid drafts missing explanations, with duplicate question IDs, and with a correct answer outside the choices array.

- [ ] **Step 2: Run the focused test to verify failure**

  Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm test -- src/lib/__tests__/practiceDraft.test.ts --run`.
  Expected: FAIL because the validator/module is absent.

- [ ] **Step 3: Implement the validator and guarded authoring command**

  Read `GEMINI_API_KEY` only from `process.env`, use the current Gemini generate-content REST endpoint, constrain the prompt to repository lesson text supplied as input, parse JSON defensively, validate it, and write a draft file outside the production source tree. Never log the key or raw authorization header.

- [ ] **Step 4: Add script documentation and package command**

  Document local usage, explicitly state that the key must not be committed, and make the command optional so normal install/build/test paths do not require a key or network access.

- [ ] **Step 5: Run focused tests and static inspection**

  Confirm validator tests pass and `rg -n "GEMINI_API_KEY|AIza|generativelanguage" src public dist` finds no key or runtime API usage.

- [ ] **Step 6: Commit authoring support**

  Run `git add scripts package.json src/lib/__tests__/practiceDraft.test.ts .gitignore && git commit -m "feat: add local practice draft authoring tool"`.

### Task 6: Regression, mobile QA, and release verification

**Files:**
- Review: all changed files, `README.md`, `git diff`
- Test: existing project suite

- [ ] Run a fresh `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm ci`.
- [ ] Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run typecheck` and confirm exit 0.
- [ ] Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run lint` and confirm exit 0.
- [ ] Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run test:run` and confirm zero failures.
- [ ] Run `NPM_CONFIG_CACHE=/tmp/python-study-workspace-npm-cache npm run build` and confirm the static bundle contains no Gemini secret or runtime API call.
- [ ] Use the browser to inspect 020–025 Practice, 026 fallback, Quick Review, Full View, notes, and mobile widths 320/360/390/430/768/1024/1440; verify no page overflow and correct code/output direction.
- [ ] Review `git status`, `git diff --stat`, and `git diff`; ensure Summary, original Markdown, dist, node_modules, and unrelated files are untouched.
- [ ] Publish the verified commits to `main` without force-pushing, inspect the GitHub Actions quality/deploy jobs, and verify the live Practice routes and fallback behavior.
