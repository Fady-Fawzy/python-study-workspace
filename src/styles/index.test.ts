/// <reference types="vite/client" />
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8');

describe('markdown styling contracts', () => {
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
      /\.app-shell--full-view\s+\.lesson-header__topline\s*\{[^}]*position:\s*sticky;[^}]*top:\s*var\(--safe-area-top\);/s
    );
  });
});
