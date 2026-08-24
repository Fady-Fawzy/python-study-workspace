import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TableOfContents } from './TableOfContents';

describe('TableOfContents', () => {
  it('right-aligns Arabic rows and isolates a leading Python identifier as LTR', () => {
    const html = renderToStaticMarkup(
      <TableOfContents items={[
        { id: 'clear', text: 'clear() — تفريغ نفس الـ Set', level: 2 },
        { id: 'union', text: 'union() — اتحاد المجموعات', level: 2 }
      ]} />
    );

    expect(html).toContain('dir="rtl"');
    expect(html).toContain('text-align:right');
    expect(html).toContain('<bdi dir="ltr">clear()</bdi>');
  });
});
