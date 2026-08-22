# Python Study Workspace (Lessons 20 → 74)

A fast, responsive, personal Python study workspace and syntax reference built directly around Elzero Web School's Python course (Lessons 20 to 74).

**Live Website**: [https://fady-fawzy.github.io/python-study-workspace/](https://fady-fawzy.github.io/python-study-workspace/)

---

## 🎯 Features

- **Live Content Pipeline**: Directly imports and parses `elzero_python_lessons_20_to_74.md` (55 lessons) and `python_syntax_reference_elzero_20_74.md` (67 syntax sections).
- **Dual Study Modes**:
  - `Detailed Study`: High-contrast reading layout with bidirectional Arabic/English isolation and syntax-highlighted code blocks with copy feedback.
  - `Quick Review`: Deterministic mapping displaying concise syntax rules, parameter breakdowns, and cheat sheet patterns directly within the active lesson.
- **Syntax Reference Browser (`/#/reference`)**: Complete explorer covering all 67 sections categorized across 10 structured domains with real-time keyword search.
- **Global Search (`Ctrl+K`)**: Ranked search prioritizing exact lesson numbers, method signatures (`append()`, `kwargs`, `filter()`, `lambda`), and syntax topics.
- **Personal Notes & Data Protection**: Debounced autosaving study notes per lesson with 1-click JSON Backup & Restore for data loss prevention.
- **Mobile-First**: Zero horizontal overflow, touch-optimized navigation drawer, and safe-area insets across screen widths from 320px to 1440px+.

---

## 📁 Source Markdown Files

The workspace treats these two root files as the source of truth:

1. `elzero_python_lessons_20_to_74.md` — Detailed lesson explanations, code examples, and walkthroughs for lessons 20 through 74.
2. `python_syntax_reference_elzero_20_74.md` — Condensed syntax reference, cheat sheets, mental models, and common pitfalls.

---

## 🛠️ Technology Stack

- **Framework**: Vite 6 + React 19 + TypeScript
- **Icons**: Lucide React
- **Markdown AST**: Marked
- **Syntax Highlighting**: PrismJS (Python grammar)
- **Styling**: Custom CSS design tokens with Dark & Light theme support
- **Hosting & CI/CD**: GitHub Pages via GitHub Actions

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to start studying with hot module replacement.

### 3. Production Build

```bash
npm run build
```

The output bundle is generated in `dist/`.

### 4. Preview Production Build Locally

```bash
npm run preview
```

---

## 🔄 Deployment

The repository uses GitHub Actions (`.github/workflows/deploy.yml`) to automatically build and deploy the production bundle to GitHub Pages whenever changes are pushed to `main`.
