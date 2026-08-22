import React from 'react';
import { marked } from 'marked';
import { LessonSection } from '../../types/content';
import { CodeBlock } from '../code/CodeBlock';

interface LessonContentProps {
  sections: LessonSection[];
}

function renderFormattedHtml(text: string): string {
  try {
    const rawHtml = marked.parse(text) as string;
    // Ensure all <code> tags have dir="ltr" and class="inline-code"
    return rawHtml.replace(/<code>/g, '<code class="inline-code" dir="ltr">');
  } catch {
    return text;
  }
}

export const LessonContent: React.FC<LessonContentProps> = ({ sections }) => {
  return (
    <div className="lesson-body-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {sections.map(section => {
        if (section.type === 'code') {
          return (
            <CodeBlock
              key={section.id}
              code={section.content}
              language={section.language || 'python'}
            />
          );
        }

        if (section.heading) {
          const Tag = section.level === 2 ? 'h2' : section.level === 3 ? 'h3' : 'h4';
          return (
            <div key={section.id} id={section.id} style={{ scrollMarginTop: '80px', marginTop: 'var(--space-4)' }}>
              <Tag
                dir="auto"
                className="arabic-text"
                style={{
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                {section.heading}
              </Tag>
            </div>
          );
        }

        if (section.type === 'callout') {
          return (
            <div
              key={section.id}
              className="callout-box arabic-text"
              dir="auto"
              dangerouslySetInnerHTML={{ __html: renderFormattedHtml(section.content) }}
            />
          );
        }

        if (section.type === 'list') {
          return (
            <div
              key={section.id}
              className="study-list arabic-text"
              dir="auto"
              dangerouslySetInnerHTML={{ __html: renderFormattedHtml(section.content) }}
            />
          );
        }

        // Standard text paragraph
        return (
          <div
            key={section.id}
            className="arabic-text"
            dir="auto"
            style={{
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-arabic)',
              color: 'var(--text-secondary)'
            }}
            dangerouslySetInnerHTML={{ __html: renderFormattedHtml(section.content) }}
          />
        );
      })}
    </div>
  );
};
