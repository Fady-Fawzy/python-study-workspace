import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseDetailedLesson } from '../../lib/detailedContent';
import { DetailedLessonContent } from './DetailedLessonContent';

describe('DetailedLessonContent', () => {
  it('labels interactive and environment-dependent results accessibly', () => {
    const lesson = parseDetailedLesson(`# 038 — User Input

## تجربة الإدخال

\`\`\`example-run
Your name: Ahmed
Ahmed
\`\`\`

\`\`\`example-output
/home/user/project
\`\`\`
`, '038');
    const html = renderToStaticMarkup(<DetailedLessonContent lesson={lesson} />);

    expect(html).toContain('aria-label="EXAMPLE RUN"');
    expect(html).toContain('aria-label="EXAMPLE OUTPUT"');
  });

  it('renders semantic output separately from Python code with safe bidirectional direction', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/content/detailed/020.md'),
      'utf-8'
    );
    const lesson = parseDetailedLesson(source, '020');
    const html = renderToStaticMarkup(<DetailedLessonContent lesson={lesson} />);

    expect(html).toContain('aria-label="OUTPUT"');
    expect(html).toContain('class="detailed-result-block output-block"');
    expect(html).toContain('dir="ltr"');
    expect(html).toContain('code-container');
    expect(html).toContain(lesson.toc[0].id);
  });
});
