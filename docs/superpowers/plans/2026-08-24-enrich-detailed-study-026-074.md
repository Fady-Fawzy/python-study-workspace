# Detailed Study Lessons 026–074 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the repository-backed Detailed Study experience from Lesson 026 through Lesson 074 while leaving Summary / Quick Review content and behavior unchanged.

**Architecture:** Reuse the existing static Markdown content layer and semantic detailed-content parser introduced for Lessons 020–025. Add one maintainable Markdown source per lesson, import the sources statically, and render them through the existing DetailedLessonContent path; only extend parser semantics when a lesson genuinely needs a distinct deterministic, interactive, or environment-dependent result label.

**Tech Stack:** React, TypeScript, Vite raw Markdown imports, marked, Vitest, Testing Library, ESLint.

**Spec:** User request in the active conversation, extending the established Detailed Study design for the remaining repository lessons.

## Global Constraints

- Author lessons in numerical order from 026 through 074.
- Use only the training-equivalent examples already present in `elzero_python_lessons_20_to_74.md`.
- Keep `python_syntax_reference_elzero_20_74.md`, Summary, and `QuickReviewContent` unchanged.
- Store educational prose in `src/content/detailed/NNN.md`, never in React components.
- Keep Python and result blocks LTR; explanatory Arabic uses RTL/auto direction.
- Preserve the static, offline-friendly GitHub Pages architecture with no Python runtime or AI API.
- Keep TOC entries limited to primary H2 educational concepts.
- Validate deterministic outputs and label input-dependent or environment-dependent transcripts accurately.

---

### Task 1: Result Semantics Needed by Later Lessons

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/lib/detailedContent.ts`
- Modify: `src/components/lesson/DetailedLessonContent.tsx`
- Test: `src/lib/__tests__/detailedContent.test.ts`
- Test: `src/components/lesson/DetailedLessonContent.test.tsx`

**Interfaces:**
- Consumes: fenced Markdown blocks from detailed lesson sources.
- Produces: semantic `example-run` and `example-output` blocks with accessible labels.

- [ ] **Step 1: Write failing parser and renderer tests for `example-run` and `example-output`.**
- [ ] **Step 2: Run the focused tests and confirm they fail because those types are unsupported.**
- [ ] **Step 3: Add the two block types, parser mapping, and renderer labels with no unrelated behavior change.**
- [ ] **Step 4: Run the focused tests and confirm they pass.**

### Task 2: Sets and Dictionaries — Lessons 026–032

**Files:**
- Create: `src/content/detailed/026.md` through `032.md`
- Modify: `src/content/detailed/index.ts`
- Test: `src/lib/__tests__/detailedContent.test.ts`

**Interfaces:**
- Consumes: Set and Dictionary examples from the original lesson source.
- Produces: parsed, searchable DetailedLesson entries for IDs 026–032.

- [ ] **Step 1: Add failing structural and semantic tests for IDs 026–032.**
- [ ] **Step 2: Run them and confirm missing-source failures.**
- [ ] **Step 3: Author/import lessons in order, including method comparisons and verified result explanations.**
- [ ] **Step 4: Run focused content and renderer tests.**

### Task 3: Operators, Conversion, and Input — Lessons 033–040

**Files:**
- Create: `src/content/detailed/033.md` through `040.md`
- Modify: `src/content/detailed/index.ts`
- Test: `src/lib/__tests__/detailedContent.test.ts`

**Interfaces:**
- Consumes: Boolean, operator, conversion, input, slicing, and age examples.
- Produces: parsed DetailedLesson entries for IDs 033–040 with deterministic or example-run labels.

- [ ] **Step 1: Add and run failing coverage tests for 033–040.**
- [ ] **Step 2: Author/import each lesson in numerical order.**
- [ ] **Step 3: Validate transcript labels and run focused tests.**

### Task 4: Control Flow and Membership — Lessons 041–046

**Files:**
- Create: `src/content/detailed/041.md` through `046.md`
- Modify: `src/content/detailed/index.ts`
- Test: `src/lib/__tests__/detailedContent.test.ts`

**Interfaces:**
- Consumes: conditions, ternary expressions, membership, and training examples.
- Produces: parsed DetailedLesson entries for IDs 041–046.

- [ ] **Step 1: Add and run failing coverage tests for 041–046.**
- [ ] **Step 2: Author/import each lesson in numerical order.**
- [ ] **Step 3: Run focused tests and inspect TOC semantics.**

### Task 5: While and For Loops — Lessons 047–055

**Files:**
- Create: `src/content/detailed/047.md` through `055.md`
- Modify: `src/content/detailed/index.ts`
- Test: `src/lib/__tests__/detailedContent.test.ts`

**Interfaces:**
- Consumes: loop, bookmark, password, nesting, control-statement, and dictionary-loop examples.
- Produces: parsed DetailedLesson entries for IDs 047–055 with input-dependent runs labeled correctly.

- [ ] **Step 1: Add and run failing coverage tests for 047–055.**
- [ ] **Step 2: Author/import each lesson in numerical order.**
- [ ] **Step 3: Run focused tests and verify loop explanations avoid fabricated transcripts.**

### Task 6: Functions — Lessons 056–064

**Files:**
- Create: `src/content/detailed/056.md` through `064.md`
- Modify: `src/content/detailed/index.ts`
- Test: `src/lib/__tests__/detailedContent.test.ts`

**Interfaces:**
- Consumes: function, arguments, packing/unpacking, scope, recursion, and lambda examples.
- Produces: parsed DetailedLesson entries for IDs 056–064.

- [ ] **Step 1: Add and run failing coverage tests for 056–064.**
- [ ] **Step 2: Author/import each lesson in numerical order with return-value and scope mental models.**
- [ ] **Step 3: Run focused tests and validate examples.**

### Task 7: File Handling — Lessons 065–068

**Files:**
- Create: `src/content/detailed/065.md` through `068.md`
- Modify: `src/content/detailed/index.ts`
- Test: `src/lib/__tests__/detailedContent.test.ts`

**Interfaces:**
- Consumes: repository file-handling examples.
- Produces: parsed DetailedLesson entries for IDs 065–068 using environment-dependent labels where needed.

- [ ] **Step 1: Add and run failing coverage tests for 065–068.**
- [ ] **Step 2: Author/import each lesson in numerical order without inventing paths or file contents.**
- [ ] **Step 3: Run focused tests.**

### Task 8: Built-in Functions — Lessons 069–074

**Files:**
- Create: `src/content/detailed/069.md` through `074.md`
- Modify: `src/content/detailed/index.ts`
- Test: `src/lib/__tests__/detailedContent.test.ts`

**Interfaces:**
- Consumes: built-in, map, filter, and reduce examples.
- Produces: parsed DetailedLesson entries for IDs 069–074.

- [ ] **Step 1: Add and run failing coverage tests for 069–074.**
- [ ] **Step 2: Author/import each lesson in numerical order.**
- [ ] **Step 3: Run focused tests and validate function-return explanations.**

### Task 9: Full Regression, Review, Publish, and Production QA

**Files:**
- Modify only if a verified failure requires a scoped fix.

**Interfaces:**
- Consumes: complete enriched source map for 020–074.
- Produces: verified `main`, green GitHub Pages workflow, and live Detailed Study pages.

- [ ] **Step 1: Run `npm ci`, typecheck, lint, tests, and production build from fresh outputs.**
- [ ] **Step 2: Confirm Summary / Quick Review files are byte-for-byte unchanged and review `git diff --check`, status, stat, and full diff.**
- [ ] **Step 3: Commit the 026–074 expansion with a focused message and publish to `main` without force.**
- [ ] **Step 4: Inspect the GitHub Actions workflow and fix any reproducible failures.**
- [ ] **Step 5: Verify representative and boundary lessons plus Quick Review on the live GitHub Pages site.**
