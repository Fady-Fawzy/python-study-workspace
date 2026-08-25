# Python Study Workspace (Lessons 20 → 74)

A fast, responsive, personal Python study workspace and syntax reference built directly around Elzero Web School's Python course (Lessons 20 to 74).

**Live Website**: [https://fady-fawzy.github.io/python-study-workspace/](https://fady-fawzy.github.io/python-study-workspace/)

---

## 🎯 Features

- **Live Content Pipeline**: Directly imports and parses `elzero_python_lessons_20_to_74.md` (55 lessons), `python_syntax_reference_elzero_20_74.md` (67 syntax sections), and optional enriched Detailed Study Markdown.
- **Dual Study Modes**:
  - `Detailed Study`: Enriched teaching content for all Lessons 020–074 with explanations, semantic result/error blocks, comparisons, mental models, and repository-owned examples.
  - `Quick Review`: Deterministic mapping displaying concise syntax rules, parameter breakdowns, and cheat sheet patterns directly within the active lesson.
- **Practice Mode**: A third, mobile-friendly mode for Lessons 020–025 with predict-the-output, concept-check, instant explanations, score tracking, and local progress persistence. It uses stored verified outputs and never executes Python in the browser.
- **Syntax Reference Browser (`/#/reference`)**: Complete explorer covering all 67 sections categorized across 10 structured domains with real-time keyword search.
- **Global Search (`Ctrl+K`)**: Ranked search prioritizing exact lesson numbers, method signatures (`append()`, `kwargs`, `filter()`, `lambda`), and syntax topics.
- **Personal Notes & Data Protection**: Debounced autosaving study notes per lesson with 1-click JSON Backup & Restore for data loss prevention.
- **Study Overview**: Course-relative completed, remaining, bookmark, and note counts plus a one-tap link to the next incomplete lesson.
- **Offline-Ready PWA**: Installable GitHub Pages app with a static manifest and service worker that caches the app shell and previously visited assets for offline revisits.
- **Mobile-First**: Zero horizontal overflow, touch-optimized navigation drawer, and safe-area insets across screen widths from 320px to 1440px+.

---

## 📁 Source Markdown Files

The workspace preserves these two root files as the original course-wide sources:

1. `elzero_python_lessons_20_to_74.md` — Detailed lesson explanations, code examples, and walkthroughs for lessons 20 through 74.
2. `python_syntax_reference_elzero_20_74.md` — Condensed syntax reference, cheat sheets, mental models, and common pitfalls.

Lessons 020–074 also have individually maintainable enriched teaching files in `src/content/detailed/`. They reuse the repository-owned training examples and add original explanations plus deterministic, interactive, or environment-dependent result labels. If an enriched file is absent for a future lesson, the application still renders the original lesson content.

---

## 🛠️ Technology Stack

- **Framework**: Vite 6 + React 19 + TypeScript 5
- **Linting & Code Quality**: ESLint 9 (Flat Config) with TypeScript & React Hooks plugins
- **Automated Testing**: Vitest 3 with jsdom
- **Icons**: Lucide React
- **Markdown AST**: Marked
- **Syntax Highlighting**: PrismJS (Python grammar)
- **Styling**: Custom CSS design tokens with Dark & Light theme support
- **Hosting & CI/CD**: GitHub Pages via GitHub Actions

---

## 🚀 Development & Scripts

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to start studying with instant live hot module replacement.

### 3. Quality & Verification Commands

```bash
# Run TypeScript compiler check (no output files)
npm run typecheck

# Run ESLint across TypeScript and React code
npm run lint

# Run Vitest in interactive watch mode
npm run test

# Run all automated test suites once
npm run test:run

# Build production bundle to dist/
npm run build

# Preview production build locally
npm run preview

# Optional local Gemini authoring aid (never required by the site)
GEMINI_API_KEY="your-local-key" npm run practice:draft -- 020

# Validate the local draft authoring helper
npm run practice:test
```

The optional Gemini command is for local question-draft authoring only. Keep `GEMINI_API_KEY` in the process environment, never in source code or client-side Vite variables. Review drafts in `tmp/practice-drafts/` before manually transferring approved questions into `src/content/practice/`.

---

## 🛡️ Quality Pipeline & CI/CD

Deployment to GitHub Pages is gated behind a strict multi-stage verification pipeline in `.github/workflows/deploy.yml`:

```text
git push origin main
       ↓
    npm ci
       ↓
npm run typecheck   ──(TypeScript Check)──► [Fail: Block Deploy]
       ↓
  npm run lint      ────(ESLint 9)────────► [Fail: Block Deploy]
       ↓
npm run test:run    ──(Vitest Suite)──────► [Fail: Block Deploy]
       ↓
 npm run build      ───(Vite Build)───────► [Fail: Block Deploy]
       ↓
GitHub Pages Deploy ───(Live Production)──► https://fady-fawzy.github.io/python-study-workspace/
```

If **any** verification step fails (TypeScript, Lint, Test, or Build), GitHub Actions immediately halts and blocks deployment to protect the live study environment.
