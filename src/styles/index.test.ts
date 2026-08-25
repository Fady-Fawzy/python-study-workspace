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
});
