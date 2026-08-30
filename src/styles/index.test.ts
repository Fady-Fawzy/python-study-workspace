/// <reference types="vite/client" />
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8');
const tokens = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

describe('markdown styling contracts', () => {
  it('uses the editorial learning palette without glass effects', () => {
    expect(tokens).toContain('--accent-python:');
    expect(tokens).toContain('--accent-learning:');
    expect(tokens).toContain('--line-strong:');
    expect(tokens).toContain('--surface-paper:');
    expect(stylesheet).not.toContain('backdrop-filter');
  });

  it('limits inline-code badge styling to code outside preformatted blocks', () => {
    expect(stylesheet).toContain(':not(pre) > code.inline-code');
    expect(stylesheet).toContain(':not(pre) > code:not([class*="language-"])');
    expect(stylesheet).not.toMatch(/(?:^|,)\s*code\.inline-code\s*(?:,|\{)/m);
  });

  it('uses logical callout borders and fallback list spacing', () => {
    expect(stylesheet).toMatch(/\.callout-box\s*\{[^}]*border-inline-start:/s);
    expect(stylesheet).toMatch(/\.study-list\s*\{[^}]*margin-inline-start:/s);
    expect(stylesheet).not.toMatch(/\.callout-box\s*\{[^}]*border-left:/s);
  });

  it('stacks lesson mode controls on phone widths while keeping them tappable', () => {
    expect(stylesheet).toMatch(
      /@media \(max-width: 430px\)[\s\S]*?\.lesson-mode-switch__tab\s*\{[^}]*flex-direction:\s*column;[^}]*min-block-size:\s*54px;/s
    );
  });

  it('keeps the Full View escape control reachable during long reading sessions', () => {
    expect(stylesheet).toMatch(
      /\.app-shell--full-view\s+\.lesson-full-view-toggle\s*\{[^}]*position:\s*fixed;[^}]*inset-block-start:\s*calc\(var\(--safe-area-top\) \+ var\(--space-3\)\);/s
    );
  });

  it('keeps Full View compact on phones and reserves space below the escape control', () => {
    expect(stylesheet).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.app-shell--full-view\s+\.app-content\s*\{[^}]*padding-block-start:\s*calc\(var\(--safe-area-top\) \+ var\(--touch-target\) \+ var\(--space-5\)\);/s
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.app-shell--full-view\s+\.lesson-full-view-toggle\s*\{[^}]*inline-size:\s*auto;/s
    );
  });

  it('stacks Quick Review labels above content on narrow screens', () => {
    expect(stylesheet).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.quick-review-entry__detail,[\s\S]*?\.quick-review-entry__code\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/s
    );
  });

  it('keeps reading navigation touch-friendly and inside the mobile safe area', () => {
    expect(stylesheet).toMatch(
      /\.lesson-reading-controls\s*\{[^}]*position:\s*fixed;[^}]*inset-block-end:\s*max\([^}]*var\(--safe-area-bottom\)/s
    );
    expect(stylesheet).toMatch(
      /\.lesson-reading-controls__button\s*\{[^}]*min-inline-size:\s*var\(--touch-target\);[^}]*min-block-size:\s*var\(--touch-target\);/s
    );
    expect(stylesheet).toMatch(
      /@media \(min-width: 1025px\)[\s\S]*?\.lesson-reading-controls\s*\{[^}]*display:\s*none;/s
    );
  });

  it('keeps detailed code, output, and tables in their own horizontal reading surfaces', () => {
    expect(stylesheet).toMatch(
      /\.code-pre\s*\{[^}]*overflow-x:\s*auto;[^}]*overscroll-behavior-inline:\s*contain;/s
    );
    expect(stylesheet).toMatch(
      /\.detailed-result-block pre\s*\{[^}]*overflow-x:\s*auto;[^}]*overscroll-behavior-inline:\s*contain;/s
    );
    expect(stylesheet).toMatch(
      /\.detailed-rich-text\s*\{[^}]*overflow-x:\s*auto;/s
    );
    expect(stylesheet).toMatch(
      /\.detailed-rich-text table\s*\{[^}]*min-width:\s*360px;/s
    );
  });

  it('keeps the narrowest phone layout explicit instead of relying on desktop spacing', () => {
    expect(stylesheet).toMatch(
      /@media \(max-width: 360px\)[\s\S]*?\.lesson-reading-controls\s*\{[^}]*inset-inline-end:\s*max\(/s
    );
  });

  it('keeps Notes 2.0 filters readable and tappable on phones', () => {
    expect(stylesheet).toMatch(
      /\.notes-toolbar\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto auto;/s
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.notes-toolbar\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/s
    );
    expect(stylesheet).toMatch(
      /\.notes-select select\s*\{[^}]*min-block-size:\s*var\(--touch-target\);/s
    );
  });

  it('makes lesson syntax links keyboard and touch friendly', () => {
    expect(stylesheet).toMatch(
      /\.lesson-syntax-links\s*\{[^}]*min-inline-size:\s*0;[^}]*max-inline-size:\s*var\(--reading-measure\);/s
    );
    expect(stylesheet).toMatch(
      /\.lesson-syntax-links__item\s*\{[^}]*min-block-size:\s*var\(--touch-target\);/s
    );
    expect(stylesheet).toMatch(
      /\.lesson-syntax-links__copy\s*\{[^}]*min-inline-size:\s*0;[^}]*overflow-wrap:\s*anywhere;/s
    );
  });

  it('contains long surfaces without removing internal code scrolling', () => {
    expect(stylesheet).toMatch(/\.app-main-wrapper\s*\{[^}]*overflow-x:\s*clip;/s);
    expect(stylesheet).toMatch(/\.dashboard-topic,[\s\S]*?content-visibility:\s*auto;/s);
    expect(stylesheet).toMatch(/contain-intrinsic-size:\s*auto\s+180px;/s);
  });

  it('gives lesson and dashboard reading progress a compact, theme-aware meter', () => {
    expect(stylesheet).toMatch(
      /\.lesson-progress\s*\{[^}]*min-inline-size:\s*0;[^}]*max-inline-size:\s*100%;/s
    );
    expect(stylesheet).toMatch(
      /\.lesson-progress progress,[\s\S]*?\.dashboard-continue__progress progress\s*\{[^}]*inline-size:\s*100%;/s
    );
    expect(stylesheet).toMatch(/\.dashboard-continue__progress-header\s*\{[^}]*display:\s*flex;/s);
    expect(stylesheet).toMatch(/\.dashboard-overview__next-reason\s*\{[^}]*color:\s*var\(--text-muted\);/s);
    expect(stylesheet).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.dashboard-continue__progress\s*\{[^}]*max-inline-size:\s*100%;/s
    );
  });

  it('gives Dashboard 2.0 focus and attention surfaces compact responsive contracts', () => {
    expect(stylesheet).toMatch(
      /\.dashboard-focus\s*\{[^}]*display:\s*grid;[^}]*min-inline-size:\s*0;/s
    );
    expect(stylesheet).toMatch(
      /\.dashboard-focus__progress progress\s*\{[^}]*appearance:\s*none;[^}]*background-color:\s*var\(--bg-surface-raised\);/s
    );
    expect(stylesheet).toMatch(
      /\.dashboard-attention__row\s*\{[^}]*min-block-size:\s*var\(--touch-target\);[^}]*min-inline-size:\s*0;/s
    );
    expect(stylesheet).toMatch(
      /\.dashboard-lesson-row__progress\s*\{[^}]*display:\s*flex;[^}]*min-inline-size:\s*0;/s
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.dashboard-focus\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/s
    );
  });

  it('keeps the lesson study dock sticky, opaque, and clear of targeted headings', () => {
    expect(tokens).toContain('--lesson-dock-offset:');
    expect(stylesheet).toMatch(
      /\.lesson-study-dock\s*\{[^}]*position:\s*sticky;[^}]*inset-block-start:\s*var\(--lesson-dock-top\);[^}]*z-index:\s*var\(--z-navigation\);[^}]*background-color:\s*var\(--surface-paper\);/s
    );
    expect(stylesheet).toMatch(
      /\.detailed-heading,[\s\S]*?\.lesson-section-heading\s*\{[^}]*scroll-margin-block-start:\s*var\(--lesson-dock-offset\);/s
    );
  });

  it('shares wide lesson space with a real notes side panel without crushing prose', () => {
    expect(stylesheet).toMatch(
      /@media \(min-width: 1180px\)[\s\S]*?\.lesson-workspace\[data-notes-open\]\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(280px, 320px\);/s
    );
    expect(stylesheet).toMatch(
      /@media \(min-width: 1180px\)[\s\S]*?\.lesson-workspace\[data-notes-open\]\s*>\s*\.desktop-toc-container\s*\{[^}]*display:\s*none;/s
    );
    expect(stylesheet).toMatch(
      /@media \(min-width: 1440px\)[\s\S]*?\.lesson-workspace\[data-notes-open\]\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) var\(--toc-width\) minmax\(280px, 320px\);/s
    );
    expect(stylesheet).toMatch(
      /@media \(min-width: 1180px\)[\s\S]*?\.lesson-notes-backdrop\[data-desktop\]\s*\{[^}]*position:\s*sticky;[^}]*background:\s*transparent;/s
    );
  });

  it('turns notes into a safe-area bottom sheet below the wide breakpoint', () => {
    expect(stylesheet).toMatch(
      /@media \(max-width: 1179px\)[\s\S]*?\.lesson-notes-backdrop:not\(\[data-desktop\]\)\s*\{[^}]*position:\s*fixed;[^}]*inset:\s*0;[^}]*padding-inline:[^}]*var\(--safe-area-left\)[^}]*var\(--safe-area-right\)[^;}]*;/s
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 1179px\)[\s\S]*?\.lesson-notes-surface\s*\{[^}]*max-block-size:\s*calc\(88dvh - var\(--safe-area-top\)\);[^}]*padding-block-end:\s*var\(--safe-area-bottom\);/s
    );
  });

  it('retains study tools in Full View and removes motion from the new surfaces', () => {
    expect(stylesheet).toMatch(
      /\.app-shell--full-view\s+\.lesson-study-dock\s*\{[^}]*inset-block-start:\s*var\(--safe-area-top\);/s
    );
    expect(stylesheet).toMatch(
      /\.app-shell--full-view\s+\.lesson-notes-surface\s*\{[^}]*border-color:\s*var\(--line-strong\);/s
    );
    expect(stylesheet).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.lesson-notes-surface,[\s\S]*?\.lesson-study-dock\s*\{[^}]*transition:\s*none;/s
    );
  });
});
