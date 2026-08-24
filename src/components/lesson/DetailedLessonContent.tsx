import React from 'react';
import { marked } from 'marked';
import { DetailedContentBlock, DetailedLesson } from '../../types/content';
import { CodeBlock } from '../code/CodeBlock';

interface DetailedLessonContentProps {
  lesson: DetailedLesson;
}

function renderMarkdown(markdown: string, inline = false): string {
  const html = inline
    ? marked.parseInline(markdown) as string
    : marked.parse(markdown) as string;

  return html.replace(/<code>/g, '<code class="inline-code" dir="ltr">');
}

function ResultBlock({ block }: { block: DetailedContentBlock }) {
  const labels: Partial<Record<DetailedContentBlock['type'], string>> = {
    output: 'OUTPUT',
    'example-run': 'EXAMPLE RUN',
    'example-output': 'EXAMPLE OUTPUT',
    error: 'ERROR'
  };
  const label = labels[block.type] || 'OUTPUT';
  const resultClass = block.type === 'error' ? 'error-block' : 'output-block';

  return (
    <section
      className={`detailed-result-block ${resultClass}`}
      aria-label={label}
      dir="ltr"
    >
      <div className="detailed-result-label">{label}</div>
      <pre><code>{block.content}</code></pre>
    </section>
  );
}

function CalloutBlock({ block }: { block: DetailedContentBlock }) {
  return (
    <aside className={`detailed-callout ${block.type}`} role="note" dir="auto">
      <div className="detailed-callout-label">{block.label}</div>
      <div
        className="detailed-markdown arabic-text"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
      />
    </aside>
  );
}

export const DetailedLessonContent: React.FC<DetailedLessonContentProps> = ({ lesson }) => (
  <article className="detailed-lesson-content">
    {lesson.blocks.map(block => {
      if (block.type === 'code') {
        return (
          <CodeBlock
            key={block.id}
            code={block.content}
            language={block.language || 'python'}
          />
        );
      }

      if (['output', 'example-run', 'example-output', 'error'].includes(block.type)) {
        return <ResultBlock key={block.id} block={block} />;
      }

      if (block.type === 'heading') {
        const Tag = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4';
        return (
          <Tag
            key={block.id}
            id={block.id}
            className="detailed-heading arabic-text"
            dir="auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content, true) }}
          />
        );
      }

      if (['note', 'warning', 'comparison', 'mental-model'].includes(block.type)) {
        return <CalloutBlock key={block.id} block={block} />;
      }

      return (
        <div
          key={block.id}
          className={`detailed-markdown arabic-text ${block.type === 'rich-text' ? 'detailed-rich-text' : ''}`}
          dir="auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
        />
      );
    })}
  </article>
);
